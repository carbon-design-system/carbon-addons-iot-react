/**
 *
 * @ai-apps/angular v2.155.1 | table-model.class.d.ts
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


import { PaginationModel, TableHeaderItem, TableItem } from 'carbon-components-angular';
import { Subject } from 'rxjs';
export declare type HeaderType = number | 'select' | 'expand';
export declare class AITableHeaderItem extends TableHeaderItem {
    /**
     * Defines the alignment of the the header item and the column below it.
     */
    alignment: 'start' | 'center' | 'end';
    constructor(rawData?: any);
}
/**
 * TableModel represents a data model for two-dimensional data. It's used for all things table
 * (table component, table toolbar, pagination, etc)
 *
 * TableModel manages its internal data integrity very well if you use the provided helper
 * functions for modifying rows and columns and assigning header and data in that order.
 */
export declare class AITableModel implements PaginationModel {
    /**
     * The number of models instantiated, used for (among other things) unique id generation
     */
    protected static COUNT: number;
    dataChange: Subject<unknown>;
    rowsSelectedChange: Subject<number>;
    rowsExpandedChange: Subject<number>;
    /**
     * Gets emitted when `selectAll` is called. Emits false if all rows are deselected and true if
     * all rows are selected.
     */
    selectAllChange: Subject<boolean>;
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
    /**
     * Contains information about the header cells of the table.
     */
    protected header: AITableHeaderItem[][];
    /**
     * The number of models instantiated, this is to make sure each table has a different
     * model count for unique id generation.
     */
    protected tableModelCount: number;
    /**
     * Contains information about selection state of rows in the table.
     */
    protected rowsSelected: boolean[];
    /**
     * Contains information about expanded state of rows in the table.
     */
    protected rowsExpanded: boolean[];
    /**
     * Contains information about the context of the row.
     *
     * It affects styling of the row to reflect the context.
     *
     * string can be one of `"success" | "warning" | "info" | "error" | ""` and it's
     * empty or undefined by default
     */
    protected rowsContext: string[];
    constructor();
    /**
     * Sets data of the table.
     *
     * Make sure all rows are the same length to keep the column count accurate.
     */
    setData(newData: TableItem[][]): void;
    /**
     * Sets data of the table.
     *
     * Make sure all rows are the same length to keep the column count accurate.
     */
    setHeader(newHeader: TableHeaderItem[][] | TableHeaderItem[] | AITableHeaderItem[][] | AITableHeaderItem[]): void;
    setItem(rowIndex: number, columnIndex: number, item: TableItem): void;
    setItemData(rowIndex: number, columnIndex: number, data: any): void;
    /**
     * Returns an id for the given column
     *
     * @param column the column to generate an id for
     * @param row the row of the header to generate an id for
     */
    getId(column: HeaderType, row?: number): string;
    /**
     * Returns the id of the header. Used to link the cells with headers (or headers with headers)
     *
     * @param column the column to start getting headers for
     * @param colSpan the number of columns to get headers for (defaults to 1)
     */
    getHeaderId(column: HeaderType, colSpan?: number): string;
    /**
     * Finds closest header by trying the lowest cell in header and then work its way to the left
     * @param column
     */
    getClosestHeader(column: any): AITableHeaderItem;
    /**
     * @returns a list of indices of selected rows
     */
    selectedRowIndices(): number[];
    /**
     * Returns how many rows is currently selected
     */
    selectedRowsCount(): number;
    /**
     * @returns a list of indices of expanded rows
     */
    expandedRowIndices(): number[];
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
     * Returns all the rows.
     *
     * Use `row()` instead.
     */
    rows(): TableItem[][];
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
    rowMetaInfo(index: number): {
        selected: boolean;
        expanded: boolean;
        expandable: boolean;
        context: string;
        rowClass: string;
    };
    hasExpandableRows(): boolean;
    isRowExpandable(index: number): boolean;
    isRowExpanded(index: number): boolean;
    getRowContext(index: number): string;
    setRowContext(index: number, context: string): string;
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
    /**
     * Move the column at `indexFrom` to `indexTo` of the `rowIndex` row
     *
     * _Note: only works with one row headers at the moment_
     *
     * If headers have merged cells, they should only be merged in a way that a higher row
     * contains all the lower row columns and not vice versa
     *
     * Multiline header example *(good)*:
     *
     * | h1  |           h2          ||||
     * | h11 |    h12    ||    h13   ||
     * | h21 | h22 | h23 | h24 | h25 |
     * |-----|-----|-----|-----|-----|
     * |  a  |  b  |  c  |  d  |  e  |
     * |  f  |  g  |  h  |  i  |  j  |
     *
     * Multiline header example *(not good)*:
     *
     * | h1  |           h2          ||||
     * | h21 | h22 | h23 | h24 | h25 |
     * | h11 |    h12    ||    h13   ||
     * |-----|-----|-----|-----|-----|
     * |  a  |  b  |  c  |  d  |  e  |
     * |  f  |  g  |  h  |  i  |  j  |
     *
     * ## Usage example:
     *
     * ### Moving h2 in place of h1
     *
     * `model.moveColumn(1, 0)`
     *
     * *Before*
     *
     * | h1  |           h2          ||||
     * | h11 |    h12    ||    h13   ||
     * | h21 | h22 | h23 | h24 | h25 |
     * |-----|-----|-----|-----|-----|
     * |  a  |  b  |  c  |  d  |  e  |
     * |  f  |  g  |  h  |  i  |  j  |
     *
     * *After*
     *
     * |           h2          | h1  ||||
     * |    h12    ||    h13   | h11 ||
     * | h22 | h23 | h24 | h25 | h21 |
     * |-----|-----|-----|-----|-----|
     * |  b  |  c  |  d  |  e  |  a  |
     * |  g  |  h  |  i  |  j  |  f  |
     *
     * ### Moving h13 in place of h12
     *
     * `model.moveColumn(2, 1, 1)`
     *
     * *Before*
     *
     * | h1  |           h2          ||||
     * | h11 |    h12    ||    h13   ||
     * | h21 | h22 | h23 | h24 | h25 |
     * |-----|-----|-----|-----|-----|
     * |  a  |  b  |  c  |  d  |  e  |
     * |  f  |  g  |  h  |  i  |  j  |
     *
     * *After*
     *
     * | h1  |           h2          ||||
     * | h11 |    h13    ||    h12   ||
     * | h21 | h24 | h25 | h22 | h23 |
     * |-----|-----|-----|-----|-----|
     * |  a  |  d  |  e  |  b  |  c  |
     * |  f  |  i  |  j  |  g  |  h  |
     *
     * ### Moving h24 in place of h25
     *
     * `model.moveColumn(3, 4, 2)`
     *
     * _Note: while you_ could _move h24 to h22, you shouldn't because it doesn't belong under_
     * _the same subheader._
     *
     * *Before*
     *
     * | h1  |           h2          ||||
     * | h11 |    h12    ||    h13   ||
     * | h21 | h22 | h23 | h24 | h25 |
     * |-----|-----|-----|-----|-----|
     * |  a  |  b  |  c  |  d  |  e  |
     * |  f  |  g  |  h  |  i  |  j  |
     *
     * *After*
     *
     * | h1  |           h2          ||||
     * | h11 |    h12    ||    h13   ||
     * | h21 | h22 | h23 | h25 | h24 |
     * |-----|-----|-----|-----|-----|
     * |  a  |  b  |  c  |  e  |  d  |
     * |  f  |  g  |  h  |  j  |  i  |
     */
    moveColumn(indexFrom: number, indexTo: number, rowIndex?: number): void;
    /**
     * Sorts the data currently present in the model based on `compare()`
     *
     * Direction is set by `ascending` and `descending` properties of `AITableHeaderItem`
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
     * Checks if row is filtered out.
     *
     * @param index
     * @returns true if any of the filters in header filters out the `index`th row
     */
    isRowFiltered(index: number): boolean;
    /**
     * Select/deselect `index`th row based on value
     *
     * @param index index of the row to select
     * @param value state to set the row to. Defaults to `true`
     */
    selectRow(index: number, value?: boolean, emitChange?: boolean): void;
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
    protected projectedRowLengthSimple(itemArray: any[]): any;
    /**
     * @param itemArray TableItem[] | AITableHeaderItem[]
     * @returns the number of columns as if now cells were merged
     */
    protected projectedRowLength(itemArray: any[], rowIndex?: number, matrix?: any[][]): any;
    /**
     * Convert a projected index to actual index, where actual index is the index in the list
     * that's passed in
     * @param projectedIndex index of a column if none of the cells were merged
     * @param list a row of the header or the body
     */
    protected projectedIndexToActualIndex(projectedIndex: number, list: AITableHeaderItem[] | TableItem[]): number;
    /**
     * Convert an actual index to a projected indices array
     * @param actualIndex index of a column as-is
     * @param list a row of the header or the body
     */
    protected actualIndexToProjectedIndices(actualIndex: number, list: AITableHeaderItem[] | TableItem[]): number[];
    protected projectedIndicesToActualIndices(projectedIndices: number[], list: AITableHeaderItem[] | TableItem[]): number[];
    protected moveMultipleToIndex(indices: number[], index: any, list: AITableHeaderItem[] | TableItem[]): void;
    protected tabularToNested(headerRow?: AITableHeaderItem[], availableHeaderItems?: AITableHeaderItem[][], leafIndexRef?: {
        current: number;
    }, rowIndex?: number): any;
    protected nestedToTabular(nested: any, header?: AITableHeaderItem[][], data?: TableItem[][], rowIndex?: number): {
        header: AITableHeaderItem[][];
        data: TableItem[][];
    };
    /**
     * Move `nested` element at `rowIndex` with index `indexFrom` to `indexTo`.
     */
    protected moveNested(nested: any, indexFrom: number, indexTo: number, rowIndex?: number, startingChildIndex?: number): void;
}
