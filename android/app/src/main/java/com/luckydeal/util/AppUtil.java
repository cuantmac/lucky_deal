package com.luckydeal.util;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.telephony.TelephonyManager;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.luckyapp.common.BuildConfig;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.bean.SharePlatform;
import com.luckydeal.R;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class AppUtil {

    public static int packageCode(Context context) {
        PackageManager manager = context.getPackageManager();
        int code = 0;
        try {
            PackageInfo info = manager.getPackageInfo(context.getPackageName(), 0);
            code = info.versionCode;
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return code;
    }

    public static String packageName() {
        PackageManager manager = GlobalApp.get().getPackageManager();
        try {
            PackageInfo info = manager.getPackageInfo(GlobalApp.get().getPackageName(), 0);
            return info.packageName;
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return "com.luckydeal";
    }

    public static String getVersion() {
        try {
            PackageManager manager = GlobalApp.get().getPackageManager();
            PackageInfo info = manager.getPackageInfo(GlobalApp.get().getPackageName(), 0);
            return info.versionName;
        } catch (Throwable e) {
            return BuildConfig.VERSION_NAME;
        }
    }



    /**
     * Return whether the app is installed.
     *
     * @param pkgName The name of the package.
     * @return {@code true}: yes<br>{@code false}: no
     */
    public static boolean isAppInstalled(@NonNull final String pkgName) {
        PackageManager packageManager = GlobalApp.get().getPackageManager();
        try {
            return packageManager.getApplicationInfo(pkgName, 0) != null;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static int dip2px(Context context, float dpValue) {
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (dpValue * scale + 0.5f);
    }

    public static int sp2px(Context context, float spValue) {
        final float fontScale = context.getResources().getDisplayMetrics().scaledDensity;
        return (int) (spValue * fontScale + 0.5f);
    }

    public static double change(double a) {
        return a * Math.PI / 180;
    }

    public static double changeAngle(double a) {
        return a * 180 / Math.PI;
    }

    /**
     * 若 context 为非Activity,则返回逻辑需要重新写。不能用onActivityResult回调。
     * 使用Intent.FLAG_ACTIVITY_NEW_TASK 启动模式时慎重，会导致onActivityResult 在页面跳转前就调用。
     */
    public static void openFaceBook(Context context) {
        String url = "https://www.facebook.com/Lucky-scratch1-111237223826853/?ref=bookmarks";
        Uri uri = Uri.parse("fb://page/111237223826853");

        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        ComponentName componentName = intent.resolveActivity(context.getPackageManager());
        if (componentName == null) {
            intent.setData(Uri.parse(url));
        }
        try {
            if (context instanceof Activity) {
                ((Activity) context).startActivityForResult(intent, 1202);
            } else {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            }
        } catch (Exception ignored) {
        }
    }

    /**
     * 若 context 为非Activity,则返回逻辑需要重新写。不能用onActivityResult回调。
     * 使用Intent.FLAG_ACTIVITY_NEW_TASK 启动模式时慎重，会导致onActivityResult 在页面跳转前就调用。
     */
    public static void openFaceBook(Fragment context) {
        String url = "https://www.facebook.com/Lucky-scratch1-111237223826853/?ref=bookmarks";
        Uri uri = Uri.parse("fb://page/111237223826853");

        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        ComponentName componentName = intent.resolveActivity(GlobalApp.get().getPackageManager());
        if (componentName == null) {
            intent.setData(Uri.parse(url));
        }
        try {
            context.startActivityForResult(intent, 1202);
        } catch (Exception ignored) {
        }

    }


    /**
     * 若 context 为非Activity,则返回逻辑需要重新写。不能用onActivityResult回调。
     * 使用Intent.FLAG_ACTIVITY_NEW_TASK 启动模式时慎重，会导致onActivityResult 在页面跳转前就调用。
     */
    public static void openInstagram(Context context) {
        Uri uri = Uri.parse("http://instagram.com/_u/" + "luckytimeapp");
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        intent.setPackage("com.instagram.android");
        ComponentName componentName = intent.resolveActivity(context.getPackageManager());
        if (componentName == null) {
            intent.setData(Uri.parse("https://www.instagram.com/luckytimeapp"));
            intent.setPackage(null);
        }
        try {
            if (context instanceof Activity) {
                ((Activity) context).startActivityForResult(intent, 1202);
            } else {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            }
        } catch (Exception ignored) {
        }
    }


    /**
     * 若 context 为非Activity,则返回逻辑需要重新写。不能用onActivityResult回调。
     * 使用Intent.FLAG_ACTIVITY_NEW_TASK 启动模式时慎重，会导致onActivityResult 在页面跳转前就调用。
     */
    public static void openInstagram(Fragment context) {
        Uri uri = Uri.parse("https://www.instagram.com/luckyscratchofficial/");
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        intent.setPackage("com.instagram.android");
        ComponentName componentName = intent.resolveActivity(GlobalApp.get().getPackageManager());
        if (componentName == null) {
            intent.setData(Uri.parse("https://www.instagram.com/luckytimeapp"));
            intent.setPackage(null);
        }
        try {
            context.startActivityForResult(intent, 1202);
        } catch (Exception ignored) {
        }
    }

    /**
     * 若 context 为非Activity,则返回逻辑需要重新写。不能用onActivityResult回调。
     * 使用Intent.FLAG_ACTIVITY_NEW_TASK 启动模式时慎重，会导致onActivityResult 在页面跳转前就调用。
     */
    public static void openTwitter(Context context) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("twitter://user?screen_name=LTimeapp"));
        //intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        ComponentName componentName = intent.resolveActivity(context.getPackageManager());
        if (componentName == null) {
            intent.setData(Uri.parse("https://twitter.com/LTimeapp"));
        }
        try {
            if (context instanceof Activity) {
                ((Activity) context).startActivityForResult(intent, 1202);
            } else {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
            }
        } catch (Exception ignored) {
        }
    }

    /**
     * 若 context 为非Activity,则返回逻辑需要重新写。不能用onActivityResult回调。
     * 使用Intent.FLAG_ACTIVITY_NEW_TASK 启动模式时慎重，会导致onActivityResult 在页面跳转前就调用。
     */
    public static void openTwitter(Fragment context) {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("twitter://user?screen_name=LTimeapp"));
        //intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        ComponentName componentName = intent.resolveActivity(GlobalApp.get().getPackageManager());
        if (componentName == null) {
            intent.setData(Uri.parse("https://twitter.com/LTimeapp"));
        }
        try {
            context.startActivityForResult(intent, 1202);
        } catch (Exception ignored) {
        }
    }

    public static String installedMarket() {
        String packageName = "unknown";
        try {
            PackageManager pm = GlobalApp.get().getPackageManager();
            if (pm != null) {
                //获取安装来源
                packageName = pm.getInstallerPackageName(packageName());
            }
        } catch (Exception e) {

        }
        return packageName;
    }

    public static void goBrowser(Context context, String link) {
        try {
            Uri uri = Uri.parse(link);
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            context.startActivity(intent);
        } catch (Exception e) {

        }
    }

    public static int getMccCode(Context context) {
        try {
            TelephonyManager telManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
            String mcc = telManager.getSimOperator();
            if (TextUtils.isEmpty(mcc)) return 0;
            return Integer.parseInt(mcc);
        } catch (Throwable e) {
            e.printStackTrace();
        }
        return 0;
    }

    public static List<SharePlatform> getShare_platform_list() {
        List<SharePlatform> sharePlatforms = new ArrayList<>();
        sharePlatforms.add(new SharePlatform(1, "FB"));
        sharePlatforms.add(new SharePlatform(2, "twitter"));
        sharePlatforms.add(new SharePlatform(3, "Whatsapp"));
        sharePlatforms.add(new SharePlatform(4, "Fbmessenger"));
        sharePlatforms.add(new SharePlatform(5, "system"));
        return sharePlatforms;
    }
}
