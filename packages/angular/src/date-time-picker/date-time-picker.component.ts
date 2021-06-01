import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { format, isThisMinute, subHours, subMinutes } from 'date-fns';
import { getRangeFromRelative } from './date-time-relative.component';

export interface DateTimeRange {
  key: any;
  description: string;
  getRange: () => [Date, Date];
}

export interface RelativeRange {
  last: [number, string];
  relativeTo: [string, string];
}

export type RelativeDateTimeSelection = ['RELATIVE', ...DateRange, RelativeRange];
export type AbsoluteDateTimeSelection = ['ABSOLUTE', ...DateRange];
export type CustomDateTimeSelection = AbsoluteDateTimeSelection | RelativeDateTimeSelection;
export type PresetDateTimeSelection = [string];

export type DateTimeSelection = PresetDateTimeSelection | CustomDateTimeSelection;

export type DateRange = [Date, Date];

@Component({
  selector: 'ai-date-time-picker',
  template: `
    <div
      class="iot--date-time-picker__box"
      [ngClass]="{
        'iot--date-time-picker__box--light': theme === 'light'
      }"
      [ibmTooltip]="formatCurrentRange()"
      trigger="hover"
      placement="bottom"
    >
      <div class="iot--date-time-picker__field" (click)="togglePicker()">
        <span [title]="formatCurrentRangeTitle()">{{ formatCurrentRangeTitle() }}</span>
        <svg ibmIcon="calendar" size="16" class="iot--date-time-picker__icon"></svg>
        <!-- <span
						ibmTooltip="Hello, World"
						[isOpen]="true"
						trigger="hover"
						placement="bottom">
					</span> -->
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
          <ol *ngIf="!selectingCustomRange" class="bx--list--ordered">
            <li
              class="bx--list__item iot--date-time-picker__listitem iot--date-time-picker__listitem--current"
            >
              {{ formatCurrentRange() }}
            </li>
            <li
              *ngIf="hasRelative || hasAbsolute"
              (click)="selectingCustomRange = true"
              class="bx--list__item iot--date-time-picker__listitem iot--date-time-picker__listitem--custom"
            >
              Custom Range
            </li>
            <li
              *ngFor="let range of dateTimeRanges"
              class="bx--list__item iot--date-time-picker__listitem iot--date-time-picker__listitem--preset"
              (click)="selectPresetRange(range)"
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
          ></ai-custom-date-time>
        </div>
        <div class="iot--date-time-picker__menu-btn-set">
          <button
            *ngIf="selectingCustomRange"
            (click)="selectingCustomRange = false"
            ibmButton="secondary"
            class="iot--date-time-picker__menu-btn iot--date-time-picker__menu-btn-cancel"
            type="button"
          >
            Back
          </button>
          <button
            *ngIf="!selectingCustomRange"
            ibmButton="secondary"
            (click)="onCancel()"
            class="iot--date-time-picker__menu-btn iot--date-time-picker__menu-btn-cancel"
            type="button"
          >
            Cancel
          </button>
          <button
            ibmButton="primary"
            (click)="onApply()"
            class="iot--date-time-picker__menu-btn iot--date-time-picker__menu-btn-apply"
            type="button"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* fix for tooltip trigger styles forcing a 1rem font size (???) */
      .iot--date-time-picker__box {
        font-size: inherit;
      }
    `,
  ],
})
export class DateTimePickerComponent implements OnChanges, OnInit {
  @HostBinding('class.iot--date-time-picker__wrapper') wrapper = true;

  @Input() dateTimeRanges: DateTimeRange[] = [
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
  @Input() selected: DateTimeSelection = null;
  @Input() hasRelative = true;
  @Input() hasAbsolute = true;
  @Input() theme: 'light' | null = null;
  @Output() selectedChange: EventEmitter<DateTimeSelection> = new EventEmitter();
  @Output() apply: EventEmitter<DateRange> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  // contains the most recent change to be applied when the "apply" button is clicked
  unAppliedSelection: DateTimeSelection = null;
  selectingCustomRange = false;
  expanded = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.selected?.currentValue) {
      const [type, start, end] = changes.selected.currentValue;
      if (type === 'RELATIVE' || type === 'ABSOLUTE') {
        this.selectingCustomRange = true;
      }
    }
  }

  ngOnInit() {
    if (!this.selected) {
      this.selected = [this.dateTimeRanges[0].key];
    }
  }

  formatCurrentRangeTitle() {
    const [rangeOrType] = this.selected;
    if (rangeOrType === 'RELATIVE' || rangeOrType === 'ABSOLUTE') {
      return this.formatCustomRange();
    }
    const range = this.dateTimeRanges.find((range) => range.key === rangeOrType);
    return range.description;
  }

  formatCurrentRange() {
    const [rangeOrType] = this.selected;
    if (rangeOrType === 'RELATIVE' || rangeOrType === 'ABSOLUTE') {
      return this.formatCustomRange();
    }
    const range = this.dateTimeRanges.find((range) => range.key === rangeOrType);
    const [start, end] = range.getRange();
    // TODO: provide a way to customize this for g11n
    const formatString = 'yyyy-M-d HH:mm';
    let endFormatted = format(end, formatString);
    if (isThisMinute(end)) {
      endFormatted = 'now';
    }
    return `${format(start, formatString)} to ${endFormatted}`;
  }

  formatCustomRange() {
    // TODO: provide a way to customize this for g11n
    const formatString = 'yyyy-M-d HH:mm';
    const [type, start, end, relativeConfig] = this.selected;
    if (type === 'ABSOLUTE') {
      return `${format(start, formatString)} to ${format(end, formatString)}`;
    } else if (type === 'RELATIVE') {
      const [start, end] = getRangeFromRelative(relativeConfig);
      return `${format(start, formatString)} to ${format(end, formatString)}`;
    }
  }

  selectPresetRange(range: DateTimeRange) {
    // set the selected value so the view updates
    this.selected = [range.key];
    // queue the selection to emit when applied
    this.unAppliedSelection = this.selected;
  }

  rangeChange(change: DateTimeSelection) {
    // queue the selection to emit when applied
    this.unAppliedSelection = change;
  }

  onApply() {
    // if nothing has changed, dont do the apply
    if (!this.unAppliedSelection) {
      // but do close the dialog
      this.expanded = false;
      return;
    }
    const [rangeOrType, start, end] = this.unAppliedSelection;
    if (this.selectingCustomRange) {
      this.selected = this.unAppliedSelection;
      this.apply.emit([start, end]);
      this.selectedChange.emit(this.unAppliedSelection);
    } else {
      // emit the date range
      const range = this.dateTimeRanges.find((range) => range.key === rangeOrType);
      this.selected = [range.key, ...range.getRange()];
      this.selectedChange.emit(this.selected);
      this.apply.emit(range.getRange());
    }
    // clear the unapplied selection
    this.unAppliedSelection = null;
    this.expanded = false;
  }

  onCancel() {
    this.cancel.emit();
    this.unAppliedSelection = null;
    this.expanded = false;
  }

  togglePicker() {
    this.expanded = !this.expanded;
  }
}
