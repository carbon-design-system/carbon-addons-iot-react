import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { format, setHours, setMinutes } from 'date-fns';

@Component({
  selector: 'ai-date-time-absolute',
  template: `
    <fieldset class="bx--fieldset iot--date-time-picker__menu-formgroup" style="padding: 0 0.9rem;">
      <div class="bx--form-item">
        <ibm-date-picker
          [range]="true"
          [label]="batchText.START_DATE"
          [rangeLabel]="batchText.END_DATE"
          [dateFormat]="dateFormat"
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
  styles: [
    `
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
    `,
  ],
})
export class DateTimeAbsoluteComponent implements OnChanges {
  startTime = '00:00';
  endTime = '00:00';
  dateRange = null;

  @Input() value = [];
  @Input() batchText: any;
  @Input() dateFormat = 'Y-m-d';
  @Input() placeholder = 'yyyy-mm-dd';
  @Input() flatpickrOptions;
  @Output() valueChange: EventEmitter<[Date, Date]> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.value?.currentValue) {
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
