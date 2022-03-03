package com.m7.imkfsdk.chat.emotion;

import android.content.Context;
import android.graphics.drawable.Drawable;
import androidx.core.content.ContextCompat;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.TextUtils;


import com.m7.imkfsdk.utils.PixelUtil;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by yummyLau on 18-7-11
 * Email: yummyl.lau@gmail.com
 * blog: yummylau.com
 */
public class EmojiSpanBuilder {

    private static String zhengze = ":[^:]+:";
    private static Pattern sPatternEmotion = Pattern.compile(zhengze, Pattern.CASE_INSENSITIVE);

    public static Spannable buildEmotionSpannable(Context context, String text) {
        Matcher matcherEmotion = sPatternEmotion.matcher(text);
        SpannableString spannableString = new SpannableString(text);
        while (matcherEmotion.find()) {
            String key = matcherEmotion.group();
            String imgRes = Emotions.getDrawableResByName(key);
            if (!TextUtils.isEmpty(imgRes)) {
                int start = matcherEmotion.start();
                int resID = context.getResources().getIdentifier(imgRes,
                        "drawable", context.getPackageName());
                Drawable drawable = ContextCompat.getDrawable(context, resID);
                drawable.setBounds(0, 0, (int) PixelUtil.dp2px(20f), (int) PixelUtil.dp2px(20f));
                CenterImageSpan span = new CenterImageSpan(drawable);
                spannableString.setSpan(span, start, start + key.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            }
        }

        return spannableString;
    }
}
