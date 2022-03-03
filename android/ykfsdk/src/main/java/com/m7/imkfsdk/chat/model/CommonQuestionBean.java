package com.m7.imkfsdk.chat.model;

import java.io.Serializable;

/**
 * 一级列表实体
 */
public class CommonQuestionBean implements Serializable {
    private String tabId;
    private String tabContent;

    public String getTabId() {
        return tabId;
    }

    public void setTabId(String tabId) {
        this.tabId = tabId;
    }

    public String getTabContent() {
        return tabContent;
    }

    public void setTabContent(String tabContent) {
        this.tabContent = tabContent;
    }
}
