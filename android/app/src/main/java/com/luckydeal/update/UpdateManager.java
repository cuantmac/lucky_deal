package com.luckydeal.update;

import android.text.TextUtils;
import androidx.annotation.Nullable;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.inno.innosdk.pb.InnoMain;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.http.ApiManager;
import com.luckyapp.common.report.ReportUtily;
import com.luckyapp.common.rxjava.RxUtils;
import com.luckyapp.common.utils.IOUtils;
import com.luckyapp.common.utils.LogUtil;
import com.luckyapp.common.utils.SharedPreferencesUtil;
import com.luckydeal.BuildConfig;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.WeakHashMap;

import okhttp3.ResponseBody;
import retrofit2.Response;

/**
 * RN热更新
 * JS Bundle从Amazon cdn下载安装，图片资源本地已有的优先使用本地，本地不存在的在线加载
 * 图片资源加载相关代码见index.js
 */
public class UpdateManager {
    public long startDownLoadTime = 0;

    private ReactInstanceManager instanceManager;

    public ReactInstanceManager getInstanceManager() {
        return instanceManager;
    }

    public void setInstanceManager(ReactInstanceManager instanceManager) {
        this.instanceManager = instanceManager;
    }

    private UpdateManager() {
    }

    private static class SingletonHolder {
        private static final UpdateManager sInstance = new UpdateManager();
    }

    public static UpdateManager get() {
        return SingletonHolder.sInstance;
    }

    //true: bundle下载成功但未安装
    public boolean needInstallBundle = false;

    //activeBundleVersion 当前正在使用的版本
    //installedBundleVersion当前已安装的版本，可能正在使用，也可能下次启动时激活
    private int activeBundleVersion = SharedPreferencesUtil.get().getValue("installedBundleVersion", BuildConfig.BUNDLE_CODE);

    //    private boolean isTimeOut = false;
//    public void setTimeOut(boolean timeOut) {
//        isTimeOut = timeOut;
//    }
    public boolean updated = false;

    //正式环境只检查更新并下载，下次启动时安装
    public void checkUpdate() {
        checkUpdate(null);
    }

