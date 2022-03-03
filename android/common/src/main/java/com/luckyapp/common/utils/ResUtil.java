/**
 * @Copyright:Copyright (c) 2012 - 2100
 * @Company:suning.com
 */
package com.luckyapp.common.utils;


import android.content.Context;

/**
 * 对资源文件获取
 */
public class ResUtil {
    public static int getColor(Context context, int resId) {
        return context.getResources().getColor(resId);
    }

    public static String getString(Context context, int resId) {
        return context.getResources().getString(resId);
    }

    public static String getString(Context context, int resId, Object... object) {
        return context.getResources()
                .getString(resId, object);
    }
}
