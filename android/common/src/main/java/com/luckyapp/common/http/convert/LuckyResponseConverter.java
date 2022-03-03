package com.luckyapp.common.http.convert;

import android.text.TextUtils;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.luckyapp.common.http.ApiException;
import com.luckyapp.common.utils.LogUtil;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.lang.reflect.Type;

import okhttp3.ResponseBody;
import retrofit2.Converter;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2019-09-29
 * Desc: written for luckyday project.
 */
public class LuckyResponseConverter<T> implements Converter<ResponseBody, T> {
    private final Gson gson;
    private final Type type;

    LuckyResponseConverter(Gson gson, Type type) {
        this.gson = gson;
        this.type = type;
    }

    @Override
    public T convert(ResponseBody value) throws IOException {
        String response = value.string();
        try {
            LogUtil.d("OkHttp", "response:\n" + new JSONObject(response).toString(4));
        } catch (JSONException ignored) {
        }
        //某些成功状态没有response
        if (TextUtils.isEmpty(response)) {
            response = "{}";
        } else {
            try {
                JSONObject object = new JSONObject(response);
                if (object.optInt("code") != 0) {
                    ApiException exception = new ApiException(new Throwable(),
                            object.optInt("code"), object.optString("error"));
                    if (object.optInt("code") == ApiException.APICODE_FRAUD_USER) {
                        EventBus.getDefault().post(exception);
                    }
                    throw exception;
                }
                if (type == String.class) {
                    return (T) response;
                }
                response = object.optString("data", "{}");
            } catch (JsonSyntaxException | JSONException e) {
                if (type == String.class) {
                    return (T) response;
                }
                throw new ApiException(e, ApiException.DATA_ERROR,
                        "data parse error " + e.getMessage());
            }
        }
        return gson.fromJson(response, type);
    }
}
