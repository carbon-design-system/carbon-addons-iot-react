/**
 *
 * @ai-apps/angular v2.155.1 | date-time-absolute.component.d.ts
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


import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
export declare class DateTimeAbsoluteComponent implements OnInit, OnChanges {
    startTime: string;
    endTime: string;
    dateRange: any;
    value: any[];
    batchText: any;
    dateFormat: string;
    datePickerFormat: string;
    placeholder: string;
    flatpickrOptions: any;
    valueChange: EventEmitter<[Date, Date]>;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    onChange(): void;
}
