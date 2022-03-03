package com.luckyapp.common.widget;

/**************************************************************************************
 * [Project]
 *       MyProgressDialog
 * [Package]
 *       com.lxd.widgets
 * [FileName]
 *       CustomProgressDialog.java
 **************************************************************************************/


import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.animation.LinearInterpolator;
import android.widget.ImageView;
import android.widget.TextView;

import com.luckyapp.common.R;


public class CustomProgressDialog extends Dialog {


    private Context context = null;

    private ImageView imageView;

    // private CustomProgressDialog customProgressDialog = null;

    public CustomProgressDialog(Context context) {
        super(context);
        this.context = context;
    }

    public CustomProgressDialog(Context context, int theme) {
        super(context, theme);
        this.context = context;
    }

    public static CustomProgressDialog createDialog(Context context) {
        CustomProgressDialog customProgressDialog = new CustomProgressDialog(
                context, R.style.CustomProgressDialog);
        View v = View.inflate(context, R.layout.view_customprogressdialog, null);
        customProgressDialog.setContentView(v);
//        WindowManager.LayoutParams layoutParams = customProgressDialog.getWindow().getAttributes();
//        layoutParams.width = WindowManager.LayoutParams.MATCH_PARENT;
//        layoutParams.height = WindowManager.LayoutParams.MATCH_PARENT;
//        customProgressDialog.getWindow().getAttributes().gravity = Gravity.CENTER;
        customProgressDialog.setCanceledOnTouchOutside(false);
        return customProgressDialog;
    }

    public void onWindowFocusChanged(boolean hasFocus) {
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        imageView = findViewById(R.id.loadingImageView);
    }

    @Override
    public void dismiss() {
        if (imageView != null) {
            imageView.clearAnimation();
        }
        super.dismiss();
    }

    /**
     * @param strMessage
     * @return
     */
    public void setMessage(String strMessage) {
        TextView tvMsg = findViewById(R.id.tv_loadingmsg);
        if (tvMsg != null) {
            tvMsg.setText(strMessage);
        }
    }

    /**
     * @param strMessageId
     * @return
     */
    public void setMessage(int strMessageId) {
        TextView tvMsg = findViewById(R.id.tv_loadingmsg);
        if (tvMsg != null) {
            tvMsg.setText(strMessageId);
        }
    }

    @Override
    public void show() {
        super.show();
        if (imageView != null) {
            imageView.clearAnimation();
            imageView.post(() -> {
                Animation ani = AnimationUtils.loadAnimation(context,
                        R.anim.progress_round);
                ani.setInterpolator(new LinearInterpolator());
                imageView.startAnimation(ani);
            });
        }
    }
}