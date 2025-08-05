/**
 *
 * @ai-apps/angular v2.155.1 | custom-date-time.component.js
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


import { Component, EventEmitter, HostBinding, Input, Output, } from '@angular/core';
export class CustomDateTimeComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWRhdGUtdGltZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZS10aW1lLXBpY2tlci9jdXN0b20tZGF0ZS10aW1lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFlBQVksRUFDWixXQUFXLEVBQ1gsS0FBSyxFQUVMLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQWlEdkIsTUFBTSxPQUFPLHVCQUF1QjtJQXpDcEM7UUEwQ0UsU0FBSSxHQUE0QixVQUFVLENBQUM7UUFDM0MsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNGLFVBQUssR0FBc0IsSUFBSSxDQUFDO1FBQ2hDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBRTVCOzs7O1dBSUc7UUFDTSxlQUFVLEdBQUcsWUFBWSxDQUFDO1FBQzFCLHFCQUFnQixHQUFHLE9BQU8sQ0FBQztRQUMzQixnQkFBVyxHQUFHLFlBQVksQ0FBQztRQUcxQixnQkFBVyxHQUFvQyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWhCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO0lBK0JsRixDQUFDO0lBN0JDLFdBQVcsQ0FBQyxPQUFzQjs7UUFDaEMsVUFBSSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsS0FBSywwQ0FBRSxZQUFZLEVBQUU7WUFDaEMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO1lBQ3RFLElBQUksSUFBSSxLQUFLLFVBQVUsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQzNDO1lBQ0QsSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFO2dCQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzthQUMzQjtTQUNGO1FBRUQsSUFBSSxPQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxXQUFXLDBDQUFFLFlBQVksTUFBSyxLQUFLLEVBQUU7WUFDaEQsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7U0FDeEI7UUFFRCxJQUFJLE9BQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLFdBQVcsMENBQUUsWUFBWSxNQUFLLEtBQUssRUFBRTtZQUNoRCxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFRCxjQUFjLENBQUMsTUFBbUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxjQUFjLENBQUMsTUFBaUI7UUFDOUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7OztZQTFGRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4QlQ7eUJBRUM7Ozs7S0FJQzthQUVKOzs7b0JBSUUsS0FBSzswQkFDTCxLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFNTCxLQUFLOytCQUNMLEtBQUs7MEJBQ0wsS0FBSztnQ0FDTCxLQUFLOytCQUNMLEtBQUs7MEJBQ0wsTUFBTTsyQkFFTixXQUFXLFNBQUMsNkNBQTZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RCaW5kaW5nLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgRGF0ZVJhbmdlLFxuICBEYXRlVGltZVNlbGVjdGlvbixcbiAgUmVsYXRpdmVSYW5nZSxcbiAgUmVsYXRpdmVUb09wdGlvbixcbn0gZnJvbSAnLi9kYXRlLXRpbWUtcGlja2VyLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWN1c3RvbS1kYXRlLXRpbWUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJieC0tZm9ybS1pdGVtXCIgKm5nSWY9XCJoYXNSZWxhdGl2ZSAmJiBoYXNBYnNvbHV0ZVwiPlxuICAgICAgPGZpZWxkc2V0IGNsYXNzPVwiYngtLWZpZWxkc2V0XCI+XG4gICAgICAgIDxsZWdlbmQgY2xhc3M9XCJieC0tbGFiZWxcIj57eyBiYXRjaFRleHQuQ1VTVE9NX1JBTkdFIH19PC9sZWdlbmQ+XG4gICAgICAgIDxpYm0tcmFkaW8tZ3JvdXAgWyhuZ01vZGVsKV09XCJtb2RlXCI+XG4gICAgICAgICAgPGlibS1yYWRpbyB2YWx1ZT1cInJlbGF0aXZlXCI+e3sgYmF0Y2hUZXh0LlJFTEFUSVZFIH19PC9pYm0tcmFkaW8+XG4gICAgICAgICAgPGlibS1yYWRpbyB2YWx1ZT1cImFic29sdXRlXCI+e3sgYmF0Y2hUZXh0LkFCU09MVVRFIH19PC9pYm0tcmFkaW8+XG4gICAgICAgIDwvaWJtLXJhZGlvLWdyb3VwPlxuICAgICAgPC9maWVsZHNldD5cbiAgICA8L2Rpdj5cbiAgICA8IS0tIHJlbGF0aXZlIHBpY2tlciAtLT5cbiAgICA8YWktZGF0ZS10aW1lLXJlbGF0aXZlXG4gICAgICAqbmdJZj1cIm1vZGUgPT09ICdyZWxhdGl2ZScgJiYgaGFzUmVsYXRpdmVcIlxuICAgICAgKHZhbHVlQ2hhbmdlKT1cInJlbGF0aXZlQ2hhbmdlKCRldmVudClcIlxuICAgICAgW3ZhbHVlXT1cInZhbHVlXCJcbiAgICAgIFtiYXRjaFRleHRdPVwiYmF0Y2hUZXh0XCJcbiAgICAgIFtyZWxhdGl2ZVRvT3B0aW9uc109XCJyZWxhdGl2ZVRvT3B0aW9uc1wiXG4gICAgPlxuICAgIDwvYWktZGF0ZS10aW1lLXJlbGF0aXZlPlxuICAgIDxhaS1kYXRlLXRpbWUtYWJzb2x1dGVcbiAgICAgICpuZ0lmPVwibW9kZSA9PT0gJ2Fic29sdXRlJyAmJiBoYXNBYnNvbHV0ZVwiXG4gICAgICAodmFsdWVDaGFuZ2UpPVwiYWJzb2x1dGVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICBbdmFsdWVdPVwidmFsdWVcIlxuICAgICAgW2JhdGNoVGV4dF09XCJiYXRjaFRleHRcIlxuICAgICAgW2RhdGVGb3JtYXRdPVwiZGF0ZUZvcm1hdFwiXG4gICAgICBbZGF0ZVBpY2tlckZvcm1hdF09XCJkYXRlUGlja2VyRm9ybWF0XCJcbiAgICAgIFtwbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclwiXG4gICAgICBbZmxhdHBpY2tyT3B0aW9uc109XCJmbGF0cGlja3JPcHRpb25zXCJcbiAgICA+XG4gICAgPC9haS1kYXRlLXRpbWUtYWJzb2x1dGU+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIDpob3N0IHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICB9XG4gICAgYCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGF0ZVRpbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBtb2RlOiAncmVsYXRpdmUnIHwgJ2Fic29sdXRlJyA9ICdyZWxhdGl2ZSc7XG4gIHZhbHVlID0gW107XG4gIEBJbnB1dCgpIHJhbmdlOiBEYXRlVGltZVNlbGVjdGlvbiA9IG51bGw7XG4gIEBJbnB1dCgpIGhhc1JlbGF0aXZlID0gdHJ1ZTtcbiAgQElucHV0KCkgaGFzQWJzb2x1dGUgPSB0cnVlO1xuICBASW5wdXQoKSBiYXRjaFRleHQ6IGFueTtcbiAgLyoqXG4gICAqIEZvcm1hdCBvZiBkYXRlXG4gICAqXG4gICAqIEZvciByZWZlcmVuY2U6IGh0dHBzOi8vZmxhdHBpY2tyLmpzLm9yZy9mb3JtYXR0aW5nL1xuICAgKi9cbiAgQElucHV0KCkgZGF0ZUZvcm1hdCA9ICd5eXl5LU1NLWRkJztcbiAgQElucHV0KCkgZGF0ZVBpY2tlckZvcm1hdCA9ICdZLW0tZCc7XG4gIEBJbnB1dCgpIHBsYWNlaG9sZGVyID0gJ3l5eXktbW0tZGQnO1xuICBASW5wdXQoKSByZWxhdGl2ZVRvT3B0aW9uczogUmVsYXRpdmVUb09wdGlvbltdO1xuICBASW5wdXQoKSBmbGF0cGlja3JPcHRpb25zO1xuICBAT3V0cHV0KCkgcmFuZ2VDaGFuZ2U6IEV2ZW50RW1pdHRlcjxEYXRlVGltZVNlbGVjdGlvbj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWRhdGUtdGltZS1waWNrZXJfX2N1c3RvbS13cmFwcGVyJykgd3JhcHBlckNsYXNzID0gdHJ1ZTtcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXM/LnJhbmdlPy5jdXJyZW50VmFsdWUpIHtcbiAgICAgIGNvbnN0IFt0eXBlLCBzdGFydCwgZW5kLCByZWxhdGl2ZUNvbmZpZ10gPSBjaGFuZ2VzLnJhbmdlLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGlmICh0eXBlID09PSAnUkVMQVRJVkUnKSB7XG4gICAgICAgIHRoaXMubW9kZSA9ICdyZWxhdGl2ZSc7XG4gICAgICAgIHRoaXMudmFsdWUgPSBbc3RhcnQsIGVuZCwgcmVsYXRpdmVDb25maWddO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICdBQlNPTFVURScpIHtcbiAgICAgICAgdGhpcy5tb2RlID0gJ2Fic29sdXRlJztcbiAgICAgICAgdGhpcy52YWx1ZSA9IFtzdGFydCwgZW5kXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcz8uaGFzUmVsYXRpdmU/LmN1cnJlbnRWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMubW9kZSA9ICdhYnNvbHV0ZSc7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXM/Lmhhc0Fic29sdXRlPy5jdXJyZW50VmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLm1vZGUgPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgfVxuXG4gIHJlbGF0aXZlQ2hhbmdlKGNoYW5nZTogW0RhdGUsIERhdGUsIFJlbGF0aXZlUmFuZ2VdKSB7XG4gICAgdGhpcy5yYW5nZUNoYW5nZS5lbWl0KFsnUkVMQVRJVkUnLCAuLi5jaGFuZ2VdKTtcbiAgfVxuXG4gIGFic29sdXRlQ2hhbmdlKGNoYW5nZTogRGF0ZVJhbmdlKSB7XG4gICAgdGhpcy5yYW5nZUNoYW5nZS5lbWl0KFsnQUJTT0xVVEUnLCAuLi5jaGFuZ2VdKTtcbiAgfVxufVxuIl19