/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-toolkit.js
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


import { EventEmitter, Component, Input, Output, HostBinding, NgModule, ViewEncapsulation, Directive, HostListener, ElementRef, Optional, Inject, NgModuleRef, ComponentFactoryResolver, ViewContainerRef, Injectable } from '@angular/core';
import { BreadcrumbModule, TableHeadCell, TableHead, Table, DialogModule, ButtonModule, TableModule, TableHeaderItem, TableItem, CheckboxModule, BaseModal, ModalService, ModalModule, TabsModule, RadioModule } from 'carbon-components-angular';
import { CommonModule } from '@angular/common';
import { Subject, BehaviorSubject, Subscription, isObservable, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Adds an item to the end of a `BreadcrumbItem` list to serve as a title for the page header component
 *
 * @param items a list of `BreadcumbItem`s _without_ an item to serve as a title
 * @param title the title to add to the list of items
 */
const itemsWithTitle = (items, title) => {
    return [
        ...items,
        {
            content: title,
            href: '',
        },
    ];
};
/**
 * Page header
 *
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-page-header component
 *
 * The page header component uses the _last_ item in the `items` array as the title.
 *
 * For conveninence we provide a `itemsWithTitle` function that will take an existing
 * set of breadcrumb items and add one to the end to act as a title.
 *
 * Example:
 *
 * component.ts
 * ```typescript
 * items = itemsWithTitle([
 * 	{
 * 		content: "one",
 * 		href: "first link"
 * 	},
 * 	{
 * 		content: "two",
 * 		href: "second link"
 * 	}
 * ], "Hello World");
 * ```
 *
 * component.html
 * ```html
 * <sc-page-header [items]="currentPath"></sc-page-header>
 * ```
 */
class PageHeaderComponent {
    constructor() {
        /**
         * Items to display in the header. The last item is used as the title
         */
        this.items = [];
        /**
         * Emits the navigation status promise when the link is activated
         *
         * (event forwarded from the underlying `ibm-breadcrumb`)
         */
        this.navigation = new EventEmitter();
        /**
         * The page header sits on the grid by default.
         * Set to `false` if you need to manually position the page header using the default padding values
         */
        this.onGrid = true;
    }
    get title() {
        return this.items[this.items.length - 1].content;
    }
    get breadcrumbItems() {
        return this.items.slice(0, this.items.length - 1);
    }
    get hasBreadcrumbs() {
        return this.items.length > 1;
    }
}
PageHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-page-header',
                template: `
    <div [ngClass]="{ 'bx--col': onGrid }">
      <ibm-breadcrumb
        class="breadcrumbs"
        [ariaLabel]="ariaLabel"
        [items]="breadcrumbItems"
        (navigation)="navigation.emit($event)"
      >
      </ibm-breadcrumb>
      <h2>{{ title }}</h2>
    </div>
  `,
                styles: [":host{background:#f4f4f4;display:block;max-height:6.25rem;padding:2rem}:host.has-breadcrumbs{padding-top:1rem}h2{font-size:1.75rem;line-height:2.25rem}:host.bx--row{padding-left:0;padding-right:0}:host{max-height:unset}"]
            },] }
];
PageHeaderComponent.propDecorators = {
    items: [{ type: Input }],
    ariaLabel: [{ type: Input }],
    navigation: [{ type: Output }],
    onGrid: [{ type: HostBinding, args: ['class.bx--row',] }, { type: Input }],
    hasBreadcrumbs: [{ type: HostBinding, args: ['class.has-breadcrumbs',] }]
};

class PageHeaderModule {
}
PageHeaderModule.decorators = [
    { type: NgModule, args: [{
                declarations: [PageHeaderComponent],
                imports: [CommonModule, BreadcrumbModule],
                exports: [PageHeaderComponent],
            },] }
];

class SCTableHeadCell extends TableHeadCell {
}
SCTableHeadCell.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line: component-selector
                selector: '[scTableHeadCell]',
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
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg"
            class="bx--table-sort__icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M12.3 9.3l-3.8 3.8V1h-1v12.1L3.7 9.3 3 10l5 5 5-5z"></path>
          </svg>
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            style="will-change: transform;"
            xmlns="http://www.w3.org/2000/svg"
            class="bx--table-sort__icon-unsorted"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="M13.8 10.3L12 12.1V2h-1v10.1l-1.8-1.8-.7.7 3 3 3-3zM4.5 2l-3 3 .7.7L4 3.9V14h1V3.9l1.8 1.8.7-.7z"
            ></path>
          </svg>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon--sm"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M0 0v3l6 8v5h4v-5l6-8V0H0zm9 10.7V15H7v-4.3L1.3 3h13.5L9 10.7z" />
        </svg>
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
                styles: [".table-head-cell-icons,.table-head-cell-text{top:0}.bx--data-table--compact .table-head-cell-icons,.bx--data-table--compact .table-head-cell-text{line-height:24px}.bx--data-table--short .table-head-cell-icons,.bx--data-table--short .table-head-cell-text{line-height:32px}.bx--data-table--tall .table-head-cell-icons,.bx--data-table--tall .table-head-cell-text{line-height:64px}.table-head-cell-icons{margin-right:10px;right:0}.bx--table-sort.bx--table-sort--active .bx--table-sort__icon{top:16px}.sc-table .bx--table-header-label,.sc-table .table-head-cell-text{padding-left:16px}"]
            },] }
];

/**
 * A subcomponent that creates the thead of the table
 *
 * Example
 *
 * ```html
 * 	<thead scTableHead [model]="model"></thead>
 * ```
 */
class SCTableHeadComponent extends TableHead {
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
class SCTableComponent extends Table {
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

class SCTableModule {
}
SCTableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SCTableComponent, SCTableHeadComponent, SCTableHeadCell],
                imports: [DialogModule, ButtonModule, CommonModule, TableModule],
                exports: [SCTableComponent, SCTableHeadComponent, SCTableHeadCell],
            },] }
];

