/**
 *
 * @ai-apps/angular v2.155.1 | table-settings-model.class.d.ts
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
import { Observable } from 'rxjs';
import { TableSettingsPane, TableSettingsPaneOptions } from './table-settings-pane.class';
export declare type Content = string | Observable<string>;
export interface TableSettingsOptions {
    panes?: TableSettingsPane[];
    content?: any;
    title?: any;
    template?: TemplateRef<any>;
}
export declare class TableSettings {
    content: any;
    title: any;
    template: TemplateRef<any>;
    protected panes: TableSettingsPane[];
    constructor(options: TableSettingsOptions);
    addPane(paneOrOptions: TableSettingsPane | TableSettingsPaneOptions): void;
    setPanes(panes: TableSettingsPane[]): void;
    getPanes(): TableSettingsPane[];
    getContent(): Observable<unknown>;
    toJSON(): {
        content: any;
        title: any;
        panes: any[];
    };
    toString(): string;
    commit(): void;
}
