/**
 *
 * @ai-apps/angular v2.155.1 | card-date-range.component.d.ts
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


import { EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ListItem } from 'carbon-components-angular';
export declare class CardDateRangeComponent implements ControlValueAccessor, OnChanges {
    wrapperClass: boolean;
    /**
     * List of date/time ranges to display in the overflow menu.
     *
     * Uses a modified `ListItem` array. `id` keys **must** be provided.
     *
     * If a null is passed to the ngModel or `value` Input the item with
     * the `id` of `"default"` will be selected.
     */
    ranges: ListItem[];
    /**
     * Set to the id of a range item to select it
     */
    value: string;
    /**
     * Emits the id of the currently selected range item
     */
    valueChange: EventEmitter<string>;
    /**
     * Contains the content of the currently selected range item
     */
    selectedRangeContent: string;
    ngOnChanges(changes: SimpleChanges): void;
    onRangeSelected(range: string): void;
    writeValue(rangeId: string): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    protected onChange: (obj: any) => void;
    protected onTouched: () => void;
    /**
     * Updates the `ranges` list to only select the provided id.
     *
     * Also updates `selectedRangeContent`
     *
     * falsy/null values will select the `default` option
     *
     * @param rangeId id of the range item to select
     */
    protected selectRange(rangeId: string): void;
    protected getSelectedRange(): ListItem;
}