class SCTableModel {
    constructor() {
        this.headerChange = new Subject();
        this.dataChange = new EventEmitter();
        this.rowsSelectedChange = new EventEmitter();
        this.rowsExpandedChange = new EventEmitter();
        /**
         * Gets emitted when `selectAll` is called. Emits false if all rows are deselected and true if
         * all rows are selected.
         */
        this.selectAllChange = new Subject();
        /**
         * Contains information about selection state of rows in the table.
         */
        this.rowsSelected = [];
        /**
         * Contains information about expanded state of rows in the table.
         */
        this.rowsExpanded = [];
        /**
         * Contains information about the context of the row.
         *
         * It affects styling of the row to reflect the context.
         *
         * string can be one of `"success" | "warning" | "info" | "error" | ""` and it's
         * empty or undefined by default
         */
        this.rowsContext = [];
        /**
         * Contains class name(s) of the row.
         *
         * It affects styling of the row to reflect the appended class name(s).
         *
         * It's empty or undefined by default
         */
        this.rowsClass = [];
        /**
         * Tracks the current page.
         */
        this.currentPage = 1;
        /**
         * Length of page.
         */
        this.pageLength = 10;
        /**
         * Set to true when there is no more data to load in the table
         */
        this.isEnd = false;
        /**
         * Set to true when lazy loading to show loading indicator
         */
        this.isLoading = false;
        /**
         * Used in `data`
         */
        this._data = [[]];
        this._header = [[]];
        /**
         * The number of models instantiated, this is to make sure each table has a different
         * model count for unique id generation.
         */
        this.tableModelCount = 0;
        this.tableModelCount = SCTableModel.COUNT++;
    }
    /**
     * Contains information about the header cells of the table.
     */
    set header(newHeader) {
        if (!newHeader || (Array.isArray(newHeader) && newHeader.length === 0)) {
            newHeader = [[]];
        }
        this._header = newHeader;
        if (this.headerChange) {
            this.headerChange.next();
        }
    }
    get header() {
        return this._header;
    }
    /**
     * Sets data of the table.
     *
     * Make sure all rows are the same length to keep the column count accurate.
     */
    set data(newData) {
        if (!newData || (Array.isArray(newData) && newData.length === 0)) {
            newData = [[]];
        }
        this._data = newData;
        // init rowsSelected
        this.rowsSelected = new Array(this._data.length).fill(false);
        this.rowsExpanded = new Array(this._data.length).fill(false);
        // init rowsContext
        this.rowsContext = new Array(this._data.length);
        // init rowsClass
        this.rowsClass = new Array(this._data.length);
        // only create a fresh header if necessary (header doesn't exist or differs in length)
        // this will only create a single level of headers (it will destroy any existing header items)
        if (this.header == null ||
            (this.header[0].length !== this._data[0].length && this._data[0].length > 0)) {
            const newHeader = [[]];
            // disable this tslint here since we don't actually want to
            // loop the contents of the data
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this._data[0].length; i++) {
                newHeader[0].push(new TableHeaderItem());
            }
            this.header = newHeader;
        }
        this.dataChange.emit();
    }
    /**
     * Gets the full data.
     *
     * You can use it to alter individual `TableItem`s but if you need to change
     * table structure, use `addRow()` and/or `addColumn()`
     */
    get data() {
        return this._data;
    }
    /**
     * Manually set data length in case the data in the table doesn't
     * correctly reflect all the data that table is to display.
     *
     * Example: if you have multiple pages of data that table will display
     * but you're loading one at a time.
     *
     * Set to `null` to reset to default behavior.
     */
    set totalDataLength(length) {
        // if this function is called without a parameter we need to set to null to avoid having undefined != null
        this._totalDataLength = length || null;
    }
    /**
     * Total length of data that table has access to, or the amount manually set
     */
    get totalDataLength() {
        // if manually set data length
        if (this._totalDataLength !== null && this._totalDataLength >= 0) {
            return this._totalDataLength;
        }
        // if empty dataset
        if (this.data && this.data.length === 1 && this.data[0].length === 0) {
            return 0;
        }
        return this.data.length;
    }
    isRowFiltered(index) {
        const realIndex = this.realRowIndex(index);
        return this.header.some((headerRow) => headerRow.some((item, i) => item && item.filter(this.row(realIndex)[i])));
    }
    /**
     * Returns an id for the given column
     *
     * @param column the column to generate an id for
     * @param row the row of the header to generate an id for
     */
    getId(column, row = 0) {
        return `table-header-${row}-${column}-${this.tableModelCount}`;
    }
    getHeaderId(column, colSpan = 1) {
        if (column === 'select' || column === 'expand') {
            return this.getId(column);
        }
        const ids = [];
        for (let i = this.header.length - 1; i >= 0; i--) {
            for (let j = column; j >= 0; j--) {
                if (this.header[i][j]) {
                    for (let k = 0; k < colSpan; k++) {
                        ids.push(this.getId(j + k, i));
                    }
                    break;
                }
            }
        }
        return ids.join(' ');
    }
    /**
     * Finds closest header by trying the lowest cell in header and then work its way to the left
     * @param column
     */
    getHeader(column) {
        if (!this.header) {
            return null;
        }
        for (let i = this.header.length - 1; i >= 0; i--) {
            const headerCell = this.header[i][column];
            if (headerCell) {
                return headerCell;
            }
        }
        for (let i = column; i >= 0; i--) {
            const headerCell = this.header[0][i];
            if (headerCell) {
                return headerCell;
            }
        }
        return null;
    }
    /**
     * Returns how many rows is currently selected
     */
    selectedRowsCount() {
        let count = 0;
        if (this.rowsSelected) {
            this.rowsSelected.forEach((rowSelected) => {
                if (rowSelected) {
                    count++;
                }
            });
        }
        return count;
    }
    /**
     * Returns how many rows is currently expanded
     */
    expandedRowsCount() {
        let count = 0;
        if (this.rowsExpanded) {
            this.rowsExpanded.forEach((rowExpanded) => {
                if (rowExpanded) {
                    count++;
                }
            });
        }
        return count;
    }
    /**
     * Returns `index`th row of the table.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param index
     */
    row(index) {
        return this.data[this.realRowIndex(index)];
    }
    /**
     * Adds a row to the `index`th row or appends to table if index not provided.
     *
     * If row is shorter than other rows or not provided, it will be padded with
     * empty `TableItem` elements.
     *
     * If row is longer than other rows, others will be extended to match so no data is lost.
     *
     * If called on an empty table with no parameters, it creates a 1x1 table.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param [row]
     * @param [index]
     */
    addRow(row, index) {
        // if table empty create table with row
        if (!this.data || this.data.length === 0 || this.data[0].length === 0) {
            let newData = new Array();
            newData.push(row ? row : [new TableItem()]); // row or one empty one column row
            this.data = newData;
            return;
        }
        let realRow = row;
        const columnCount = this.data[0].length;
        if (row == null) {
            realRow = new Array();
            for (let i = 0; i < columnCount; i++) {
                realRow.push(new TableItem());
            }
        }
        if (realRow.length < columnCount) {
            // extend the length of realRow
            const difference = columnCount - realRow.length;
            for (let i = 0; i < difference; i++) {
                realRow.push(new TableItem());
            }
        }
        else if (realRow.length > columnCount) {
            // extend the length of header
            let difference = realRow.length - this.header.length;
            for (let j = 0; j < difference; j++) {
                this.header.push(new TableHeaderItem());
            }
            // extend the length of every other row
            for (let i = 0; i < this.data.length; i++) {
                let currentRow = this.data[i];
                difference = realRow.length - currentRow.length;
                for (let j = 0; j < difference; j++) {
                    currentRow.push(new TableItem());
                }
            }
        }
        if (index == null) {
            this.data.push(realRow);
            // update rowsSelected property for length
            this.rowsSelected.push(false);
            // update rowsExpanded property for length
            this.rowsExpanded.push(false);
            // update rowsContext property for length
            this.rowsContext.push(undefined);
            // update rowsClass property for length
            this.rowsClass.push(undefined);
        }
        else {
            const ri = this.realRowIndex(index);
            this.data.splice(ri, 0, realRow);
            // update rowsSelected property for length
            this.rowsSelected.splice(ri, 0, false);
            // update rowsExpanded property for length
            this.rowsExpanded.splice(ri, 0, false);
            // update rowsContext property for length
            this.rowsContext.splice(ri, 0, undefined);
            // update rowsClass property for length
            this.rowsClass.splice(ri, 0, undefined);
        }
        this.dataChange.emit();
    }
    /**
     * Deletes `index`th row.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param index
     */
    deleteRow(index) {
        const rri = this.realRowIndex(index);
        this.data.splice(rri, 1);
        this.rowsSelected.splice(rri, 1);
        this.rowsExpanded.splice(rri, 1);
        this.rowsContext.splice(rri, 1);
        this.rowsClass.splice(rri, 1);
        this.dataChange.emit();
    }
    hasExpandableRows() {
        return this.data.some((data) => data.some((d) => d && d.expandedData)); // checking for some in 2D array
    }
    isRowExpandable(index) {
        return this.data[index].some((d) => d && d.expandedData);
    }
    isRowExpanded(index) {
        return this.rowsExpanded[index];
    }
    getRowContext(index) {
        return this.rowsContext[index];
    }
    /**
     * Returns `index`th column of the table.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param index
     */
    column(index) {
        let column = new Array();
        const ri = this.realColumnIndex(index);
        const rc = this.data.length;
        for (let i = 0; i < rc; i++) {
            const row = this.data[i];
            column.push(row[ri]);
        }
        return column;
    }
    /**
     * Adds a column to the `index`th column or appends to table if index not provided.
     *
     * If column is shorter than other columns or not provided, it will be padded with
     * empty `TableItem` elements.
     *
     * If column is longer than other columns, others will be extended to match so no data is lost.
     *
     * If called on an empty table with no parameters, it creates a 1x1 table.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param [column]
     * @param [index]
     */
    addColumn(column, index) {
        // if table empty create table with row
        if (!this.data || this.data.length === 0 || this.data[0].length === 0) {
            let newData = new Array();
            if (column == null) {
                newData.push([new TableItem()]);
            }
            else {
                for (let i = 0; i < column.length; i++) {
                    let item = column[i];
                    newData.push([item]);
                }
            }
            this.data = newData;
            return;
        }
        let rc = this.data.length; // row count
        let ci = this.realColumnIndex(index);
        // append missing rows
        for (let i = 0; column != null && i < column.length - rc; i++) {
            this.addRow();
        }
        rc = this.data.length;
        if (index == null) {
            // append to end
            for (let i = 0; i < rc; i++) {
                let row = this.data[i];
                row.push(column == null || column[i] == null ? new TableItem() : column[i]);
            }
            // update header if not already set by user
            if (this.header.length < this.data[0].length) {
                this.header.push(new TableHeaderItem());
            }
        }
        else {
            if (index >= this.data[0].length) {
                // if trying to append
                ci++;
            }
            // insert
            for (let i = 0; i < rc; i++) {
                let row = this.data[i];
                row.splice(ci, 0, column == null || column[i] == null ? new TableItem() : column[i]);
            }
            // update header if not already set by user
            if (this.header.length < this.data[0].length) {
                this.header.splice(ci, 0, new TableHeaderItem());
            }
        }
        this.dataChange.emit();
    }
    /**
     * Deletes `index`th column.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param index
     */
    deleteColumn(index) {
        const rci = this.realColumnIndex(index);
        const rowCount = this.data.length;
        for (let i = 0; i < rowCount; i++) {
            this.data[i].splice(rci, 1);
        }
        // update header if not already set by user
        if (this.header.length > this.data[0].length) {
            this.header.splice(rci, 1);
        }
        this.dataChange.emit();
    }
    moveColumn(indexFrom, indexTo) {
        const headerFrom = this.header[indexFrom];
        this.addColumn(this.column(indexFrom), indexTo);
        this.deleteColumn(indexFrom + (indexTo < indexFrom ? 1 : 0));
        this.header[indexTo + (indexTo > indexFrom ? -1 : 0)] = headerFrom;
    }
    /**
     * Sorts the data currently present in the model based on `compare()`
     *
     * Direction is set by `ascending` and `descending` properties of `TableHeaderItem`
     * in `index`th column.
     *
     * @param index The column based on which it's sorting
     */
    sort(index) {
        const headerToSort = this.getHeader(index);
        this.pushRowStateToModelData();
        this.data.sort((a, b) => (headerToSort.descending ? -1 : 1) * headerToSort.compare(a[index], b[index]));
        this.popRowStateFromModelData();
        this.header.forEach((headerRow) => {
            headerRow.forEach((column) => {
                if (column) {
                    column.sorted = false;
                }
            });
        });
        headerToSort.sorted = true;
    }
    /**
     * Appends `rowsSelected` and `rowsExpanded` info to model data.
     *
     * When sorting rows, do this first so information about row selection
     * gets sorted with the other row info.
     *
     * Call `popRowSelectionFromModelData()` after sorting to make everything
     * right with the world again.
     */
    pushRowStateToModelData() {
        for (let i = 0; i < this.data.length; i++) {
            const rowSelectedMark = new TableItem();
            rowSelectedMark.data = this.rowsSelected[i];
            this.data[i].push(rowSelectedMark);
            const rowExpandedMark = new TableItem();
            rowExpandedMark.data = this.rowsExpanded[i];
            this.data[i].push(rowExpandedMark);
            const rowContext = new TableItem();
            rowContext.data = this.rowsContext[i];
            this.data[i].push(rowContext);
            const rowClass = new TableItem();
            rowClass.data = this.rowsClass[i];
            this.data[i].push(rowClass);
        }
    }
    /**
     * Restores `rowsSelected` from data pushed by `pushRowSelectionToModelData()`
     *
     * Call after sorting data (if you previously pushed to maintain selection order)
     * to make everything right with the world again.
     */
    popRowStateFromModelData() {
        for (let i = 0; i < this.data.length; i++) {
            this.rowsClass[i] = this.data[i].pop().data;
            this.rowsContext[i] = this.data[i].pop().data;
            this.rowsExpanded[i] = !!this.data[i].pop().data;
            this.rowsSelected[i] = !!this.data[i].pop().data;
        }
    }
    /**
     * Select/deselect `index`th row based on value
     *
     * @param index index of the row to select
     * @param value state to set the row to. Defaults to `true`
     */
    selectRow(index, value = true) {
        if (this.isRowDisabled(index)) {
            return;
        }
        this.rowsSelected[index] = value;
        this.rowsSelectedChange.emit(index);
    }
    /**
     * Selects or deselects all rows in the model
     *
     * @param value state to set all rows to. Defaults to `true`
     */
    selectAll(value = true) {
        if (this.data.length >= 1) {
            for (let i = 0; i < this.rowsSelected.length; i++) {
                this.selectRow(i, value);
            }
        }
        this.selectAllChange.next(value);
    }
    isRowSelected(index) {
        return this.rowsSelected[index];
    }
    /**
     * Checks if row is disabled or not.
     */
    isRowDisabled(index) {
        const row = this.data[index];
        return !!row.disabled;
    }
    /**
     * Expands/Collapses `index`th row based on value
     *
     * @param index index of the row to expand or collapse
     * @param value expanded state of the row. `true` is expanded and `false` is collapsed
     */
    expandRow(index, value = true) {
        this.rowsExpanded[index] = value;
        this.rowsExpandedChange.emit(index);
    }
    /**
     * Gets the true index of a row based on it's relative position.
     * Like in Python, positive numbers start from the top and
     * negative numbers start from the bottom.
     *
     * @param index
     */
    realRowIndex(index) {
        return this.realIndex(index, this.data.length);
    }
    /**
     * Gets the true index of a column based on it's relative position.
     * Like in Python, positive numbers start from the top and
     * negative numbers start from the bottom.
     *
     * @param index
     */
    realColumnIndex(index) {
        return this.realIndex(index, this.data[0].length);
    }
    /**
     * Generic function to calculate the real index of something.
     * Used by `realRowIndex()` and `realColumnIndex()`
     *
     * @param index
     * @param length
     */
    realIndex(index, length) {
        if (index == null) {
            return length - 1;
        }
        else if (index >= 0) {
            return index >= length ? length - 1 : index;
        }
        else {
            return -index >= length ? 0 : length + index;
        }
    }
}
/**
 * The number of models instantiated, used for (among other things) unique id generation
 */
