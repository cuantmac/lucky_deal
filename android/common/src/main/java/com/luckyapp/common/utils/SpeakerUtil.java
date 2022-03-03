package com.luckyapp.common.utils;

import android.content.Context;
import android.media.AudioManager;

/**
 * Created by dujun on 2019/1/21.
 */
public class SpeakerUtil {

    private static int currVolume = 0;

    /**
     * 打开扬声器
     * @param mContext
     */
    public static void openSpeaker(Context mContext) {

        try {
            AudioManager audioManager = (AudioManager)mContext.getSystemService(Context.AUDIO_SERVICE);
            audioManager.setSpeakerphoneOn(true);
        } catch (Throwable e) {

        }
        /*try {
            //判断扬声器是否在打开
            AudioManager audioManager = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
            audioManager.setMode(AudioManager.ROUTE_SPEAKER);
            //获取当前通话音量
            currVolume = audioManager.getStreamVolume(AudioManager.STREAM_VOICE_CALL);

            if (!audioManager.isSpeakerphoneOn()) {
                audioManager.setSpeakerphoneOn(true);

                audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL,
                        audioManager.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL),
                        AudioManager.STREAM_VOICE_CALL);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }*/
    }

    /**
     * 关闭扬声器
     * @param mContext
     */
    public static void closeSpeaker(Context mContext) {
        try {
            AudioManager audioManager = (AudioManager)mContext.getSystemService(Context.AUDIO_SERVICE);
            audioManager.setSpeakerphoneOn(false);
        } catch (Throwable e) {

        }
        /*try {
            AudioManager audioManager = (AudioManager) mContext.getSystemService(Context.AUDIO_SERVICE);
            if(audioManager != null) {
                if(audioManager.isSpeakerphoneOn()) {
                    audioManager.setSpeakerphoneOn(false);
                    audioManager.setStreamVolume(AudioManager.STREAM_VOICE_CALL,currVolume,
                            AudioManager.STREAM_VOICE_CALL);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }*/
    }
}
