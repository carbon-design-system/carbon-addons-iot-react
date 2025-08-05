/**
 *
 * @ai-apps/angular v2.155.1 | ai-list-item.class.d.ts
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
export declare class AIListItem {
    /**
     * Variable used for creating unique ids for ListItems.
     */
    static listItemCount: number;
    /**
     * Unique identifier for the list item.
     */
    id: string;
    /**
     * Primary content to be displayed in the list item.
     */
    value: string;
    /**
     * Indicates whether or not a list item's displayed value should be bolded.
     */
    isCategory: boolean;
    /**
     * Secondary value to be displayed in the list item.
     */
    secondaryValue?: string;
    /**
     * This contains an optional row action that can be rendered in the list item.
     */
    rowActions?: TemplateRef<any>;
    rowActionsContext?: any;
    /**
     * If the list item has child list items, this indicates whether or not it's
     * direct children are displayed.
     */
    expanded: boolean;
    /**
     * Indicates whether or not the list item can be selected.
     */
    isSelectable: boolean;
    /**
     * Indicates whether or not the item is selected.
     */
    selected: boolean;
    disabled: boolean;
    /**
     * Indicates whether or not the list item is in an indeterminate state.
     */
    indeterminate: boolean;
    /**
     * Optional nested items.
     */
    items: AIListItem[];
    size: 'md' | 'lg';
    /**
     * Indicates whether or not the item can be dragged into a different position.
     */
    isDraggable: boolean;
    constructor(rawData?: any);
    /**
     * This method returns `true` if `searchString` is a substring of `value`
     * or `secondaryValue` of this list item or any of its children.
     * This method may be overridden to achieve a custom search.
     *
     * For example, if I want `ai-list` to only filter based on secondary
     * values and have case matter, I can create a custom `AIListItem`:
     *
     * class CustomAIListItem extends AIListItem {
     *   constructor(rawData: any) {
     *     super(rawData);
     *   }
     *
     *   includes(searchString: string) {
     *     return this.secondaryValue.includes(searchString) || this.items.some((listItem) => listItem.includes(searchString));
     *   }
     * }
     *
     * Then instead of passing in an array of `AIListItem`s into `ai-list`,
     * you can pass in an array of `CustomAIListItem`s and if you have the
     * search bar turned on, it will filter out items based on your custom
     * `includes` method.
     */
    includes(searchString: string): any;
    expand(expanded?: boolean): void;
    select(selected?: boolean): void;
    setIndeterminate(indeterminate?: boolean): void;
    disable(disabled?: boolean): void;
    addItem(listItem: AIListItem, index?: number): void;
    removeItem(index?: number): void;
    hasItem(item: AIListItem): any;
    hasChildren(): boolean;
    someChildrenSelected(): boolean;
    allChildrenSelected(): boolean;
}