SCTableModel.COUNT = 0;

class DraggableDirective {
    constructor() {
        this.imageOffset = { x: 0, y: 0 };
        this.start = new EventEmitter();
        this.end = new EventEmitter();
        this.draggable = true;
    }
    handleDragStart(event) {
        // 20 is half the element height
        // 4 is half of a mini-unit, which centers the drag on the handle
        event.dataTransfer.setDragImage(this.dragImage, this.imageOffset.x, this.imageOffset.y);
        event.dataTransfer.effectAllowed = 'move';
        this.start.emit();
    }
    handleEnd() {
        this.end.emit();
    }
}
DraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[scDraggable], [aiDraggable]',
            },] }
];
DraggableDirective.propDecorators = {
    dragImage: [{ type: Input }],
    imageOffset: [{ type: Input }],
    start: [{ type: Output }],
    end: [{ type: Output }],
    draggable: [{ type: HostBinding, args: ['attr.draggable',] }],
    handleDragStart: [{ type: HostListener, args: ['dragstart', ['$event'],] }],
    handleEnd: [{ type: HostListener, args: ['dragend',] }]
};

class DroppableDirective {
    constructor() {
        this.active = new EventEmitter();
        this.leave = new EventEmitter();
        this.dropping = new EventEmitter();
    }
    handleDrag(event) {
        event.preventDefault();
        this.active.emit(true);
    }
    handleDrop() {
        this.active.emit(false);
        this.dropping.emit();
    }
    handleLeave() {
        this.leave.emit();
    }
}
DroppableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[scDropzone], [aiDropzone]',
            },] }
];
DroppableDirective.propDecorators = {
    active: [{ type: Output }],
    leave: [{ type: Output }],
    dropping: [{ type: Output }],
    handleDrag: [{ type: HostListener, args: ['dragover', ['$event'],] }, { type: HostListener, args: ['dragenter', ['$event'],] }],
    handleDrop: [{ type: HostListener, args: ['drop',] }],
    handleLeave: [{ type: HostListener, args: ['dragleave',] }]
};

