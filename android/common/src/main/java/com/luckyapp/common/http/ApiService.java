package com.luckyapp.common.http;


import com.luckyapp.common.bean.NoResultBean;

import java.util.Map;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.HeaderMap;
import retrofit2.http.POST;
import retrofit2.http.Streaming;
import retrofit2.http.Url;


/**
 * Created by wang on 2018/8/8.
 */

public interface ApiService {
    /**
     * 获取上报google Play 下载渠道
     */
    @POST("user/report")
    LuckyRequest<NoResultBean> setInstallRefer(@Body Map<String, Object> body);

    /**
     * 通用POST请求
     */
    @POST
    LuckyRequest<String> post(@Url String url, @Body Map<String, Object> body);

    /**
     * 通用GET请求
     */
    @GET
    LuckyRequest<String> get(@Url String url, @HeaderMap Map<String, Object> headers);

    @GET
    @Streaming
    Call<ResponseBody> download(@Url String url);
}
