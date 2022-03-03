package com.luckyapp.common.widget;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.AnimationDrawable;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.luckyapp.common.R;
import com.luckyapp.common.utils.ResUtil;


/**
 * @Title: 当view需要加载获取信息然后显示时使用
 * @Description:
 * @Author: wanghaixiao
 * @Since: 2015/9/14
 * @Version:
 */
public class LoadingView {

    private ViewGroup mParentView;

    private View mLoadView;

    public View mErrorView;

    public ImageView image_error;

    public TextView text_message;

    public TextView tvButton;

    private Context context;

    static AnimationDrawable animation = null;

    public RelativeLayout mLayout;


    /**
     * 当ViewGroup 不为FrameLayout时 请先影藏ViewGroup的所有子View
     */
    public LoadingView(Activity act, ViewGroup viewGroup) {
        this.context = act;
        mLoadView = act.getLayoutInflater().inflate(R.layout.loading_view, null);
        mErrorView = act.getLayoutInflater().inflate(R.layout.loading_view_error, null);
        mParentView = viewGroup;
        mLayout = new RelativeLayout(act);
        init();
    }

    /**
     * 当ViewGroup 不为FrameLayout时 请先影藏ViewGroup的所有子View
     */


    /**
     * 当ViewGroup 不为FrameLayout时 请先影藏ViewGroup的所有子View
     */
    public LoadingView(Activity act, int viewId) {
        this.context = act;
        mLoadView = act.getLayoutInflater().inflate(R.layout.loading_view, null);
        mErrorView = act.getLayoutInflater().inflate(R.layout.loading_view_error, null);
        mParentView = act.getWindow().findViewById(viewId);
        mLayout = new RelativeLayout(act);
        init();
    }


    /**
     * 初始化
     */
    private void init() {

        int height = mParentView.getMinimumHeight();
        if (height == 0) {
            height = LinearLayout.LayoutParams.MATCH_PARENT;
        }
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                height);
        mLayout.setLayoutParams(layoutParams);

        //设置内容样式  居中
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);
        params.addRule(RelativeLayout.CENTER_IN_PARENT);
        mErrorView.setLayoutParams(params);
        mLoadView.setLayoutParams(params);
        mLayout.addView(mLoadView);
        mLayout.addView(mErrorView);
        mParentView.addView(mLayout);


        //addLoadView();

        text_message = mErrorView.findViewById(R.id.loading_error_msg);
        image_error = mErrorView.findViewById(R.id.loading_error_img);
        tvButton = mErrorView.findViewById(R.id.tv_click);
    }

    /**
     * 用完 删除view
     */
    public void removeView() {
        mParentView.removeView(mLayout);
    }

    /**
     * 旋转动画
     */
