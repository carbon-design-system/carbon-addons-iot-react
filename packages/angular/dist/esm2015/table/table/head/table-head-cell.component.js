/**
 *
 * @ai-apps/angular v2.155.1 | table-head-cell.component.js
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


import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { TableHeadCell } from 'carbon-components-angular';
import { AITableHeaderItem } from '../table-model.class';
export class AITableHeadCell extends TableHeadCell {
    constructor() {
        super(...arguments);
        this.cssClass = true;
    }
}
AITableHeadCell.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line: component-selector
                selector: '[aiTableHeadCell]',
                template: `
    <ng-container *ngIf="!skeleton">
      <button
        class="bx--table-sort table-header-label iot--table-head--table-header"
        [ngClass]="{
          'table-header-label-start': column.alignment === 'start',
          'table-header-label-center': column.alignment === 'center',
          'table-header-label-end': column.alignment === 'end'
        }"
        *ngIf="this.sort.observers.length > 0 && column.sortable"
        [attr.aria-label]="
          (column.sorted && column.ascending ? getSortDescendingLabel() : getSortAscendingLabel())
            | async
        "
        aria-live="polite"
        [ngClass]="{
          'bx--table-sort--active': column.sorted,
          'bx--table-sort--ascending': column.ascending
        }"
        (click)="onClick()"
      >
        <span
          *ngIf="!column.template"
          class="bx--table-header-label"
          [title]="column.data"
          tabindex="-1"
        >
          <span>
            {{ column.data }}
          </span>
        </span>
        <ng-template
          [ngTemplateOutlet]="column.template"
          [ngTemplateOutletContext]="{ data: column.data }"
        >
        </ng-template>
        <span class="table-head-cell-icons">
          <svg ibmIcon="arrow--down" size="16" class="bx--table-sort__icon"></svg>
          <svg ibmIcon="arrows--vertical" size="16" class="bx--table-sort__icon-unsorted"></svg>
        </span>
      </button>
      <span
        class="bx--table-header-label"
        *ngIf="
          this.sort.observers.length === 0 || (this.sort.observers.length > 0 && !column.sortable)
        "
      >
        <span *ngIf="!column.template" [title]="column.data">{{ column.data }}</span>
        <ng-template
          [ngTemplateOutlet]="column.template"
          [ngTemplateOutletContext]="{ data: column.data }"
        >
        </ng-template>
      </span>
      <button
        [ngClass]="{ active: column.filterCount > 0 }"
        *ngIf="column.filterTemplate"
        type="button"
        aria-expanded="false"
        aria-haspopup="true"
        [ibmTooltip]="column.filterTemplate"
        trigger="click"
        [attr.data-floating-menu-container]="true"
        [title]="getFilterTitle() | async"
        placement="bottom,top"
        [data]="column.filterData"
      >
        <svg ibmIcon="filter" size="16" class="icon--sm"></svg>
        <span *ngIf="column.filterCount > 0">
          {{ column.filterCount }}
        </span>
      </button>
    </ng-container>
    <ng-container *ngIf="skeleton">
      <button class="bx--table-sort">
        <span class="table-head-cell-text" tabindex="-1"></span>
      </button>
    </ng-container>
  `,
                encapsulation: ViewEncapsulation.None
            },] }
];
AITableHeadCell.propDecorators = {
    cssClass: [{ type: HostBinding, args: ['class.iot--table-head-cell',] }],
    column: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGVhZC1jZWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy90YWJsZS9oZWFkL3RhYmxlLWhlYWQtY2VsbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQXNGekQsTUFBTSxPQUFPLGVBQWdCLFNBQVEsYUFBYTtJQXBGbEQ7O1FBcUY2QyxhQUFRLEdBQUcsSUFBSSxDQUFDO0lBRTdELENBQUM7OztZQXZGQSxTQUFTLFNBQUM7Z0JBQ1QsK0NBQStDO2dCQUMvQyxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThFVDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7O3VCQUVFLFdBQVcsU0FBQyw0QkFBNEI7cUJBQ3hDLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRhYmxlSGVhZENlbGwgfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcbmltcG9ydCB7IEFJVGFibGVIZWFkZXJJdGVtIH0gZnJvbSAnLi4vdGFibGUtbW9kZWwuY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdbYWlUYWJsZUhlYWRDZWxsXScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFza2VsZXRvblwiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzcz1cImJ4LS10YWJsZS1zb3J0IHRhYmxlLWhlYWRlci1sYWJlbCBpb3QtLXRhYmxlLWhlYWQtLXRhYmxlLWhlYWRlclwiXG4gICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAndGFibGUtaGVhZGVyLWxhYmVsLXN0YXJ0JzogY29sdW1uLmFsaWdubWVudCA9PT0gJ3N0YXJ0JyxcbiAgICAgICAgICAndGFibGUtaGVhZGVyLWxhYmVsLWNlbnRlcic6IGNvbHVtbi5hbGlnbm1lbnQgPT09ICdjZW50ZXInLFxuICAgICAgICAgICd0YWJsZS1oZWFkZXItbGFiZWwtZW5kJzogY29sdW1uLmFsaWdubWVudCA9PT0gJ2VuZCdcbiAgICAgICAgfVwiXG4gICAgICAgICpuZ0lmPVwidGhpcy5zb3J0Lm9ic2VydmVycy5sZW5ndGggPiAwICYmIGNvbHVtbi5zb3J0YWJsZVwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiXG4gICAgICAgICAgKGNvbHVtbi5zb3J0ZWQgJiYgY29sdW1uLmFzY2VuZGluZyA/IGdldFNvcnREZXNjZW5kaW5nTGFiZWwoKSA6IGdldFNvcnRBc2NlbmRpbmdMYWJlbCgpKVxuICAgICAgICAgICAgfCBhc3luY1xuICAgICAgICBcIlxuICAgICAgICBhcmlhLWxpdmU9XCJwb2xpdGVcIlxuICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgJ2J4LS10YWJsZS1zb3J0LS1hY3RpdmUnOiBjb2x1bW4uc29ydGVkLFxuICAgICAgICAgICdieC0tdGFibGUtc29ydC0tYXNjZW5kaW5nJzogY29sdW1uLmFzY2VuZGluZ1xuICAgICAgICB9XCJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2soKVwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgKm5nSWY9XCIhY29sdW1uLnRlbXBsYXRlXCJcbiAgICAgICAgICBjbGFzcz1cImJ4LS10YWJsZS1oZWFkZXItbGFiZWxcIlxuICAgICAgICAgIFt0aXRsZV09XCJjb2x1bW4uZGF0YVwiXG4gICAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgID5cbiAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIHt7IGNvbHVtbi5kYXRhIH19XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbHVtbi50ZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgZGF0YTogY29sdW1uLmRhdGEgfVwiXG4gICAgICAgID5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0YWJsZS1oZWFkLWNlbGwtaWNvbnNcIj5cbiAgICAgICAgICA8c3ZnIGlibUljb249XCJhcnJvdy0tZG93blwiIHNpemU9XCIxNlwiIGNsYXNzPVwiYngtLXRhYmxlLXNvcnRfX2ljb25cIj48L3N2Zz5cbiAgICAgICAgICA8c3ZnIGlibUljb249XCJhcnJvd3MtLXZlcnRpY2FsXCIgc2l6ZT1cIjE2XCIgY2xhc3M9XCJieC0tdGFibGUtc29ydF9faWNvbi11bnNvcnRlZFwiPjwvc3ZnPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxzcGFuXG4gICAgICAgIGNsYXNzPVwiYngtLXRhYmxlLWhlYWRlci1sYWJlbFwiXG4gICAgICAgICpuZ0lmPVwiXG4gICAgICAgICAgdGhpcy5zb3J0Lm9ic2VydmVycy5sZW5ndGggPT09IDAgfHwgKHRoaXMuc29ydC5vYnNlcnZlcnMubGVuZ3RoID4gMCAmJiAhY29sdW1uLnNvcnRhYmxlKVxuICAgICAgICBcIlxuICAgICAgPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIiFjb2x1bW4udGVtcGxhdGVcIiBbdGl0bGVdPVwiY29sdW1uLmRhdGFcIj57eyBjb2x1bW4uZGF0YSB9fTwvc3Bhbj5cbiAgICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29sdW1uLnRlbXBsYXRlXCJcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBkYXRhOiBjb2x1bW4uZGF0YSB9XCJcbiAgICAgICAgPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPC9zcGFuPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBbbmdDbGFzc109XCJ7IGFjdGl2ZTogY29sdW1uLmZpbHRlckNvdW50ID4gMCB9XCJcbiAgICAgICAgKm5nSWY9XCJjb2x1bW4uZmlsdGVyVGVtcGxhdGVcIlxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgYXJpYS1leHBhbmRlZD1cImZhbHNlXCJcbiAgICAgICAgYXJpYS1oYXNwb3B1cD1cInRydWVcIlxuICAgICAgICBbaWJtVG9vbHRpcF09XCJjb2x1bW4uZmlsdGVyVGVtcGxhdGVcIlxuICAgICAgICB0cmlnZ2VyPVwiY2xpY2tcIlxuICAgICAgICBbYXR0ci5kYXRhLWZsb2F0aW5nLW1lbnUtY29udGFpbmVyXT1cInRydWVcIlxuICAgICAgICBbdGl0bGVdPVwiZ2V0RmlsdGVyVGl0bGUoKSB8IGFzeW5jXCJcbiAgICAgICAgcGxhY2VtZW50PVwiYm90dG9tLHRvcFwiXG4gICAgICAgIFtkYXRhXT1cImNvbHVtbi5maWx0ZXJEYXRhXCJcbiAgICAgID5cbiAgICAgICAgPHN2ZyBpYm1JY29uPVwiZmlsdGVyXCIgc2l6ZT1cIjE2XCIgY2xhc3M9XCJpY29uLS1zbVwiPjwvc3ZnPlxuICAgICAgICA8c3BhbiAqbmdJZj1cImNvbHVtbi5maWx0ZXJDb3VudCA+IDBcIj5cbiAgICAgICAgICB7eyBjb2x1bW4uZmlsdGVyQ291bnQgfX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cInNrZWxldG9uXCI+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiYngtLXRhYmxlLXNvcnRcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0YWJsZS1oZWFkLWNlbGwtdGV4dFwiIHRhYmluZGV4PVwiLTFcIj48L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgQUlUYWJsZUhlYWRDZWxsIGV4dGVuZHMgVGFibGVIZWFkQ2VsbCB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MuaW90LS10YWJsZS1oZWFkLWNlbGwnKSBjc3NDbGFzcyA9IHRydWU7XG4gIEBJbnB1dCgpIGNvbHVtbjogQUlUYWJsZUhlYWRlckl0ZW07XG59XG4iXX0=