class DraggableModule {
}
DraggableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [DraggableDirective, DroppableDirective],
                imports: [CommonModule],
                exports: [DraggableDirective, DroppableDirective],
            },] }
];

/**
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-sortable-list-item component
 */
class SortableListItemComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.checked = true;
        this.disabled = false;
        this.dragActive = false;
        this.dragStart = new EventEmitter();
        this.dragEnd = new EventEmitter();
        this.move = new EventEmitter();
    }
}
SortableListItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-sortable-list-item',
                template: `
    <div
      class="drag-marker"
      [ngClass]="{
        active: dragActive
      }"
    ></div>
    <div class="wrapper" [ngClass]="{ disabled: disabled }">
      <div
        class="handle"
        scDraggable
        [dragImage]="elementRef.nativeElement"
        [imageOffset]="{ x: 4, y: 20 }"
        (start)="!disabled ? dragStart.emit() : null"
        (end)="!disabled ? dragEnd.emit() : null"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 32 32"
        >
          <path
            d="M10 6H14V10H10zM18 6H22V10H18zM10 14H14V18H10zM18 14H22V18H18zM10 22H14V26H10zM18 22H22V26H18z"
          ></path>
        </svg>
      </div>
      <div class="content">
        <ibm-checkbox [checked]="checked" [disabled]="disabled">
          <ng-content></ng-content>
        </ibm-checkbox>
        <ibm-overflow-menu [flip]="true">
          <ibm-overflow-menu-option (selected)="move.emit('up')" [disabled]="disabled"
            >Move up</ibm-overflow-menu-option
          >
          <ibm-overflow-menu-option (selected)="move.emit('down')" [disabled]="disabled"
            >Move down</ibm-overflow-menu-option
          >
        </ibm-overflow-menu>
      </div>
    </div>
  `,
                styles: [":host{display:list-item;height:2.5rem;margin-bottom:.5rem;padding-left:1rem;padding-right:1rem}.drag-marker{border:1px solid #4589ff;display:none}.drag-marker.active{display:block}.wrapper{align-items:center;display:flex;height:100%;width:100%}.handle{cursor:pointer}.content{align-items:center;background:#f4f4f4;display:flex;height:100%;margin-left:.5rem;padding-left:1rem;padding-right:.5rem;width:100%}"]
            },] }
];
SortableListItemComponent.ctorParameters = () => [
    { type: ElementRef }
];
SortableListItemComponent.propDecorators = {
    checked: [{ type: Input }],
    disabled: [{ type: Input }],
    dragActive: [{ type: Input }],
    dragStart: [{ type: Output }],
    dragEnd: [{ type: Output }],
    move: [{ type: Output }]
};

