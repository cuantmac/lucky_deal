package com.luckydeal;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.appsflyer.AppsFlyerLib;
import com.asiabill.testapp.manager.PayTask;
import com.asiabill.testapp.model.PayInfoBean;
import com.asiabill.testapp.model.PaymentUiData;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.views.imagehelper.ResourceDrawableIdHelper;
import com.facebook.share.widget.MessageDialog;
import com.facebook.share.widget.ShareDialog;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.inno.innosdk.pb.InnoMain;
import com.innotech.itfcmlib.ITApi;
import com.innotech.itfcmlib.receiver.RequestCallback;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.bean.TokenBean;
import com.luckyapp.common.http.ApiManager;
import com.luckyapp.common.report.ReportUtily;
import com.luckyapp.common.rxjava.RxUtils;
import com.luckyapp.common.utils.LogUtil;
import com.luckyapp.common.utils.SharedPreferencesUtil;
import com.luckydeal.config.Constant;
import com.luckydeal.config.PayResult;
import com.luckydeal.share.FacebookShare;
import com.luckydeal.share.MessengerShare;
import com.luckydeal.share.ShareHelp;
import com.luckydeal.share.TwitterShare;
import com.luckydeal.share.WhatsAppShare;
import com.luckydeal.update.Constants;
import com.luckydeal.update.UpdateManager;

import java.io.File;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.WeakHashMap;

import com.m7.imkfsdk.KfStartHelper;
import com.moor.imkf.IMChatManager;
import com.moor.imkf.model.entity.CardInfo;
import com.moor.imkf.model.entity.NewCardInfo;
import com.moor.imkf.model.entity.NewCardInfoAttrs;
import com.moor.imkf.requesturl.RequestUrl;
import com.moor.imkf.utils.MoorUtils;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2020/4/29
 * Desc: written for LuckyDeal project.
 */
@ReactModule(name = "AppModule")
public class AppModule extends ReactContextBaseJavaModule {
    private static final String TAG = "AppModule";
    //推送进入不同页面
    public static final String EVENT_MESSAGE_TYPE = "messageType";
    public static final String EVENT_PAYRESULT_TYPE = "payResultType";
    private Gson gson = new Gson();
    private ReactApplicationContext mContext;

    public static boolean antiSpamStarted = false;
    public static boolean waitingAntiSpam = false;

    private Promise hideSplashPromise;

