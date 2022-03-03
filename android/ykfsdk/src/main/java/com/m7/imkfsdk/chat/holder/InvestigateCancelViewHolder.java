package com.m7.imkfsdk.chat.holder;

import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.view.VoiceAnimImageView;

/**
 * Created by longwei on 2016/3/9.
 */
public class InvestigateCancelViewHolder extends BaseHolder {

    public TextView contentTv;
    public TextView chatting_tv_to_investigate;
    public TextView tv_investigate_content;

    /**
     * @param type
     */
    public InvestigateCancelViewHolder(int type) {
        super(type);

    }

    public BaseHolder initBaseHolder(View baseView, boolean receive) {
        super.initBaseHolder(baseView);
        chattingTime = ((TextView) baseView.findViewById(R.id.chatting_time_tv));
        if (!receive) {
            tv_investigate_content = (TextView) baseView.findViewById(R.id.tv_investigate_content);
        } else {
            chatting_tv_to_investigate = ((TextView) baseView.findViewById(R.id.chatting_tv_to_investigate));
            uploadState = ((ImageView) baseView.findViewById(R.id.chatting_state_iv));
            contentTv = ((TextView) baseView.findViewById(R.id.chatting_content_itv));
        }
        return this;
    }


}
