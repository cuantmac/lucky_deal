package com.m7.imkfsdk.chat.holder;

import android.text.TextUtils;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.view.CircleProgressView;
import com.moor.imkf.model.entity.FromToMessage;

/**
 * Created by longwei on 2016/3/10.
 */
public class FileViewHolder extends BaseHolder {

    private TextView chat_content_tv_name;
    private TextView chat_content_tv_size;
    private TextView chat_content_tv_status;
    private CircleProgressView chat_content_pb_progress;
    private ImageView chat_content_iv_download;
    private ImageView ykf_chat_file_icon;

    public FileViewHolder(int type) {
        super(type);
    }

    public BaseHolder initBaseHolder(View baseView, boolean isReceive) {
        super.initBaseHolder(baseView);

        //通过baseview找到对应组件
        chat_content_tv_name = (TextView) baseView.findViewById(R.id.chat_content_tv_name);
        chat_content_tv_size = (TextView) baseView.findViewById(R.id.chat_content_tv_size);
        chat_content_tv_status = (TextView) baseView.findViewById(R.id.chat_content_tv_status);
        chat_content_pb_progress = (CircleProgressView) baseView.findViewById(R.id.chat_content_pb_progress);
        if(isReceive) {
            chat_content_iv_download = (ImageView) baseView.findViewById(R.id.chat_content_iv_download);
            type = 8;
            return this;
        }
        progressBar = (ProgressBar) baseView.findViewById(R.id.uploading_pb);
        type = 9;
        return this;
    }

    public TextView getChat_content_tv_name() {
        if(chat_content_tv_name == null) {
            chat_content_tv_name = (TextView) getBaseView().findViewById(R.id.chat_content_tv_name);
        }
        return chat_content_tv_name;
    }
    public TextView getChat_content_tv_size() {
        if(chat_content_tv_size == null) {
            chat_content_tv_size = (TextView) getBaseView().findViewById(R.id.chat_content_tv_size);
        }
        return chat_content_tv_size;
    }
    public TextView getChat_content_tv_status() {
        if(chat_content_tv_status == null) {
            chat_content_tv_status = (TextView) getBaseView().findViewById(R.id.chat_content_tv_status);
        }
        return chat_content_tv_status;
    }
    public CircleProgressView getChat_content_pb_progress() {
        if(chat_content_pb_progress == null) {
            chat_content_pb_progress = (CircleProgressView) getBaseView().findViewById(R.id.chat_content_pb_progress);
        }
        return chat_content_pb_progress;
    }
    public ImageView getChat_content_iv_download() {
        if(chat_content_iv_download == null) {
            chat_content_iv_download = (ImageView) getBaseView().findViewById(R.id.chat_content_iv_download);
        }
        return chat_content_iv_download;
    }
    public ImageView getYkf_chat_file_icon() {
        if(ykf_chat_file_icon ==null){
            ykf_chat_file_icon =(ImageView) getBaseView().findViewById(R.id.ykf_chat_file_icon);
        }
        return ykf_chat_file_icon;
    }
    public void setFile_Icon(FromToMessage message){
        int resId;
        if(!TextUtils.isEmpty(message.fileName)){
            String endStr = message.fileName.toLowerCase().substring(message.fileName.lastIndexOf(".") + 1);
            switch (endStr) {
                case "zip":
                case "rar":
                    resId = R.drawable.ykf_icon_file_default;
                    break;
                case "word":
                case "doc":
                case "docx":
                    resId = R.drawable.ykf_icon_file_word;
                    break;
                case "ppt":
                case "pptx":
                    resId = R.drawable.ykf_icon_file_ppt;
                    break;
                case "pdf":
                    resId = R.drawable.ykf_icon_file_pdf;
                    break;
                case "excel":
                case "xls":
                case "xlsx":
                    resId = R.drawable.ykf_icon_file_xls;
                    break;
                case "mp4":
                case "mov":
                case "avi":
                    resId = R.drawable.ykf_icon_file_video;
                    break;
                case "mp3":
                case "wav":
                    resId = R.drawable.ykf_icon_file_music;
                    break;
                case "jpg":
                case "png":
                case "bmp":
                case "jpeg":
                    resId = R.drawable.ykf_icon_file_jpg;
                    break;
                default:
                    resId = R.drawable.ykf_icon_file_default;
                    break;
            }
        }else{
            resId = R.drawable.ykf_icon_file_default;
        }

        getYkf_chat_file_icon().setImageResource(resId);
    }
}
