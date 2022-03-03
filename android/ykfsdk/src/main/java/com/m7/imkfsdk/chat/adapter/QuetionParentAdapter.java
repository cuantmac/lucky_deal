package com.m7.imkfsdk.chat.adapter;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.model.CommonQuestionBean;
import com.m7.imkfsdk.chat.model.DetailsQuestionBean;
import com.moor.imkf.http.HttpManager;
import com.moor.imkf.listener.HttpResponseListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * @FileName: LogisticsInfoRxListAdapter
 * @Description: 常见问题列表adapter
 * @Author:R-D
 * @CreatDate: 2019-12-03 10:31
 * @Reviser:
 * @Modification Time:2019-12-03 10:31
 */
public class QuetionParentAdapter extends RecyclerView.Adapter<QuetionParentAdapter.ViewHolder> {

    private List<CommonQuestionBean> list;
    private Context mContext;
    private ArrayList<DetailsQuestionBean> detailsQuestionBeans = new ArrayList<>();

    public QuetionParentAdapter(Context context, List<CommonQuestionBean> list) {
        this.mContext = context;
        this.list = list;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View inflate = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_question_parent, viewGroup, false);
        return new ViewHolder(inflate);
    }

    @Override
    public void onBindViewHolder(@NonNull final ViewHolder viewHolder, final int i) {
        viewHolder.tv_commonQuetion.setText(list.get(i).getTabContent());
        viewHolder.rl_OneQuestion.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(final View view) {
                if (viewHolder.rv_question_child.isShown()) {
                    viewHolder.iv_tip.setImageResource(R.drawable.kf_icon_question_down);
                    viewHolder.rv_question_child.setVisibility(View.GONE);
                }else {
                    viewHolder.iv_tip.setImageResource(R.drawable.kf_icon_question_up);
                    HttpManager.getDetailQuestions(list.get(i).getTabId(), 1, 30, new HttpResponseListener() {
                        @Override
                        public void onSuccess(String responseStr) {
                            try {
                                viewHolder.rv_question_child.setVisibility(View.VISIBLE);
                                JSONObject jsonObject = new JSONObject(responseStr);
                                JSONArray list = jsonObject.getJSONArray("list");
                                if (list.length() > 0) {
                                    for (int i = 0; i < list.length(); i++) {
                                        JSONObject jsonObject1 = list.getJSONObject(i);
                                        DetailsQuestionBean detailsQuestionBean = new DetailsQuestionBean();
                                        detailsQuestionBean.setQuestionId(jsonObject1.getString("_id"));
                                        detailsQuestionBean.setTitle(jsonObject1.getString("title"));
                                        detailsQuestionBeans.add(detailsQuestionBean);
                                    }
                                    QuestionChildAdapter detailQuestionAdapter = new QuestionChildAdapter(detailsQuestionBeans);
                                    viewHolder.rv_question_child.setAdapter(detailQuestionAdapter);
                                } else {
                                    viewHolder.rv_question_child.setVisibility(View.GONE);
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }

                        @Override
                        public void onFailed() {

                        }
                    });
                }

            }
        });
        if (i == list.size() - 1) {
            viewHolder.view_line.setVisibility(View.GONE);
        } else {
            viewHolder.view_line.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        public final TextView tv_commonQuetion;
        public final RelativeLayout rl_OneQuestion;
        public final View view_line;
        public final ImageView iv_tip;
        public final RecyclerView rv_question_child;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            tv_commonQuetion = itemView.findViewById(R.id.tv_commonQuetion);
            rl_OneQuestion = itemView.findViewById(R.id.rl_OneQuestion);
            view_line = itemView.findViewById(R.id.view_line);
            iv_tip = itemView.findViewById(R.id.iv_tip);
            rv_question_child = itemView.findViewById(R.id.rv_question_child);
        }

    }

}
