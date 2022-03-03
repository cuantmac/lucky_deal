package com.luckyapp.common.http;

import com.luckyapp.common.BuildConfig;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.http.convert.LuckyCallAdapterFactory;
import com.luckyapp.common.http.convert.LuckyConverterFactory;
import com.luckyapp.common.utils.LogUtil;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2019-09-30
 * Desc: written for luckyday project.
 */
public class ApiManager {

    //请求超时
    private static final int DEFAULT_TIMEOUT = 30;

    private ApiService apiService;

    private ApiManager() {
        initRetrofit();
    }

    public static ApiService get() {
        return Holder.INSTANCE.apiService;
    }

    private static class Holder {
        private static final ApiManager INSTANCE = new ApiManager();
    }

    private void initRetrofit() {
        OkHttpClient.Builder httpClientBuilder = new OkHttpClient.Builder();

        httpClientBuilder.connectTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS);
        httpClientBuilder.readTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS);
        httpClientBuilder.writeTimeout(DEFAULT_TIMEOUT, TimeUnit.SECONDS);

        if (LogUtil.isLogEnable()) {
            HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
            loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BASIC);
            httpClientBuilder.addInterceptor(loggingInterceptor);
        }
//        httpClientBuilder.dns(OkHttpDns.getInstance(GlobalApp.get()));
        httpClientBuilder.addInterceptor(new BaseInterceptor());

        Retrofit retrofit = new Retrofit.Builder()
                .client(httpClientBuilder.build())
                .addConverterFactory(LuckyConverterFactory.create())
                .addCallAdapterFactory(LuckyCallAdapterFactory.create())
                .baseUrl(BuildConfig.BASE_URL)
                .build();

        apiService = retrofit.create(ApiService.class);
    }
}
