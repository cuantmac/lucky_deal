package com.luckydeal.view;

import android.content.Context;
import android.content.Intent;
import android.content.res.TypedArray;
import android.provider.Settings;
import android.util.AttributeSet;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.content.ContextCompat;

import com.luckydeal.R;

public class EmptyLayout extends FrameLayout implements View.OnClickListener {

    private View bgLayout;
    private ImageView iconView;
    private TextView titleView;
    //private View networkLayout;
    //private TextView ivTry;
    //private TextView ivOpenNetwork;
    private OnRetryListener onRetryListener;

    public EmptyLayout(Context context) {
        this(context, null);
    }

    public EmptyLayout(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public EmptyLayout(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        inflate(context, R.layout.layout_empty, this);
        bgLayout = findViewById(R.id.bgLayout);
        iconView = findViewById(R.id.iconView);
        titleView = findViewById(R.id.titleView);
//        networkLayout = findViewById(R.id.networkLayout);
//        ivTry = findViewById(R.id.iv_try);
//        ivOpenNetwork = findViewById(R.id.iv_open_network);


//        ivOpenNetwork.setOnClickListener(this);
//        ivTry.setOnClickListener(this);
    }

    public void setEmptyColor(int color) {
        bgLayout.setBackgroundColor(color);
    }

    public void setShowRetry(boolean show) {
        if (show) {
            //networkLayout.setVisibility(VISIBLE);
            iconView.setImageResource(R.mipmap.img_network_error);
            titleView.setText(getContext().getString(R.string.network_error));
        } else {
            //networkLayout.setVisibility(GONE);
            iconView.setImageResource(R.mipmap.img_no_message);
            titleView.setText(getContext().getString(R.string.no_message));
        }
    }

    public void setOnRetryListener(OnRetryListener onRetryListener) {
        this.onRetryListener = onRetryListener;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
//            case R.id.iv_try:
//                if (onRetryListener != null) {
//                    onRetryListener.onRetry();
//                }
//                break;
//            case R.id.iv_open_network:
//                Intent intent = new Intent(Settings.ACTION_WIRELESS_SETTINGS);
//                getContext().startActivity(intent);
//                break;
            default:
                break;

        }
    }

    public interface OnRetryListener {
        void onRetry();
    }
}
