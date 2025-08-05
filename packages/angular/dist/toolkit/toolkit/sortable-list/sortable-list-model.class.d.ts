/**
 *
 * @ai-apps/angular v2.155.1 | sortable-list-model.class.d.ts
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


import { TemplateRef } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BaseSetting, SettingOptions } from '../table-settings/settings/setting.class';
import { SortableListComponent } from './sortable-list.component';
export interface ListOptionOptions {
    content?: any;
    template?: TemplateRef<any>;
    order?: number;
    options?: SortableListOption[];
    disabled?: boolean;
}
export declare class SortableListOption {
    disabled: boolean;
    order: number;
    options: SortableListOption[];
    content: any;
    template: TemplateRef<any>;
    protected contentSubject: BehaviorSubject<any>;
    protected contentSubscription: Subscription;
    constructor(options: ListOptionOptions);
    getContent(): any;
    setContent(content: any): void;
    toJSON(): any;
    toString(): string;
}
export interface SortableListOptions extends SettingOptions {
    content?: any;
    template?: TemplateRef<any>;
    options: SortableListOption[];
}
export declare class SortableList extends BaseSetting {
    component: typeof SortableListComponent;
    protected options: SortableListOption[];
    protected stagedOptions: SortableListOption[];
    protected _outputs: Map<string, any>;
    protected _inputs: Map<string, SortableListOption[]>;
    constructor(options: SortableListOptions);
    getInputs(): Map<string, SortableListOption[]>;
    getOutputs(): Map<string, any>;
    onChanges(value: SortableListOption[]): void;
    commit(): void;
}
