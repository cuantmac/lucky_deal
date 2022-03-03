package com.m7.imkfsdk.chat;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.appcompat.widget.Toolbar;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.adapter.DetailQuestionAdapter;
import com.m7.imkfsdk.chat.model.DetailsQuestionBean;
import com.m7.imkfsdk.utils.statusbar.StatusBarUtils;
import com.m7.imkfsdk.view.EndlessRecyclerOnScrollListener;
import com.m7.imkfsdk.view.LoadMoreWrapper;
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
 * @FileName: CommonDetailProblemsActivity
 * @Description: 常见问题详情页面
 * @Author:R-D
 * @CreatDate: 2019-12-20 15:06
 * @Reviser:
 * @Modification Time:2019-12-20 15:06
 */
public class CommonDetailQuestionActivity extends KFBaseActivity {
    private Context mContext;
    private DetailQuestionAdapter adapter;
    private RecyclerView rv_detailQuetions;
    private SwipeRefreshLayout swipeRefreshLayout;
    private LoadMoreWrapper loadMoreWrapper;
    private ArrayList<DetailsQuestionBean> detailsQuestionBeans = new ArrayList<>();
    private String tabId;
    private int page = 1;
    private int limit = 30;
    private TextView tv_noData;
    private SharedPreferences spData;
    private int themeType;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = this;
        spData = this.getSharedPreferences("moordata", 0);
        setContentView(R.layout.activity_detailproblems);
        StatusBarUtils.setColor(this, getResources().getColor(R.color.all_white));
        Toolbar toolbar_question = findViewById(R.id.toolbar_question);
        setSupportActionBar(toolbar_question);
        toolbar_question.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        tabId = getIntent().getStringExtra("tabId");
        initView();

        if (!EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
        getDetailsQuestions();
    }

    private void initView() {
        swipeRefreshLayout = findViewById(R.id.srl_refresh);
        rv_detailQuetions = findViewById(R.id.rl_detailRefresh);
        tv_noData = findViewById(R.id.tv_noData);
//        View header = View.inflate(mContext, R.layout.layout_header_common_problem, null);
        // 这一版暂时去掉搜索功能
//        final EditText et_search = header.findViewById(R.id.et_search);
//        rv_oneQuetions.addHeaderView(header);
        rv_detailQuetions.setLayoutManager(new LinearLayoutManager(CommonDetailQuestionActivity.this));
        adapter = new DetailQuestionAdapter(detailsQuestionBeans);
        loadMoreWrapper = new LoadMoreWrapper(adapter);
        rv_detailQuetions.setAdapter(loadMoreWrapper);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                getDetailsQuestions();
            }
        });
        rv_detailQuetions.addOnScrollListener(new EndlessRecyclerOnScrollListener() {
            @Override
            public void onLoadMore() {
                loadMoreWrapper.setLoadState(loadMoreWrapper.LOADING);
                LoadMoreDetailsQuestions();

            }
        });
    }


    /**
     * 获取详尽的问题
     */
    private void getDetailsQuestions() {
        page = 1;
        HttpManager.getDetailQuestions(tabId, page, limit, new HttpResponseListener() {
            @Override
            public void onSuccess(String responseStr) {
                swipeRefreshLayout.setRefreshing(false);
                detailsQuestionBeans.clear();
                LogUtils.aTag("getDetailsQuestions", responseStr);
                try {
                    JSONObject jsonObject = new JSONObject(responseStr);
//                    String count = jsonObject.getString("count");
                    JSONArray list = jsonObject.getJSONArray("list");
                    if (list != null && list.length() > 0) {
                        tv_noData.setVisibility(View.GONE);
                        swipeRefreshLayout.setVisibility(View.VISIBLE);
                        for (int i = 0; i < list.length(); i++) {
                            JSONObject jsonObject1 = list.getJSONObject(i);
                            DetailsQuestionBean detailsQuestionBean = new DetailsQuestionBean();
                            detailsQuestionBean.setQuestionId(jsonObject1.getString("_id"));
                            detailsQuestionBean.setTitle(jsonObject1.getString("title"));
                            detailsQuestionBeans.add(detailsQuestionBean);
                        }
                        loadMoreWrapper.notifyDataSetChanged();
                    } else {
                        //没有数据
                        Toast.makeText(CommonDetailQuestionActivity.this, getString(R.string.ykf_no_data), Toast.LENGTH_SHORT).show();
                        tv_noData.setVisibility(View.VISIBLE);
                        swipeRefreshLayout.setVisibility(View.GONE);
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

    /**
     * 加载更多
     */
    private void LoadMoreDetailsQuestions() {
        page++;
         HttpManager.getDetailQuestions(tabId, page, limit, new HttpResponseListener() {
            @Override
            public void onSuccess(String responseStr) {
                LogUtils.aTag("具体问题", responseStr);
                loadMoreWrapper.setLoadState(loadMoreWrapper.LOADING_COMPLETE);
                try {
                    JSONObject jsonObject = new JSONObject(responseStr);
                    JSONArray list = jsonObject.getJSONArray("list");
                    if (list != null && list.length() > 0) {
                        for (int i = 0; i < list.length(); i++) {
                            JSONObject jsonObject1 = list.getJSONObject(i);
                            DetailsQuestionBean detailsQuestionBean = new DetailsQuestionBean();
                            detailsQuestionBean.setQuestionId(jsonObject1.getString("_id"));
                            detailsQuestionBean.setTitle(jsonObject1.getString("title"));
                            detailsQuestionBeans.add(detailsQuestionBean);
                        }
                    } else {
                        //没有数据
                        loadMoreWrapper.setLoadState(loadMoreWrapper.LOADING_END);
                        Toast.makeText(CommonDetailQuestionActivity.this, getString(R.string.ykf_no_datamore), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                loadMoreWrapper.notifyDataSetChanged();
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
