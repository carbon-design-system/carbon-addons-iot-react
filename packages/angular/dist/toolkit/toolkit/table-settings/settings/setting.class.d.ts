/**
 *
 * @ai-apps/angular v2.155.1 | setting.class.d.ts
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
import { Content } from '../table-settings-model.class';
export interface SettingOption {
    content?: Content;
    template?: TemplateRef<any>;
    toJSON?(): any;
}
export interface SettingOptions {
    content?: Content;
    template?: TemplateRef<any>;
    options: SettingOption[];
}
export interface SettingChanges {
    [property: string]: any;
}
export declare class BaseSetting {
    readonly component: any;
    protected options: SettingOption[];
    protected staged: {};
    protected content: BehaviorSubject<any>;
    protected contentObservable: import("rxjs").Observable<any>;
    protected contentSubscription: Subscription;
    protected template?: TemplateRef<any>;
    protected _inputs: Map<any, any>;
    protected _outputs: Map<any, any>;
    constructor(options?: SettingOptions);
    getContent(): import("rxjs").Observable<any>;
    setContent(content: Content): void;
    getTemplate(): TemplateRef<any>;
    setTemplate(template: TemplateRef<any>): void;
    /**
     * gets a map of input names to values
     *
     * By default returns a map of 'options' to `this.options`
     */
    getInputs(): Map<any, any>;
    getOutputs(): Map<any, any>;
    toJSON(): object;
    toString(): string;
    onChanges(changes: SettingChanges): void;
    commit(): void;
}
