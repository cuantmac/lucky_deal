package com.m7.imkfsdk.chat;

import android.annotation.SuppressLint;
import android.app.DialogFragment;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.listener.SubmitPingjiaListener;
import com.m7.imkfsdk.chat.model.Option;
import com.m7.imkfsdk.utils.AntiShake;
import com.m7.imkfsdk.view.TagView;
import com.moor.imkf.IMChat;
import com.moor.imkf.IMChatManager;
import com.moor.imkf.listener.SubmitInvestigateListener;
import com.moor.imkf.model.entity.Investigate;

import java.util.ArrayList;
import java.util.List;

/**
 * 评价列表界面
 */
@SuppressLint("ValidFragment")
public class InvestigateDialog extends DialogFragment {

    private RadioGroup investigateRadioGroup;
    private TagView investigateTag;
    private EditText investigateEt;
    private final SubmitPingjiaListener submitListener;
    private List<Investigate> investigates = new ArrayList<>();
    private String name, value;
    private List<Option> selectLabels = new ArrayList<>();
    private boolean labelRequired;
    private boolean proposalRequired;
    private final String way;//in:访客主动评价，out：坐席推送或者是系统（点击注销或者是返回键）评价
    private final String connectionId;
    private final String sessionId;
    private AntiShake shake=new AntiShake();

    @SuppressLint("ValidFragment")
    private InvestigateDialog(String type, String connectionId, String sessionId, SubmitPingjiaListener submitListener) {
        super();
        this.submitListener = submitListener;
        this.way = type;
        this.connectionId = connectionId;
        this.sessionId = sessionId;
    }

    @NonNull
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        getDialog().setTitle("提交评价");

