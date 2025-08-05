/**
 *
 * @ai-apps/angular v2.155.1 | ai-list.component.d.ts
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
import { AIListItem } from './list-item/ai-list-item.class';
import { IconService } from 'carbon-components-angular';
export declare enum SelectionType {
    SINGLE = "single",
    MULTI = "multi"
}
export declare class AIListComponent implements OnInit {
    protected iconService: IconService;
    items: AIListItem[];
    selectionType: SelectionType;
    /**
     * Indicates whether or not items in the list can be dragged into new positions.
     */
    itemsDraggable: boolean;
    set isDragging(isDragging: boolean);
    get isDragging(): boolean;
    set draggedItem(draggedItem: AIListItem);
    get draggedItem(): AIListItem;
    /**
     * Indicates whether a search bar should be rendered in the list header.
     */
    hasSearch: boolean;
    /**
     * Title to be displayed on the list header.
     */
    title: string;
    isFullHeight: boolean;
    /**
     * Text that is displayed when list is empty. To change the default
     * icon with the text, this can also be set to a `TemplateRef`.
     *
     * The reason we are using type `any` instead of `string | TemplateRef<any>`,
     * which is the only two types that should be accepted, is because
     * passing `emptyState` into `ngTemplateOutlet` would cause the error:
     * `Type 'string | TemplateRef<any>' is not assignable to type 'TemplateRef<any>'`
     * to come up while building.
     */
    emptyState: any;
    /**
     * If a `hasSearch` is true, this is emitted when search value is changed.
     */
    onSearch: EventEmitter<string>;
    isDraggingChange: EventEmitter<boolean>;
    draggedItemChange: EventEmitter<AIListItem>;
    searchString: string;
    protected _isDragging: boolean;
    protected _draggedItem: AIListItem;
    constructor(iconService: IconService);
    ngOnInit(): void;
    handleDragStart(item: AIListItem): void;
    handleDragEnd(dragEvent: DragEvent, item: AIListItem, parent: AIListItem): void;
    handleDragOver(dragEvent: DragEvent, receiver: AIListItem): void;
    handleDrop(receiver: AIListItem, index: number): void;
    handleSelect(selectedItem: AIListItem): void;
    handleSearch(searchString: string): void;
    /**
     * This function returns the adjusted `nestingLevel`s of an AIListItem.
     */
    getAdjustedNestingLevel(items: AIListItem[], currentDepth: number): number;
    isArray(obj: any): boolean;
    isTemplate(value: any): boolean;
    protected updateChildSelectedStates(selectedItem: AIListItem): void;
    protected updateParentSelectedStates(items: AIListItem[]): void;
    protected onSingleSelect(items: AIListItem[], selectedId: string): void;
}
