package com.luckydeal.config;

import android.text.TextUtils;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Description：.
 * Author：Created by YJ_Song on 4/8/21.
 * Email:  songyuanjin@innotechx.com
 */
public class PayResult {

    private String code;
    private String message;

    public PayResult(String rawResult) {
        if (TextUtils.isEmpty(rawResult))
            return;
        try {
            JSONObject obj = new JSONObject(rawResult);
            code = obj.getString("code");
            message = obj.getString("message");
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    @Override
    public String toString() {
        return "PayResult [code=" + code + ", message=" + message + "]";
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

}
