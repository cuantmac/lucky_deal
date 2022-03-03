package com.m7.imkfsdk.chat.chatrow;

import android.content.Context;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.View;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.holder.BaseHolder;
import com.m7.imkfsdk.chat.holder.TripHolder;
import com.m7.imkfsdk.chat.holder.UnknownHolder;
import com.moor.imkf.model.entity.FromToMessage;
import com.moor.imkf.utils.NullUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class UnknownRxChatRow extends BaseChatRow{


    public UnknownRxChatRow(int type) {
        super(type);
    }

    @Override
    public View buildChatView(LayoutInflater inflater, View convertView) {
        if(convertView == null) {
            convertView = inflater.inflate(R.layout.kf_chat_row_unknown, null);
            UnknownHolder holder = new UnknownHolder(mRowType);
            convertView.setTag(holder.initBaseHolder(convertView, true));
        }
        return convertView;
    }

    @Override
    public int getChatViewType() {
        return ChatRowType.TAB_QUESTION_UNKNOWN.ordinal();
    }

    @Override
    public boolean onCreateRowContextMenu(ContextMenu contextMenu, View targetView, FromToMessage detail) {
        return false;
    }

    @Override
    protected void buildChattingData(Context context, BaseHolder baseHolder, FromToMessage detail, int position) {

        UnknownHolder holder = (UnknownHolder) baseHolder;
        final FromToMessage message = detail;
        if (message != null) {
//
        }
    }
}
