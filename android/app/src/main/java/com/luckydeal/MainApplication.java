package com.luckydeal;

import android.app.ActivityManager;
import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.Process;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.WebView;

import androidx.annotation.Nullable;

import com.appsflyer.AppsFlyerConversionListener;
import com.appsflyer.AppsFlyerLib;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.soloader.SoLoader;
import com.google.android.gms.ads.identifier.AdvertisingIdClient;
import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.common.GooglePlayServicesRepairableException;
import com.inno.innocommon.pb.InnoCommon;
import com.inno.innocommon.pb.Option;
import com.inno.innosdk.pb.InnoMain;
import com.inno.innosecure.InnoSecureUtils;
import com.innotech.itfcmlib.ITPushClient;
import com.innotech.itfcmlib.utils.Utils;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.report.ReportUtily;
import com.luckyapp.common.utils.BuildTypeUtil;
import com.luckyapp.common.utils.Foreground;
import com.luckyapp.common.utils.LogUtil;
import com.luckyapp.common.utils.SharedPreferencesUtil;
import com.luckydeal.config.Constant;
import com.luckydeal.notification.FCMReceiver;
import com.luckydeal.receiver.InstallReferrerConnector;
import com.luckydeal.update.ReactBundleLoader;
import com.luckydeal.update.UpdateManager;
import com.module.common.base.BaseApplication;
import com.tencent.bugly.crashreport.CrashReport;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.branch.referral.Branch;
import io.reactivex.plugins.RxJavaPlugins;
import io.branch.rnbranch.RNBranchModule;
import com.facebook.FacebookSdk;
import com.facebook.applinks.AppLinkData;

public class MainApplication extends BaseApplication implements ReactApplication {
    //TODO 更换对应的推送key
    public static final int PUSH_ID = 1017;
    public static final String PUSH_APP_KEY = "TERJMTU4OTc5MDE0MQ";
    public static final int PUSH_ID_DEV = 1023;
    public static final String PUSH_APP_KEY_DEV = "enhmMTYwNDM4NDI4NA";
    public static final AppReactPackage mAppReactPackage = new AppReactPackage();
    public static int startMode = 0; //冷启动--0， 热启动1，
    private boolean isMainProcess = true;
    
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            @SuppressWarnings("UnnecessaryLocalVariable")
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Packages that cannot be autolinked yet can be added manually here, for example:
             packages.add(mAppReactPackage);
            return packages;
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

        @Nullable
        @Override
        protected String getJSBundleFile() {
            return ReactBundleLoader.getJSBundleFile();
        }
    };

    public static void initAppsFlyer(Application context, String AFKey, String uid) {
        boolean debugMode = checkDebugMode();
        AppsFlyerConversionListener conversionListener = new AppsFlyerConversionListener() {
            @Override
            public void onConversionDataSuccess(Map<String, Object> conversionData) {
            }

            @Override
            public void onConversionDataFail(String errorMessage) {
            }

            @Override
            public void onAppOpenAttribution(Map<String, String> conversionData) {
            }

            @Override
            public void onAttributionFailure(String errorMessage) {
            }
        };

        AppsFlyerLib.getInstance().setCollectAndroidID(false);
        AppsFlyerLib.getInstance().setCollectIMEI(false);
        AppsFlyerLib.getInstance().setDebugLog(debugMode);
        AppsFlyerLib.getInstance().setCustomerUserId(uid);
        AppsFlyerLib.getInstance().init(AFKey, conversionListener, context);
        AppsFlyerLib.getInstance().startTracking(context, AFKey);
    }

//    public synchronized static String getSign(Context context) {
//        try {
//            String pkgname = context.getPackageName();
//            PackageManager manager = context.getPackageManager();
//            PackageInfo packageInfo = manager.getPackageInfo(pkgname, PackageManager.GET_SIGNATURES);
//            Signature[] signatures = packageInfo.signatures;
//            String str = signatures[0].toCharsString();
//            return str;
//        } catch (Throwable e) {
//            Log.e("Sign", "出错1:   " + e.toString());
//        }
//        return "error";
//    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
                /*
                 We use reflection here to pick up the class that initializes Flipper,
                since Flipper library is not available in release mode
                */
                Class<?> aClass = Class.forName("com.luckydeal.ReactNativeFlipper");
                aClass.getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
                        .invoke(null, context, reactInstanceManager);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        initBugly();
        isMainProcess = isMainProcess(this);
        initAaid(this::initReportSdk);
        boolean debugMode = checkDebugMode();
        LogUtil.d("App Create");
        GlobalApp.set(this);
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
        UpdateManager.get().setInstanceManager(getReactNativeHost().getReactInstanceManager());
