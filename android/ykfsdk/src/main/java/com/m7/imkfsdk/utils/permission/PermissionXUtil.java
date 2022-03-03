package com.m7.imkfsdk.utils.permission;

import androidx.fragment.app.FragmentActivity;
import android.widget.Toast;


import com.m7.imkfsdk.utils.permission.callback.ExplainReasonCallbackWithBeforeParam;
import com.m7.imkfsdk.utils.permission.callback.ForwardToSettingsCallback;
import com.m7.imkfsdk.utils.permission.callback.OnRequestCallback;
import com.m7.imkfsdk.utils.permission.callback.RequestCallback;
import com.m7.imkfsdk.utils.permission.request.ExplainScope;
import com.m7.imkfsdk.utils.permission.request.ForwardScope;

import java.util.ArrayList;
import java.util.List;

/**
 * @Description: PermissionX的封装工具类
 * @Author: chenbo
 * @Date: 2020/6/17
 */
public class PermissionXUtil {

    public static void checkPermission(final FragmentActivity activity, final OnRequestCallback onRequestCallback, String... permission) {
        PermissionX.init(activity)
                .permissions(permission)
                .onExplainRequestReason(new ExplainReasonCallbackWithBeforeParam() {
                    @Override
                    public void onExplainReason(ExplainScope scope, List<String> deniedList, boolean beforeRequest) {
//                        if (beforeRequest) {
                        List<String> mList = new ArrayList<>();
                        for (String item : deniedList) {
                            mList.add(PermissionConstants.getInstance().getPermissionName(item));
                        }
                        scope.showRequestReasonDialog(deniedList, "为了保证程序正常工作，请您同意权限申请" , "确认", "取消");
//                        } else {
//                            List<String> filteredList = new ArrayList<>();
//                            for (String permission : deniedList) {
//                                if (permission.equals(Manifest.permission.CAMERA)) {
//                                    filteredList.add(permission);
//                                }
//                            }
//                            scope.showRequestReasonDialog(filteredList, "摄像机权限是程序必须依赖的权限" + deniedList, "我已明白");
//                        }
                    }
                })
                .onForwardToSettings(new ForwardToSettingsCallback() {
                    @Override
                    public void onForwardToSettings(ForwardScope scope, List<String> deniedList) {
                        List<String> mList = new ArrayList<>();
                        for (String item : deniedList) {
                            mList.add(PermissionConstants.getInstance().getPermissionName(item));
                        }
                        scope.showForwardToSettingsDialog(deniedList, "You need to go to the application settings to manually enable audio permissions." , "Confirm", "Cancel");
                    }
                })
                .request(new RequestCallback() {
                    @Override
                    public void onResult(boolean allGranted, List<String> grantedList, List<String> deniedList) {
                        if (allGranted) {
                            if (onRequestCallback != null) {
                                onRequestCallback.requestSuccess();
                            }
                        } else {
                            List<String> mList = new ArrayList<>();
                            for (String item : deniedList) {
                                mList.add(PermissionConstants.getInstance().getPermissionName(item));
                            }
                            Toast.makeText(activity, "您拒绝了如下权限：" + mList, Toast.LENGTH_LONG).show();
                        }
                    }
                });
    }
}
