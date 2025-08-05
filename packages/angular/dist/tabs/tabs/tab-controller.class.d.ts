/**
 *
 * @ai-apps/angular v2.155.1 | tab-controller.class.d.ts
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


import { BehaviorSubject, Observable } from 'rxjs';
import { Tab } from './tab.interface';
export declare class TabController {
    selection: BehaviorSubject<any>;
    tabListWithSelection: Observable<Tab[]>;
    tabList: Observable<Tab[]>;
    private tabSource;
    constructor(tabList?: any[]);
    setTabs(tabList: Tab[]): void;
    getTabs(): Tab[];
    addTab(tab: Tab): void;
    selectTab(key: any): void;
    updateTab(updatedTab: Tab): void;
    removeTab(key: any): any;
}
