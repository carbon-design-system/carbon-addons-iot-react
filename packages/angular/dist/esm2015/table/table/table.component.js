/**
 *
 * @ai-apps/angular v2.155.1 | table.component.js
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


import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Table } from 'carbon-components-angular';
/**
 * AI PAL table component
 *
 * Example:
 * ```
 * <ai-table></ai-table>
 * ```
 */
export class AITableComponent extends Table {
}
AITableComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-table',
                template: `
    <table
      ibmTable
      [sortable]="true"
      [size]="size"
      [striped]="striped"
      [skeleton]="skeleton"
      [ngClass]="{ 'bx--data-table--sticky-header': stickyHeader }"
      class="iot-table"
    >
      <thead
        aiTableHead
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
        aiTableBody
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
        *ngIf="model.totalDataLength; else noDataTemplate"
      ></tbody>
      <ng-template #noDataTemplate>
        <tbody>
          <tr class="iot--empty-table--table-row">
            <td colspan="100%">
              <div class="empty-table-cell--default">
                <ng-content></ng-content>
              </div>
            </td>
          </tr>
        </tbody>
      </ng-template>
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
                encapsulation: ViewEncapsulation.None
            },] }
];
AITableComponent.propDecorators = {
    model: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3RhYmxlL3RhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFbEQ7Ozs7Ozs7R0FPRztBQWtGSCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsS0FBSzs7O1lBakYxQyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRFVDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTthQUN0Qzs7O29CQUVFLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcblxuLyoqXG4gKiBBSSBQQUwgdGFibGUgY29tcG9uZW50XG4gKlxuICogRXhhbXBsZTpcbiAqIGBgYFxuICogPGFpLXRhYmxlPjwvYWktdGFibGU+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYWktdGFibGUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDx0YWJsZVxuICAgICAgaWJtVGFibGVcbiAgICAgIFtzb3J0YWJsZV09XCJ0cnVlXCJcbiAgICAgIFtzaXplXT1cInNpemVcIlxuICAgICAgW3N0cmlwZWRdPVwic3RyaXBlZFwiXG4gICAgICBbc2tlbGV0b25dPVwic2tlbGV0b25cIlxuICAgICAgW25nQ2xhc3NdPVwieyAnYngtLWRhdGEtdGFibGUtLXN0aWNreS1oZWFkZXInOiBzdGlja3lIZWFkZXIgfVwiXG4gICAgICBjbGFzcz1cImlvdC10YWJsZVwiXG4gICAgPlxuICAgICAgPHRoZWFkXG4gICAgICAgIGFpVGFibGVIZWFkXG4gICAgICAgIChkZXNlbGVjdEFsbCk9XCJvbkRlc2VsZWN0QWxsKClcIlxuICAgICAgICAoc2VsZWN0QWxsKT1cIm9uU2VsZWN0QWxsKClcIlxuICAgICAgICAoc29ydCk9XCJzb3J0LmVtaXQoJGV2ZW50KVwiXG4gICAgICAgIFtjaGVja2JveEhlYWRlckxhYmVsXT1cImdldENoZWNrYm94SGVhZGVyTGFiZWwoKVwiXG4gICAgICAgIFtmaWx0ZXJUaXRsZV09XCJnZXRGaWx0ZXJUaXRsZSgpXCJcbiAgICAgICAgW21vZGVsXT1cIm1vZGVsXCJcbiAgICAgICAgW3NpemVdPVwic2l6ZVwiXG4gICAgICAgIFtzZWxlY3RBbGxDaGVja2JveF09XCJzZWxlY3RBbGxDaGVja2JveFwiXG4gICAgICAgIFtzZWxlY3RBbGxDaGVja2JveFNvbWVTZWxlY3RlZF09XCJzZWxlY3RBbGxDaGVja2JveFNvbWVTZWxlY3RlZFwiXG4gICAgICAgIFtzaG93U2VsZWN0aW9uQ29sdW1uXT1cInNob3dTZWxlY3Rpb25Db2x1bW5cIlxuICAgICAgICBbc2tlbGV0b25dPVwic2tlbGV0b25cIlxuICAgICAgICBbc29ydEFzY2VuZGluZ0xhYmVsXT1cInNvcnRBc2NlbmRpbmdMYWJlbFwiXG4gICAgICAgIFtzb3J0RGVzY2VuZGluZ0xhYmVsXT1cInNvcnREZXNjZW5kaW5nTGFiZWxcIlxuICAgICAgICBbc3RpY2t5SGVhZGVyXT1cInN0aWNreUhlYWRlclwiXG4gICAgICA+PC90aGVhZD5cbiAgICAgIDx0Ym9keVxuICAgICAgICBhaVRhYmxlQm9keVxuICAgICAgICAoZGVzZWxlY3RSb3cpPVwib25TZWxlY3RSb3coJGV2ZW50KVwiXG4gICAgICAgIChyb3dDbGljayk9XCJvblJvd0NsaWNrKCRldmVudClcIlxuICAgICAgICAoc2Nyb2xsKT1cIm9uU2Nyb2xsKCRldmVudClcIlxuICAgICAgICAoc2VsZWN0Um93KT1cIm9uU2VsZWN0Um93KCRldmVudClcIlxuICAgICAgICBbY2hlY2tib3hSb3dMYWJlbF09XCJnZXRDaGVja2JveFJvd0xhYmVsKClcIlxuICAgICAgICBbZW5hYmxlU2luZ2xlU2VsZWN0XT1cImVuYWJsZVNpbmdsZVNlbGVjdFwiXG4gICAgICAgIFtleHBhbmRCdXR0b25BcmlhTGFiZWxdPVwiZXhwYW5kQnV0dG9uQXJpYUxhYmVsXCJcbiAgICAgICAgW21vZGVsXT1cIm1vZGVsXCJcbiAgICAgICAgW3NpemVdPVwic2l6ZVwiXG4gICAgICAgIFtuZ1N0eWxlXT1cInsgJ292ZXJmbG93LXknOiAnc2Nyb2xsJyB9XCJcbiAgICAgICAgW3NlbGVjdGlvbkxhYmVsQ29sdW1uXT1cInNlbGVjdGlvbkxhYmVsQ29sdW1uXCJcbiAgICAgICAgW3Nob3dTZWxlY3Rpb25Db2x1bW5dPVwic2hvd1NlbGVjdGlvbkNvbHVtblwiXG4gICAgICAgIFtza2VsZXRvbl09XCJza2VsZXRvblwiXG4gICAgICAgICpuZ0lmPVwibW9kZWwudG90YWxEYXRhTGVuZ3RoOyBlbHNlIG5vRGF0YVRlbXBsYXRlXCJcbiAgICAgID48L3Rib2R5PlxuICAgICAgPG5nLXRlbXBsYXRlICNub0RhdGFUZW1wbGF0ZT5cbiAgICAgICAgPHRib2R5PlxuICAgICAgICAgIDx0ciBjbGFzcz1cImlvdC0tZW1wdHktdGFibGUtLXRhYmxlLXJvd1wiPlxuICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIxMDAlXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlbXB0eS10YWJsZS1jZWxsLS1kZWZhdWx0XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgPC90cj5cbiAgICAgICAgPC90Ym9keT5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8dGZvb3Q+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJmb290ZXJUZW1wbGF0ZVwiPiA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8dHIgKm5nSWY9XCJ0aGlzLm1vZGVsLmlzTG9hZGluZ1wiPlxuICAgICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlX2xvYWRpbmctaW5kaWNhdG9yXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYngtLWxvYWRpbmcgYngtLWxvYWRpbmctLXNtYWxsXCI+XG4gICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJieC0tbG9hZGluZ19fc3ZnXCIgdmlld0JveD1cIi03NSAtNzUgMTUwIDE1MFwiPlxuICAgICAgICAgICAgICAgIDxjaXJjbGUgY2xhc3M9XCJieC0tbG9hZGluZ19fc3Ryb2tlXCIgY3g9XCIwXCIgY3k9XCIwXCIgcj1cIjM3LjVcIiAvPlxuICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0ciAqbmdJZj1cInRoaXMubW9kZWwuaXNFbmRcIj5cbiAgICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZV9lbmQtaW5kaWNhdG9yXCI+XG4gICAgICAgICAgICA8aDU+e3sgZ2V0RW5kT2ZEYXRhVGV4dCgpIHwgYXN5bmMgfX08L2g1PlxuICAgICAgICAgICAgPGJ1dHRvbiAoY2xpY2spPVwic2Nyb2xsVG9Ub3AoJGV2ZW50KVwiIGNsYXNzPVwiYnRuLS1zZWNvbmRhcnktc21cIj5cbiAgICAgICAgICAgICAge3sgZ2V0U2Nyb2xsVG9wVGV4dCgpIHwgYXN5bmMgfX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICA8L3Rmb290PlxuICAgIDwvdGFibGU+XG4gIGAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIEFJVGFibGVDb21wb25lbnQgZXh0ZW5kcyBUYWJsZSB7XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7XG59XG4iXX0=