        getDialog().setCanceledOnTouchOutside(false);
        //屏蔽返回键
        getDialog().setOnKeyListener(new DialogInterface.OnKeyListener() {
            @Override
            public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK) {
                    return true;
                }
                return false;
            }
        });
        SharedPreferences sp = getActivity().getSharedPreferences("moordata", 0);

        // Get the layout inflater
        View view = inflater.inflate(R.layout.kf_dialog_investigate, null);
        TextView investigateTitleTextView = (TextView) view.findViewById(R.id.investigate_title);
        investigateRadioGroup = (RadioGroup) view.findViewById(R.id.investigate_rg);
        investigateTag = (TagView) view.findViewById(R.id.investigate_second_tg);
        Button investigateOkBtn = (Button) view.findViewById(R.id.investigate_save_btn);
        Button investigateCancelBtn = (Button) view.findViewById(R.id.investigate_cancel_btn);
        investigateEt = (EditText) view.findViewById(R.id.investigate_et);
        investigates = IMChatManager.getInstance().getInvestigate();

        initView();

        investigateTag.setOnSelectedChangeListener(new TagView.OnSelectedChangeListener() {
            @Override
            public void getTagList(List<Option> options) {
                selectLabels = options;
            }
        });

        String satisfyTitle = sp.getString("satisfyTitle", "感谢您使用我们的服务，请为此次服务评价！");
        if (satisfyTitle.equals("")) {
            satisfyTitle = "感谢您使用我们的服务，请为此次服务评价！";
        }
        investigateTitleTextView.setText(satisfyTitle);
        String satifyThank = sp.getString("satisfyThank", "感谢您对此次服务做出评价，祝您生活愉快，再见！");
        if (satifyThank.equals("")) {
            satifyThank = "感谢您对此次服务做出评价，祝您生活愉快，再见！";
        }

        final String finalSatifyThank = satifyThank;


        investigateOkBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {



                if (proposalRequired) {
                    if (investigateEt.getText().toString().trim().length() == 0) {
                        Toast.makeText(getActivity(), "请填写满意度评价原因", Toast.LENGTH_SHORT).show();
                        return;
                    }
                }
                final List<String> labels = new ArrayList<>();
                if (selectLabels.size() > 0) {
                    for (Option option : selectLabels) {
                        labels.add(option.name);
                    }
                }
                if (labelRequired) {
                    if (labels.size() == 0) {
                        Toast.makeText(getActivity(), "请选择满意度评价标签", Toast.LENGTH_SHORT).show();
                        return;
                    }
                }
                if (name == null) {
                    Toast.makeText(getActivity(), "请选择评价选项", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (shake.check()) {
                    return;
                }

                IMChatManager.getInstance().submitInvestigate(sessionId, connectionId, way, name, value, labels, investigateEt.getText().toString().trim(), new SubmitInvestigateListener() {
                    @Override
                    public void onSuccess() {
                        StringBuilder label = new StringBuilder();
                        if (labels.size() > 0) {
                            for (int i = 0; i < labels.size(); i++) {
                                label.append(labels.get(i));
                                if (i != labels.size() - 1) {
                                    label.append(",");
                                }
                            }
                        }
                        String content = "用户已评价: " + name + "; 标签: " + label + "; 详细信息: " + investigateEt.getText().toString().trim();
                        submitListener.OnSubmitSuccess(content,finalSatifyThank);

                        dismiss();
                    }

                    @Override
                    public void onFailed() {
                        submitListener.OnSubmitFailed();
                        Toast.makeText(getActivity(), "评价提交失败", Toast.LENGTH_SHORT).show();
                        dismiss();
                    }
                });
            }
        });

        investigateCancelBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                submitListener.OnSubmitCancle();
                dismiss();
            }
        });
        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));


        return view;
    }

    private void initView() {
        for (int i = 0; i < investigates.size(); i++) {
            final Investigate investigate = investigates.get(i);
            RadioButton radioButton = new RadioButton(getActivity());
            radioButton.setMaxEms(50);
            radioButton.setEllipsize(TextUtils.TruncateAt.END);
            radioButton.setText(" " + investigate.name + "  ");
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams
                    (LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            params.setMargins(7, 7, 10, 7);
            radioButton.setLayoutParams(params);
            Drawable drawable = ContextCompat.getDrawable(getActivity(), R.drawable.kf_radiobutton_selector);
            drawable.setBounds(0, 0, drawable.getMinimumWidth(), drawable.getMinimumHeight());
            radioButton.setCompoundDrawables(drawable, null, null, null);
            radioButton.setButtonDrawable(null);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                radioButton.setBackground(null);
            }
            investigateRadioGroup.addView(radioButton);

            final int finalI = i;
            radioButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    List<Option> options = new ArrayList<>();
                    for (String reason : investigates.get(finalI).reason) {
                        Option option = new Option();
                        option.name = reason;
                        options.add(option);
                        name = investigates.get(finalI).name;
                        value = investigates.get(finalI).value;
                        labelRequired = investigates.get(finalI).labelRequired;
                        proposalRequired = investigates.get(finalI).proposalRequired;
                    }
                    if (investigates.get(finalI).reason.size() == 0) {
                        name = investigates.get(finalI).name;
                        value = investigates.get(finalI).value;
                        labelRequired = investigates.get(finalI).labelRequired;
                        proposalRequired = investigates.get(finalI).proposalRequired;
                    }
                    investigateTag.initTagView(options, 1);
                }
            });
        }
    }

    @Override
    public void show(android.app.FragmentManager manager, String tag) {
        if (!this.isAdded()) {
            try {
                super.show(manager, tag);
            } catch (Exception e) {
            }
        }
    }

    @Override
    public void dismiss() {
        try {
            IMChat.getInstance().setNewinvestigate("");//删除本次坐席主动推送字段
            super.dismiss();
        } catch (Exception e) {
        }
    }

    public static final class Builder {
        private String type;
        private String connectionId;
        private String sessionId;
        private SubmitPingjiaListener submitListener;

        public Builder setType(String type) {
            this.type = type;
            return this;
        }

        public Builder setConnectionId(String connectionId) {
            this.connectionId = connectionId;
            return this;
        }

        public Builder setSessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }

        public Builder setSubmitListener(SubmitPingjiaListener submitListener) {
            this.submitListener = submitListener;
            return this;
        }

        public Builder() {

        }

        public InvestigateDialog build() {
            return new InvestigateDialog(type, connectionId, sessionId, submitListener);
        }
    }
}
