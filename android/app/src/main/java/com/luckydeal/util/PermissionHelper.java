package com.luckydeal.util;

import android.Manifest;
import android.app.Activity;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by harshith on 10-03-2017.
 */


public class PermissionHelper {

    private static final String TAG = "Permission Helper";

    public interface PermissionsListener {
        void onPermissionGranted(int request_code);

        void onPermissionRejectedManyTimes(@NonNull List<String> rejectedPerms, int request_code);
    }

    private WeakReference<Activity> activity_view;

    private PermissionsListener pListener;

    private List<String> deniedpermissions = new ArrayList<>();
    private List<String> granted = new ArrayList<>();

    public PermissionHelper(Activity view) {
        this.activity_view = new WeakReference<>(view);
    }

    /**
     * Request permissions.
     *
     * @param permissions  -String Array of permissions to request, for eg: new String[]{PermissionManager.CAMERA} or multiple new String[]{PermissionManger.CAMERE,PermissionManager.CONTACTS}
     * @param request_code - Request code to check on callback.
     */
    public void requestPermission(@NonNull String[] permissions, int request_code) {
        deniedpermissions.clear();

        Activity activity = activity_view.get();
        if (activity == null) return;

        boolean allPermissionGranted = true;

        for (String permission : permissions) {
            try {
                if (ActivityCompat.checkSelfPermission(activity, permission) == PackageManager.PERMISSION_DENIED) {
                    allPermissionGranted = false;
                    deniedpermissions.add(permission);
                    Log.d(TAG, "denied " + permission);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return;
            }
        }

        if (!allPermissionGranted) {
            ActivityCompat.requestPermissions(activity, deniedpermissions.toArray(new String[0]), request_code);
        } else {
            getListener().onPermissionGranted(request_code);
        }
    }

    /***
     * After the permissions are requested, pass the results from Activity/fragments onRequestPermissionsResult to this function for processing
     * @param requestCode
     * @param permissions
     * @param grantResults
     */
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        Activity activity = activity_view.get();
        if (activity == null) return;
        if (pListener == null) return;
        StringBuilder permission_name = new StringBuilder();
        boolean never_ask_again = false;
        granted.clear();

        for (String permission : deniedpermissions) {
            if (ContextCompat.checkSelfPermission(activity, permission) == PackageManager.PERMISSION_GRANTED) {
                granted.add(permission);
            } else {
                if (!ActivityCompat.shouldShowRequestPermissionRationale(activity, permission)) {
                    never_ask_again = true;
                }
                permission_name.append(",");
                permission_name.append(PermissionHelper.getNameFromPermission(permission));
            }
        }
        String res = permission_name.toString();
        deniedpermissions.removeAll(granted);

        if (deniedpermissions.size() > 0) {
            res = res.substring(1);
            if (!never_ask_again) {
                getRequestAgainAlertDialog(activity, res, requestCode);
            } else {
                goToSettingsAlertDialog(activity, res, requestCode);
            }
        } else {
            getListener().onPermissionGranted(requestCode);
        }
    }

    private void goToSettingsAlertDialog(final Activity view, String permission_name, final int request_code) {
        new AlertDialog.Builder(view).setTitle("Permission Required").setMessage("We need " + permission_name + " permissions")
                .setPositiveButton("GO TO SETTINGS", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        final Intent intent = new Intent();
                        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                        intent.addCategory(Intent.CATEGORY_DEFAULT);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                        intent.setData(Uri.parse("package:" + view.getPackageName()));
                        view.startActivity(intent);
                    }
                })
                .setNegativeButton("NO", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        getListener().onPermissionRejectedManyTimes(deniedpermissions, request_code);
                    }
                }).show();
    }

    private void getRequestAgainAlertDialog(Activity view, String permission_name, final int request_code) {
        new AlertDialog.Builder(view).setTitle("Permission Required")
                .setMessage("We need " + permission_name + " permissions")
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        requestPermission(deniedpermissions.toArray(new String[0]), request_code);
                    }
                })
                .setNegativeButton("NO", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        getListener().onPermissionRejectedManyTimes(deniedpermissions, request_code);
                    }
                }).show();
    }

    private PermissionsListener getListener() {
        return pListener;
    }

    private static Map<String, String> labelsMap;

    public static String getNameFromPermission(String permission) {
        if (labelsMap == null) {
            labelsMap = new HashMap<>();
            labelsMap.put(Manifest.permission.READ_EXTERNAL_STORAGE, "Read Storage");
            labelsMap.put(Manifest.permission.WRITE_EXTERNAL_STORAGE, "Write Storage");
            labelsMap.put(Manifest.permission.CAMERA, "Camera");
            labelsMap.put(Manifest.permission.CALL_PHONE, "Call");
            labelsMap.put(Manifest.permission.READ_SMS, "SMS");
            labelsMap.put(Manifest.permission.RECEIVE_SMS, "Receive SMS");
            labelsMap.put(Manifest.permission.ACCESS_FINE_LOCATION, "Exact Location");
            labelsMap.put(Manifest.permission.ACCESS_COARSE_LOCATION, "Close Location");
            labelsMap.put(Manifest.permission.WRITE_CALENDAR, "Write Calendar");
        }
        String value = labelsMap.get(permission);
        if (value == null) {
            String[] split = permission.split("\\.");
            return split[split.length - 1];
        } else {
            return value;
        }
    }

    public PermissionHelper setListener(PermissionsListener pListener) {
        this.pListener = pListener;
        return this;
    }

    public void onDestroy() {
        pListener = null;
        activity_view = null;
    }

}