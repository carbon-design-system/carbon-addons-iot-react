/**
 *
 * @ai-apps/angular v2.155.1 | sterling-table.component.js
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
import { Table } from 'carbon-components-angular';
/**
 * Sterling specific table component
 *
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-table component
 *
 * Example:
 * ```
 * <sc-table></sc-table>
 * ```
 */
export class SCTableComponent extends Table {
}
SCTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-table',
                template: `
    <table
      ibmTable
      [sortable]="true"
      [size]="size"
      [striped]="striped"
      [skeleton]="skeleton"
      [ngClass]="{ 'bx--data-table--sticky-header': stickyHeader }"
      class="sc-table"
    >
      <thead
        scTableHead
        (deselectAll)="onDeselectAll()"
        (selectAll)="onSelectAll()"
        (sort)="sort.emit($event)"
        [checkboxHeaderLabel]="getCheckboxHeaderLabel()"
        [filterTitle]="getFilterTitle()"
        [model]="model"
        [size]="size"
        [selectAllCheckbox]="selectAllCheckbox"
        [selectAllCheckboxSomeSelected]="selectAllCheckboxSomeSelected"
        [showSelectionColumn]="showSelectionColumn"
        [skeleton]="skeleton"
        [sortAscendingLabel]="sortAscendingLabel"
        [sortDescendingLabel]="sortDescendingLabel"
        [stickyHeader]="stickyHeader"
      ></thead>
      <tbody
        ibmTableBody
        (deselectRow)="onSelectRow($event)"
        (rowClick)="onRowClick($event)"
        (scroll)="onScroll($event)"
        (selectRow)="onSelectRow($event)"
        [checkboxRowLabel]="getCheckboxRowLabel()"
        [enableSingleSelect]="enableSingleSelect"
        [expandButtonAriaLabel]="expandButtonAriaLabel"
        [model]="model"
        [size]="size"
        [ngStyle]="{ 'overflow-y': 'scroll' }"
        [selectionLabelColumn]="selectionLabelColumn"
        [showSelectionColumn]="showSelectionColumn"
        [skeleton]="skeleton"
        *ngIf="!noData; else noDataTemplate"
      ></tbody>
      <ng-template #noDataTemplate><ng-content></ng-content></ng-template>
      <tfoot>
        <ng-template [ngTemplateOutlet]="footerTemplate"> </ng-template>
        <tr *ngIf="this.model.isLoading">
          <td class="table_loading-indicator">
            <div class="bx--loading bx--loading--small">
              <svg class="bx--loading__svg" viewBox="-75 -75 150 150">
                <circle class="bx--loading__stroke" cx="0" cy="0" r="37.5" />
              </svg>
            </div>
          </td>
        </tr>
        <tr *ngIf="this.model.isEnd">
          <td class="table_end-indicator">
            <h5>{{ getEndOfDataText() | async }}</h5>
            <button (click)="scrollToTop($event)" class="btn--secondary-sm">
              {{ getScrollTopText() | async }}
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  `,
                encapsulation: ViewEncapsulation.None,
                styles: [".table-head-cell-icons,.table-head-cell-text{top:0}.bx--data-table--compact .table-head-cell-icons,.bx--data-table--compact .table-head-cell-text{line-height:24px}.bx--data-table--short .table-head-cell-icons,.bx--data-table--short .table-head-cell-text{line-height:32px}.bx--data-table--tall .table-head-cell-icons,.bx--data-table--tall .table-head-cell-text{line-height:64px}.table-head-cell-icons{margin-right:10px;right:0}.bx--table-sort.bx--table-sort--active .bx--table-sort__icon{top:16px}.sc-table .bx--table-header-label,.sc-table .table-head-cell-text{padding-left:16px}.table-row:not(:first-of-type){border-top:2px solid #fff}th:not(:last-of-type){border-right:2px solid #fff}th:not(:last-of-type).table-selection-column{border-right:none}.sc-table.bx--data-table--sort th:first-of-type .bx--table-sort,.sc-table .bx--table-sort{padding-left:0}.sc-table.bx--data-table th:last-of-type{position:inherit}"]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcmxpbmctdGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Rvb2xraXQvdGFibGUvc3RlcmxpbmctdGFibGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0QsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRWxEOzs7Ozs7Ozs7R0FTRztBQXlFSCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsS0FBSzs7O1lBeEUxQyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0VUO2dCQUVELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5cbi8qKlxuICogU3Rlcmxpbmcgc3BlY2lmaWMgdGFibGUgY29tcG9uZW50XG4gKlxuICogKipXYXJuaW5nOioqIFRoaXMgY29tcG9uZW50IHdpbGwgYmUgZGVwcmVjYXRlZCBpbiB0aGUgZnV0dXJlIGluIGZhdm91ciBvZiBhIHNwZWMgY29tcGxpYW50IGFpLXRhYmxlIGNvbXBvbmVudFxuICpcbiAqIEV4YW1wbGU6XG4gKiBgYGBcbiAqIDxzYy10YWJsZT48L3NjLXRhYmxlPlxuICogYGBgXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NjLXRhYmxlJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dGFibGVcbiAgICAgIGlibVRhYmxlXG4gICAgICBbc29ydGFibGVdPVwidHJ1ZVwiXG4gICAgICBbc2l6ZV09XCJzaXplXCJcbiAgICAgIFtzdHJpcGVkXT1cInN0cmlwZWRcIlxuICAgICAgW3NrZWxldG9uXT1cInNrZWxldG9uXCJcbiAgICAgIFtuZ0NsYXNzXT1cInsgJ2J4LS1kYXRhLXRhYmxlLS1zdGlja3ktaGVhZGVyJzogc3RpY2t5SGVhZGVyIH1cIlxuICAgICAgY2xhc3M9XCJzYy10YWJsZVwiXG4gICAgPlxuICAgICAgPHRoZWFkXG4gICAgICAgIHNjVGFibGVIZWFkXG4gICAgICAgIChkZXNlbGVjdEFsbCk9XCJvbkRlc2VsZWN0QWxsKClcIlxuICAgICAgICAoc2VsZWN0QWxsKT1cIm9uU2VsZWN0QWxsKClcIlxuICAgICAgICAoc29ydCk9XCJzb3J0LmVtaXQoJGV2ZW50KVwiXG4gICAgICAgIFtjaGVja2JveEhlYWRlckxhYmVsXT1cImdldENoZWNrYm94SGVhZGVyTGFiZWwoKVwiXG4gICAgICAgIFtmaWx0ZXJUaXRsZV09XCJnZXRGaWx0ZXJUaXRsZSgpXCJcbiAgICAgICAgW21vZGVsXT1cIm1vZGVsXCJcbiAgICAgICAgW3NpemVdPVwic2l6ZVwiXG4gICAgICAgIFtzZWxlY3RBbGxDaGVja2JveF09XCJzZWxlY3RBbGxDaGVja2JveFwiXG4gICAgICAgIFtzZWxlY3RBbGxDaGVja2JveFNvbWVTZWxlY3RlZF09XCJzZWxlY3RBbGxDaGVja2JveFNvbWVTZWxlY3RlZFwiXG4gICAgICAgIFtzaG93U2VsZWN0aW9uQ29sdW1uXT1cInNob3dTZWxlY3Rpb25Db2x1bW5cIlxuICAgICAgICBbc2tlbGV0b25dPVwic2tlbGV0b25cIlxuICAgICAgICBbc29ydEFzY2VuZGluZ0xhYmVsXT1cInNvcnRBc2NlbmRpbmdMYWJlbFwiXG4gICAgICAgIFtzb3J0RGVzY2VuZGluZ0xhYmVsXT1cInNvcnREZXNjZW5kaW5nTGFiZWxcIlxuICAgICAgICBbc3RpY2t5SGVhZGVyXT1cInN0aWNreUhlYWRlclwiXG4gICAgICA+PC90aGVhZD5cbiAgICAgIDx0Ym9keVxuICAgICAgICBpYm1UYWJsZUJvZHlcbiAgICAgICAgKGRlc2VsZWN0Um93KT1cIm9uU2VsZWN0Um93KCRldmVudClcIlxuICAgICAgICAocm93Q2xpY2spPVwib25Sb3dDbGljaygkZXZlbnQpXCJcbiAgICAgICAgKHNjcm9sbCk9XCJvblNjcm9sbCgkZXZlbnQpXCJcbiAgICAgICAgKHNlbGVjdFJvdyk9XCJvblNlbGVjdFJvdygkZXZlbnQpXCJcbiAgICAgICAgW2NoZWNrYm94Um93TGFiZWxdPVwiZ2V0Q2hlY2tib3hSb3dMYWJlbCgpXCJcbiAgICAgICAgW2VuYWJsZVNpbmdsZVNlbGVjdF09XCJlbmFibGVTaW5nbGVTZWxlY3RcIlxuICAgICAgICBbZXhwYW5kQnV0dG9uQXJpYUxhYmVsXT1cImV4cGFuZEJ1dHRvbkFyaWFMYWJlbFwiXG4gICAgICAgIFttb2RlbF09XCJtb2RlbFwiXG4gICAgICAgIFtzaXplXT1cInNpemVcIlxuICAgICAgICBbbmdTdHlsZV09XCJ7ICdvdmVyZmxvdy15JzogJ3Njcm9sbCcgfVwiXG4gICAgICAgIFtzZWxlY3Rpb25MYWJlbENvbHVtbl09XCJzZWxlY3Rpb25MYWJlbENvbHVtblwiXG4gICAgICAgIFtzaG93U2VsZWN0aW9uQ29sdW1uXT1cInNob3dTZWxlY3Rpb25Db2x1bW5cIlxuICAgICAgICBbc2tlbGV0b25dPVwic2tlbGV0b25cIlxuICAgICAgICAqbmdJZj1cIiFub0RhdGE7IGVsc2Ugbm9EYXRhVGVtcGxhdGVcIlxuICAgICAgPjwvdGJvZHk+XG4gICAgICA8bmctdGVtcGxhdGUgI25vRGF0YVRlbXBsYXRlPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L25nLXRlbXBsYXRlPlxuICAgICAgPHRmb290PlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9vdGVyVGVtcGxhdGVcIj4gPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPHRyICpuZ0lmPVwidGhpcy5tb2RlbC5pc0xvYWRpbmdcIj5cbiAgICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZV9sb2FkaW5nLWluZGljYXRvclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ4LS1sb2FkaW5nIGJ4LS1sb2FkaW5nLS1zbWFsbFwiPlxuICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwiYngtLWxvYWRpbmdfX3N2Z1wiIHZpZXdCb3g9XCItNzUgLTc1IDE1MCAxNTBcIj5cbiAgICAgICAgICAgICAgICA8Y2lyY2xlIGNsYXNzPVwiYngtLWxvYWRpbmdfX3N0cm9rZVwiIGN4PVwiMFwiIGN5PVwiMFwiIHI9XCIzNy41XCIgLz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8dHIgKm5nSWY9XCJ0aGlzLm1vZGVsLmlzRW5kXCI+XG4gICAgICAgICAgPHRkIGNsYXNzPVwidGFibGVfZW5kLWluZGljYXRvclwiPlxuICAgICAgICAgICAgPGg1Pnt7IGdldEVuZE9mRGF0YVRleHQoKSB8IGFzeW5jIH19PC9oNT5cbiAgICAgICAgICAgIDxidXR0b24gKGNsaWNrKT1cInNjcm9sbFRvVG9wKCRldmVudClcIiBjbGFzcz1cImJ0bi0tc2Vjb25kYXJ5LXNtXCI+XG4gICAgICAgICAgICAgIHt7IGdldFNjcm9sbFRvcFRleHQoKSB8IGFzeW5jIH19XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgPC90Zm9vdD5cbiAgICA8L3RhYmxlPlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi9zdGVybGluZy10YWJsZS5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIFNDVGFibGVDb21wb25lbnQgZXh0ZW5kcyBUYWJsZSB7fVxuIl19