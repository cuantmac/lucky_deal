package com.luckyapp.common.bean;

public class SharePlatform {
    private int platform_id;
    private String platform_name;

    public SharePlatform(int platform_id, String platform_name) {
        this.platform_id = platform_id;
        this.platform_name = platform_name;
    }

    public int getPlatform_id() {
        return platform_id;
    }

    public void setPlatform_id(int platform_id) {
        this.platform_id = platform_id;
    }

    public String getPlatform_name() {
        return platform_name;
    }

    public void setPlatform_name(String platform_name) {
        this.platform_name = platform_name;
    }
}
