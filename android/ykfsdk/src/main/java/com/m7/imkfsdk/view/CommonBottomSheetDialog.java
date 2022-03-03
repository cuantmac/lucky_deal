package com.m7.imkfsdk.view;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import androidx.annotation.NonNull;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.m7.imkfsdk.R;

/**
 * @author rd
 * @Description 通用的底部弹框
 * @date 2020/9/30
 */
public class CommonBottomSheetDialog extends BottomSheetDialogFragment {

    protected Context mContext;
    protected View rootView;
    protected BottomSheetDialog dialog;
    protected BottomSheetBehavior mBehavior;

    public static CommonBottomSheetDialog instance(String title, String positive, String negative) {
        CommonBottomSheetDialog dialog = new CommonBottomSheetDialog();
        Bundle args = new Bundle();
        args.putString("title", title);
        args.putString("positive", positive);
        args.putString("negative", negative);
        dialog.setArguments(args);
        return dialog;
    }

    public CommonBottomSheetDialog() {

    }


    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        dialog = (BottomSheetDialog) super.onCreateDialog(savedInstanceState);
        Bundle arguments = getArguments();
        assert arguments != null;
        String title = arguments.getString("title");
        String positive = arguments.getString("positive");
        String negative = arguments.getString("negative");
        if (rootView == null) {
            rootView = View.inflate(mContext, R.layout.layout_common_bottomsheet, null);
            ImageView ivBottomClose = rootView.findViewById(R.id.iv_bottom_close);
            ivBottomClose.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    close(false);
                }
            });
            TextView tv_common_title = rootView.findViewById(R.id.tv_common_title);
            TextView tv_common_left = rootView.findViewById(R.id.tv_common_left);
            TextView tv_common_right = rootView.findViewById(R.id.tv_common_right);
            if (TextUtils.isEmpty(positive)) {
                tv_common_left.setVisibility(View.GONE);
            }else {
                tv_common_left.setVisibility(View.VISIBLE);
            }
            if (TextUtils.isEmpty(negative)) {
                tv_common_right.setVisibility(View.GONE);
            }else {
                tv_common_right.setVisibility(View.VISIBLE);
            }
            tv_common_title.setText(title);
            tv_common_left.setText(positive);
            tv_common_right.setText(negative);
            tv_common_left.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) {
                        listener.onClickPositive();
                    }
                }
            });
            tv_common_right.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) {
                        listener.onClickNegative();
                    }
                }
            });
        }

        dialog.setContentView(rootView);
        mBehavior = BottomSheetBehavior.from((View) rootView.getParent());
        mBehavior.setSkipCollapsed(true);
        mBehavior.setHideable(true);
        View bottomSheet = dialog.findViewById(R.id.design_bottom_sheet);
        bottomSheet.setBackgroundColor(mContext.getResources().getColor(R.color.transparent));

        rootView.post(new Runnable() {
            @Override
            public void run() {
                mBehavior.setPeekHeight(rootView.getHeight());
            }
        });
        return dialog;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        this.mContext = context;
    }

    @Override
    public void onStart() {
        super.onStart();
        mBehavior.setState(BottomSheetBehavior.STATE_EXPANDED);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        ((ViewGroup) (rootView.getParent())).removeView(rootView);
    }


    public boolean isShowing() {
        return dialog != null && dialog.isShowing();
    }

    public void close(boolean isAnimation) {
        if (isAnimation) {
            if (mBehavior != null)
                mBehavior.setState(BottomSheetBehavior.STATE_HIDDEN);
        } else {
            dismiss();
        }
    }

    private OnClickListener listener;

    public interface OnClickListener {
        void onClickPositive();

        void onClickNegative();
    }

    public void setListener(OnClickListener listener) {
        this.listener = listener;
    }

}

