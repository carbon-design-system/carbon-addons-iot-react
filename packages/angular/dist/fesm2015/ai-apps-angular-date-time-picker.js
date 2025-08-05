/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-date-time-picker.js
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


import { CommonModule } from '@angular/common';
import { EventEmitter, Component, Input, Output, ElementRef, HostBinding, NgModule } from '@angular/core';
import { ButtonModule, RadioModule, SelectModule, NumberModule, TimePickerModule, TimePickerSelectModule, InputModule, DatePickerModule, I18nModule, IconModule, DialogModule } from 'carbon-components-angular';
import { setMinutes, setHours, subDays, addDays, sub, subMinutes, subHours, format, isThisMinute } from 'date-fns';
import * as languages from 'flatpickr/dist/l10n/index';
import { I18n } from 'carbon-components-angular/i18n';
import { FormsModule } from '@angular/forms';

const getEndDate = (relativeTo, relativeToOptions) => {
    const [relativeToLabel, relativeTime] = relativeTo;
    const [hourStr, minStr] = relativeTime.split(':');
    const hour = parseInt(hourStr, 10);
    const min = parseInt(minStr, 10);
    const numOfDays = relativeToOptions.filter((option) => option.key === relativeToLabel)[0].value;
    // numOfDays < 0 for past, numOfDays == 0 for today, numOfDays > 0 for future
    if (numOfDays < 0) {
        const pastDays = Math.abs(numOfDays);
        return setMinutes(setHours(subDays(new Date(), pastDays), hour), min);
    }
    return setMinutes(setHours(addDays(new Date(), numOfDays), hour), min);
};
const getRangeFromRelative = (relativeConfig, relativeToOptions) => {
    const [valueToSubtract, valueRange] = relativeConfig.last;
    const endDate = getEndDate(relativeConfig.relativeTo, relativeToOptions);
    const timeToSub = {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };
    timeToSub[valueRange.toLowerCase()] = valueToSubtract;
    const startDate = sub(endDate, timeToSub);
    return [startDate, endDate];
};
class DateTimeRelativeComponent {
    constructor() {
        this.value = null;
        this.valueChange = new EventEmitter();
        this.timeToSubtract = 0;
        this.timeRange = 'MINUTES';
        this.relativeTo = 'YESTERDAY';
        this.relativeTime = '00:00';
    }
    ngOnChanges(changes) {
        var _a;
        if ((_a = changes === null || changes === void 0 ? void 0 : changes.value) === null || _a === void 0 ? void 0 : _a.currentValue) {
            const [start, end, relativeConfig] = changes.value.currentValue;
            if (!relativeConfig) {
                return;
            }
            const [value, valueRange] = relativeConfig.last;
            const [relativeTo, time] = relativeConfig.relativeTo;
            this.timeRange = valueRange;
            this.timeToSubtract = value;
            this.relativeTo = relativeTo;
            this.relativeTime = time;
        }
    }
    onChange() {
        setTimeout(() => {
            const relativeConfig = {
                last: [this.timeToSubtract, this.timeRange],
                relativeTo: [this.relativeTo, this.relativeTime],
            };
            const dates = getRangeFromRelative(relativeConfig, this.relativeToOptions);
            const range = [...dates, relativeConfig];
            this.valueChange.emit(range);
        });
    }
}
DateTimeRelativeComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-date-time-relative',
                template: `
    <fieldset class="bx--fieldset iot--date-time-picker__menu-formgroup">
      <legend class="bx--label">{{ batchText.LAST }}</legend>
      <div class="iot--date-time-picker__fields-wrapper">
        <ibm-number
          [min]="0"
          [step]="1"
          [(ngModel)]="timeToSubtract"
          (change)="onChange()"
          theme="light"
        ></ibm-number>
        <ibm-select
          class="bx--form-item"
          [(ngModel)]="timeRange"
          (valueChange)="onChange()"
          theme="light"
        >
          <option value="MINUTES">{{ batchText.MINUTES }}</option>
          <option value="HOURS">{{ batchText.HOURS }}</option>
          <option value="DAYS">{{ batchText.DAYS }}</option>
          <option value="WEEKS">{{ batchText.WEEKS }}</option>
          <option value="MONTHS">{{ batchText.MONTHS }}</option>
          <option value="YEARS">{{ batchText.YEARS }}</option>
        </ibm-select>
      </div>
    </fieldset>
    <fieldset class="bx--fieldset iot--date-time-picker__menu-formgroup">
      <legend class="bx--label">{{ batchText.RELATIVE_TO }}</legend>
      <div class="iot--date-time-picker__fields-wrapper">
        <ibm-select
          class="bx--form-item iot--date-time-relative-to__select"
          [(ngModel)]="relativeTo"
          (valueChange)="onChange()"
          theme="light"
        >
          <option
            *ngFor="let option of relativeToOptions; let i = index"
            [value]="option.key"
            [selected]="i === 0"
          >
            {{ option.label }}
          </option>
        </ibm-select>
        <!-- tmp until we can implement a better time selector -->
        <div class="bx--form-item">
          <input
            ibmText
            type="time"
            [(ngModel)]="relativeTime"
            (change)="onChange()"
            theme="light"
          />
        </div>
      </div>
    </fieldset>
  `,
                styles: [`
      /* tmp hack until carbon-components-angular has the updated number input */
      ::ng-deep .bx--number__input-wrapper input {
        min-width: 0px !important;
        padding-right: 0px !important;
      }
    `]
            },] }
];
DateTimeRelativeComponent.propDecorators = {
    value: [{ type: Input }],
    batchText: [{ type: Input }],
    relativeToOptions: [{ type: Input }],
    valueChange: [{ type: Output }]
};