    //测试环境直接弹窗升级
    public void checkAndInstall(ReactInstanceManager instanceManager) {
//        if (!BuildConfig.DEV_MODE || BuildConfig.DEBUG) {
//            return;
//        }
        RxUtils.run(() -> {
            try {
                checkUpdateInBackground();
            } catch (IOException | JSONException | NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
            RxUtils.post(() -> {
                if (needInstallBundle) {
                    ReactContext context = instanceManager.getCurrentReactContext();
                    if (context == null) {
                        return;
                    }
                    installBundle(instanceManager);
//                    Activity activity = context.getCurrentActivity();
//                    LogUtil.d("UpdateManager", "测试环境安装更新", activity != null);
//                    if (activity != null) {
//                        new AlertDialog.Builder(activity)
//                                .setTitle("热更新升级")
//                                .setMessage("测试环境弹窗升级")
//                                .setPositiveButton("升级", (dialog, which) -> {
//                                    installBundle(instanceManager);
//                                })
//                                .show();
//                    }
                }
            });
        });
    }

    //RN调用检查更新接口，有更新返回true
    public void checkUpdate(@Nullable Promise promise) {
        if (needInstallBundle) {
            if (promise != null) {
                promise.resolve(true);
            }
            return;
        }
        RxUtils.run(() -> {
            try {
                checkUpdateInBackground();
            } catch (IOException | JSONException | NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
            if (promise != null) {
                promise.resolve(needInstallBundle);
            }
        });
    }

    //安装更新
    public boolean installBundle(ReactInstanceManager instanceManager) {
        if (needInstallBundle) {
            ReactBundleLoader bundleLoader = new ReactBundleLoader(instanceManager);
            bundleLoader.installBundle();
            needInstallBundle = false;
            activeBundleVersion = SharedPreferencesUtil.get().getValue("installedBundleVersion", BuildConfig.BUNDLE_CODE);
            LogUtil.d("UpdateManager", "安装bundle成功");
            updated = true;
            return true;
        }

        return false;
    }

    public int getActiveBundleVersion() {
        return activeBundleVersion;
    }

    public int getInstalledBundleVersion() {
        return SharedPreferencesUtil.get().getValue("installedBundleVersion", BuildConfig.BUNDLE_CODE);
    }

    //检查更新
    private void checkUpdateInBackground() throws IOException, JSONException, NoSuchAlgorithmException {
        startDownLoadTime = System.currentTimeMillis();
        Response<ResponseBody> meta = ApiManager.get().download(Constants.SERVER_URL + Constants.METADATA).execute();
        ResponseBody body = meta.body();
        if (body == null) return;
        String metaStr = body.string();
        LogUtil.d("UpdateManager", "meta下载成功：", metaStr);
        JSONObject jsonObject = new JSONObject(metaStr);
        JSONArray bundles = jsonObject.optJSONArray("bundles");
        if (bundles == null) return;
        for (int i = 0; i < bundles.length(); i++) {
            JSONObject bundle = bundles.optJSONObject(i);
            if (bundle == null) continue;
            int version = bundle.optInt("version");
            int minAppVersion = bundle.optInt("min_app_version"); //更新apk,基于apk最小版本号才能热更。
            int maxAppVersion = bundle.optInt("max_app_version");
            String name = bundle.optString("name");
            String md5 = bundle.optString("md5");
            int percent = bundle.optInt("percent", -1);
            //检查bundle版本号和App版本号
            if (activeBundleVersion >= version || BuildConfig.VERSION_CODE < minAppVersion || BuildConfig.VERSION_CODE > maxAppVersion) {
                LogUtil.d("UpdateManager", "no need UpdateManager");
                updated = true;
                continue;
            }
            //percent大于0时灰度发布
            if (percent >= 0) {
                String tk = InnoMain.loadInfo(GlobalApp.get());
                int hash = Math.abs(tk.hashCode() % 100);
                LogUtil.d("UpdateManager", "tk=" + tk + " hash=" + hash + " percent=" + percent);
                if (percent <= hash) {
                    updated = true;
                    continue;
                }
            }
            if (TextUtils.isEmpty(name)) continue;
            downloadAndVerifyInBackground(Constants.SERVER_URL + name, md5, version);
            break;
        }
    }

    //下载bundle
    private void downloadAndVerifyInBackground(String url, String md5, int version) throws IOException, NoSuchAlgorithmException {
        LogUtil.d("UpdateManager", "下载bundle：", url);
        Response<ResponseBody> bundleZip = ApiManager.get().download(url).execute();
        if(!bundleZip.isSuccessful()) {  //下载失败
            LogUtil.d("UpdateManager", "下载bundle失败");
            WeakHashMap<String, String> map = new WeakHashMap<>();
            map.put("UpdateState", "1");
            map.put("type", "close");
            ReportUtily.sendCustomEvent("1", "3", map);
            return;
        }
        ResponseBody body = bundleZip.body();
        if (body == null) return;
        File file = GlobalApp.get().getFileStreamPath(Constants.UPDATE_DIR);
        if (!file.exists()) {
            file.mkdir();
        }
        byte[] bytes = body.bytes();
        //md5不为空时校验
        if (!TextUtils.isEmpty(md5)) {
            String HEX = "0123456789ABCDEF";
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(bytes, 0, bytes.length);
            byte[] digest = md.digest();
            StringBuilder result = new StringBuilder(2 * digest.length);
            for (byte b : digest) {
                result.append(HEX.charAt((b >> 4) & 0x0f)).append(HEX.charAt(b & 0x0f));
            }
            String zipMd5 = result.toString();
            LogUtil.d("UpdateManager", "bundle md5", zipMd5);
            if (!md5.equalsIgnoreCase(zipMd5)) {
                return;
            }
        }
        IOUtils.unzip(bytes, file);
        LogUtil.d("UpdateManager", "下载bundle成功");
        if(startDownLoadTime != 0) {
            long diff = (System.currentTimeMillis() - startDownLoadTime) / 1000;
            WeakHashMap<String, String> map = new WeakHashMap<>();
            map.put("UpdateState", "0");
            map.put("UpdateTime", diff + "");
            ReportUtily.sendCustomEvent("UpdatePage", "UpdatePage_pv", map);
        }
        needInstallBundle = true;
        SharedPreferencesUtil.get().setValue("installedBundleVersion", version);
    }

}
