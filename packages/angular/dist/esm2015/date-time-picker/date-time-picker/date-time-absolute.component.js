/**
 *
 * @ai-apps/angular v2.155.1 | date-time-absolute.component.js
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


import { Component, EventEmitter, Input, Output, } from '@angular/core';
import { format, setHours, setMinutes } from 'date-fns';
export class DateTimeAbsoluteComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLWFic29sdXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlLXRpbWUtcGlja2VyL2RhdGUtdGltZS1hYnNvbHV0ZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUdMLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFnRnhELE1BQU0sT0FBTyx5QkFBeUI7SUE5RXRDO1FBK0VFLGNBQVMsR0FBRyxPQUFPLENBQUM7UUFDcEIsWUFBTyxHQUFHLE9BQU8sQ0FBQztRQUNsQixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBRVIsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUVYLGVBQVUsR0FBRyxZQUFZLENBQUM7UUFDMUIscUJBQWdCLEdBQUcsT0FBTyxDQUFDO1FBQzNCLGdCQUFXLEdBQUcsWUFBWSxDQUFDO1FBRTFCLGdCQUFXLEdBQStCLElBQUksWUFBWSxFQUFFLENBQUM7SUEyQ3pFLENBQUM7SUF6Q0MsUUFBUTtRQUNOLDZEQUE2RDtRQUM3RCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN2QztJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7O1FBQ2hDLFVBQUksT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEtBQUssMENBQUUsWUFBWSxFQUFFO1lBQ2hDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7WUFDaEQsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDbEIsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM5QixNQUFNLFlBQVksR0FBRyxPQUFPLENBQUM7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztTQUMxQztJQUNILENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsT0FBTztTQUNSO1FBRUQsTUFBTSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0MsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFdkMsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzVDLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNFLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRW5FLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQzs7O1lBbklGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQlQ7eUJBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0F3Q0M7YUFFSjs7O29CQU1FLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOytCQUNMLEtBQUs7MEJBQ0wsS0FBSzsrQkFDTCxLQUFLOzBCQUNMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZm9ybWF0LCBzZXRIb3Vycywgc2V0TWludXRlcyB9IGZyb20gJ2RhdGUtZm5zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktZGF0ZS10aW1lLWFic29sdXRlJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZmllbGRzZXQgY2xhc3M9XCJieC0tZmllbGRzZXQgaW90LS1kYXRlLXRpbWUtcGlja2VyX19tZW51LWZvcm1ncm91cFwiIHN0eWxlPVwicGFkZGluZzogMCAwLjlyZW07XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiYngtLWZvcm0taXRlbVwiPlxuICAgICAgICA8aWJtLWRhdGUtcGlja2VyXG4gICAgICAgICAgW3JhbmdlXT1cInRydWVcIlxuICAgICAgICAgIFtsYWJlbF09XCJiYXRjaFRleHQuU1RBUlRfREFURVwiXG4gICAgICAgICAgW3JhbmdlTGFiZWxdPVwiYmF0Y2hUZXh0LkVORF9EQVRFXCJcbiAgICAgICAgICBbZGF0ZUZvcm1hdF09XCJkYXRlUGlja2VyRm9ybWF0XCJcbiAgICAgICAgICBbKG5nTW9kZWwpXT1cImRhdGVSYW5nZVwiXG4gICAgICAgICAgW3BsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCJcbiAgICAgICAgICBbZmxhdHBpY2tyT3B0aW9uc109XCJmbGF0cGlja3JPcHRpb25zXCJcbiAgICAgICAgICAodmFsdWVDaGFuZ2UpPVwib25DaGFuZ2UoKVwiXG4gICAgICAgICAgdGhlbWU9XCJsaWdodFwiXG4gICAgICAgID5cbiAgICAgICAgPC9pYm0tZGF0ZS1waWNrZXI+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICAgIDxmaWVsZHNldCBjbGFzcz1cImJ4LS1maWVsZHNldCBpb3QtLWRhdGUtdGltZS1waWNrZXJfX21lbnUtZm9ybWdyb3VwXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW90LS1kYXRlLXRpbWUtcGlja2VyX19maWVsZHMtd3JhcHBlclwiPlxuICAgICAgICA8IS0tIHRtcCB1bnRpbCB3ZSBjYW4gaW1wbGVtZW50IGEgYmV0dGVyIHRpbWUgc2VsZWN0b3IgLS0+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJieC0tZm9ybS1pdGVtXCIgc3R5bGU9XCJtYXJnaW4tcmlnaHQ6IDFyZW1cIj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJieC0tbGFiZWxcIj57eyBiYXRjaFRleHQuU1RBUlRfVElNRSB9fTwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0IGlibVRleHQgdHlwZT1cInRpbWVcIiBbKG5nTW9kZWwpXT1cInN0YXJ0VGltZVwiIChjaGFuZ2UpPVwib25DaGFuZ2UoKVwiIHRoZW1lPVwibGlnaHRcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPCEtLSB0bXAgdW50aWwgd2UgY2FuIGltcGxlbWVudCBhIGJldHRlciB0aW1lIHNlbGVjdG9yIC0tPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYngtLWZvcm0taXRlbVwiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImJ4LS1sYWJlbFwiPnt7IGJhdGNoVGV4dC5FTkRfVElNRSB9fTwvbGFiZWw+XG4gICAgICAgICAgPGlucHV0IGlibVRleHQgdHlwZT1cInRpbWVcIiBbKG5nTW9kZWwpXT1cImVuZFRpbWVcIiAoY2hhbmdlKT1cIm9uQ2hhbmdlKClcIiB0aGVtZT1cImxpZ2h0XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICAvKlxuICAgICAgICBhbGwgb2YgdGhpcyBpcyBhIGJ1bmNoIG9mIGdyb3NzIHN0eWxpbmcgaGFja3MgdW50aWwgd2UgY2FuIHNldHRsZSBvbiBhIHJlYXNvbmFibGVcbiAgICAgICAgVVggZGVjaXNpb24gZm9yIHRoZSByYW5nZSBwaWNrZXIuIEJ5IGRlZmF1bHQgcmVhY3QgZm9yY2VzIHRoZSBwaWNrZXIgb3Blbiwgd2hpY2hcbiAgICAgICAgdG90YWxseSBicmVha3MgdGhlIGludGVyYWN0aW9uIGZvciByZS1zZWxlY3RpbmcgZGF0ZXMuIFdlIGFsc28gbmVlZCB0byBmaXggdGhlIEhUTUxcbiAgICAgICAgc3RydWN0dXJlIHVwc3RyZWFtIGFzIHdlIGNhbid0IGFwcGx5IHRoZSByaWdodCBzcGFjaW5nIChlYXNpbHkpIGR1ZSB0byB0aGUgZHVwbGljYXRpb25cbiAgICAgICAgb2YgY2xhc3NlcyBhdCBtdWx0aXBsZSBsZXZlbHMgb2YgdGhlIHVuZGVybHlpbmcgZGF0ZXBpY2tlci5cbiAgICAgICovXG4gICAgICA6Om5nLWRlZXAgLmlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fd3JhcHBlciAuYngtLWRhdGUtcGlja2VyLWNvbnRhaW5lciB7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICB9XG5cbiAgICAgIDo6bmctZGVlcFxuICAgICAgICAuaW90LS1kYXRlLXRpbWUtcGlja2VyX193cmFwcGVyXG4gICAgICAgIC5ieC0tZGF0ZS1waWNrZXItLXJhbmdlXG4gICAgICAgID4gLmJ4LS1kYXRlLXBpY2tlci1jb250YWluZXI6Zmlyc3QtY2hpbGQge1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDA7XG4gICAgICB9XG5cbiAgICAgIDo6bmctZGVlcCAuaW90LS1kYXRlLXRpbWUtcGlja2VyX193cmFwcGVyIC5ieC0tZGF0ZS1waWNrZXItLXJhbmdlIHtcbiAgICAgICAgcG9zaXRpb246IGluaXRpYWw7XG4gICAgICB9XG5cbiAgICAgIDo6bmctZGVlcCAuaW90LS1kYXRlLXRpbWUtcGlja2VyX193cmFwcGVyIC5ieC0tZGF0ZS1waWNrZXItaW5wdXRfX3dyYXBwZXIge1xuICAgICAgICBtYXgtd2lkdGg6IDEzN3B4O1xuICAgICAgfVxuXG4gICAgICA6Om5nLWRlZXAgLmlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fd3JhcHBlciAuYngtLWRhdGUtcGlja2VyX19pbnB1dCB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgfVxuXG4gICAgICAvKiB3ZSBkbyB0aGlzIHNpbmNlIHRoZXJlJ3Mgb25seSBvbmUgbGV2ZWwgb2YgaWJtLWRhdGUtcGlja2VyLWlucHV0LiB0aGUgb3RoZXIgd3JhcHBlciBjbGFzc2VzIGFyZSBkdXBsaWNhdGVkICovXG4gICAgICA6Om5nLWRlZXBcbiAgICAgICAgLmlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fd3JhcHBlclxuICAgICAgICAuYngtLWRhdGUtcGlja2VyLS1yYW5nZVxuICAgICAgICAuYngtLWRhdGUtcGlja2VyLWNvbnRhaW5lcjpmaXJzdC1jaGlsZFxuICAgICAgICBpYm0tZGF0ZS1waWNrZXItaW5wdXQge1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDE2cHg7XG4gICAgICAgIHdpZHRoOiAxMzdweDtcbiAgICAgIH1cbiAgICBgLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBEYXRlVGltZUFic29sdXRlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBzdGFydFRpbWUgPSAnMDA6MDAnO1xuICBlbmRUaW1lID0gJzIzOjU5JztcbiAgZGF0ZVJhbmdlID0gbnVsbDtcblxuICBASW5wdXQoKSB2YWx1ZSA9IFtdO1xuICBASW5wdXQoKSBiYXRjaFRleHQ6IGFueTtcbiAgQElucHV0KCkgZGF0ZUZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgQElucHV0KCkgZGF0ZVBpY2tlckZvcm1hdCA9ICdZLW0tZCc7XG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyID0gJ3l5eXktbW0tZGQnO1xuICBASW5wdXQoKSBmbGF0cGlja3JPcHRpb25zO1xuICBAT3V0cHV0KCkgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxbRGF0ZSwgRGF0ZV0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIGlmIGRhdGVSYW5nZSBpcyBub3QgbnVsbCAoZS5nLiBzd2l0Y2ggZnJvbSByZWxhdGl2ZSByYW5nZSlcbiAgICBpZiAodGhpcy5kYXRlUmFuZ2UpIHtcbiAgICAgIGxldCBbc3RhcnREYXRlLCBlbmREYXRlXSA9IHRoaXMuZGF0ZVJhbmdlO1xuICAgICAgc3RhcnREYXRlID0gZm9ybWF0KHN0YXJ0RGF0ZSwgdGhpcy5kYXRlRm9ybWF0KTtcbiAgICAgIGVuZERhdGUgPSBmb3JtYXQoZW5kRGF0ZSwgdGhpcy5kYXRlRm9ybWF0KTtcbiAgICAgIHRoaXMuZGF0ZVJhbmdlID0gW3N0YXJ0RGF0ZSwgZW5kRGF0ZV07XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzPy52YWx1ZT8uY3VycmVudFZhbHVlKSB7XG4gICAgICBjb25zdCBbc3RhcnQsIGVuZF0gPSBjaGFuZ2VzLnZhbHVlLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmICghc3RhcnQgfHwgIWVuZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmRhdGVSYW5nZSA9IFtzdGFydCwgZW5kXTtcbiAgICAgIGNvbnN0IGZvcm1hdFN0cmluZyA9ICdISDptbSc7XG4gICAgICB0aGlzLnN0YXJ0VGltZSA9IGZvcm1hdChzdGFydCwgZm9ybWF0U3RyaW5nKTtcbiAgICAgIHRoaXMuZW5kVGltZSA9IGZvcm1hdChlbmQsIGZvcm1hdFN0cmluZyk7XG4gICAgfVxuICB9XG5cbiAgb25DaGFuZ2UoKSB7XG4gICAgaWYgKCF0aGlzLmRhdGVSYW5nZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IFtzdGFydEhvdXJTdHIsIHN0YXJ0TWluU3RyXSA9IHRoaXMuc3RhcnRUaW1lLnNwbGl0KCc6Jyk7XG4gICAgY29uc3QgW2VuZEhvdXJTdHIsIGVuZE1pblN0cl0gPSB0aGlzLmVuZFRpbWUuc3BsaXQoJzonKTtcbiAgICBjb25zdCBzdGFydEhvdXIgPSBwYXJzZUludChzdGFydEhvdXJTdHIsIDEwKTtcbiAgICBjb25zdCBzdGFydE1pbiA9IHBhcnNlSW50KHN0YXJ0TWluU3RyLCAxMCk7XG4gICAgY29uc3QgZW5kSG91ciA9IHBhcnNlSW50KGVuZEhvdXJTdHIsIDEwKTtcbiAgICBjb25zdCBlbmRNaW4gPSBwYXJzZUludChlbmRNaW5TdHIsIDEwKTtcblxuICAgIGNvbnN0IFtzdGFydERhdGUsIGVuZERhdGVdID0gdGhpcy5kYXRlUmFuZ2U7XG4gICAgY29uc3Qgc3RhcnREYXRlVGltZSA9IHNldE1pbnV0ZXMoc2V0SG91cnMoc3RhcnREYXRlLCBzdGFydEhvdXIpLCBzdGFydE1pbik7XG4gICAgY29uc3QgZW5kRGF0ZVRpbWUgPSBzZXRNaW51dGVzKHNldEhvdXJzKGVuZERhdGUsIGVuZEhvdXIpLCBlbmRNaW4pO1xuXG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KFtzdGFydERhdGVUaW1lLCBlbmREYXRlVGltZV0pO1xuICB9XG59XG4iXX0=