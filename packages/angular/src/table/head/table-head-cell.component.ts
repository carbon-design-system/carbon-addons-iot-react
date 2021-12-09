import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { TableHeadCell } from 'carbon-components-angular';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[aiTableHeadCell]',
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
          <svg ibmIcon="arrow--down" size="16" class="bx--table-sort__icon"></svg>
          <svg ibmIcon="arrows--vertical" size="16" class="bx--table-sort__icon-unsorted"></svg>
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
        <svg ibmIcon="filter" size="16" class="icon--sm"></svg>
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
})
export class AITableHeadCell extends TableHeadCell {
  @HostBinding('class.iot--table-head-cell') cssClass = true;
}
