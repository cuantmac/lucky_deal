package com.m7.imkfsdk.chat;

import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.m7.imkfsdk.R;
import com.m7.imkfsdk.constant.Constants;

public class KFBaseActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SharedPreferences  spData = this.getSharedPreferences("moordata", 0);
        int themeType = spData.getInt(Constants.SYSTHEME, 0);
        if (themeType == 0) {
            setTheme(R.style.KFSdkAppTheme);
        } else if (themeType == 1) {
            setTheme(R.style.KFSdkAppTheme1);
        }
    }
}
