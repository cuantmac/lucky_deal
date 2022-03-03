package com.m7.imkfsdk.chat.listener;

/**
 * @Description: 评价弹框回调
 * @Author: chenbo
 * @Date: 11/17/20
 */
public interface SubmitPingjiaListener {
    void OnSubmitSuccess(String content, String finalSatifyThank);//评价成功

    void OnSubmitCancle();//取消评价

    void OnSubmitFailed();//评价失败或者取消评价

}