class DateTimePickerComponent {
    constructor(elementRef, i18n) {
        this.elementRef = elementRef;
        this.i18n = i18n;
        this.wrapper = true;
        this.dateTimeRanges = [
            {
                key: 'LAST_30_MINUTES',
                description: 'Last 30 minutes',
                getRange: () => {
                    const now = new Date();
                    const previous = subMinutes(now, 30);
                    return [previous, now];
                },
            },
            {
                key: 'LAST_1_HOUR',
                description: 'Last 1 hour',
                getRange: () => {
                    const now = new Date();
                    const previous = subHours(now, 1);
                    return [previous, now];
                },
            },
            {
                key: 'LAST_6_HOURS',
                description: 'Last 6 hours',
                getRange: () => {
                    const now = new Date();
                    const previous = subHours(now, 6);
                    return [previous, now];
                },
            },
            {
                key: 'LAST_12_HOURS',
                description: 'Last 12 hours',
                getRange: () => {
                    const now = new Date();
                    const previous = subHours(now, 12);
                    return [previous, now];
                },
            },
            {
                key: 'LAST_24_HOURS',
                description: 'Last 24 hours',
                getRange: () => {
                    const now = new Date();
                    const previous = subHours(now, 24);
                    return [previous, now];
                },
            },
        ];
        /**
         * Language of the flatpickr calendar.
         *
         * For reference of the possible locales:
         * https://github.com/flatpickr/flatpickr/blob/master/src/l10n/index.ts
         */
        this.language = 'en';
        this.selected = null;
        this.hasRelative = true;
        this.hasAbsolute = true;
        this.theme = null;
        this.placeholder = 'yyyy-mm-dd HH:mm';
        this.dateFormat = 'yyyy-MM-dd';
        this.batchText = {
            ABSOLUTE: 'Absolute',
            RELATIVE: 'Relative',
            CUSTOM_RANGE: 'Custom Range',
            RELATIVE_TO: 'Relative to',
            START_DATE: 'Start date',
            END_DATE: 'End date',
            START_TIME: 'Start time',
            END_TIME: 'End time',
            LAST: 'Last',
            CANCEL: 'Cancel',
            APPLY: 'Apply',
            BACK: 'back',
            NOW: 'Now',
            YESTERDAY: 'Yesterday',
            YEARS: 'years',
            MONTHS: 'months',
            WEEKS: 'weeks',
            DAYS: 'days',
            HOURS: 'hours',
            MINUTES: 'minutes',
            RANGE_SEPARATOR: 'to',
        };
        this.relativeToOptions = [
            {
                key: 'YESTERDAY',
                label: 'Yesterday',
                value: -1,
            },
            {
                key: 'TODAY',
                label: 'Today',
                value: 0,
            },
        ];
        this.selectedChange = new EventEmitter();
        this.apply = new EventEmitter();
        this.cancel = new EventEmitter();
        // contains the selection from before a custom selection was made (to handle the "back" case)
        this.previousSelection = null;
        this.selectingCustomRange = false;
        this.expanded = false;
        this.disabled = false;
        this.timeFormat = 'HH:mm';
        this.datePickerFormat = 'Y-m-d';
    }
    get tooltipOffset() {
        return { x: 0, y: 4 };
    }
    ngOnChanges(changes) {
        var _a;
        if ((_a = changes === null || changes === void 0 ? void 0 : changes.selected) === null || _a === void 0 ? void 0 : _a.currentValue) {
            const [type] = changes.selected.currentValue;
            if (type === 'RELATIVE' || type === 'ABSOLUTE') {
                this.selectingCustomRange = true;
            }
        }
    }
    ngOnInit() {
        if (!this.selected) {
            this.selected = [null];
            this.disabled = true;
        }
        this.previousSelection = this.selected;
        this.updateI18nTranslationString();
        this.updateAbsoluteDateFormat();
    }
    updateAbsoluteDateFormat() {
        // convert current dateFormat to proper format for absolute date picker
        const formatCharacters = this.dateFormat.split('');
        const newDateFormat = formatCharacters
            .filter((char, i) => i === 0 || formatCharacters[i] !== formatCharacters[i - 1])
            .join('');
        this.datePickerFormat = newDateFormat.replace('y', 'Y').replace('M', 'm');
    }
    updateI18nTranslationString() {
        this.i18n.setLocale(this.language, languages.default[this.language]);
    }
    formatCurrentRangeTitle() {
        const [rangeOrType] = this.selected;
        if (!rangeOrType) {
            return this.placeholder;
        }
        else if (rangeOrType === 'RELATIVE' || rangeOrType === 'ABSOLUTE') {
            return this.formatCustomRange();
        }
        const range = this.dateTimeRanges.find((range) => range.key === rangeOrType);
        return range.description;
    }
    formatCurrentRange() {
        const [rangeOrType] = this.selected;
        if (!rangeOrType) {
            return this.placeholder;
        }
        else if (rangeOrType === 'RELATIVE' || rangeOrType === 'ABSOLUTE') {
            return this.formatCustomRange();
        }
        const range = this.dateTimeRanges.find((range) => range.key === rangeOrType);
        const [start, end] = range.getRange();
        // TODO: provide a way to customize this for g11n
        const formatString = `${this.dateFormat} ${this.timeFormat}`;
        let endFormatted = format(end, formatString);
        if (isThisMinute(end)) {
            endFormatted = this.batchText.NOW;
        }
        return `${format(start, formatString)} ${this.batchText.RANGE_SEPARATOR} ${endFormatted}`;
    }
    formatCustomRange() {
        // TODO: provide a way to customize this for g11n
        const formatString = `${this.dateFormat} ${this.timeFormat}`;
        const [type, start, end, relativeConfig] = this.selected;
        if (type === 'ABSOLUTE') {
            return `${format(start, formatString)} ${this.batchText.RANGE_SEPARATOR} ${format(end, formatString)}`;
        }
        else if (type === 'RELATIVE') {
            const [start, end] = getRangeFromRelative(relativeConfig, this.relativeToOptions);
            return `${format(start, formatString)} ${this.batchText.RANGE_SEPARATOR} ${format(end, formatString)}`;
        }
    }
    selectPresetRange(range) {
        // set the selected value so the view updates
        this.selected = [range.key];
    }
    rangeChange(change) {
        // store the previous selection if we don't have one yet
        if (!this.previousSelection) {
            this.previousSelection = this.selected;
        }
        this.selected = change;
    }
    onBack() {
        this.selectingCustomRange = false;
    }
    onApply() {
        const [rangeOrType, start, end] = this.selected;
        if (this.selectingCustomRange) {
            this.apply.emit([start, end]);
            this.selectedChange.emit(this.selected);
        }
        else {
            // emit the date range
            const range = this.dateTimeRanges.find((range) => range.key === rangeOrType);
            this.selected = [range.key, ...range.getRange()];
            this.selectedChange.emit(this.selected);
            this.apply.emit(range.getRange());
        }
        this.previousSelection = this.selected;
        this.expanded = false;
        this.disabled = false;
    }
    onCancel() {
        this.selected = this.previousSelection;
        this.cancel.emit();
        this.expanded = false;
    }
    navigateList(event) {
        const target = event.target;
        switch (event.key) {
            case 'ArrowUp': {
                const prev = target.previousElementSibling;
                if (prev === null || prev === void 0 ? void 0 : prev.hasAttribute('tabindex')) {
                    target.tabIndex = -1;
                    prev.tabIndex = 0;
                    prev.focus();
                }
                break;
            }
            case 'ArrowDown': {
                const next = target.nextElementSibling;
                if (next === null || next === void 0 ? void 0 : next.hasAttribute('tabindex')) {
                    target.tabIndex = -1;
                    next.tabIndex = 0;
                    next.focus();
                }
                break;
            }
        }
    }
    togglePicker() {
        this.expanded = !this.expanded;
        if (this.expanded) {
            const nativeElement = this.elementRef.nativeElement;
            const selected = nativeElement.querySelector('.iot--date-time-picker__listitem--preset-selected');
            if (selected) {
                setTimeout(() => selected.focus());
            }
        }
    }
}
DateTimePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-date-time-picker',
                template: `
    <div
      class="iot--date-time-picker__box"
      [ngClass]="{
        'iot--date-time-picker__box--light': theme === 'light'
      }"
    >
      <div
        class="iot--date-time-picker__field"
        (click)="togglePicker()"
        (keydown.enter)="togglePicker()"
        (keydown.space)="togglePicker()"
        [ibmTooltip]="formatCurrentRange()"
        [offset]="tooltipOffset"
        [disabled]="disabled"
        trigger="hover"
        placement="bottom"
        role="button"
        tabindex="0"
      >
        <span [title]="formatCurrentRangeTitle()">{{ formatCurrentRangeTitle() }}</span>
        <svg ibmIcon="calendar" size="16" class="iot--date-time-picker__icon"></svg>
      </div>
      <div
        class="iot--date-time-picker__menu"
        [ngClass]="{
          'iot--date-time-picker__menu-expanded': expanded
        }"
        role="listbox"
      >
        <div class="iot--date-time-picker__menu-scroll">
          <!-- root view -->
          <ol
            *ngIf="!selectingCustomRange"
            (keyup)="navigateList($event)"
            class="bx--list--ordered"
          >
            <li
              class="bx--list__item iot--date-time-picker__listitem iot--date-time-picker__listitem--current"
            >
              {{ formatCurrentRange() }}
            </li>
            <li
              *ngIf="hasRelative || hasAbsolute"
              (click)="selectingCustomRange = true"
              class="bx--list__item iot--date-time-picker__listitem iot--date-time-picker__listitem--custom"
              tabindex="-1"
            >
              {{ batchText.CUSTOM_RANGE }}
            </li>
            <li
              *ngFor="let range of dateTimeRanges"
              class="bx--list__item iot--date-time-picker__listitem iot--date-time-picker__listitem--preset"
              (click)="selectPresetRange(range)"
              (keyup.space)="selectPresetRange(range)"
              (keyup.enter)="selectPresetRange(range)"
              [attr.tabindex]="selected[0] === range.key ? 0 : -1"
              [ngClass]="{
                'iot--date-time-picker__listitem--preset-selected': selected[0] === range.key
              }"
            >
              {{ range.description }}
            </li>
          </ol>
          <!-- custom relative/absolute -->
          <ai-custom-date-time
            *ngIf="selectingCustomRange"
            (rangeChange)="rangeChange($event)"
            [range]="selected"
            [hasRelative]="hasRelative"
            [hasAbsolute]="hasAbsolute"
            [dateFormat]="dateFormat"
            [datePickerFormat]="datePickerFormat"
            [placeholder]="dateFormat.toLowerCase()"
            [flatpickrOptions]="flatpickrOptions"
            [batchText]="batchText"
            [relativeToOptions]="relativeToOptions"
          ></ai-custom-date-time>
        </div>
        <div class="iot--date-time-picker__menu-btn-set">
          <button
            *ngIf="selectingCustomRange"
            (click)="onBack()"
            ibmButton="secondary"
            class="iot--date-time-picker__menu-btn iot--date-time-picker__menu-btn-cancel"
            type="button"
            size="field"
          >
            {{ batchText.BACK }}
          </button>
          <button
            *ngIf="!selectingCustomRange"
            ibmButton="secondary"
            (click)="onCancel()"
            class="iot--date-time-picker__menu-btn iot--date-time-picker__menu-btn-cancel"
            type="button"
            size="field"
          >
            {{ batchText.CANCEL }}
          </button>
          <button
            ibmButton="primary"
            (click)="onApply()"
            class="iot--date-time-picker__menu-btn iot--date-time-picker__menu-btn-apply"
            type="button"
            size="field"
          >
            {{ batchText.APPLY }}
          </button>
        </div>
      </div>
    </div>
  `,
                styles: [`
      :host {
        display: block;
      }

      /* fix for tooltip trigger styles forcing a 1rem font size (???) */
      .iot--date-time-picker__box {
        font-size: inherit;
      }
    `]
            },] }
];
DateTimePickerComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: I18n }
];
DateTimePickerComponent.propDecorators = {
    wrapper: [{ type: HostBinding, args: ['class.iot--date-time-picker__wrapper',] }],
    dateTimeRanges: [{ type: Input }],
    language: [{ type: Input }],
    selected: [{ type: Input }],
    hasRelative: [{ type: Input }],
    hasAbsolute: [{ type: Input }],
    theme: [{ type: Input }],
    placeholder: [{ type: Input }],
    dateFormat: [{ type: Input }],
    flatpickrOptions: [{ type: Input }],
    batchText: [{ type: Input }],
    relativeToOptions: [{ type: Input }],
    selectedChange: [{ type: Output }],
    apply: [{ type: Output }],
    cancel: [{ type: Output }]
};

