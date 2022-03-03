package com.luckydeal;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.luckydeal.view.GlideImageManager;

import java.util.Collections;
import java.util.List;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2020/4/29
 * Desc: written for LuckyDeal project.
 */
public class AppReactPackage implements ReactPackage {
    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        AppModule appModule = new AppModule(reactContext);
        return Collections.singletonList(appModule);
    }
    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        GlideImageManager imageManager = new GlideImageManager();
        return Collections.singletonList(imageManager);
    }

}
