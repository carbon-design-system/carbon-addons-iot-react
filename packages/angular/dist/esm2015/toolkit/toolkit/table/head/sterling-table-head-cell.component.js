/**
 *
 * @ai-apps/angular v2.155.1 | sterling-table-head-cell.component.js
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


import { Component, ViewEncapsulation } from '@angular/core';
import { TableHeadCell } from 'carbon-components-angular';
export class SCTableHeadCell extends TableHeadCell {
}
SCTableHeadCell.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line: component-selector
                selector: '[scTableHeadCell]',
                template: `
    <ng-container *ngIf="!skeleton">
      <button
        class="bx--table-sort"
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
          class="table-head-cell-text"
          [title]="column.data"
          tabindex="-1"
        >
          {{ column.data }}
        </span>
        <ng-template
          [ngTemplateOutlet]="column.template"
          [ngTemplateOutletContext]="{ data: column.data }"
        >
        </ng-template>
        <span class="table-head-cell-icons">
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg"
            class="bx--table-sort__icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M12.3 9.3l-3.8 3.8V1h-1v12.1L3.7 9.3 3 10l5 5 5-5z"></path>
          </svg>
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg"
            class="bx--table-sort__icon-unsorted"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M13.8 10.3L12 12.1V2h-1v10.1l-1.8-1.8-.7.7 3 3 3-3zM4.5 2l-3 3 .7.7L4 3.9V14h1V3.9l1.8 1.8.7-.7z"
            ></path>
          </svg>
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
        [title]="getFilterTitle() | async"
        placement="bottom,top"
        [data]="column.filterData"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon--sm"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M0 0v3l6 8v5h4v-5l6-8V0H0zm9 10.7V15H7v-4.3L1.3 3h13.5L9 10.7z" />
        </svg>
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
                encapsulation: ViewEncapsulation.None,
                styles: [".table-head-cell-icons,.table-head-cell-text{top:0}.bx--data-table--compact .table-head-cell-icons,.bx--data-table--compact .table-head-cell-text{line-height:24px}.bx--data-table--short .table-head-cell-icons,.bx--data-table--short .table-head-cell-text{line-height:32px}.bx--data-table--tall .table-head-cell-icons,.bx--data-table--tall .table-head-cell-text{line-height:64px}.table-head-cell-icons{margin-right:10px;right:0}.bx--table-sort.bx--table-sort--active .bx--table-sort__icon{top:16px}.sc-table .bx--table-header-label,.sc-table .table-head-cell-text{padding-left:16px}"]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcmxpbmctdGFibGUtaGVhZC1jZWxsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy90b29sa2l0L3RhYmxlL2hlYWQvc3RlcmxpbmctdGFibGUtaGVhZC1jZWxsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQWlIMUQsTUFBTSxPQUFPLGVBQWdCLFNBQVEsYUFBYTs7O1lBL0dqRCxTQUFTLFNBQUM7Z0JBQ1QsK0NBQStDO2dCQUMvQyxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0dUO2dCQUVELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRhYmxlSGVhZENlbGwgfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogY29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnW3NjVGFibGVIZWFkQ2VsbF0nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhc2tlbGV0b25cIj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3M9XCJieC0tdGFibGUtc29ydFwiXG4gICAgICAgICpuZ0lmPVwidGhpcy5zb3J0Lm9ic2VydmVycy5sZW5ndGggPiAwICYmIGNvbHVtbi5zb3J0YWJsZVwiXG4gICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiXG4gICAgICAgICAgKGNvbHVtbi5zb3J0ZWQgJiYgY29sdW1uLmFzY2VuZGluZyA/IGdldFNvcnREZXNjZW5kaW5nTGFiZWwoKSA6IGdldFNvcnRBc2NlbmRpbmdMYWJlbCgpKVxuICAgICAgICAgICAgfCBhc3luY1xuICAgICAgICBcIlxuICAgICAgICBhcmlhLWxpdmU9XCJwb2xpdGVcIlxuICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgJ2J4LS10YWJsZS1zb3J0LS1hY3RpdmUnOiBjb2x1bW4uc29ydGVkLFxuICAgICAgICAgICdieC0tdGFibGUtc29ydC0tYXNjZW5kaW5nJzogY29sdW1uLmFzY2VuZGluZ1xuICAgICAgICB9XCJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2soKVwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgKm5nSWY9XCIhY29sdW1uLnRlbXBsYXRlXCJcbiAgICAgICAgICBjbGFzcz1cInRhYmxlLWhlYWQtY2VsbC10ZXh0XCJcbiAgICAgICAgICBbdGl0bGVdPVwiY29sdW1uLmRhdGFcIlxuICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICA+XG4gICAgICAgICAge3sgY29sdW1uLmRhdGEgfX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJjb2x1bW4udGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IGRhdGE6IGNvbHVtbi5kYXRhIH1cIlxuICAgICAgICA+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwidGFibGUtaGVhZC1jZWxsLWljb25zXCI+XG4gICAgICAgICAgPHN2Z1xuICAgICAgICAgICAgZm9jdXNhYmxlPVwiZmFsc2VcIlxuICAgICAgICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz1cInhNaWRZTWlkIG1lZXRcIlxuICAgICAgICAgICAgc3R5bGU9XCJ3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1wiXG4gICAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYngtLXRhYmxlLXNvcnRfX2ljb25cIlxuICAgICAgICAgICAgd2lkdGg9XCIxNlwiXG4gICAgICAgICAgICBoZWlnaHQ9XCIxNlwiXG4gICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDE2IDE2XCJcbiAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0xMi4zIDkuM2wtMy44IDMuOFYxaC0xdjEyLjFMMy43IDkuMyAzIDEwbDUgNSA1LTV6XCI+PC9wYXRoPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgIGZvY3VzYWJsZT1cImZhbHNlXCJcbiAgICAgICAgICAgIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZCBtZWV0XCJcbiAgICAgICAgICAgIHN0eWxlPVwid2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcIlxuICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICBjbGFzcz1cImJ4LS10YWJsZS1zb3J0X19pY29uLXVuc29ydGVkXCJcbiAgICAgICAgICAgIHdpZHRoPVwiMTZcIlxuICAgICAgICAgICAgaGVpZ2h0PVwiMTZcIlxuICAgICAgICAgICAgdmlld0JveD1cIjAgMCAxNiAxNlwiXG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgIGQ9XCJNMTMuOCAxMC4zTDEyIDEyLjFWMmgtMXYxMC4xbC0xLjgtMS44LS43LjcgMyAzIDMtM3pNNC41IDJsLTMgMyAuNy43TDQgMy45VjE0aDFWMy45bDEuOCAxLjguNy0uN3pcIlxuICAgICAgICAgICAgPjwvcGF0aD5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8c3BhblxuICAgICAgICBjbGFzcz1cImJ4LS10YWJsZS1oZWFkZXItbGFiZWxcIlxuICAgICAgICAqbmdJZj1cIlxuICAgICAgICAgIHRoaXMuc29ydC5vYnNlcnZlcnMubGVuZ3RoID09PSAwIHx8ICh0aGlzLnNvcnQub2JzZXJ2ZXJzLmxlbmd0aCA+IDAgJiYgIWNvbHVtbi5zb3J0YWJsZSlcbiAgICAgICAgXCJcbiAgICAgID5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCIhY29sdW1uLnRlbXBsYXRlXCIgW3RpdGxlXT1cImNvbHVtbi5kYXRhXCI+e3sgY29sdW1uLmRhdGEgfX08L3NwYW4+XG4gICAgICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbHVtbi50ZW1wbGF0ZVwiXG4gICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgZGF0YTogY29sdW1uLmRhdGEgfVwiXG4gICAgICAgID5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgW25nQ2xhc3NdPVwieyBhY3RpdmU6IGNvbHVtbi5maWx0ZXJDb3VudCA+IDAgfVwiXG4gICAgICAgICpuZ0lmPVwiY29sdW1uLmZpbHRlclRlbXBsYXRlXCJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXG4gICAgICAgIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCJcbiAgICAgICAgW2libVRvb2x0aXBdPVwiY29sdW1uLmZpbHRlclRlbXBsYXRlXCJcbiAgICAgICAgdHJpZ2dlcj1cImNsaWNrXCJcbiAgICAgICAgW3RpdGxlXT1cImdldEZpbHRlclRpdGxlKCkgfCBhc3luY1wiXG4gICAgICAgIHBsYWNlbWVudD1cImJvdHRvbSx0b3BcIlxuICAgICAgICBbZGF0YV09XCJjb2x1bW4uZmlsdGVyRGF0YVwiXG4gICAgICA+XG4gICAgICAgIDxzdmdcbiAgICAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICAgICBjbGFzcz1cImljb24tLXNtXCJcbiAgICAgICAgICB3aWR0aD1cIjE2XCJcbiAgICAgICAgICBoZWlnaHQ9XCIxNlwiXG4gICAgICAgICAgdmlld0JveD1cIjAgMCAxNiAxNlwiXG4gICAgICAgID5cbiAgICAgICAgICA8cGF0aCBkPVwiTTAgMHYzbDYgOHY1aDR2LTVsNi04VjBIMHptOSAxMC43VjE1SDd2LTQuM0wxLjMgM2gxMy41TDkgMTAuN3pcIiAvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCJjb2x1bW4uZmlsdGVyQ291bnQgPiAwXCI+XG4gICAgICAgICAge3sgY29sdW1uLmZpbHRlckNvdW50IH19XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJza2VsZXRvblwiPlxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ4LS10YWJsZS1zb3J0XCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwidGFibGUtaGVhZC1jZWxsLXRleHRcIiB0YWJpbmRleD1cIi0xXCI+PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL3N0ZXJsaW5nLXRhYmxlLWhlYWQtY2VsbC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIFNDVGFibGVIZWFkQ2VsbCBleHRlbmRzIFRhYmxlSGVhZENlbGwge31cbiJdfQ==