class CustomDateTimeComponent {
    constructor() {
        this.mode = 'relative';
        this.value = [];
        this.range = null;
        this.hasRelative = true;
        this.hasAbsolute = true;
        /**
         * Format of date
         *
         * For reference: https://flatpickr.js.org/formatting/
         */
        this.dateFormat = 'yyyy-MM-dd';
        this.datePickerFormat = 'Y-m-d';
        this.placeholder = 'yyyy-mm-dd';
        this.rangeChange = new EventEmitter();
        this.wrapperClass = true;
    }
    ngOnChanges(changes) {
        var _a, _b, _c;
        if ((_a = changes === null || changes === void 0 ? void 0 : changes.range) === null || _a === void 0 ? void 0 : _a.currentValue) {
            const [type, start, end, relativeConfig] = changes.range.currentValue;
            if (type === 'RELATIVE') {
                this.mode = 'relative';
                this.value = [start, end, relativeConfig];
            }
            if (type === 'ABSOLUTE') {
                this.mode = 'absolute';
                this.value = [start, end];
            }
        }
        if (((_b = changes === null || changes === void 0 ? void 0 : changes.hasRelative) === null || _b === void 0 ? void 0 : _b.currentValue) === false) {
            this.mode = 'absolute';
        }
        if (((_c = changes === null || changes === void 0 ? void 0 : changes.hasAbsolute) === null || _c === void 0 ? void 0 : _c.currentValue) === false) {
            this.mode = 'relative';
        }
    }
    relativeChange(change) {
        this.rangeChange.emit(['RELATIVE', ...change]);
    }
    absoluteChange(change) {
        this.rangeChange.emit(['ABSOLUTE', ...change]);
    }
}
CustomDateTimeComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-custom-date-time',
                template: `
    <div class="bx--form-item" *ngIf="hasRelative && hasAbsolute">
      <fieldset class="bx--fieldset">
        <legend class="bx--label">{{ batchText.CUSTOM_RANGE }}</legend>
        <ibm-radio-group [(ngModel)]="mode">
          <ibm-radio value="relative">{{ batchText.RELATIVE }}</ibm-radio>
          <ibm-radio value="absolute">{{ batchText.ABSOLUTE }}</ibm-radio>
        </ibm-radio-group>
      </fieldset>
    </div>
    <!-- relative picker -->
    <ai-date-time-relative
      *ngIf="mode === 'relative' && hasRelative"
      (valueChange)="relativeChange($event)"
      [value]="value"
      [batchText]="batchText"
      [relativeToOptions]="relativeToOptions"
    >
    </ai-date-time-relative>
    <ai-date-time-absolute
      *ngIf="mode === 'absolute' && hasAbsolute"
      (valueChange)="absoluteChange($event)"
      [value]="value"
      [batchText]="batchText"
      [dateFormat]="dateFormat"
      [datePickerFormat]="datePickerFormat"
      [placeholder]="placeholder"
      [flatpickrOptions]="flatpickrOptions"
    >
    </ai-date-time-absolute>
  `,
                styles: [`
      :host {
        display: block;
      }
    `]
            },] }
];
CustomDateTimeComponent.propDecorators = {
    range: [{ type: Input }],
    hasRelative: [{ type: Input }],
    hasAbsolute: [{ type: Input }],
    batchText: [{ type: Input }],
    dateFormat: [{ type: Input }],
    datePickerFormat: [{ type: Input }],
    placeholder: [{ type: Input }],
    relativeToOptions: [{ type: Input }],
    flatpickrOptions: [{ type: Input }],
    rangeChange: [{ type: Output }],
    wrapperClass: [{ type: HostBinding, args: ['class.iot--date-time-picker__custom-wrapper',] }]
};

