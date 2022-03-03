package com.luckyapp.common.utils;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import com.luckyapp.common.report.ReportUtily;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

public class Foreground implements Application.ActivityLifecycleCallbacks {

    public static final long CHECK_DELAY = 500;
    public static final String TAG = Foreground.class.getName();

    public interface Listener {

        void onBecameForeground();

        void onBecameBackground();

    }

    private static Foreground instance;

    private boolean foreground = false, paused = true;
    private Handler handler = new Handler();
    private List<Listener> listeners = new CopyOnWriteArrayList<Listener>();
    private Runnable check;
    private boolean uiActive = false;

    private boolean isAppAlive = true;  //判断app计时是否已经结束，如果结束，但是app并没有被杀掉，用此字段复活计时功能
    private boolean isSwitchActivity = false;  //用来标记是否为从顶层activity切换到其他层activity
    private boolean isAppExit = false;  //用来标记，程序退出后，application是否完全退出，如果只是activity清空，但是application为退出，则再次进入，触发active

    private String topActivity;
    private Map<String, String> map = new HashMap<>();
    private static long timeStart = 0;   //开始计时的时间戳


    /**
     * Its not strictly necessary to use this method - _usually_ invoking
     * get with a Context gives us a path to retrieve the Application and
     * initialise, but sometimes (e.g. in test harness) the ApplicationContext
     * is != the Application, and the docs make no guarantees.
     *
     * @param application
     * @return an initialised Foreground instance
     */
    public static Foreground init(Application application) {
        timeStart = System.currentTimeMillis();

        if (instance == null) {
            instance = new Foreground();
            application.registerActivityLifecycleCallbacks(instance);
        }
        instance.uiActive = false;
        return instance;
    }

    public static Foreground get(Application application) {
        if (instance == null) {
            init(application);
        }
        return instance;
    }

    public static Foreground get(Context ctx) {
        if (instance == null) {
            Context appCtx = ctx.getApplicationContext();
            if (appCtx instanceof Application) {
                init((Application) appCtx);
            } else {
                throw new IllegalStateException("Foreground is not initialised and cannot obtain the Application object");
            }
        }
        return instance;
    }

    public static Foreground get() {
        if (instance == null) {
            throw new IllegalStateException("Foreground is not initialised - invoke at least once with parameterised init/get");
        }
        return instance;
    }

    public boolean isForeground() {
        return foreground;
    }

    public boolean isBackground() {
        return !foreground;
    }

    public boolean isUiActive() {
        return uiActive;
    }

    public void addListener(Listener listener) {
        listeners.add(listener);
    }

    public void removeListener(Listener listener) {
        listeners.remove(listener);
    }

    @Override
    public void onActivityResumed(Activity activity) {
        paused = false;
        boolean wasBackground = !foreground;
        foreground = true;
        uiActive = true;

        if (check != null)
            handler.removeCallbacks(check);

        if (wasBackground) {
            Log.i(TAG, "went foreground");
            for (Listener l : listeners) {
                try {
                    l.onBecameForeground();
                } catch (Exception exc) {
                    Log.e(TAG, "Listener threw exception!", exc);
                }
            }
        } else {
            Log.i(TAG, "still foreground");
        }

        if (!activity.getClass().getSimpleName().equals(topActivity)) {
            isSwitchActivity = true;
        } else {
            isSwitchActivity = false;
        }
        topActivity = activity.getClass().getSimpleName();
        if (!isAppAlive || isAppExit) {
            isAppExit = false;
            timeStart = System.currentTimeMillis();
            LogUtil.d("app_use_time: resume " + timeStart);
            isAppAlive = true;
        }
    }

    @Override
    public void onActivityPaused(Activity activity) {
        paused = true;

        if (check != null)
            handler.removeCallbacks(check);

        handler.postDelayed(check = new Runnable() {
            @Override
            public void run() {
                if (foreground && paused) {
                    foreground = false;
                    Log.i(TAG, "went background");
                    for (Listener l : listeners) {
                        try {
                            l.onBecameBackground();
                        } catch (Exception exc) {
                            Log.e(TAG, "Listener threw exception!", exc);
                        }
                    }
                } else {
                    Log.i(TAG, "still foreground");
                }
            }
        }, CHECK_DELAY);


    }

    @Override
    public void onActivityCreated(Activity activity, Bundle savedInstanceState) {
        topActivity = activity.getClass().getSimpleName();
        map.put(topActivity, topActivity);
        isAppAlive = true;
        isSwitchActivity = false;
    }

    @Override
    public void onActivityStarted(Activity activity) {

    }

    @Override
    public void onActivityStopped(Activity activity) {
        if (topActivity.equals(activity.getClass().getSimpleName())) {
            long timeEnd = System.currentTimeMillis();
            long timeGap = (timeEnd - timeStart) / 1000;
            //上报 时长
            ReportUtily.reportAppUseDuration(timeGap);
            isAppAlive = false;
        }
    }

    @Override
    public void onActivitySaveInstanceState(Activity activity, Bundle outState) {
    }

    @Override
    public void onActivityDestroyed(Activity activity) {
        map.remove(activity.getClass().getSimpleName());
        if (map.size() == 0 && isAppAlive) {
            long timeEnd = System.currentTimeMillis();
            long timeGap = (timeEnd - timeStart) / 1000;
            ReportUtily.reportAppUseDuration(timeGap);
        }
        isAppAlive = false;
        if (map.size() == 0) {
            isAppExit = true;
        }
    }

}