/**
 * **Warning:** This component will be deprecated in the future in favour of a spec compliant ai-sortable-list component
 */
class SortableListComponent {
    constructor() {
        this.itemsChange = new EventEmitter();
        this.dragging = null;
        this.dragOver = null;
    }
    trackByFn(index, item) {
        return item;
    }
    dragStart(item) {
        this.dragging = item;
    }
    active(item) {
        this.dragOver = item;
    }
    leave() {
        this.dragOver = null;
    }
    isActive(item) {
        return this.dragOver === item;
    }
    end() {
        this.dragOver = null;
        this.dragging = null;
    }
    handleDrop() {
        if (!this.dragging) {
            return;
        }
        this.items = this.insertBefore(this.dragging, this.dragOver);
        this.end();
        this.itemsChange.emit(this.items);
    }
    handleMove(direction, item) {
        const itemIndex = this.items.indexOf(item);
        if (direction === 'up') {
            if (!this.items[itemIndex - 1]) {
                return;
            }
            this.items = this.insertBefore(item, this.items[itemIndex - 1]);
        }
        else if (direction === 'down') {
            const baseItem = this.items[itemIndex + 2] ? this.items[itemIndex + 2] : 'bottom';
            this.items = this.insertBefore(item, baseItem);
        }
    }
    insertBefore(itemToMove, baseItem) {
        const tmpItems = Array.from(this.items);
        const itemToMoveIndex = tmpItems.indexOf(itemToMove);
        tmpItems.splice(itemToMoveIndex, 1);
        if (baseItem === 'bottom') {
            tmpItems.push(itemToMove);
        }
        else {
            const insertionPointIndex = tmpItems.indexOf(baseItem);
            tmpItems.splice(insertionPointIndex, 0, itemToMove);
        }
        return tmpItems;
    }
}
SortableListComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-sortable-list',
                template: `
    <ol>
      <ng-container *ngFor="let item of items; trackBy: trackByFn">
        <li
          scDropzone
          class="dropzone"
          [ngClass]="{
            active: isActive(item),
            visible: dragging
          }"
          (dropping)="handleDrop()"
          (active)="active(item)"
          (leave)="leave()"
        >
          <div class="line"></div>
        </li>
        <sc-sortable-list-item
          [disabled]="item.disabled"
          (dragStart)="dragStart(item)"
          (dragEnd)="end()"
          (move)="handleMove($event, item)"
        >
          <ng-container *ngIf="!item.template">{{ item?.content | async }}</ng-container>
          <ng-template
            *ngIf="item.template"
            [ngTemplateOutlet]="item.template"
            [ngTemplateOutletContext]="item"
          >
          </ng-template>
        </sc-sortable-list-item>
      </ng-container>
      <li
        scDropzone
        class="dropzone bottom"
        [ngClass]="{
          active: isActive('bottom'),
          visible: dragging
        }"
        (dropping)="handleDrop()"
        (active)="active('bottom')"
        (leave)="leave()"
      >
        <div class="line"></div>
      </li>
    </ol>
  `,
                styles: ["ol{padding-bottom:4px;padding-top:4px;position:relative}.dropzone{display:none;height:2.5rem;margin-top:-28px;padding-left:1rem;padding-right:1rem;position:absolute;width:100%}.dropzone.active .line{border-top:1px solid #0f62fe;position:relative;top:24px;width:100%}.visible{display:block}"]
            },] }
];
SortableListComponent.propDecorators = {
    items: [{ type: Input }],
    itemsChange: [{ type: Output }]
};

