package com.luckyapp.common.utils;

import android.widget.Toast;

import com.luckyapp.common.GlobalApp;

import me.drakeet.support.toast.ToastCompat;

public class ToastUtil {

    public static void postShow(int message) {
        GlobalApp.getHandelr().post(() -> {
            ToastCompat.makeText(GlobalApp.get(), message, Toast.LENGTH_SHORT).show();
        });
    }

    public static void postShow(CharSequence message) {
        GlobalApp.getHandelr().post(() -> {
            ToastCompat.makeText(GlobalApp.get(), message, Toast.LENGTH_SHORT).show();
        });
    }

    public static void showShort(int message) {
        ToastCompat.makeText(GlobalApp.get(), message, Toast.LENGTH_SHORT).show();
    }

    public static void showShort(CharSequence message) {
        ToastCompat.makeText(GlobalApp.get(), message, Toast.LENGTH_SHORT).show();
    }

    /**
     * 长时间显示ToastCompat
     *
     * @param message
     */
    public static void showLong(CharSequence message) {
        ToastCompat.makeText(GlobalApp.get(), message, Toast.LENGTH_LONG).show();
    }

    /**
     * 长时间显示ToastCompat
     *
     * @param messageResId
     */
    public static void showLong(int messageResId) {
        ToastCompat.makeText(GlobalApp.get(), messageResId, Toast.LENGTH_LONG).show();

    }

    /**
     * 长时间显示ToastCompat
     *
     * @param messageResId
     */
    public static void showLong(CharSequence message,int center) {
        ToastCompat toastCompat = ToastCompat.makeText(GlobalApp.get(), message, Toast.LENGTH_LONG);
        toastCompat.setGravity(center,0,0);
        toastCompat.show();

    }

    /**
     * 自定义显示ToastCompat时间
     *
     * @param message
     */
    public static void show(CharSequence message) {
        ToastCompat.makeText(GlobalApp.get(), message, Toast.LENGTH_SHORT).show();
    }

    /**
     * 自定义显示ToastCompat时间
     *
     * @param messageResId
     */
    public static void show(int messageResId) {
        ToastCompat.makeText(GlobalApp.get(), messageResId, Toast.LENGTH_SHORT).show();
    }

}
