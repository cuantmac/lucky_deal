package com.m7.imkfsdk.view;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import androidx.annotation.NonNull;
import com.google.android.material.bottomsheet.BottomSheetBehavior;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.adapter.ChatTagQuestionMoreAdapter;
import com.m7.imkfsdk.utils.DensityUtil;

import java.util.List;
 //分组常见问题 ，查看更多
@SuppressLint("ValidFragment")
public class BottomTabQuestionDialog extends BottomSheetDialogFragment {
    private List<String> list;
    //    private BottomSheetBehavior<View> mBottomSheetBehavior;
    protected Context mContext;
    protected View rootView;
    protected BottomSheetDialog dialog;
    protected BottomSheetBehavior mBehavior;
    private String title="";

    public BottomTabQuestionDialog(String title,List<String> list) {
        this.list = list;
        this.title=title;
    }


    @NonNull
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        dialog = (BottomSheetDialog) super.onCreateDialog(savedInstanceState);
        if (rootView == null) {
            rootView = View.inflate(mContext, R.layout.layout_bottomtabquestion, null);

            TextView id_dialog_question_title=rootView.findViewById(R.id.id_dialog_question_title);
            id_dialog_question_title.setText(title);

            ImageView ivBottomClose = rootView.findViewById(R.id.iv_bottom_close);
            ivBottomClose.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dialog.dismiss();
                }
            });

            RecyclerView rv_switch = rootView.findViewById(R.id.rv_switch);
            rv_switch.setLayoutManager(new LinearLayoutManager(mContext));

            ChatTagQuestionMoreAdapter adapter = new ChatTagQuestionMoreAdapter(list);
            rv_switch.setAdapter(adapter);
            adapter.setOnItemClickListener(new ChatTagQuestionMoreAdapter.onItemClickListener() {
                @Override
                public void OnItemClick(String s) {
                    mListener.OnItemClick(s);
                }
            });
        }

        dialog.setContentView(rootView);
        mBehavior = BottomSheetBehavior.from((View) rootView.getParent());
        mBehavior.setSkipCollapsed(true);
        mBehavior.setHideable(true);
        View bottomSheet = dialog.findViewById(R.id.design_bottom_sheet);
        bottomSheet.setBackgroundColor(mContext.getResources().getColor(R.color.transparent));
        //重置高度
        if (dialog != null) {
//            View bottomSheet = dialog.findViewById(R.id.design_bottom_sheet);
            bottomSheet.getLayoutParams().height = DensityUtil.getScreenRelatedInformation(getContext()) * 3 / 5;
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

     private onQuestionClickListener mListener;

     public interface onQuestionClickListener {
         void OnItemClick(String s);
     }

     public void setonQuestionClickListener(onQuestionClickListener listener) {
         mListener = listener;
     }

}