class SortableListModule {
}
SortableListModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SortableListComponent, SortableListItemComponent],
                imports: [CommonModule, CheckboxModule, DialogModule, DraggableModule],
                exports: [SortableListComponent, SortableListItemComponent],
            },] }
];

class BaseSetting {
    constructor(options) {
        this.staged = {};
        this.content = new BehaviorSubject(null);
        this.contentObservable = this.content.asObservable();
        this.contentSubscription = new Subscription();
        this._inputs = new Map();
        this._outputs = new Map();
        this.setContent(options.content);
        this.setTemplate(options.template);
        this.options = options.options;
    }
    getContent() {
        return this.contentObservable;
    }
    setContent(content) {
        if (isObservable(content)) {
            this.contentSubscription.unsubscribe();
            this.contentSubscription = content.subscribe((value) => {
                this.content.next(value);
            });
        }
        else {
            this.content.next(content);
        }
    }
    getTemplate() {
        return this.template;
    }
    setTemplate(template) {
        this.template = template;
    }
    /**
     * gets a map of input names to values
     *
     * By default returns a map of 'options' to `this.options`
     */
    getInputs() {
        return this._inputs;
    }
    getOutputs() {
        return this._outputs;
    }
    toJSON() {
        let jsonOptions = null;
        if (this.options) {
            jsonOptions = this.options.map((option) => option.toJSON ? option.toJSON() : JSON.parse(JSON.stringify(option)));
        }
        return {
            content: this.content.value,
            options: jsonOptions,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    onChanges(changes) {
        for (const [key, value] of Object.entries(changes)) {
            this.staged[key] = value;
        }
    }
    commit() {
        for (const [key, value] of Object.entries(this.staged)) {
            this[key] = value;
        }
    }
}

// disable max-classes-per-file since these are very small classes
class SortableListOption {
    constructor(options) {
        this.contentSubject = new BehaviorSubject(null);
        this.contentSubscription = new Subscription();
        this.setContent(options.content);
        this.template = options.template;
        this.order = options.order;
        this.options = options.options;
        this.disabled = options.disabled;
        this.content = this.contentSubject.asObservable();
    }
    getContent() {
        return this.content;
    }
    setContent(content) {
        if (isObservable(content)) {
            this.contentSubscription.unsubscribe();
            this.contentSubscription = content.subscribe((value) => {
                this.contentSubject.next(value);
            });
        }
        else {
            this.contentSubject.next(content);
        }
    }
    toJSON() {
        const jsonOptions = this.options ? this.options.map((option) => option.toJSON()) : [];
        return {
            content: this.contentSubject.value,
            disabled: this.disabled,
            order: this.order,
            options: jsonOptions,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
class SortableList extends BaseSetting {
    constructor(options) {
        super(options);
        this.component = SortableListComponent;
        this._outputs = new Map([['itemsChange', this.onChanges.bind(this)]]);
        this._inputs = new Map([['items', this.options]]);
        // this.options must be set before setting the value (if any)
        this.options = options.options;
        this.setContent(options.content);
        this.setTemplate(options.template);
    }
    getInputs() {
        return this._inputs;
    }
    getOutputs() {
        return this._outputs;
    }
    onChanges(value) {
        this.stagedOptions = value;
    }
    commit() {
        this.options = this.stagedOptions;
    }
}

class TableSettingsPane {
    constructor(options) {
        this.settings = [];
        if (options.settings) {
            this.settings = options.settings;
        }
        this.content = options.content;
        this.title = options.title;
    }
    addSetting(setting) {
        this.settings.push(setting);
    }
    setSettings(settings) {
        this.settings = settings;
    }
    getSettings() {
        return this.settings;
    }
    getContent() {
        if (isObservable(this.content)) {
            return this.content;
        }
        return of(this.content);
    }
    toJSON() {
        let jsonSettings = [];
        if (this.settings) {
            jsonSettings = this.settings.map((setting) => setting.toJSON());
        }
        const jsonContent = this.content ? this.content.toString() : null;
        return {
            settings: jsonSettings,
            content: jsonContent,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    commit() {
        this.settings.forEach((setting) => setting.commit());
    }
}

// tslint:disable: max-classes-per-file
class TableSettings {
    constructor(options) {
        this.panes = [];
        if (options.panes) {
            this.panes = options.panes;
        }
        this.content = options.content;
        this.title = options.title;
        this.template = options.template;
    }
    addPane(paneOrOptions) {
        if (paneOrOptions instanceof TableSettingsPane) {
            this.panes.push(paneOrOptions);
        }
        else {
            this.panes.push(new TableSettingsPane(paneOrOptions));
        }
    }
    setPanes(panes) {
        this.panes = panes;
    }
    getPanes() {
        return this.panes;
    }
    getContent() {
        if (isObservable(this.content)) {
            return this.content;
        }
        return of(this.content);
    }
    toJSON() {
        let jsonPanes = [];
        if (this.panes) {
            jsonPanes = this.panes.map((pane) => pane.toJSON());
        }
        const jsonContent = this.content ? this.content.toString() : null;
        const jsonTitle = this.title ? this.title.toString() : null;
        return {
            content: jsonContent,
            title: jsonTitle,
            panes: jsonPanes,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    commit() {
        this.panes.forEach((pane) => pane.commit());
    }
}

class TableSettingsModalComponent extends BaseModal {
    constructor(model, modelChange) {
        super();
        this.model = model;
        this.modelChange = modelChange;
        this.listComponent = SortableListComponent;
        this.settingsModelChange = new EventEmitter();
    }
    ngOnInit() {
        if (this.settingsModel) {
            this.model = this.settingsModel;
        }
    }
    cancel() {
        this.closeModal();
    }
    acceptChanges() {
        this.model.commit();
        this.settingsModelChange.emit(this.model);
        if (this.modelChange) {
            this.modelChange.next(this.model);
        }
        this.closeModal();
    }
}
TableSettingsModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-table-settings-modal, ai-table-settings-modal',
                template: `
    <ibm-modal (overlaySelected)="closeModal()" [hasScrollingContent]="false" [open]="open">
      <ibm-modal-header (closeSelect)="closeModal()">
        <p class="bx--modal-header__heading bx--type-beta">{{ model.title }}</p>
      </ibm-modal-header>
      <div class="bx--modal-content content">
        <ng-container *ngIf="!model.template">{{ model.getContent() | async }}</ng-container>
        <ng-template
          *ngIf="model.template"
          [ngTemplateOutlet]="model.template"
          [ngTemplateOutletContext]="model"
        >
        </ng-template>
        <ibm-tabs>
          <ibm-tab *ngFor="let pane of model.getPanes()" [heading]="pane.title">
            <p>{{ pane.getContent() | async }}</p>
            <div *ngFor="let setting of pane.getSettings()">
              <p>{{ setting.getContent() | async }}</p>
              <ng-template
                [ngTemplateOutlet]="setting.getTemplate()"
                [ngTemplateOutletContext]="setting"
              ></ng-template>
              <ng-container
                *scComponentOutlet="
                  setting.component;
                  inputs: setting.getInputs();
                  outputs: setting.getOutputs()
                "
              >
              </ng-container>
            </div>
          </ibm-tab>
        </ibm-tabs>
      </div>
      <ibm-modal-footer>
        <button ibmButton="secondary" (click)="cancel()">Cancel</button>
        <button ibmButton="primary" (click)="acceptChanges()">Okay</button>
      </ibm-modal-footer>
    </ibm-modal>
  `,
                styles: [".content{overflow-y:visible;padding-right:1rem}"]
            },] }
];
TableSettingsModalComponent.ctorParameters = () => [
    { type: TableSettings, decorators: [{ type: Optional }, { type: Inject, args: ['model',] }] },
    { type: Subject, decorators: [{ type: Optional }, { type: Inject, args: ['modelChange',] }] }
];
TableSettingsModalComponent.propDecorators = {
    settingsModel: [{ type: Input }],
    settingsModelChange: [{ type: Output }]
};

class ComponentOutletDirective {
    constructor(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
        this.scComponentOutletInputs = new Map();
        this.scComponentOutletOutputs = new Map();
        this._componentRef = null;
        this._moduleRef = null;
    }
    // end copy
    ngOnChanges(changes) {
        // tslint:disable-next-line
        // copied from https://github.com/angular/angular/blob/263bbd43c1808f1201bc4b50fe76e8fbba672c51/packages/common/src/directives/ng_component_outlet.ts#L10-L116
        this._viewContainerRef.clear();
        this._componentRef = null;
        if (this.scComponentOutlet) {
            const elInjector = this.scComponentOutletInjector || this._viewContainerRef.parentInjector;
            if (changes['scComponentOutletNgModuleFactory']) {
                if (this._moduleRef) {
                    this._moduleRef.destroy();
                }
                if (this.scComponentOutletNgModuleFactory) {
                    const parentModule = elInjector.get(NgModuleRef);
                    this._moduleRef = this.scComponentOutletNgModuleFactory.create(parentModule.injector);
                }
                else {
                    this._moduleRef = null;
                }
            }
            const componentFactoryResolver = this._moduleRef
                ? this._moduleRef.componentFactoryResolver
                : elInjector.get(ComponentFactoryResolver);
            const componentFactory = componentFactoryResolver.resolveComponentFactory(this.scComponentOutlet);
            this._componentRef = this._viewContainerRef.createComponent(componentFactory, this._viewContainerRef.length, elInjector, this.scComponentOutletContent);
        }
        // end copy
        if (changes.scComponentOutletInputs) {
            const inputs = Array.from(changes.scComponentOutletInputs.currentValue);
            for (const [key, value] of inputs) {
                this['_componentRef']['instance'][key] = value;
            }
        }
        if (changes.scComponentOutletOutputs) {
            const outputs = Array.from(changes.scComponentOutletOutputs.currentValue);
            for (const [key, value] of outputs) {
                this['_componentRef']['instance'][key].subscribe((event) => {
                    value(event);
                });
            }
        }
    }
    // tslint:disable-next-line
    // copied from https://github.com/angular/angular/blob/263bbd43c1808f1201bc4b50fe76e8fbba672c51/packages/common/src/directives/ng_component_outlet.ts#L10-L116
    ngOnDestroy() {
        if (this._moduleRef) {
            this._moduleRef.destroy();
        }
    }
}
ComponentOutletDirective.decorators = [
    { type: Directive, args: [{
                selector: '[scComponentOutlet], [aiComponentOutlet]',
            },] }
];
ComponentOutletDirective.ctorParameters = () => [
    { type: ViewContainerRef }
];
ComponentOutletDirective.propDecorators = {
    scComponentOutletInputs: [{ type: Input }],
    scComponentOutletOutputs: [{ type: Input }],
    scComponentOutlet: [{ type: Input }],
    scComponentOutletInjector: [{ type: Input }],
    scComponentOutletContent: [{ type: Input }],
    scComponentOutletNgModuleFactory: [{ type: Input }]
};

class UtilsModule {
}
UtilsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ComponentOutletDirective],
                exports: [ComponentOutletDirective],
                imports: [CommonModule],
            },] }
];

