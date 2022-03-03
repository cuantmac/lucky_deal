package com.luckyapp.common.http.convert;

import androidx.annotation.NonNull;

import com.luckyapp.common.http.DownloadRequest;
import com.luckyapp.common.http.LuckyRequest;

import java.lang.annotation.Annotation;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.CallAdapter;
import retrofit2.Retrofit;

public class LuckyCallAdapterFactory extends CallAdapter.Factory {

    public static CallAdapter.Factory create() {
        return new LuckyCallAdapterFactory();
    }

    @Override
    public CallAdapter<?, ?> get(@NonNull Type returnType, @NonNull Annotation[] annotations, @NonNull Retrofit retrofit) {
        Class<?> rawType = getRawType(returnType);
        if (rawType == LuckyRequest.class) {
            if (!(returnType instanceof ParameterizedType)) {
                String name = "LuckyRequest";
                throw new IllegalStateException(name + " return type must be parameterized"
                        + " as " + name + "<Foo> or " + name + "<? extends Foo>");
            }
            Type responseType = getParameterUpperBound(0, (ParameterizedType) returnType);
            return new LuckyCallAdapter<>(responseType, rawType);
        } else if (rawType == DownloadRequest.class) {
            return new LuckyCallAdapter<>(ResponseBody.class, rawType);
        }
        return null;
    }

    public static class LuckyCallAdapter<R> implements CallAdapter<R, Object> {

        private final Type responseType;
        private final Type rawType;

        public LuckyCallAdapter(Type responseType, Type rawType) {
            this.responseType = responseType;
            this.rawType = rawType;
        }

        @NonNull
        @Override
        public Type responseType() {
            return responseType;
        }

        @NonNull
        @Override
        public Object adapt(@NonNull Call<R> call) {
            if (rawType == DownloadRequest.class) {
                return new DownloadRequest((Call<ResponseBody>) call);
            }
            return new LuckyRequest<>(call, responseType);
        }
    }
}
