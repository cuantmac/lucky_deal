package com.luckydeal;

import android.app.Activity;
import android.content.Context;
import android.util.AttributeSet;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.luckyapp.common.utils.LogUtil;
import com.luckydeal.view.HorizontalProgressBar;

public class SplashScreen extends FrameLayout {
    HorizontalProgressBar progressBar;

    public SplashScreen(Context context) {
        this(context, null);
    }

    public SplashScreen(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public SplashScreen(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        inflate(context, R.layout.splash_screen, this);
//        progressBar = findViewById(R.id.updateProgressBar);
    }

    public void show() {
        if (getParent() != null) {
            return;
        }
        Activity activity = (Activity) getContext();
        ViewGroup rootView = (ViewGroup) activity.getWindow().getDecorView();
        rootView.addView(this);
    }

    public void hide() {
        post(() -> {
            ViewGroup parent = (ViewGroup) getParent();
            if (parent != null) {
                parent.removeView(this);
            }
        });
    }

    public void updateProgress(int value) {
        progressBar.setProgress(value);
    }
}
