package com.luckyapp.common.bean;

import java.io.Serializable;

public class ShareBean implements Serializable {
    private String share_url;
    private String share_domain_url;
    private String share_title;
    private String share_text;
    private String share_pic;
    private String new_text;
    private int share_money;
    private int sharemoney_type;

    public String getShare_url() {
        return share_url;
    }

    public void setShare_url(String share_url) {
        this.share_url = share_url;
    }

    public String getShare_domain_url() {
        return share_domain_url;
    }

    public void setShare_domain_url(String share_domain_url) {
        this.share_domain_url = share_domain_url;
    }

    public String getShare_title() {
        return share_title == null ? "" : share_title;
    }

    public void setShare_title(String share_title) {
        this.share_title = share_title;
    }

    public String getShare_text() {
        return share_text == null ? "" : share_text;
    }

    public void setShare_text(String share_text) {
        this.share_text = share_text;
    }

    public String getShare_pic() {
        return share_pic;
    }

    public String getNew_text() {
        return new_text;
    }

    public void setNew_text(String new_text) {
        this.new_text = new_text;
    }

    public void setShare_pic(String share_pic) {
        this.share_pic = share_pic;
    }


    public int getShare_money() {
        return share_money;
    }

    public void setShare_money(int share_money) {
        this.share_money = share_money;
    }

    public int getSharemoney_type() {
        return sharemoney_type;
    }

    public void setSharemoney_type(int sharemoney_type) {
        this.sharemoney_type = sharemoney_type;
    }
}
