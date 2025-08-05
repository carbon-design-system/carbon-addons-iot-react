/**
 *
 * @ai-apps/angular v2.155.1 | checkbox-setting.component.d.ts
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


import { EventEmitter } from '@angular/core';
import { CheckboxChange } from 'carbon-components-angular/checkbox/checkbox.component';
import { Observable } from 'rxjs';
import { CheckboxOption } from './checkbox-setting.class';
import { SettingChanges } from './setting.class';
export declare class CheckboxSettingComponent {
    options: CheckboxOption[];
    optionsChange: EventEmitter<SettingChanges>;
    getContent(option: CheckboxOption): Observable<string>;
    onChange(event: CheckboxChange, eventOption: CheckboxOption): void;
}
