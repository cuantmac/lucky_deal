package com.luckydeal.notification;

import android.content.Context;
import android.content.Intent;
import android.os.Message;

import com.google.gson.Gson;
import com.innotech.itfcmlib.ITApi;
import com.innotech.itfcmlib.bean.ITMessage;
import com.innotech.itfcmlib.receiver.PushReceiver;
import com.innotech.itfcmlib.receiver.RequestCallback;
import com.luckyapp.common.bean.TokenBean;
import com.luckyapp.common.report.ReportUtily;
import com.luckyapp.common.utils.Foreground;
import com.luckyapp.common.utils.LogUtil;
import com.luckyapp.common.utils.SharedPreferencesUtil;
import com.luckydeal.MainActivity;
import com.luckydeal.SplashActivity;

import org.greenrobot.eventbus.EventBus;
import java.util.WeakHashMap;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2019-07-15
 * Desc: written for luckyday project.
 */
public class FCMReceiver extends PushReceiver {
    public static final int WHAT_FCM_EXTRA = 0;
    public static final String TAG = "FCMReceiver";

    @Override
    public void onReceiveGuid(Context context, String s) {
        LogUtil.d(TAG, "onReceiveGuid", s);

        TokenBean tokenBean = SharedPreferencesUtil.get().getToken();
        if (tokenBean == null) return;

        ITApi.setAlias(context, tokenBean.getUser_id(), new RequestCallback() {
            @Override
            public void onSuccess(String msg) {
                ReportUtily.sendCustomEvent("pushbar", "ld_push_register_success");
                LogUtil.d("ITApi.setAlias success");
            }

            @Override
            public void onFail(String msg) {
                ReportUtily.sendCustomEvent("pushbar", "ld_push_register_fail");
                LogUtil.d("ITApi.setAlias failed: " + msg);
            }
        });
    }

    @Override
    public void onMessageClicked(Context context, ITMessage message) {
        WeakHashMap<String, String> params = new WeakHashMap<>();
        params.put("way", message.getBody());
        ReportUtily.sendCustomEvent("pushbar","ld_push_click", params);
        LogUtil.d(TAG,"data=onMessageClicked");
        if (Foreground.get().isBackground()) {
            Intent intent = new Intent(context, SplashActivity.class);
            LogUtil.d(TAG,"data =" +message.getExtra() +  "body"+ message.getBody());
            intent.putExtra(MainActivity.KEY_EXTRA, message.getExtra());
            intent.putExtra("FromNotification", 0);
            intent.putExtra("clickAction", "ga_fcm_push_click");
            intent.putExtra("notificationText", message.getBody());
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
            context.startActivity(intent);
        } else {
            Message msg = new Message();
            msg.what = WHAT_FCM_EXTRA;
            msg.obj = message.getExtra();
            EventBus.getDefault().post(msg);
        }
    }

    @Override
    public void onMessageReceived(Context context, ITMessage message) {
        WeakHashMap<String, String> params = new WeakHashMap<>();
        params.put("way", message.getBody());
        ReportUtily.sendCustomEvent("pushbar","ld_push_success", params);
        LogUtil.d(TAG,"data=onMessageReceived");
        //LogUtil.d(TAG, "receive json=" + new Gson().toJson(message));
        SharedPreferencesUtil.get().setValue("FCM_RECEIVE_TIME", System.currentTimeMillis());
    }
}
