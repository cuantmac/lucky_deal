package com.luckydeal.view;
import android.app.Activity;
import android.content.Context;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.widget.ImageView;
import androidx.annotation.NonNull;
import androidx.vectordrawable.graphics.drawable.Animatable2Compat;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.GranularRoundedCorners;
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions;
import com.bumptech.glide.load.resource.gif.GifDrawable;
import com.bumptech.glide.request.target.ImageViewTarget;
import com.bumptech.glide.request.transition.DrawableCrossFadeFactory;
import com.bumptech.glide.request.transition.Transition;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.FloatUtil;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.yoga.YogaConstants;
import com.luckyapp.common.utils.LogUtil;
import com.luckydeal.BuildConfig;
import com.luckydeal.GlideApp;
import com.luckydeal.GlideRequest;
import com.luckydeal.R;
import com.luckydeal.util.BitmapUtil;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Map;

import javax.annotation.Nullable;

import static com.facebook.react.views.image.ReactImageView.REMOTE_TRANSPARENT_BITMAP_URI;

@ReactModule(name = "GlideImageNative")
public class GlideImageManager extends SimpleViewManager<GlideImageManager.GlideImageView> {

    public static class GlideImageView extends androidx.appcompat.widget.AppCompatImageView {
        //private
        private GlideImageSource mImageSource;
        private GlideImageSource mDefaultImageSource;
        private boolean mIsDirty = false;
        private @Nullable float[] mBorderCornerRadii;
        private boolean isGif = false;
        public GlideImageView(Context context) {
            super(context);
        }

        public void setIsGif(boolean isGif) {
            this.isGif = isGif;
        }
        public void setSource(ReadableMap source) {
            if (source == null) {
                mImageSource = new GlideImageSource(getContext(), REMOTE_TRANSPARENT_BITMAP_URI);
            } else {
                String uri = source.getString("uri");
                mImageSource = new GlideImageSource(getContext(), uri);
            }
            mIsDirty = true;
        }

        public void setDefaultSource(ReadableMap source) {
            if (source == null) {
                mDefaultImageSource = new GlideImageSource(getContext(), REMOTE_TRANSPARENT_BITMAP_URI);
            } else {
                String uri = source.getString("uri");
                mDefaultImageSource = new GlideImageSource(getContext(), uri);
            }
            mIsDirty = true;
        }

        public void setBorderRadius(int index, float borderRadius) {
            if (mBorderCornerRadii == null) {
                mBorderCornerRadii = new float[4];
                Arrays.fill(mBorderCornerRadii, 0);
            }

            if (index == 0) {
                if (!FloatUtil.floatsEqual(mBorderCornerRadii[0], borderRadius)) {
                    Arrays.fill(mBorderCornerRadii, borderRadius);
                    mIsDirty = true;
                }
            } else {
                if (!FloatUtil.floatsEqual(mBorderCornerRadii[index - 1], borderRadius)) {
                    mBorderCornerRadii[index - 1] = borderRadius;
                    mIsDirty = true;
                }
            }
        }

        @Override
        protected void onSizeChanged(int w, int h, int oldw, int oldh) {
            super.onSizeChanged(w, h, oldw, oldh);
            if (w > 0 && h > 0) {
                mIsDirty = true;
                update();
            }
        }

