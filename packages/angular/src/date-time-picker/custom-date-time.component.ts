import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DateRange, DateTimeSelection, RelativeRange } from './date-time-picker.component';

@Component({
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
    >
    </ai-date-time-relative>
    <ai-date-time-absolute
      *ngIf="mode === 'absolute' && hasAbsolute"
      (valueChange)="absoluteChange($event)"
      [value]="value"
      [batchText]="batchText"
    >
    </ai-date-time-absolute>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CustomDateTimeComponent implements OnChanges {
  mode: 'relative' | 'absolute' = 'relative';
  value = [];
  @Input() range: DateTimeSelection = null;
  @Input() hasRelative = true;
  @Input() hasAbsolute = true;
  @Input() batchText: any;
  @Output() rangeChange: EventEmitter<DateTimeSelection> = new EventEmitter();

  @HostBinding('class.iot--date-time-picker__custom-wrapper') wrapperClass = true;

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.range?.currentValue) {
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

    if (changes?.hasRelative?.currentValue === false) {
      this.mode = 'absolute';
    }

    if (changes?.hasAbsolute?.currentValue === false) {
      this.mode = 'relative';
    }
  }

  relativeChange(change: [Date, Date, RelativeRange]) {
    this.rangeChange.emit(['RELATIVE', ...change]);
  }

  absoluteChange(change: DateRange) {
    console.log(change);
    this.rangeChange.emit(['ABSOLUTE', ...change]);
  }
}
