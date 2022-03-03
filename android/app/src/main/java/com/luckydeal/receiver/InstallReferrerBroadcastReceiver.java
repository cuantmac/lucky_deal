package com.luckydeal.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.luckyapp.common.utils.SharedPreferencesUtil;

import org.json.JSONObject;


/**
 * 监听Google play下载安装来源的广播
 */

public class InstallReferrerBroadcastReceiver extends BroadcastReceiver {
    private static final String TAG = "ReferRecv";
    private Context context;
    private Intent intent;

    @Override
    public void onReceive(Context context, Intent intent) {
        int appVersionCode = getAppVersionCode(context);
        this.context = context;
        this.intent = intent;
        if (appVersionCode < 80837300) {
            getInstallReferrerData();
        } else {
            InstallReferrerConnector.getInstance().getConnect(context);
        }
    }

    /**
     * Google Play版本<8.3.73时获取安装来源数据
     */
    private void getInstallReferrerData() {
        Bundle extras = intent.getExtras();
        String referrer = "";
        if (extras != null) {
            referrer = extras.getString("referrer");
            SharedPreferencesUtil sharedPreferencesUtil = SharedPreferencesUtil.get();
            // 存储referrer供RN获取
            if(sharedPreferencesUtil.getValue("google_play_referrer_load", "").equals("")) {
                sharedPreferencesUtil.setValue("google_play_referrer", referrer);
            }
            // 格式：utm_source=testSource&utm_medium=testMedium&utm_term=testTerm&utm_content=11
            InstallReferrerConnector.getInstance().uploadInstallReferrer(referrer);
        }
        //new CampaignTrackingReceiver().onReceive(context, intent);//调用谷歌广播的方法
    }


    /**
     * 获取版本号
     *
     * @return Google Play应用的版本号
     */
    public static int getAppVersionCode(Context context) {
        try {
            PackageManager manager = context.getPackageManager();
            PackageInfo info = manager.getPackageInfo("com.android.vending", 0);
            int version = info.versionCode;
            return version;
        } catch (Throwable e) {
            e.printStackTrace();
            return -1;
        }
    }



    private String getUtmMedium(String referer) {
        String medium = "";
        if (TextUtils.isEmpty(referer))
            return medium;

        int pos = referer.indexOf("utm_medium=");
        if (pos != -1) {
            int andpos = referer.indexOf('&', pos);
            if (andpos != -1) {
                medium = referer.substring(pos + "utm_medium=".length(), andpos);
            } else {
                medium = referer.substring(pos + "utm_medium=".length());
            }
        }

        return medium;

    }


    /**
     * 把格式：utm_source=testSource&utm_medium=testMedium&utm_term=testTerm&utm_content=11
     * 这种格式的数据切割成key,value的形式并put进JSONObject对象，用于上传
     *
     * @param referer
     * @return
     */
    private JSONObject getSplitData(String referer) {
        JSONObject object = new JSONObject();
        for (String data : referer.split("&")) {
            String[] split = data.split("=");
            for (int i = 0; i < split.length; i++) {
                try {
                    object.put(split[0], split[1]);
                } catch (Throwable e) {
                    e.printStackTrace();
                }
            }
        }
        return object;
    }

}
