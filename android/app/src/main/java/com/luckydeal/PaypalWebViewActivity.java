package com.luckydeal;

import android.annotation.TargetApi;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.luckyapp.common.utils.LogUtil;
import com.luckydeal.util.StatusBarUtil;
import com.luckydeal.view.EmptyLayout;
import com.tencent.bugly.crashreport.CrashReport;

import org.w3c.dom.Text;

import java.util.Locale;
import java.util.WeakHashMap;

/**
 * @author chengang
 * 目前只有h5游戏会走这个页面
 */
public class PaypalWebViewActivity extends AppCompatActivity {
    private static String TAG = "H5Game";
    public static final String H5JSOBECT = "luckygame";
    //@BindView(R.id.appWebView)
    //WebView webView;
    WebView mWebView;
    EmptyLayout mErrorView;
    public boolean isLoadComplete;
    private String mUrl;
    boolean mCustomBack = false;

    private long mPauseTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        boolean landscape = getIntent().getBooleanExtra("landscape", false);
        if (landscape && getResources().getConfiguration().orientation != Configuration.ORIENTATION_LANDSCAPE) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            StatusBarUtil.setStatusBarColor(this, R.color.white);
            StatusBarUtil.setStatusBarLightMode(this);
        }
        setContentView(R.layout.activity_web_view);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
        mWebView = findViewById(R.id.webView);
        mErrorView = findViewById(R.id.error_layout);

        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEV_MODE);

        WebSettings webSettings = mWebView.getSettings();
        webSettings.setTextZoom(100);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);


        //支持屏幕缩放
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);

        //不显示webview缩放按钮
        webSettings.setDisplayZoomControls(false);

        //离线加载
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);

        // init mWebView settings
        webSettings.setAllowContentAccess(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAppCacheEnabled(true);

        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);


        //设置 缓存模式
        //if (NetworkUtils.isConnected()) {
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        //}


        //设置Web视图
        webSettings.setBlockNetworkImage(true);


        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("luckydeal://share")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    finish();
                    return true;
                } else {
                    return false;
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                isLoadComplete = true;
                LogUtil.d("WebViewLoad onPageFinished");


                view.getSettings().setBlockNetworkImage(false);
                if (!view.getSettings().getLoadsImagesAutomatically()) {
                    view.getSettings().setLoadsImagesAutomatically(true);
                }
                onLoadComplete();
                super.onPageFinished(view, url);
                if (view.getVisibility() == View.GONE) {
                    view.setVisibility(View.VISIBLE);
                }

            }

            @Override
            public void onLoadResource(WebView webView, String s) {
                super.onLoadResource(webView, s);
            }

            @Override
            @TargetApi(Build.VERSION_CODES.M)
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                int errorCode = error.getErrorCode();
                String failingUrl = request.getUrl().toString();
                onReceivedErrorCommon(view, errorCode, failingUrl);
            }

            private void onReceivedErrorCommon(WebView view, int errorCode, String failingUrl) {
                LogUtil.e(TAG, "onReceivedError:" + failingUrl);
                LogUtil.i(TAG, "onReceivedError:" + errorCode);
                if (errorCode == ERROR_HOST_LOOKUP || errorCode == ERROR_CONNECT
                        || errorCode == ERROR_TIMEOUT || errorCode == ERROR_UNKNOWN) {
                    if (mUrl.equals(failingUrl)) {
                        view.loadUrl("about:blank"); // 避免出现默认的错误界面
                        onLoadError();
                    }
//                    else {
//                        if (System.currentTimeMillis() - mLastShowToast > 5000) {
//                            mLastShowToast = System.currentTimeMillis();
//                            ToastUtil.postShow(R.string.no_connection_ingame);
//                        }
//                    }
                }
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                onReceivedErrorCommon(view, errorCode, failingUrl);
            }

            @Override
            public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse errorResponse) {
                super.onReceivedHttpError(view, request, errorResponse);

                int statusCode = errorResponse.getStatusCode();
                LogUtil.e(TAG, "onReceivedHttpError code = " + statusCode + " url:" +
                        request.getUrl().toString());
                if (mUrl.equals(request.getUrl().toString())) {
                    if (404 == statusCode || 500 == statusCode || 403 == statusCode) {
                        view.loadUrl("about:blank");// 避免出现默认的错误界面
                        onLoadError();
                    }

                }
            }
        });
        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onReceivedTitle(WebView view, String title) {
                super.onReceivedTitle(view, title);
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
                    if (title.contains("404") || title.contains("500") || title.contains("Error")) {
                        view.loadUrl("about:blank");// 避免出现默认的错误界面
                        onLoadError();
                    }
                }
            }


            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                //CrashReport.setJavascriptMonitor(view, true);
                super.onProgressChanged(view, newProgress);

            }
        });

        mUrl = getIntent().getStringExtra("url");
        if (!TextUtils.isEmpty(mUrl)) {
            loadUrl(mUrl);
            if (!mUrl.startsWith("https://")) {
                ((TextView)findViewById(R.id.txt_url)).setText(mUrl);
                ((TextView) findViewById(R.id.txt_url)).setCompoundDrawables(null, null, null, null);
            } else {
                ((TextView)findViewById(R.id.txt_url)).setText(mUrl.substring(8));
            }
        }
        LogUtil.d(TAG, "web page load " + mUrl);

        findViewById(R.id.rl_left).setOnClickListener((v) -> {
            finish();
        });


    }

    public void onLoadError() {
        LogUtil.e(TAG, "web page load error" + mUrl);
        mErrorView.setVisibility(View.VISIBLE);
        if (mWebView != null) {
            mWebView.setVisibility(View.GONE);
        }
        mErrorView.setOnRetryListener(() -> {
            if (isFinishing()) return;
            mErrorView.setVisibility(View.GONE);
            mWebView.setVisibility(View.VISIBLE);
            loadUrl(mUrl);
        });
    }

    public void onLoadComplete() {
        Bundle bundleAddr = getIntent().getBundleExtra("address");
        if (bundleAddr != null) {
            LogUtil.d("address line one:" +  bundleAddr.getString("address_line_one"));
            String state = bundleAddr.getString("state", "");
            if (state.length() > 1) {
                state = state.substring(0, 1).toUpperCase().concat(state.substring(1));
            }
            String line1 = bundleAddr.getString("address_line_one", "");
            String line2 = bundleAddr.getString("address_line_two", "");
            String zip = bundleAddr.getString("zip", "");
            String phone = bundleAddr.getString("phone_number", "");
            String city = bundleAddr.getString("city", "");
            mWebView.loadUrl(String.format(Locale.getDefault(), "javascript:(function fill_address() {" +
                                "function getElementById(str) {" +
                                    "return new Promise(function(resolve) {" +
                                        "var ele;" +
                                        "var timer = setInterval(function() {" +
                                        "ele = document.getElementById(str);" +
                                        "console.log('retry');" +
                                            "if(ele) {" +
                                                "resolve(ele);" +
                                                "clearInterval(timer);" +
                                            "}" +
                                        "}, 1000);"+
                                    "});" +
                                "}" +
                                "function triggerOnChange(ele) {" +
                                    "ele.addEventListener('input', function(){}, false);"+
                                    "var event = new InputEvent('input');"+
                                    "ele.dispatchEvent(event);"+
                                "}"+
                                "function triggerSelectChange(ele) {"+
                                    "var event = new Event('change');"+
                                    "ele.dispatchEvent(event);"+
                                "}"+
                                "getElementById('billingLine1').then(function() {" +
                                    "var line1 = document.getElementById('billingLine1');" +
                                    "if (line1) { line1.value='%s'; triggerOnChange(line1);}" +
                                    "var line2 = document.getElementById('billingLine2');" +
                                    "if (line2) { line2.value='%s'; triggerOnChange(line2);}" +
                                    "var city = document.getElementById('billingCity');" +
                                    "if (city) { city.value='%s'; triggerOnChange(city);}" +
                                    "var selState = document.getElementById('billingState');" +
                                    "if (selState) {" +
                                    "for (i=0;i<selState.options.length; i++) {" +
                                        "if (selState.options[i].label == '%s') {" +
                                            "selState.selectedIndex = i;triggerSelectChange(selState); break;" +
                                        "}" +
                                    "}}" +
                                    "var postCode = document.getElementById('billingPostalCode');" +
                                    "if (postCode) { postCode.value='%s'; triggerOnChange(postCode);}" +
                                    "var phone = document.getElementById('telephone');" +
                                    "if (phone) { phone.value='%s'; triggerOnChange(phone);}" +
                                "});" +
                            "})()",
                    line1, line2, city, state, zip, phone
            ));
        }
    }


    public void loadUrl(String url) {
        LogUtil.i("h5loadUrl");
        if (url != null) {
            mWebView.loadUrl(url);
        }
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mCustomBack && mWebView.getVisibility() == View.VISIBLE) {
            mWebView.loadUrl("javascript:onBackPressed()");
        } else {
            //弹创建桌面快捷方式
            Log.d(TAG, "onBackPressed: ");
//            if (!ShortcutHelper.addedShortCut()) {
//                ShortcutHelper.verifyCreateShortCut();
//            }
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        mPauseTime = System.currentTimeMillis();
        LogUtil.d("H5GameTime", "pauseGame");
    }

    @Override
    protected void onResume() {
        super.onResume();
//        if (mPauseTime > 0) {
//            mPauseDuration += System.currentTimeMillis() - mPauseTime;
//        }
        LogUtil.d("H5GameTime", "resumeGame");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        LogUtil.e(TAG, "data = quitGame");
        if (mWebView != null) {
            mWebView.removeJavascriptInterface(H5JSOBECT);
            mWebView.removeAllViews();
            mWebView.destroy();
            mWebView = null;
        }

        mErrorView.setOnRetryListener(null);

    }

}
