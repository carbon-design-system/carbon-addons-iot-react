/**
 *
 * @ai-apps/angular v2.155.1 | custom-date-time.component.d.ts
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
import { DateRange, DateTimeSelection, RelativeRange, RelativeToOption } from './date-time-picker.component';
export declare class CustomDateTimeComponent implements OnChanges {
    mode: 'relative' | 'absolute';
    value: any[];
    range: DateTimeSelection;
    hasRelative: boolean;
    hasAbsolute: boolean;
    batchText: any;
    /**
     * Format of date
     *
     * For reference: https://flatpickr.js.org/formatting/
     */
    dateFormat: string;
    datePickerFormat: string;
    placeholder: string;
    relativeToOptions: RelativeToOption[];
    flatpickrOptions: any;
    rangeChange: EventEmitter<DateTimeSelection>;
    wrapperClass: boolean;
    ngOnChanges(changes: SimpleChanges): void;
    relativeChange(change: [Date, Date, RelativeRange]): void;
    absoluteChange(change: DateRange): void;
}