class CheckboxSettingComponent {
    constructor() {
        this.optionsChange = new EventEmitter();
    }
    getContent(option) {
        if (isObservable(option.content)) {
            return option.content;
        }
        return of(option.content);
    }
    onChange(event, eventOption) {
        const changes = {
            options: this.options.map((option) => {
                if (option === eventOption) {
                    return Object.assign({}, option, { checked: event.checked });
                }
                return option;
            }),
        };
        this.optionsChange.emit(changes);
    }
}
CheckboxSettingComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-checkbox-setting, ai-checkbox-setting',
                template: `
    <ibm-checkbox
      *ngFor="let option of options"
      [checked]="option.checked"
      (change)="onChange($event, option)"
    >
      {{ getContent(option) | async }}
    </ibm-checkbox>
  `
            },] }
];
CheckboxSettingComponent.propDecorators = {
    options: [{ type: Input }],
    optionsChange: [{ type: Output }]
};

class RadioSettingComponent {
    constructor() {
        this.activeChange = new EventEmitter();
    }
    getContent(option) {
        if (isObservable(option.content)) {
            return option.content;
        }
        return of(option.content);
    }
    onChange(event) {
        this.activeChange.emit({ active: event.value });
    }
}
RadioSettingComponent.decorators = [
    { type: Component, args: [{
                selector: 'sc-radio-setting, ai-radio-setting',
                template: `
    <ibm-radio-group>
      <ibm-radio
        *ngFor="let option of options"
        [checked]="option.value === active"
        [value]="option.value"
        (change)="onChange($event)"
      >
        {{ getContent(option) | async }}
      </ibm-radio>
    </ibm-radio-group>
  `
            },] }
];
RadioSettingComponent.propDecorators = {
    options: [{ type: Input }],
    active: [{ type: Input }],
    activeChange: [{ type: Output }]
};

