/*
 * Copyright (C)  guolin, PermissionX Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.m7.imkfsdk.utils.permission.request;



import com.m7.imkfsdk.utils.permission.callback.ExplainReasonCallback;
import com.m7.imkfsdk.utils.permission.callback.ExplainReasonCallbackWithBeforeParam;

import java.util.List;

/**
 * Provide specific scopes for {@link ExplainReasonCallback} and {@link ExplainReasonCallbackWithBeforeParam} to give it specific functions to call.
 *
 * @Author: chenbo
 * @Date: 2020/6/17
 */
public class ExplainScope {

    private PermissionBuilder pb;

    private ChainTask chainTask;

    ExplainScope(PermissionBuilder pb, ChainTask chainTask) {
        this.pb = pb;
        this.chainTask = chainTask;
    }

    /**
     * Show a rationale dialog to explain to user why you need these permissions.
     *
     * @param permissions  Permissions that to request.
     * @param message      Message that show to user.
     * @param positiveText Text on the positive button. When user click, PermissionX will request permissions again.
     * @param negativeText Text on the negative button. When user click, PermissionX will finish request.
     */
    public void showRequestReasonDialog(List<String> permissions, String message, String positiveText, String negativeText) {
        pb.showHandlePermissionDialog(chainTask, true, permissions, message, positiveText, negativeText);
    }

    /**
     * Show a rationale dialog to explain to user why you need these permissions.
     *
     * @param permissions  Permissions that to request.
     * @param message      Message that show to user.
     * @param positiveText Text on the positive button. When user click, PermissionX will request permissions again.
     */
    public void showRequestReasonDialog(List<String> permissions, String message, String positiveText) {
        showRequestReasonDialog(permissions, message, positiveText, null);
    }

}