package com.m7.imkfsdk.chat.chatrow;

import android.content.Context;
import android.content.Intent;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.ChatActivity;
import com.m7.imkfsdk.chat.ImageViewLookActivity;
import com.m7.imkfsdk.chat.holder.BaseHolder;
import com.m7.imkfsdk.chat.holder.ImageViewHolder;
import com.m7.imkfsdk.utils.DensityUtil;
import com.m7.imkfsdk.utils.GlideUtil;
import com.moor.imkf.model.entity.FromToMessage;

import static android.view.ViewGroup.LayoutParams.WRAP_CONTENT;

/**
 * Created by longwei on 2016/3/10.
 */
public class ImageTxChatRow extends BaseChatRow {


    public ImageTxChatRow(int type) {
        super(type);
    }

    @Override
    public boolean onCreateRowContextMenu(ContextMenu contextMenu, View targetView, FromToMessage detail) {
        return false;
    }

    @Override
    protected void buildChattingData(final Context context, BaseHolder baseHolder, FromToMessage detail, int position) {
        final ImageViewHolder holder = (ImageViewHolder) baseHolder;
        final FromToMessage message = detail;
        if (message != null) {
            FrameLayout.LayoutParams layoutParams= (FrameLayout.LayoutParams) holder.getImageView().getLayoutParams();
            int screenWidth= DensityUtil.getScreenWidth_Height(context )[0];
            int screenHeight= DensityUtil.getScreenWidth_Height(context )[1];
            holder.getImageView().setMaxWidth(screenWidth/2);
            holder.getImageView().setMaxHeight(screenHeight/3);
            layoutParams.width = screenWidth/2;
            layoutParams.height = WRAP_CONTENT;
            holder.getImageView().setLayoutParams(layoutParams);

            GlideUtil.loadImage(context, message.filePath, holder.getImageView());

            holder.getImageView().setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(context, ImageViewLookActivity.class);
                    intent.putExtra("fromwho", 1);//0代表对方发送的
                    intent.putExtra("imagePath", message.filePath);
                    context.startActivity(intent);
                }
            });
            View.OnClickListener listener = ((ChatActivity) context).getChatAdapter().getOnClickListener();
            getMsgStateResId(position, holder, message, listener);
        }
    }

    @Override
    public View buildChatView(LayoutInflater inflater, View convertView) {

        if (convertView == null) {
            convertView = inflater.inflate(R.layout.kf_chat_row_image_tx, null);
            ImageViewHolder holder = new ImageViewHolder(mRowType);
            convertView.setTag(holder.initBaseHolder(convertView, false));
        }

        return convertView;
    }

    @Override
    public int getChatViewType() {
        return ChatRowType.IMAGE_ROW_TRANSMIT.ordinal();
    }
}
