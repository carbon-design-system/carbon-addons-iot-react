/**
 *
 * @ai-apps/angular v2.155.1 | sortable-list.component.d.ts
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
import { ListItem } from 'carbon-components-angular';
import { SortableListOption } from './sortable-list-model.class';
export declare type SortableListItem = SortableListOption & ListItem;
export declare type SortableListItems = SortableListItem[];
/**
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-sortable-list component
 */
export declare class SortableListComponent {
    items: SortableListItems;
    itemsChange: EventEmitter<SortableListItems>;
    dragging: any;
    dragOver: any;
    trackByFn(index: number, item: SortableListItem): SortableListItem;
    dragStart(item: SortableListItem): void;
    active(item: SortableListItem | 'bottom'): void;
    leave(): void;
    isActive(item: SortableListItem | 'bottom'): boolean;
    end(): void;
    handleDrop(): void;
    handleMove(direction: 'up' | 'down', item: SortableListItem): void;
    protected insertBefore(itemToMove: SortableListItem, baseItem: SortableListItem | 'bottom'): SortableListItem[];
}
