package com.luckyapp.common.http.convert;

import android.content.Context;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.luckyapp.common.BuildConfig;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.bean.TokenBean;
import com.luckyapp.common.utils.BuildTypeUtil;
import com.luckyapp.common.utils.LogUtil;
import com.luckyapp.common.utils.SharedPreferencesUtil;
import com.google.gson.Gson;
import com.inno.innosdk.pb.InnoMain;
import com.inno.innosecure.InnoSecureUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Converter;

public class LuckyRequestConverter<T> implements Converter<T, RequestBody> {

    private Gson gson;

    public LuckyRequestConverter(Gson gson) {
        this.gson = gson;
    }

    @Override
    public RequestBody convert(@NonNull T value) throws IOException {
        if (value instanceof Map) {
            return getParams((Map<String, Object>) value);
        }
        return RequestBody.create(MediaType.parse("application/json"), gson.toJson(value));
    }

    public static RequestBody getParams(Map<String, Object> map) {
        Object files = map.get("files");
        if (files instanceof File[]) {
            MultipartBody.Builder buider = new MultipartBody.Builder().setType(MultipartBody.FORM);
            for (String key : map.keySet()) {
                String value = String.valueOf(map.get(key));
                buider.addFormDataPart(key, value);
            }

            for (File file : (File[]) files) {
                if (file.exists()) {
                    buider.addFormDataPart("basefile", file.getName(), RequestBody.create(MediaType.parse("multipart/form-data"), file));
                }
            }
            return buider.build();
        } else {
            TokenBean tokenBean = SharedPreferencesUtil.get().getToken();
            String token = null;
            if (tokenBean != null) {
                token = tokenBean.getToken();
                map.put("token", token);
            }
            map.put("luid", InnoMain.getluid(GlobalApp.get()));
            //map.put("version", DeviceInfoUtil.getVersionCode(request.getContext().getApplicationContext()));
            map.put("platform", 1);
            map.put("tk", InnoMain.loadInfo(GlobalApp.get()));
            map.put("version_code", BuildConfig.VERSION_CODE);
            if (BuildConfig.DEV_MODE) {
                File countryFile = new File("/sdcard/xxcountryipxx.txt");
                if (countryFile.exists()) {
                    try {
                        BufferedReader reader = new BufferedReader(new FileReader(countryFile));
                        String ip = reader.readLine();
                        map.put("X-Forwarded-For", ip);
                    } catch (IOException ignored) {
                    }
                }
            }
            try {
                if (BuildTypeUtil.isNotProduction()) {
                    LogUtil.d("request: " + new Gson().toJson(map));
                }
            } catch (Exception ignored) {
            }
            return RequestBody.create(null, encodeParams(GlobalApp.get(), map));
        }
    }

    /**
     * 参数加密
     *
     * @param params
     * @return
     */
    private static String encodeParams(Context context, Map<String, Object> params) {
        context = context.getApplicationContext();
        try {
            LogUtil.d("OkHttp", "params:\n" + new JSONObject(params).toString(4));
        } catch (JSONException ignored) {
        }
        try {
            String json = new JSONObject(params).toString();
            //此处包名必须要AndroidManifest里的package name保持一致
            byte[] encode = InnoSecureUtils.secureSo(context, json, "com.luckydeal");
            String base64_encode = Base64.encodeToString(encode, Base64.NO_WRAP);
            LogUtil.d("HttpSEC", "datain=" + base64_encode);
            return base64_encode;
        } catch (Throwable e) {
            e.printStackTrace();
            LogUtil.e("OkHttp", e.toString());
            return "";
        }

    }

}
