/**
 *
 * @ai-apps/angular v2.155.1 | date-time-relative.component.d.ts
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
import { DateRange, RelativeRange, RelativeToOption } from './date-time-picker.component';
export declare type RelativeDateValue = [...DateRange, RelativeRange];
export declare const getEndDate: (relativeTo: [string, string], relativeToOptions: RelativeToOption[]) => Date;
export declare const getRangeFromRelative: (relativeConfig: RelativeRange, relativeToOptions: RelativeToOption[]) => DateRange;
export declare class DateTimeRelativeComponent implements OnChanges {
    value: any[];
    batchText: any;
    relativeToOptions: RelativeToOption[];
    valueChange: EventEmitter<RelativeDateValue>;
    timeToSubtract: number;
    timeRange: string;
    relativeTo: string;
    relativeTime: string;
    ngOnChanges(changes: SimpleChanges): void;
    onChange(): void;
}
