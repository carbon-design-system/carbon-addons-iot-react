import { Component } from '@angular/core';
import { TableRowComponent } from 'carbon-components-angular';

@Component({
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
        (expandRow)="expandRow.emit()">
      </td>
      <ng-container *ngIf="!skeleton && showSelectionColumn && !enableSingleSelect">
        <td
          *ngIf="!showSelectionColumnCheckbox; else tableCheckboxTemplate">
        </td>
        <ng-template #tableCheckboxTemplate>
          <td
            ibmTableCheckbox
            class="bx--table-column-checkbox"
            [size]="size"
            [selected]="selected"
            [label]="getCheckboxLabel()"
            [row]="row"
            [skeleton]="skeleton"
            [headers]="model.getHeaderId('select')"
            (change)="onSelectionChange()">
          </td>
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
        (change)="onSelectionChange()">
      </td>
      <ng-container *ngFor="let item of row; let j = index">
        <td
          *ngIf="item && model.getHeader(j) && model.getHeader(j).visible"
          ibmTableData
          [headers]="model.getHeaderId(j, item.colSpan)"
          [item]="item"
          [title]="item.title"
          [class]="model.getHeader(j).className"
          [ngStyle]="model.getHeader(j).style"
          [ngClass]="{
            'data-table-end': model.getHeader(j).alignment === 'end',
            'data-table-start': model.getHeader(j).alignment === 'start',
            'data-table-center': model.getHeader(j).alignment === 'center',
            'iot--table__cell--sortable': model.getHeader(j).sortable
          }"
          [skeleton]="skeleton"
          [attr.colspan]="item.colSpan"
          [attr.rowspan]="item.rowSpan"
          (click)="onRowClick()"
          (keydown.enter)="onRowClick()">
        </td>
        <td
          *ngIf="item && model.getHeader(j) == null"
          ibmTableData
          [headers]="model.getHeaderId(j, item.colSpan)"
          [item]="item"
          [title]="item.title"
          [skeleton]="skeleton"
          [attr.colspan]="item.colSpan"
          [attr.rowspan]="item.rowSpan"
          (click)="onRowClick()"
          (keydown.enter)="onRowClick()">
        </td>
      </ng-container>
    </ng-container>
    <ng-content></ng-content>
  `
})
export class AITableRow extends TableRowComponent { }