//    private void addLoadView() {
//
//        ImageView loading = mLoadView.findViewById(R.id.loading_progress);
//
//        animation = (AnimationDrawable) loading
//                .getDrawable();
//        animation.start();
//
//        if (mParentView != null) {
//            mParentView.addView(mLayout, new LinearLayout.LayoutParams(
//                    LinearLayout.LayoutParams.MATCH_PARENT,
//                    LinearLayout.LayoutParams.MATCH_PARENT));
//        }
//        mLoadView.setVisibility(View.GONE);
//        mErrorView.setVisibility(View.GONE);
//        mLayout.setVisibility(View.GONE);
//    }


    /**
     * @see #displayLoadView(String)
     */
    public void displayLoadView() {
        displayLoadView(ResUtil.getString(context, R.string.loadview_message));
    }

    /**
     * @param resId
     * @see #displayLoadView(String)
     */
    public void displayLoadView(int resId) {
        displayLoadView(ResUtil.getString(context, resId));
    }

    /**
     * 显示Loading界面
     *
     * @param msg loading信息
     */
    public void displayLoadView(String msg) {
        mLayout.setVisibility(View.VISIBLE);
        mLoadView.setVisibility(View.VISIBLE);
        mErrorView.setVisibility(View.GONE);
        if (TextUtils.isEmpty(msg)) {
            text_message.setText(msg);
        }
        mLayout.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                // 拦截加载中的事件
            }
        });
        mLayout.setBackgroundColor(ResUtil.getColor(context, R.color.transparent));
        mLoadView.setVisibility(View.VISIBLE);
    }

    public void displayErrorView(final Retry retry) {
        displayErrorView(ResUtil.getString(context, R.string.network_error), retry);
    }

    public void displayErrorView() {
        displayLoadView(null);
    }

    /**
     * 显示错误页
     *
     * @param message
     * @param retry
     */
    public void displayErrorView(String message, final Retry retry) {
        mLoadView.setVisibility(View.GONE);
        mErrorView.setVisibility(View.VISIBLE);
        mLayout.setVisibility(View.VISIBLE);
        mErrorView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 截获onclick，避免点击到后面view的按钮
            }
        });
        mLayout.setBackgroundColor(ResUtil.getColor(context, R.color.white));
        if (message != null) {
            text_message.setText(message);
        }

        if (retry != null) {
            tvButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dismissErrorView();
                    retry.retry();
                }
            });
        }

        mErrorView.invalidate();
    }

    /**
     * 显示错误页
     *
     * @param message
     * @param retry
     */
    public void displayErrorView(int resId, String message, final Retry retry) {
        mLoadView.setVisibility(View.GONE);
        mErrorView.setVisibility(View.VISIBLE);
        mLayout.setVisibility(View.VISIBLE);
        image_error.setBackgroundResource(resId);
        mErrorView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 截获onclick，避免点击到后面view的按钮
            }
        });
        mLayout.setBackgroundColor(ResUtil.getColor(context, R.color.white));
        if (message != null) {
            text_message.setText(message);
        }

        if (retry != null) {
            tvButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dismissErrorView();
                    retry.retry();
                }
            });
        }

        mErrorView.invalidate();
    }

    /**
     * 展示空页面
     */
    public void displayNoDataView(String message, int imageRes, View.OnClickListener listener) {
        mLoadView.setVisibility(View.GONE);
        mErrorView.setVisibility(View.VISIBLE);
        mLayout.setVisibility(View.VISIBLE);
        mErrorView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 截获onclick，避免点击到后面view的按钮
            }
        });
        tvButton.setVisibility(View.INVISIBLE);
        if (message != null) {
            text_message.setText(message);
        } else {
            text_message.setVisibility(View.GONE);
        }
        if (imageRes > 0) {
            image_error.setBackgroundResource(imageRes);
        } else {
            image_error.setVisibility(View.GONE);
        }


        if (listener != null) {
            tvButton.setOnClickListener(listener);
        }

        mErrorView.invalidate();
    }

    /**
     * 展示空页面
     */
    public void displayNoDataView(String message, String btn_text, int imageRes, View.OnClickListener listener) {
        mLoadView.setVisibility(View.GONE);
        mErrorView.setVisibility(View.VISIBLE);
        mLayout.setVisibility(View.VISIBLE);
        mErrorView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 截获onclick，避免点击到后面view的按钮
            }
        });
        //tvButton.setVisibility(View.INVISIBLE);
        if (message != null) {
            text_message.setText(message);
        } else {
            text_message.setVisibility(View.GONE);
        }
        if (imageRes > 0) {
            image_error.setBackgroundResource(imageRes);
        } else {
            image_error.setVisibility(View.GONE);
        }

        if (btn_text != null) {
            tvButton.setText(btn_text);
            tvButton.setVisibility(View.VISIBLE);
        } else {
            tvButton.setVisibility(View.GONE);
        }

        if (listener != null) {
            tvButton.setOnClickListener(listener);
        }

        mErrorView.invalidate();
    }

    public void dismissLoadView() {
        mLoadView.setVisibility(View.GONE);
        mLayout.setVisibility(View.VISIBLE);
        mLayout.setBackgroundColor(Color.TRANSPARENT);
    }

    public void dismissErrorView() {
        mErrorView.setVisibility(View.GONE);
        mLayout.setVisibility(View.VISIBLE);
        mLayout.setBackgroundColor(Color.TRANSPARENT);
    }

    public void dismissLayoutView() {

        mLoadView.setVisibility(View.GONE);
        mErrorView.setVisibility(View.GONE);
        mLayout.setVisibility(View.GONE);
        mLayout.setBackgroundColor(Color.TRANSPARENT);

    }

    public boolean isVisibility() {
        return mLayout.getVisibility() == View.VISIBLE;
    }


    public interface Retry {
        void retry();
    }
}
