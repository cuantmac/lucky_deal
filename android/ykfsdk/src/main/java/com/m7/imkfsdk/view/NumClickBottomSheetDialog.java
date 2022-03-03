package com.m7.imkfsdk.view;

import android.app.Dialog;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import androidx.annotation.NonNull;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.utils.ToastUtils;

/**
 * @author rd
 * @Description 点击号码弹框
 * @date 2020/9/30
 */
public class NumClickBottomSheetDialog extends BottomSheetDialogFragment {

    protected Context mContext;
    protected View rootView;
    protected BottomSheetDialog dialog;
    protected BottomSheetBehavior mBehavior;

    public static NumClickBottomSheetDialog instance(String num) {
        NumClickBottomSheetDialog dialog = new NumClickBottomSheetDialog();
        Bundle args = new Bundle();
        args.putString("num", num);
        dialog.setArguments(args);
        return dialog;
    }

    public NumClickBottomSheetDialog() {

    }


    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        dialog = (BottomSheetDialog) super.onCreateDialog(savedInstanceState);
        Bundle arguments = getArguments();
        assert arguments != null;
        final String num = arguments.getString("num");
        if (rootView == null) {
            rootView = View.inflate(mContext, R.layout.ykf_numclicklay, null);

            TextView tv_num_pop_num = rootView.findViewById(R.id.tv_num_pop_num);
            tv_num_pop_num.setText(num + " " + mContext.getString(R.string.ykf_maybe_telphone));

            TextView tv_callnum = rootView.findViewById(R.id.tv_callnum);
            TextView tv_copynum = rootView.findViewById(R.id.tv_copynum);
            TextView tv_backnum = rootView.findViewById(R.id.tv_backnum);

            tv_callnum.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + num));
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    mContext.startActivity(intent);
                    close(false);
                }
            });

            tv_copynum.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    ClipboardManager cm = (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
                    cm.setText(num);
                    ToastUtils.showShort(mContext, mContext.getString(R.string.ykf_copyok));
                    close(false);
                }
            });

            tv_backnum.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    close(false);
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
}