class TableSettingsService {
    constructor(modalService) {
        this.modalService = modalService;
        this.closeSubject = new Subject();
        this.onClose = this.closeSubject.asObservable();
    }
    openSettings(settingsModel) {
        if (this.modalRef) {
            return;
        }
        this.modalRef = this.modalService.create({
            component: TableSettingsModalComponent,
            inputs: {
                model: settingsModel,
            },
        });
        this.modalRef.instance.close.subscribe(() => {
            this.closeSubject.next();
        });
    }
    closeSettings() {
        if (!this.modalRef) {
            return;
        }
        this.modalRef.instance.closeModal();
        this.modalRef = null;
    }
}
TableSettingsService.decorators = [
    { type: Injectable }
];
TableSettingsService.ctorParameters = () => [
    { type: ModalService }
];

class TableSettingsModule {
}
TableSettingsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [TableSettingsModalComponent, CheckboxSettingComponent, RadioSettingComponent],
                exports: [TableSettingsModalComponent, CheckboxSettingComponent, RadioSettingComponent],
                providers: [TableSettingsService],
                imports: [
                    CommonModule,
                    BrowserAnimationsModule,
                    SortableListModule,
                    ModalModule,
                    ButtonModule,
                    DialogModule,
                    UtilsModule,
                    TabsModule,
                    CheckboxModule,
                    RadioModule,
                ],
                entryComponents: [SortableListComponent, CheckboxSettingComponent, RadioSettingComponent],
            },] }
];

class CheckboxSetting extends BaseSetting {
    constructor(options) {
        super(options);
        this.component = CheckboxSettingComponent;
        this.options = options.options;
        this._inputs.set('options', options.options);
        this._outputs.set('optionsChange', this.onChanges.bind(this));
    }
}

class RadioSetting extends BaseSetting {
    constructor(options) {
        super(options);
        this.component = RadioSettingComponent;
        this.options = options.options;
        this.active = options.active;
        this._inputs.set('options', options.options);
        this._inputs.set('active', options.active);
        this._outputs.set('activeChange', this.onChanges.bind(this));
    }
    toJSON() {
        let jsonOptions = null;
        if (this.options) {
            jsonOptions = this.options.map((option) => option.toJSON ? option.toJSON() : JSON.parse(JSON.stringify(option)));
        }
        return {
            content: this.content.value,
            options: jsonOptions,
            active: this.active,
        };
    }
}

class ComponentSetting extends BaseSetting {
    constructor(options) {
        super(options);
        this.component = options.component;
        if (options.inputs) {
            this._inputs = new Map(Object.entries(options.inputs));
        }
        if (options.outputs) {
            this._outputs = new Map(Object.entries(options.outputs));
        }
    }
    getInputs() {
        return this._inputs;
    }
    getOutputs() {
        return this._outputs;
    }
}

// export directly from the index file to work around some bugs with

/**
 * Generated bundle index. Do not edit.
 */

export { BaseSetting, CheckboxSetting, CheckboxSettingComponent, ComponentOutletDirective, ComponentSetting, DraggableDirective, DraggableModule, DroppableDirective, PageHeaderComponent, PageHeaderModule, RadioSetting, RadioSettingComponent, SCTableComponent, SCTableHeadCell, SCTableHeadComponent, SCTableModel, SCTableModule, SortableList, SortableListComponent, SortableListItemComponent, SortableListModule, SortableListOption, TableSettings, TableSettingsModalComponent, TableSettingsModule, TableSettingsPane, TableSettingsService, UtilsModule, itemsWithTitle };
//# sourceMappingURL=ai-apps-angular-toolkit.js.map
