import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ListItem } from 'carbon-components-angular';

@Component({
  selector: 'ai-card-date-range',
  template: `
    <div class="iot--card--toolbar-timerange-label">{{ selectedRangeContent }}</div>
    <ibm-overflow-menu aiCardToolbarAction [customTrigger]="triggerIcon">
      <ibm-overflow-menu-option *ngFor="let range of ranges" (selected)="onRangeSelected(range.id)">
        {{ range.content }}
      </ibm-overflow-menu-option>
    </ibm-overflow-menu>
    <ng-template #triggerIcon>
      <svg ibmIcon="calendar" size="16"></svg>
    </ng-template>
  `,
})
export class CardDateRangeComponent implements ControlValueAccessor, OnChanges {
  @HostBinding('class.iot--card--toolbar-date-range-wrapper') wrapperClass = true;

  /**
   * List of date/time ranges to display in the overflow menu.
   *
   * Uses a modified `ListItem` array. `id` keys **must** be provided.
   *
   * If a null is passed to the ngModel or `value` Input the item with
   * the `id` of `"default"` will be selected.
   */
  @Input() ranges: ListItem[] = [
    {
      id: 'default',
      content: 'Default',
      selected: true,
    },
    {
      id: 'last-24-hours',
      content: 'Last 24 hours',
      selected: false,
    },
    {
      id: 'last-7-days',
      content: 'Last 7 days',
      selected: false,
    },
    {
      id: 'last-month',
      content: 'Last month',
      selected: false,
    },
    {
      id: 'last-quarter',
      content: 'Last quarter',
      selected: false,
    },
    {
      id: 'last-year',
      content: 'Last year',
      selected: false,
    },
    {
      id: 'this-week',
      content: 'This week',
      selected: false,
      divider: true,
    },
    {
      id: 'this-month',
      content: 'This month',
      selected: false,
    },
    {
      id: 'this-quarter',
      content: 'This quarter',
      selected: false,
    },
    {
      id: 'this-year',
      content: 'This year',
      selected: false,
    },
  ];

  /**
   * Set to the id of a range item to select it
   */
  @Input() value = 'default';

  /**
   * Emits the id of the currently selected range item
   */
  @Output() valueChange = new EventEmitter<string>();

  /**
   * Contains the content of the currently selected range item
   */
  public selectedRangeContent = this.getSelectedRange().content;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.selectRange(changes.value.currentValue);
    }
  }

  onRangeSelected(range: string) {
    this.selectRange(range);
    this.onChange(range);
    this.valueChange.emit(range);
  }

  writeValue(rangeId: string): void {
    this.selectRange(rangeId);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected onChange = (obj: any) => {};
  protected onTouched = () => {};

  /**
   * Updates the `ranges` list to only select the provided id.
   *
   * Also updates `selectedRangeContent`
   *
   * falsy/null values will select the `default` option
   *
   * @param rangeId id of the range item to select
   */
  protected selectRange(rangeId: string) {
    if (!rangeId) {
      rangeId = 'default';
    }
    this.ranges = this.ranges.map((range) => {
      if (range.id === rangeId) {
        range.selected = true;
      } else {
        range.selected = false;
      }
      return range;
    });
    this.selectedRangeContent = this.getSelectedRange().content;
  }

  protected getSelectedRange() {
    return this.ranges.find((range) => range.selected);
  }
}
