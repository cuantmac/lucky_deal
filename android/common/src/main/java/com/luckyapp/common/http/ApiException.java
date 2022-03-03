package com.luckyapp.common.http;


import android.text.TextUtils;

import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.R;

import org.json.JSONObject;

import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import retrofit2.HttpException;

/**
 * Created by Wang on 16/3/10.
 */
public class ApiException extends RuntimeException {

    public static final int NO_CHANGE = 9029;
    public static final int APICODE_FRAUD_USER = 9035;
    public static final int MULTI_LOGIN_ERROR = 9022;
    public static final int TOKEN_ERROR_CODE = 9002;
    public static final int REQUEST_INVALID = 9001;
    public static final int CARD_ERROR_CODE = 9011;
    public static final int EXCEED_USER_5_MAX = 9060;
    public static final int EXCEED_LOTTO_REPICK_MAX = 9061;

    public static final int DATA_ERROR = 8001;
    public static final int NO_CONNECTION = 8002;
    public static final int ERROR_TIMEOUT = 8003;
    public static final int ERROR_UNKNOWN_HOST = 8004;

    private String error = GlobalApp.get().getString(R.string.connection_failed);
    private int code = -1;

    private String requestUrl;

    public ApiException(Throwable throwable) {
        super(throwable);
        if (throwable instanceof SocketTimeoutException) {
            code = ERROR_TIMEOUT;
            error = GlobalApp.get().getString(R.string.connection_timeout);
        } else if (throwable instanceof UnknownHostException) {
            code = ERROR_UNKNOWN_HOST;
            error = GlobalApp.get().getString(R.string.dns_failed);
        } else if (throwable instanceof HttpException) {
            HttpException httpException = (HttpException) throwable;
            String error_message = null;
            code = httpException.code();
            try {
                String errorResponse = httpException.response().errorBody().string();
                JSONObject jsonObject = new JSONObject(errorResponse);
                code = jsonObject.optInt("code", code);
                error_message = jsonObject.optString("error", null);
            } catch (Throwable ignored) {
            }
            if (TextUtils.isEmpty(error_message)) {
                if (httpException.code() >= 500) {
                    error_message = GlobalApp.get().getString(R.string.server_error);
                } else if (httpException.code() >= 400) {
                    error_message = GlobalApp.get().getString(R.string.request_error);
                }
            }
            if (!TextUtils.isEmpty(error_message)) {
                error = error_message;
            }
        }
    }

    public ApiException(Throwable throwable, int code, String error) {
        super(code + ":" + error, throwable);
        this.code = code;
        this.error = error;
    }

    @Override
    public String getMessage() {
        if (TextUtils.isEmpty(requestUrl)) {
            return super.getMessage();
        } else {
            return super.getMessage() + " | " + requestUrl;
        }
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }

    public String getRequestUrl() {
        return requestUrl;
    }

    public boolean isNormal() {
        return code == NO_CHANGE;
    }


    public String getMsg() {
        return error;
    }

    public int getCode() {
        return code;
    }
}

