package com.luckydeal.config;

import com.luckyapp.common.BuildConfig;

import org.json.JSONArray;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2020/4/28
 * Desc: written for LuckyDeal project.
 */
public class Constant {
    public static class AppsFlyer {
        public static final String APPSFLYER_KEY = "55nzjn5dEAFFJscs6Vmsjf";
    }

    public static class InnoSdk {
        public static final String REPORT_URL = BuildConfig.DEV_MODE ? "http://47.93.216.50:8031" : "https://ireport.luckydeal.vip";
        public static final String CID = "ireport_luckydeal";
        public static final String APPKEY = "dxfw5yOPFjKCnWB76WESvMLhqIVgpb1F";
    }

    public static class AsiaBillPay {
        public static  String MERNO = "12262";
        public static  String GATEWAYNO = "12262001";
        public static final String SIGNKEY = "12345678";
        public static final String RETURNURL = "https://mclient.asiabill.com/pay/gateway_return";
        public static JSONArray getAllowedCardNetworks() {
            return new JSONArray()
                    .put("Visa")
                    .put("Master card")
                    .put("American Express")
                    .put("JCB")
                    .put("Discover")
                    .put("Maestro")
                    .put("Dinners club");
        }
    }
}
