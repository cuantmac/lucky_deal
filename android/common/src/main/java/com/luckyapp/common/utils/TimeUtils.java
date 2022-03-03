package com.luckyapp.common.utils;

import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.R;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2019-06-19
 * Desc: written for luckyday project.
 */
public class TimeUtils {
    public static final long MINUTE = 60 * 1000;
    public static final long HOUR = 60 * MINUTE;
    public static final long DAY = 24 * HOUR;

    public static long day(float day) {
        return (long) (day * DAY);
    }

    public static long hour(float hour) {
        return (long) (hour * HOUR);
    }

    public static long minute(float minute) {
        return (long) (minute * MINUTE);
    }

    public static String getTimeString(long time) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm", Locale.US);
        return dateFormat.format(new Date(time * 1000));
    }

    public static String handlePublishTimeDesc(long time) {
        // var date = new Date(post_modified);
        // var Y = date.getFullYear() + '-';
        // var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        // var D = date.getDate() + ' ';
        // var h = date.getHours() + ':';
        // var m = date.getMinutes() + ':';
        // var s = date.getSeconds();
        // var datetime = Y+M+D+h+m+s;

        //拿到当前时间戳和发布时的时间戳，然后得出时间戳差
        Date curTime = new Date();
        //var postTime = new Date(datetime);
        Date postTime = new Date(time * 1000);
        double timeDiff = Math.floor(curTime.getTime()) - postTime.getTime();
        // 单位换算
        double min = 60 * 1000;
        double hour = min * 60;
        double day = hour * 24;
        double week = day * 7;

        // 计算发布时间距离当前时间的周、天、时、分
        int exceedWeek = (int) Math.floor(timeDiff / week);
        int exceedDay = (int) Math.floor(timeDiff / day);
        int exceedHour = (int) Math.floor(timeDiff / hour);
        int exceedMin = (int) Math.floor(timeDiff / min);
        if (exceedMin <= 0) {
            exceedMin = 1;
        }

        // 最后判断时间差到底是属于哪个区间，然后return
        if (exceedWeek > 0) {
            return exceedWeek + GlobalApp.get().getString(R.string.week_ago);
        } else {
            if (exceedDay < 7 && exceedDay > 0) {
                return exceedDay + GlobalApp.get().getString(R.string.day_ago);
            } else {
                if (exceedHour < 24 && exceedHour > 0) {
                    return exceedHour + GlobalApp.get().getString(R.string.hour_ago);
                } else {
                    return exceedMin + GlobalApp.get().getString(R.string.minute_ago);
                }
            }
        }
    }

    public static boolean isSameDay(long time, long time2) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(time);
        Calendar calendar1 = Calendar.getInstance();
        calendar1.setTimeInMillis(time2);
        return calendar.get(Calendar.YEAR) == calendar1.get(Calendar.YEAR)
                && calendar.get(Calendar.DAY_OF_YEAR) == calendar1.get(Calendar.DAY_OF_YEAR);
    }
}
