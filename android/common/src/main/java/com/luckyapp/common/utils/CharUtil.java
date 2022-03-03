package com.luckyapp.common.utils;

import java.util.regex.Pattern;

/**
 * @author : gavin
 * @date 2019/2/19.
 */
public class CharUtil {

    public static boolean isChinese(String con){
        for (int i = 0; i < con.length(); i = i + 1) {
            if (!Pattern.compile("[\u4e00-\u9fa5]").matcher(
                    String.valueOf(con.charAt(i))).find()) {
                return false;
            }
        }
        return true;
    }

    public static boolean isChineseOrEnglish(String con) {
        if (null != con && !"".equals(con)) {
            return (isChinese(con) || con.matches("^[A-Za-z]+$"))
                    && con.length() <= 10;
        }
        return false;
    }


}
