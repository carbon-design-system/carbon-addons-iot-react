/**
 *
 * @ai-apps/angular v2.155.1 | card-date-range.component.js
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
export class CardDateRangeComponent {
    constructor() {
        this.wrapperClass = true;
        /**
         * List of date/time ranges to display in the overflow menu.
         *
         * Uses a modified `ListItem` array. `id` keys **must** be provided.
         *
         * If a null is passed to the ngModel or `value` Input the item with
         * the `id` of `"default"` will be selected.
         */
        this.ranges = [
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
        this.value = 'default';
        /**
         * Emits the id of the currently selected range item
         */
        this.valueChange = new EventEmitter();
        /**
         * Contains the content of the currently selected range item
         */
        this.selectedRangeContent = this.getSelectedRange().content;
        this.onChange = (obj) => { };
        this.onTouched = () => { };
    }
    ngOnChanges(changes) {
        if (changes.value) {
            this.selectRange(changes.value.currentValue);
        }
    }
    onRangeSelected(range) {
        this.selectRange(range);
        this.onChange(range);
        this.valueChange.emit(range);
    }
    writeValue(rangeId) {
        this.selectRange(rangeId);
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Updates the `ranges` list to only select the provided id.
     *
     * Also updates `selectedRangeContent`
     *
     * falsy/null values will select the `default` option
     *
     * @param rangeId id of the range item to select
     */
    selectRange(rangeId) {
        if (!rangeId) {
            rangeId = 'default';
        }
        this.ranges = this.ranges.map((range) => {
            if (range.id === rangeId) {
                range.selected = true;
            }
            else {
                range.selected = false;
            }
            return range;
        });
        this.selectedRangeContent = this.getSelectedRange().content;
    }
    getSelectedRange() {
        return this.ranges.find((range) => range.selected);
    }
}
CardDateRangeComponent.decorators = [
    { type: Component, args: [{
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
  `
            },] }
];
CardDateRangeComponent.propDecorators = {
    wrapperClass: [{ type: HostBinding, args: ['class.iot--card--toolbar-date-range-wrapper',] }],
    ranges: [{ type: Input }],
    value: [{ type: Input }],
    valueChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1kYXRlLXJhbmdlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jYXJkL2NhcmQtZGF0ZS1yYW5nZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osV0FBVyxFQUNYLEtBQUssRUFFTCxNQUFNLEdBRVAsTUFBTSxlQUFlLENBQUM7QUFrQnZCLE1BQU0sT0FBTyxzQkFBc0I7SUFkbkM7UUFlOEQsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFFaEY7Ozs7Ozs7V0FPRztRQUNNLFdBQU0sR0FBZTtZQUM1QjtnQkFDRSxFQUFFLEVBQUUsU0FBUztnQkFDYixPQUFPLEVBQUUsU0FBUztnQkFDbEIsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxlQUFlO2dCQUNuQixPQUFPLEVBQUUsZUFBZTtnQkFDeEIsUUFBUSxFQUFFLEtBQUs7YUFDaEI7WUFDRDtnQkFDRSxFQUFFLEVBQUUsYUFBYTtnQkFDakIsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLFFBQVEsRUFBRSxLQUFLO2FBQ2hCO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLFlBQVk7Z0JBQ2hCLE9BQU8sRUFBRSxZQUFZO2dCQUNyQixRQUFRLEVBQUUsS0FBSzthQUNoQjtZQUNEO2dCQUNFLEVBQUUsRUFBRSxjQUFjO2dCQUNsQixPQUFPLEVBQUUsY0FBYztnQkFDdkIsUUFBUSxFQUFFLEtBQUs7YUFDaEI7WUFDRDtnQkFDRSxFQUFFLEVBQUUsV0FBVztnQkFDZixPQUFPLEVBQUUsV0FBVztnQkFDcEIsUUFBUSxFQUFFLEtBQUs7YUFDaEI7WUFDRDtnQkFDRSxFQUFFLEVBQUUsV0FBVztnQkFDZixPQUFPLEVBQUUsV0FBVztnQkFDcEIsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsT0FBTyxFQUFFLElBQUk7YUFDZDtZQUNEO2dCQUNFLEVBQUUsRUFBRSxZQUFZO2dCQUNoQixPQUFPLEVBQUUsWUFBWTtnQkFDckIsUUFBUSxFQUFFLEtBQUs7YUFDaEI7WUFDRDtnQkFDRSxFQUFFLEVBQUUsY0FBYztnQkFDbEIsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLFFBQVEsRUFBRSxLQUFLO2FBQ2hCO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLFdBQVc7Z0JBQ2YsT0FBTyxFQUFFLFdBQVc7Z0JBQ3BCLFFBQVEsRUFBRSxLQUFLO2FBQ2hCO1NBQ0YsQ0FBQztRQUVGOztXQUVHO1FBQ00sVUFBSyxHQUFHLFNBQVMsQ0FBQztRQUUzQjs7V0FFRztRQUNPLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUVuRDs7V0FFRztRQUNJLHlCQUFvQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE9BQU8sQ0FBQztRQTBCcEQsYUFBUSxHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUUsR0FBRSxDQUFDLENBQUM7UUFDNUIsY0FBUyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQTZCakMsQ0FBQztJQXREQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFRCxlQUFlLENBQUMsS0FBYTtRQUMzQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELFVBQVUsQ0FBQyxPQUFlO1FBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELGdCQUFnQixDQUFDLEVBQU87UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQU87UUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUtEOzs7Ozs7OztPQVFHO0lBQ08sV0FBVyxDQUFDLE9BQWU7UUFDbkMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sR0FBRyxTQUFTLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDdEMsSUFBSSxLQUFLLENBQUMsRUFBRSxLQUFLLE9BQU8sRUFBRTtnQkFDeEIsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDdkI7aUJBQU07Z0JBQ0wsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7YUFDeEI7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUM5RCxDQUFDO0lBRVMsZ0JBQWdCO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyRCxDQUFDOzs7WUFuSkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFFBQVEsRUFBRTs7Ozs7Ozs7OztHQVVUO2FBQ0Y7OzsyQkFFRSxXQUFXLFNBQUMsNkNBQTZDO3FCQVV6RCxLQUFLO29CQXlETCxLQUFLOzBCQUtMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdEJpbmRpbmcsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IExpc3RJdGVtIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FpLWNhcmQtZGF0ZS1yYW5nZScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImlvdC0tY2FyZC0tdG9vbGJhci10aW1lcmFuZ2UtbGFiZWxcIj57eyBzZWxlY3RlZFJhbmdlQ29udGVudCB9fTwvZGl2PlxuICAgIDxpYm0tb3ZlcmZsb3ctbWVudSBhaUNhcmRUb29sYmFyQWN0aW9uIFtjdXN0b21UcmlnZ2VyXT1cInRyaWdnZXJJY29uXCI+XG4gICAgICA8aWJtLW92ZXJmbG93LW1lbnUtb3B0aW9uICpuZ0Zvcj1cImxldCByYW5nZSBvZiByYW5nZXNcIiAoc2VsZWN0ZWQpPVwib25SYW5nZVNlbGVjdGVkKHJhbmdlLmlkKVwiPlxuICAgICAgICB7eyByYW5nZS5jb250ZW50IH19XG4gICAgICA8L2libS1vdmVyZmxvdy1tZW51LW9wdGlvbj5cbiAgICA8L2libS1vdmVyZmxvdy1tZW51PlxuICAgIDxuZy10ZW1wbGF0ZSAjdHJpZ2dlckljb24+XG4gICAgICA8c3ZnIGlibUljb249XCJjYWxlbmRhclwiIHNpemU9XCIxNlwiPjwvc3ZnPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIENhcmREYXRlUmFuZ2VDb21wb25lbnQgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25DaGFuZ2VzIHtcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5pb3QtLWNhcmQtLXRvb2xiYXItZGF0ZS1yYW5nZS13cmFwcGVyJykgd3JhcHBlckNsYXNzID0gdHJ1ZTtcblxuICAvKipcbiAgICogTGlzdCBvZiBkYXRlL3RpbWUgcmFuZ2VzIHRvIGRpc3BsYXkgaW4gdGhlIG92ZXJmbG93IG1lbnUuXG4gICAqXG4gICAqIFVzZXMgYSBtb2RpZmllZCBgTGlzdEl0ZW1gIGFycmF5LiBgaWRgIGtleXMgKiptdXN0KiogYmUgcHJvdmlkZWQuXG4gICAqXG4gICAqIElmIGEgbnVsbCBpcyBwYXNzZWQgdG8gdGhlIG5nTW9kZWwgb3IgYHZhbHVlYCBJbnB1dCB0aGUgaXRlbSB3aXRoXG4gICAqIHRoZSBgaWRgIG9mIGBcImRlZmF1bHRcImAgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIEBJbnB1dCgpIHJhbmdlczogTGlzdEl0ZW1bXSA9IFtcbiAgICB7XG4gICAgICBpZDogJ2RlZmF1bHQnLFxuICAgICAgY29udGVudDogJ0RlZmF1bHQnLFxuICAgICAgc2VsZWN0ZWQ6IHRydWUsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ2xhc3QtMjQtaG91cnMnLFxuICAgICAgY29udGVudDogJ0xhc3QgMjQgaG91cnMnLFxuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdsYXN0LTctZGF5cycsXG4gICAgICBjb250ZW50OiAnTGFzdCA3IGRheXMnLFxuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdsYXN0LW1vbnRoJyxcbiAgICAgIGNvbnRlbnQ6ICdMYXN0IG1vbnRoJyxcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAnbGFzdC1xdWFydGVyJyxcbiAgICAgIGNvbnRlbnQ6ICdMYXN0IHF1YXJ0ZXInLFxuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICdsYXN0LXllYXInLFxuICAgICAgY29udGVudDogJ0xhc3QgeWVhcicsXG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3RoaXMtd2VlaycsXG4gICAgICBjb250ZW50OiAnVGhpcyB3ZWVrJyxcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgIGRpdmlkZXI6IHRydWUsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3RoaXMtbW9udGgnLFxuICAgICAgY29udGVudDogJ1RoaXMgbW9udGgnLFxuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6ICd0aGlzLXF1YXJ0ZXInLFxuICAgICAgY29udGVudDogJ1RoaXMgcXVhcnRlcicsXG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICBpZDogJ3RoaXMteWVhcicsXG4gICAgICBjb250ZW50OiAnVGhpcyB5ZWFyJyxcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICB9LFxuICBdO1xuXG4gIC8qKlxuICAgKiBTZXQgdG8gdGhlIGlkIG9mIGEgcmFuZ2UgaXRlbSB0byBzZWxlY3QgaXRcbiAgICovXG4gIEBJbnB1dCgpIHZhbHVlID0gJ2RlZmF1bHQnO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgaWQgb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCByYW5nZSBpdGVtXG4gICAqL1xuICBAT3V0cHV0KCkgdmFsdWVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAvKipcbiAgICogQ29udGFpbnMgdGhlIGNvbnRlbnQgb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCByYW5nZSBpdGVtXG4gICAqL1xuICBwdWJsaWMgc2VsZWN0ZWRSYW5nZUNvbnRlbnQgPSB0aGlzLmdldFNlbGVjdGVkUmFuZ2UoKS5jb250ZW50O1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy52YWx1ZSkge1xuICAgICAgdGhpcy5zZWxlY3RSYW5nZShjaGFuZ2VzLnZhbHVlLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgb25SYW5nZVNlbGVjdGVkKHJhbmdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNlbGVjdFJhbmdlKHJhbmdlKTtcbiAgICB0aGlzLm9uQ2hhbmdlKHJhbmdlKTtcbiAgICB0aGlzLnZhbHVlQ2hhbmdlLmVtaXQocmFuZ2UpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZShyYW5nZUlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdFJhbmdlKHJhbmdlSWQpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBwcm90ZWN0ZWQgb25DaGFuZ2UgPSAob2JqOiBhbnkpID0+IHt9O1xuICBwcm90ZWN0ZWQgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGByYW5nZXNgIGxpc3QgdG8gb25seSBzZWxlY3QgdGhlIHByb3ZpZGVkIGlkLlxuICAgKlxuICAgKiBBbHNvIHVwZGF0ZXMgYHNlbGVjdGVkUmFuZ2VDb250ZW50YFxuICAgKlxuICAgKiBmYWxzeS9udWxsIHZhbHVlcyB3aWxsIHNlbGVjdCB0aGUgYGRlZmF1bHRgIG9wdGlvblxuICAgKlxuICAgKiBAcGFyYW0gcmFuZ2VJZCBpZCBvZiB0aGUgcmFuZ2UgaXRlbSB0byBzZWxlY3RcbiAgICovXG4gIHByb3RlY3RlZCBzZWxlY3RSYW5nZShyYW5nZUlkOiBzdHJpbmcpIHtcbiAgICBpZiAoIXJhbmdlSWQpIHtcbiAgICAgIHJhbmdlSWQgPSAnZGVmYXVsdCc7XG4gICAgfVxuICAgIHRoaXMucmFuZ2VzID0gdGhpcy5yYW5nZXMubWFwKChyYW5nZSkgPT4ge1xuICAgICAgaWYgKHJhbmdlLmlkID09PSByYW5nZUlkKSB7XG4gICAgICAgIHJhbmdlLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJhbmdlLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmFuZ2U7XG4gICAgfSk7XG4gICAgdGhpcy5zZWxlY3RlZFJhbmdlQ29udGVudCA9IHRoaXMuZ2V0U2VsZWN0ZWRSYW5nZSgpLmNvbnRlbnQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0U2VsZWN0ZWRSYW5nZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yYW5nZXMuZmluZCgocmFuZ2UpID0+IHJhbmdlLnNlbGVjdGVkKTtcbiAgfVxufVxuIl19