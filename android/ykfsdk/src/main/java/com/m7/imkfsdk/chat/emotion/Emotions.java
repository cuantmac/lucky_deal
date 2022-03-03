package com.m7.imkfsdk.chat.emotion;

import android.text.TextUtils;


import com.m7.imkfsdk.utils.FaceConversionUtil;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Emotions {

    public static Map<String, String> EMOTIONS = new LinkedHashMap<>();

    static {
        EMOTIONS.putAll(FaceConversionUtil.getInstace().emojiMap);
    }

    private static String emotionCode2String(int code) {
        return new String(Character.toChars(code));
    }

    public static String getDrawableResByName(String emotionName) {
        if (!TextUtils.isEmpty(emotionName) && EMOTIONS.containsKey(emotionName)) {
            return EMOTIONS.get(emotionName);
        }
        return "";
    }

    public static List<Emotion> getEmotions() {
        List<Emotion> emotions = new ArrayList<>();
        Iterator<Map.Entry<String, String>> entries = EMOTIONS.entrySet().iterator();

        while (entries.hasNext()) {
            Map.Entry<String, String> entry = entries.next();
            emotions.add(new Emotion(entry.getKey(), entry.getValue()));
        }
        return emotions;
    }
}
