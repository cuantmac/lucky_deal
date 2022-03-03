package com.m7.imkfsdk.chat.chatrow;

import android.content.Context;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.View;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.ChatActivity;
import com.m7.imkfsdk.chat.holder.BaseHolder;
import com.m7.imkfsdk.chat.holder.InvestigateCancelViewHolder;
import com.m7.imkfsdk.chat.holder.ViewHolderTag;
import com.moor.imkf.model.entity.FromToMessage;

/**
 * Created by longwei on 2016/3/9.
 */
public class InvestigateCancelRxChatRow extends BaseChatRow {

    public InvestigateCancelRxChatRow(int type) {
        super(type);
    }

    @Override
    public boolean onCreateRowContextMenu(ContextMenu contextMenu, View targetView, FromToMessage detail) {
        return false;
    }

    @Override
    protected void buildChattingData(Context context, BaseHolder baseHolder, FromToMessage detail, int position) {
        final InvestigateCancelViewHolder holder = (InvestigateCancelViewHolder) baseHolder;

        if (detail != null) {
            View.OnClickListener listener = ((ChatActivity) context).getChatAdapter().getOnClickListener();
            ViewHolderTag holderTag = ViewHolderTag.createTag(detail, ViewHolderTag.TagType.TAG_CLICK_SHOW_INVESTIGATECANCEL, position);
            holder.chatting_tv_to_investigate.setTag(holderTag);
            holder.chatting_tv_to_investigate.setOnClickListener(listener);
        }
    }

    @Override
    public View buildChatView(LayoutInflater inflater, View convertView) {

        if (convertView == null) {
            convertView = inflater.inflate(R.layout.kf_chat_row_investigate_canlel_rx, null);
            InvestigateCancelViewHolder holder = new InvestigateCancelViewHolder(mRowType);
            convertView.setTag(holder.initBaseHolder(convertView, true));
        }

        return convertView;
    }

    @Override
    public int getChatViewType() {
        return ChatRowType.INVESTIGATE_CANCEL_RECEIVED.ordinal();
    }
}
