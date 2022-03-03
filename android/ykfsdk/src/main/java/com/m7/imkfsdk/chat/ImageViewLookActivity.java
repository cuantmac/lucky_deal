package com.m7.imkfsdk.chat;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.view.View;
import android.view.Window;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import com.m7.imkfsdk.R;
import com.m7.imkfsdk.utils.GlideUtil;
import com.m7.imkfsdk.utils.ImageUtils;
import com.m7.imkfsdk.utils.statusbar.StatusBarUtils;
import com.m7.imkfsdk.view.ActionSheetDialog;
import com.m7.imkfsdk.view.TouchImageView;

/**
 * Created by long on 2015/7/3.
 */
public class ImageViewLookActivity extends KFBaseActivity {

    private TouchImageView touchImageView;
    private boolean isSaveSuccess;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.kf_activity_image_look);
        StatusBarUtils.setTransparent(this);
        touchImageView = (TouchImageView) findViewById(R.id.matrixImageView);

        Intent intent = getIntent();

        final String imgPath = intent.getStringExtra("imagePath");


        final int fromother = intent.getIntExtra("fromwho", 1);//谁发的

        if (imgPath != null && !"".equals(imgPath)) {
            GlideUtil.loadImage(this, imgPath, 1f, touchImageView);
        } else {
            finish();
        }

        touchImageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        touchImageView.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
                if (fromother == 0) {//
                    //弹框
                    openDialog(imgPath);
                } else {
//                    ToastUtils.showShort("不保存本地的"+imgPath);
                }
                return true;
            }


        });

    }

    private void openDialog(final String imageUrl) {
        new ActionSheetDialog(this)
                .builder()
                .setCancelable(true)
                .setCanceledOnTouchOutside(true)
                .addSheetItem(
//                        this.getResources().getString(R.string.restartchat),
                        getString(R.string.ykf_save_pic),
                        ActionSheetDialog.SheetItemColor.BLACK, new ActionSheetDialog.OnSheetItemClickListener() {
                            @Override
                            public void onClick(int which) {
                                saveImage(imageUrl);
                            }
                        }).show();
    }


    //保存图片
    private void saveImage(String ImageUrl) {
        Glide.with(ImageViewLookActivity.this)
                .asBitmap()
                .load(ImageUrl)
                .into(new CustomTarget<Bitmap>() {
                    @Override
                    public void onResourceReady(@NonNull Bitmap resource, @Nullable Transition<? super Bitmap> transition) {
//                        得到bitmap
                        isSaveSuccess = ImageUtils.saveImageToGallery(ImageViewLookActivity.this, resource);
                        if (isSaveSuccess) {
                            Toast.makeText(ImageViewLookActivity.this, getString(R.string.ykf_save_pic_ok), Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(ImageViewLookActivity.this, getString(R.string.ykf_save_pic_fail), Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onLoadCleared(@Nullable Drawable placeholder) {

                    }
                });

    }


}
