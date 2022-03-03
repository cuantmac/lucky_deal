//package com.luckyapp.common.http;
//
//import android.content.Context;
//
//import androidx.annotation.NonNull;
//
//import com.alibaba.sdk.android.httpdns.HttpDns;
//import com.alibaba.sdk.android.httpdns.HttpDnsService;
//import com.luckyapp.common.report.ReportUtily;
//import com.luckyapp.common.utils.LogUtil;
//
//import java.net.InetAddress;
//import java.net.UnknownHostException;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.List;
//
//import okhttp3.Dns;
//
//public class OkHttpDns implements Dns {
//    private static String TAG = "OkHttpDns";
//    private static String TAG2 = "AliHttpDns";
//    HttpDnsService httpdns;//httpdns 解析服务
//    private static OkHttpDns instance = null;
//    private boolean mUseHttpDnsFirst = false;
//    private OkHttpDns(Context context) {
//        this.httpdns = HttpDns.getService(context);
//    }
//    public static synchronized OkHttpDns getInstance(Context context) {
//        if(instance == null) {
//            instance = new OkHttpDns(context);
//        }
//        return instance;
//    }
//
//    public void init(boolean useHttpDnsFirst, boolean useHttps, boolean debugMode) {
//        mUseHttpDnsFirst = useHttpDnsFirst;
//        httpdns.setHTTPSRequestEnabled(useHttps);
//        httpdns.setPreResolveAfterNetworkChanged(true);
//        httpdns.setTimeoutInterval(30000);
//        httpdns.setLogEnabled(debugMode);
//        if (debugMode) {
//            httpdns.setLogger(msg -> {
//                LogUtil.d(TAG2, msg);
//            });
//        }
//        ArrayList<String> hostList = new ArrayList<>(Arrays.asList("api.luckynow.me"));
//        httpdns.setPreResolveHosts(hostList);
//    }
//
//    @Override
//    public List<InetAddress> lookup(@NonNull String hostname) throws UnknownHostException {
//        List<InetAddress> addresses = new ArrayList<>();
//        if (!mUseHttpDnsFirst) {
//            try {
//                addresses.addAll(Dns.SYSTEM.lookup(hostname));
//            } catch (UnknownHostException ignored) {
//            }
//        }
//
//        if (addresses.isEmpty() && "api.luckynow.me".equals(hostname)) {
//            LogUtil.d(TAG, hostname + " unresolved, use httpdns...");
//            //通过异步解析接口获取ip
//            String[] ips = httpdns.getIpsByHostAsync(hostname);
//            if(ips != null && ips.length > 0) {
//                //如果ip不为null，直接使用该ip进行网络请求
//                for (String ip : ips) {
//                    addresses.addAll(Arrays.asList(InetAddress.getAllByName(ip)));
//                }
//                LogUtil.d(TAG, "resolved:" + addresses + " for " + hostname);
//            } else {
//                ReportUtily.sendCustomEvent("ga_httpdns_resolve_failed");
//                LogUtil.d(TAG, "resolved failed, call system dns for " + hostname);
//            }
//        } // else other domain
//
//        if (addresses.isEmpty() && mUseHttpDnsFirst) {
//            addresses.addAll(Dns.SYSTEM.lookup(hostname));
//        }
//
//        if (addresses.isEmpty()) {
//            throw new UnknownHostException(hostname);
//        }
//        return addresses;
//
//    }
//}
