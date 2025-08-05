/**
 *
 * @ai-apps/angular v2.155.1 | table-settings-modal.component.d.ts
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


import { EventEmitter, OnInit } from '@angular/core';
import { BaseModal } from 'carbon-components-angular';
import { Subject } from 'rxjs';
import { SortableListComponent } from '../sortable-list/index';
import { TableSettings } from './table-settings-model.class';
export declare class TableSettingsModalComponent extends BaseModal implements OnInit {
    model: TableSettings;
    protected modelChange: Subject<TableSettings>;
    listComponent: typeof SortableListComponent;
    settingsModel: TableSettings;
    settingsModelChange: EventEmitter<TableSettings>;
    constructor(model: TableSettings, modelChange: Subject<TableSettings>);
    ngOnInit(): void;
    cancel(): void;
    acceptChanges(): void;
}
