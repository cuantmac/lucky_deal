package com.luckydeal.update;

import android.app.Activity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.JSBundleLoader;
import com.facebook.react.bridge.ReactContext;
import com.luckyapp.common.GlobalApp;
import com.luckyapp.common.rxjava.RxUtils;
import com.luckyapp.common.utils.LogUtil;
import com.luckydeal.BuildConfig;
import java.io.File;
import java.lang.reflect.Field;

public class ReactBundleLoader {
    ReactInstanceManager instanceManager;

    public ReactBundleLoader(ReactInstanceManager instanceManager) {
        this.instanceManager = instanceManager;
    }

    public static String getJSBundleFile() {
        if (UpdateManager.get().getInstalledBundleVersion() <= BuildConfig.BUNDLE_CODE) {
            return null;
        }
        File dir = GlobalApp.get().getFileStreamPath(Constants.UPDATE_DIR);
        File file = new File(dir, Constants.BUNDLE_NAME);
        if (file.exists()) {
            return file.getAbsolutePath();
        }
        return null;
    }

    public void installBundle() {
        try {
            String latestJSBundleFile = getJSBundleFile();

            // Update the locally stored JS bundle file path
            setJSBundle(instanceManager, latestJSBundleFile);

            // Get the context creation method and fire it on the UI thread (which RN enforces)
            RxUtils.post(() -> {
                try {
                    // We don't need to resetReactRootViews anymore
                    // due the issue https://github.com/facebook/react-native/issues/14533
                    // has been fixed in RN 0.46.0
                    //resetReactRootViews(instanceManager);

                    instanceManager.recreateReactContextInBackground();
                } catch (Exception e) {
                    // The recreation method threw an unknown exception
                    // so just simply fallback to restarting the Activity (if it exists)
                    loadBundleLegacy();
                }
            });


        } catch (Exception e) {
            // Our reflection logic failed somewhere
            // so fall back to restarting the Activity (if it exists)
            LogUtil.d("Failed to load the bundle, falling back to restarting the Activity (if it exists). " + e.getMessage());
            loadBundleLegacy();
        }
    }

    // Use reflection to find and set the appropriate fields on ReactInstanceManager. See #556 for a proposal for a less brittle way
    // to approach this.
    private void setJSBundle(ReactInstanceManager instanceManager, String latestJSBundleFile) throws IllegalAccessException {
        try {
            JSBundleLoader latestJSBundleLoader;
            if (latestJSBundleFile.toLowerCase().startsWith("assets://")) {
                latestJSBundleLoader = JSBundleLoader.createAssetLoader(instanceManager.getCurrentReactContext(), latestJSBundleFile, false);
            } else {
                latestJSBundleLoader = JSBundleLoader.createFileLoader(latestJSBundleFile);
            }

            Field bundleLoaderField = instanceManager.getClass().getDeclaredField("mBundleLoader");
            bundleLoaderField.setAccessible(true);
            bundleLoaderField.set(instanceManager, latestJSBundleLoader);
        } catch (Exception e) {
            LogUtil.d("Unable to set JSBundle - CodePush may not support this version of React Native");
            throw new IllegalAccessException("Could not setJSBundle");
        }
    }

    private void loadBundleLegacy() {
        ReactContext context = instanceManager.getCurrentReactContext();
        if (context == null) {
            return;
        }
        Activity currentActivity = context.getCurrentActivity();
        if (currentActivity == null) {
            // The currentActivity can be null if it is backgrounded / destroyed, so we simply
            // no-op to prevent any null pointer exceptions.
            return;
        }
        currentActivity.runOnUiThread(currentActivity::recreate);
    }
}
