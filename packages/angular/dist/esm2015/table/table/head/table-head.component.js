/**
 *
 * @ai-apps/angular v2.155.1 | table-head.component.js
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
 * 	<thead aiTableHead [model]="model"></thead>
 * ```
 */
export class AITableHeadComponent extends TableHead {
}
AITableHeadComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: '[aiTableHead]',
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
            aiTableHeadCell
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
            [ngClass]="{
              'iot--table-head--table-header': true,
              'table-header-label-start': column.alignment === 'start',
              'table-header-label-center': column.alignment === 'center',
              'table-header-label-end': column.alignment === 'end'
            }"
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
                encapsulation: ViewEncapsulation.None
            },] }
];
AITableHeadComponent.propDecorators = {
    model: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaGVhZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdGFibGUvaGVhZC90YWJsZS1oZWFkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVwRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFdEQ7Ozs7Ozs7O0dBUUc7QUEwREgsTUFBTSxPQUFPLG9CQUFxQixTQUFRLFNBQVM7OztZQXpEbEQsU0FBUyxTQUFDO2dCQUNULDhDQUE4QztnQkFDOUMsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbURUO2dCQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2FBQ3RDOzs7b0JBRUUsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFRhYmxlSGVhZCB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG4vKipcbiAqIEEgc3ViY29tcG9uZW50IHRoYXQgY3JlYXRlcyB0aGUgdGhlYWQgb2YgdGhlIHRhYmxlXG4gKlxuICogRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIFx0PHRoZWFkIGFpVGFibGVIZWFkIFttb2RlbF09XCJtb2RlbFwiPjwvdGhlYWQ+XG4gKiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdbYWlUYWJsZUhlYWRdJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibW9kZWxcIj5cbiAgICAgIDx0ciAqbmdGb3I9XCJsZXQgaGVhZGVyUm93IG9mIG1vZGVsLmhlYWRlcjsgbGV0IHJvd0luZGV4ID0gaW5kZXhcIiBjbGFzcz1cInRhYmxlLXJvd1wiPlxuICAgICAgICA8dGggaWJtVGFibGVIZWFkRXhwYW5kICpuZ0lmPVwibW9kZWwuaGFzRXhwYW5kYWJsZVJvd3MoKVwiIFtpZF09XCJtb2RlbC5nZXRJZCgnZXhwYW5kJylcIj48L3RoPlxuICAgICAgICA8dGhcbiAgICAgICAgICBpYm1UYWJsZUhlYWRDaGVja2JveFxuICAgICAgICAgICpuZ0lmPVwiIXNrZWxldG9uICYmIHNob3dTZWxlY3Rpb25Db2x1bW4gJiYgcm93SW5kZXggPT09IDBcIlxuICAgICAgICAgIGNsYXNzPVwidGFibGUtc2VsZWN0aW9uLWNvbHVtblwiXG4gICAgICAgICAgW2NoZWNrZWRdPVwic2VsZWN0QWxsQ2hlY2tib3hcIlxuICAgICAgICAgIFtpbmRldGVybWluYXRlXT1cInNlbGVjdEFsbENoZWNrYm94U29tZVNlbGVjdGVkXCJcbiAgICAgICAgICBbYXJpYUxhYmVsXT1cImdldENoZWNrYm94SGVhZGVyTGFiZWwoKVwiXG4gICAgICAgICAgW3NpemVdPVwic2l6ZVwiXG4gICAgICAgICAgW3NrZWxldG9uXT1cInNrZWxldG9uXCJcbiAgICAgICAgICBbYXR0ci5yb3dzcGFuXT1cIm1vZGVsLmhlYWRlci5sZW5ndGhcIlxuICAgICAgICAgIFtpZF09XCJtb2RlbC5nZXRJZCgnc2VsZWN0JylcIlxuICAgICAgICAgIChjaGFuZ2UpPVwib25TZWxlY3RBbGxDaGVja2JveENoYW5nZSgpXCJcbiAgICAgICAgPjwvdGg+XG5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgY29sdW1uIG9mIGhlYWRlclJvdzsgbGV0IGkgPSBpbmRleFwiPlxuICAgICAgICAgIDx0aFxuICAgICAgICAgICAgYWlUYWJsZUhlYWRDZWxsXG4gICAgICAgICAgICAqbmdJZj1cImNvbHVtbiAmJiBjb2x1bW4udmlzaWJsZVwiXG4gICAgICAgICAgICBbaWRdPVwibW9kZWwuZ2V0SWQoaSwgcm93SW5kZXgpXCJcbiAgICAgICAgICAgIFtoZWFkZXJzXT1cInJvd0luZGV4ID4gMCA/IG1vZGVsLmdldEhlYWRlcklkKGksIGNvbHVtbi5jb2xTcGFuKSA6ICcnXCJcbiAgICAgICAgICAgIFtjb2x1bW5dPVwiY29sdW1uXCJcbiAgICAgICAgICAgIFthdHRyLmNvbHNwYW5dPVwiY29sdW1uLmNvbFNwYW5cIlxuICAgICAgICAgICAgW2F0dHIucm93c3Bhbl09XCJjb2x1bW4ucm93U3BhblwiXG4gICAgICAgICAgICBbZmlsdGVyVGl0bGVdPVwiZ2V0RmlsdGVyVGl0bGUoKVwiXG4gICAgICAgICAgICAoc29ydCk9XCJzb3J0LmVtaXQoaSlcIlxuICAgICAgICAgICAgW2NsYXNzXT1cImNvbHVtbi5jbGFzc05hbWVcIlxuICAgICAgICAgICAgW3NrZWxldG9uXT1cInNrZWxldG9uXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgJ2lvdC0tdGFibGUtaGVhZC0tdGFibGUtaGVhZGVyJzogdHJ1ZSxcbiAgICAgICAgICAgICAgJ3RhYmxlLWhlYWRlci1sYWJlbC1zdGFydCc6IGNvbHVtbi5hbGlnbm1lbnQgPT09ICdzdGFydCcsXG4gICAgICAgICAgICAgICd0YWJsZS1oZWFkZXItbGFiZWwtY2VudGVyJzogY29sdW1uLmFsaWdubWVudCA9PT0gJ2NlbnRlcicsXG4gICAgICAgICAgICAgICd0YWJsZS1oZWFkZXItbGFiZWwtZW5kJzogY29sdW1uLmFsaWdubWVudCA9PT0gJ2VuZCdcbiAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwiY29sdW1uLnN0eWxlXCJcbiAgICAgICAgICA+PC90aD5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDx0aFxuICAgICAgICAgICpuZ0lmPVwiIXNrZWxldG9uICYmIHN0aWNreUhlYWRlclwiXG4gICAgICAgICAgW25nU3R5bGVdPVwieyB3aWR0aDogc2Nyb2xsYmFyV2lkdGggKyAncHgnLCBwYWRkaW5nOiAwLCBib3JkZXI6IDAgfVwiXG4gICAgICAgID5cbiAgICAgICAgICA8IS0tXG5cdFx0XHRcdFx0U2Nyb2xsYmFyIHB1c2hlcyBib2R5IHRvIHRoZSBsZWZ0IHNvIHRoaXMgaGVhZGVyIGNvbHVtbiBpcyBhZGRlZCB0byBwdXNoXG5cdFx0XHRcdFx0dGhlIHRpdGxlIGJhciB0aGUgc2FtZSBhbW91bnQgYW5kIGtlZXAgdGhlIGhlYWRlciBhbmQgYm9keSBjb2x1bW5zIGFsaWduZWQuXG5cdFx0XHRcdC0tPjwvdGg+XG4gICAgICA8L3RyPlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgQUlUYWJsZUhlYWRDb21wb25lbnQgZXh0ZW5kcyBUYWJsZUhlYWQge1xuICBASW5wdXQoKSBtb2RlbDogYW55O1xufVxuIl19