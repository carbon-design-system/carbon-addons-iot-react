/**
 *
 * @ai-apps/angular v2.155.1 | date-time-relative.component.js
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


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { setHours, setMinutes, sub, subDays, addDays } from 'date-fns';
export const getEndDate = (relativeTo, relativeToOptions) => {
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
export const getRangeFromRelative = (relativeConfig, relativeToOptions) => {
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
export class DateTimeRelativeComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10aW1lLXJlbGF0aXZlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlLXRpbWUtcGlja2VyL2RhdGUtdGltZS1yZWxhdGl2ZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDakcsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFLdkUsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLENBQ3hCLFVBQTRCLEVBQzVCLGlCQUFxQyxFQUMvQixFQUFFO0lBQ1IsTUFBTSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsR0FBRyxVQUFVLENBQUM7SUFDbkQsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkMsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNqQyxNQUFNLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBRWhHLDZFQUE2RTtJQUM3RSxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7UUFDakIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxPQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElB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Qy9CLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBeEdGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1RFQ7eUJBRUM7Ozs7OztLQU1DO2FBRUo7OztvQkFFRSxLQUFLO3dCQUNMLEtBQUs7Z0NBQ0wsS0FBSzswQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE91dHB1dCwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgc2V0SG91cnMsIHNldE1pbnV0ZXMsIHN1Yiwgc3ViRGF5cywgYWRkRGF5cyB9IGZyb20gJ2RhdGUtZm5zJztcbmltcG9ydCB7IERhdGVSYW5nZSwgUmVsYXRpdmVSYW5nZSwgUmVsYXRpdmVUb09wdGlvbiB9IGZyb20gJy4vZGF0ZS10aW1lLXBpY2tlci5jb21wb25lbnQnO1xuXG5leHBvcnQgdHlwZSBSZWxhdGl2ZURhdGVWYWx1ZSA9IFsuLi5EYXRlUmFuZ2UsIFJlbGF0aXZlUmFuZ2VdO1xuXG5leHBvcnQgY29uc3QgZ2V0RW5kRGF0ZSA9IChcbiAgcmVsYXRpdmVUbzogW3N0cmluZywgc3RyaW5nXSxcbiAgcmVsYXRpdmVUb09wdGlvbnM6IFJlbGF0aXZlVG9PcHRpb25bXVxuKTogRGF0ZSA9PiB7XG4gIGNvbnN0IFtyZWxhdGl2ZVRvTGFiZWwsIHJlbGF0aXZlVGltZV0gPSByZWxhdGl2ZVRvO1xuICBjb25zdCBbaG91clN0ciwgbWluU3RyXSA9IHJlbGF0aXZlVGltZS5zcGxpdCgnOicpO1xuICBjb25zdCBob3VyID0gcGFyc2VJbnQoaG91clN0ciwgMTApO1xuICBjb25zdCBtaW4gPSBwYXJzZUludChtaW5TdHIsIDEwKTtcbiAgY29uc3QgbnVtT2ZEYXlzID0gcmVsYXRpdmVUb09wdGlvbnMuZmlsdGVyKChvcHRpb24pID0+IG9wdGlvbi5rZXkgPT09IHJlbGF0aXZlVG9MYWJlbClbMF0udmFsdWU7XG5cbiAgLy8gbnVtT2ZEYXlzIDwgMCBmb3IgcGFzdCwgbnVtT2ZEYXlzID09IDAgZm9yIHRvZGF5LCBudW1PZkRheXMgPiAwIGZvciBmdXR1cmVcbiAgaWYgKG51bU9mRGF5cyA8IDApIHtcbiAgICBjb25zdCBwYXN0RGF5cyA9IE1hdGguYWJzKG51bU9mRGF5cyk7XG4gICAgcmV0dXJuIHNldE1pbnV0ZXMoc2V0SG91cnMoc3ViRGF5cyhuZXcgRGF0ZSgpLCBwYXN0RGF5cyksIGhvdXIpLCBtaW4pO1xuICB9XG5cbiAgcmV0dXJuIHNldE1pbnV0ZXMoc2V0SG91cnMoYWRkRGF5cyhuZXcgRGF0ZSgpLCBudW1PZkRheXMpLCBob3VyKSwgbWluKTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSYW5nZUZyb21SZWxhdGl2ZSA9IChcbiAgcmVsYXRpdmVDb25maWc6IFJlbGF0aXZlUmFuZ2UsXG4gIHJlbGF0aXZlVG9PcHRpb25zOiBSZWxhdGl2ZVRvT3B0aW9uW11cbik6IERhdGVSYW5nZSA9PiB7XG4gIGNvbnN0IFt2YWx1ZVRvU3VidHJhY3QsIHZhbHVlUmFuZ2VdID0gcmVsYXRpdmVDb25maWcubGFzdDtcbiAgY29uc3QgZW5kRGF0ZSA9IGdldEVuZERhdGUocmVsYXRpdmVDb25maWcucmVsYXRpdmVUbywgcmVsYXRpdmVUb09wdGlvbnMpO1xuICBjb25zdCB0aW1lVG9TdWIgPSB7XG4gICAgeWVhcnM6IDAsXG4gICAgbW9udGhzOiAwLFxuICAgIHdlZWtzOiAwLFxuICAgIGRheXM6IDAsXG4gICAgaG91cnM6IDAsXG4gICAgbWludXRlczogMCxcbiAgICBzZWNvbmRzOiAwLFxuICB9O1xuICB0aW1lVG9TdWJbdmFsdWVSYW5nZS50b0xvd2VyQ2FzZSgpXSA9IHZhbHVlVG9TdWJ0cmFjdDtcbiAgY29uc3Qgc3RhcnREYXRlID0gc3ViKGVuZERhdGUsIHRpbWVUb1N1Yik7XG4gIHJldHVybiBbc3RhcnREYXRlLCBlbmREYXRlXTtcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWRhdGUtdGltZS1yZWxhdGl2ZScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGZpZWxkc2V0IGNsYXNzPVwiYngtLWZpZWxkc2V0IGlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fbWVudS1mb3JtZ3JvdXBcIj5cbiAgICAgIDxsZWdlbmQgY2xhc3M9XCJieC0tbGFiZWxcIj57eyBiYXRjaFRleHQuTEFTVCB9fTwvbGVnZW5kPlxuICAgICAgPGRpdiBjbGFzcz1cImlvdC0tZGF0ZS10aW1lLXBpY2tlcl9fZmllbGRzLXdyYXBwZXJcIj5cbiAgICAgICAgPGlibS1udW1iZXJcbiAgICAgICAgICBbbWluXT1cIjBcIlxuICAgICAgICAgIFtzdGVwXT1cIjFcIlxuICAgICAgICAgIFsobmdNb2RlbCldPVwidGltZVRvU3VidHJhY3RcIlxuICAgICAgICAgIChjaGFuZ2UpPVwib25DaGFuZ2UoKVwiXG4gICAgICAgICAgdGhlbWU9XCJsaWdodFwiXG4gICAgICAgID48L2libS1udW1iZXI+XG4gICAgICAgIDxpYm0tc2VsZWN0XG4gICAgICAgICAgY2xhc3M9XCJieC0tZm9ybS1pdGVtXCJcbiAgICAgICAgICBbKG5nTW9kZWwpXT1cInRpbWVSYW5nZVwiXG4gICAgICAgICAgKHZhbHVlQ2hhbmdlKT1cIm9uQ2hhbmdlKClcIlxuICAgICAgICAgIHRoZW1lPVwibGlnaHRcIlxuICAgICAgICA+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIk1JTlVURVNcIj57eyBiYXRjaFRleHQuTUlOVVRFUyB9fTwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJIT1VSU1wiPnt7IGJhdGNoVGV4dC5IT1VSUyB9fTwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJEQVlTXCI+e3sgYmF0Y2hUZXh0LkRBWVMgfX08L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiV0VFS1NcIj57eyBiYXRjaFRleHQuV0VFS1MgfX08L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiTU9OVEhTXCI+e3sgYmF0Y2hUZXh0Lk1PTlRIUyB9fTwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJZRUFSU1wiPnt7IGJhdGNoVGV4dC5ZRUFSUyB9fTwvb3B0aW9uPlxuICAgICAgICA8L2libS1zZWxlY3Q+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICAgIDxmaWVsZHNldCBjbGFzcz1cImJ4LS1maWVsZHNldCBpb3QtLWRhdGUtdGltZS1waWNrZXJfX21lbnUtZm9ybWdyb3VwXCI+XG4gICAgICA8bGVnZW5kIGNsYXNzPVwiYngtLWxhYmVsXCI+e3sgYmF0Y2hUZXh0LlJFTEFUSVZFX1RPIH19PC9sZWdlbmQ+XG4gICAgICA8ZGl2IGNsYXNzPVwiaW90LS1kYXRlLXRpbWUtcGlja2VyX19maWVsZHMtd3JhcHBlclwiPlxuICAgICAgICA8aWJtLXNlbGVjdFxuICAgICAgICAgIGNsYXNzPVwiYngtLWZvcm0taXRlbSBpb3QtLWRhdGUtdGltZS1yZWxhdGl2ZS10b19fc2VsZWN0XCJcbiAgICAgICAgICBbKG5nTW9kZWwpXT1cInJlbGF0aXZlVG9cIlxuICAgICAgICAgICh2YWx1ZUNoYW5nZSk9XCJvbkNoYW5nZSgpXCJcbiAgICAgICAgICB0aGVtZT1cImxpZ2h0XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxvcHRpb25cbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBvcHRpb24gb2YgcmVsYXRpdmVUb09wdGlvbnM7IGxldCBpID0gaW5kZXhcIlxuICAgICAgICAgICAgW3ZhbHVlXT1cIm9wdGlvbi5rZXlcIlxuICAgICAgICAgICAgW3NlbGVjdGVkXT1cImkgPT09IDBcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHt7IG9wdGlvbi5sYWJlbCB9fVxuICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICA8L2libS1zZWxlY3Q+XG4gICAgICAgIDwhLS0gdG1wIHVudGlsIHdlIGNhbiBpbXBsZW1lbnQgYSBiZXR0ZXIgdGltZSBzZWxlY3RvciAtLT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImJ4LS1mb3JtLWl0ZW1cIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGlibVRleHRcbiAgICAgICAgICAgIHR5cGU9XCJ0aW1lXCJcbiAgICAgICAgICAgIFsobmdNb2RlbCldPVwicmVsYXRpdmVUaW1lXCJcbiAgICAgICAgICAgIChjaGFuZ2UpPVwib25DaGFuZ2UoKVwiXG4gICAgICAgICAgICB0aGVtZT1cImxpZ2h0XCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZmllbGRzZXQ+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIC8qIHRtcCBoYWNrIHVudGlsIGNhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXIgaGFzIHRoZSB1cGRhdGVkIG51bWJlciBpbnB1dCAqL1xuICAgICAgOjpuZy1kZWVwIC5ieC0tbnVtYmVyX19pbnB1dC13cmFwcGVyIGlucHV0IHtcbiAgICAgICAgbWluLXdpZHRoOiAwcHggIWltcG9ydGFudDtcbiAgICAgICAgcGFkZGluZy1yaWdodDogMHB4ICFpbXBvcnRhbnQ7XG4gICAgICB9XG4gICAgYCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRGF0ZVRpbWVSZWxhdGl2ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIHZhbHVlOiBhbnlbXSA9IG51bGw7XG4gIEBJbnB1dCgpIGJhdGNoVGV4dDogYW55O1xuICBASW5wdXQoKSByZWxhdGl2ZVRvT3B0aW9uczogUmVsYXRpdmVUb09wdGlvbltdO1xuICBAT3V0cHV0KCkgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxSZWxhdGl2ZURhdGVWYWx1ZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgdGltZVRvU3VidHJhY3QgPSAwO1xuICB0aW1lUmFuZ2UgPSAnTUlOVVRFUyc7XG4gIHJlbGF0aXZlVG8gPSAnWUVTVEVSREFZJztcbiAgcmVsYXRpdmVUaW1lID0gJzAwOjAwJztcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXM/LnZhbHVlPy5jdXJyZW50VmFsdWUpIHtcbiAgICAgIGNvbnN0IFtzdGFydCwgZW5kLCByZWxhdGl2ZUNvbmZpZ10gPSBjaGFuZ2VzLnZhbHVlLmN1cnJlbnRWYWx1ZSBhcyBSZWxhdGl2ZURhdGVWYWx1ZTtcbiAgICAgIGlmICghcmVsYXRpdmVDb25maWcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgW3ZhbHVlLCB2YWx1ZVJhbmdlXSA9IHJlbGF0aXZlQ29uZmlnLmxhc3Q7XG4gICAgICBjb25zdCBbcmVsYXRpdmVUbywgdGltZV0gPSByZWxhdGl2ZUNvbmZpZy5yZWxhdGl2ZVRvO1xuICAgICAgdGhpcy50aW1lUmFuZ2UgPSB2YWx1ZVJhbmdlO1xuICAgICAgdGhpcy50aW1lVG9TdWJ0cmFjdCA9IHZhbHVlO1xuICAgICAgdGhpcy5yZWxhdGl2ZVRvID0gcmVsYXRpdmVUbztcbiAgICAgIHRoaXMucmVsYXRpdmVUaW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZSgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlQ29uZmlnOiBSZWxhdGl2ZVJhbmdlID0ge1xuICAgICAgICBsYXN0OiBbdGhpcy50aW1lVG9TdWJ0cmFjdCwgdGhpcy50aW1lUmFuZ2VdLFxuICAgICAgICByZWxhdGl2ZVRvOiBbdGhpcy5yZWxhdGl2ZVRvLCB0aGlzLnJlbGF0aXZlVGltZV0sXG4gICAgICB9O1xuICAgICAgY29uc3QgZGF0ZXMgPSBnZXRSYW5nZUZyb21SZWxhdGl2ZShyZWxhdGl2ZUNvbmZpZywgdGhpcy5yZWxhdGl2ZVRvT3B0aW9ucyk7XG4gICAgICBjb25zdCByYW5nZTogUmVsYXRpdmVEYXRlVmFsdWUgPSBbLi4uZGF0ZXMsIHJlbGF0aXZlQ29uZmlnXTtcbiAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdChyYW5nZSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==