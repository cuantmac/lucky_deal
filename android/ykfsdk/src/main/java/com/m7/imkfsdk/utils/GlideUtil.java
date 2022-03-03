package com.m7.imkfsdk.utils;

import android.content.Context;
import android.graphics.drawable.Drawable;
import androidx.annotation.Nullable;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.bumptech.glide.load.resource.bitmap.RoundedCorners;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.RequestOptions;
import com.m7.imkfsdk.R;

/**
 * @Description:
 * @Author: rd
 * @Date: 2020/8/17
 */
public class GlideUtil {

    public static void loadHeader(Context context, String imgUrl, int placeholder, int error, ImageView imageView) {
        Glide.with(context)
                .load(imgUrl)
                .placeholder(placeholder)
                .error(error)
                .apply(RequestOptions.bitmapTransform(new RoundedCorners(PixelUtil.dp2px(8f))))
                .into(imageView);

    }

    public static void loadImage(Context context, String imgUrl, float rounder, ImageView imageView) {
        Glide.with(context)
                .load(imgUrl)
                .placeholder(R.drawable.kf_pic_thumb_bg)
                .error(R.drawable.kf_image_download_fail_icon)
                .apply(RequestOptions.bitmapTransform(new RoundedCorners(PixelUtil.dp2px(rounder))))
                .into(imageView);
    }

    public static void loadImage(Context context, String imgUrl, ImageView imageView) {
        loadImage(context, imgUrl, 8f, imageView);
    }

    public static void loadFirstFrame(Context context, String imgUrl, ImageView imageView) {
        Glide.with(context).load(imgUrl)
                .error(R.drawable.kf_image_download_fail_icon)
                .frame(0)//获取视频第一帧
                .into(imageView);
    }

    public static void loadImage(Context context, String imgUrl, ImageView imageView, RequestListener<Drawable> listener) {
        Glide.with(context)
                .load(imgUrl)
                .placeholder(R.drawable.kf_pic_thumb_bg)
                .error(R.drawable.kf_image_download_fail_icon)
//                .apply(RequestOptions.bitmapTransform(new RoundedCorners(PixelUtil.dp2px(rounder))))
                .addListener(listener)
                .into(imageView);
    }

    public static void loadCircleImage(Context context, String imgUrl, ImageView imageView) {
        Glide.with(context)
                .load(imgUrl)
                .placeholder(R.drawable.kf_pic_thumb_bg)
                .error(R.drawable.kf_image_download_fail_icon)
                .apply(RequestOptions.bitmapTransform(new CircleCrop()))
                .into(imageView);

    }

    public static void loadCircleImage(Context context, String imgUrl, int resource, ImageView imageView) {
        Glide.with(context)
                .load(imgUrl)
                .placeholder(resource)
                .error(resource)
                .apply(RequestOptions.bitmapTransform(new CircleCrop()))
                .into(imageView);

    }
}
