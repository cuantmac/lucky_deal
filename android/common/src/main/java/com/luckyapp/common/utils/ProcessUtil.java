package com.luckyapp.common.utils;

import android.app.ActivityManager;
import android.content.Context;

/**
 * Created by Wang on 2018/1/24.
 */

public class ProcessUtil {

    /**
     * 包名判断是否为主进程
     *
     * @param
     * @return
     */
    public static boolean isMainProcess(Context context) {
        return context.getPackageName().equals(getCurrentProcessName(context));
    }


    /**
     * 获取当前进程名
     */
    static public String getCurrentProcessName(Context context) {
        int pid = android.os.Process.myPid();
        String processName = "";
        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningAppProcessInfo process : manager.getRunningAppProcesses()) {
            if (process.pid == pid) {
                processName = process.processName;
            }
        }
        LogUtil.d("process name:"+processName);
        return processName;
    }
}
