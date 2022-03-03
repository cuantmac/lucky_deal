package com.m7.imkfsdk.view;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import androidx.annotation.NonNull;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import androidx.recyclerview.widget.RecyclerView;

import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.adapter.QuetionParentAdapter;
import com.m7.imkfsdk.chat.model.CommonQuestionBean;
import com.m7.imkfsdk.utils.DensityUtil;

import java.util.List;

/**
 * @author rd
 * @Description 常见问题弹框
 * @date 2020/9/30
 */
@SuppressLint("ValidFragment")
public class BottomSheetQuestionDialog extends BottomSheetDialogFragment {

    protected Context mContext;
    protected View rootView;
    protected BottomSheetDialog dialog;
    protected BottomSheetBehavior mBehavior;

    private List<CommonQuestionBean> mList;

    public BottomSheetQuestionDialog(List<CommonQuestionBean> list) {
        this.mList = list;
    }


    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        dialog = (BottomSheetDialog) super.onCreateDialog(savedInstanceState);
        Bundle arguments = getArguments();
        assert arguments != null;
        if (rootView == null) {
            rootView = View.inflate(mContext, R.layout.layout_question_bottomsheet, null);
            ImageView ivBottomClose = rootView.findViewById(R.id.iv_bottom_close);
            ivBottomClose.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    close(false);
                }
            });
            RecyclerView recyclerView = rootView.findViewById(R.id.rv_question);
            QuetionParentAdapter adapter = new QuetionParentAdapter(mContext, mList);
            recyclerView.setAdapter(adapter);

        }

        dialog.setContentView(rootView);
        mBehavior = BottomSheetBehavior.from((View) rootView.getParent());
        mBehavior.setSkipCollapsed(true);
        mBehavior.setHideable(true);
        View bottomSheet = dialog.findViewById(R.id.design_bottom_sheet);
        bottomSheet.setBackgroundColor(mContext.getResources().getColor(R.color.transparent));
        //重置高度
        if (dialog != null) {
//            mBehavior.setBottomSheetCallback(mBottomSheetBehaviorCallback);
            bottomSheet.getLayoutParams().height = DensityUtil.getScreenRelatedInformation(getContext()) * 4 / 5;
        }
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