    @NonNull
    @Override
    public String getName() {
        return "AppModule";
    }

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public AppModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;

    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("devMode", BuildConfig.DEV_MODE);
        constants.put("versionCode", BuildConfig.VERSION_CODE);
        constants.put("versionName", BuildConfig.VERSION_NAME);
        constants.put("buildId", BuildConfig.BUILD_ID);
        constants.put("updateServerUrl", Constants.SERVER_URL);
        return constants;
    }

    @ReactMethod
    public void hideSplash(Promise promise) {
        hideSplashPromise = promise;
        if (antiSpamStarted) {
            Log.d("AppModule", "反作弊已启动");
            waitingAntiSpam = false;
            hideSplash();
        } else {
            Log.d("AppModule", "反作弊未启动");
            waitingAntiSpam = true;
        }
    }

    public void hideSplash() {
        Log.d("AppModule", "隐藏启动页");
        MainActivity activity = (MainActivity) mContext.getCurrentActivity();
        if (activity != null && !activity.isFinishing()) {
            activity.hideSplash();
        }
        if (hideSplashPromise != null) {
            hideSplashPromise.resolve(true);
        }
    }


    @ReactMethod
    public void getDeviceInfo(Promise promise) {
        WritableNativeMap map = new WritableNativeMap();
        map.putString("tk", InnoMain.loadInfo(GlobalApp.get()));
        map.putString("device_id", InnoMain.getluid(GlobalApp.get()));
        map.putString("advertising_id", SharedPreferencesUtil.get().getValue("google_adid", ""));
        map.putString("appsflyer_id", AppsFlyerLib.getInstance().getAppsFlyerUID(GlobalApp.get()));
        map.putString("android_version", String.valueOf(Build.VERSION.SDK_INT));
        promise.resolve(map);
    }

    @ReactMethod
    public void report(String category, String event, ReadableMap map) {
        WeakHashMap<String, String> hashMap = new WeakHashMap<>();
        HashMap<String, Object> rawMap = map.toHashMap();
        for (String key : rawMap.keySet()) {
            hashMap.put(key, String.valueOf(rawMap.get(key)));
        }
        ReportUtily.sendCustomEvent(category, event, hashMap);
    }

    @ReactMethod
    public void register(String token, String user_id) {
        if (!TextUtils.isEmpty(token)) {
            ReportUtily.setRegister(user_id);
            ReportUtily.setUserId(user_id);
//                        sendThirdPartyEvent("sign_up");
            //登录再次上传
            Map<String, Object> map = new HashMap<>();
            map.put("action", "login");
            map.put("member_id", user_id);
            InnoMain.changeValueMap(map);

            TokenBean tokenBean = new TokenBean();
            tokenBean.setToken(token);
            tokenBean.setUser_id(user_id);
            SharedPreferencesUtil.get().setToken(gson.toJson(tokenBean));
            String referer = SharedPreferencesUtil.get().getValue("NotUploadReferer", null);
            if (!TextUtils.isEmpty(referer)) {
                Log.i(TAG, "upload referer data:" + referer);
                Map<String, Object> refParams = new WeakHashMap<>();
                refParams.put("ref", referer);
                ApiManager.get().setInstallRefer(refParams).onSuccess((res) -> {
                    SharedPreferencesUtil.get().setValue("Refer_Uploaded", true);
                    SharedPreferencesUtil.get().setValue("NotUploadReferer", null);
                }).submit();
            }
            ITApi.setAlias(GlobalApp.get(), tokenBean.getUser_id(), new RequestCallback() {
                @Override
                public void onSuccess(String msg) {
                    LogUtil.d("ITApi.setAlias success");
                }

                @Override
                public void onFail(String msg) {
                    LogUtil.d("ITApi.setAlias failed: " + msg);
                }
            });
        }
    }

    @ReactMethod
    public void fetch(String method, String url, @Nullable String body, @Nullable Callback callback) {
        if (method.equals("GET")) {
            HashMap<String, Object> map = new HashMap<>();
            if (!TextUtils.isEmpty(body)) {
                map = gson.fromJson(body, new TypeToken<HashMap<String, Object>>() {
                }.getType());
            }
            ApiManager.get().get(url, map)
                    .onSuccess(res -> {
                        if (callback != null) {
                            callback.invoke(res);
                        }
                    })
                    .onError(e -> {
                        if (callback != null) {
                            try {
                                callback.invoke(gson.toJson(e));
                            } catch (Exception ex) {
                                ex.printStackTrace();
                            }
                        }
                    })
                    .submit();
        } else {
            HashMap<String, Object> map = new HashMap<>();
            LogUtil.d(TAG, "data =" + body);
            if (!TextUtils.isEmpty(body)) {
                map = gson.fromJson(body, new TypeToken<HashMap<String, Object>>() {
                }.getType());
            }
            ApiManager.get().post(url, map)
                    .onSuccess(res -> {
                        if (callback != null) {
                            callback.invoke(res);
                        }
                    })
                    .onError(e -> {
                        if (callback != null) {
                            try {
                                callback.invoke(gson.toJson(e));
                            } catch (Exception ex) {
                                ex.printStackTrace();
                            }
                        }
                    })
                    .submit();
        }
    }

    /**
     * 通知权限申请
     */
    @ReactMethod
    public void requestNotify() {
        Intent localIntent = new Intent();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            localIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            localIntent.setAction(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            localIntent.putExtra(Settings.EXTRA_APP_PACKAGE, mContext.getPackageName());
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            localIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            localIntent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
            localIntent.putExtra("app_package", mContext.getPackageName());
            localIntent.putExtra("app_uid", mContext.getApplicationInfo().uid);
        } else {
            localIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            localIntent.setAction("android.settings.APPLICATION_DETAILS_SETTINGS");
            localIntent.setData(Uri.fromParts("package", mContext.getPackageName(), null));
        }
        try {
            mContext.startActivity(localIntent);
        } catch (Throwable throwable) {
            LogUtil.d(TAG, "data" + throwable.getMessage());
        }

    }


    /**
     * 分享
     */
    @ReactMethod
    public void showPop(String typeStr, String title, String note, String url, String platformStr) {
        MainActivity activity = (MainActivity) mContext.getCurrentActivity();
        if (activity != null && !activity.isFinishing()) {
            int platform = 1;
            int type = 1;
            try {
                platform = Integer.valueOf(platformStr);
                type = Integer.valueOf(typeStr);
            } catch (Exception exception) {

            }
            sharing(activity, platform, type, title, note, url);
        }
    }


    public boolean sharing(Activity activity, int platform, int type, String title, String note, String url) {
        boolean result = false;
        WeakHashMap<String, String> data = new WeakHashMap<>();
        ShareDialog shareDialog;
        switch (platform) {
            case ShareHelp.SHARE_FACEBOOK:
                shareDialog = new ShareDialog(activity);
                FacebookShare facebookShare = new FacebookShare();
                result = facebookShare.shareImage(shareDialog, "", url, title, type);
                data.put("way", "0");
//                ReportUtily.sendThirdPartyEvent("share_fb");
                break;
            case ShareHelp.SHARE_TWITTER:
                TwitterShare twitterShare = new TwitterShare();
                result = twitterShare.shareImg(activity, title + note, url, note, "", type);
                data.put("way", "1");
//                ReportUtily.sendThirdPartyEvent("share_twitter");
                break;
            case ShareHelp.SHARE_WHATSAPP:
                WhatsAppShare whatsAppShare = new WhatsAppShare();
                result = whatsAppShare.shareImg(activity, title + "\t" + note + "\t" + url, title + "\t" + note + "\t" + url, "", type);
                data.put("way", "2");
//                ReportUtily.sendThirdPartyEvent("share_whatsapp");
                break;
            case ShareHelp.SHARE_MESSENGER:
                MessageDialog messageDialog = new MessageDialog(activity);
                MessengerShare messengerShare = new MessengerShare();
                result = messengerShare.shareImg(messageDialog, activity, title, url, note, "");
                data.put("way", "4");
//                ReportUtily.sendThirdPartyEvent("share_messenger");
                break;
            case ShareHelp.SHARE_SYSTEM:
                Intent textIntent = new Intent(Intent.ACTION_SEND);
                textIntent.setType("text/plain");
                textIntent.putExtra(Intent.EXTRA_TEXT, url);
                activity.startActivity(Intent.createChooser(textIntent, "share"));
                result = true;
                data.put("way", "3");
//                ReportUtily.sendThirdPartyEvent("share_system");
                break;

            default:
                break;
        }
        return result;
    }

    @ReactMethod
    public void addToCalendar(double beginTimeInSec, double endTimeInSec, String title, String desc, Promise promise) {
        MainActivity activity = (MainActivity) mContext.getCurrentActivity();
        if (activity == null) return;
        activity.addToCalendar(beginTimeInSec, endTimeInSec, title, desc, promise);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isResourceExist(String source) {
        return ResourceDrawableIdHelper.getInstance().getResourceDrawableId(mContext, source) > 0;
    }

    @ReactMethod
    public void checkUpdate(Promise promise) {
        UpdateManager.get().checkUpdate(promise);
    }

    @ReactMethod
    public void installBundle() {
        MainApplication application = (MainApplication) mContext.getApplicationContext();
        UpdateManager.get().installBundle(application.getReactNativeHost().getReactInstanceManager());
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public int getActiveBundleVersion() {
        return UpdateManager.get().getActiveBundleVersion();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getTargetItemId() {
        String id = SharedPreferencesUtil.get().getValue("fb_target_item", "");
        LogUtil.d("deeplink: itemid:" + id);
        return id;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getTargetItemType() {
        String type = SharedPreferencesUtil.get().getValue("fb_target_type", "");
        LogUtil.d("deeplink: itemtype:" + type);
        return type;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getGooglePlayReferrer() {
        String referrer = SharedPreferencesUtil.get().getValue("google_play_referrer", "");
        SharedPreferencesUtil.get().setValue("google_play_referrer_load", "load");
        SharedPreferencesUtil.get().setValue("google_play_referrer", "");
        LogUtil.d("google_play_referrer:" + referrer);
        return referrer;
    }

    @ReactMethod
    public void openPayPalUrl(String url, ReadableMap addressMap) {
        Intent intent = new Intent(GlobalApp.get(), PaypalWebViewActivity.class);
        HashMap<String, Object> rawMap = addressMap.toHashMap();
        Bundle bundleAddress = new Bundle();
        for (String key : rawMap.keySet()) {
            LogUtil.d(key + ":" + String.valueOf(rawMap.get(key)));
            bundleAddress.putString(key, String.valueOf(rawMap.get(key)));
        }
        intent.putExtra("address", bundleAddress);
        intent.putExtra("url", url);
        getCurrentActivity().startActivity(intent);
    }

    @ReactMethod
    public void openYFKChat(String nickName, String clientId, String imgUrl, String title, String subTitle, String price, String orderId) {
        //RequestUrl.setRequestBasic(RequestUrl.Tencent_REQUEST);
        RequestUrl.setRequestUrl(9939, "sean-sdk.7moor.com", "https://sean-wechat.7moor.com:9916/sdkChat"
                , "https://sean-wechat.7moor.com:9916/sdkChat", "ws");
        RequestUrl.setFileUrl("https://sean-fs.7moor.com:8001/", new String[]{"sean-fs.7moor.com:8001"}, true);
        final KfStartHelper helper = new KfStartHelper(Objects.requireNonNull(getCurrentActivity()));
        if (!TextUtils.isEmpty(imgUrl) && !TextUtils.isEmpty(title)) {
            CardInfo ci = new CardInfo(imgUrl,
                    title,
                    subTitle,
                    price,
                    "");
            helper.setCard(ci);
            try {
                JSONObject j1 = new JSONObject();
                j1.put("orderId", orderId);
                j1.put("userId", clientId);
                //将j1 添加到JSONObject j2中，注意 j2段代码必须是如下配置。
                //不可修改与增加j2 中的key value。直接复制即可。
                JSONObject j2 = new JSONObject();
                j2.put("customField", URLEncoder.encode(j1.toString()));
                helper.setCustomerJSON(j2.toString());
            } catch (JSONException e) {
                //Log.e("error", e.getMessage());
            }
        } else {
            helper.setCustomerJSON(null);
        }
        helper.initSdkChat("60b7b080-a3f8-11eb-8fb9-775a449db377", nickName, clientId);
    }

    @ReactMethod
    public void unreadMsgCount(Promise promise) {
        RequestUrl.setRequestBasic(RequestUrl.Tencent_REQUEST);
        //首先判断是否在此之前初始化过sdk,获取消息参数需userid等参数
        if (getCurrentActivity() != null && MoorUtils.isInitForUnread(getCurrentActivity())) {
            IMChatManager.getInstance().getMsgUnReadCountFromService(promise::resolve);
        } else {
            //未初始化，消息当然为 ：0
            promise.resolve(0);
        }
    }

    @ReactMethod
    public void aisaBillPay(ReadableMap payInfo,  Callback callBack) {
        Activity activity = getCurrentActivity();
        if (activity == null) return;
        String merNo = payInfo.getString("merNo");
        String gatewayNo = payInfo.getString("gatewayNo");
        String orderNo = payInfo.getString("orderNo");
        String orderCurrency = payInfo.getString("orderCurrency");
        String orderAmount = payInfo.getString("orderAmount");
        String paymentMethod = payInfo.getString("paymentMethod");
        String firstName = payInfo.getString("firstName");
        String lastName = payInfo.getString("lastName");
        String email = payInfo.getString("email");
        String phone = payInfo.getString("phone");
        String country = payInfo.getString("country");
        String state = payInfo.getString("state");
        String city = payInfo.getString("city");
        String address = payInfo.getString("address");
        String callbackUrl = payInfo.getString("callbackUrl");
        String zip = payInfo.getString("zip");
        String isMobile = payInfo.getString("isMobile");
        String TokenPayType = payInfo.getString("TokenPayType");
        String signKey = payInfo.getString("signKey");
        String CardType = payInfo.getString("CardType");

        PaymentUiData paymentUiData = new PaymentUiData();
        paymentUiData.setBackResource(R.mipmap.ic_browser_back);
        paymentUiData.setTextColor(Color.parseColor("#000000"));
        paymentUiData.setTextSize(18.0f);
        paymentUiData.setToolbarBackgroundColor(Color.parseColor("#ffffff"));
        PayInfoBean payInfoBean = new PayInfoBean(firstName, lastName,
                email, phone, country,
                state, city, address, zip);

        payInfoBean.setPaymentUiData(paymentUiData);
        payInfoBean.setMerNo(merNo);
        payInfoBean.setGatewayNo(gatewayNo);
        payInfoBean.setSignkey(signKey);
        payInfoBean.setOrderNo(orderNo);
        payInfoBean.setOrderAmount(orderAmount);
        payInfoBean.setOrderCurrency(orderCurrency);
        payInfoBean.setCardType(CardType);
        payInfoBean.setPaymentMethod(paymentMethod);
        payInfoBean.setIsMobile(isMobile);
        payInfoBean.setTokenPayType(TokenPayType);
        payInfoBean.setCallbackUrl(callbackUrl);
        //0 测试环境 1 fz环境 2 线上生产环境（默认）
        payInfoBean.setPaymentsEnvironment(BuildConfig.DEV_MODE?0:2);
        RxUtils.run(() -> {
            PayTask payTask = new PayTask(activity);
            String result = payTask.pay(payInfoBean);
            RxUtils.post(() -> {
                PayResult payResult = new PayResult(result);
                LogUtil.e("payResult", result);
                String code = payResult.getCode();
                if (TextUtils.equals(code, "9900")) {
                    Toast.makeText(activity, R.string.asiabill_buy_item_successs,
                            Toast.LENGTH_SHORT).show();
                    callBack.invoke(true);
                } else {
                    callBack.invoke(false);
                    if (TextUtils.equals(code, "7700")) {
                        Toast.makeText(activity, R.string.asiabill_buy_item_fail,
                                Toast.LENGTH_SHORT).show();
                    } else if (TextUtils.equals(code, "6600")) {
                        Toast.makeText(activity, R.string.asiabill_buy_item_pending,
                                Toast.LENGTH_SHORT).show();
                    }
                }
            });
        });
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isLogEnabled() {
        return new File("/sdcard/xxluckytestmodexx").exists() || BuildConfig.DEV_MODE || BuildConfig.DEBUG;
    }
}
