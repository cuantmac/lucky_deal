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

package com.m7.imkfsdk.utils.permission.callback;



import com.m7.imkfsdk.utils.permission.request.ForwardScope;
import com.m7.imkfsdk.utils.permission.request.PermissionBuilder;

import java.util.List;

/**
 * Callback for {@link PermissionBuilder#onForwardToSettings(ForwardToSettingsCallback)} method.
 *
 * @Author: chenbo
 * @Date: 2020/6/17
 */
public interface ForwardToSettingsCallback {

    /**
     * Called when you should tell user to allow these permissions in settings.
     *
     * @param scope      Scope to show rationale dialog.
     * @param deniedList Permissions that should allow in settings.
     */
    void onForwardToSettings(ForwardScope scope, List<String> deniedList);

}