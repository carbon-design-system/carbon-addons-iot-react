/**
 *
 * @ai-apps/angular v2.155.1 | date-time-picker.component.js
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


import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, } from '@angular/core';
import { format, isThisMinute, subHours, subMinutes } from 'date-fns';
import { getRangeFromRelative } from './date-time-relative.component';
import * as languages from 'flatpickr/dist/l10n/index';
import { I18n } from 'carbon-components-angular/i18n';
export class DateTimePickerComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZS10aW1lLXBpY2tlci9kYXRlLXRpbWUtcGlja2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osV0FBVyxFQUNYLEtBQUssRUFHTCxNQUFNLEdBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN0RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN0RSxPQUFPLEtBQUssU0FBUyxNQUFNLDJCQUEyQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQXlMdEQsTUFBTSxPQUFPLHVCQUF1QjtJQW9IbEMsWUFBc0IsVUFBc0IsRUFBWSxJQUFVO1FBQTVDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFBWSxTQUFJLEdBQUosSUFBSSxDQUFNO1FBbkhiLFlBQU8sR0FBRyxJQUFJLENBQUM7UUFFM0QsbUJBQWMsR0FBb0I7WUFDekM7Z0JBQ0UsR0FBRyxFQUFFLGlCQUFpQjtnQkFDdEIsV0FBVyxFQUFFLGlCQUFpQjtnQkFDOUIsUUFBUSxFQUFFLEdBQUcsRUFBRTtvQkFDYixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO29CQUN2QixNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNyQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QixDQUFDO2FBQ0Y7WUFDRDtnQkFDRSxHQUFHLEVBQUUsYUFBYTtnQkFDbEIsV0FBVyxFQUFFLGFBQWE7Z0JBQzFCLFFBQVEs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O1lBcE1DLFVBQVU7WUFZSCxJQUFJOzs7c0JBMExWLFdBQVcsU0FBQyxzQ0FBc0M7NkJBRWxELEtBQUs7dUJBcURMLEtBQUs7dUJBQ0wsS0FBSzswQkFDTCxLQUFLOzBCQUNMLEtBQUs7b0JBQ0wsS0FBSzswQkFDTCxLQUFLO3lCQUNMLEtBQUs7K0JBQ0wsS0FBSzt3QkFDTCxLQUFLO2dDQXVCTCxLQUFLOzZCQWFMLE1BQU07b0JBQ04sTUFBTTtxQkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmb3JtYXQsIGlzVGhpc01pbnV0ZSwgc3ViSG91cnMsIHN1Yk1pbnV0ZXMgfSBmcm9tICdkYXRlLWZucyc7XG5pbXBvcnQgeyBnZXRSYW5nZUZyb21SZWxhdGl2ZSB9IGZyb20gJy4vZGF0ZS10aW1lLXJlbGF0aXZlLmNvbXBvbmVudCc7XG5pbXBvcnQgKiBhcyBsYW5ndWFnZXMgZnJvbSAnZmxhdHBpY2tyL2Rpc3QvbDEwbi9pbmRleCc7XG5pbXBvcnQgeyBJMThuIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhci9pMThuJztcblxuZXhwb3J0IGludGVyZmFjZSBEYXRlVGltZVJhbmdlIHtcbiAga2V5OiBhbnk7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIGdldFJhbmdlOiAoKSA9PiBbRGF0ZSwgRGF0ZV07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVsYXRpdmVSYW5nZSB7XG4gIGxhc3Q6IFtudW1iZXIsIHN0cmluZ107XG4gIHJlbGF0aXZlVG86IFtzdHJpbmcsIHN0cmluZ107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmF0Y2hMYWJlbFRleHQge1xuICBBQlNPTFVURTogc3RyaW5nO1xuICBSRUxBVElWRTogc3RyaW5nO1xuICBDVVNUT01fUkFOR0U6IHN0cmluZztcbiAgUkVMQVRJVkVfVE86IHN0cmluZztcbiAgU1RBUlRfREFURTogc3RyaW5nO1xuICBFTkRfREFURTogc3RyaW5nO1xuICBTVEFSVF9USU1FOiBzdHJpbmc7XG4gIEVORF9USU1FOiBzdHJpbmc7XG4gIExBU1Q6IHN0cmluZztcbiAgQ0FOQ0VMOiBzdHJpbmc7XG4gIEFQUExZOiBzdHJpbmc7XG4gIEJBQ0s6IHN0cmluZztcbiAgTk9XOiBzdHJpbmc7XG4gIFlFU1RFUkRBWTogc3RyaW5nO1xuICBZRUFSUzogc3RyaW5nO1xuICBNT05USFM6IHN0cmluZztcbiAgV0VFS1M6IHN0cmluZztcbiAgREFZUzogc3RyaW5nO1xuICBIT1VSUzogc3RyaW5nO1xuICBNSU5VVEVTOiBzdHJpbmc7XG4gIFJBTkdFX1NFUEFSQVRPUjogc3RyaW5nO1xufVxuXG5leHBvcnQgdHlwZSBSZWxhdGl2ZURhdGVUaW1lU2VsZWN0aW9uID0gWydSRUxBVElWRScsIC4uLkRhdGVSYW5nZSwgUmVsYXRpdmVSYW5nZV07XG5leHBvcnQgdHlwZSBBYnNvbHV0ZURhdGVUaW1lU2VsZWN0aW9uID0gWydBQlNPTFVURScsIC4uLkRhdGVSYW5nZV07XG5leHBvcnQgdHlwZSBDdXN0b21EYXRlVGltZVNlbGVjdGlvbiA9IEFic29sdXRlRGF0ZVRpbWVTZWxlY3Rpb24gfCBSZWxhdGl2ZURhdGVUaW1lU2VsZWN0aW9uO1xuZXhwb3J0IHR5cGUgUHJlc2V0RGF0ZVRpbWVTZWxlY3Rpb24gPSBbc3RyaW5nXTtcblxuZXhwb3J0IHR5cGUgRGF0ZVRpbWVTZWxlY3Rpb24gPSBQcmVzZXREYXRlVGltZVNlbGVjdGlvbiB8IEN1c3RvbURhdGVUaW1lU2VsZWN0aW9uO1xuXG5leHBvcnQgdHlwZSBEYXRlUmFuZ2UgPSBbRGF0ZSwgRGF0ZV07XG5cbi8qKlxuICogQG1lbWJlciBrZXkga2V5IGZvciB0aGUgUmVsYXRpdmVUbyBpdGVtXG4gKiBAbWVtYmVyIGxhYmVsIGxhYmVsIHRleHQgaW4gUmVsYXRpdmUgdG8gZHJvcGRvd24gbGlzdFxuICogQG1lbWJlciB2YWx1ZSBpbnRlZ2VyIHJlbGF0aXZlIHRvIHRvZGF5LiBlLmcuIC0xIGZvciB5ZXN0ZXJkYXksIDAgZm9yIHRvZGF5LCAxIGZvciB0b21vcnJvd1xuICovXG5leHBvcnQgdHlwZSBSZWxhdGl2ZVRvT3B0aW9uID0ge1xuICBrZXk6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgdmFsdWU6IG51bWJlcjtcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWRhdGUtdGltZS1waWNrZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwiaW90LS1kYXRlLXRpbWUtcGlja2VyX19ib3hcIlxuICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAnaW90LS1kYXRlLXRpbWUtcGlja2VyX19ib3gtLWxpZ2h0JzogdGhlbWUgPT09ICdsaWdodCdcbiAgICAgIH1cIlxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJpb3QtLWRhdGUtdGltZS1waWNrZXJfX2ZpZWxkXCJcbiAgICAgICAgKGNsaWNrKT1cInRvZ2dsZVBpY2tlcigpXCJcbiAgICAgICAgKGtleWRvd24uZW50ZXIpPVwidG9nZ2xlUGlja2VyKClcIlxuICAgICAgICAoa2V5ZG93bi5zcGFjZSk9XCJ0b2dnbGVQaWNrZXIoKVwiXG4gICAgICAgIFtpYm1Ub29sdGlwXT1cImZvcm1hdEN1cnJlbnRSYW5nZSgpXCJcbiAgICAgICAgW29mZnNldF09XCJ0b29sdGlwT2Zmc2V0XCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgdHJpZ2dlcj1cImhvdmVyXCJcbiAgICAgICAgcGxhY2VtZW50PVwiYm90dG9tXCJcbiAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgIHRhYmluZGV4PVwiMFwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuIFt0aXRsZV09XCJmb3JtYXRDdXJyZW50UmFuZ2VUaXRsZSgpXCI+e3sgZm9ybWF0Q3VycmVudFJhbmdlVGl0bGUoKSB9fTwvc3Bhbj5cbiAgICAgICAgPHN2ZyBpYm1JY29uPVwiY2FsZW5kYXJcIiBzaXplPVwiMTZcIiBjbGFzcz1cImlvdC0tZGF0ZS10aW1lLXBpY2tlcl9faWNvblwiPjwvc3ZnPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiaW90LS1kYXRlLXRpbWUtcGlja2VyX19tZW51XCJcbiAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICdpb3QtLWRhdGUtdGltZS1waWNrZXJfX21lbnUtZXhwYW5kZWQnOiBleHBhbmRlZFxuICAgICAgICB9XCJcbiAgICAgICAgcm9sZT1cImxpc3Rib3hcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW90LS1kYXRlLXRpbWUtcGlja2VyX19tZW51LXNjcm9sbFwiPlxuICAgICAgICAgIDwhLS0gcm9vdCB2aWV3IC0tPlxuICAgICAgICAgIDxvbFxuICAgICAgICAgICAgKm5nSWY9XCIhc2VsZWN0aW5nQ3VzdG9tUmFuZ2VcIlxuICAgICAgICAgICAgKGtleXVwKT1cIm5hdmlnYXRlTGlzdCgkZXZlbnQpXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYngtLWxpc3QtLW9yZGVyZWRcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICBjbGFzcz1cImJ4LS1saXN0X19pdGVtIGlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fbGlzdGl0ZW0gaW90LS1kYXRlLXRpbWUtcGlja2VyX19saXN0aXRlbS0tY3VycmVudFwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt7IGZvcm1hdEN1cnJlbnRSYW5nZSgpIH19XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPGxpXG4gICAgICAgICAgICAgICpuZ0lmPVwiaGFzUmVsYXRpdmUgfHwgaGFzQWJzb2x1dGVcIlxuICAgICAgICAgICAgICAoY2xpY2spPVwic2VsZWN0aW5nQ3VzdG9tUmFuZ2UgPSB0cnVlXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJieC0tbGlzdF9faXRlbSBpb3QtLWRhdGUtdGltZS1waWNrZXJfX2xpc3RpdGVtIGlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fbGlzdGl0ZW0tLWN1c3RvbVwiXG4gICAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7eyBiYXRjaFRleHQuQ1VTVE9NX1JBTkdFIH19XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgPGxpXG4gICAgICAgICAgICAgICpuZ0Zvcj1cImxldCByYW5nZSBvZiBkYXRlVGltZVJhbmdlc1wiXG4gICAgICAgICAgICAgIGNsYXNzPVwiYngtLWxpc3RfX2l0ZW0gaW90LS1kYXRlLXRpbWUtcGlja2VyX19saXN0aXRlbSBpb3QtLWRhdGUtdGltZS1waWNrZXJfX2xpc3RpdGVtLS1wcmVzZXRcIlxuICAgICAgICAgICAgICAoY2xpY2spPVwic2VsZWN0UHJlc2V0UmFuZ2UocmFuZ2UpXCJcbiAgICAgICAgICAgICAgKGtleXVwLnNwYWNlKT1cInNlbGVjdFByZXNldFJhbmdlKHJhbmdlKVwiXG4gICAgICAgICAgICAgIChrZXl1cC5lbnRlcik9XCJzZWxlY3RQcmVzZXRSYW5nZShyYW5nZSlcIlxuICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJzZWxlY3RlZFswXSA9PT0gcmFuZ2Uua2V5ID8gMCA6IC0xXCJcbiAgICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICdpb3QtLWRhdGUtdGltZS1waWNrZXJfX2xpc3RpdGVtLS1wcmVzZXQtc2VsZWN0ZWQnOiBzZWxlY3RlZFswXSA9PT0gcmFuZ2Uua2V5XG4gICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7eyByYW5nZS5kZXNjcmlwdGlvbiB9fVxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICA8L29sPlxuICAgICAgICAgIDwhLS0gY3VzdG9tIHJlbGF0aXZlL2Fic29sdXRlIC0tPlxuICAgICAgICAgIDxhaS1jdXN0b20tZGF0ZS10aW1lXG4gICAgICAgICAgICAqbmdJZj1cInNlbGVjdGluZ0N1c3RvbVJhbmdlXCJcbiAgICAgICAgICAgIChyYW5nZUNoYW5nZSk9XCJyYW5nZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIFtyYW5nZV09XCJzZWxlY3RlZFwiXG4gICAgICAgICAgICBbaGFzUmVsYXRpdmVdPVwiaGFzUmVsYXRpdmVcIlxuICAgICAgICAgICAgW2hhc0Fic29sdXRlXT1cImhhc0Fic29sdXRlXCJcbiAgICAgICAgICAgIFtkYXRlRm9ybWF0XT1cImRhdGVGb3JtYXRcIlxuICAgICAgICAgICAgW2RhdGVQaWNrZXJGb3JtYXRdPVwiZGF0ZVBpY2tlckZvcm1hdFwiXG4gICAgICAgICAgICBbcGxhY2Vob2xkZXJdPVwiZGF0ZUZvcm1hdC50b0xvd2VyQ2FzZSgpXCJcbiAgICAgICAgICAgIFtmbGF0cGlja3JPcHRpb25zXT1cImZsYXRwaWNrck9wdGlvbnNcIlxuICAgICAgICAgICAgW2JhdGNoVGV4dF09XCJiYXRjaFRleHRcIlxuICAgICAgICAgICAgW3JlbGF0aXZlVG9PcHRpb25zXT1cInJlbGF0aXZlVG9PcHRpb25zXCJcbiAgICAgICAgICA+PC9haS1jdXN0b20tZGF0ZS10aW1lPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fbWVudS1idG4tc2V0XCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgKm5nSWY9XCJzZWxlY3RpbmdDdXN0b21SYW5nZVwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25CYWNrKClcIlxuICAgICAgICAgICAgaWJtQnV0dG9uPVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgIGNsYXNzPVwiaW90LS1kYXRlLXRpbWUtcGlja2VyX19tZW51LWJ0biBpb3QtLWRhdGUtdGltZS1waWNrZXJfX21lbnUtYnRuLWNhbmNlbFwiXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIHNpemU9XCJmaWVsZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAge3sgYmF0Y2hUZXh0LkJBQ0sgfX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAqbmdJZj1cIiFzZWxlY3RpbmdDdXN0b21SYW5nZVwiXG4gICAgICAgICAgICBpYm1CdXR0b249XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgKGNsaWNrKT1cIm9uQ2FuY2VsKClcIlxuICAgICAgICAgICAgY2xhc3M9XCJpb3QtLWRhdGUtdGltZS1waWNrZXJfX21lbnUtYnRuIGlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fbWVudS1idG4tY2FuY2VsXCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgc2l6ZT1cImZpZWxkXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7eyBiYXRjaFRleHQuQ0FOQ0VMIH19XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgaWJtQnV0dG9uPVwicHJpbWFyeVwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25BcHBseSgpXCJcbiAgICAgICAgICAgIGNsYXNzPVwiaW90LS1kYXRlLXRpbWUtcGlja2VyX19tZW51LWJ0biBpb3QtLWRhdGUtdGltZS1waWNrZXJfX21lbnUtYnRuLWFwcGx5XCJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgc2l6ZT1cImZpZWxkXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICB7eyBiYXRjaFRleHQuQVBQTFkgfX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgOmhvc3Qge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIH1cblxuICAgICAgLyogZml4IGZvciB0b29sdGlwIHRyaWdnZXIgc3R5bGVzIGZvcmNpbmcgYSAxcmVtIGZvbnQgc2l6ZSAoPz8/KSAqL1xuICAgICAgLmlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fYm94IHtcbiAgICAgICAgZm9udC1zaXplOiBpbmhlcml0O1xuICAgICAgfVxuICAgIGAsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIERhdGVUaW1lUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fd3JhcHBlcicpIHdyYXBwZXIgPSB0cnVlO1xuXG4gIEBJbnB1dCgpIGRhdGVUaW1lUmFuZ2VzOiBEYXRlVGltZVJhbmdlW10gPSBbXG4gICAge1xuICAgICAga2V5OiAnTEFTVF8zMF9NSU5VVEVTJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGFzdCAzMCBtaW51dGVzJyxcbiAgICAgIGdldFJhbmdlOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzID0gc3ViTWludXRlcyhub3csIDMwKTtcbiAgICAgICAgcmV0dXJuIFtwcmV2aW91cywgbm93XTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6ICdMQVNUXzFfSE9VUicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0xhc3QgMSBob3VyJyxcbiAgICAgIGdldFJhbmdlOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzID0gc3ViSG91cnMobm93LCAxKTtcbiAgICAgICAgcmV0dXJuIFtwcmV2aW91cywgbm93XTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6ICdMQVNUXzZfSE9VUlMnLFxuICAgICAgZGVzY3JpcHRpb246ICdMYXN0IDYgaG91cnMnLFxuICAgICAgZ2V0UmFuZ2U6ICgpID0+IHtcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgcHJldmlvdXMgPSBzdWJIb3Vycyhub3csIDYpO1xuICAgICAgICByZXR1cm4gW3ByZXZpb3VzLCBub3ddO1xuICAgICAgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGtleTogJ0xBU1RfMTJfSE9VUlMnLFxuICAgICAgZGVzY3JpcHRpb246ICdMYXN0IDEyIGhvdXJzJyxcbiAgICAgIGdldFJhbmdlOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzID0gc3ViSG91cnMobm93LCAxMik7XG4gICAgICAgIHJldHVybiBbcHJldmlvdXMsIG5vd107XG4gICAgICB9LFxuICAgIH0sXG4gICAge1xuICAgICAga2V5OiAnTEFTVF8yNF9IT1VSUycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0xhc3QgMjQgaG91cnMnLFxuICAgICAgZ2V0UmFuZ2U6ICgpID0+IHtcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgcHJldmlvdXMgPSBzdWJIb3Vycyhub3csIDI0KTtcbiAgICAgICAgcmV0dXJuIFtwcmV2aW91cywgbm93XTtcbiAgICAgIH0sXG4gICAgfSxcbiAgXTtcbiAgLyoqXG4gICAqIExhbmd1YWdlIG9mIHRoZSBmbGF0cGlja3IgY2FsZW5kYXIuXG4gICAqXG4gICAqIEZvciByZWZlcmVuY2Ugb2YgdGhlIHBvc3NpYmxlIGxvY2FsZXM6XG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS9mbGF0cGlja3IvZmxhdHBpY2tyL2Jsb2IvbWFzdGVyL3NyYy9sMTBuL2luZGV4LnRzXG4gICAqL1xuICBASW5wdXQoKSBsYW5ndWFnZSA9ICdlbic7XG4gIEBJbnB1dCgpIHNlbGVjdGVkOiBEYXRlVGltZVNlbGVjdGlvbiA9IG51bGw7XG4gIEBJbnB1dCgpIGhhc1JlbGF0aXZlID0gdHJ1ZTtcbiAgQElucHV0KCkgaGFzQWJzb2x1dGUgPSB0cnVlO1xuICBASW5wdXQoKSB0aGVtZTogJ2xpZ2h0JyB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBwbGFjZWhvbGRlciA9ICd5eXl5LW1tLWRkIEhIOm1tJztcbiAgQElucHV0KCkgZGF0ZUZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgQElucHV0KCkgZmxhdHBpY2tyT3B0aW9ucztcbiAgQElucHV0KCkgYmF0Y2hUZXh0OiBCYXRjaExhYmVsVGV4dCA9IHtcbiAgICBBQlNPTFVURTogJ0Fic29sdXRlJyxcbiAgICBSRUxBVElWRTogJ1JlbGF0aXZlJyxcbiAgICBDVVNUT01fUkFOR0U6ICdDdXN0b20gUmFuZ2UnLFxuICAgIFJFTEFUSVZFX1RPOiAnUmVsYXRpdmUgdG8nLFxuICAgIFNUQVJUX0RBVEU6ICdTdGFydCBkYXRlJyxcbiAgICBFTkRfREFURTogJ0VuZCBkYXRlJyxcbiAgICBTVEFSVF9USU1FOiAnU3RhcnQgdGltZScsXG4gICAgRU5EX1RJTUU6ICdFbmQgdGltZScsXG4gICAgTEFTVDogJ0xhc3QnLFxuICAgIENBTkNFTDogJ0NhbmNlbCcsXG4gICAgQVBQTFk6ICdBcHBseScsXG4gICAgQkFDSzogJ2JhY2snLFxuICAgIE5PVzogJ05vdycsXG4gICAgWUVTVEVSREFZOiAnWWVzdGVyZGF5JyxcbiAgICBZRUFSUzogJ3llYXJzJyxcbiAgICBNT05USFM6ICdtb250aHMnLFxuICAgIFdFRUtTOiAnd2Vla3MnLFxuICAgIERBWVM6ICdkYXlzJyxcbiAgICBIT1VSUzogJ2hvdXJzJyxcbiAgICBNSU5VVEVTOiAnbWludXRlcycsXG4gICAgUkFOR0VfU0VQQVJBVE9SOiAndG8nLFxuICB9O1xuICBASW5wdXQoKSByZWxhdGl2ZVRvT3B0aW9uczogUmVsYXRpdmVUb09wdGlvbltdID0gW1xuICAgIHtcbiAgICAgIGtleTogJ1lFU1RFUkRBWScsXG4gICAgICBsYWJlbDogJ1llc3RlcmRheScsXG4gICAgICB2YWx1ZTogLTEsXG4gICAgfSxcbiAgICB7XG4gICAgICBrZXk6ICdUT0RBWScsXG4gICAgICBsYWJlbDogJ1RvZGF5JyxcbiAgICAgIHZhbHVlOiAwLFxuICAgIH0sXG4gIF07XG5cbiAgQE91dHB1dCgpIHNlbGVjdGVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8RGF0ZVRpbWVTZWxlY3Rpb24+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYXBwbHk6IEV2ZW50RW1pdHRlcjxEYXRlUmFuZ2U+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgY2FuY2VsOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLy8gY29udGFpbnMgdGhlIHNlbGVjdGlvbiBmcm9tIGJlZm9yZSBhIGN1c3RvbSBzZWxlY3Rpb24gd2FzIG1hZGUgKHRvIGhhbmRsZSB0aGUgXCJiYWNrXCIgY2FzZSlcbiAgcHJldmlvdXNTZWxlY3Rpb246IERhdGVUaW1lU2VsZWN0aW9uID0gbnVsbDtcbiAgc2VsZWN0aW5nQ3VzdG9tUmFuZ2UgPSBmYWxzZTtcbiAgZXhwYW5kZWQgPSBmYWxzZTtcbiAgZGlzYWJsZWQgPSBmYWxzZTtcbiAgdGltZUZvcm1hdCA9ICdISDptbSc7XG4gIGRhdGVQaWNrZXJGb3JtYXQgPSAnWS1tLWQnO1xuXG4gIGdldCB0b29sdGlwT2Zmc2V0KCkge1xuICAgIHJldHVybiB7IHg6IDAsIHk6IDQgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgaTE4bjogSTE4bikge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXM/LnNlbGVjdGVkPy5jdXJyZW50VmFsdWUpIHtcbiAgICAgIGNvbnN0IFt0eXBlXSA9IGNoYW5nZXMuc2VsZWN0ZWQuY3VycmVudFZhbHVlO1xuICAgICAgaWYgKHR5cGUgPT09ICdSRUxBVElWRScgfHwgdHlwZSA9PT0gJ0FCU09MVVRFJykge1xuICAgICAgICB0aGlzLnNlbGVjdGluZ0N1c3RvbVJhbmdlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIXRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0ZWQgPSBbbnVsbF07XG4gICAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgdGhpcy51cGRhdGVJMThuVHJhbnNsYXRpb25TdHJpbmcoKTtcbiAgICB0aGlzLnVwZGF0ZUFic29sdXRlRGF0ZUZvcm1hdCgpO1xuICB9XG5cbiAgdXBkYXRlQWJzb2x1dGVEYXRlRm9ybWF0KCkge1xuICAgIC8vIGNvbnZlcnQgY3VycmVudCBkYXRlRm9ybWF0IHRvIHByb3BlciBmb3JtYXQgZm9yIGFic29sdXRlIGRhdGUgcGlja2VyXG4gICAgY29uc3QgZm9ybWF0Q2hhcmFjdGVycyA9IHRoaXMuZGF0ZUZvcm1hdC5zcGxpdCgnJyk7XG4gICAgY29uc3QgbmV3RGF0ZUZvcm1hdCA9IGZvcm1hdENoYXJhY3RlcnNcbiAgICAgIC5maWx0ZXIoKGNoYXIsIGkpID0+IGkgPT09IDAgfHwgZm9ybWF0Q2hhcmFjdGVyc1tpXSAhPT0gZm9ybWF0Q2hhcmFjdGVyc1tpIC0gMV0pXG4gICAgICAuam9pbignJyk7XG4gICAgdGhpcy5kYXRlUGlja2VyRm9ybWF0ID0gbmV3RGF0ZUZvcm1hdC5yZXBsYWNlKCd5JywgJ1knKS5yZXBsYWNlKCdNJywgJ20nKTtcbiAgfVxuXG4gIHVwZGF0ZUkxOG5UcmFuc2xhdGlvblN0cmluZygpIHtcbiAgICB0aGlzLmkxOG4uc2V0TG9jYWxlKHRoaXMubGFuZ3VhZ2UsIGxhbmd1YWdlcy5kZWZhdWx0W3RoaXMubGFuZ3VhZ2VdKTtcbiAgfVxuXG4gIGZvcm1hdEN1cnJlbnRSYW5nZVRpdGxlKCkge1xuICAgIGNvbnN0IFtyYW5nZU9yVHlwZV0gPSB0aGlzLnNlbGVjdGVkO1xuICAgIGlmICghcmFuZ2VPclR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyO1xuICAgIH0gZWxzZSBpZiAocmFuZ2VPclR5cGUgPT09ICdSRUxBVElWRScgfHwgcmFuZ2VPclR5cGUgPT09ICdBQlNPTFVURScpIHtcbiAgICAgIHJldHVybiB0aGlzLmZvcm1hdEN1c3RvbVJhbmdlKCk7XG4gICAgfVxuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXRlVGltZVJhbmdlcy5maW5kKChyYW5nZSkgPT4gcmFuZ2Uua2V5ID09PSByYW5nZU9yVHlwZSk7XG4gICAgcmV0dXJuIHJhbmdlLmRlc2NyaXB0aW9uO1xuICB9XG5cbiAgZm9ybWF0Q3VycmVudFJhbmdlKCkge1xuICAgIGNvbnN0IFtyYW5nZU9yVHlwZV0gPSB0aGlzLnNlbGVjdGVkO1xuICAgIGlmICghcmFuZ2VPclR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyO1xuICAgIH0gZWxzZSBpZiAocmFuZ2VPclR5cGUgPT09ICdSRUxBVElWRScgfHwgcmFuZ2VPclR5cGUgPT09ICdBQlNPTFVURScpIHtcbiAgICAgIHJldHVybiB0aGlzLmZvcm1hdEN1c3RvbVJhbmdlKCk7XG4gICAgfVxuICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXRlVGltZVJhbmdlcy5maW5kKChyYW5nZSkgPT4gcmFuZ2Uua2V5ID09PSByYW5nZU9yVHlwZSk7XG4gICAgY29uc3QgW3N0YXJ0LCBlbmRdID0gcmFuZ2UuZ2V0UmFuZ2UoKTtcbiAgICAvLyBUT0RPOiBwcm92aWRlIGEgd2F5IHRvIGN1c3RvbWl6ZSB0aGlzIGZvciBnMTFuXG4gICAgY29uc3QgZm9ybWF0U3RyaW5nID0gYCR7dGhpcy5kYXRlRm9ybWF0fSAke3RoaXMudGltZUZvcm1hdH1gO1xuICAgIGxldCBlbmRGb3JtYXR0ZWQgPSBmb3JtYXQoZW5kLCBmb3JtYXRTdHJpbmcpO1xuICAgIGlmIChpc1RoaXNNaW51dGUoZW5kKSkge1xuICAgICAgZW5kRm9ybWF0dGVkID0gdGhpcy5iYXRjaFRleHQuTk9XO1xuICAgIH1cbiAgICByZXR1cm4gYCR7Zm9ybWF0KHN0YXJ0LCBmb3JtYXRTdHJpbmcpfSAke3RoaXMuYmF0Y2hUZXh0LlJBTkdFX1NFUEFSQVRPUn0gJHtlbmRGb3JtYXR0ZWR9YDtcbiAgfVxuXG4gIGZvcm1hdEN1c3RvbVJhbmdlKCkge1xuICAgIC8vIFRPRE86IHByb3ZpZGUgYSB3YXkgdG8gY3VzdG9taXplIHRoaXMgZm9yIGcxMW5cbiAgICBjb25zdCBmb3JtYXRTdHJpbmcgPSBgJHt0aGlzLmRhdGVGb3JtYXR9ICR7dGhpcy50aW1lRm9ybWF0fWA7XG4gICAgY29uc3QgW3R5cGUsIHN0YXJ0LCBlbmQsIHJlbGF0aXZlQ29uZmlnXSA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgaWYgKHR5cGUgPT09ICdBQlNPTFVURScpIHtcbiAgICAgIHJldHVybiBgJHtmb3JtYXQoc3RhcnQsIGZvcm1hdFN0cmluZyl9ICR7dGhpcy5iYXRjaFRleHQuUkFOR0VfU0VQQVJBVE9SfSAke2Zvcm1hdChcbiAgICAgICAgZW5kLFxuICAgICAgICBmb3JtYXRTdHJpbmdcbiAgICAgICl9YDtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdSRUxBVElWRScpIHtcbiAgICAgIGNvbnN0IFtzdGFydCwgZW5kXSA9IGdldFJhbmdlRnJvbVJlbGF0aXZlKHJlbGF0aXZlQ29uZmlnLCB0aGlzLnJlbGF0aXZlVG9PcHRpb25zKTtcbiAgICAgIHJldHVybiBgJHtmb3JtYXQoc3RhcnQsIGZvcm1hdFN0cmluZyl9ICR7dGhpcy5iYXRjaFRleHQuUkFOR0VfU0VQQVJBVE9SfSAke2Zvcm1hdChcbiAgICAgICAgZW5kLFxuICAgICAgICBmb3JtYXRTdHJpbmdcbiAgICAgICl9YDtcbiAgICB9XG4gIH1cblxuICBzZWxlY3RQcmVzZXRSYW5nZShyYW5nZTogRGF0ZVRpbWVSYW5nZSkge1xuICAgIC8vIHNldCB0aGUgc2VsZWN0ZWQgdmFsdWUgc28gdGhlIHZpZXcgdXBkYXRlc1xuICAgIHRoaXMuc2VsZWN0ZWQgPSBbcmFuZ2Uua2V5XTtcbiAgfVxuXG4gIHJhbmdlQ2hhbmdlKGNoYW5nZTogRGF0ZVRpbWVTZWxlY3Rpb24pIHtcbiAgICAvLyBzdG9yZSB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIGlmIHdlIGRvbid0IGhhdmUgb25lIHlldFxuICAgIGlmICghdGhpcy5wcmV2aW91c1NlbGVjdGlvbikge1xuICAgICAgdGhpcy5wcmV2aW91c1NlbGVjdGlvbiA9IHRoaXMuc2VsZWN0ZWQ7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWQgPSBjaGFuZ2U7XG4gIH1cblxuICBvbkJhY2soKSB7XG4gICAgdGhpcy5zZWxlY3RpbmdDdXN0b21SYW5nZSA9IGZhbHNlO1xuICB9XG5cbiAgb25BcHBseSgpIHtcbiAgICBjb25zdCBbcmFuZ2VPclR5cGUsIHN0YXJ0LCBlbmRdID0gdGhpcy5zZWxlY3RlZDtcbiAgICBpZiAodGhpcy5zZWxlY3RpbmdDdXN0b21SYW5nZSkge1xuICAgICAgdGhpcy5hcHBseS5lbWl0KFtzdGFydCwgZW5kXSk7XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3RlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGVtaXQgdGhlIGRhdGUgcmFuZ2VcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5kYXRlVGltZVJhbmdlcy5maW5kKChyYW5nZSkgPT4gcmFuZ2Uua2V5ID09PSByYW5nZU9yVHlwZSk7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gW3JhbmdlLmtleSwgLi4ucmFuZ2UuZ2V0UmFuZ2UoKV07XG4gICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3RlZCk7XG4gICAgICB0aGlzLmFwcGx5LmVtaXQocmFuZ2UuZ2V0UmFuZ2UoKSk7XG4gICAgfVxuICAgIHRoaXMucHJldmlvdXNTZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGVkO1xuICAgIHRoaXMuZXhwYW5kZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XG4gIH1cblxuICBvbkNhbmNlbCgpIHtcbiAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5wcmV2aW91c1NlbGVjdGlvbjtcbiAgICB0aGlzLmNhbmNlbC5lbWl0KCk7XG4gICAgdGhpcy5leHBhbmRlZCA9IGZhbHNlO1xuICB9XG5cbiAgbmF2aWdhdGVMaXN0KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICBjYXNlICdBcnJvd1VwJzoge1xuICAgICAgICBjb25zdCBwcmV2ID0gdGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGlmIChwcmV2Py5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHtcbiAgICAgICAgICB0YXJnZXQudGFiSW5kZXggPSAtMTtcbiAgICAgICAgICBwcmV2LnRhYkluZGV4ID0gMDtcbiAgICAgICAgICBwcmV2LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlICdBcnJvd0Rvd24nOiB7XG4gICAgICAgIGNvbnN0IG5leHQgPSB0YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICBpZiAobmV4dD8uaGFzQXR0cmlidXRlKCd0YWJpbmRleCcpKSB7XG4gICAgICAgICAgdGFyZ2V0LnRhYkluZGV4ID0gLTE7XG4gICAgICAgICAgbmV4dC50YWJJbmRleCA9IDA7XG4gICAgICAgICAgbmV4dC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVBpY2tlcigpIHtcbiAgICB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gICAgaWYgKHRoaXMuZXhwYW5kZWQpIHtcbiAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBzZWxlY3RlZDogSFRNTEVsZW1lbnQgPSBuYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICcuaW90LS1kYXRlLXRpbWUtcGlja2VyX19saXN0aXRlbS0tcHJlc2V0LXNlbGVjdGVkJ1xuICAgICAgKTtcbiAgICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHNlbGVjdGVkLmZvY3VzKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19