package com.m7.imkfsdk.chat.chatrow;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.text.TextUtils;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.m7.imkfsdk.R;
import com.m7.imkfsdk.chat.ChatActivity;
import com.m7.imkfsdk.chat.holder.BaseHolder;
import com.m7.imkfsdk.chat.holder.TabQuestionRxHolder;
import com.m7.imkfsdk.chat.holder.ViewHolderTag;
import com.m7.imkfsdk.chat.model.TabQuestionBean;
import com.m7.imkfsdk.utils.DensityUtil;
import com.moor.imkf.model.entity.FromToMessage;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class TabQuestionRxRow extends  BaseChatRow{
    private ViewHolderTag holderTag;
    public TabQuestionRxRow(int type) {
        super(type);
    }

    @Override
    public boolean onCreateRowContextMenu(ContextMenu contextMenu, View targetView, FromToMessage detail) {
        return false;
    }

    @Override
    protected void buildChattingData(final Context context, BaseHolder baseHolder, FromToMessage detail, int position) {
        final TabQuestionRxHolder holder = (TabQuestionRxHolder) baseHolder;

        if (detail != null) {
            if(!TextUtils.isEmpty(detail.common_questions_group)){
                if(holder.getViewPager().getAdapter()!=null){
                    return;
                }
                View.OnClickListener listener = ((ChatActivity) context).getChatAdapter().getOnClickListener();
                final  int type = ViewHolderTag.TagType.TAG_CLICK_SHOW_TAB_QUESTIONMORE;

                Type token = new TypeToken<ArrayList<TabQuestionBean>>() {
                }.getType();
                final ArrayList<TabQuestionBean> list = new Gson().fromJson(detail.common_questions_group, token);
                if(list!=null){
                    if(list.size()>0){
                        final HashMap<String,ArrayList<String>> map=new HashMap<String,ArrayList<String>>();
                        final ArrayList<String> tittles=new ArrayList<String>();
                        ArrayList<View>  views=new ArrayList<View>();
                         for(int i=0;i<list.size();i++){
                            map.put(list.get(i).name,list.get(i).list);
                            tittles.add(list.get(i).name);
                        }

                        for(int i=0;i<tittles.size();i++){
                            holder.getTab_layout().addTab( holder.getTab_layout().newTab());
                            View view=View.inflate(context,R.layout.kf_tabquestionfragment,null);
                            RecyclerView recyclerView=view.findViewById(R.id.reclcle_question);
                            recyclerView.setLayoutManager(new LinearLayoutManager(context));
                            recyclerView.setNestedScrollingEnabled(false);
                            LabelsAdapter adapter=new LabelsAdapter(map.get(tittles.get(i)),context);
                            recyclerView.setAdapter(adapter);
                            views.add(view);
                        }

                        TagAdapter adapter=new TagAdapter(context,views,tittles);

                        holder.getViewPager().setAdapter(adapter);

                        holder.getTab_layout().setupWithViewPager(holder.getViewPager());

                        holder.getViewPager().setCurrentItem(0);



                        if(map.get(tittles.get(0))!=null){
                            if(map.get(tittles.get(0)).size()>5){
                                holderTag = ViewHolderTag.createTag(tittles.get(0),map.get(tittles.get(0)), type);
                                holder.getTv_seemore().setTag(holderTag);
                                holder.getTv_seemore().setVisibility(View.VISIBLE);
                                LinearLayout.LayoutParams layoutParams= (LinearLayout.LayoutParams) holder.getViewPager().getLayoutParams();
                                layoutParams.height= DensityUtil.dip2px(45*5);
                                holder.getViewPager().setLayoutParams(layoutParams);
                            }else{
                                holder.getTv_seemore().setVisibility(View.GONE);
                                LinearLayout.LayoutParams layoutParams= (LinearLayout.LayoutParams) holder.getViewPager().getLayoutParams();
                                layoutParams.height= DensityUtil.dip2px(45*map.get(tittles.get(0)).size());
                                holder.getViewPager().setLayoutParams(layoutParams);
                            }
                        }else{
                            holder.getTv_seemore().setVisibility(View.GONE);
                        }
                        holder.getViewPager().addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
                            @Override
                            public void onPageScrolled(int i, float v, int i1) {

                            }

                            @Override
                            public void onPageSelected(int i) {
                                    if(i<tittles.size()){
                                        if(map.get(tittles.get(i))!=null){
                                            int count=map.get(tittles.get(i)).size();
                                            if(count>5){
                                                if(((ChatActivity) context).isListBottom()){
                                                    ((ChatActivity) context).scrollToBottom();
                                                }
                                                holderTag = ViewHolderTag.createTag(tittles.get(i),map.get(tittles.get(i)), type);
                                                holder.getTv_seemore().setTag(holderTag);
                                                holder.getTv_seemore().setVisibility(View.VISIBLE);
                                                LinearLayout.LayoutParams layoutParams= (LinearLayout.LayoutParams) holder.getViewPager().getLayoutParams();
                                                layoutParams.height= DensityUtil.dip2px(45*5);
                                                holder.getViewPager().setLayoutParams(layoutParams);

                                            }else{
                                                if(((ChatActivity) context).isListBottom()){
                                                    ((ChatActivity) context).scrollToBottom();
                                                }
                                                holder.getTv_seemore().setVisibility(View.GONE);
                                                LinearLayout.LayoutParams layoutParams= (LinearLayout.LayoutParams) holder.getViewPager().getLayoutParams();
                                                layoutParams.height= DensityUtil.dip2px(45*count);
                                                holder.getViewPager().setLayoutParams(layoutParams);

                                            }
                                        }
                                    }
                            }

                            @Override
                            public void onPageScrollStateChanged(int i) {

                            }
                        });


                    }
                }

                holder.getTv_seemore().setOnClickListener(listener);
            }
        }
    }

    @Override
    public View buildChatView(LayoutInflater inflater, View convertView) {
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.kf_chat_row_tabquestion_rx, null);
            TabQuestionRxHolder holder = new TabQuestionRxHolder(mRowType);
            convertView.setTag(holder.initBaseHolder(convertView, true));
        }

        return convertView;
    }

    @Override
    public int getChatViewType() {
        return ChatRowType.TAB_QUESTION_RECEIVED.ordinal();
    }

     private class TagAdapter extends PagerAdapter {

        private Context context;

        private List<View> pages;
         private List<String> tittles;
        public TagAdapter(Context context,List<View> pages,List<String> tittles) {
             this.context = context;
             this.pages=pages;
             this.tittles=tittles;
        }

         @Override
         public CharSequence getPageTitle(int position) {
            return tittles.get(position);
        }
        @Override
        public Object instantiateItem(ViewGroup container, int position) {
             if (position < pages.size()) {
                View page = pages.get(position);
                container.addView(page);
                return page;
            }
            return null;
        }

        @Override
        public void destroyItem(ViewGroup container, int position, Object object) {
            container.removeView(pages.get(position));
        }

        @Override
        public int getCount() {
            return pages.size();
        }

        @Override
        public boolean isViewFromObject(View view, Object o) {
            return view == o;
        }
    }


    class  LabelsAdapter extends RecyclerView.Adapter<LabelsAdapter.TagViewHolder> {
        ArrayList<String> datas;
        Context context;
        public LabelsAdapter(ArrayList<String> datas,Context context) {
            this.context=context;
            this.datas = datas;
        }

        @Override
        public TagViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View v = View.inflate(parent.getContext(), R.layout.kf_question_item, null);
            return new TagViewHolder(v);
        }

        @Override
        public void onBindViewHolder(TagViewHolder holder, final int position) {
            holder.tv_textView.setText(datas.get(position));
            holder.tv_textView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    ((ChatActivity)context).sendTextMsg(datas.get(position));
                }
            });
        }

        @Override
        public int getItemCount() {
            return datas == null ? 0 : datas.size();
        }

        class  TagViewHolder extends RecyclerView.ViewHolder {
            TextView tv_textView;

            public TagViewHolder(View itemView) {
                super(itemView);
                tv_textView = itemView.findViewById(R.id.tv_question);
            }
        }

    }

}



