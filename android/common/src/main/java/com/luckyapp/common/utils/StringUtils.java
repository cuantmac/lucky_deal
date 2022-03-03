package com.luckyapp.common.utils;

import android.text.TextUtils;

import java.net.URLEncoder;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @Title: 字符串相关工具类
 * @Description: 此类作用描述
 * @Author: zhangchao
 * @Date: 2015/9/24
 * @Version: 1.0.0
 */
public class StringUtils {

    /**
     * 检查字符串是否为<code>null</code>或空字符串<code>""</code>。
     * <p>
     * <pre>
     * StringUtil.isEmpty(null)      = true
     * StringUtil.isEmpty("")        = true
     * StringUtil.isEmpty(" ")       = false
     * StringUtil.isEmpty("bob")     = false
     * StringUtil.isEmpty("  bob  ") = false
     * </pre>
     *
     * @param str 要检查的字符串
     * @return 如果为空, 则返回<code>true</code>
     */
    public static boolean isEmpty(String str) {
        return ((str == null) || (str.trim().length() == 0));
    }

    private final static String HEX = "0123456789ABCDEF";

    public static String toMD5(String source) {
        if (null == source || "".equals(source)) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("MD5");
            digest.update(source.getBytes());
            return toHex(digest.digest());
        } catch (Throwable e) {
        }
        return null;
    }

    /**
     * 字符串编码
     *
     * @param strCode
     * @return
     */
    public static String toEncode(String strCode) {
        try {
            return URLEncoder.encode(strCode, "utf-8");
        } catch (Throwable e) {
            e.printStackTrace();
            return "";
        }
    }

    /**
     * 价格类型处理
     */
    public static String toBigdecimal(Double num) {
        java.text.DecimalFormat df = new java.text.DecimalFormat("#0.00");
        return df.format(num);
    }

    /**
     * 判断是否是null或长度为0
     */
    public static boolean isNullOrEmpty(String str) {
        try {
            if (str == null)
                return true;
            if (str.length() == 0)
                return true;
            if (str.isEmpty())
                return true;
            if (str.replace(" ", "").equalsIgnoreCase("null"))
                return true;
            if ("".equals(str.replace(" ", "")))
                return true;
        } catch (Throwable e) {
            return true;
        }
        return false;
    }


    /**
     * string 长度截取(中文2字符 英文1字符)
     */
    public static String subLength(String str, int length) {
        if (isNullOrEmpty(str)) {
            return "";
        }
        int valueLength = 0;
        String chinese = "[\u4e00-\u9fa5]";
        StringBuilder buffer = new StringBuilder();
        // 获取字段值的长度，如果含中文字符，则每个中文字符长度为2，否则为1
        for (int i = 0; i < str.length(); i++) {
            // 获取一个字符
            if (valueLength >= length) {
                return buffer.toString() + "...";
            }
            String temp = str.substring(i, i + 1);
            // 判断是否为中文字符
            if (temp.matches(chinese)) {
                // 中文字符长度为2
                valueLength += 2;
            } else {
                // 其他字符长度为1
                valueLength += 1;
            }
            buffer.append(temp);
        }

        return buffer.toString();
    }

    /**
     * 判断string 是否含有中文
     */
    public static boolean isChinese(String strName) {
        char[] ch = strName.toCharArray();
        for (char c : ch) {
            if (isChinese(c)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断char 是否含有中文
     */
    private static boolean isChinese(char c) {
        Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);
        return ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS
                || ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A
                || ub == Character.UnicodeBlock.GENERAL_PUNCTUATION
                || ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION
                || ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS;
    }

    /**
     * 获取时间
     */

    public static String getTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("MM-dd hh:mm");
        Date date = new Date();
        String datestring = sdf.format(date);
        return datestring;
    }


    public static String toHex(byte[] buf) {
        if (buf == null) return "";
        StringBuffer result = new StringBuffer(2 * buf.length);
        for (int i = 0; i < buf.length; i++) {
            appendHex(result, buf[i]);
        }
        return result.toString();
    }

    private static void appendHex(StringBuffer sb, byte b) {
        sb.append(HEX.charAt((b >> 4) & 0x0f)).append(HEX.charAt(b & 0x0f));
    }


    /**
     * 手机号正则
     */
    public static boolean isPhone(String mobiles) {
        int number = mobiles.length();
        return number == 11;
    }

    /**
     * 手机号*
     */
    public static String getPhoneNumber(String mobile) {
        return mobile.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
    }


    /**
     * 前面加* 银行卡后四位
     */
    public static String getCardNumber(String cardNo) {
        if (TextUtils.isEmpty(cardNo)) {
            return "";
        }
        try {
            return cardNo.substring(0, 4) + "********* " + cardNo.substring(cardNo.length() - 4);
        } catch (Throwable e) {
            return "";
        }
    }

    /**
     * 银行卡后四位
     */
    public static String getCardNumber4(String cardNo) {
        if (TextUtils.isEmpty(cardNo)) {
            return "";
        }
        try {
            return cardNo.substring(cardNo.length() - 4);
        } catch (Throwable e) {
            return "";
        }
    }


    /**
     * 姓名处理
     */
    public static String getRealName(String cardNo) {
        String result = null;
        int length = cardNo.length();
        for (int i = 0; i < length; i++) {
            if (i == length - 1) {
                result = result + cardNo.substring(length - 1);
            } else {
                if (TextUtils.isEmpty(result)) {
                    result = "*";
                } else {
                    result = result + "*";
                }
            }

        }

        return result;
    }

    public static String getCardNo(String card) {
        String result = null;
        int length = card.length();
        for (int i = 0; i < length; i++) {
            if (i == 0) {
                result = card.substring(0, 1);
            } else if (i == length - 1) {
                result = result + card.substring(length - 1);
            } else {
                result = result + "*";
            }
        }
        return result;
    }

    public static String getCardName(String name) {

        return name;
    }

    /**
     * 过滤字符
     */
    public static String validate(String str) {
        return str.replaceAll("\\s*", "");
    }

    /**
     * 验证码正则
     */
    public static boolean isCodes(String codes) {
        Pattern p = Pattern.compile("\\d{6}$");
        Matcher m = p.matcher(codes);
        return m.matches();
    }

    public static String TimeSpanFormat(long time) {
        String date = null;
        SimpleDateFormat df = new SimpleDateFormat("yyyy.MM.dd HH:mm");
        date = df.format(new Date(time));
        return date;
    }

    public static String TimeSpanFormat(String time) {
        long lon = Long.parseLong(time);
        String date = null;
        SimpleDateFormat df = new SimpleDateFormat("yyyy.MM.dd HH:mm");
        date = df.format(new Date(lon));
        return date;
    }

    public static String TimeActivityFormat(String time) {
        long lon = Long.parseLong(time);
        String date = null;
        SimpleDateFormat df = new SimpleDateFormat("MM.dd");
        date = df.format(new Date(lon));
        return date;
    }

    public static String MSStampHHmmStr(String time) {
        long lon = Long.parseLong(time);
        String date = null;
        SimpleDateFormat df = new SimpleDateFormat("HH:mm");
        Long aLong = new Long(lon);
        date = df.format(aLong);
        return date;
    }

    //判断选择的日期是否是本周
    public static boolean isThisWeek(String time) {
        long lon = Long.parseLong(time);
        Calendar calendar = Calendar.getInstance();
        int currentWeek = calendar.get(Calendar.WEEK_OF_YEAR);
        calendar.setTimeInMillis(lon);
        int paramWeek = calendar.get(Calendar.WEEK_OF_YEAR);
        return paramWeek == currentWeek;
    }

    /**
     * 获取日期
     *
     * @param time
     * @return
     */
    public static String getFormateDate(String time) {
        long lon = Long.parseLong(time);
        String date = null;
        SimpleDateFormat df = new SimpleDateFormat("yy-MM-dd");
        date = df.format(new Date(lon));
        return date;
    }

    public static String getFormateDate(long time) {
        String date = null;
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        date = df.format(new Date(time));
        return date;
    }


    public static String getFormateDateYMDHMS(long time) {
        String date = null;
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        date = df.format(new Date(time));
        return date;
    }

    /**
     * 获取日期
     *
     * @param time
     * @return
     */
    public static String getDate(String time) {
        long lon = Long.parseLong(time);
        String date = null;
        SimpleDateFormat df = new SimpleDateFormat("yy/MM/dd");
        date = df.format(new Date(lon));
        return date;
    }

    /**
     * 获得是周几
     *
     * @param time：时间戳
     * @return
     */
    public static String getWeekDate(String time) {

        long lon = Long.parseLong(time);
        final Calendar c = Calendar.getInstance();
        c.setTimeInMillis(lon);
        c.setTimeZone(TimeZone.getTimeZone("GMT+8:00"));
        String mWay = String.valueOf(c.get(Calendar.DAY_OF_WEEK));
        if ("1".equals(mWay)) {
            mWay = "天";
        } else if ("2".equals(mWay)) {
            mWay = "一";
        } else if ("3".equals(mWay)) {
            mWay = "二";
        } else if ("4".equals(mWay)) {
            mWay = "三";
        } else if ("5".equals(mWay)) {
            mWay = "四";
        } else if ("6".equals(mWay)) {
            mWay = "五";
        } else if ("7".equals(mWay)) {
            mWay = "六";
        }
        return "星期" + mWay;
    }

    /**
     * 判断还否为今天
     *
     * @param time
     * @return
     */
    public static boolean isToday(String time) {

        long lon = Long.parseLong(time);
        Calendar pre = Calendar.getInstance();
        pre.setTimeInMillis(System.currentTimeMillis());
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(lon);
        if (cal.get(Calendar.YEAR) == (pre.get(Calendar.YEAR))) {
            int diffDay = cal.get(Calendar.DAY_OF_YEAR)
                    - pre.get(Calendar.DAY_OF_YEAR);

            return diffDay == 0;
        }
        return false;
    }

    /**
     * 是不是昨天
     *
     * @param timestamp：时间戳
     * @return
     */
    public static boolean isYesterday(String timestamp) {
        long lon = Long.parseLong(timestamp);
        Calendar pre = Calendar.getInstance();
        Date predate = new Date(System.currentTimeMillis());
        pre.setTime(predate);

        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(lon);

        if (cal.get(Calendar.YEAR) == (pre.get(Calendar.YEAR))) {
            int diffDay = cal.get(Calendar.DAY_OF_YEAR)
                    - pre.get(Calendar.DAY_OF_YEAR);

            return diffDay == -1;
        }
        return false;
    }

    /**
     * 获取汉字的首字母
     */
    public static String getSpells(String characters) {
        StringBuffer buffer = new StringBuffer();
        if (TextUtils.isEmpty(characters)) {
            return "";
        }
        char ch = characters.charAt(0);
        if ((ch >> 7) == 0) {
            // 判断是否为汉字，如果左移7为为0就不是汉字，否则是汉字
            return "";
        } else {
            char spell = getFirstLetter(ch);
            buffer.append(String.valueOf(spell));
        }
        return buffer.toString();
    }


    public static Character getFirstLetter(char ch) {

        byte[] uniCode = null;
        try {
            uniCode = String.valueOf(ch).getBytes("GBK");
        } catch (Throwable e) {
            e.printStackTrace();
            return null;
        }
        if (uniCode[0] < 128 && uniCode[0] > 0) { // 非汉字
            return null;
        } else {
            return convert(uniCode);
        }
    }

    static final int GB_SP_DIFF = 160;
    // 存放国标一级汉字不同读音的起始区位码
    static final int[] secPosValueList = {1601, 1637, 1833, 2078, 2274, 2302,
            2433, 2594, 2787, 3106, 3212, 3472, 3635, 3722, 3730, 3858, 4027,
            4086, 4390, 4558, 4684, 4925, 5249, 5600};
    // 存放国标一级汉字不同读音的起始区位码对应读音
    static final char[] firstLetter = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X',
            'Y', 'Z'};

    static char convert(byte[] bytes) {
        char result = '-';
        int secPosValue = 0;
        int i;
        for (i = 0; i < bytes.length; i++) {
            bytes[i] -= GB_SP_DIFF;
        }
        secPosValue = bytes[0] * 100 + bytes[1];
        for (i = 0; i < 23; i++) {
            if (secPosValue >= secPosValueList[i]
                    && secPosValue < secPosValueList[i + 1]) {
                result = firstLetter[i];
                break;
            }
        }
        return result;
    }

}
