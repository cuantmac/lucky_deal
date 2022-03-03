package com.m7.imkfsdk.utils;

import android.content.Context;
import android.content.res.Resources;
import androidx.annotation.AttrRes;
import android.util.TypedValue;


/**
 * @Description:
 * @Author: chenbo
 * @Date: 2020/9/29
 */
public class ResourceUtil {

    private static int getColorByAttributeId(Context context, @AttrRes int attr) {
        TypedValue typedValue = new TypedValue();
        Resources.Theme theme = context.getTheme();
        theme.resolveAttribute(attr, typedValue, true);
        return typedValue.data;
    }

    public static int getCurrentColor(Context context, int color) {
        return getColorByAttributeId(context, color);
    }
}
