/**
 *
 * @ai-apps/angular v2.155.1 | table-row.component.js
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


import { Component, Input } from '@angular/core';
import { TableRowComponent } from 'carbon-components-angular';
export class AITableRowComponent extends TableRowComponent {
}
AITableRowComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line: component-selector
                selector: '[aiTableRow]',
                template: `
    <ng-container *ngIf="model">
      <td
        *ngIf="model.hasExpandableRows()"
        ibmTableExpandButton
        class="bx--table-expand-v2"
        [expanded]="expanded"
        [expandable]="expandable"
        [skeleton]="skeleton"
        [ariaLabel]="getExpandButtonAriaLabel()"
        [headers]="model.getHeaderId('expand')"
        (expandRow)="expandRow.emit()"
      ></td>
      <ng-container *ngIf="!skeleton && showSelectionColumn && !enableSingleSelect">
        <td *ngIf="!showSelectionColumnCheckbox; else tableCheckboxTemplate"></td>
        <ng-template #tableCheckboxTemplate>
          <td
            ibmTableCheckbox
            class="bx--checkbox-table-cell"
            [size]="size"
            [selected]="selected"
            [label]="getCheckboxLabel()"
            [row]="row"
            [skeleton]="skeleton"
            [headers]="model.getHeaderId('select')"
            (change)="onSelectionChange()"
          ></td>
        </ng-template>
      </ng-container>
      <td
        *ngIf="!skeleton && showSelectionColumn && enableSingleSelect"
        ibmTableRadio
        [selected]="selected"
        [label]="getCheckboxLabel()"
        [row]="row"
        [skeleton]="skeleton"
        [headers]="model.getHeaderId('select')"
        (change)="onSelectionChange()"
      ></td>
      <ng-container *ngFor="let item of row; let j = index">
        <td
          *ngIf="item && model.getClosestHeader(j) && model.getClosestHeader(j).visible"
          ibmTableData
          [headers]="model.getHeaderId(j, item.colSpan)"
          [item]="item"
          [title]="item.title"
          [class]="model.getClosestHeader(j).className"
          [ngStyle]="model.getClosestHeader(j).style"
          [ngClass]="{
            'data-table-end': model.getClosestHeader(j).alignment === 'end',
            'data-table-start': model.getClosestHeader(j).alignment === 'start',
            'data-table-center': model.getClosestHeader(j).alignment === 'center',
            'iot--table__cell--sortable': model.getClosestHeader(j).sortable
          }"
          [skeleton]="skeleton"
          [attr.colspan]="item.colSpan"
          [attr.rowspan]="item.rowSpan"
          (click)="onRowClick()"
          (keydown.enter)="onRowClick()"
        ></td>
        <td
          *ngIf="item && model.getClosestHeader(j) == null"
          ibmTableData
          [headers]="model.getHeaderId(j, item.colSpan)"
          [item]="item"
          [title]="item.title"
          [skeleton]="skeleton"
          [attr.colspan]="item.colSpan"
          [attr.rowspan]="item.rowSpan"
          (click)="onRowClick()"
          (keydown.enter)="onRowClick()"
        ></td>
      </ng-container>
    </ng-container>
    <ng-content></ng-content>
  `
            },] }
];
AITableRowComponent.propDecorators = {
    model: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtcm93LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy90YWJsZS9ib2R5L3RhYmxlLXJvdy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFrRjlELE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxpQkFBaUI7OztZQWhGekQsU0FBUyxTQUFDO2dCQUNULCtDQUErQztnQkFDL0MsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkVUO2FBQ0Y7OztvQkFLRSxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGFibGVSb3dDb21wb25lbnQgfSBmcm9tICdjYXJib24tY29tcG9uZW50cy1hbmd1bGFyJztcblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogY29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnW2FpVGFibGVSb3ddJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibW9kZWxcIj5cbiAgICAgIDx0ZFxuICAgICAgICAqbmdJZj1cIm1vZGVsLmhhc0V4cGFuZGFibGVSb3dzKClcIlxuICAgICAgICBpYm1UYWJsZUV4cGFuZEJ1dHRvblxuICAgICAgICBjbGFzcz1cImJ4LS10YWJsZS1leHBhbmQtdjJcIlxuICAgICAgICBbZXhwYW5kZWRdPVwiZXhwYW5kZWRcIlxuICAgICAgICBbZXhwYW5kYWJsZV09XCJleHBhbmRhYmxlXCJcbiAgICAgICAgW3NrZWxldG9uXT1cInNrZWxldG9uXCJcbiAgICAgICAgW2FyaWFMYWJlbF09XCJnZXRFeHBhbmRCdXR0b25BcmlhTGFiZWwoKVwiXG4gICAgICAgIFtoZWFkZXJzXT1cIm1vZGVsLmdldEhlYWRlcklkKCdleHBhbmQnKVwiXG4gICAgICAgIChleHBhbmRSb3cpPVwiZXhwYW5kUm93LmVtaXQoKVwiXG4gICAgICA+PC90ZD5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhc2tlbGV0b24gJiYgc2hvd1NlbGVjdGlvbkNvbHVtbiAmJiAhZW5hYmxlU2luZ2xlU2VsZWN0XCI+XG4gICAgICAgIDx0ZCAqbmdJZj1cIiFzaG93U2VsZWN0aW9uQ29sdW1uQ2hlY2tib3g7IGVsc2UgdGFibGVDaGVja2JveFRlbXBsYXRlXCI+PC90ZD5cbiAgICAgICAgPG5nLXRlbXBsYXRlICN0YWJsZUNoZWNrYm94VGVtcGxhdGU+XG4gICAgICAgICAgPHRkXG4gICAgICAgICAgICBpYm1UYWJsZUNoZWNrYm94XG4gICAgICAgICAgICBjbGFzcz1cImJ4LS1jaGVja2JveC10YWJsZS1jZWxsXCJcbiAgICAgICAgICAgIFtzaXplXT1cInNpemVcIlxuICAgICAgICAgICAgW3NlbGVjdGVkXT1cInNlbGVjdGVkXCJcbiAgICAgICAgICAgIFtsYWJlbF09XCJnZXRDaGVja2JveExhYmVsKClcIlxuICAgICAgICAgICAgW3Jvd109XCJyb3dcIlxuICAgICAgICAgICAgW3NrZWxldG9uXT1cInNrZWxldG9uXCJcbiAgICAgICAgICAgIFtoZWFkZXJzXT1cIm1vZGVsLmdldEhlYWRlcklkKCdzZWxlY3QnKVwiXG4gICAgICAgICAgICAoY2hhbmdlKT1cIm9uU2VsZWN0aW9uQ2hhbmdlKClcIlxuICAgICAgICAgID48L3RkPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8dGRcbiAgICAgICAgKm5nSWY9XCIhc2tlbGV0b24gJiYgc2hvd1NlbGVjdGlvbkNvbHVtbiAmJiBlbmFibGVTaW5nbGVTZWxlY3RcIlxuICAgICAgICBpYm1UYWJsZVJhZGlvXG4gICAgICAgIFtzZWxlY3RlZF09XCJzZWxlY3RlZFwiXG4gICAgICAgIFtsYWJlbF09XCJnZXRDaGVja2JveExhYmVsKClcIlxuICAgICAgICBbcm93XT1cInJvd1wiXG4gICAgICAgIFtza2VsZXRvbl09XCJza2VsZXRvblwiXG4gICAgICAgIFtoZWFkZXJzXT1cIm1vZGVsLmdldEhlYWRlcklkKCdzZWxlY3QnKVwiXG4gICAgICAgIChjaGFuZ2UpPVwib25TZWxlY3Rpb25DaGFuZ2UoKVwiXG4gICAgICA+PC90ZD5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygcm93OyBsZXQgaiA9IGluZGV4XCI+XG4gICAgICAgIDx0ZFxuICAgICAgICAgICpuZ0lmPVwiaXRlbSAmJiBtb2RlbC5nZXRDbG9zZXN0SGVhZGVyKGopICYmIG1vZGVsLmdldENsb3Nlc3RIZWFkZXIoaikudmlzaWJsZVwiXG4gICAgICAgICAgaWJtVGFibGVEYXRhXG4gICAgICAgICAgW2hlYWRlcnNdPVwibW9kZWwuZ2V0SGVhZGVySWQoaiwgaXRlbS5jb2xTcGFuKVwiXG4gICAgICAgICAgW2l0ZW1dPVwiaXRlbVwiXG4gICAgICAgICAgW3RpdGxlXT1cIml0ZW0udGl0bGVcIlxuICAgICAgICAgIFtjbGFzc109XCJtb2RlbC5nZXRDbG9zZXN0SGVhZGVyKGopLmNsYXNzTmFtZVwiXG4gICAgICAgICAgW25nU3R5bGVdPVwibW9kZWwuZ2V0Q2xvc2VzdEhlYWRlcihqKS5zdHlsZVwiXG4gICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgJ2RhdGEtdGFibGUtZW5kJzogbW9kZWwuZ2V0Q2xvc2VzdEhlYWRlcihqKS5hbGlnbm1lbnQgPT09ICdlbmQnLFxuICAgICAgICAgICAgJ2RhdGEtdGFibGUtc3RhcnQnOiBtb2RlbC5nZXRDbG9zZXN0SGVhZGVyKGopLmFsaWdubWVudCA9PT0gJ3N0YXJ0JyxcbiAgICAgICAgICAgICdkYXRhLXRhYmxlLWNlbnRlcic6IG1vZGVsLmdldENsb3Nlc3RIZWFkZXIoaikuYWxpZ25tZW50ID09PSAnY2VudGVyJyxcbiAgICAgICAgICAgICdpb3QtLXRhYmxlX19jZWxsLS1zb3J0YWJsZSc6IG1vZGVsLmdldENsb3Nlc3RIZWFkZXIoaikuc29ydGFibGVcbiAgICAgICAgICB9XCJcbiAgICAgICAgICBbc2tlbGV0b25dPVwic2tlbGV0b25cIlxuICAgICAgICAgIFthdHRyLmNvbHNwYW5dPVwiaXRlbS5jb2xTcGFuXCJcbiAgICAgICAgICBbYXR0ci5yb3dzcGFuXT1cIml0ZW0ucm93U3BhblwiXG4gICAgICAgICAgKGNsaWNrKT1cIm9uUm93Q2xpY2soKVwiXG4gICAgICAgICAgKGtleWRvd24uZW50ZXIpPVwib25Sb3dDbGljaygpXCJcbiAgICAgICAgPjwvdGQ+XG4gICAgICAgIDx0ZFxuICAgICAgICAgICpuZ0lmPVwiaXRlbSAmJiBtb2RlbC5nZXRDbG9zZXN0SGVhZGVyKGopID09IG51bGxcIlxuICAgICAgICAgIGlibVRhYmxlRGF0YVxuICAgICAgICAgIFtoZWFkZXJzXT1cIm1vZGVsLmdldEhlYWRlcklkKGosIGl0ZW0uY29sU3BhbilcIlxuICAgICAgICAgIFtpdGVtXT1cIml0ZW1cIlxuICAgICAgICAgIFt0aXRsZV09XCJpdGVtLnRpdGxlXCJcbiAgICAgICAgICBbc2tlbGV0b25dPVwic2tlbGV0b25cIlxuICAgICAgICAgIFthdHRyLmNvbHNwYW5dPVwiaXRlbS5jb2xTcGFuXCJcbiAgICAgICAgICBbYXR0ci5yb3dzcGFuXT1cIml0ZW0ucm93U3BhblwiXG4gICAgICAgICAgKGNsaWNrKT1cIm9uUm93Q2xpY2soKVwiXG4gICAgICAgICAgKGtleWRvd24uZW50ZXIpPVwib25Sb3dDbGljaygpXCJcbiAgICAgICAgPjwvdGQ+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIEFJVGFibGVSb3dDb21wb25lbnQgZXh0ZW5kcyBUYWJsZVJvd0NvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBgVGFibGVNb2RlbGAgd2l0aCBkYXRhIHRoZSB0YWJsZSBpcyB0byBkaXNwbGF5LlxuICAgKi9cbiAgQElucHV0KCkgbW9kZWw6IGFueTtcbn1cbiJdfQ==