package com.luckyapp.common.utils;

import android.text.TextUtils;
import android.util.Log;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Locale;

/**
 * @author Wang
 * @version 1.0
 * @ClassName: LogUtil
 * @Description: Log统一管理类
 * @date 2014-8-1 下午1:59:19
 */
public class LogUtil {

    private static final String TAG = "LuckyLog";
    private static boolean isLogEnable = false;
    private static final int LOGGER_ENTRY_MAX_LEN = 4 * 1000;

    public static void setLogEnabled(boolean enable) {
        isLogEnable = enable || BuildTypeUtil.isNotProduction();
    }

    // 下面四个是默认tag的函数
    public static void i(Object msg) {
        if (isLogEnable) {
            logFully(TAG, String.valueOf(msg), null, Log.INFO);
        } else {
            Log.i(TAG, String.valueOf(msg));
        }
    }

    public static void d(Object msg) {
        if (isLogEnable) {
            logFully(TAG, String.valueOf(msg), null, Log.DEBUG);
        }
    }

    public static void e(Object msg) {
        if (isLogEnable) {
            logFully(TAG, String.valueOf(msg), null, Log.ERROR);
        } else {
            Log.e(TAG, String.valueOf(msg));
        }
    }

    public static void v(Object msg) {
        if (isLogEnable) {
            logFully(TAG, String.valueOf(msg), null, Log.VERBOSE);
        }
    }

    public static void d(String tag, Object msg) {
        if (isLogEnable) {
            logFully(tag, String.valueOf(msg), null, Log.DEBUG);
        }
    }

    public static void e(String tag, Object msg, Throwable throwable) {
        if (isLogEnable) {
            logFully(tag, String.valueOf(msg), throwable, Log.ERROR);
        } else {
            Log.e(TAG, String.valueOf(msg), throwable);
        }
    }

    // 下面是传入自定义tag的函数
    public static void i(String tag, Object msg) {
        if (isLogEnable) {
            logFully(tag, String.valueOf(msg), null, Log.INFO);
        } else {
            Log.i(TAG, String.valueOf(msg));
        }
    }

    public static void e(String tag, Object msg) {
        if (isLogEnable) {
            logFully(tag, String.valueOf(msg), null, Log.ERROR);
        } else {
            Log.e(TAG, String.valueOf(msg));
        }
    }

    public static void v(String tag, Object msg) {
        if (isLogEnable) {
            logFully(tag, String.valueOf(msg), null, Log.VERBOSE);
        }
    }

    public static void d(String tag, Object msg, Object... params) {
        if (isLogEnable) {
            logFully(tag, logFormat(msg, params), null, Log.DEBUG);
        }
    }

    public static void v(String tag, Object msg, Object... params) {
        if (isLogEnable) {
            logFully(tag, logFormat(msg, params), null, Log.VERBOSE);
        }
    }

    private static String logFormat(Object msg, Object... params) {
        StringBuilder log = new StringBuilder(String.valueOf(msg));
        try {
            log = new StringBuilder(String.format(Locale.US, String.valueOf(msg), params));
        } catch (Exception ignored) {
        }
        if (String.valueOf(msg).equals(log.toString())) {
            for (Object o : params) {
                log.append(" ").append(o);
            }
        }
        return log.toString();
    }

    /**
     * @param level The order in terms of verbosity, from least to most is
     *              ERROR, WARN, INFO, DEBUG, VERBOSE.  Verbose should never be compiled
     *              into an application except during development.  Debug logs are compiled
     *              in but stripped at runtime.  Error, warning and info logs are always kept.
     */
    private static void logFully(String tag, String msg, Throwable e, int level) {
        StringBuilder msgBuilder = new StringBuilder();
        msgBuilder.append(getStackTraceMsg(5)).append(": ");
        if (!TextUtils.isEmpty(msg)) {
            msgBuilder.append(msg);
        }
        if (e != null) {
            if (!TextUtils.isEmpty(msg)) {
                msgBuilder.append("\n");
            }
            msgBuilder.append(printError(e));
        }
        String fullMsg = msgBuilder.toString();

        while (fullMsg.length() > 0) {
            String logMsg;
            if (fullMsg.length() >= LOGGER_ENTRY_MAX_LEN) {
                logMsg = fullMsg.substring(0, LOGGER_ENTRY_MAX_LEN);
                fullMsg = fullMsg.replace(logMsg, "");
            } else {
                logMsg = fullMsg;
                fullMsg = "";
            }
            switch (level) {
                case Log.VERBOSE:
                    Log.v(tag, logMsg);
                    break;
                case Log.DEBUG:
                    Log.d(tag, logMsg);
                    break;
                case Log.INFO:
                    Log.i(tag, logMsg);
                    break;
                case Log.WARN:
                    Log.w(tag, logMsg);
                    break;
                case Log.ERROR:
                    Log.e(tag, logMsg);
                    break;
            }
        }
    }

    public static String printError(Throwable throwable) {
        StringWriter writer = new StringWriter();
        PrintWriter printWriter = new PrintWriter(writer);
        throwable.printStackTrace(printWriter);
        return writer.toString();
    }

    private static String getStackTraceMsg(int depth) {
        StackTraceElement stackTrace = Thread.currentThread().getStackTrace()[depth];
        return stackTrace.getFileName() != null && stackTrace.getLineNumber() >= 0 ?
                                "(" + stackTrace.getFileName() + ":" + stackTrace.getLineNumber() + ")" :
                                (stackTrace.getFileName() != null ? "(" + stackTrace.getFileName() + ")" : "(Unknown Source)");
    }

    public static boolean isLogEnable() {
        return isLogEnable;
    }
}
