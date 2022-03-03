package com.luckyapp.common.widget;

import android.content.Context;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;
import android.util.AttributeSet;

/**
 * Created by wang on 2018/10/11.
 */

public class ScrollerRecycleView extends RecyclerView {
    public ScrollerRecycleView(Context context) {
        super(context);
    }

    public ScrollerRecycleView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public ScrollerRecycleView(Context context, @Nullable AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onScrollChanged(int l, int t, int oldl, int oldt) {

        super.onScrollChanged(l, t, oldl, oldt);
    }
}
