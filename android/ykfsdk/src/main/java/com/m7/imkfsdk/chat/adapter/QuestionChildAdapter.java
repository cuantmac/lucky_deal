package com.m7.imkfsdk.chat.adapter;

import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.model.DetailsQuestionBean;
import com.moor.imkf.IMChat;
import com.moor.imkf.IMMessage;
import com.moor.imkf.event.QuestionEvent;
import com.moor.imkf.listener.ChatListener;
import com.moor.imkf.model.entity.FromToMessage;
import com.moor.imkf.utils.LogUtils;

import org.greenrobot.eventbus.EventBus;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;

/**
 * @Description:
 * @Author: R-D
 * @Date: 2019-12-27
 */
public class QuestionChildAdapter extends RecyclerView.Adapter<QuestionChildAdapter.SwipeHolder> {
    private List<DetailsQuestionBean> list;

    public QuestionChildAdapter(List<DetailsQuestionBean> list) {
        this.list = list;
    }

    @Override
    public SwipeHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View inflate = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_question_child, viewGroup, false);
        return new SwipeHolder(inflate);
    }

    @Override
    public void onBindViewHolder(SwipeHolder viewHolder, final int i) {
        viewHolder.tv_detailQuestion.setText(list.get(i).getTitle());
        viewHolder.rl_item.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                ToastUtils.showShort("点击了" + list.get(i).getTitle() + list.get(i).getQuestionId());
                String title = list.get(i).getTitle();
                try {
                    final String content = URLEncoder.encode("【常见问题】" + title, "utf-8");

                    FromToMessage questionMessage = IMMessage.createQuestionMessage(content);
                    IMChat.getInstance().sendQuestionMsg(list.get(i).getQuestionId(), content, questionMessage, new ChatListener() {
                        @Override
                        public void onSuccess(String msg) {
//                            ToastUtils.showShort("发送成功了");

                            EventBus.getDefault().post(new QuestionEvent());
                        }

                        @Override
                        public void onFailed(String msg) {
                            LogUtils.eTag("SendMessage", msg);
                        }

                        @Override
                        public void onProgress(int progress) {

                        }
                    });
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }

            }
        });
        if (i==list.size()-1) {
            viewHolder.view_line.setVisibility(View.GONE);
        }else {
            viewHolder.view_line.setVisibility(View.VISIBLE);
        }

    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public static class SwipeHolder extends RecyclerView.ViewHolder {

        public final TextView tv_detailQuestion;
        public final RelativeLayout rl_item;
        public final View view_line;

        SwipeHolder(View itemView) {
            super(itemView);
            tv_detailQuestion = itemView.findViewById(R.id.tv_detailQuestion);
            rl_item = itemView.findViewById(R.id.rl_item);
            view_line = itemView.findViewById(R.id.view_line);
        }

    }
}
