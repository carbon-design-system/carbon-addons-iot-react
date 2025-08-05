/**
 *
 * @ai-apps/angular v2.155.1 | sterling-table-head.component.js
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
import { TableHead } from 'carbon-components-angular';
/**
 * A subcomponent that creates the thead of the table
 *
 * Example
 *
 * ```html
 * 	<thead scTableHead [model]="model"></thead>
 * ```
 */
export class SCTableHeadComponent extends TableHead {
}
SCTableHeadComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: '[scTableHead]',
                template: `
    <ng-container *ngIf="model">
      <tr *ngFor="let headerRow of model.header; let rowIndex = index" class="table-row">
        <th ibmTableHeadExpand *ngIf="model.hasExpandableRows()" [id]="model.getId('expand')"></th>
        <th
          ibmTableHeadCheckbox
          *ngIf="!skeleton && showSelectionColumn && rowIndex === 0"
          class="table-selection-column"
          [checked]="selectAllCheckbox"
          [indeterminate]="selectAllCheckboxSomeSelected"
          [ariaLabel]="getCheckboxHeaderLabel()"
          [size]="size"
          [skeleton]="skeleton"
          [attr.rowspan]="model.header.length"
          [id]="model.getId('select')"
          (change)="onSelectAllCheckboxChange()"
        ></th>

        <ng-container *ngFor="let column of headerRow; let i = index">
          <th
            scTableHeadCell
            *ngIf="column && column.visible"
            [id]="model.getId(i, rowIndex)"
            [headers]="rowIndex > 0 ? model.getHeaderId(i, column.colSpan) : ''"
            [column]="column"
            [attr.colspan]="column.colSpan"
            [attr.rowspan]="column.rowSpan"
            [filterTitle]="getFilterTitle()"
            (sort)="sort.emit(i)"
            [class]="column.className"
            [skeleton]="skeleton"
            [ngStyle]="column.style"
          ></th>
        </ng-container>
        <th
          *ngIf="!skeleton && stickyHeader"
          [ngStyle]="{ width: scrollbarWidth + 'px', padding: 0, border: 0 }"
        >
          <!--
					Scrollbar pushes body to the left so this header column is added to push
					the title bar the same amount and keep the header and body columns aligned.
				--></th>
      </tr>
    </ng-container>
    <ng-content></ng-content>
  `,
                encapsulation: ViewEncapsulation.None,
                styles: [".table-row:not(:first-of-type){border-top:2px solid #fff}th:not(:last-of-type){border-right:2px solid #fff}th:not(:last-of-type).table-selection-column{border-right:none}.sc-table.bx--data-table--sort th:first-of-type .bx--table-sort,.sc-table .bx--table-sort{padding-left:0}.sc-table.bx--data-table th:last-of-type{position:inherit}"]
            },] }
];
SCTableHeadComponent.propDecorators = {
    model: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcmxpbmctdGFibGUtaGVhZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvdG9vbGtpdC90YWJsZS9oZWFkL3N0ZXJsaW5nLXRhYmxlLWhlYWQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXBFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUV0RDs7Ozs7Ozs7R0FRRztBQXFESCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsU0FBUzs7O1lBcERsRCxTQUFTLFNBQUM7Z0JBQ1QsOENBQThDO2dCQUM5QyxRQUFRLEVBQUUsZUFBZTtnQkFDekIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Q1Q7Z0JBRUQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3RDOzs7b0JBRUUsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFRhYmxlSGVhZCB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG4vKipcbiAqIEEgc3ViY29tcG9uZW50IHRoYXQgY3JlYXRlcyB0aGUgdGhlYWQgb2YgdGhlIHRhYmxlXG4gKlxuICogRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIFx0PHRoZWFkIHNjVGFibGVIZWFkIFttb2RlbF09XCJtb2RlbFwiPjwvdGhlYWQ+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdbc2NUYWJsZUhlYWRdJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibW9kZWxcIj5cbiAgICAgIDx0ciAqbmdGb3I9XCJsZXQgaGVhZGVyUm93IG9mIG1vZGVsLmhlYWRlcjsgbGV0IHJvd0luZGV4ID0gaW5kZXhcIiBjbGFzcz1cInRhYmxlLXJvd1wiPlxuICAgICAgICA8dGggaWJtVGFibGVIZWFkRXhwYW5kICpuZ0lmPVwibW9kZWwuaGFzRXhwYW5kYWJsZVJvd3MoKVwiIFtpZF09XCJtb2RlbC5nZXRJZCgnZXhwYW5kJylcIj48L3RoPlxuICAgICAgICA8dGhcbiAgICAgICAgICBpYm1UYWJsZUhlYWRDaGVja2JveFxuICAgICAgICAgICpuZ0lmPVwiIXNrZWxldG9uICYmIHNob3dTZWxlY3Rpb25Db2x1bW4gJiYgcm93SW5kZXggPT09IDBcIlxuICAgICAgICAgIGNsYXNzPVwidGFibGUtc2VsZWN0aW9uLWNvbHVtblwiXG4gICAgICAgICAgW2NoZWNrZWRdPVwic2VsZWN0QWxsQ2hlY2tib3hcIlxuICAgICAgICAgIFtpbmRldGVybWluYXRlXT1cInNlbGVjdEFsbENoZWNrYm94U29tZVNlbGVjdGVkXCJcbiAgICAgICAgICBbYXJpYUxhYmVsXT1cImdldENoZWNrYm94SGVhZGVyTGFiZWwoKVwiXG4gICAgICAgICAgW3NpemVdPVwic2l6ZVwiXG4gICAgICAgICAgW3NrZWxldG9uXT1cInNrZWxldG9uXCJcbiAgICAgICAgICBbYXR0ci5yb3dzcGFuXT1cIm1vZGVsLmhlYWRlci5sZW5ndGhcIlxuICAgICAgICAgIFtpZF09XCJtb2RlbC5nZXRJZCgnc2VsZWN0JylcIlxuICAgICAgICAgIChjaGFuZ2UpPVwib25TZWxlY3RBbGxDaGVja2JveENoYW5nZSgpXCJcbiAgICAgICAgPjwvdGg+XG5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgY29sdW1uIG9mIGhlYWRlclJvdzsgbGV0IGkgPSBpbmRleFwiPlxuICAgICAgICAgIDx0aFxuICAgICAgICAgICAgc2NUYWJsZUhlYWRDZWxsXG4gICAgICAgICAgICAqbmdJZj1cImNvbHVtbiAmJiBjb2x1bW4udmlzaWJsZVwiXG4gICAgICAgICAgICBbaWRdPVwibW9kZWwuZ2V0SWQoaSwgcm93SW5kZXgpXCJcbiAgICAgICAgICAgIFtoZWFkZXJzXT1cInJvd0luZGV4ID4gMCA/IG1vZGVsLmdldEhlYWRlcklkKGksIGNvbHVtbi5jb2xTcGFuKSA6ICcnXCJcbiAgICAgICAgICAgIFtjb2x1bW5dPVwiY29sdW1uXCJcbiAgICAgICAgICAgIFthdHRyLmNvbHNwYW5dPVwiY29sdW1uLmNvbFNwYW5cIlxuICAgICAgICAgICAgW2F0dHIucm93c3Bhbl09XCJjb2x1bW4ucm93U3BhblwiXG4gICAgICAgICAgICBbZmlsdGVyVGl0bGVdPVwiZ2V0RmlsdGVyVGl0bGUoKVwiXG4gICAgICAgICAgICAoc29ydCk9XCJzb3J0LmVtaXQoaSlcIlxuICAgICAgICAgICAgW2NsYXNzXT1cImNvbHVtbi5jbGFzc05hbWVcIlxuICAgICAgICAgICAgW3NrZWxldG9uXT1cInNrZWxldG9uXCJcbiAgICAgICAgICAgIFtuZ1N0eWxlXT1cImNvbHVtbi5zdHlsZVwiXG4gICAgICAgICAgPjwvdGg+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8dGhcbiAgICAgICAgICAqbmdJZj1cIiFza2VsZXRvbiAmJiBzdGlja3lIZWFkZXJcIlxuICAgICAgICAgIFtuZ1N0eWxlXT1cInsgd2lkdGg6IHNjcm9sbGJhcldpZHRoICsgJ3B4JywgcGFkZGluZzogMCwgYm9yZGVyOiAwIH1cIlxuICAgICAgICA+XG4gICAgICAgICAgPCEtLVxuXHRcdFx0XHRcdFNjcm9sbGJhciBwdXNoZXMgYm9keSB0byB0aGUgbGVmdCBzbyB0aGlzIGhlYWRlciBjb2x1bW4gaXMgYWRkZWQgdG8gcHVzaFxuXHRcdFx0XHRcdHRoZSB0aXRsZSBiYXIgdGhlIHNhbWUgYW1vdW50IGFuZCBrZWVwIHRoZSBoZWFkZXIgYW5kIGJvZHkgY29sdW1ucyBhbGlnbmVkLlxuXHRcdFx0XHQtLT48L3RoPlxuICAgICAgPC90cj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL3N0ZXJsaW5nLXRhYmxlLWhlYWQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBTQ1RhYmxlSGVhZENvbXBvbmVudCBleHRlbmRzIFRhYmxlSGVhZCB7XG4gIEBJbnB1dCgpIG1vZGVsOiBhbnk7XG59XG4iXX0=