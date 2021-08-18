import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { setHours, setMinutes, sub, subDays } from 'date-fns';
import { DateRange, DateTimeSelection, RelativeRange } from './date-time-picker.component';

export type RelativeDateValue = [...DateRange, RelativeRange];

export const getRangeFromRelative = (relativeConfig: RelativeRange): DateRange => {
  const [valueToSubtract, valueRange] = relativeConfig.last;
  const [relativeTo, relativeTime] = relativeConfig.relativeTo;
  const [hourStr, minStr] = relativeTime.split(':');
  const hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);
  const endDate = setMinutes(setHours(subDays(new Date(), 1), hour), min);
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
  const startDate = sub(new Date(), timeToSub);
  return [startDate, endDate];
};

@Component({
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
          class="bx--form-item"
          [(ngModel)]="relativeTo"
          (valueChange)="onChange()"
          theme="light"
        >
          <option value="YESTERDAY" selected>{{ batchText.YESTERDAY }}</option>
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
  styles: [
    `
      /* tmp hack until carbon-components-angular has the updated number input */
      ::ng-deep .bx--number__input-wrapper input {
        min-width: 0px !important;
        padding-right: 0px !important;
      }
    `,
  ],
})
export class DateTimeRelativeComponent implements OnChanges {
  @Input() value: any[] = null;
  @Input() batchText: any;
  @Output() valueChange: EventEmitter<RelativeDateValue> = new EventEmitter();

  timeToSubtract = 0;
  timeRange = 'MINUTES';
  relativeTo = 'YESTERDAY';
  relativeTime = '00:00';

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.value?.currentValue) {
      const [start, end, relativeConfig] = changes.value.currentValue as RelativeDateValue;
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
      const relativeConfig: RelativeRange = {
        last: [this.timeToSubtract, this.timeRange],
        relativeTo: [this.relativeTo, this.relativeTime],
      };
      const dates = getRangeFromRelative(relativeConfig);
      const range: RelativeDateValue = [...dates, relativeConfig];
      this.valueChange.emit(range);
    });
  }
}