        public void update() {
            if (!mIsDirty) {
                return;
            }

            if (mImageSource == null) {
                return;
            }

            if (getContext() instanceof Activity) {
                if (((Activity) getContext()).isFinishing() || ((Activity) getContext()).isDestroyed()) {
                    return;
                }
            } else if (getContext() instanceof ReactContext) {
                Activity activity = ((ReactContext)getContext()).getCurrentActivity();
                if (activity == null || activity.isFinishing() || activity.isDestroyed()) {
                    return;
                }
            }

            if (mBorderCornerRadii == null) {
                mBorderCornerRadii = new float[4];
                Arrays.fill(mBorderCornerRadii, 0);
            }

            GranularRoundedCorners roundedCorners = new GranularRoundedCorners(mBorderCornerRadii[0], mBorderCornerRadii[1], mBorderCornerRadii[2], mBorderCornerRadii[3]);

            try {
                GlideRequest<Drawable> transforms = GlideApp
                        .with(this)
                        .load(mDefaultImageSource.getUri())
                        .centerCrop()
                        .transform(roundedCorners);
                if(isGif) {
                    Glide.with(this)
                            .asGif()
                            .load(mImageSource.getUri())
                            .centerCrop()
                            .transition(DrawableTransitionOptions.withCrossFade())
                            .transform(roundedCorners)
                            .into(new ImageViewTarget<GifDrawable>(this) {
                                @Override
                                public void onResourceReady(@NonNull GifDrawable resource, @androidx.annotation.Nullable Transition<? super GifDrawable> transition) {
                                    super.onResourceReady(resource, transition);
                                    final ImageView imageView = this.view;
                                    imageView.setImageDrawable(resource);
                                    resource.setLoopCount(1);
                                    resource.registerAnimationCallback(new Animatable2Compat.AnimationCallback() {
                                        @Override
                                        public void onAnimationStart(Drawable drawable) {
                                            super.onAnimationStart(drawable);
                                        }

                                        @Override
                                        public void onAnimationEnd(Drawable drawable) {
                                            super.onAnimationEnd(drawable);
                                            try {
                                                WritableMap event = Arguments.createMap(); // 这里传了个空的 event 对象，使用时可以在 event 中加入要传输的数据
                                                ReactContext reactContext = (ReactContext) imageView.getContext();
                                                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                                                        imageView.getId(),
                                                        "onNativeCallBack", // 与下面注册的要发送的事件名称必须相同
                                                        event);
                                            } catch (Exception e) {

                                            }
                                        }
                                    });
                                }

                                @Override
                                protected void setResource(@androidx.annotation.Nullable GifDrawable resource) {
                                }
                            });
                } else {
                    GlideApp.with(this)
                            .load(mImageSource.getUri())
                            .thumbnail(transforms)
                            .centerCrop()
                            .transition(new DrawableTransitionOptions().crossFade(new DrawableCrossFadeFactory.Builder().setCrossFadeEnabled(true)))
                            .transform(roundedCorners)
                            .into(this);
                }
            } catch (Throwable e) {
                //FIXME why activity destroyed?
                e.printStackTrace();
            }
            mIsDirty = false;
        }
    }

    /**
     * Converts JS resize modes into {@code ScalingUtils.ScaleType}. See {@code ImageResizeMode.js}.
     */
    public static ImageView.ScaleType toScaleType(@androidx.annotation.Nullable String resizeModeValue) {
        if ("contain".equals(resizeModeValue)) {
            return ImageView.ScaleType.FIT_CENTER;
        }
        if ("cover".equals(resizeModeValue)) {
            return ImageView.ScaleType.CENTER_CROP;
        }
        if ("stretch".equals(resizeModeValue)) {
            return ImageView.ScaleType.FIT_XY;
        }
        if ("center".equals(resizeModeValue)) {
            return ImageView.ScaleType.CENTER_INSIDE;
        }
        return ImageView.ScaleType.CENTER_CROP;
    }

    @NonNull
    @Override
    public String getName() {
        return "GlideImageNative";
    }

    @NonNull
    @Override
    protected GlideImageView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new GlideImageView(reactContext);
    }

    @ReactProp(name = "source")
    public void setSource(GlideImageView view, @Nullable ReadableMap source) {
        view.setSource(source);
    }

    @ReactProp(name = "defaultSource")
    public void setDefaultSource(GlideImageView view, @Nullable ReadableMap source) {
        view.setDefaultSource(source);
    }

    @ReactPropGroup(
            names = {
                    ViewProps.BORDER_RADIUS,
                    ViewProps.BORDER_TOP_LEFT_RADIUS,
                    ViewProps.BORDER_TOP_RIGHT_RADIUS,
                    ViewProps.BORDER_BOTTOM_RIGHT_RADIUS,
                    ViewProps.BORDER_BOTTOM_LEFT_RADIUS
            },
            defaultFloat = YogaConstants.UNDEFINED)
    public void setBorderRadius(GlideImageView view, int index, float borderRadius) {
        if (!YogaConstants.isUndefined(borderRadius)) {
            borderRadius = PixelUtil.toPixelFromDIP(borderRadius);
        }
        view.setBorderRadius(index, borderRadius);
    }

    @ReactProp(name = "tintColor", customType = "Color")
    public void setTintColor(ImageView view, @Nullable Integer tintColor) {
        if (tintColor == null) {
            view.clearColorFilter();
        } else {
            view.setColorFilter(tintColor, PorterDuff.Mode.SRC_IN);
        }
    }

    @ReactProp(name = ViewProps.RESIZE_MODE)
    public void setResizeMode(GlideImageView view, @androidx.annotation.Nullable String resizeMode) {
        view.setScaleType(toScaleType(resizeMode));
    }
    @ReactProp(name = "gif")
    public void setGif(GlideImageView view, Boolean gif) {
        view.setIsGif(gif);
    }
    @Override
    protected void onAfterUpdateTransaction(@NonNull GlideImageView view) {
        super.onAfterUpdateTransaction(view);
        view.update();
    }

    @Nullable
    @Override
    @ReactMethod
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "onNativeCallBack", MapBuilder.of("registrationName", "onCallBack"));
        // onNativeClick 是原生要发送的 event 名称，onReactClick 是 JS 端组件中注册的属性方法名称，中间的 registrationName 不可更改
    }

}
