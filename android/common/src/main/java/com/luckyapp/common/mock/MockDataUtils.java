package com.luckyapp.common.mock;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.luckyapp.common.GlobalApp;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.HashMap;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2019-11-29
 * Desc: written for luckyday project.
 */
public class MockDataUtils {

    /**
     * 模拟接口数据
     * Key：接口路径
     * Value：返回对象
     */
    private HashMap<String, JsonObject> mockData = new HashMap<>();

    private Gson gson = new Gson();


    private MockDataUtils() {
        try {
            InputStream is = GlobalApp.get().getAssets().open("mock_data.json");
            mockData = gson.fromJson(new InputStreamReader(is),
                    new TypeToken<HashMap<String, JsonObject>>() {}.getType());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static MockDataUtils get() {
        return Holder.INSTANCE;
    }

    private static class Holder {
        private static final MockDataUtils INSTANCE = new MockDataUtils();
    }

    public <T> T get(String path, Type type) {
        JsonObject object = mockData.get(path);
        if (object != null) {
            return gson.fromJson(object.getAsJsonObject("result"), type);
        }
        return null;
    }

    public boolean hasKey(String path) {
        JsonObject object = mockData.get(path);
        if (object != null) {
            return object.get("enable").getAsBoolean();
        }
        return false;
    }
}
