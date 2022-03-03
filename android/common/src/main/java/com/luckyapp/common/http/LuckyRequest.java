package com.luckyapp.common.http;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.luckyapp.common.BuildConfig;
import com.luckyapp.common.mock.MockDataUtils;
import com.luckyapp.common.rxjava.RxUtils;
import com.luckyapp.common.utils.Foreground;
import com.luckyapp.common.utils.LogUtil;
import com.luckyapp.common.utils.NetworkUtils;
import com.luckyapp.common.utils.ToastUtil;
import com.luckyapp.common.widget.CustomProgressDialog;
import com.tencent.bugly.crashreport.CrashReport;

import java.io.IOException;
import java.lang.reflect.Type;

import io.reactivex.functions.Action;
import io.reactivex.functions.Consumer;
import io.reactivex.plugins.RxJavaPlugins;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.HttpException;
import retrofit2.Response;

public class LuckyRequest<R> {

    private Call<R> call;
    private Consumer<R> successConsumer;
    private Consumer<ApiException> errorConsumer;
    private Action finallyAction;
    private Context context;
    private CustomProgressDialog progressDialog;
    private static long lastShowNoError = 0;
    private Type responseType;

    public LuckyRequest(Call<R> call, Type responseType) {
        this.call = call;
        this.responseType = responseType;
    }

    public LuckyRequest<R> withProgress(@Nullable Context context) {
        this.context = context;
        return this;
    }

    public LuckyRequest<R> onSuccess(Consumer<R> consumer) {
        successConsumer = consumer;
        return this;
    }

    public LuckyRequest<R> onError(Consumer<ApiException> consumer) {
        errorConsumer = consumer;
        return this;
    }

    public LuckyRequest<R> onFinally(Action action) {
        finallyAction = action;
        return this;
    }

    public void submit() {
        RxUtils.post(() -> {
            if (isFinishing()) return;
            if (progressDialog == null) {
                progressDialog = CustomProgressDialog.createDialog(context);
            }
            progressDialog.show();
        });
        try {
            String path = call.request().url().encodedPath();
            if (BuildConfig.DEBUG && MockDataUtils.get().hasKey(path)) {
                try {
                    R data = MockDataUtils.get().get(path, responseType);
                    if (data != null && successConsumer != null) {
                        successConsumer.accept(data);
                    }
                } catch (Exception e) {
                    if (errorConsumer != null) {
                        errorConsumer.accept(new ApiException(e));
                    }
                }
                if (finallyAction != null) {
                    finallyAction.run();
                }
                return;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        call.enqueue(new CallCallback());
    }

    public R execute() throws IOException {
        return call.execute().body();
    }

    private boolean isFinishing() {
        if (context instanceof Activity) {
            return ((Activity) context).isFinishing();
        }
        return context == null;
    }

    private class CallCallback implements Callback<R> {

        @Override
        public void onResponse(@NonNull Call<R> call, @NonNull Response<R> response) {
            RxUtils.post(() -> {
                if (!isFinishing() && progressDialog != null) {
                    progressDialog.dismiss();
                }
                if (!response.isSuccessful()) {
                    onFailure(call, new HttpException(response));
                    return;
                }
                try {
                    if (successConsumer != null) {
                        successConsumer.accept(response.body());
                    }
                    if (finallyAction != null) {
                        finallyAction.run();
                    }
                } catch (Exception e) {
                    RxJavaPlugins.onError(e);
                }
            });
        }

        @Override
        public void onFailure(@NonNull Call<R> call, @NonNull Throwable t) {
            if (t instanceof HttpException) {
                HttpException he = (HttpException) t;
                Response response = he.response();
                if (response != null) {
                    try {
                        if (response.errorBody() != null) {
                            LogUtil.e("OkHttp", response.code() + " " + response.message() + " " + response.errorBody().string());
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            } else {
                LogUtil.e("OkHttp", t);
            }
            RxUtils.post(() -> {
                if (!isFinishing() && progressDialog != null) {
                    progressDialog.dismiss();
                }
                try {
                    if (t instanceof ApiException) {
                        ((ApiException) t).setRequestUrl(call.request().url().toString());
                        if (!((ApiException) t).isNormal()) {
                            CrashReport.postCatchedException(t);
                        }
                        if (errorConsumer != null) {
                            errorConsumer.accept((ApiException) t);
                        }
                    } else if (!NetworkUtils.isConnected()) {
                        if (System.currentTimeMillis() - lastShowNoError > 8000 && Foreground.get().isForeground()) {
                            lastShowNoError = System.currentTimeMillis();
                            ToastUtil.postShow(com.luckyapp.common.R.string.check_connection);
                        }
                    } else {
                        //非业务逻辑错误直接弹Toast，业务逻辑错误由上层处理
                        ApiException exception = new ApiException(t);
                        exception.setRequestUrl(call.request().url().toString());
                        if (System.currentTimeMillis() - lastShowNoError > 8000 && Foreground.get().isForeground()) {
                            lastShowNoError = System.currentTimeMillis();
                            ToastUtil.postShow(exception.getMsg());
                        }
                        CrashReport.postCatchedException(exception);
                        if (errorConsumer != null) {
                            errorConsumer.accept(exception);
                        }
                    }
                    if (finallyAction != null) {
                        finallyAction.run();
                    }
                } catch (Exception e) {
                    RxJavaPlugins.onError(e);
                }
            });
        }
    }
}
