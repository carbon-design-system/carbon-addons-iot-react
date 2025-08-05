/**
 *
 * @ai-apps/angular v2.155.1 | date-time-picker.component.d.ts
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


import { ElementRef, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { I18n } from 'carbon-components-angular/i18n';
export interface DateTimeRange {
    key: any;
    description: string;
    getRange: () => [Date, Date];
}
export interface RelativeRange {
    last: [number, string];
    relativeTo: [string, string];
}
export interface BatchLabelText {
    ABSOLUTE: string;
    RELATIVE: string;
    CUSTOM_RANGE: string;
    RELATIVE_TO: string;
    START_DATE: string;
    END_DATE: string;
    START_TIME: string;
    END_TIME: string;
    LAST: string;
    CANCEL: string;
    APPLY: string;
    BACK: string;
    NOW: string;
    YESTERDAY: string;
    YEARS: string;
    MONTHS: string;
    WEEKS: string;
    DAYS: string;
    HOURS: string;
    MINUTES: string;
    RANGE_SEPARATOR: string;
}
export declare type RelativeDateTimeSelection = ['RELATIVE', ...DateRange, RelativeRange];
export declare type AbsoluteDateTimeSelection = ['ABSOLUTE', ...DateRange];
export declare type CustomDateTimeSelection = AbsoluteDateTimeSelection | RelativeDateTimeSelection;
export declare type PresetDateTimeSelection = [string];
export declare type DateTimeSelection = PresetDateTimeSelection | CustomDateTimeSelection;
export declare type DateRange = [Date, Date];
/**
 * @member key key for the RelativeTo item
 * @member label label text in Relative to dropdown list
 * @member value integer relative to today. e.g. -1 for yesterday, 0 for today, 1 for tomorrow
 */
export declare type RelativeToOption = {
    key: string;
    label: string;
    value: number;
};
export declare class DateTimePickerComponent implements OnChanges, OnInit {
    protected elementRef: ElementRef;
    protected i18n: I18n;
    wrapper: boolean;
    dateTimeRanges: DateTimeRange[];
    /**
     * Language of the flatpickr calendar.
     *
     * For reference of the possible locales:
     * https://github.com/flatpickr/flatpickr/blob/master/src/l10n/index.ts
     */
    language: string;
    selected: DateTimeSelection;
    hasRelative: boolean;
    hasAbsolute: boolean;
    theme: 'light' | null;
    placeholder: string;
    dateFormat: string;
    flatpickrOptions: any;
    batchText: BatchLabelText;
    relativeToOptions: RelativeToOption[];
    selectedChange: EventEmitter<DateTimeSelection>;
    apply: EventEmitter<DateRange>;
    cancel: EventEmitter<void>;
    previousSelection: DateTimeSelection;
    selectingCustomRange: boolean;
    expanded: boolean;
    disabled: boolean;
    timeFormat: string;
    datePickerFormat: string;
    get tooltipOffset(): {
        x: number;
        y: number;
    };
    constructor(elementRef: ElementRef, i18n: I18n);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    updateAbsoluteDateFormat(): void;
    updateI18nTranslationString(): void;
    formatCurrentRangeTitle(): string;
    formatCurrentRange(): string;
    formatCustomRange(): string;
    selectPresetRange(range: DateTimeRange): void;
    rangeChange(change: DateTimeSelection): void;
    onBack(): void;
    onApply(): void;
    onCancel(): void;
    navigateList(event: KeyboardEvent): void;
    togglePicker(): void;
}
