package com.luckyapp.common.utils;


import com.luckyapp.common.BuildConfig;

/**
 * Created by Wang on 2018/4/26.
 */

public class BuildTypeUtil {
    public static boolean isDebug() {
        boolean isDebug = BuildConfig.BUILD_TYPE.equals("debug");
        return isDebug;
    }

    public static boolean isUAT() {
        boolean isUat = BuildConfig.BUILD_TYPE.equals("uat");
        return isUat;
    }

    public static boolean isProduction() {
        boolean isProduction = BuildConfig.BUILD_TYPE.equals("release");
        return isProduction;
    }

    public static boolean isStaging(){
        boolean isStaging = BuildConfig.BUILD_TYPE.equals("staging");
        return isStaging;
    }

    public static boolean isNotProduction(){
        return BuildConfig.BUILD_TYPE.equals("debug") || BuildConfig.DEV_MODE;
    }
}
