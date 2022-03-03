package com.m7.imkfsdk.chat.holder;

import com.google.android.material.tabs.TabLayout;
import androidx.viewpager.widget.ViewPager;
import android.view.View;
import android.widget.TextView;

import com.m7.imkfsdk.R;

public class TabQuestionRxHolder extends BaseHolder{


    private TabLayout tab_layout;
    private ViewPager viewPager;



    private TextView tv_seemore;

    public TabQuestionRxHolder(int type) {
        super(type);
    }

    public TabQuestionRxHolder(View baseView) {
        super(baseView);
    }
    public BaseHolder initBaseHolder(View baseView, boolean isReceive) {
        super.initBaseHolder(baseView);

        //通过baseview找到对应组件
        tab_layout=baseView.findViewById(R.id.tb_question);
        viewPager=baseView.findViewById(R.id.vp_tabquestion);
        tv_seemore=baseView.findViewById(R.id.tv_seemore);

        return this;
    }

    public TabLayout getTab_layout() {
        return tab_layout;
    }

    public ViewPager getViewPager() {
        return viewPager;
    }

    public TextView getTv_seemore() {
        return tv_seemore;
    }
}
