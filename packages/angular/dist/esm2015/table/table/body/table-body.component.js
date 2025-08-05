/**
 *
 * @ai-apps/angular v2.155.1 | table-body.component.js
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
import { TableBody } from 'carbon-components-angular';
export class AITableBody extends TableBody {
}
AITableBody.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line: component-selector
                selector: '[aiTableBody]',
                template: `
    <ng-container *ngIf="model">
      <ng-container *ngFor="let row of model.rows(); let i = index">
        <tr
          aiTableRow
          [model]="model"
          [row]="row"
          [size]="size"
          [selected]="model.isRowSelected(i)"
          [expandable]="model.isRowExpandable(i)"
          [expanded]="model.isRowExpanded(i)"
          [checkboxLabel]="getCheckboxRowLabel()"
          [expandButtonAriaLabel]="getExpandButtonAriaLabel()"
          [showSelectionColumn]="showSelectionColumn"
          [enableSingleSelect]="enableSingleSelect"
          [skeleton]="skeleton"
          (selectRow)="onRowCheckboxChange(i)"
          (deselectRow)="onRowCheckboxChange(i)"
          (expandRow)="model.expandRow(i, !model.isRowExpanded(i))"
          (rowClick)="onRowClick(i)"
          *ngIf="!model.isRowFiltered(i)"
          [class]="model.rowsClass[i] ? model.rowsClass[i] : null"
          [ngClass]="{
            'tbody_row--success': !model.isRowSelected(i) && model.getRowContext(i) === 'success',
            'tbody_row--warning': !model.isRowSelected(i) && model.getRowContext(i) === 'warning',
            'tbody_row--info': !model.isRowSelected(i) && model.getRowContext(i) === 'info',
            'tbody_row--error': !model.isRowSelected(i) && model.getRowContext(i) === 'error'
          }"
        ></tr>
        <tr
          *ngIf="model.isRowExpandable(i) && !shouldExpandAsTable(row) && !model.isRowFiltered(i)"
          ibmTableExpandedRow
          ibmExpandedRowHover
          [row]="row"
          [expanded]="model.isRowExpanded(i)"
          [skeleton]="skeleton"
        ></tr>
        <ng-container
          *ngIf="
            model.isRowExpandable(i) &&
            shouldExpandAsTable(row) &&
            model.isRowExpanded(i) &&
            !model.isRowFiltered(i)
          "
        >
          <tr
            *ngFor="let expandedDataRow of firstExpandedDataInRow(row)"
            aiTableRow
            [model]="model"
            [showSelectionColumnCheckbox]="false"
            [showSelectionColumn]="showSelectionColumn"
            [row]="expandedDataRow"
            [size]="size"
            [skeleton]="skeleton"
          ></tr>
        </ng-container>
      </ng-container>
    </ng-container>
    <ng-content></ng-content>
  `
            },] }
];
AITableBody.propDecorators = {
    model: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtYm9keS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdGFibGUvYm9keS90YWJsZS1ib2R5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFrRXRELE1BQU0sT0FBTyxXQUFZLFNBQVEsU0FBUzs7O1lBaEV6QyxTQUFTLFNBQUM7Z0JBQ1QsK0NBQStDO2dCQUMvQyxRQUFRLEVBQUUsZUFBZTtnQkFDekIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJEVDthQUNGOzs7b0JBRUUsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRhYmxlQm9keSB9IGZyb20gJ2NhcmJvbi1jb21wb25lbnRzLWFuZ3VsYXInO1xuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdbYWlUYWJsZUJvZHldJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibW9kZWxcIj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IHJvdyBvZiBtb2RlbC5yb3dzKCk7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgICAgPHRyXG4gICAgICAgICAgYWlUYWJsZVJvd1xuICAgICAgICAgIFttb2RlbF09XCJtb2RlbFwiXG4gICAgICAgICAgW3Jvd109XCJyb3dcIlxuICAgICAgICAgIFtzaXplXT1cInNpemVcIlxuICAgICAgICAgIFtzZWxlY3RlZF09XCJtb2RlbC5pc1Jvd1NlbGVjdGVkKGkpXCJcbiAgICAgICAgICBbZXhwYW5kYWJsZV09XCJtb2RlbC5pc1Jvd0V4cGFuZGFibGUoaSlcIlxuICAgICAgICAgIFtleHBhbmRlZF09XCJtb2RlbC5pc1Jvd0V4cGFuZGVkKGkpXCJcbiAgICAgICAgICBbY2hlY2tib3hMYWJlbF09XCJnZXRDaGVja2JveFJvd0xhYmVsKClcIlxuICAgICAgICAgIFtleHBhbmRCdXR0b25BcmlhTGFiZWxdPVwiZ2V0RXhwYW5kQnV0dG9uQXJpYUxhYmVsKClcIlxuICAgICAgICAgIFtzaG93U2VsZWN0aW9uQ29sdW1uXT1cInNob3dTZWxlY3Rpb25Db2x1bW5cIlxuICAgICAgICAgIFtlbmFibGVTaW5nbGVTZWxlY3RdPVwiZW5hYmxlU2luZ2xlU2VsZWN0XCJcbiAgICAgICAgICBbc2tlbGV0b25dPVwic2tlbGV0b25cIlxuICAgICAgICAgIChzZWxlY3RSb3cpPVwib25Sb3dDaGVja2JveENoYW5nZShpKVwiXG4gICAgICAgICAgKGRlc2VsZWN0Um93KT1cIm9uUm93Q2hlY2tib3hDaGFuZ2UoaSlcIlxuICAgICAgICAgIChleHBhbmRSb3cpPVwibW9kZWwuZXhwYW5kUm93KGksICFtb2RlbC5pc1Jvd0V4cGFuZGVkKGkpKVwiXG4gICAgICAgICAgKHJvd0NsaWNrKT1cIm9uUm93Q2xpY2soaSlcIlxuICAgICAgICAgICpuZ0lmPVwiIW1vZGVsLmlzUm93RmlsdGVyZWQoaSlcIlxuICAgICAgICAgIFtjbGFzc109XCJtb2RlbC5yb3dzQ2xhc3NbaV0gPyBtb2RlbC5yb3dzQ2xhc3NbaV0gOiBudWxsXCJcbiAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAndGJvZHlfcm93LS1zdWNjZXNzJzogIW1vZGVsLmlzUm93U2VsZWN0ZWQoaSkgJiYgbW9kZWwuZ2V0Um93Q29udGV4dChpKSA9PT0gJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgJ3Rib2R5X3Jvdy0td2FybmluZyc6ICFtb2RlbC5pc1Jvd1NlbGVjdGVkKGkpICYmIG1vZGVsLmdldFJvd0NvbnRleHQoaSkgPT09ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICd0Ym9keV9yb3ctLWluZm8nOiAhbW9kZWwuaXNSb3dTZWxlY3RlZChpKSAmJiBtb2RlbC5nZXRSb3dDb250ZXh0KGkpID09PSAnaW5mbycsXG4gICAgICAgICAgICAndGJvZHlfcm93LS1lcnJvcic6ICFtb2RlbC5pc1Jvd1NlbGVjdGVkKGkpICYmIG1vZGVsLmdldFJvd0NvbnRleHQoaSkgPT09ICdlcnJvcidcbiAgICAgICAgICB9XCJcbiAgICAgICAgPjwvdHI+XG4gICAgICAgIDx0clxuICAgICAgICAgICpuZ0lmPVwibW9kZWwuaXNSb3dFeHBhbmRhYmxlKGkpICYmICFzaG91bGRFeHBhbmRBc1RhYmxlKHJvdykgJiYgIW1vZGVsLmlzUm93RmlsdGVyZWQoaSlcIlxuICAgICAgICAgIGlibVRhYmxlRXhwYW5kZWRSb3dcbiAgICAgICAgICBpYm1FeHBhbmRlZFJvd0hvdmVyXG4gICAgICAgICAgW3Jvd109XCJyb3dcIlxuICAgICAgICAgIFtleHBhbmRlZF09XCJtb2RlbC5pc1Jvd0V4cGFuZGVkKGkpXCJcbiAgICAgICAgICBbc2tlbGV0b25dPVwic2tlbGV0b25cIlxuICAgICAgICA+PC90cj5cbiAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICpuZ0lmPVwiXG4gICAgICAgICAgICBtb2RlbC5pc1Jvd0V4cGFuZGFibGUoaSkgJiZcbiAgICAgICAgICAgIHNob3VsZEV4cGFuZEFzVGFibGUocm93KSAmJlxuICAgICAgICAgICAgbW9kZWwuaXNSb3dFeHBhbmRlZChpKSAmJlxuICAgICAgICAgICAgIW1vZGVsLmlzUm93RmlsdGVyZWQoaSlcbiAgICAgICAgICBcIlxuICAgICAgICA+XG4gICAgICAgICAgPHRyXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgZXhwYW5kZWREYXRhUm93IG9mIGZpcnN0RXhwYW5kZWREYXRhSW5Sb3cocm93KVwiXG4gICAgICAgICAgICBhaVRhYmxlUm93XG4gICAgICAgICAgICBbbW9kZWxdPVwibW9kZWxcIlxuICAgICAgICAgICAgW3Nob3dTZWxlY3Rpb25Db2x1bW5DaGVja2JveF09XCJmYWxzZVwiXG4gICAgICAgICAgICBbc2hvd1NlbGVjdGlvbkNvbHVtbl09XCJzaG93U2VsZWN0aW9uQ29sdW1uXCJcbiAgICAgICAgICAgIFtyb3ddPVwiZXhwYW5kZWREYXRhUm93XCJcbiAgICAgICAgICAgIFtzaXplXT1cInNpemVcIlxuICAgICAgICAgICAgW3NrZWxldG9uXT1cInNrZWxldG9uXCJcbiAgICAgICAgICA+PC90cj5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIEFJVGFibGVCb2R5IGV4dGVuZHMgVGFibGVCb2R5IHtcbiAgQElucHV0KCkgbW9kZWw6IGFueTtcbn1cbiJdfQ==