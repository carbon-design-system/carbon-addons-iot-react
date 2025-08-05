/**
 *
 * @ai-apps/angular v2.155.1 | table-model.class.js
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


import { TableHeaderItem, TableItem } from 'carbon-components-angular';
import { Subject } from 'rxjs';
export class AITableHeaderItem extends TableHeaderItem {
    constructor(rawData) {
        super(rawData);
        /**
         * Defines the alignment of the the header item and the column below it.
         */
        this.alignment = 'start';
        const defaults = {
            alignment: this.alignment,
        };
        // fill our object with provided props, and fallback to defaults
        Object.assign(this, defaults, rawData);
    }
}
/**
 * TableModel represents a data model for two-dimensional data. It's used for all things table
 * (table component, table toolbar, pagination, etc)
 *
 * TableModel manages its internal data integrity very well if you use the provided helper
 * functions for modifying rows and columns and assigning header and data in that order.
 */
export class AITableModel {
    constructor() {
        this.dataChange = new Subject();
        this.rowsSelectedChange = new Subject();
        this.rowsExpandedChange = new Subject();
        /**
         * Gets emitted when `selectAll` is called. Emits false if all rows are deselected and true if
         * all rows are selected.
         */
        this.selectAllChange = new Subject();
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
        /**
         * Contains information about the header cells of the table.
         */
        this.header = [[]];
        /**
         * The number of models instantiated, this is to make sure each table has a different
         * model count for unique id generation.
         */
        this.tableModelCount = 0;
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
        this.tableModelCount = AITableModel.COUNT++;
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
        if (this._data && this._data.length === 1 && this._data[0].length === 0) {
            return 0;
        }
        return this._data.length;
    }
    /**
     * Sets data of the table.
     *
     * Make sure all rows are the same length to keep the column count accurate.
     */
    setData(newData) {
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
        if (this.header == null) {
            const newHeader = [[]];
            // disable this tslint here since we don't actually want to
            // loop the contents of the data
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this._data[0].length; i++) {
                newHeader[0].push(new AITableHeaderItem());
            }
            this.header = newHeader;
        }
        else {
            this.header.forEach((headerRow, rowIndex) => {
                const projectedRowLength = this.projectedRowLength(headerRow, rowIndex, this.header);
                if (projectedRowLength < this._data[0].length && this._data[0].length > 0) {
                    const difference = this._data[0].length - projectedRowLength;
                    // disable this tslint here since we don't actually want to
                    // loop the difference between contents of data and projected header row length
                    // tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < difference; i++) {
                        headerRow.push(new AITableHeaderItem());
                    }
                }
            });
        }
        this.dataChange.next();
    }
    /**
     * Sets data of the table.
     *
     * Make sure all rows are the same length to keep the column count accurate.
     */
    setHeader(newHeader) {
        if (!newHeader) {
            newHeader = [[]];
        }
        else if (Array.isArray(newHeader) && newHeader.length > 0 && !Array.isArray(newHeader[0])) {
            newHeader = [newHeader];
        }
        else if (Array.isArray(newHeader) && newHeader.length === 0) {
            newHeader = [[]];
        }
        newHeader = newHeader.map((row) => row.map((col) => col.constructor.name === 'AITableHeaderItem' ? col : new AITableHeaderItem(col)));
        this.header = newHeader;
        this.dataChange.next();
    }
    setItem(rowIndex, columnIndex, item) {
        this._data[rowIndex][columnIndex] = item;
        // TODO make sure changes are reflected in the table
    }
    setItemData(rowIndex, columnIndex, data) {
        this._data[rowIndex][columnIndex].data = data;
        // TODO make sure changes are reflected in the table
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
    /**
     * Returns the id of the header. Used to link the cells with headers (or headers with headers)
     *
     * @param column the column to start getting headers for
     * @param colSpan the number of columns to get headers for (defaults to 1)
     */
    getHeaderId(column, colSpan = 1) {
        if (column === 'select' || column === 'expand') {
            return this.getId(column);
        }
        let ids = [];
        for (let i = column; i >= 0; i--) {
            if (this.header[i]) {
                for (let j = 0; j < colSpan; j++) {
                    ids.push(this.getId(i + j));
                }
                break;
            }
        }
        return ids.join(' ');
    }
    /**
     * Finds closest header by trying the lowest cell in header and then work its way to the left
     * @param column
     */
    getClosestHeader(column) {
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
     * @returns a list of indices of selected rows
     */
    selectedRowIndices() {
        return this.rowsSelected.reduce((acc, current, index) => {
            if (current) {
                return [...acc, index];
            }
            return acc;
        }, []);
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
     * @returns a list of indices of expanded rows
     */
    expandedRowIndices() {
        return this.rowsExpanded.reduce((acc, current, index) => {
            if (current) {
                return [...acc, index];
            }
            return acc;
        }, []);
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
        return this._data[this.realRowIndex(index)];
    }
    /**
     * Returns all the rows.
     *
     * Use `row()` instead.
     */
    rows() {
        return this._data;
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
        if (!this._data || this._data.length === 0 || this._data[0].length === 0) {
            let newData = new Array();
            newData.push(row ? row : [new TableItem()]); // row or one empty one column row
            this.setData(newData);
            return;
        }
        let realRow = row;
        const columnCount = this._data[0].length;
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
            let difference = realRow.length - this.projectedRowLength(this.header[0], 0, this.header);
            for (let j = 0; j < difference; j++) {
                // add to the first header row and row-span to fill the height of the header
                const headerItem = new AITableHeaderItem();
                headerItem.rowSpan = this.header.length;
                this.header[0].push(headerItem);
            }
            // extend the length of every other row
            for (let i = 0; i < this._data.length; i++) {
                let currentRow = this._data[i];
                difference = realRow.length - currentRow.length;
                for (let j = 0; j < difference; j++) {
                    currentRow.push(new TableItem());
                }
            }
        }
        if (index == null) {
            this._data.push(realRow);
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
            this._data.splice(ri, 0, realRow);
            // update rowsSelected property for length
            this.rowsSelected.splice(ri, 0, false);
            // update rowsExpanded property for length
            this.rowsExpanded.splice(ri, 0, false);
            // update rowsContext property for length
            this.rowsContext.splice(ri, 0, undefined);
            // update rowsClass property for length
            this.rowsClass.splice(ri, 0, undefined);
        }
        this.dataChange.next();
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
        this._data.splice(rri, 1);
        this.rowsSelected.splice(rri, 1);
        this.rowsExpanded.splice(rri, 1);
        this.rowsContext.splice(rri, 1);
        this.rowsClass.splice(rri, 1);
        this.dataChange.next();
    }
    rowMetaInfo(index) {
        return {
            selected: this.rowsSelected[index],
            expanded: this.rowsExpanded[index],
            expandable: this.isRowExpandable(index),
            context: this.rowsContext[index],
            rowClass: this.rowsClass[index],
        };
    }
    hasExpandableRows() {
        return this._data.some((data) => data.some((d) => d && d.expandedData)); // checking for some in 2D array
    }
    isRowExpandable(index) {
        return this._data[index].some((d) => d && d.expandedData);
    }
    isRowExpanded(index) {
        return this.rowsExpanded[index];
    }
    getRowContext(index) {
        return this.rowsContext[index];
    }
    setRowContext(index, context) {
        return (this.rowsContext[index] = context);
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
        const rc = this._data.length;
        for (let i = 0; i < rc; i++) {
            const row = this._data[i];
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
        if (!this._data || this._data.length === 0 || this._data[0].length === 0) {
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
            this.setData(newData);
            return;
        }
        let rc = this._data.length; // row count
        let ci = this.realColumnIndex(index);
        // append missing rows
        for (let i = 0; column != null && i < column.length - rc; i++) {
            this.addRow();
        }
        rc = this._data.length;
        if (index == null) {
            // append to end
            for (let i = 0; i < rc; i++) {
                let row = this._data[i];
                row.push(column == null || column[i] == null ? new TableItem() : column[i]);
            }
            // update header if not already set by user
            if (this.header.length > 0 && this.header[0].length < this._data[0].length) {
                // add to the first header row and row-span to fill the height of the header
                const headerItem = new AITableHeaderItem();
                headerItem.rowSpan = this.header.length;
                this.header[0].push(headerItem);
            }
        }
        else {
            if (index >= this._data[0].length) {
                // if trying to append
                ci++;
            }
            // insert
            for (let i = 0; i < rc; i++) {
                let row = this._data[i];
                row.splice(ci, 0, column == null || column[i] == null ? new TableItem() : column[i]);
            }
            // update header if not already set by user
            if (this.header.length > 0 && this.header[0].length < this._data[0].length) {
                // add to the first header row and row-span to fill the height of the header
                const headerItem = new AITableHeaderItem();
                headerItem.rowSpan = this.header.length;
                // this.header[0].push(headerItem);
                this.header[0].splice(ci, 0, headerItem);
            }
        }
        this.dataChange.next();
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
        const rowCount = this._data.length;
        for (let i = 0; i < rowCount; i++) {
            this._data[i].splice(rci, 1);
        }
        // update header if not already set by user
        if (this.header.length > 0 && this.header[0].length > this._data[0].length) {
            for (let i = 0; i < this.header.length; i++) {
                const headerRow = this.header[i];
                headerRow.splice(rci, 1);
            }
        }
        this.dataChange.next();
    }
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
    moveColumn(indexFrom, indexTo, rowIndex = 0) {
        const nested = this.tabularToNested();
        this.moveNested(nested, indexFrom, indexTo, rowIndex);
        const { header, data } = this.nestedToTabular(nested);
        this.header = header;
        this._data = data;
    }
    /**
     * Sorts the data currently present in the model based on `compare()`
     *
     * Direction is set by `ascending` and `descending` properties of `AITableHeaderItem`
     * in `index`th column.
     *
     * @param index The column based on which it's sorting
     */
    sort(index) {
        const headerToSort = this.getClosestHeader(index);
        this.pushRowStateToModelData();
        this._data.sort((a, b) => (headerToSort.descending ? -1 : 1) * headerToSort.compare(a[index], b[index]));
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
        for (let i = 0; i < this._data.length; i++) {
            const rowSelectedMark = new TableItem();
            rowSelectedMark.data = this.rowsSelected[i];
            this._data[i].push(rowSelectedMark);
            const rowExpandedMark = new TableItem();
            rowExpandedMark.data = this.rowsExpanded[i];
            this._data[i].push(rowExpandedMark);
            const rowContext = new TableItem();
            rowContext.data = this.rowsContext[i];
            this._data[i].push(rowContext);
            const rowClass = new TableItem();
            rowClass.data = this.rowsClass[i];
            this._data[i].push(rowClass);
        }
    }
    /**
     * Restores `rowsSelected` from data pushed by `pushRowSelectionToModelData()`
     *
     * Call after sorting data (if you previously pushed to maintain selection order)
     * to make everything right with the world again.
     */
    popRowStateFromModelData() {
        for (let i = 0; i < this._data.length; i++) {
            this.rowsClass[i] = this._data[i].pop().data;
            this.rowsContext[i] = this._data[i].pop().data;
            this.rowsExpanded[i] = !!this._data[i].pop().data;
            this.rowsSelected[i] = !!this._data[i].pop().data;
        }
    }
    /**
     * Checks if row is filtered out.
     *
     * @param index
     * @returns true if any of the filters in header filters out the `index`th row
     */
    isRowFiltered(index) {
        const realIndex = this.realRowIndex(index);
        return this.header.some((headerRow) => headerRow.some((item, i) => item && item.filter(this.row(realIndex)[i])));
    }
    /**
     * Select/deselect `index`th row based on value
     *
     * @param index index of the row to select
     * @param value state to set the row to. Defaults to `true`
     */
    selectRow(index, value = true, emitChange = true) {
        if (this.isRowDisabled(index)) {
            return;
        }
        this.rowsSelected[index] = value;
        if (emitChange) {
            this.rowsSelectedChange.next(index);
        }
    }
    /**
     * Selects or deselects all rows in the model
     *
     * @param value state to set all rows to. Defaults to `true`
     */
    selectAll(value = true) {
        if (this._data.length >= 1) {
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
        const row = this._data[index];
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
        this.rowsExpandedChange.next(index);
    }
    /**
     * Gets the true index of a row based on it's relative position.
     * Like in Python, positive numbers start from the top and
     * negative numbers start from the bottom.
     *
     * @param index
     */
    realRowIndex(index) {
        return this.realIndex(index, this._data.length);
    }
    /**
     * Gets the true index of a column based on it's relative position.
     * Like in Python, positive numbers start from the top and
     * negative numbers start from the bottom.
     *
     * @param index
     */
    realColumnIndex(index) {
        return this.realIndex(index, this._data[0].length);
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
    projectedRowLengthSimple(itemArray) {
        return itemArray.reduce((len, item) => len + (item ? item.colSpan || 1 : 0), 0);
    }
    /**
     * @param itemArray TableItem[] | AITableHeaderItem[]
     * @returns the number of columns as if now cells were merged
     */
    projectedRowLength(itemArray, rowIndex, matrix) {
        // `any[]` should be `AITableItem[] | AITableHeaderItem[]` but typescript
        if (rowIndex === undefined || matrix === undefined) {
            return this.projectedRowLengthSimple(itemArray);
        }
        // the rest of the function takes into account row spans
        const rowLengths = matrix.map((row) => this.projectedRowLengthSimple(row));
        for (let index = 0; index < rowIndex; index++) {
            const row = matrix[index];
            row.forEach((item) => {
                if (item && item.rowSpan) {
                    // increment all row lengths that the span covers
                    for (let i = index + 1; i < index + 1 + item.rowSpan; i++) {
                        rowLengths[i]++;
                    }
                }
            });
        }
        return rowLengths[rowIndex];
    }
    /**
     * Convert a projected index to actual index, where actual index is the index in the list
     * that's passed in
     * @param projectedIndex index of a column if none of the cells were merged
     * @param list a row of the header or the body
     */
    projectedIndexToActualIndex(projectedIndex, list) {
        let index = 0;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            index += (item === null || item === void 0 ? void 0 : item.colSpan) || 1;
            if (index > projectedIndex) {
                return i;
            }
        }
        return list.length - 1;
    }
    /**
     * Convert an actual index to a projected indices array
     * @param actualIndex index of a column as-is
     * @param list a row of the header or the body
     */
    actualIndexToProjectedIndices(actualIndex, list) {
        // find the starting projected index
        let startingIndex = 0;
        for (let i = 0; i < actualIndex; i++) {
            const item = list[i];
            startingIndex += item.colSpan || 1;
        }
        return new Array(list[actualIndex].colSpan).fill(0).map((_, index) => startingIndex + index);
    }
    projectedIndicesToActualIndices(projectedIndices, list) {
        const actualIndicesSet = new Set();
        for (let projectedIndex of projectedIndices) {
            actualIndicesSet.add(this.projectedIndexToActualIndex(projectedIndex, list));
        }
        return Array.from(actualIndicesSet).sort();
    }
    moveMultipleToIndex(indices, index, list) {
        // assumes indices is sorted low to high and continuous
        // NOTE might need to generalize it
        const blockStart = indices[0];
        const blockEnd = indices[indices.length - 1];
        // if moving to left
        if (blockStart > index) {
            const block = list.splice(blockStart, blockEnd - blockStart + 1);
            list.splice.apply(list, [index, 0].concat(block));
        }
        else {
            // if moving to right
            const block = list.slice(blockStart, blockEnd + 1);
            list.splice.apply(list, [index + 1, 0].concat(block));
            list.splice(blockStart, blockEnd - blockStart + 1);
        }
    }
    tabularToNested(headerRow = [], availableHeaderItems = [], 
    // This allows us to walk the leaves as if they were in a list from left to right.
    // We need to pass by reference so that we can update this value from within the recursion.
    leafIndexRef = { current: 0 }, rowIndex = 0) {
        if (!headerRow.length && rowIndex === 0) {
            headerRow = this.header[0];
        }
        if (!availableHeaderItems.length) {
            availableHeaderItems = this.header.map((headerRow) => headerRow.filter((headerItem) => headerItem !== null));
        }
        return headerRow
            .filter((headerItem) => headerItem !== null)
            .map((headerItem, i) => {
            const colSpan = (headerItem === null || headerItem === void 0 ? void 0 : headerItem.colSpan) || 1;
            const rowSpan = (headerItem === null || headerItem === void 0 ? void 0 : headerItem.rowSpan) || 1;
            // Leaf
            if (rowIndex + rowSpan >= this.header.length) {
                const leafIndex = leafIndexRef.current;
                leafIndexRef.current += colSpan;
                return {
                    headerItem,
                    leafIndex,
                    rowIndex,
                    children: [],
                };
            }
            let spaceLeft = colSpan;
            const availableChildren = availableHeaderItems[rowIndex + rowSpan];
            const children = [];
            while (spaceLeft > 0 && availableChildren.length) {
                const nextChild = availableChildren.shift();
                spaceLeft -= (nextChild === null || nextChild === void 0 ? void 0 : nextChild.colSpan) || 1;
                children.push(nextChild);
            }
            return {
                headerItem,
                leafIndex: -1,
                rowIndex,
                children: this.tabularToNested(children, availableHeaderItems, leafIndexRef, rowIndex + rowSpan),
            };
        });
    }
    nestedToTabular(nested, header = new Array(this.header.length).fill([]), data = new Array(this._data.length).fill([]), rowIndex = 0) {
        nested.forEach((headerObj) => {
            var _a, _b;
            const rowSpan = ((_a = headerObj.headerItem) === null || _a === void 0 ? void 0 : _a.rowSpan) || 1;
            const colSpan = ((_b = headerObj.headerItem) === null || _b === void 0 ? void 0 : _b.colSpan) || 1;
            header[rowIndex] = [...header[rowIndex], headerObj.headerItem];
            if (headerObj.leafIndex >= 0) {
                for (let i = 0; i < data.length; i++) {
                    data[i] = [
                        ...data[i],
                        ...this._data[i].slice(headerObj.leafIndex, headerObj.leafIndex + colSpan),
                    ];
                }
            }
            if (rowIndex + rowSpan >= this.header.length) {
                return;
            }
            const children = headerObj.children;
            this.nestedToTabular(children, header, data, rowIndex + rowSpan);
        });
        return {
            header,
            data,
        };
    }
    /**
     * Move `nested` element at `rowIndex` with index `indexFrom` to `indexTo`.
     */
    moveNested(nested, indexFrom, indexTo, rowIndex = 0, startingChildIndex = 0) {
        if (!nested.length) {
            return;
        }
        const currentRowIndex = nested[0].rowIndex;
        if (currentRowIndex === rowIndex &&
            startingChildIndex <= indexFrom &&
            startingChildIndex + nested.length >= indexFrom &&
            startingChildIndex <= indexTo &&
            startingChildIndex + nested.length >= indexTo) {
            this.moveMultipleToIndex([indexFrom - startingChildIndex], indexTo - startingChildIndex, nested);
            return;
        }
        nested.forEach((headerObj, i) => {
            var _a, _b, _c;
            const rowSpan = ((_a = headerObj.headerItem) === null || _a === void 0 ? void 0 : _a.rowSpan) || 1;
            const children = headerObj.children;
            this.moveNested(children, indexFrom, indexTo, rowIndex, (_b = this.header[currentRowIndex + rowSpan]) === null || _b === void 0 ? void 0 : _b.indexOf((_c = children[0]) === null || _c === void 0 ? void 0 : _c.headerItem));
        });
    }
}
/**
 * The number of models instantiated, used for (among other things) unique id generation
 */
AITableModel.COUNT = 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtbW9kZWwuY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdGFibGUvdGFibGUtbW9kZWwuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFtQixlQUFlLEVBQUUsU0FBUyxFQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFDbEcsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUkvQixNQUFNLE9BQU8saUJBQWtCLFNBQVEsZUFBZTtJQU1wRCxZQUFZLE9BQWE7UUFDdkIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBTmpCOztXQUVHO1FBQ0gsY0FBUyxHQUErQixPQUFPLENBQUM7UUFLOUMsTUFBTSxRQUFRLEdBQUc7WUFDZixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7U0FDMUIsQ0FBQztRQUVGLGdFQUFnRTtRQUNoRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQztDQUNGO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFPLFlBQVk7SUFvSHZCO1FBOUdBLGVBQVUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzNCLHVCQUFrQixHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7UUFDM0MsdUJBQWtCLEdBQUcsSUFBSSxPQUFPLEVBQVUsQ0FBQztRQUMzQzs7O1dBR0c7UUFDSCxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFFekM7Ozs7OztXQU1HO1FBQ0gsY0FBUyxHQUFhLEVBQUUsQ0FBQztRQUV6Qjs7V0FFRztRQUNILGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBRWhCOztXQUVHO1FBQ0gsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUVoQjs7V0FFRztRQUNILFVBQUssR0FBRyxLQUFLLENBQUM7UUFFZDs7V0FFRztRQUNILGNBQVMsR0FBRyxLQUFLLENBQUM7UUFzQ2xC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R0FBRyxPQUFBLFNBQVMsQ0FBQyxVQUFVLDBDQUFFLE9BQU8sS0FBSSxDQUFDLENBQUM7WUFDbkQsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztZQUNwQyxJQUFJLENBQUMsVUFBVSxDQUNiLFFBQVEsRUFDUixTQUFTLEVBQ1QsT0FBTyxFQUNQLFFBQVEsUUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsMENBQUUsT0FBTyxPQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsMENBQUUsVUFBVSxFQUN4RSxDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOztBQXBtQ0Q7O0dBRUc7QUFDYyxrQkFBSyxHQUFHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhZ2luYXRpb25Nb2RlbCwgVGFibGVIZWFkZXJJdGVtLCBUYWJsZUl0ZW0sIFRhYmxlUm93IH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCB0eXBlIEhlYWRlclR5cGUgPSBudW1iZXIgfCAnc2VsZWN0JyB8ICdleHBhbmQnO1xuXG5leHBvcnQgY2xhc3MgQUlUYWJsZUhlYWRlckl0ZW0gZXh0ZW5kcyBUYWJsZUhlYWRlckl0ZW0ge1xuICAvKipcbiAgICogRGVmaW5lcyB0aGUgYWxpZ25tZW50IG9mIHRoZSB0aGUgaGVhZGVyIGl0ZW0gYW5kIHRoZSBjb2x1bW4gYmVsb3cgaXQuXG4gICAqL1xuICBhbGlnbm1lbnQ6ICdzdGFydCcgfCAnY2VudGVyJyB8ICdlbmQnID0gJ3N0YXJ0JztcblxuICBjb25zdHJ1Y3RvcihyYXdEYXRhPzogYW55KSB7XG4gICAgc3VwZXIocmF3RGF0YSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGFsaWdubWVudDogdGhpcy5hbGlnbm1lbnQsXG4gICAgfTtcblxuICAgIC8vIGZpbGwgb3VyIG9iamVjdCB3aXRoIHByb3ZpZGVkIHByb3BzLCBhbmQgZmFsbGJhY2sgdG8gZGVmYXVsdHNcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGRlZmF1bHRzLCByYXdEYXRhKTtcbiAgfVxufVxuXG4vKipcbiAqIFRhYmxlTW9kZWwgcmVwcmVzZW50cyBhIGRhdGEgbW9kZWwgZm9yIHR3by1kaW1lbnNpb25hbCBkYXRhLiBJdCdzIHVzZWQgZm9yIGFsbCB0aGluZ3MgdGFibGVcbiAqICh0YWJsZSBjb21wb25lbnQsIHRhYmxlIHRvb2xiYXIsIHBhZ2luYXRpb24sIGV0YylcbiAqXG4gKiBUYWJsZU1vZGVsIG1hbmFnZXMgaXRzIGludGVybmFsIGRhdGEgaW50ZWdyaXR5IHZlcnkgd2VsbCBpZiB5b3UgdXNlIHRoZSBwcm92aWRlZCBoZWxwZXJcbiAqIGZ1bmN0aW9ucyBmb3IgbW9kaWZ5aW5nIHJvd3MgYW5kIGNvbHVtbnMgYW5kIGFzc2lnbmluZyBoZWFkZXIgYW5kIGRhdGEgaW4gdGhhdCBvcmRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEFJVGFibGVNb2RlbCBpbXBsZW1lbnRzIFBhZ2luYXRpb25Nb2RlbCB7XG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1vZGVscyBpbnN0YW50aWF0ZWQsIHVzZWQgZm9yIChhbW9uZyBvdGhlciB0aGluZ3MpIHVuaXF1ZSBpZCBnZW5lcmF0aW9uXG4gICAqL1xuICBwcm90ZWN0ZWQgc3RhdGljIENPVU5UID0gMDtcblxuICBkYXRhQ2hhbmdlID0gbmV3IFN1YmplY3QoKTtcbiAgcm93c1NlbGVjdGVkQ2hhbmdlID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpO1xuICByb3dzRXhwYW5kZWRDaGFuZ2UgPSBuZXcgU3ViamVjdDxudW1iZXI+KCk7XG4gIC8qKlxuICAgKiBHZXRzIGVtaXR0ZWQgd2hlbiBgc2VsZWN0QWxsYCBpcyBjYWxsZWQuIEVtaXRzIGZhbHNlIGlmIGFsbCByb3dzIGFyZSBkZXNlbGVjdGVkIGFuZCB0cnVlIGlmXG4gICAqIGFsbCByb3dzIGFyZSBzZWxlY3RlZC5cbiAgICovXG4gIHNlbGVjdEFsbENoYW5nZSA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIGNsYXNzIG5hbWUocykgb2YgdGhlIHJvdy5cbiAgICpcbiAgICogSXQgYWZmZWN0cyBzdHlsaW5nIG9mIHRoZSByb3cgdG8gcmVmbGVjdCB0aGUgYXBwZW5kZWQgY2xhc3MgbmFtZShzKS5cbiAgICpcbiAgICogSXQncyBlbXB0eSBvciB1bmRlZmluZWQgYnkgZGVmYXVsdFxuICAgKi9cbiAgcm93c0NsYXNzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBUcmFja3MgdGhlIGN1cnJlbnQgcGFnZS5cbiAgICovXG4gIGN1cnJlbnRQYWdlID0gMTtcblxuICAvKipcbiAgICogTGVuZ3RoIG9mIHBhZ2UuXG4gICAqL1xuICBwYWdlTGVuZ3RoID0gMTA7XG5cbiAgLyoqXG4gICAqIFNldCB0byB0cnVlIHdoZW4gdGhlcmUgaXMgbm8gbW9yZSBkYXRhIHRvIGxvYWQgaW4gdGhlIHRhYmxlXG4gICAqL1xuICBpc0VuZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTZXQgdG8gdHJ1ZSB3aGVuIGxhenkgbG9hZGluZyB0byBzaG93IGxvYWRpbmcgaW5kaWNhdG9yXG4gICAqL1xuICBpc0xvYWRpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICogQWJzb2x1dGUgdG90YWwgbnVtYmVyIG9mIHJvd3Mgb2YgdGhlIHRhYmxlLlxuICAgKi9cbiAgcHJvdGVjdGVkIF90b3RhbERhdGFMZW5ndGg6IG51bWJlcjtcblxuICAvKipcbiAgICogTWFudWFsbHkgc2V0IGRhdGEgbGVuZ3RoIGluIGNhc2UgdGhlIGRhdGEgaW4gdGhlIHRhYmxlIGRvZXNuJ3RcbiAgICogY29ycmVjdGx5IHJlZmxlY3QgYWxsIHRoZSBkYXRhIHRoYXQgdGFibGUgaXMgdG8gZGlzcGxheS5cbiAgICpcbiAgICogRXhhbXBsZTogaWYgeW91IGhhdmUgbXVsdGlwbGUgcGFnZXMgb2YgZGF0YSB0aGF0IHRhYmxlIHdpbGwgZGlzcGxheVxuICAgKiBidXQgeW91J3JlIGxvYWRpbmcgb25lIGF0IGEgdGltZS5cbiAgICpcbiAgICogU2V0IHRvIGBudWxsYCB0byByZXNldCB0byBkZWZhdWx0IGJlaGF2aW9yLlxuICAgKi9cbiAgc2V0IHRvdGFsRGF0YUxlbmd0aChsZW5ndGg6IG51bWJlcikge1xuICAgIC8vIGlmIHRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGhvdXQgYSBwYXJhbWV0ZXIgd2UgbmVlZCB0byBzZXQgdG8gbnVsbCB0byBhdm9pZCBoYXZpbmcgdW5kZWZpbmVkICE9IG51bGxcbiAgICB0aGlzLl90b3RhbERhdGFMZW5ndGggPSBsZW5ndGggfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb3RhbCBsZW5ndGggb2YgZGF0YSB0aGF0IHRhYmxlIGhhcyBhY2Nlc3MgdG8sIG9yIHRoZSBhbW91bnQgbWFudWFsbHkgc2V0XG4gICAqL1xuICBnZXQgdG90YWxEYXRhTGVuZ3RoKCkge1xuICAgIC8vIGlmIG1hbnVhbGx5IHNldCBkYXRhIGxlbmd0aFxuICAgIGlmICh0aGlzLl90b3RhbERhdGFMZW5ndGggIT09IG51bGwgJiYgdGhpcy5fdG90YWxEYXRhTGVuZ3RoID49IDApIHtcbiAgICAgIHJldHVybiB0aGlzLl90b3RhbERhdGFMZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gaWYgZW1wdHkgZGF0YXNldFxuICAgIGlmICh0aGlzLl9kYXRhICYmIHRoaXMuX2RhdGEubGVuZ3RoID09PSAxICYmIHRoaXMuX2RhdGFbMF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZGF0YS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBpbiBgZGF0YWBcbiAgICovXG4gIHByb3RlY3RlZCBfZGF0YTogVGFibGVJdGVtW11bXSA9IFtbXV07XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBoZWFkZXIgY2VsbHMgb2YgdGhlIHRhYmxlLlxuICAgKi9cbiAgcHJvdGVjdGVkIGhlYWRlcjogQUlUYWJsZUhlYWRlckl0ZW1bXVtdID0gW1tdXTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBtb2RlbHMgaW5zdGFudGlhdGVkLCB0aGlzIGlzIHRvIG1ha2Ugc3VyZSBlYWNoIHRhYmxlIGhhcyBhIGRpZmZlcmVudFxuICAgKiBtb2RlbCBjb3VudCBmb3IgdW5pcXVlIGlkIGdlbmVyYXRpb24uXG4gICAqL1xuICBwcm90ZWN0ZWQgdGFibGVNb2RlbENvdW50ID0gMDtcblxuICAvKipcbiAgICogQ29udGFpbnMgaW5mb3JtYXRpb24gYWJvdXQgc2VsZWN0aW9uIHN0YXRlIG9mIHJvd3MgaW4gdGhlIHRhYmxlLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJvd3NTZWxlY3RlZDogYm9vbGVhbltdID0gW107XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IGV4cGFuZGVkIHN0YXRlIG9mIHJvd3MgaW4gdGhlIHRhYmxlLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJvd3NFeHBhbmRlZDogYm9vbGVhbltdID0gW107XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjb250ZXh0IG9mIHRoZSByb3cuXG4gICAqXG4gICAqIEl0IGFmZmVjdHMgc3R5bGluZyBvZiB0aGUgcm93IHRvIHJlZmxlY3QgdGhlIGNvbnRleHQuXG4gICAqXG4gICAqIHN0cmluZyBjYW4gYmUgb25lIG9mIGBcInN1Y2Nlc3NcIiB8IFwid2FybmluZ1wiIHwgXCJpbmZvXCIgfCBcImVycm9yXCIgfCBcIlwiYCBhbmQgaXQnc1xuICAgKiBlbXB0eSBvciB1bmRlZmluZWQgYnkgZGVmYXVsdFxuICAgKi9cbiAgcHJvdGVjdGVkIHJvd3NDb250ZXh0OiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGFibGVNb2RlbENvdW50ID0gQUlUYWJsZU1vZGVsLkNPVU5UKys7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBkYXRhIG9mIHRoZSB0YWJsZS5cbiAgICpcbiAgICogTWFrZSBzdXJlIGFsbCByb3dzIGFyZSB0aGUgc2FtZSBsZW5ndGggdG8ga2VlcCB0aGUgY29sdW1uIGNvdW50IGFjY3VyYXRlLlxuICAgKi9cbiAgc2V0RGF0YShuZXdEYXRhOiBUYWJsZUl0ZW1bXVtdKSB7XG4gICAgaWYgKCFuZXdEYXRhIHx8IChBcnJheS5pc0FycmF5KG5ld0RhdGEpICYmIG5ld0RhdGEubGVuZ3RoID09PSAwKSkge1xuICAgICAgbmV3RGF0YSA9IFtbXV07XG4gICAgfVxuXG4gICAgdGhpcy5fZGF0YSA9IG5ld0RhdGE7XG5cbiAgICAvLyBpbml0IHJvd3NTZWxlY3RlZFxuICAgIHRoaXMucm93c1NlbGVjdGVkID0gbmV3IEFycmF5PGJvb2xlYW4+KHRoaXMuX2RhdGEubGVuZ3RoKS5maWxsKGZhbHNlKTtcbiAgICB0aGlzLnJvd3NFeHBhbmRlZCA9IG5ldyBBcnJheTxib29sZWFuPih0aGlzLl9kYXRhLmxlbmd0aCkuZmlsbChmYWxzZSk7XG5cbiAgICAvLyBpbml0IHJvd3NDb250ZXh0XG4gICAgdGhpcy5yb3dzQ29udGV4dCA9IG5ldyBBcnJheTxzdHJpbmc+KHRoaXMuX2RhdGEubGVuZ3RoKTtcblxuICAgIC8vIGluaXQgcm93c0NsYXNzXG4gICAgdGhpcy5yb3dzQ2xhc3MgPSBuZXcgQXJyYXk8c3RyaW5nPih0aGlzLl9kYXRhLmxlbmd0aCk7XG5cbiAgICAvLyBvbmx5IGNyZWF0ZSBhIGZyZXNoIGhlYWRlciBpZiBuZWNlc3NhcnkgKGhlYWRlciBkb2Vzbid0IGV4aXN0IG9yIGRpZmZlcnMgaW4gbGVuZ3RoKVxuICAgIC8vIHRoaXMgd2lsbCBvbmx5IGNyZWF0ZSBhIHNpbmdsZSBsZXZlbCBvZiBoZWFkZXJzIChpdCB3aWxsIGRlc3Ryb3kgYW55IGV4aXN0aW5nIGhlYWRlciBpdGVtcylcbiAgICBpZiAodGhpcy5oZWFkZXIgPT0gbnVsbCkge1xuICAgICAgY29uc3QgbmV3SGVhZGVyID0gW1tdXTtcbiAgICAgIC8vIGRpc2FibGUgdGhpcyB0c2xpbnQgaGVyZSBzaW5jZSB3ZSBkb24ndCBhY3R1YWxseSB3YW50IHRvXG4gICAgICAvLyBsb29wIHRoZSBjb250ZW50cyBvZiB0aGUgZGF0YVxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBwcmVmZXItZm9yLW9mXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2RhdGFbMF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbmV3SGVhZGVyWzBdLnB1c2gobmV3IEFJVGFibGVIZWFkZXJJdGVtKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5oZWFkZXIgPSBuZXdIZWFkZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGVhZGVyLmZvckVhY2goKGhlYWRlclJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvamVjdGVkUm93TGVuZ3RoID0gdGhpcy5wcm9qZWN0ZWRSb3dMZW5ndGgoaGVhZGVyUm93LCByb3dJbmRleCwgdGhpcy5oZWFkZXIpO1xuICAgICAgICBpZiAocHJvamVjdGVkUm93TGVuZ3RoIDwgdGhpcy5fZGF0YVswXS5sZW5ndGggJiYgdGhpcy5fZGF0YVswXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IHRoaXMuX2RhdGFbMF0ubGVuZ3RoIC0gcHJvamVjdGVkUm93TGVuZ3RoO1xuICAgICAgICAgIC8vIGRpc2FibGUgdGhpcyB0c2xpbnQgaGVyZSBzaW5jZSB3ZSBkb24ndCBhY3R1YWxseSB3YW50IHRvXG4gICAgICAgICAgLy8gbG9vcCB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIGNvbnRlbnRzIG9mIGRhdGEgYW5kIHByb2plY3RlZCBoZWFkZXIgcm93IGxlbmd0aFxuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogcHJlZmVyLWZvci1vZlxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZmVyZW5jZTsgaSsrKSB7XG4gICAgICAgICAgICBoZWFkZXJSb3cucHVzaChuZXcgQUlUYWJsZUhlYWRlckl0ZW0oKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZGF0YSBvZiB0aGUgdGFibGUuXG4gICAqXG4gICAqIE1ha2Ugc3VyZSBhbGwgcm93cyBhcmUgdGhlIHNhbWUgbGVuZ3RoIHRvIGtlZXAgdGhlIGNvbHVtbiBjb3VudCBhY2N1cmF0ZS5cbiAgICovXG4gIHNldEhlYWRlcihcbiAgICBuZXdIZWFkZXI6IFRhYmxlSGVhZGVySXRlbVtdW10gfCBUYWJsZUhlYWRlckl0ZW1bXSB8IEFJVGFibGVIZWFkZXJJdGVtW11bXSB8IEFJVGFibGVIZWFkZXJJdGVtW11cbiAgKSB7XG4gICAgaWYgKCFuZXdIZWFkZXIpIHtcbiAgICAgIG5ld0hlYWRlciA9IFtbXV07XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG5ld0hlYWRlcikgJiYgbmV3SGVhZGVyLmxlbmd0aCA+IDAgJiYgIUFycmF5LmlzQXJyYXkobmV3SGVhZGVyWzBdKSkge1xuICAgICAgbmV3SGVhZGVyID0gW25ld0hlYWRlciBhcyBhbnldO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShuZXdIZWFkZXIpICYmIG5ld0hlYWRlci5sZW5ndGggPT09IDApIHtcbiAgICAgIG5ld0hlYWRlciA9IFtbXV07XG4gICAgfVxuXG4gICAgbmV3SGVhZGVyID0gKG5ld0hlYWRlciBhcyBhbnkpLm1hcCgocm93OiBhbnkpOiBBSVRhYmxlSGVhZGVySXRlbVtdID0+XG4gICAgICByb3cubWFwKFxuICAgICAgICAoY29sOiBhbnkpOiBBSVRhYmxlSGVhZGVySXRlbSA9PlxuICAgICAgICAgIGNvbC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnQUlUYWJsZUhlYWRlckl0ZW0nID8gY29sIDogbmV3IEFJVGFibGVIZWFkZXJJdGVtKGNvbClcbiAgICAgIClcbiAgICApO1xuXG4gICAgdGhpcy5oZWFkZXIgPSBuZXdIZWFkZXIgYXMgQUlUYWJsZUhlYWRlckl0ZW1bXVtdO1xuXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoKTtcbiAgfVxuXG4gIHNldEl0ZW0ocm93SW5kZXg6IG51bWJlciwgY29sdW1uSW5kZXg6IG51bWJlciwgaXRlbTogVGFibGVJdGVtKSB7XG4gICAgdGhpcy5fZGF0YVtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gaXRlbTtcbiAgICAvLyBUT0RPIG1ha2Ugc3VyZSBjaGFuZ2VzIGFyZSByZWZsZWN0ZWQgaW4gdGhlIHRhYmxlXG4gIH1cblxuICBzZXRJdGVtRGF0YShyb3dJbmRleDogbnVtYmVyLCBjb2x1bW5JbmRleDogbnVtYmVyLCBkYXRhOiBhbnkpIHtcbiAgICB0aGlzLl9kYXRhW3Jvd0luZGV4XVtjb2x1bW5JbmRleF0uZGF0YSA9IGRhdGE7XG4gICAgLy8gVE9ETyBtYWtlIHN1cmUgY2hhbmdlcyBhcmUgcmVmbGVjdGVkIGluIHRoZSB0YWJsZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaWQgZm9yIHRoZSBnaXZlbiBjb2x1bW5cbiAgICpcbiAgICogQHBhcmFtIGNvbHVtbiB0aGUgY29sdW1uIHRvIGdlbmVyYXRlIGFuIGlkIGZvclxuICAgKiBAcGFyYW0gcm93IHRoZSByb3cgb2YgdGhlIGhlYWRlciB0byBnZW5lcmF0ZSBhbiBpZCBmb3JcbiAgICovXG4gIGdldElkKGNvbHVtbjogSGVhZGVyVHlwZSwgcm93ID0gMCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGB0YWJsZS1oZWFkZXItJHtyb3d9LSR7Y29sdW1ufS0ke3RoaXMudGFibGVNb2RlbENvdW50fWA7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIGhlYWRlci4gVXNlZCB0byBsaW5rIHRoZSBjZWxscyB3aXRoIGhlYWRlcnMgKG9yIGhlYWRlcnMgd2l0aCBoZWFkZXJzKVxuICAgKlxuICAgKiBAcGFyYW0gY29sdW1uIHRoZSBjb2x1bW4gdG8gc3RhcnQgZ2V0dGluZyBoZWFkZXJzIGZvclxuICAgKiBAcGFyYW0gY29sU3BhbiB0aGUgbnVtYmVyIG9mIGNvbHVtbnMgdG8gZ2V0IGhlYWRlcnMgZm9yIChkZWZhdWx0cyB0byAxKVxuICAgKi9cbiAgZ2V0SGVhZGVySWQoY29sdW1uOiBIZWFkZXJUeXBlLCBjb2xTcGFuID0gMSk6IHN0cmluZyB7XG4gICAgaWYgKGNvbHVtbiA9PT0gJ3NlbGVjdCcgfHwgY29sdW1uID09PSAnZXhwYW5kJykge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SWQoY29sdW1uKTtcbiAgICB9XG5cbiAgICBsZXQgaWRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IGNvbHVtbjsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmICh0aGlzLmhlYWRlcltpXSkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbFNwYW47IGorKykge1xuICAgICAgICAgIGlkcy5wdXNoKHRoaXMuZ2V0SWQoaSArIGopKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBjbG9zZXN0IGhlYWRlciBieSB0cnlpbmcgdGhlIGxvd2VzdCBjZWxsIGluIGhlYWRlciBhbmQgdGhlbiB3b3JrIGl0cyB3YXkgdG8gdGhlIGxlZnRcbiAgICogQHBhcmFtIGNvbHVtblxuICAgKi9cbiAgZ2V0Q2xvc2VzdEhlYWRlcihjb2x1bW4pIHtcbiAgICBpZiAoIXRoaXMuaGVhZGVyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gdGhpcy5oZWFkZXIubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGhlYWRlckNlbGwgPSB0aGlzLmhlYWRlcltpXVtjb2x1bW5dO1xuXG4gICAgICBpZiAoaGVhZGVyQ2VsbCkge1xuICAgICAgICByZXR1cm4gaGVhZGVyQ2VsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gY29sdW1uOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgaGVhZGVyQ2VsbCA9IHRoaXMuaGVhZGVyWzBdW2ldO1xuICAgICAgaWYgKGhlYWRlckNlbGwpIHtcbiAgICAgICAgcmV0dXJuIGhlYWRlckNlbGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYSBsaXN0IG9mIGluZGljZXMgb2Ygc2VsZWN0ZWQgcm93c1xuICAgKi9cbiAgc2VsZWN0ZWRSb3dJbmRpY2VzKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5yb3dzU2VsZWN0ZWQucmVkdWNlKChhY2M6IG51bWJlcltdLCBjdXJyZW50LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgICAgcmV0dXJuIFsuLi5hY2MsIGluZGV4XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBbXSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBob3cgbWFueSByb3dzIGlzIGN1cnJlbnRseSBzZWxlY3RlZFxuICAgKi9cbiAgc2VsZWN0ZWRSb3dzQ291bnQoKTogbnVtYmVyIHtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGlmICh0aGlzLnJvd3NTZWxlY3RlZCkge1xuICAgICAgdGhpcy5yb3dzU2VsZWN0ZWQuZm9yRWFjaCgocm93U2VsZWN0ZWQpID0+IHtcbiAgICAgICAgaWYgKHJvd1NlbGVjdGVkKSB7XG4gICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyBhIGxpc3Qgb2YgaW5kaWNlcyBvZiBleHBhbmRlZCByb3dzXG4gICAqL1xuICBleHBhbmRlZFJvd0luZGljZXMoKTogbnVtYmVyW10ge1xuICAgIHJldHVybiB0aGlzLnJvd3NFeHBhbmRlZC5yZWR1Y2UoKGFjYzogbnVtYmVyW10sIGN1cnJlbnQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoY3VycmVudCkge1xuICAgICAgICByZXR1cm4gWy4uLmFjYywgaW5kZXhdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhvdyBtYW55IHJvd3MgaXMgY3VycmVudGx5IGV4cGFuZGVkXG4gICAqL1xuICBleHBhbmRlZFJvd3NDb3VudCgpOiBudW1iZXIge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgaWYgKHRoaXMucm93c0V4cGFuZGVkKSB7XG4gICAgICB0aGlzLnJvd3NFeHBhbmRlZC5mb3JFYWNoKChyb3dFeHBhbmRlZCkgPT4ge1xuICAgICAgICBpZiAocm93RXhwYW5kZWQpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYGluZGV4YHRoIHJvdyBvZiB0aGUgdGFibGUuXG4gICAqXG4gICAqIE5lZ2F0aXZlIGluZGV4IHN0YXJ0cyBmcm9tIHRoZSBlbmQuIC0xIGJlaW5nIHRoZSBsYXN0IGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleFxuICAgKi9cbiAgcm93KGluZGV4OiBudW1iZXIpOiBUYWJsZUl0ZW1bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFbdGhpcy5yZWFsUm93SW5kZXgoaW5kZXgpXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCB0aGUgcm93cy5cbiAgICpcbiAgICogVXNlIGByb3coKWAgaW5zdGVhZC5cbiAgICovXG4gIHJvd3MoKTogVGFibGVJdGVtW11bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHJvdyB0byB0aGUgYGluZGV4YHRoIHJvdyBvciBhcHBlbmRzIHRvIHRhYmxlIGlmIGluZGV4IG5vdCBwcm92aWRlZC5cbiAgICpcbiAgICogSWYgcm93IGlzIHNob3J0ZXIgdGhhbiBvdGhlciByb3dzIG9yIG5vdCBwcm92aWRlZCwgaXQgd2lsbCBiZSBwYWRkZWQgd2l0aFxuICAgKiBlbXB0eSBgVGFibGVJdGVtYCBlbGVtZW50cy5cbiAgICpcbiAgICogSWYgcm93IGlzIGxvbmdlciB0aGFuIG90aGVyIHJvd3MsIG90aGVycyB3aWxsIGJlIGV4dGVuZGVkIHRvIG1hdGNoIHNvIG5vIGRhdGEgaXMgbG9zdC5cbiAgICpcbiAgICogSWYgY2FsbGVkIG9uIGFuIGVtcHR5IHRhYmxlIHdpdGggbm8gcGFyYW1ldGVycywgaXQgY3JlYXRlcyBhIDF4MSB0YWJsZS5cbiAgICpcbiAgICogTmVnYXRpdmUgaW5kZXggc3RhcnRzIGZyb20gdGhlIGVuZC4gLTEgYmVpbmcgdGhlIGxhc3QgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIFtyb3ddXG4gICAqIEBwYXJhbSBbaW5kZXhdXG4gICAqL1xuICBhZGRSb3cocm93PzogVGFibGVJdGVtW10sIGluZGV4PzogbnVtYmVyKSB7XG4gICAgLy8gaWYgdGFibGUgZW1wdHkgY3JlYXRlIHRhYmxlIHdpdGggcm93XG4gICAgaWYgKCF0aGlzLl9kYXRhIHx8IHRoaXMuX2RhdGEubGVuZ3RoID09PSAwIHx8IHRoaXMuX2RhdGFbMF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICBsZXQgbmV3RGF0YSA9IG5ldyBBcnJheTxBcnJheTxUYWJsZUl0ZW0+PigpO1xuICAgICAgbmV3RGF0YS5wdXNoKHJvdyA/IHJvdyA6IFtuZXcgVGFibGVJdGVtKCldKTsgLy8gcm93IG9yIG9uZSBlbXB0eSBvbmUgY29sdW1uIHJvd1xuICAgICAgdGhpcy5zZXREYXRhKG5ld0RhdGEpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHJlYWxSb3cgPSByb3c7XG4gICAgY29uc3QgY29sdW1uQ291bnQgPSB0aGlzLl9kYXRhWzBdLmxlbmd0aDtcblxuICAgIGlmIChyb3cgPT0gbnVsbCkge1xuICAgICAgcmVhbFJvdyA9IG5ldyBBcnJheTxUYWJsZUl0ZW0+KCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkNvdW50OyBpKyspIHtcbiAgICAgICAgcmVhbFJvdy5wdXNoKG5ldyBUYWJsZUl0ZW0oKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlYWxSb3cubGVuZ3RoIDwgY29sdW1uQ291bnQpIHtcbiAgICAgIC8vIGV4dGVuZCB0aGUgbGVuZ3RoIG9mIHJlYWxSb3dcbiAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSBjb2x1bW5Db3VudCAtIHJlYWxSb3cubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmZXJlbmNlOyBpKyspIHtcbiAgICAgICAgcmVhbFJvdy5wdXNoKG5ldyBUYWJsZUl0ZW0oKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZWFsUm93Lmxlbmd0aCA+IGNvbHVtbkNvdW50KSB7XG4gICAgICAvLyBleHRlbmQgdGhlIGxlbmd0aCBvZiBoZWFkZXJcbiAgICAgIGxldCBkaWZmZXJlbmNlID0gcmVhbFJvdy5sZW5ndGggLSB0aGlzLnByb2plY3RlZFJvd0xlbmd0aCh0aGlzLmhlYWRlclswXSwgMCwgdGhpcy5oZWFkZXIpO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkaWZmZXJlbmNlOyBqKyspIHtcbiAgICAgICAgLy8gYWRkIHRvIHRoZSBmaXJzdCBoZWFkZXIgcm93IGFuZCByb3ctc3BhbiB0byBmaWxsIHRoZSBoZWlnaHQgb2YgdGhlIGhlYWRlclxuICAgICAgICBjb25zdCBoZWFkZXJJdGVtID0gbmV3IEFJVGFibGVIZWFkZXJJdGVtKCk7XG4gICAgICAgIGhlYWRlckl0ZW0ucm93U3BhbiA9IHRoaXMuaGVhZGVyLmxlbmd0aDtcbiAgICAgICAgdGhpcy5oZWFkZXJbMF0ucHVzaChoZWFkZXJJdGVtKTtcbiAgICAgIH1cbiAgICAgIC8vIGV4dGVuZCB0aGUgbGVuZ3RoIG9mIGV2ZXJ5IG90aGVyIHJvd1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjdXJyZW50Um93ID0gdGhpcy5fZGF0YVtpXTtcbiAgICAgICAgZGlmZmVyZW5jZSA9IHJlYWxSb3cubGVuZ3RoIC0gY3VycmVudFJvdy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZGlmZmVyZW5jZTsgaisrKSB7XG4gICAgICAgICAgY3VycmVudFJvdy5wdXNoKG5ldyBUYWJsZUl0ZW0oKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW5kZXggPT0gbnVsbCkge1xuICAgICAgdGhpcy5fZGF0YS5wdXNoKHJlYWxSb3cpO1xuXG4gICAgICAvLyB1cGRhdGUgcm93c1NlbGVjdGVkIHByb3BlcnR5IGZvciBsZW5ndGhcbiAgICAgIHRoaXMucm93c1NlbGVjdGVkLnB1c2goZmFsc2UpO1xuXG4gICAgICAvLyB1cGRhdGUgcm93c0V4cGFuZGVkIHByb3BlcnR5IGZvciBsZW5ndGhcbiAgICAgIHRoaXMucm93c0V4cGFuZGVkLnB1c2goZmFsc2UpO1xuXG4gICAgICAvLyB1cGRhdGUgcm93c0NvbnRleHQgcHJvcGVydHkgZm9yIGxlbmd0aFxuICAgICAgdGhpcy5yb3dzQ29udGV4dC5wdXNoKHVuZGVmaW5lZCk7XG5cbiAgICAgIC8vIHVwZGF0ZSByb3dzQ2xhc3MgcHJvcGVydHkgZm9yIGxlbmd0aFxuICAgICAgdGhpcy5yb3dzQ2xhc3MucHVzaCh1bmRlZmluZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByaSA9IHRoaXMucmVhbFJvd0luZGV4KGluZGV4KTtcbiAgICAgIHRoaXMuX2RhdGEuc3BsaWNlKHJpLCAwLCByZWFsUm93KTtcblxuICAgICAgLy8gdXBkYXRlIHJvd3NTZWxlY3RlZCBwcm9wZXJ0eSBmb3IgbGVuZ3RoXG4gICAgICB0aGlzLnJvd3NTZWxlY3RlZC5zcGxpY2UocmksIDAsIGZhbHNlKTtcblxuICAgICAgLy8gdXBkYXRlIHJvd3NFeHBhbmRlZCBwcm9wZXJ0eSBmb3IgbGVuZ3RoXG4gICAgICB0aGlzLnJvd3NFeHBhbmRlZC5zcGxpY2UocmksIDAsIGZhbHNlKTtcblxuICAgICAgLy8gdXBkYXRlIHJvd3NDb250ZXh0IHByb3BlcnR5IGZvciBsZW5ndGhcbiAgICAgIHRoaXMucm93c0NvbnRleHQuc3BsaWNlKHJpLCAwLCB1bmRlZmluZWQpO1xuXG4gICAgICAvLyB1cGRhdGUgcm93c0NsYXNzIHByb3BlcnR5IGZvciBsZW5ndGhcbiAgICAgIHRoaXMucm93c0NsYXNzLnNwbGljZShyaSwgMCwgdW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYGluZGV4YHRoIHJvdy5cbiAgICpcbiAgICogTmVnYXRpdmUgaW5kZXggc3RhcnRzIGZyb20gdGhlIGVuZC4gLTEgYmVpbmcgdGhlIGxhc3QgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4XG4gICAqL1xuICBkZWxldGVSb3coaW5kZXg6IG51bWJlcikge1xuICAgIGNvbnN0IHJyaSA9IHRoaXMucmVhbFJvd0luZGV4KGluZGV4KTtcbiAgICB0aGlzLl9kYXRhLnNwbGljZShycmksIDEpO1xuICAgIHRoaXMucm93c1NlbGVjdGVkLnNwbGljZShycmksIDEpO1xuICAgIHRoaXMucm93c0V4cGFuZGVkLnNwbGljZShycmksIDEpO1xuICAgIHRoaXMucm93c0NvbnRleHQuc3BsaWNlKHJyaSwgMSk7XG4gICAgdGhpcy5yb3dzQ2xhc3Muc3BsaWNlKHJyaSwgMSk7XG5cbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dCgpO1xuICB9XG5cbiAgcm93TWV0YUluZm8oaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3RlZDogdGhpcy5yb3dzU2VsZWN0ZWRbaW5kZXhdLFxuICAgICAgZXhwYW5kZWQ6IHRoaXMucm93c0V4cGFuZGVkW2luZGV4XSxcbiAgICAgIGV4cGFuZGFibGU6IHRoaXMuaXNSb3dFeHBhbmRhYmxlKGluZGV4KSxcbiAgICAgIGNvbnRleHQ6IHRoaXMucm93c0NvbnRleHRbaW5kZXhdLFxuICAgICAgcm93Q2xhc3M6IHRoaXMucm93c0NsYXNzW2luZGV4XSxcbiAgICB9O1xuICB9XG5cbiAgaGFzRXhwYW5kYWJsZVJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGEuc29tZSgoZGF0YSkgPT4gZGF0YS5zb21lKChkKSA9PiBkICYmIGQuZXhwYW5kZWREYXRhKSk7IC8vIGNoZWNraW5nIGZvciBzb21lIGluIDJEIGFycmF5XG4gIH1cblxuICBpc1Jvd0V4cGFuZGFibGUoaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLl9kYXRhW2luZGV4XS5zb21lKChkKSA9PiBkICYmIGQuZXhwYW5kZWREYXRhKTtcbiAgfVxuXG4gIGlzUm93RXhwYW5kZWQoaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLnJvd3NFeHBhbmRlZFtpbmRleF07XG4gIH1cblxuICBnZXRSb3dDb250ZXh0KGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5yb3dzQ29udGV4dFtpbmRleF07XG4gIH1cblxuICBzZXRSb3dDb250ZXh0KGluZGV4OiBudW1iZXIsIGNvbnRleHQ6IHN0cmluZykge1xuICAgIHJldHVybiAodGhpcy5yb3dzQ29udGV4dFtpbmRleF0gPSBjb250ZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGBpbmRleGB0aCBjb2x1bW4gb2YgdGhlIHRhYmxlLlxuICAgKlxuICAgKiBOZWdhdGl2ZSBpbmRleCBzdGFydHMgZnJvbSB0aGUgZW5kLiAtMSBiZWluZyB0aGUgbGFzdCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICovXG4gIGNvbHVtbihpbmRleDogbnVtYmVyKTogVGFibGVJdGVtW10ge1xuICAgIGxldCBjb2x1bW4gPSBuZXcgQXJyYXk8VGFibGVJdGVtPigpO1xuICAgIGNvbnN0IHJpID0gdGhpcy5yZWFsQ29sdW1uSW5kZXgoaW5kZXgpO1xuICAgIGNvbnN0IHJjID0gdGhpcy5fZGF0YS5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJjOyBpKyspIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMuX2RhdGFbaV07XG4gICAgICBjb2x1bW4ucHVzaChyb3dbcmldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29sdW1uO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBjb2x1bW4gdG8gdGhlIGBpbmRleGB0aCBjb2x1bW4gb3IgYXBwZW5kcyB0byB0YWJsZSBpZiBpbmRleCBub3QgcHJvdmlkZWQuXG4gICAqXG4gICAqIElmIGNvbHVtbiBpcyBzaG9ydGVyIHRoYW4gb3RoZXIgY29sdW1ucyBvciBub3QgcHJvdmlkZWQsIGl0IHdpbGwgYmUgcGFkZGVkIHdpdGhcbiAgICogZW1wdHkgYFRhYmxlSXRlbWAgZWxlbWVudHMuXG4gICAqXG4gICAqIElmIGNvbHVtbiBpcyBsb25nZXIgdGhhbiBvdGhlciBjb2x1bW5zLCBvdGhlcnMgd2lsbCBiZSBleHRlbmRlZCB0byBtYXRjaCBzbyBubyBkYXRhIGlzIGxvc3QuXG4gICAqXG4gICAqIElmIGNhbGxlZCBvbiBhbiBlbXB0eSB0YWJsZSB3aXRoIG5vIHBhcmFtZXRlcnMsIGl0IGNyZWF0ZXMgYSAxeDEgdGFibGUuXG4gICAqXG4gICAqIE5lZ2F0aXZlIGluZGV4IHN0YXJ0cyBmcm9tIHRoZSBlbmQuIC0xIGJlaW5nIHRoZSBsYXN0IGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBbY29sdW1uXVxuICAgKiBAcGFyYW0gW2luZGV4XVxuICAgKi9cbiAgYWRkQ29sdW1uKGNvbHVtbj86IFRhYmxlSXRlbVtdLCBpbmRleD86IG51bWJlcikge1xuICAgIC8vIGlmIHRhYmxlIGVtcHR5IGNyZWF0ZSB0YWJsZSB3aXRoIHJvd1xuICAgIGlmICghdGhpcy5fZGF0YSB8fCB0aGlzLl9kYXRhLmxlbmd0aCA9PT0gMCB8fCB0aGlzLl9kYXRhWzBdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbGV0IG5ld0RhdGEgPSBuZXcgQXJyYXk8QXJyYXk8VGFibGVJdGVtPj4oKTtcbiAgICAgIGlmIChjb2x1bW4gPT0gbnVsbCkge1xuICAgICAgICBuZXdEYXRhLnB1c2goW25ldyBUYWJsZUl0ZW0oKV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2x1bW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgaXRlbSA9IGNvbHVtbltpXTtcbiAgICAgICAgICBuZXdEYXRhLnB1c2goW2l0ZW1dKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5zZXREYXRhKG5ld0RhdGEpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHJjID0gdGhpcy5fZGF0YS5sZW5ndGg7IC8vIHJvdyBjb3VudFxuICAgIGxldCBjaSA9IHRoaXMucmVhbENvbHVtbkluZGV4KGluZGV4KTtcblxuICAgIC8vIGFwcGVuZCBtaXNzaW5nIHJvd3NcbiAgICBmb3IgKGxldCBpID0gMDsgY29sdW1uICE9IG51bGwgJiYgaSA8IGNvbHVtbi5sZW5ndGggLSByYzsgaSsrKSB7XG4gICAgICB0aGlzLmFkZFJvdygpO1xuICAgIH1cbiAgICByYyA9IHRoaXMuX2RhdGEubGVuZ3RoO1xuICAgIGlmIChpbmRleCA9PSBudWxsKSB7XG4gICAgICAvLyBhcHBlbmQgdG8gZW5kXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJjOyBpKyspIHtcbiAgICAgICAgbGV0IHJvdyA9IHRoaXMuX2RhdGFbaV07XG4gICAgICAgIHJvdy5wdXNoKGNvbHVtbiA9PSBudWxsIHx8IGNvbHVtbltpXSA9PSBudWxsID8gbmV3IFRhYmxlSXRlbSgpIDogY29sdW1uW2ldKTtcbiAgICAgIH1cbiAgICAgIC8vIHVwZGF0ZSBoZWFkZXIgaWYgbm90IGFscmVhZHkgc2V0IGJ5IHVzZXJcbiAgICAgIGlmICh0aGlzLmhlYWRlci5sZW5ndGggPiAwICYmIHRoaXMuaGVhZGVyWzBdLmxlbmd0aCA8IHRoaXMuX2RhdGFbMF0ubGVuZ3RoKSB7XG4gICAgICAgIC8vIGFkZCB0byB0aGUgZmlyc3QgaGVhZGVyIHJvdyBhbmQgcm93LXNwYW4gdG8gZmlsbCB0aGUgaGVpZ2h0IG9mIHRoZSBoZWFkZXJcbiAgICAgICAgY29uc3QgaGVhZGVySXRlbSA9IG5ldyBBSVRhYmxlSGVhZGVySXRlbSgpO1xuICAgICAgICBoZWFkZXJJdGVtLnJvd1NwYW4gPSB0aGlzLmhlYWRlci5sZW5ndGg7XG4gICAgICAgIHRoaXMuaGVhZGVyWzBdLnB1c2goaGVhZGVySXRlbSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbmRleCA+PSB0aGlzLl9kYXRhWzBdLmxlbmd0aCkge1xuICAgICAgICAvLyBpZiB0cnlpbmcgdG8gYXBwZW5kXG4gICAgICAgIGNpKys7XG4gICAgICB9XG4gICAgICAvLyBpbnNlcnRcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmM7IGkrKykge1xuICAgICAgICBsZXQgcm93ID0gdGhpcy5fZGF0YVtpXTtcbiAgICAgICAgcm93LnNwbGljZShjaSwgMCwgY29sdW1uID09IG51bGwgfHwgY29sdW1uW2ldID09IG51bGwgPyBuZXcgVGFibGVJdGVtKCkgOiBjb2x1bW5baV0pO1xuICAgICAgfVxuICAgICAgLy8gdXBkYXRlIGhlYWRlciBpZiBub3QgYWxyZWFkeSBzZXQgYnkgdXNlclxuICAgICAgaWYgKHRoaXMuaGVhZGVyLmxlbmd0aCA+IDAgJiYgdGhpcy5oZWFkZXJbMF0ubGVuZ3RoIDwgdGhpcy5fZGF0YVswXS5sZW5ndGgpIHtcbiAgICAgICAgLy8gYWRkIHRvIHRoZSBmaXJzdCBoZWFkZXIgcm93IGFuZCByb3ctc3BhbiB0byBmaWxsIHRoZSBoZWlnaHQgb2YgdGhlIGhlYWRlclxuICAgICAgICBjb25zdCBoZWFkZXJJdGVtID0gbmV3IEFJVGFibGVIZWFkZXJJdGVtKCk7XG4gICAgICAgIGhlYWRlckl0ZW0ucm93U3BhbiA9IHRoaXMuaGVhZGVyLmxlbmd0aDtcbiAgICAgICAgLy8gdGhpcy5oZWFkZXJbMF0ucHVzaChoZWFkZXJJdGVtKTtcbiAgICAgICAgdGhpcy5oZWFkZXJbMF0uc3BsaWNlKGNpLCAwLCBoZWFkZXJJdGVtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYGluZGV4YHRoIGNvbHVtbi5cbiAgICpcbiAgICogTmVnYXRpdmUgaW5kZXggc3RhcnRzIGZyb20gdGhlIGVuZC4gLTEgYmVpbmcgdGhlIGxhc3QgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4XG4gICAqL1xuICBkZWxldGVDb2x1bW4oaW5kZXg6IG51bWJlcikge1xuICAgIGNvbnN0IHJjaSA9IHRoaXMucmVhbENvbHVtbkluZGV4KGluZGV4KTtcbiAgICBjb25zdCByb3dDb3VudCA9IHRoaXMuX2RhdGEubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xuICAgICAgdGhpcy5fZGF0YVtpXS5zcGxpY2UocmNpLCAxKTtcbiAgICB9XG4gICAgLy8gdXBkYXRlIGhlYWRlciBpZiBub3QgYWxyZWFkeSBzZXQgYnkgdXNlclxuICAgIGlmICh0aGlzLmhlYWRlci5sZW5ndGggPiAwICYmIHRoaXMuaGVhZGVyWzBdLmxlbmd0aCA+IHRoaXMuX2RhdGFbMF0ubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaGVhZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGhlYWRlclJvdyA9IHRoaXMuaGVhZGVyW2ldO1xuICAgICAgICBoZWFkZXJSb3cuc3BsaWNlKHJjaSwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlIHRoZSBjb2x1bW4gYXQgYGluZGV4RnJvbWAgdG8gYGluZGV4VG9gIG9mIHRoZSBgcm93SW5kZXhgIHJvd1xuICAgKlxuICAgKiBfTm90ZTogb25seSB3b3JrcyB3aXRoIG9uZSByb3cgaGVhZGVycyBhdCB0aGUgbW9tZW50X1xuICAgKlxuICAgKiBJZiBoZWFkZXJzIGhhdmUgbWVyZ2VkIGNlbGxzLCB0aGV5IHNob3VsZCBvbmx5IGJlIG1lcmdlZCBpbiBhIHdheSB0aGF0IGEgaGlnaGVyIHJvd1xuICAgKiBjb250YWlucyBhbGwgdGhlIGxvd2VyIHJvdyBjb2x1bW5zIGFuZCBub3QgdmljZSB2ZXJzYVxuICAgKlxuICAgKiBNdWx0aWxpbmUgaGVhZGVyIGV4YW1wbGUgKihnb29kKSo6XG4gICAqXG4gICAqIHwgaDEgIHwgICAgICAgICAgIGgyICAgICAgICAgIHx8fHxcbiAgICogfCBoMTEgfCAgICBoMTIgICAgfHwgICAgaDEzICAgfHxcbiAgICogfCBoMjEgfCBoMjIgfCBoMjMgfCBoMjQgfCBoMjUgfFxuICAgKiB8LS0tLS18LS0tLS18LS0tLS18LS0tLS18LS0tLS18XG4gICAqIHwgIGEgIHwgIGIgIHwgIGMgIHwgIGQgIHwgIGUgIHxcbiAgICogfCAgZiAgfCAgZyAgfCAgaCAgfCAgaSAgfCAgaiAgfFxuICAgKlxuICAgKiBNdWx0aWxpbmUgaGVhZGVyIGV4YW1wbGUgKihub3QgZ29vZCkqOlxuICAgKlxuICAgKiB8IGgxICB8ICAgICAgICAgICBoMiAgICAgICAgICB8fHx8XG4gICAqIHwgaDIxIHwgaDIyIHwgaDIzIHwgaDI0IHwgaDI1IHxcbiAgICogfCBoMTEgfCAgICBoMTIgICAgfHwgICAgaDEzICAgfHxcbiAgICogfC0tLS0tfC0tLS0tfC0tLS0tfC0tLS0tfC0tLS0tfFxuICAgKiB8ICBhICB8ICBiICB8ICBjICB8ICBkICB8ICBlICB8XG4gICAqIHwgIGYgIHwgIGcgIHwgIGggIHwgIGkgIHwgIGogIHxcbiAgICpcbiAgICogIyMgVXNhZ2UgZXhhbXBsZTpcbiAgICpcbiAgICogIyMjIE1vdmluZyBoMiBpbiBwbGFjZSBvZiBoMVxuICAgKlxuICAgKiBgbW9kZWwubW92ZUNvbHVtbigxLCAwKWBcbiAgICpcbiAgICogKkJlZm9yZSpcbiAgICpcbiAgICogfCBoMSAgfCAgICAgICAgICAgaDIgICAgICAgICAgfHx8fFxuICAgKiB8IGgxMSB8ICAgIGgxMiAgICB8fCAgICBoMTMgICB8fFxuICAgKiB8IGgyMSB8IGgyMiB8IGgyMyB8IGgyNCB8IGgyNSB8XG4gICAqIHwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXxcbiAgICogfCAgYSAgfCAgYiAgfCAgYyAgfCAgZCAgfCAgZSAgfFxuICAgKiB8ICBmICB8ICBnICB8ICBoICB8ICBpICB8ICBqICB8XG4gICAqXG4gICAqICpBZnRlcipcbiAgICpcbiAgICogfCAgICAgICAgICAgaDIgICAgICAgICAgfCBoMSAgfHx8fFxuICAgKiB8ICAgIGgxMiAgICB8fCAgICBoMTMgICB8IGgxMSB8fFxuICAgKiB8IGgyMiB8IGgyMyB8IGgyNCB8IGgyNSB8IGgyMSB8XG4gICAqIHwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXxcbiAgICogfCAgYiAgfCAgYyAgfCAgZCAgfCAgZSAgfCAgYSAgfFxuICAgKiB8ICBnICB8ICBoICB8ICBpICB8ICBqICB8ICBmICB8XG4gICAqXG4gICAqICMjIyBNb3ZpbmcgaDEzIGluIHBsYWNlIG9mIGgxMlxuICAgKlxuICAgKiBgbW9kZWwubW92ZUNvbHVtbigyLCAxLCAxKWBcbiAgICpcbiAgICogKkJlZm9yZSpcbiAgICpcbiAgICogfCBoMSAgfCAgICAgICAgICAgaDIgICAgICAgICAgfHx8fFxuICAgKiB8IGgxMSB8ICAgIGgxMiAgICB8fCAgICBoMTMgICB8fFxuICAgKiB8IGgyMSB8IGgyMiB8IGgyMyB8IGgyNCB8IGgyNSB8XG4gICAqIHwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXxcbiAgICogfCAgYSAgfCAgYiAgfCAgYyAgfCAgZCAgfCAgZSAgfFxuICAgKiB8ICBmICB8ICBnICB8ICBoICB8ICBpICB8ICBqICB8XG4gICAqXG4gICAqICpBZnRlcipcbiAgICpcbiAgICogfCBoMSAgfCAgICAgICAgICAgaDIgICAgICAgICAgfHx8fFxuICAgKiB8IGgxMSB8ICAgIGgxMyAgICB8fCAgICBoMTIgICB8fFxuICAgKiB8IGgyMSB8IGgyNCB8IGgyNSB8IGgyMiB8IGgyMyB8XG4gICAqIHwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXxcbiAgICogfCAgYSAgfCAgZCAgfCAgZSAgfCAgYiAgfCAgYyAgfFxuICAgKiB8ICBmICB8ICBpICB8ICBqICB8ICBnICB8ICBoICB8XG4gICAqXG4gICAqICMjIyBNb3ZpbmcgaDI0IGluIHBsYWNlIG9mIGgyNVxuICAgKlxuICAgKiBgbW9kZWwubW92ZUNvbHVtbigzLCA0LCAyKWBcbiAgICpcbiAgICogX05vdGU6IHdoaWxlIHlvdV8gY291bGQgX21vdmUgaDI0IHRvIGgyMiwgeW91IHNob3VsZG4ndCBiZWNhdXNlIGl0IGRvZXNuJ3QgYmVsb25nIHVuZGVyX1xuICAgKiBfdGhlIHNhbWUgc3ViaGVhZGVyLl9cbiAgICpcbiAgICogKkJlZm9yZSpcbiAgICpcbiAgICogfCBoMSAgfCAgICAgICAgICAgaDIgICAgICAgICAgfHx8fFxuICAgKiB8IGgxMSB8ICAgIGgxMiAgICB8fCAgICBoMTMgICB8fFxuICAgKiB8IGgyMSB8IGgyMiB8IGgyMyB8IGgyNCB8IGgyNSB8XG4gICAqIHwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXxcbiAgICogfCAgYSAgfCAgYiAgfCAgYyAgfCAgZCAgfCAgZSAgfFxuICAgKiB8ICBmICB8ICBnICB8ICBoICB8ICBpICB8ICBqICB8XG4gICAqXG4gICAqICpBZnRlcipcbiAgICpcbiAgICogfCBoMSAgfCAgICAgICAgICAgaDIgICAgICAgICAgfHx8fFxuICAgKiB8IGgxMSB8ICAgIGgxMiAgICB8fCAgICBoMTMgICB8fFxuICAgKiB8IGgyMSB8IGgyMiB8IGgyMyB8IGgyNSB8IGgyNCB8XG4gICAqIHwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXwtLS0tLXxcbiAgICogfCAgYSAgfCAgYiAgfCAgYyAgfCAgZSAgfCAgZCAgfFxuICAgKiB8ICBmICB8ICBnICB8ICBoICB8ICBqICB8ICBpICB8XG4gICAqL1xuICBtb3ZlQ29sdW1uKGluZGV4RnJvbTogbnVtYmVyLCBpbmRleFRvOiBudW1iZXIsIHJvd0luZGV4ID0gMCkge1xuICAgIGNvbnN0IG5lc3RlZCA9IHRoaXMudGFidWxhclRvTmVzdGVkKCk7XG4gICAgdGhpcy5tb3ZlTmVzdGVkKG5lc3RlZCwgaW5kZXhGcm9tLCBpbmRleFRvLCByb3dJbmRleCk7XG4gICAgY29uc3QgeyBoZWFkZXIsIGRhdGEgfSA9IHRoaXMubmVzdGVkVG9UYWJ1bGFyKG5lc3RlZCk7XG4gICAgdGhpcy5oZWFkZXIgPSBoZWFkZXI7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuICAvKipcbiAgICogU29ydHMgdGhlIGRhdGEgY3VycmVudGx5IHByZXNlbnQgaW4gdGhlIG1vZGVsIGJhc2VkIG9uIGBjb21wYXJlKClgXG4gICAqXG4gICAqIERpcmVjdGlvbiBpcyBzZXQgYnkgYGFzY2VuZGluZ2AgYW5kIGBkZXNjZW5kaW5nYCBwcm9wZXJ0aWVzIG9mIGBBSVRhYmxlSGVhZGVySXRlbWBcbiAgICogaW4gYGluZGV4YHRoIGNvbHVtbi5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4IFRoZSBjb2x1bW4gYmFzZWQgb24gd2hpY2ggaXQncyBzb3J0aW5nXG4gICAqL1xuICBzb3J0KGluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCBoZWFkZXJUb1NvcnQgPSB0aGlzLmdldENsb3Nlc3RIZWFkZXIoaW5kZXgpO1xuICAgIHRoaXMucHVzaFJvd1N0YXRlVG9Nb2RlbERhdGEoKTtcbiAgICB0aGlzLl9kYXRhLnNvcnQoXG4gICAgICAoYSwgYikgPT4gKGhlYWRlclRvU29ydC5kZXNjZW5kaW5nID8gLTEgOiAxKSAqIGhlYWRlclRvU29ydC5jb21wYXJlKGFbaW5kZXhdLCBiW2luZGV4XSlcbiAgICApO1xuICAgIHRoaXMucG9wUm93U3RhdGVGcm9tTW9kZWxEYXRhKCk7XG4gICAgdGhpcy5oZWFkZXIuZm9yRWFjaCgoaGVhZGVyUm93OiBBSVRhYmxlSGVhZGVySXRlbVtdKSA9PiB7XG4gICAgICBoZWFkZXJSb3cuZm9yRWFjaCgoY29sdW1uKSA9PiB7XG4gICAgICAgIGlmIChjb2x1bW4pIHtcbiAgICAgICAgICBjb2x1bW4uc29ydGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGhlYWRlclRvU29ydC5zb3J0ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYHJvd3NTZWxlY3RlZGAgYW5kIGByb3dzRXhwYW5kZWRgIGluZm8gdG8gbW9kZWwgZGF0YS5cbiAgICpcbiAgICogV2hlbiBzb3J0aW5nIHJvd3MsIGRvIHRoaXMgZmlyc3Qgc28gaW5mb3JtYXRpb24gYWJvdXQgcm93IHNlbGVjdGlvblxuICAgKiBnZXRzIHNvcnRlZCB3aXRoIHRoZSBvdGhlciByb3cgaW5mby5cbiAgICpcbiAgICogQ2FsbCBgcG9wUm93U2VsZWN0aW9uRnJvbU1vZGVsRGF0YSgpYCBhZnRlciBzb3J0aW5nIHRvIG1ha2UgZXZlcnl0aGluZ1xuICAgKiByaWdodCB3aXRoIHRoZSB3b3JsZCBhZ2Fpbi5cbiAgICovXG4gIHB1c2hSb3dTdGF0ZVRvTW9kZWxEYXRhKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgcm93U2VsZWN0ZWRNYXJrID0gbmV3IFRhYmxlSXRlbSgpO1xuICAgICAgcm93U2VsZWN0ZWRNYXJrLmRhdGEgPSB0aGlzLnJvd3NTZWxlY3RlZFtpXTtcbiAgICAgIHRoaXMuX2RhdGFbaV0ucHVzaChyb3dTZWxlY3RlZE1hcmspO1xuXG4gICAgICBjb25zdCByb3dFeHBhbmRlZE1hcmsgPSBuZXcgVGFibGVJdGVtKCk7XG4gICAgICByb3dFeHBhbmRlZE1hcmsuZGF0YSA9IHRoaXMucm93c0V4cGFuZGVkW2ldO1xuICAgICAgdGhpcy5fZGF0YVtpXS5wdXNoKHJvd0V4cGFuZGVkTWFyayk7XG5cbiAgICAgIGNvbnN0IHJvd0NvbnRleHQgPSBuZXcgVGFibGVJdGVtKCk7XG4gICAgICByb3dDb250ZXh0LmRhdGEgPSB0aGlzLnJvd3NDb250ZXh0W2ldO1xuICAgICAgdGhpcy5fZGF0YVtpXS5wdXNoKHJvd0NvbnRleHQpO1xuXG4gICAgICBjb25zdCByb3dDbGFzcyA9IG5ldyBUYWJsZUl0ZW0oKTtcbiAgICAgIHJvd0NsYXNzLmRhdGEgPSB0aGlzLnJvd3NDbGFzc1tpXTtcbiAgICAgIHRoaXMuX2RhdGFbaV0ucHVzaChyb3dDbGFzcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RvcmVzIGByb3dzU2VsZWN0ZWRgIGZyb20gZGF0YSBwdXNoZWQgYnkgYHB1c2hSb3dTZWxlY3Rpb25Ub01vZGVsRGF0YSgpYFxuICAgKlxuICAgKiBDYWxsIGFmdGVyIHNvcnRpbmcgZGF0YSAoaWYgeW91IHByZXZpb3VzbHkgcHVzaGVkIHRvIG1haW50YWluIHNlbGVjdGlvbiBvcmRlcilcbiAgICogdG8gbWFrZSBldmVyeXRoaW5nIHJpZ2h0IHdpdGggdGhlIHdvcmxkIGFnYWluLlxuICAgKi9cbiAgcG9wUm93U3RhdGVGcm9tTW9kZWxEYXRhKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5yb3dzQ2xhc3NbaV0gPSB0aGlzLl9kYXRhW2ldLnBvcCgpLmRhdGE7XG4gICAgICB0aGlzLnJvd3NDb250ZXh0W2ldID0gdGhpcy5fZGF0YVtpXS5wb3AoKS5kYXRhO1xuICAgICAgdGhpcy5yb3dzRXhwYW5kZWRbaV0gPSAhIXRoaXMuX2RhdGFbaV0ucG9wKCkuZGF0YTtcbiAgICAgIHRoaXMucm93c1NlbGVjdGVkW2ldID0gISF0aGlzLl9kYXRhW2ldLnBvcCgpLmRhdGE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiByb3cgaXMgZmlsdGVyZWQgb3V0LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICogQHJldHVybnMgdHJ1ZSBpZiBhbnkgb2YgdGhlIGZpbHRlcnMgaW4gaGVhZGVyIGZpbHRlcnMgb3V0IHRoZSBgaW5kZXhgdGggcm93XG4gICAqL1xuICBpc1Jvd0ZpbHRlcmVkKGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCByZWFsSW5kZXggPSB0aGlzLnJlYWxSb3dJbmRleChpbmRleCk7XG4gICAgcmV0dXJuIHRoaXMuaGVhZGVyLnNvbWUoKGhlYWRlclJvdzogQUlUYWJsZUhlYWRlckl0ZW1bXSkgPT5cbiAgICAgIGhlYWRlclJvdy5zb21lKChpdGVtLCBpKSA9PiBpdGVtICYmIGl0ZW0uZmlsdGVyKHRoaXMucm93KHJlYWxJbmRleClbaV0pKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0L2Rlc2VsZWN0IGBpbmRleGB0aCByb3cgYmFzZWQgb24gdmFsdWVcbiAgICpcbiAgICogQHBhcmFtIGluZGV4IGluZGV4IG9mIHRoZSByb3cgdG8gc2VsZWN0XG4gICAqIEBwYXJhbSB2YWx1ZSBzdGF0ZSB0byBzZXQgdGhlIHJvdyB0by4gRGVmYXVsdHMgdG8gYHRydWVgXG4gICAqL1xuICBzZWxlY3RSb3coaW5kZXg6IG51bWJlciwgdmFsdWUgPSB0cnVlLCBlbWl0Q2hhbmdlID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLmlzUm93RGlzYWJsZWQoaW5kZXgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucm93c1NlbGVjdGVkW2luZGV4XSA9IHZhbHVlO1xuICAgIGlmIChlbWl0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnJvd3NTZWxlY3RlZENoYW5nZS5uZXh0KGluZGV4KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBvciBkZXNlbGVjdHMgYWxsIHJvd3MgaW4gdGhlIG1vZGVsXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBzdGF0ZSB0byBzZXQgYWxsIHJvd3MgdG8uIERlZmF1bHRzIHRvIGB0cnVlYFxuICAgKi9cbiAgc2VsZWN0QWxsKHZhbHVlID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLl9kYXRhLmxlbmd0aCA+PSAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93c1NlbGVjdGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0Um93KGksIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZWxlY3RBbGxDaGFuZ2UubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBpc1Jvd1NlbGVjdGVkKGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5yb3dzU2VsZWN0ZWRbaW5kZXhdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiByb3cgaXMgZGlzYWJsZWQgb3Igbm90LlxuICAgKi9cbiAgaXNSb3dEaXNhYmxlZChpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3Qgcm93ID0gdGhpcy5fZGF0YVtpbmRleF0gYXMgVGFibGVSb3c7XG4gICAgcmV0dXJuICEhcm93LmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cGFuZHMvQ29sbGFwc2VzIGBpbmRleGB0aCByb3cgYmFzZWQgb24gdmFsdWVcbiAgICpcbiAgICogQHBhcmFtIGluZGV4IGluZGV4IG9mIHRoZSByb3cgdG8gZXhwYW5kIG9yIGNvbGxhcHNlXG4gICAqIEBwYXJhbSB2YWx1ZSBleHBhbmRlZCBzdGF0ZSBvZiB0aGUgcm93LiBgdHJ1ZWAgaXMgZXhwYW5kZWQgYW5kIGBmYWxzZWAgaXMgY29sbGFwc2VkXG4gICAqL1xuICBleHBhbmRSb3coaW5kZXg6IG51bWJlciwgdmFsdWUgPSB0cnVlKSB7XG4gICAgdGhpcy5yb3dzRXhwYW5kZWRbaW5kZXhdID0gdmFsdWU7XG4gICAgdGhpcy5yb3dzRXhwYW5kZWRDaGFuZ2UubmV4dChpbmRleCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdHJ1ZSBpbmRleCBvZiBhIHJvdyBiYXNlZCBvbiBpdCdzIHJlbGF0aXZlIHBvc2l0aW9uLlxuICAgKiBMaWtlIGluIFB5dGhvbiwgcG9zaXRpdmUgbnVtYmVycyBzdGFydCBmcm9tIHRoZSB0b3AgYW5kXG4gICAqIG5lZ2F0aXZlIG51bWJlcnMgc3RhcnQgZnJvbSB0aGUgYm90dG9tLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICovXG4gIHByb3RlY3RlZCByZWFsUm93SW5kZXgoaW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucmVhbEluZGV4KGluZGV4LCB0aGlzLl9kYXRhLmxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdHJ1ZSBpbmRleCBvZiBhIGNvbHVtbiBiYXNlZCBvbiBpdCdzIHJlbGF0aXZlIHBvc2l0aW9uLlxuICAgKiBMaWtlIGluIFB5dGhvbiwgcG9zaXRpdmUgbnVtYmVycyBzdGFydCBmcm9tIHRoZSB0b3AgYW5kXG4gICAqIG5lZ2F0aXZlIG51bWJlcnMgc3RhcnQgZnJvbSB0aGUgYm90dG9tLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICovXG4gIHByb3RlY3RlZCByZWFsQ29sdW1uSW5kZXgoaW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucmVhbEluZGV4KGluZGV4LCB0aGlzLl9kYXRhWzBdLmxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJpYyBmdW5jdGlvbiB0byBjYWxjdWxhdGUgdGhlIHJlYWwgaW5kZXggb2Ygc29tZXRoaW5nLlxuICAgKiBVc2VkIGJ5IGByZWFsUm93SW5kZXgoKWAgYW5kIGByZWFsQ29sdW1uSW5kZXgoKWBcbiAgICpcbiAgICogQHBhcmFtIGluZGV4XG4gICAqIEBwYXJhbSBsZW5ndGhcbiAgICovXG4gIHByb3RlY3RlZCByZWFsSW5kZXgoaW5kZXg6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmIChpbmRleCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoIC0gMTtcbiAgICB9IGVsc2UgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHJldHVybiBpbmRleCA+PSBsZW5ndGggPyBsZW5ndGggLSAxIDogaW5kZXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAtaW5kZXggPj0gbGVuZ3RoID8gMCA6IGxlbmd0aCArIGluZGV4O1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBwcm9qZWN0ZWRSb3dMZW5ndGhTaW1wbGUoaXRlbUFycmF5OiBhbnlbXSkge1xuICAgIHJldHVybiBpdGVtQXJyYXkucmVkdWNlKChsZW4sIGl0ZW0pID0+IGxlbiArIChpdGVtID8gaXRlbS5jb2xTcGFuIHx8IDEgOiAwKSwgMCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIGl0ZW1BcnJheSBUYWJsZUl0ZW1bXSB8IEFJVGFibGVIZWFkZXJJdGVtW11cbiAgICogQHJldHVybnMgdGhlIG51bWJlciBvZiBjb2x1bW5zIGFzIGlmIG5vdyBjZWxscyB3ZXJlIG1lcmdlZFxuICAgKi9cbiAgcHJvdGVjdGVkIHByb2plY3RlZFJvd0xlbmd0aChpdGVtQXJyYXk6IGFueVtdLCByb3dJbmRleD86IG51bWJlciwgbWF0cml4PzogYW55W11bXSkge1xuICAgIC8vIGBhbnlbXWAgc2hvdWxkIGJlIGBBSVRhYmxlSXRlbVtdIHwgQUlUYWJsZUhlYWRlckl0ZW1bXWAgYnV0IHR5cGVzY3JpcHRcbiAgICBpZiAocm93SW5kZXggPT09IHVuZGVmaW5lZCB8fCBtYXRyaXggPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvamVjdGVkUm93TGVuZ3RoU2ltcGxlKGl0ZW1BcnJheSk7XG4gICAgfVxuXG4gICAgLy8gdGhlIHJlc3Qgb2YgdGhlIGZ1bmN0aW9uIHRha2VzIGludG8gYWNjb3VudCByb3cgc3BhbnNcbiAgICBjb25zdCByb3dMZW5ndGhzID0gbWF0cml4Lm1hcCgocm93KSA9PiB0aGlzLnByb2plY3RlZFJvd0xlbmd0aFNpbXBsZShyb3cpKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCByb3dJbmRleDsgaW5kZXgrKykge1xuICAgICAgY29uc3Qgcm93ID0gbWF0cml4W2luZGV4XTtcbiAgICAgIHJvdy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgIGlmIChpdGVtICYmIGl0ZW0ucm93U3Bhbikge1xuICAgICAgICAgIC8vIGluY3JlbWVudCBhbGwgcm93IGxlbmd0aHMgdGhhdCB0aGUgc3BhbiBjb3ZlcnNcbiAgICAgICAgICBmb3IgKGxldCBpID0gaW5kZXggKyAxOyBpIDwgaW5kZXggKyAxICsgaXRlbS5yb3dTcGFuOyBpKyspIHtcbiAgICAgICAgICAgIHJvd0xlbmd0aHNbaV0rKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcm93TGVuZ3Roc1tyb3dJbmRleF07XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhIHByb2plY3RlZCBpbmRleCB0byBhY3R1YWwgaW5kZXgsIHdoZXJlIGFjdHVhbCBpbmRleCBpcyB0aGUgaW5kZXggaW4gdGhlIGxpc3RcbiAgICogdGhhdCdzIHBhc3NlZCBpblxuICAgKiBAcGFyYW0gcHJvamVjdGVkSW5kZXggaW5kZXggb2YgYSBjb2x1bW4gaWYgbm9uZSBvZiB0aGUgY2VsbHMgd2VyZSBtZXJnZWRcbiAgICogQHBhcmFtIGxpc3QgYSByb3cgb2YgdGhlIGhlYWRlciBvciB0aGUgYm9keVxuICAgKi9cbiAgcHJvdGVjdGVkIHByb2plY3RlZEluZGV4VG9BY3R1YWxJbmRleChcbiAgICBwcm9qZWN0ZWRJbmRleDogbnVtYmVyLFxuICAgIGxpc3Q6IEFJVGFibGVIZWFkZXJJdGVtW10gfCBUYWJsZUl0ZW1bXVxuICApIHtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbSA9IGxpc3RbaV07XG4gICAgICBpbmRleCArPSBpdGVtPy5jb2xTcGFuIHx8IDE7XG4gICAgICBpZiAoaW5kZXggPiBwcm9qZWN0ZWRJbmRleCkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxpc3QubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGFuIGFjdHVhbCBpbmRleCB0byBhIHByb2plY3RlZCBpbmRpY2VzIGFycmF5XG4gICAqIEBwYXJhbSBhY3R1YWxJbmRleCBpbmRleCBvZiBhIGNvbHVtbiBhcy1pc1xuICAgKiBAcGFyYW0gbGlzdCBhIHJvdyBvZiB0aGUgaGVhZGVyIG9yIHRoZSBib2R5XG4gICAqL1xuICBwcm90ZWN0ZWQgYWN0dWFsSW5kZXhUb1Byb2plY3RlZEluZGljZXMoXG4gICAgYWN0dWFsSW5kZXg6IG51bWJlcixcbiAgICBsaXN0OiBBSVRhYmxlSGVhZGVySXRlbVtdIHwgVGFibGVJdGVtW11cbiAgKSB7XG4gICAgLy8gZmluZCB0aGUgc3RhcnRpbmcgcHJvamVjdGVkIGluZGV4XG4gICAgbGV0IHN0YXJ0aW5nSW5kZXggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0dWFsSW5kZXg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbSA9IGxpc3RbaV07XG4gICAgICBzdGFydGluZ0luZGV4ICs9IGl0ZW0uY29sU3BhbiB8fCAxO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQXJyYXkobGlzdFthY3R1YWxJbmRleF0uY29sU3BhbikuZmlsbCgwKS5tYXAoKF8sIGluZGV4KSA9PiBzdGFydGluZ0luZGV4ICsgaW5kZXgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHByb2plY3RlZEluZGljZXNUb0FjdHVhbEluZGljZXMoXG4gICAgcHJvamVjdGVkSW5kaWNlczogbnVtYmVyW10sXG4gICAgbGlzdDogQUlUYWJsZUhlYWRlckl0ZW1bXSB8IFRhYmxlSXRlbVtdXG4gICkge1xuICAgIGNvbnN0IGFjdHVhbEluZGljZXNTZXQgPSBuZXcgU2V0KCk7XG5cbiAgICBmb3IgKGxldCBwcm9qZWN0ZWRJbmRleCBvZiBwcm9qZWN0ZWRJbmRpY2VzKSB7XG4gICAgICBhY3R1YWxJbmRpY2VzU2V0LmFkZCh0aGlzLnByb2plY3RlZEluZGV4VG9BY3R1YWxJbmRleChwcm9qZWN0ZWRJbmRleCwgbGlzdCkpO1xuICAgIH1cblxuICAgIHJldHVybiBBcnJheS5mcm9tKGFjdHVhbEluZGljZXNTZXQpLnNvcnQoKSBhcyBudW1iZXJbXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtb3ZlTXVsdGlwbGVUb0luZGV4KGluZGljZXM6IG51bWJlcltdLCBpbmRleCwgbGlzdDogQUlUYWJsZUhlYWRlckl0ZW1bXSB8IFRhYmxlSXRlbVtdKSB7XG4gICAgLy8gYXNzdW1lcyBpbmRpY2VzIGlzIHNvcnRlZCBsb3cgdG8gaGlnaCBhbmQgY29udGludW91c1xuICAgIC8vIE5PVEUgbWlnaHQgbmVlZCB0byBnZW5lcmFsaXplIGl0XG4gICAgY29uc3QgYmxvY2tTdGFydCA9IGluZGljZXNbMF07XG4gICAgY29uc3QgYmxvY2tFbmQgPSBpbmRpY2VzW2luZGljZXMubGVuZ3RoIC0gMV07XG4gICAgLy8gaWYgbW92aW5nIHRvIGxlZnRcbiAgICBpZiAoYmxvY2tTdGFydCA+IGluZGV4KSB7XG4gICAgICBjb25zdCBibG9jayA9IGxpc3Quc3BsaWNlKGJsb2NrU3RhcnQsIGJsb2NrRW5kIC0gYmxvY2tTdGFydCArIDEpO1xuICAgICAgbGlzdC5zcGxpY2UuYXBwbHkobGlzdCwgW2luZGV4LCAwXS5jb25jYXQoYmxvY2spKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaWYgbW92aW5nIHRvIHJpZ2h0XG4gICAgICBjb25zdCBibG9jayA9IGxpc3Quc2xpY2UoYmxvY2tTdGFydCwgYmxvY2tFbmQgKyAxKTtcbiAgICAgIGxpc3Quc3BsaWNlLmFwcGx5KGxpc3QsIFtpbmRleCArIDEsIDBdLmNvbmNhdChibG9jaykpO1xuICAgICAgbGlzdC5zcGxpY2UoYmxvY2tTdGFydCwgYmxvY2tFbmQgLSBibG9ja1N0YXJ0ICsgMSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHRhYnVsYXJUb05lc3RlZChcbiAgICBoZWFkZXJSb3c6IEFJVGFibGVIZWFkZXJJdGVtW10gPSBbXSxcbiAgICBhdmFpbGFibGVIZWFkZXJJdGVtczogQUlUYWJsZUhlYWRlckl0ZW1bXVtdID0gW10sXG4gICAgLy8gVGhpcyBhbGxvd3MgdXMgdG8gd2FsayB0aGUgbGVhdmVzIGFzIGlmIHRoZXkgd2VyZSBpbiBhIGxpc3QgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICAgIC8vIFdlIG5lZWQgdG8gcGFzcyBieSByZWZlcmVuY2Ugc28gdGhhdCB3ZSBjYW4gdXBkYXRlIHRoaXMgdmFsdWUgZnJvbSB3aXRoaW4gdGhlIHJlY3Vyc2lvbi5cbiAgICBsZWFmSW5kZXhSZWYgPSB7IGN1cnJlbnQ6IDAgfSxcbiAgICByb3dJbmRleCA9IDBcbiAgKSB7XG4gICAgaWYgKCFoZWFkZXJSb3cubGVuZ3RoICYmIHJvd0luZGV4ID09PSAwKSB7XG4gICAgICBoZWFkZXJSb3cgPSB0aGlzLmhlYWRlclswXTtcbiAgICB9XG5cbiAgICBpZiAoIWF2YWlsYWJsZUhlYWRlckl0ZW1zLmxlbmd0aCkge1xuICAgICAgYXZhaWxhYmxlSGVhZGVySXRlbXMgPSB0aGlzLmhlYWRlci5tYXAoKGhlYWRlclJvdykgPT5cbiAgICAgICAgaGVhZGVyUm93LmZpbHRlcigoaGVhZGVySXRlbSkgPT4gaGVhZGVySXRlbSAhPT0gbnVsbClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhlYWRlclJvd1xuICAgICAgLmZpbHRlcigoaGVhZGVySXRlbSkgPT4gaGVhZGVySXRlbSAhPT0gbnVsbClcbiAgICAgIC5tYXAoKGhlYWRlckl0ZW0sIGkpID0+IHtcbiAgICAgICAgY29uc3QgY29sU3BhbiA9IGhlYWRlckl0ZW0/LmNvbFNwYW4gfHwgMTtcbiAgICAgICAgY29uc3Qgcm93U3BhbiA9IGhlYWRlckl0ZW0/LnJvd1NwYW4gfHwgMTtcblxuICAgICAgICAvLyBMZWFmXG4gICAgICAgIGlmIChyb3dJbmRleCArIHJvd1NwYW4gPj0gdGhpcy5oZWFkZXIubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgbGVhZkluZGV4ID0gbGVhZkluZGV4UmVmLmN1cnJlbnQ7XG4gICAgICAgICAgbGVhZkluZGV4UmVmLmN1cnJlbnQgKz0gY29sU3BhbjtcblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWFkZXJJdGVtLFxuICAgICAgICAgICAgbGVhZkluZGV4LFxuICAgICAgICAgICAgcm93SW5kZXgsXG4gICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcGFjZUxlZnQgPSBjb2xTcGFuO1xuICAgICAgICBjb25zdCBhdmFpbGFibGVDaGlsZHJlbiA9IGF2YWlsYWJsZUhlYWRlckl0ZW1zW3Jvd0luZGV4ICsgcm93U3Bhbl07XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gW107XG5cbiAgICAgICAgd2hpbGUgKHNwYWNlTGVmdCA+IDAgJiYgYXZhaWxhYmxlQ2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgbmV4dENoaWxkID0gYXZhaWxhYmxlQ2hpbGRyZW4uc2hpZnQoKTtcbiAgICAgICAgICBzcGFjZUxlZnQgLT0gbmV4dENoaWxkPy5jb2xTcGFuIHx8IDE7XG4gICAgICAgICAgY2hpbGRyZW4ucHVzaChuZXh0Q2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoZWFkZXJJdGVtLFxuICAgICAgICAgIGxlYWZJbmRleDogLTEsXG4gICAgICAgICAgcm93SW5kZXgsXG4gICAgICAgICAgY2hpbGRyZW46IHRoaXMudGFidWxhclRvTmVzdGVkKFxuICAgICAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgICAgICBhdmFpbGFibGVIZWFkZXJJdGVtcyxcbiAgICAgICAgICAgIGxlYWZJbmRleFJlZixcbiAgICAgICAgICAgIHJvd0luZGV4ICsgcm93U3BhblxuICAgICAgICAgICksXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBuZXN0ZWRUb1RhYnVsYXIoXG4gICAgbmVzdGVkOiBhbnksXG4gICAgaGVhZGVyOiBBSVRhYmxlSGVhZGVySXRlbVtdW10gPSBuZXcgQXJyYXkodGhpcy5oZWFkZXIubGVuZ3RoKS5maWxsKFtdKSxcbiAgICBkYXRhOiBUYWJsZUl0ZW1bXVtdID0gbmV3IEFycmF5KHRoaXMuX2RhdGEubGVuZ3RoKS5maWxsKFtdKSxcbiAgICByb3dJbmRleCA9IDBcbiAgKSB7XG4gICAgbmVzdGVkLmZvckVhY2goKGhlYWRlck9iajogYW55KSA9PiB7XG4gICAgICBjb25zdCByb3dTcGFuID0gaGVhZGVyT2JqLmhlYWRlckl0ZW0/LnJvd1NwYW4gfHwgMTtcbiAgICAgIGNvbnN0IGNvbFNwYW4gPSBoZWFkZXJPYmouaGVhZGVySXRlbT8uY29sU3BhbiB8fCAxO1xuXG4gICAgICBoZWFkZXJbcm93SW5kZXhdID0gWy4uLmhlYWRlcltyb3dJbmRleF0sIGhlYWRlck9iai5oZWFkZXJJdGVtXTtcblxuICAgICAgaWYgKGhlYWRlck9iai5sZWFmSW5kZXggPj0gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBkYXRhW2ldID0gW1xuICAgICAgICAgICAgLi4uZGF0YVtpXSxcbiAgICAgICAgICAgIC4uLnRoaXMuX2RhdGFbaV0uc2xpY2UoaGVhZGVyT2JqLmxlYWZJbmRleCwgaGVhZGVyT2JqLmxlYWZJbmRleCArIGNvbFNwYW4pLFxuICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJvd0luZGV4ICsgcm93U3BhbiA+PSB0aGlzLmhlYWRlci5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGhlYWRlck9iai5jaGlsZHJlbjtcbiAgICAgIHRoaXMubmVzdGVkVG9UYWJ1bGFyKGNoaWxkcmVuLCBoZWFkZXIsIGRhdGEsIHJvd0luZGV4ICsgcm93U3Bhbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaGVhZGVyLFxuICAgICAgZGF0YSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmUgYG5lc3RlZGAgZWxlbWVudCBhdCBgcm93SW5kZXhgIHdpdGggaW5kZXggYGluZGV4RnJvbWAgdG8gYGluZGV4VG9gLlxuICAgKi9cbiAgcHJvdGVjdGVkIG1vdmVOZXN0ZWQoXG4gICAgbmVzdGVkOiBhbnksXG4gICAgaW5kZXhGcm9tOiBudW1iZXIsXG4gICAgaW5kZXhUbzogbnVtYmVyLFxuICAgIHJvd0luZGV4ID0gMCxcbiAgICBzdGFydGluZ0NoaWxkSW5kZXggPSAwXG4gICkge1xuICAgIGlmICghbmVzdGVkLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRSb3dJbmRleCA9IG5lc3RlZFswXS5yb3dJbmRleDtcbiAgICBpZiAoXG4gICAgICBjdXJyZW50Um93SW5kZXggPT09IHJvd0luZGV4ICYmXG4gICAgICBzdGFydGluZ0NoaWxkSW5kZXggPD0gaW5kZXhGcm9tICYmXG4gICAgICBzdGFydGluZ0NoaWxkSW5kZXggKyBuZXN0ZWQubGVuZ3RoID49IGluZGV4RnJvbSAmJlxuICAgICAgc3RhcnRpbmdDaGlsZEluZGV4IDw9IGluZGV4VG8gJiZcbiAgICAgIHN0YXJ0aW5nQ2hpbGRJbmRleCArIG5lc3RlZC5sZW5ndGggPj0gaW5kZXhUb1xuICAgICkge1xuICAgICAgdGhpcy5tb3ZlTXVsdGlwbGVUb0luZGV4KFxuICAgICAgICBbaW5kZXhGcm9tIC0gc3RhcnRpbmdDaGlsZEluZGV4XSxcbiAgICAgICAgaW5kZXhUbyAtIHN0YXJ0aW5nQ2hpbGRJbmRleCxcbiAgICAgICAgbmVzdGVkXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5lc3RlZC5mb3JFYWNoKChoZWFkZXJPYmo6IGFueSwgaTogbnVtYmVyKSA9PiB7XG4gICAgICBjb25zdCByb3dTcGFuID0gaGVhZGVyT2JqLmhlYWRlckl0ZW0/LnJvd1NwYW4gfHwgMTtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gaGVhZGVyT2JqLmNoaWxkcmVuO1xuICAgICAgdGhpcy5tb3ZlTmVzdGVkKFxuICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgaW5kZXhGcm9tLFxuICAgICAgICBpbmRleFRvLFxuICAgICAgICByb3dJbmRleCxcbiAgICAgICAgdGhpcy5oZWFkZXJbY3VycmVudFJvd0luZGV4ICsgcm93U3Bhbl0/LmluZGV4T2YoY2hpbGRyZW5bMF0/LmhlYWRlckl0ZW0pXG4gICAgICApO1xuICAgIH0pO1xuICB9XG59XG4iXX0=