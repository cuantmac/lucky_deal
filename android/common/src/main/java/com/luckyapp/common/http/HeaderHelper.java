package com.luckyapp.common.http;

import android.os.Build;
import android.text.TextUtils;

import com.luckyapp.common.BuildConfig;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.bean.TokenBean;
import com.luckyapp.common.utils.SharedPreferencesUtil;
import com.inno.innosdk.pb.InnoMain;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Locale;

/**
 * Created by Wang on 2017/12/6.
 */

public class HeaderHelper {

    public static HashMap<String, String> generateHeaderMap() {
        TokenBean token = SharedPreferencesUtil.get().getToken();
        HashMap<String, String> headerMap = new HashMap<>();
        if (token != null && !TextUtils.isEmpty(token.getToken())) {
            String tokenstr = token.getToken();
            headerMap.put("Authorization", tokenstr);
        }
        headerMap.put("luid", InnoMain.getluid(GlobalApp.get()));
        headerMap.put("tk", InnoMain.loadInfo(GlobalApp.get()));
        headerMap.put("tuid", InnoMain.loadTuid(GlobalApp.get()));
        headerMap.put("Content-language", getLanguage());
        if (BuildConfig.DEV_MODE) {
            File countryFile = new File("/sdcard/xxcountryipxx.txt");
            if (countryFile.exists()) {
                try {
                    BufferedReader reader = new BufferedReader(new FileReader(countryFile));
                    String ip = reader.readLine();
                    headerMap.put("X-Forwarded-For", ip);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return headerMap;
    }


    public static String getLanguage() {
        Locale locale;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            locale = GlobalApp.get().getResources().getConfiguration().getLocales().get(0);
        } else {
            locale = GlobalApp.get().getResources().getConfiguration().locale;
        }
        //或者仅仅使用 locale = Locale.getDefault(); 不需要考虑接口 deprecated(弃用)问题
        if (locale == null) {
            locale = Locale.getDefault();
        }
        return locale.getLanguage();
    }
}
