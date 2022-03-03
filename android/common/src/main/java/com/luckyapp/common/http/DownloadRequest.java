package com.luckyapp.common.http;

import android.util.Log;

import androidx.annotation.NonNull;

import com.luckyapp.common.rxjava.RxUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2019-11-12
 * Desc: written for luckyday project.
 */
public class DownloadRequest {

    private static final String TAG = "DownloadRequest";
    private Call<ResponseBody> call;
    private DownloadListener listener;

    public DownloadRequest(Call<ResponseBody> call) {
        this.call = call;
    }

    public void submit(String filePath, DownloadListener listener) {
        this.listener = listener;
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                ResponseBody body = response.body();
                if (response.isSuccessful() && body != null) {
                    RxUtils.run(() -> {
                        saveToDisk(body, filePath);
                    });
                } else {
                    if (listener != null) {
                        String errorMsg = "error code: " + response.code();
                        ResponseBody errorBody = response.errorBody();
                        if (errorBody != null) {
                            try {
                                errorMsg += " msg: " + errorBody.string();
                            } catch (IOException ignored) {
                            }
                        }
                        listener.onError(new IOException(errorMsg));
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {
                if (listener != null) {
                    listener.onError(t);
                }
            }
        });
    }

    private void saveToDisk(ResponseBody body, String filePath) {
        try {

            File destinationFile = new File(filePath);

            InputStream inputStream = null;
            OutputStream outputStream = null;

            try {
                long progressTime = System.currentTimeMillis();
                inputStream = body.byteStream();
                outputStream = new FileOutputStream(destinationFile);
                byte[] data = new byte[4096];
                int count;
                int progress = 0;
                long fileSize = body.contentLength();
                Log.d(TAG, "File Size=" + fileSize);
                while ((count = inputStream.read(data)) != -1) {
                    outputStream.write(data, 0, count);
                    progress += count;
                    if (listener != null && System.currentTimeMillis() - progressTime > 16) {
                        listener.onProgress((int) Math.ceil(progress * 100f / fileSize));
                        progressTime = System.currentTimeMillis();
                    }
                }

                outputStream.flush();

                Log.d(TAG, destinationFile.getParent());
                if (listener != null) {
                    listener.onProgress(100);
                    listener.onSuccess();
                }
            } catch (IOException e) {
                e.printStackTrace();
                if (listener != null) {
                    listener.onProgress(100);
                    listener.onError(e);
                }
                Log.d(TAG, "Failed to save the file!");
            } finally {
                if (inputStream != null) inputStream.close();
                if (outputStream != null) outputStream.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
            if (listener != null) {
                listener.onError(e);
            }
            Log.d(TAG, "Failed to save the file!");
        }
    }

    public interface DownloadListener {
        void onProgress(int progress);
        void onSuccess();
        void onError(Throwable throwable);
    }
}
