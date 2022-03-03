package com.luckyapp.common.utils;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import com.google.gson.Gson;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.bean.TokenBean;


/**
 * Created by zhihaoliang on 2017/7/5.
 * Email:zhihaoliang07@163.com
 */
public class SharedPreferencesUtil {
    private Context context;
    private SharedPreferences sp;

    //    token字段
    private static final String TOKEN = "token";

    /**
     * Create DefaultSharedPreferences
     *
     * @param context
     */
    private SharedPreferencesUtil(Context context) {
        this(context, PreferenceManager.getDefaultSharedPreferences(context));
    }

    private static class SingleInstanceHolder {
        private static SharedPreferencesUtil INSTANCE = new SharedPreferencesUtil(GlobalApp.get());
    }

    public static SharedPreferencesUtil get() {
        return SingleInstanceHolder.INSTANCE;
    }

    /**
     * Create SharedPreferences by filename
     *
     * @param context
     * @param filename
     */
    @SuppressLint("WorldWriteableFiles")
    @SuppressWarnings("deprecation")
    private SharedPreferencesUtil(Context context, String filename) {
        this(context, context.getSharedPreferences(filename, Context.MODE_PRIVATE));
    }

    /**
     * Create SharedPreferences by SharedPreferences
     *
     * @param context
     * @param sp
     */
    private SharedPreferencesUtil(Context context, SharedPreferences sp) {
        this.context = context.getApplicationContext();
        this.sp = sp;
    }

    public TokenBean getToken() {
        return new Gson().fromJson(getValue(TOKEN, ""), TokenBean.class);
    }

    public void setToken(String value) {
        setValue(TOKEN, value);
    }

    // Boolean
    public void setValue(String key, boolean value) {
        sp.edit().putBoolean(key, value).apply();
    }

    public void setValue(int resKey, boolean value) {
        setValue(this.context.getString(resKey), value);
    }

    // Float
    public void setValue(String key, float value) {
        sp.edit().putFloat(key, value).apply();
    }

    public void setValue(int resKey, float value) {
        setValue(this.context.getString(resKey), value);
    }

    // Integer
    public void setValue(String key, int value) {
        sp.edit().putInt(key, value).apply();
    }

    public void setValue(int resKey, int value) {
        setValue(this.context.getString(resKey), value);
    }

    // Long
    public void setValue(String key, long value) {
        sp.edit().putLong(key, value).apply();
    }

    public void setValue(int resKey, long value) {
        setValue(this.context.getString(resKey), value);
    }

    // String
    public void setValue(String key, String value) {
        sp.edit().putString(key, value).apply();
    }

    public void setValue(int resKey, String value) {
        setValue(this.context.getString(resKey), value);
    }

    // Get

    // Boolean
    public boolean getValue(String key, boolean defaultValue) {
        return sp.getBoolean(key, defaultValue);
    }

    public boolean getValue(int resKey, boolean defaultValue) {
        return getValue(this.context.getString(resKey), defaultValue);
    }

    // Float
    public float getValue(String key, float defaultValue) {
        return sp.getFloat(key, defaultValue);
    }

    public float getValue(int resKey, float defaultValue) {
        return getValue(this.context.getString(resKey), defaultValue);
    }

    // Integer
    public int getValue(String key, int defaultValue) {
        return sp.getInt(key, defaultValue);
    }

    public int getValue(int resKey, int defaultValue) {
        return getValue(this.context.getString(resKey), defaultValue);
    }

    // Long
    public long getValue(String key, long defaultValue) {
        return sp.getLong(key, defaultValue);
    }

    public long getValue(int resKey, long defaultValue) {
        return getValue(this.context.getString(resKey), defaultValue);
    }

    // String
    public String getValue(String key, String defaultValue) {
        return sp.getString(key, defaultValue);
    }

    public String getValue(int resKey, String defaultValue) {
        return getValue(this.context.getString(resKey), defaultValue);
    }

    public void increase(String key) {
        int count = sp.getInt(key, 0);
        sp.edit().putInt(key, ++count).apply();
    }

    public void decrease(String key) {
        int count = sp.getInt(key, 0);
        sp.edit().putInt(key, --count).apply();
    }


    // Delete
    public void remove(String key) {
        sp.edit().remove(key).apply();
    }

    public void clear() {
        sp.edit().clear().apply();
    }
}
