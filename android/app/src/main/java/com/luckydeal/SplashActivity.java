package com.luckydeal;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.luckyapp.common.report.ReportUtily;
import com.luckyapp.common.utils.LogUtil;
import com.luckydeal.update.UpdateManager;
import com.luckydeal.view.HorizontalProgressBar;

import java.util.WeakHashMap;

/**
 * Description：.
 * Author：Created by YJ_Song on 2020/9/26.
 * Email:  songyuanjin@innotechx.com
 */
public class SplashActivity extends AppCompatActivity {
    public static final String KEY_EXTRA = "extra";
    private HorizontalProgressBar progressBar;
    private static final int MAX_UPDATE_SECONDS = 4000; //4s
    private Bundle mExtras;
    @SuppressLint("HandlerLeak")
    private Handler updateManagerHandler = new Handler() {
        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            int percent = msg.arg1;
            if (percent >= 100) {
                postDelayed(() -> {
                    hideSplash();
                }, 500);
            } else {
                if (UpdateManager.get().needInstallBundle || UpdateManager.get().updated) {
                    if (!UpdateManager.get().updated) {
                        UpdateManager.get().installBundle(UpdateManager.get().getInstanceManager());
                    }
                    Message message = updateManagerHandler.obtainMessage(0, 100, 0);
                    updateManagerHandler.sendMessageDelayed(message, MAX_UPDATE_SECONDS / 100);
                } else {
                    Message message = updateManagerHandler.obtainMessage(0, percent + 1, 0);
                    updateManagerHandler.sendMessageDelayed(message, MAX_UPDATE_SECONDS / 100);
                    if (percent + 1 >= 100) {
                        LogUtil.d("UpdateManager", "下载bundle失败");
                        WeakHashMap<String, String> map = new WeakHashMap<>();
                        map.put("UpdateState", "1");
                        map.put("type", "close");
                        ReportUtily.sendCustomEvent("1", "3", map);
                        UpdateManager.get().startDownLoadTime = 0;
                    }
                }
            }
        }
    };

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.splash_screen);
//        progressBar = findViewById(R.id.updateProgressBar);
        UpdateManager.get().checkUpdate();
        if (updateManagerHandler != null) {
            updateManagerHandler.sendMessage(updateManagerHandler.obtainMessage(0, 0, 0));
        }
        if (MainApplication.startMode == 1) {
            ReportUtily.sendStartAppType(1);
        }
        MainApplication.startMode = 1;
        ReportUtily.sendShowEvent("1", "2");
        handleIntent(getIntent());
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (updateManagerHandler != null) {
            updateManagerHandler.removeCallbacksAndMessages(null);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }

    public void handleIntent(Intent intent) {
        mExtras = intent.getExtras();
    }

    public void hideSplash() {
        Intent intent = new Intent(SplashActivity.this, MainActivity.class);
        if (mExtras != null) {
            intent.putExtra(MainActivity.KEY_EXTRA, mExtras.getString(MainActivity.KEY_EXTRA));
        }
        startActivity(intent);
        finish();
    }
}
