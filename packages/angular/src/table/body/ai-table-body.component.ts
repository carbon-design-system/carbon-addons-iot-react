import { Component, Input } from '@angular/core';
import { TableBody } from 'carbon-components-angular';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[aiTableBody]',
  template: `
    <ng-container *ngIf="model">
      <ng-container *ngFor="let row of model.data; let i = index">
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
        <ng-container *ngIf="model.isRowExpanded(i) && !model.isRowFiltered(i)">
          <tr
            *ngIf="!shouldExpandAsTable(row); else expandAsTableTemplate"
            ibmTableExpandedRow
            ibmExpandedRowHover
            [row]="row"
            [expanded]="model.isRowExpanded(i)"
            [skeleton]="skeleton"
          ></tr>
          <ng-template #expandAsTableTemplate>
            <tr
              *ngFor="let expandedDataRow of firstExpandedDataInRow(row)"
              ibmTableRow
              [model]="model"
              [showSelectionColumnCheckbox]="false"
              [showSelectionColumn]="showSelectionColumn"
              [row]="expandedDataRow"
              [size]="size"
              [skeleton]="skeleton"
            ></tr>
          </ng-template>
        </ng-container>
      </ng-container>
    </ng-container>
    <ng-content></ng-content>
  `,
})
export class AITableBody extends TableBody {}
