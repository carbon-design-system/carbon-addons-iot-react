/**
 *
 * @ai-apps/angular v2.155.1 | component-setting.class.d.ts
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


import { BaseSetting } from './setting.class';
export interface InputMap {
    [inputName: string]: any;
}
export interface OutputMap {
    [outputName: string]: (event: any) => void;
}
export interface ComponentSettingOptions {
    component: any;
    inputs?: InputMap;
    outputs?: OutputMap;
}
export declare class ComponentSetting extends BaseSetting {
    component: any;
    constructor(options: ComponentSettingOptions);
    getInputs(): Map<any, any>;
    getOutputs(): Map<any, any>;
}
