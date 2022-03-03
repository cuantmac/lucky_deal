package com.luckyapp.common.utils;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Paint;
import android.view.WindowManager;
import android.widget.TextView;

/**
 * 屏幕尺寸转换的工具类；
 * 
 * @author Wang
 * 
 */
public class DisplayUtil {

	/**
	 * 将px值转换为dip或dp值，保证尺寸大小不变
	 */
	public static int px2dip(Context context, float pxValue) {
		final float scale = context.getResources().getDisplayMetrics().density;
		return (int) (pxValue / scale + 0.5f);
	}

	/**
	 * 将dip或dp值转换为px值，保证尺寸大小不变
	 */
	public static int dip2px(Context context, float dipValue) {
		final float scale = context.getResources().getDisplayMetrics().density;
		return (int) (dipValue * scale + 0.5f);
	}

	public static int dip2px(float dipValue) {
		final float scale = Resources.getSystem().getDisplayMetrics().density;
		return (int) (dipValue * scale + 0.5f);
	}

	/**
	 * 将px值转换为sp值，保证文字大小不变
	 */
	public static int px2sp(Context context, float pxValue) {
		final float fontScale = context.getResources().getDisplayMetrics().scaledDensity;
		return (int) (pxValue / fontScale + 0.5f);
	}

	/**
	 * 将sp值转换为px值，保证文字大小不变
	 */
	public static int sp2px(Context context, float spValue) {
		final float fontScale = context.getResources().getDisplayMetrics().scaledDensity;
		return (int) (spValue * fontScale + 0.5f);
	}


	public static int getScreenWidth(Context context){
		return getScreenDispaly(context)[0];
	}
	public static int getScreenHeight(Context context){
		return getScreenDispaly(context)[1];
	}
	/**
	 * 获取屏幕分辨率
	 */
	@SuppressWarnings("deprecation")
	public static int[] getScreenDispaly(Context context) {
		WindowManager windowManager = (WindowManager) context
				.getSystemService(Context.WINDOW_SERVICE);
		int width = windowManager.getDefaultDisplay().getWidth();// 手机屏幕的宽度
		int height = windowManager.getDefaultDisplay().getHeight();// 手机屏幕的高度
		int result[] = { width, height };
		return result;
	}

	/**
	 * 获取textview的长度
	 *
	 * @param currentTextView
	 * @return
	 */
	public static float getTextSize(TextView currentTextView) {
		Paint paint = new Paint();
		paint.setTextSize(currentTextView.getTextSize());
		float size = paint.measureText(currentTextView.getText().toString());
		return size;
	}

	/**
	 * 得到系统栏高度
	 *
	 * @param context
	 * @return
	 */
	public static int getStatusHeight(Context context) {
		int statusBarHeight = 0;
		try {
			Class<?> clazz = Class.forName("com.android.internal.R$dimen");
			Object object = clazz.newInstance();
			int height = Integer.parseInt(clazz.getField("status_bar_height")
					.get(object).toString());
			statusBarHeight = context.getResources().getDimensionPixelSize(height);
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return statusBarHeight;
	}
}