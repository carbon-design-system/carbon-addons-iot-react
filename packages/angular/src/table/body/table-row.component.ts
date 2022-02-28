import { Component, Input } from '@angular/core';
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
  `,
})
export class AITableRowComponent extends TableRowComponent {
  /**
   * `TableModel` with data the table is to display.
   */
  @Input() model: any;
}
