/**
 *
 * @ai-apps/angular v2.155.1 | checkbox-setting.class.d.ts
 *
 * Copyright 2014, 2025 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { CheckboxSettingComponent } from './checkbox-setting.component';
import { BaseSetting, SettingOption, SettingOptions } from './setting.class';
export interface CheckboxOption extends SettingOption {
    checked: boolean;
}
export interface CheckboxSettingOptions extends SettingOptions {
    options: CheckboxOption[];
}
export declare class CheckboxSetting extends BaseSetting {
    component: typeof CheckboxSettingComponent;
    protected options: CheckboxOption[];
    constructor(options?: CheckboxSettingOptions);
}
