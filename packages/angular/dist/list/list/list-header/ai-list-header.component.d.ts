/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-header.component.d.ts
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
export declare class AIListHeaderComponent {
    /**
     * Title to be displayed on the list header.
     */
    title: string;
    /**
     * Indicates whether a search bar should be rendered in the list header.
     */
    hasSearch: boolean;
    /**
     * If a `hasSearch` is true, this is emitted when search value is changed.
     */
    onSearch: EventEmitter<any>;
}
