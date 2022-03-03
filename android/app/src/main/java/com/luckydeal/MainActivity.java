package com.luckydeal;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.provider.CalendarContract;
import android.provider.CalendarContract.Events;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.packagerconnection.PackagerConnectionSettings;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.utils.LogUtil;
import com.luckyapp.common.utils.SharedPreferencesUtil;
import com.luckydeal.update.UpdateManager;
import com.luckydeal.util.PermissionHelper;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import java.util.List;
import java.util.TimeZone;
import static com.luckydeal.AppModule.EVENT_MESSAGE_TYPE;
import static com.luckydeal.AppModule.EVENT_PAYRESULT_TYPE;
import static com.luckydeal.notification.FCMReceiver.WHAT_FCM_EXTRA;
import io.branch.rnbranch.*; // <-- add this

public class MainActivity extends ReactActivity {
    public static final String TAG = "MainActivity";
    public static final String KEY_EXTRA = "extra";
    private static final int REQUEST_CODE_CALENDAR = 0x1;
    private PermissionHelper permissionHelper;
    private Handler mHandler;
    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Gesleben";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        PackagerConnectionSettings settings = new PackagerConnectionSettings(this);
        if ("localhost:8081".equals(settings.getDebugServerHost()) && !TextUtils.isEmpty(BuildConfig.DEBUG_HTTP_HOST)) {
            settings.setDebugServerHost(BuildConfig.DEBUG_HTTP_HOST + ":8081");
        }
        super.onCreate(savedInstanceState);
        EventBus.getDefault().register(this);
        openNotification(getIntent());
        permissionHelper = new PermissionHelper(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    // Override onStart, onNewIntent:
    @Override
    protected void onStart() {
        super.onStart();
        RNBranchModule.initSession(getIntent().getData(), this);
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        openNotification(intent);
        if (BuildConfig.DEV_MODE || BuildConfig.DEBUG) {
            RNBranchModule.setDebug();
        }
        RNBranchModule.onNewIntent(intent);
    }

    private void openNotification(Intent intent) {
        try {
            if (intent != null) {
                try {
                    Uri uri = intent.getData();
                    if (uri != null) {
                        String host = uri.getHost();//share
                        if ("share".equals(host)) {
                            ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();
                            ReactApplicationContext context = (ReactApplicationContext) mReactInstanceManager.getCurrentReactContext();
                            if (context != null) {
                                List<String> data = uri.getPathSegments();
                                if (data.size() > 0) {
                                    String back = data.get(0);
                                    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                            .emit(EVENT_PAYRESULT_TYPE, back);
                                    LogUtil.d(TAG, "data =" + back);
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                }
                String extra = intent.getStringExtra("extra");
                LogUtil.d(TAG, "data =" + extra);
                handleExtra(extra);
            }
        } catch (Throwable throwable) {
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEvent(Message message) {
        if (message.what == WHAT_FCM_EXTRA) {
            String extra = (String) message.obj;
            LogUtil.d(TAG, "data =onEvent" + extra);
            handleExtra(extra);
        }
    }

    private void handleExtra(String extra) {
        if (!TextUtils.isEmpty(extra)) {
            GlobalApp.getHandelr().postDelayed(() -> {
                ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();
                ReactApplicationContext context = (ReactApplicationContext) mReactInstanceManager.getCurrentReactContext();
                if (context != null) {
                    LogUtil.d(TAG, "data=" + extra);
                    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(EVENT_MESSAGE_TYPE, extra);
                }
            }, 1000);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        permissionHelper.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @SuppressLint("MissingPermission")
    public void addToCalendar(double beginTimeInSec, double endTimeInSec, String title, String desc, Promise promise) {
        permissionHelper.setListener(new PermissionHelper.PermissionsListener() {
            @Override
            public void onPermissionGranted(int request_code) {

                long calID = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? 3 : 1;

                try {
                    String[] projection = {CalendarContract.Calendars._ID, CalendarContract.Calendars.IS_PRIMARY};
                    Uri calendars = CalendarContract.Calendars.CONTENT_URI;
                    ContentResolver contentResolver = getContentResolver();
                    Cursor cursor = contentResolver.query(calendars, projection, null, null, null);
                    if (cursor != null) {
                        while (cursor.moveToNext()) {
                            int idCol = cursor.getColumnIndex(projection[0]);
                            int primaryCol = cursor.getColumnIndex(projection[1]);
                            long _calID = cursor.getLong(idCol);
                            int isPrimary = cursor.getInt(primaryCol);
                            LogUtil.d("addToCalendar", "id", _calID, isPrimary);
                            if (isPrimary == 1) {
                                calID = _calID;
                            }
                        }
                        cursor.close();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                LogUtil.d("addToCalendar", calID);

                try {
                    ContentResolver cr = getContentResolver();
                    ContentValues values = new ContentValues();
                    values.put(Events.DTSTART, beginTimeInSec * 1000);
                    values.put(Events.DTEND, endTimeInSec * 1000);
                    values.put(Events.TITLE, title);
                    values.put(Events.DESCRIPTION, desc);
                    values.put(Events.CALENDAR_ID, calID);
                    values.put(Events.EVENT_TIMEZONE, TimeZone.getDefault().getID());
                    values.put(Events.HAS_ALARM, true);
                    values.put(Events.CUSTOM_APP_PACKAGE, getPackageName());
                    values.put(Events.CUSTOM_APP_URI, "luckydeal://share");
                    Uri uri = cr.insert(Events.CONTENT_URI, values);
                    try {
                        long eventID = Long.parseLong(uri.getLastPathSegment());
                        ContentValues reminders = new ContentValues();
                        reminders.put(CalendarContract.Reminders.EVENT_ID, eventID);
                        reminders.put(CalendarContract.Reminders.METHOD, CalendarContract.Reminders.METHOD_ALERT);
                        reminders.put(CalendarContract.Reminders.MINUTES, 2);
                        Uri uri2 = cr.insert(CalendarContract.Reminders.CONTENT_URI, reminders);
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                    LogUtil.d("addToCalendar", "success");
                } catch (Exception e) {
                    e.printStackTrace();
                }
                promise.resolve(true);
            }

            @Override
            public void onPermissionRejectedManyTimes(@NonNull List<String> rejectedPerms, int request_code) {
                Intent intent = new Intent(Intent.ACTION_INSERT)
                        .setData(Events.CONTENT_URI)
                        .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, (long) (beginTimeInSec * 1000))
                        .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, (long) (endTimeInSec * 1000))
                        .putExtra(Events.TITLE, title)
                        .putExtra(Events.DESCRIPTION, desc)
                        .putExtra(Events.AVAILABILITY, Events.AVAILABILITY_BUSY);
                startActivity(intent);
                promise.resolve(false);
            }
        });
        permissionHelper.requestPermission(new String[]{Manifest.permission.READ_CALENDAR, Manifest.permission.WRITE_CALENDAR}, REQUEST_CODE_CALENDAR);
    }

    @Override
    protected void onDestroy() {
        EventBus.getDefault().unregister(this);
        permissionHelper.onDestroy();

        SharedPreferencesUtil.get().setValue("fb_target_item", "");
        SharedPreferencesUtil.get().setValue("fb_target_type", "");
        if(mHandler != null) {
            mHandler.removeCallbacksAndMessages(null);
            mHandler = null;
        }

        super.onDestroy();
    }

    public void hideSplash() {
    }

}
