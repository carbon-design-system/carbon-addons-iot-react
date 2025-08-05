/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-item.component.d.ts
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
import { SelectionType } from '../ai-list.component';
import { AIListItem } from './ai-list-item.class';
import { IconService } from 'carbon-components-angular';
export declare class AIListItemComponent implements OnInit {
    protected iconService: IconService;
    item: AIListItem;
    /**
     * Nesting level of the list item. Determines the amount of space the item will be indented
     * when rendered in the list.
     */
    nestingLevel: number;
    /**
     * Indicates whether or not the item can be dragged into a different position.
     */
    draggable: boolean;
    /**
     * Indicates whether or not the list item can be selected.
     */
    isSelectable: boolean;
    /**
     * Indicates the editing style of the list item. If it is `multi` the list item will be
     * rendered with a checkbox. If it is not given then the list item will not be editable,
     * that is, you can't select it.
     */
    selectionType: SelectionType;
    /**
     * Emitted if the item has been selected.
     */
    itemSelected: EventEmitter<any>;
    constructor(iconService: IconService);
    ngOnInit(): void;
    handleSelect(select: boolean): void;
}
