package com.m7.imkfsdk.chat.adapter;

import androidx.recyclerview.widget.RecyclerView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.m7.imkfsdk.R;

import java.util.List;
//分组常见问题查看更多 适配器
public class ChatTagQuestionMoreAdapter extends RecyclerView.Adapter<ChatTagQuestionMoreAdapter.ChatTagViewHolder> {
    List<String> datas;

    public ChatTagQuestionMoreAdapter(List<String> datas) {
        this.datas = datas;
    }

    @Override
    public ChatTagViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = View.inflate(parent.getContext(), R.layout.kf_question_moreitem, null);
        return new ChatTagViewHolder(v);
    }

    @Override
    public void onBindViewHolder(ChatTagViewHolder holder, final int position) {
        holder.tvFlowItem.setText(datas.get(position));
        holder.tvFlowItem.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mListener != null) {
                    mListener.OnItemClick(datas.get(position));
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return datas == null ? 0 : datas.size();
    }

    static class ChatTagViewHolder extends RecyclerView.ViewHolder {
        TextView tvFlowItem;

        public ChatTagViewHolder(View itemView) {
            super(itemView);
            tvFlowItem = itemView.findViewById(R.id.tv_question);
        }
    }

    private onItemClickListener mListener;

    public interface onItemClickListener {
        void OnItemClick(String s);
    }

    public void setOnItemClickListener(onItemClickListener listener) {
        mListener = listener;
    }
}
