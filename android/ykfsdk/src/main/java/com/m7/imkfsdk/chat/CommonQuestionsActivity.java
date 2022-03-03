package com.m7.imkfsdk.chat;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.appcompat.widget.Toolbar;
import android.view.View;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.adapter.CommonQuetionAdapter;
import com.m7.imkfsdk.chat.model.CommonQuestionBean;
import com.m7.imkfsdk.utils.statusbar.StatusBarUtils;
import com.moor.imkf.http.HttpManager;
import com.moor.imkf.listener.HttpResponseListener;
import com.moor.imkf.event.QuestionEvent;
import com.moor.imkf.utils.LogUtils;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * @FileName: CommonProblemsActivity
 * @Description: 常见问题页面
 * @Author:R-D
 * @CreatDate: 2019-12-20 15:06
 * @Reviser:
 * @Modification Time:2019-12-20 15:06
 */
public class CommonQuestionsActivity extends KFBaseActivity {
    private Context mContext;
    private CommonQuetionAdapter adapter;
    private RecyclerView rv_commonQuetions;
    private ArrayList<CommonQuestionBean> questionBeans = new ArrayList<>();
    private SharedPreferences spData;
    private int themeType;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = this;
        spData = this.getSharedPreferences("moordata", 0);

        setContentView(R.layout.activity_commonproblems);
        StatusBarUtils.setColor(this, getResources().getColor(R.color.all_white));
        initView();
        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
        getMainQuestions();
    }

    private void initView() {
        Toolbar toolbar_question = findViewById(R.id.toolbar_question);
        setSupportActionBar(toolbar_question);
        toolbar_question.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        rv_commonQuetions = findViewById(R.id.rl_refresh);
//        View header = View.inflate(mContext, R.layout.layout_header_common_problem, null);
        // 这一版暂时去掉搜索功能
//        final EditText et_search = header.findViewById(R.id.et_search);
//        rv_oneQuetions.addHeaderView(header);
        rv_commonQuetions.setLayoutManager(new LinearLayoutManager(CommonQuestionsActivity.this));
        adapter = new CommonQuetionAdapter(CommonQuestionsActivity.this, questionBeans);
        rv_commonQuetions.setAdapter(adapter);
    }

    /**
     * 获取常见问题
     */
    private void getMainQuestions() {
        HttpManager.getTabCommonQuestions(new HttpResponseListener() {
            @Override
            public void onSuccess(String responseStr) {
                LogUtils.aTag("常见问题", responseStr);
                try {
                    JSONObject jsonObject = new JSONObject(responseStr);
                    JSONArray catalogList = jsonObject.getJSONArray("catalogList");
                    for (int i = 0; i < catalogList.length(); i++) {
                        JSONObject questionObj = catalogList.getJSONObject(i);
                        CommonQuestionBean commonQuestionBean = new CommonQuestionBean();
                        commonQuestionBean.setTabContent(questionObj.getString("name"));
                        commonQuestionBean.setTabId(questionObj.getString("_id"));
                        questionBeans.add(commonQuestionBean);
                    }
                    adapter.notifyDataSetChanged();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailed() {

            }
        });
    }
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEventMainThread(QuestionEvent questionEvent) {
        finish();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
    }
}
