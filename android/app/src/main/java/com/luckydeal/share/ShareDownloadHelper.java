package com.luckydeal.share;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;

import androidx.core.content.FileProvider;


import com.luckyapp.common.BuildConfig;
import com.luckyapp.common.GlobalApp;
import com.luckydeal.R;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;


/**
 * Created by zyy
 * on 2019/4/12
 * Share  这个是
 */
public class ShareDownloadHelper {
    public static final String TAG = "ShareDownloadHelper";
    public static ShareDownloadHelper instance;
    //public ShareConfigBean shareCofigBean;
    private Uri shareUri;
    public static final int INVITE = 1;
    public static final int DETAIL = 2;
    public static final int BID = 3;


    public static ShareDownloadHelper getInstance() {
        if (instance == null) {
            instance = new ShareDownloadHelper();
            instance.getBitmapFromDrawable(R.mipmap.ic_launcher);
        }
        return instance;
    }

    // Method when launching drawable within Glide
    public Uri getBitmapFromDrawable(int resID) {
        if (resID != R.mipmap.ic_launcher) {
            shareUri = null;
        }
        if (shareUri == null) {
            // Store image to default external storage directory
            try {
                Bitmap bmp = BitmapFactory.decodeResource(GlobalApp.get().getResources(), resID);
                // Use methods on Context to access package-specific directories on external storage.
                // This way, you don't need to request external read/write permission.
                // See https://youtu.be/5xVh-7ywKpE?t=25m25s
                File file = new File(GlobalApp.get().getExternalFilesDir(Environment.DIRECTORY_PICTURES), "share_image" + ".png");
                FileOutputStream out = new FileOutputStream(file);
                bmp.compress(Bitmap.CompressFormat.PNG, 90, out);
                out.close();
                bmp.recycle();
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
                    shareUri = Uri.fromFile(file);
                } else {
                    shareUri = FileProvider.getUriForFile(GlobalApp.get(), BuildConfig.APPLICATION_ID, file);
                }
            } catch (IOException e) {
                e.printStackTrace();
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
            }
        }
        return shareUri;
    }

     /* public void loadShareConfig() {
        HttpClient.getInstance().getApiService().getShareConfig()
                .as(HttpClient.apiResponse())
                .subscribe(result -> {
                    shareCofigBean = result;
                });
    }

    public ShareConfigBean getShareConfigBean() {
        if (shareCofigBean == null) {
            loadShareConfig();
           //ToastUtil.showShort("error");
        }
        return shareCofigBean;
    }*/

}
