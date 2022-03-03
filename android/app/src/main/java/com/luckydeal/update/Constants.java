package com.luckydeal.update;

import com.luckydeal.BuildConfig;

public class Constants {
    public static final String SERVER_URL = BuildConfig.DEV_MODE ?
            "https://static.luckydeal.vip/app-upgrade-test/" :
            "https://static.luckydeal.vip/app-upgrade/";
    public static final String METADATA = "metadata.json";
    public static final String UPDATE_DIR = "app-update";
    public static final String BUNDLE_NAME = "index.android.bundle";
}