//        OkHttpDns.getInstance(this).init(debugMode, ConfigManager.getInstance().getAppConfig().httpdns_usehttps, debugMode);
        InstallReferrerConnector.getInstance().getConnect(this);
        Foreground.init(this);
        RxJavaPlugins.setErrorHandler(throwable -> {
            LogUtil.e("unhandle throwable", throwable);
            CrashReport.postCatchedException(throwable);
        });

        InnoSecureUtils.init(this, getPackageName());
        initAppsFlyer(MainApplication.this, Constant.AppsFlyer.APPSFLYER_KEY, InnoMain.loadTuid(getApplicationContext()));
        createNotificationChannel();
        marketReport();
        if (BuildConfig.DEV_MODE) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        //UpdateManager.get().checkUpdate();
        if (debugMode) Branch.enableLogging();
        RNBranchModule.getAutoInstance(this);
        Branch.getInstance().setIdentity(InnoMain.loadTuid(getApplicationContext()));


        handleFacebookDeepLink();

        if(startMode == 0) {
            ReportUtily.sendStartAppType(0);
        }

    }

    private static boolean checkDebugMode() {
        boolean debugMode = new File("/sdcard/xxluckytestmodexx").exists() || BuildConfig.DEV_MODE || com.luckyapp.common.BuildConfig.DEBUG;
        LogUtil.setLogEnabled(debugMode);
        return (debugMode || com.luckyapp.common.BuildConfig.DEBUG || com.luckyapp.common.BuildConfig.DEV_MODE);
    }

    public static boolean isMainProcess(Context context) {
        List<ActivityManager.RunningAppProcessInfo> runningAppProcesses = ((ActivityManager) context
                .getSystemService(ACTIVITY_SERVICE)).getRunningAppProcesses();
        if (runningAppProcesses == null || runningAppProcesses.size() == 0) return true;
        int pid = Process.myPid();
        for (ActivityManager.RunningAppProcessInfo process : runningAppProcesses) {
            if (process.pid == pid) {
                return process.processName.equals(context.getPackageName());
            }
        }
        return true;
    }

    private void initReportSdk(String aaid) {
        HashMap<String, String> commondata = new HashMap<>();
        commondata.put("packagename", getPackageName());
        if (!TextUtils.isEmpty(aaid)) {
            commondata.put("aaid", aaid);
        }
        commondata.put("versioncode", String.valueOf(com.luckyapp.common.BuildConfig.VERSION_CODE));
        InnoCommon.setCommonReport(commondata);
        Option option = new Option();
        //option.setShowDebug(true);
        //option.setShowDebug(BuildConfig.DEV_MODE);
        option.setAddress(Constant.InnoSdk.REPORT_URL);
        option.setOpenId(InnoMain.loadInfo(MainApplication.this));
        option.setChannel("gp");//SharedPreferencesUtil.getSharedPreferencesUtil(this).getRefChannel());
        InnoCommon.startInno(getApplicationContext(), Constant.InnoSdk.CID, Constant.InnoSdk.APPKEY, option);
        if (isMainProcess) {
            ITPushClient.registerPushReciver(new FCMReceiver());
        }
        startAntiSpamSdk("luckydeal", "001", new InnoMain.CallBack() {
            @Override
            public void getOpenid(String openid, int isnew, String remark) {
                LogUtil.d("MainApp", "==========openid=======" + openid);
                LogUtil.d("MainApp", "==========tk=======" + InnoMain.loadInfo(getApplicationContext()));
                LogUtil.d("MainApp", "==========tuid=======" + InnoMain.loadTuid(getApplicationContext()));
                LogUtil.d("MainApp", "==========luid=======" + InnoMain.getluid(getApplicationContext()));
                LogUtil.d("MainApp", "==========localid=======" + InnoMain.getLocalid(getApplicationContext()));
                AppModule.antiSpamStarted = true;
                if (AppModule.waitingAntiSpam) {
                    ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();
                    ReactApplicationContext context = (ReactApplicationContext) mReactInstanceManager.getCurrentReactContext();
                    if (context != null) {
                        //context.getNativeModule(AppModule.class).hideSplash();
                    }
                }
                InnoCommon.setOpenId(openid);
                if (isMainProcess) {
                    if (com.luckyapp.common.BuildConfig.DEV_MODE) {
                        Log.e("MainApp", "==========DEV_MODE========" + com.luckyapp.common.BuildConfig.DEV_MODE);
                        ITPushClient.init(MainApplication.this, PUSH_ID_DEV, PUSH_APP_KEY_DEV, BuildTypeUtil.isNotProduction());
                    } else {
                        ITPushClient.init(MainApplication.this, PUSH_ID, PUSH_APP_KEY, BuildTypeUtil.isNotProduction());
                    }
                }
            }
        });
    }

    public void startAntiSpamSdk(String cid, String ch, InnoMain.CallBack callBack) {
//        0001
        InnoMain.setValueMap("ch", ch);//这里填入你们的渠道号
//        0代表正式，1代表debug
        if (com.luckyapp.common.BuildConfig.DEV_MODE) {
            InnoMain.setValueMap("isDebug", 1);//测试包，
        } else {
            InnoMain.setValueMap("isDebug", 0);//正式包
        }
        com.inno.innosdk.pb.Option option = new com.inno.innosdk.pb.Option();
        option.setbReportJSData(true);//开启渠道归因
        InnoMain.setJSReturnCallback(new InnoMain.SubChannelReturn() {
            @Override
            public void getResult(String s) {
                SharedPreferencesUtil.get().setValue("deepLink", s);
                LogUtil.d("JSReturn", s);
                InnoMain.cleanJSReturn();
            }
        });
        InnoMain.reportJSSubChannelInfo("luckydeal");
        InnoMain.startInno(this, cid, option, callBack);
    }


    private void initBugly() {
        CrashReport.initCrashReport(getApplicationContext());
//        CrashReport.putUserData(this, "Country", Locale.getDefault().getCountry());
//        CrashReport.putUserData(this, "Language", Locale.getDefault().getLanguage());
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Lucky Deal";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("LuckyDealDefault", name, importance);
            channel.setShowBadge(true);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    public static void marketReport() {
        int appVersionCode = SharedPreferencesUtil.get().getValue("app_version_market", 0);
        if (appVersionCode < BuildConfig.VERSION_CODE) {
            PackageManager pm = GlobalApp.get().getPackageManager();
            ReportUtily.sendCustomEventWithValue("ga_installed_market", pm.getInstallerPackageName(GlobalApp.get().getPackageName()));
            SharedPreferencesUtil.get().setValue("app_version_market", BuildConfig.VERSION_CODE);
        }
    }

    public static AppReactPackage getAppReactPackage() {
        return mAppReactPackage;
    }

    private void handleFacebookDeepLink() {
        FacebookSdk.setAutoInitEnabled(true);
        FacebookSdk.fullyInitialize();
        SharedPreferencesUtil.get().setValue("fb_target_item", "");
        SharedPreferencesUtil.get().setValue("fb_target_type", "");
        AppLinkData.fetchDeferredAppLinkData(this,
                appLinkData -> {
                    // Process app link data   luckydeal://offer/10001
                    //  luckydeal://list/10002:offer,
                    if (appLinkData != null) {
                        try {
                            String schema = appLinkData.getTargetUri().getScheme();
                            LogUtil.d("deeplink:" + schema);
                            if (schema.equals("luckydeal")) {
                                String path = appLinkData.getTargetUri().getPath().substring(1);
                                String type = appLinkData.getTargetUri().getAuthority();
                                LogUtil.d("deeplink:" + type + ":" + path);
                                SharedPreferencesUtil.get().setValue("fb_target_item", path);
                                SharedPreferencesUtil.get().setValue("fb_target_type", type);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
        );
    }

    private void initAaid(AaidCallBack callback) {
        new Thread(() -> {
            String gaid = "";
            try {
                gaid = AdvertisingIdClient.getAdvertisingIdInfo(this).getId();
                if (!TextUtils.isEmpty(gaid)) {
                    SharedPreferencesUtil.get().setValue("google_adid", gaid);
                    LogUtil.d("gaid", gaid);
                }
            } catch (IOException | GooglePlayServicesNotAvailableException
                    | GooglePlayServicesRepairableException e) {
                e.printStackTrace();
            }
            String finalGaid = gaid;
            new Handler(Looper.getMainLooper()).post(() -> {
                callback.onAaidReady(finalGaid);
            });
        }).start();

    }

    public interface AaidCallBack {
        void onAaidReady(String aaid);
    }
}
