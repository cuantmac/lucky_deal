package com.luckyapp.common.utils;

import android.text.TextUtils;

import java.util.regex.Pattern;

/**
 * @author: Routee
 * @date 2019/1/30
 * @mail wangchao@innotechx.com
 */
public class CommonStringUtils {
    /**
     * 计算字符串长度，中文对应3个字节
     *
     * @param str
     * @return 总长度
     */
    public static int getChineseCharsCounts(String str) {
        int i = 0;
        String regEx = "[\\u4e00-\\u9fa5]+";
        Pattern p = Pattern.compile(regEx);
        String[] arr = str.split("");
        for (String c : arr) {
            if (p.matcher(c).find()) {
                i += 1;
            }
        }
        return i;
    }

    /**
     * 一个汉子相当于三个长度的String格式化
     *
     * @param str 数据
     * @param max 最大长度
     * @return
     */
    public static String formatLengthLimitedString(String str, int max) {
        StringBuilder sb = new StringBuilder();
        int currentLen = 0;
        String regEx = "[\\u4e00-\\u9fa5]+";
        Pattern p = Pattern.compile(regEx);
        String[] arr = str.split("");
        for (String c : arr) {
            if (p.matcher(c).find()) {
                currentLen += 3;
            } else {
                if (!TextUtils.isEmpty(c)) {
                    currentLen += 1;
                }
            }
            if (currentLen <= max) {
                sb.append(c);
            } else {
                return sb.toString();
            }
        }
        return sb.toString();
    }
}
