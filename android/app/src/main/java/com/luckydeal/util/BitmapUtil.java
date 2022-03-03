package com.luckydeal.util;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.text.TextUtils;

import com.facebook.react.views.imagehelper.ResourceDrawableIdHelper;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.utils.LogUtil;
import com.luckydeal.BuildConfig;

import java.io.File;
import java.io.IOException;
import java.net.URL;

/**
 * Description：.
 * Author：Created by YJ_Song on 2020/11/10.
 * Email:  songyuanjin@innotechx.com
 */
public class BitmapUtil {
    public static Drawable loadImage(String iconUri) {
        try {
            if (TextUtils.isEmpty(iconUri)) {
                return null;
            }
            if (BuildConfig.DEBUG) {
                return null;
               // return tryLoadIcon(iconUri);
            } else {
                Uri uri = Uri.parse(iconUri);
                return loadResource(iconUri);
            }
        } catch (Exception e) {
            return null;
        }
    }

    private static boolean isLocalFile(Uri uri) {
        File file = new File(uri.getPath());
        if (file.exists()) {
            return true;
        }
        return false;
    }

    private static Drawable tryLoadIcon(String iconDevUri) throws IOException {
        URL url = new URL(iconDevUri);
        Bitmap bitmap = BitmapFactory.decodeStream(url.openStream());
        return new BitmapDrawable(GlobalApp.get().getResources(), bitmap);
    }

    /**
     * 加载手机本地目录图片
     *
     * @param uri
     * @return
     */
    private static Drawable loadFile(Uri uri) {
        Bitmap bitmap = BitmapFactory.decodeFile(uri.getPath());
        return new BitmapDrawable(GlobalApp.get().getResources(), bitmap);
    }

    /**
     * 加载drawable目录下的图片
     *
     * @param iconUri
     * @return
     */
    private static Drawable loadResource(String iconUri) {
        return ResourceDrawableIdHelper.getInstance().getResourceDrawable(GlobalApp.get(), iconUri);
    }


}
