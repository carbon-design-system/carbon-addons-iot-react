/**
 *
 * @ai-apps/angular v2.155.1 | sterling-table-model.class.d.ts
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


import { EventEmitter } from '@angular/core';
import { TableHeaderItem, TableItem } from 'carbon-components-angular';
import { HeaderType } from 'carbon-components-angular/table/table-model.class';
import { Subject } from 'rxjs';
export declare class SCTableModel {
    /**
     * The number of models instantiated, used for (among other things) unique id generation
     */
    protected static COUNT: number;
    headerChange: Subject<unknown>;
    dataChange: EventEmitter<any>;
    rowsSelectedChange: EventEmitter<number>;
    rowsExpandedChange: EventEmitter<number>;
    /**
     * Gets emitted when `selectAll` is called. Emits false if all rows are deselected and true if
     * all rows are selected.
     */
    selectAllChange: Subject<boolean>;
    /**
     * Contains information about the header cells of the table.
     */
    set header(newHeader: any);
    get header(): any;
    /**
     * Sets data of the table.
     *
     * Make sure all rows are the same length to keep the column count accurate.
     */
    set data(newData: TableItem[][]);
    /**
     * Gets the full data.
     *
     * You can use it to alter individual `TableItem`s but if you need to change
     * table structure, use `addRow()` and/or `addColumn()`
     */
    get data(): TableItem[][];
    /**
     * Contains information about selection state of rows in the table.
     */
    rowsSelected: boolean[];
    /**
     * Contains information about expanded state of rows in the table.
     */
    rowsExpanded: boolean[];
    /**
     * Contains information about the context of the row.
     *
     * It affects styling of the row to reflect the context.
     *
     * string can be one of `"success" | "warning" | "info" | "error" | ""` and it's
     * empty or undefined by default
     */
    rowsContext: string[];
    /**
     * Contains class name(s) of the row.
     *
     * It affects styling of the row to reflect the appended class name(s).
     *
     * It's empty or undefined by default
     */
    rowsClass: string[];
    /**
     * Tracks the current page.
     */
    currentPage: number;
    /**
     * Length of page.
     */
    pageLength: number;
    /**
     * Set to true when there is no more data to load in the table
     */
    isEnd: boolean;
    /**
     * Set to true when lazy loading to show loading indicator
     */
    isLoading: boolean;
    /**
     * Absolute total number of rows of the table.
     */
    protected _totalDataLength: number;
    /**
     * Manually set data length in case the data in the table doesn't
     * correctly reflect all the data that table is to display.
     *
     * Example: if you have multiple pages of data that table will display
     * but you're loading one at a time.
     *
     * Set to `null` to reset to default behavior.
     */
    set totalDataLength(length: number);
    /**
     * Total length of data that table has access to, or the amount manually set
     */
    get totalDataLength(): number;
    /**
     * Used in `data`
     */
    protected _data: TableItem[][];
    protected _header: TableHeaderItem[][];
    /**
     * The number of models instantiated, this is to make sure each table has a different
     * model count for unique id generation.
     */
    protected tableModelCount: number;
    constructor();
    isRowFiltered(index: number): boolean;
    /**
     * Returns an id for the given column
     *
     * @param column the column to generate an id for
     * @param row the row of the header to generate an id for
     */
    getId(column: HeaderType, row?: number): string;
    getHeaderId(column: number | 'select' | 'expand', colSpan?: number): string;
    /**
     * Finds closest header by trying the lowest cell in header and then work its way to the left
     * @param column
     */
    getHeader(column: any): any;
    /**
     * Returns how many rows is currently selected
     */
    selectedRowsCount(): number;
    /**
     * Returns how many rows is currently expanded
     */
    expandedRowsCount(): number;
    /**
     * Returns `index`th row of the table.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param index
     */
    row(index: number): TableItem[];
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
    addRow(row?: TableItem[], index?: number): void;
    /**
     * Deletes `index`th row.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param index
     */
    deleteRow(index: number): void;
    hasExpandableRows(): boolean;
    isRowExpandable(index: number): boolean;
    isRowExpanded(index: number): boolean;
    getRowContext(index: number): string;
    /**
     * Returns `index`th column of the table.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param index
     */
    column(index: number): TableItem[];
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
    addColumn(column?: TableItem[], index?: number): void;
    /**
     * Deletes `index`th column.
     *
     * Negative index starts from the end. -1 being the last element.
     *
     * @param index
     */
    deleteColumn(index: number): void;
    moveColumn(indexFrom: number, indexTo: number): void;
    /**
     * Sorts the data currently present in the model based on `compare()`
     *
     * Direction is set by `ascending` and `descending` properties of `TableHeaderItem`
     * in `index`th column.
     *
     * @param index The column based on which it's sorting
     */
    sort(index: number): void;
    /**
     * Appends `rowsSelected` and `rowsExpanded` info to model data.
     *
     * When sorting rows, do this first so information about row selection
     * gets sorted with the other row info.
     *
     * Call `popRowSelectionFromModelData()` after sorting to make everything
     * right with the world again.
     */
    pushRowStateToModelData(): void;
    /**
     * Restores `rowsSelected` from data pushed by `pushRowSelectionToModelData()`
     *
     * Call after sorting data (if you previously pushed to maintain selection order)
     * to make everything right with the world again.
     */
    popRowStateFromModelData(): void;
    /**
     * Select/deselect `index`th row based on value
     *
     * @param index index of the row to select
     * @param value state to set the row to. Defaults to `true`
     */
    selectRow(index: number, value?: boolean): void;
    /**
     * Selects or deselects all rows in the model
     *
     * @param value state to set all rows to. Defaults to `true`
     */
    selectAll(value?: boolean): void;
    isRowSelected(index: number): boolean;
    /**
     * Checks if row is disabled or not.
     */
    isRowDisabled(index: number): boolean;
    /**
     * Expands/Collapses `index`th row based on value
     *
     * @param index index of the row to expand or collapse
     * @param value expanded state of the row. `true` is expanded and `false` is collapsed
     */
    expandRow(index: number, value?: boolean): void;
    /**
     * Gets the true index of a row based on it's relative position.
     * Like in Python, positive numbers start from the top and
     * negative numbers start from the bottom.
     *
     * @param index
     */
    protected realRowIndex(index: number): number;
    /**
     * Gets the true index of a column based on it's relative position.
     * Like in Python, positive numbers start from the top and
     * negative numbers start from the bottom.
     *
     * @param index
     */
    protected realColumnIndex(index: number): number;
    /**
     * Generic function to calculate the real index of something.
     * Used by `realRowIndex()` and `realColumnIndex()`
     *
     * @param index
     * @param length
     */
    protected realIndex(index: number, length: number): number;
}
