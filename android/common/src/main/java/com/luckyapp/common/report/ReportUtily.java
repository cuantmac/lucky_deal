package com.luckyapp.common.report;

import android.app.Activity;
import android.util.Log;

import androidx.fragment.app.Fragment;

import com.appsflyer.AppsFlyerLib;
import com.google.firebase.analytics.FirebaseAnalytics;
import com.inno.innocommon.pb.InnoCommon;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.utils.LogUtil;
import com.tencent.bugly.crashreport.CrashReport;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.WeakHashMap;

/**
 * Created by wang on 2019/3/13.
 */

public class ReportUtily {

    /**
     * 设置userId
     */
    public static void setUserId(String userId) {
        InnoCommon.setUserId(userId);
    }

    /**
     * 设置登录，登出事件
     *
     * @param userId type:1登录  0：登出
     */
    public static void setLogin(int type, String userId) {
        if (type == 0) {
            InnoCommon.logout();
        } else {
            InnoCommon.login(userId);
        }
    }


    /**
     * 设置注册
     *
     * @param userId
     */
    public static void setRegister(String userId) {
        InnoCommon.register(userId);
    }

    /**
     * 页面追踪
     *
     * @param activity
     * @param view_key
     */
    public static void trackPage(Activity activity, String view_key) {
        Log.e("trackPage", view_key);
        InnoCommon.trackPage(activity, view_key);
        CrashReport.putUserData(GlobalApp.get(), "trackPage", view_key);
    }

    /**
     * 页面追踪(Fragment)
     *
     * @param fragment
     * @param view_key
     */
//    public static void trackFragment(Fragment fragment, String view_key) {
//        InnoCommon.trackFragmentPage(fragment, view_key);
//    }

    /**
     * 页面追踪(Fragment Resume)
     *
     * @param fragment
     */
    public static void onFragmentResume(Fragment fragment) {
        InnoCommon.onFragmentResume(fragment);
        CrashReport.putUserData(GlobalApp.get(), "trackPage", fragment.getClass().getSimpleName());
    }

    /**
     * 页面追踪(Fragment Pause)
     *
     * @param fragment
     */
    public static void onFragmentPause(Fragment fragment) {
        InnoCommon.onFragmentPause(fragment);
    }

    /**
     * 自定义事件
     *
     * @param pageView   page name event occurs
     * @param pageAction event name
     */
    public static void sendCustomEvent(String pageView, String pageAction) {
        InnoCommon.customEvent(pageView, pageAction, null);
        CrashReport.putUserData(GlobalApp.get(), "customEvent", pageAction);
    }

    public static void sendAction(String action) {
        InnoCommon.customEvent("", action, null);
        CrashReport.putUserData(GlobalApp.get(), "customEvent", action);
    }

    /**
     * 自定义事件
     *
     * @param
     */
    public static void sendCustomEvent(String category, String event, WeakHashMap<String, String> data) {
        InnoCommon.customEvent(category, event, data);
        LogUtil.d("InnoReport", category, event, data);
        CrashReport.putUserData(GlobalApp.get(), "customEvent", category + "/" + event);
    }

    public static void sendCustomEvent(String event, WeakHashMap<String, String> data) {
        InnoCommon.customEvent("", event, data);
        CrashReport.putUserData(GlobalApp.get(), "customEvent", event);
    }

    public static void sendCustomEventWithValue(String pageAction, String value) {
        //为了兼容之前的服务端字段名，保留pa字段, 将来可以删除
        HashMap<String, String> data = new HashMap<>();
        data.put("value", value);
        InnoCommon.customEvent("", pageAction, data);
        CrashReport.putUserData(GlobalApp.get(), "customEvent", pageAction);
    }

    /**
     * 自定义事件
     *
     * @param
     */
    public static void sendCustomEvent(String pageAction) {
        InnoCommon.customEvent("", pageAction, null);
        CrashReport.putUserData(GlobalApp.get(), "customEvent", pageAction);
    }

    public static void sendEventWay(String pageAction, String way) {
        WeakHashMap<String, String> params = new WeakHashMap<>();
        params.put("way", way);
        sendCustomEvent(pageAction, params);
    }

    public static void sendCustomEventLog(String event, WeakHashMap<String, String> params) {
        String stingvalue = event + "   ";
        if (params != null) {
            Set set = params.keySet(); //key装到set中
            Iterator it = set.iterator(); //返回set的迭代器 装的key值
            while (it.hasNext()) {
                String key = (String) it.next();
                String value = (String) params.get(key);
                stingvalue = stingvalue + key + ":" + value + "    ";
            }
        }
        LogUtil.d("ReportUtily", stingvalue);
        InnoCommon.customEvent("", event, params);
        CrashReport.putUserData(GlobalApp.get(), "customEvent", event);
    }

    public static void reportAppUseDuration(long duration) {
        LogUtil.d("app_use_duration:" + duration);
        WeakHashMap<String, String> params = new WeakHashMap<>();
        params.put("value", String.valueOf(duration));
        ReportUtily.sendCustomEvent("ga_app_use_duration", params);
    }

    public static void sendThirdPartyEvent(String event) {
        LogUtil.d("thirdPartyEvent:" + event);
        AppsFlyerLib.getInstance().trackEvent(GlobalApp.get(), event, null);
        FirebaseAnalytics.getInstance(GlobalApp.get()).logEvent(event, null);
    }


    public static void sendStartAppType(int type) {
        WeakHashMap<String, String> data = new WeakHashMap<>();
        data.put("OpenType", type + "");
        data.put("type", "show");
        ReportUtily.sendCustomEvent("1", "1", data);
    }

    public static void sendShowEvent(String module, String eventNo) {
        WeakHashMap<String, String> data = new WeakHashMap<>();
        data.put("type", "show");
        ReportUtily.sendCustomEvent(module, eventNo, data);
    }
}
