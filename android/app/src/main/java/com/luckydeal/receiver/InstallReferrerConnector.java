package com.luckydeal.receiver;

import android.content.Context;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;
import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.luckyapp.common.bean.TokenBean;
import com.luckyapp.common.http.ApiManager;
import com.luckyapp.common.utils.LogUtil;
import com.luckyapp.common.utils.SharedPreferencesUtil;

import java.util.Map;
import java.util.WeakHashMap;

public class InstallReferrerConnector {
    private InstallReferrerClient mReferrerClient;
    private static final String TAG = "ReferConn";

    private static class SingleInstanceHolder {
        private static InstallReferrerConnector INSTANCE = new InstallReferrerConnector();
    }

    public static InstallReferrerConnector getInstance() {
        return SingleInstanceHolder.INSTANCE;
    }
    /**
     * 与谷歌商店建立连接
     */
    public void getConnect(Context context) {
        if (!SharedPreferencesUtil.get().getValue("Refer_Uploaded", false)) {
            if (mReferrerClient == null) {
                mReferrerClient = InstallReferrerClient.newBuilder(context).build();
            }
            mReferrerClient.startConnection(installReferrerStateListener);
        }

    }

    private void reConnect() {
        if (mReferrerClient != null) {
            mReferrerClient.startConnection(installReferrerStateListener);
        }
    }

    private InstallReferrerStateListener installReferrerStateListener = new InstallReferrerStateListener() {
        @Override
        public void onInstallReferrerSetupFinished(int responseCode) {
            switch (responseCode) {
                case InstallReferrerClient.InstallReferrerResponse.OK:
                    // Connection established
//                    Toast.makeText(context, "与谷歌商店连接成功", Toast.LENGTH_LONG).show();
                    LogUtil.d(TAG,"get refer ok");
                    getMessage();
                    if (mReferrerClient != null) {
                        mReferrerClient.endConnection();
                        mReferrerClient = null;
                    }
                    break;
                case InstallReferrerClient.InstallReferrerResponse.FEATURE_NOT_SUPPORTED:
                    // API not available on the current Play Store app
                    LogUtil.e(TAG,"refer api not available on the current Play Store app");
                    break;
                case InstallReferrerClient.InstallReferrerResponse.SERVICE_UNAVAILABLE:
                    // Connection could not be established
                    LogUtil.e(TAG,"Connection could not be established");
                    break;
            }
        }

        @Override
        public void onInstallReferrerServiceDisconnected() {
            // Try to restart the connection on the next request to
            // Google Play by calling the startConnection() method.
            LogUtil.d(TAG,"refer service disconnected");
            reConnect();
        }
    };

    /**
     * Google Play版本>=8.3.73时获取安装来源数据
     */

    private void getMessage() {
        try {
            if (mReferrerClient != null && mReferrerClient.isReady()) {
                ReferrerDetails response = mReferrerClient.getInstallReferrer();
                String installReferrer = response.getInstallReferrer();
                Log.d(TAG, "getMessage: " + installReferrer);
                SharedPreferencesUtil sharedPreferencesUtil = SharedPreferencesUtil.get();
                // 存储referrer供RN获取
                if(sharedPreferencesUtil.getValue("google_play_referrer_load", "").equals("")) {
                    sharedPreferencesUtil.setValue("google_play_referrer", installReferrer);
                }
                long referrerClickTimestampSeconds = response.getReferrerClickTimestampSeconds();
                installReferrer = installReferrer + "&" + "referrerClickTimestampSeconds=" + referrerClickTimestampSeconds;
                long installBeginTimestampSeconds = response.getInstallBeginTimestampSeconds();
                installReferrer = installReferrer + "&" + "installBeginTimestampSeconds=" + installBeginTimestampSeconds;
                uploadInstallReferrer(installReferrer);
            }
        } catch (Throwable e) {
            e.printStackTrace();
        }

    }

    /**
     * 上传数据到服务器
     */
    void uploadInstallReferrer(final String referer) {
        if (!TextUtils.isEmpty(referer)) {
            TokenBean tokenBean = SharedPreferencesUtil.get().getToken();
            if (tokenBean != null && !TextUtils.isEmpty(tokenBean.getToken())) {
                new Handler().postDelayed(()-> {
                    Log.i(TAG, "upload referer data:" + referer);
                    Map<String, Object> params = new WeakHashMap<>();
                    params.put("ref", referer);
                    ApiManager.get().setInstallRefer(params).onSuccess((res) -> {
                        SharedPreferencesUtil.get().setValue("Refer_Uploaded", true);
                    }).submit();

                }, 15 * 1000);
            } else {
                SharedPreferencesUtil.get().setValue("NotUploadReferer", referer);
            }
        }
    }
}
