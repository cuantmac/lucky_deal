package com.luckyapp.common;

import android.app.Application;
import android.os.Handler;
import android.os.Looper;

public class GlobalApp {
    private static Application sApplication;
    private static Handler sHandler = new Handler(Looper.getMainLooper());
    public static Application get() {
        return sApplication;
    }

    public static void set(Application app) {
        sApplication = app;
    }

    public static Handler getHandelr() {
        return sHandler;
    }
}
