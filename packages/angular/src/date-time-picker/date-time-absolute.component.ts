import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { format, getHours, getMinutes, setHours, setMinutes } from 'date-fns';

@Component({
  selector: 'ai-date-time-absolute',
  template: `
    <fieldset class="bx--fieldset iot--date-time-picker__menu-formgroup" style="padding: 0 0.9rem;">
      <div class="bx--form-item">
        <ibm-date-picker
          [range]="true"
          label="Start date"
          rangeLabel="End date"
          [(ngModel)]="dateRange"
          (valueChange)="onChange()"
        >
        </ibm-date-picker>
      </div>
    </fieldset>
    <fieldset class="bx--fieldset iot--date-time-picker__menu-formgroup">
      <div class="iot--date-time-picker__fields-wrapper">
        <!-- tmp until we can implement a better time selector -->
        <div class="bx--form-item" style="margin-right: 1rem">
          <label class="bx--label">Start time</label>
          <input ibmText type="time" [(ngModel)]="startTime" (change)="onChange()" />
        </div>
        <!-- tmp until we can implement a better time selector -->
        <div class="bx--form-item">
          <label class="bx--label">End time</label>
          <input ibmText type="time" [(ngModel)]="endTime" (change)="onChange()" />
        </div>
      </div>
    </fieldset>
  `,
  styles: [
    `
      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker-container {
        opacity: 1;
      }

      ::ng-deep .iot--date-time-picker__wrapper .bx--date-picker--range {
        position: initial;
      }
    `,
  ],
})
export class DateTimeAbsoluteComponent implements OnChanges {
  startTime = '00:00';
  endTime = '00:00';
  dateRange = null;

  @Input() value = [];
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