class DateTimeAbsoluteComponent {
    constructor() {
        this.startTime = '00:00';
        this.endTime = '23:59';
        this.dateRange = null;
        this.value = [];
        this.dateFormat = 'yyyy-MM-dd';
        this.datePickerFormat = 'Y-m-d';
        this.placeholder = 'yyyy-mm-dd';
        this.valueChange = new EventEmitter();
    }
    ngOnInit() {
        // if dateRange is not null (e.g. switch from relative range)
        if (this.dateRange) {
            let [startDate, endDate] = this.dateRange;
            startDate = format(startDate, this.dateFormat);
            endDate = format(endDate, this.dateFormat);
            this.dateRange = [startDate, endDate];
        }
    }
    ngOnChanges(changes) {
        var _a;
        if ((_a = changes === null || changes === void 0 ? void 0 : changes.value) === null || _a === void 0 ? void 0 : _a.currentValue) {
            const [start, end] = changes.value.currentValue;
            if (!start || !end) {
                return;
            }
            this.dateRange = [start, end];
            const formatString = 'HH:mm';
            this.startTime = format(start, formatString);
            this.endTime = format(end, formatString);
        }
    }
    onChange() {
        if (!this.dateRange) {
            return;
        }
        const [startHourStr, startMinStr] = this.startTime.split(':');
        const [endHourStr, endMinStr] = this.endTime.split(':');
        const startHour = parseInt(startHourStr, 10);
        const startMin = parseInt(startMinStr, 10);
        const endHour = parseInt(endHourStr, 10);
        const endMin = parseInt(endMinStr, 10);
        const [startDate, endDate] = this.dateRange;
        const startDateTime = setMinutes(setHours(startDate, startHour), startMin);
        const endDateTime = setMinutes(setHours(endDate, endHour), endMin);
        this.valueChange.emit([startDateTime, endDateTime]);
    }
}
DateTimeAbsoluteComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-date-time-absolute',
                template: `
    <fieldset class="bx--fieldset iot--date-time-picker__menu-formgroup" style="padding: 0 0.9rem;">
      <div class="bx--form-item">
        <ibm-date-picker
          [range]="true"
          [label]="batchText.START_DATE"
          [rangeLabel]="batchText.END_DATE"
          [dateFormat]="datePickerFormat"
          [(ngModel)]="dateRange"
          [placeholder]="placeholder"
          [flatpickrOptions]="flatpickrOptions"
          (valueChange)="onChange()"
          theme="light"
        >
        </ibm-date-picker>
      </div>
    </fieldset>
    <fieldset class="bx--fieldset iot--date-time-picker__menu-formgroup">
      <div class="iot--date-time-picker__fields-wrapper">
        <!-- tmp until we can implement a better time selector -->
        <div class="bx--form-item" style="margin-right: 1rem">
          <label class="bx--label">{{ batchText.START_TIME }}</label>
          <input ibmText type="time" [(ngModel)]="startTime" (change)="onChange()" theme="light" />
        </div>
        <!-- tmp until we can implement a better time selector -->
        <div class="bx--form-item">
          <label class="bx--label">{{ batchText.END_TIME }}</label>
          <input ibmText type="time" [(ngModel)]="endTime" (change)="onChange()" theme="light" />
        </div>
      </div>
    </fieldset>
  `,
                styles: [`
      /*
        all of this is a bunch of gross styling hacks until we can settle on a reasonable
        UX decision for the range picker. By default react forces the picker open, which
        totally breaks the interaction for re-selecting dates. We also need to fix the HTML
        structure upstream as we can't apply the right spacing (easily) due to the duplication
        of classes at multiple levels of the underlying datepicker.
      */
      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker-container {
        opacity: 1;
      }

      ::ng-deep
        .iot--date-time-picker__wrapper
        .bx--date-picker--range
        > .bx--date-picker-container:first-child {
        margin-right: 0;
      }

      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker--range {
        position: initial;
      }

      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker-input__wrapper {
        max-width: 137px;
      }

      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker__input {
        width: 100%;
      }

      /* we do this since there's only one level of ibm-date-picker-input. the other wrapper classes are duplicated */
      ::ng-deep
        .iot--date-time-picker__wrapper
        .bx--date-picker--range
        .bx--date-picker-container:first-child
        ibm-date-picker-input {
        margin-right: 16px;
        width: 137px;
      }
    `]
            },] }
];
DateTimeAbsoluteComponent.propDecorators = {
    value: [{ type: Input }],
    batchText: [{ type: Input }],
    dateFormat: [{ type: Input }],
    datePickerFormat: [{ type: Input }],
    placeholder: [{ type: Input }],
    flatpickrOptions: [{ type: Input }],
    valueChange: [{ type: Output }]
};

class DateTimePickerModule {
}
DateTimePickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    DateTimePickerComponent,
                    CustomDateTimeComponent,
                    DateTimeAbsoluteComponent,
                    DateTimeRelativeComponent,
                ],
                exports: [
                    DateTimePickerComponent,
                    CustomDateTimeComponent,
                    DateTimeAbsoluteComponent,
                    DateTimeRelativeComponent,
                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    ButtonModule,
                    RadioModule,
                    SelectModule,
                    NumberModule,
                    TimePickerModule,
                    TimePickerSelectModule,
                    InputModule,
                    DatePickerModule,
                    I18nModule,
                    IconModule,
                    DialogModule,
                ],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { CustomDateTimeComponent, DateTimeAbsoluteComponent, DateTimePickerComponent, DateTimePickerModule, DateTimeRelativeComponent };
//# sourceMappingURL=ai-apps-angular-date-time-picker.js.map
