/**
 *
 * @ai-apps/angular v2.155.1 | radio-setting.class.d.ts
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


import { RadioSettingComponent } from './radio-setting.component';
import { BaseSetting, SettingOption, SettingOptions } from './setting.class';
export interface RadioOption extends SettingOption {
    value: any;
}
export interface RadioSettingOptions extends SettingOptions {
    options: RadioOption[];
    active: any;
}
export declare class RadioSetting extends BaseSetting {
    component: typeof RadioSettingComponent;
    protected options: RadioOption[];
    protected active: any;
    constructor(options: RadioSettingOptions);
    toJSON(): object;
}
