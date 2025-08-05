/**
 *
 * @ai-apps/angular v2.155.1 | sterling-table-model.class.js
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
import { Subject } from 'rxjs';
export class SCTableModel {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcmxpbmctdGFibGUtbW9kZWwuY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdG9vbGtpdC90YWJsZS9zdGVybGluZy10YWJsZS1tb2RlbC5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFakYsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixNQUFNLE9BQU8sWUFBWTtJQXdMdkI7UUFsTEEsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQzdCLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hDLHVCQUFrQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFDaEQsdUJBQWtCLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUNoRDs7O1dBR0c7UUFDSCxvQkFBZSxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUF3RXpDOztXQUVHO1FBQ0gsaUJBQVksR0FBYyxFQUFFLENBQUM7UUFFN0I7O1dBRUc7UUFDSCxpQkFBWSxHQUFjLEVBQUUsQ0FBQztRQUU3Qjs7Ozs7OztXQU9HO1FBQ0gsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFFM0I7Ozs7OztXQU1HO1FBQ0gsY0FBUyxHQUFhLEVBQUUsQ0FBQztRQUV6Qjs7V0FFRztRQUNILGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBRWhCOztXQUVHO1FBQ0gsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUVoQjs7V0FFRztRQUNILFVBQUssR0FBRyxLQUFLLENBQUM7UUFFZDs7V0FFRztRQUNILGNBQVMsR0FBRyxLQUFLLENBQUM7UUFzQ2xCOztXQUVHO1FBQ08sVUFBSyxHQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTVCLFlBQU8sR0FB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QUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ08sU0FBUyxDQUFDLEtBQWEsRUFBRSxNQUFjO1FBQy9DLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtZQUNqQixPQUFPLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDbkI7YUFBTSxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDckIsT0FBTyxLQUFLLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7U0FDN0M7YUFBTTtZQUNMLE9BQU8sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDOUM7SUFDSCxDQUFDOztBQXJyQkQ7O0dBRUc7QUFDYyxrQkFBSyxHQUFHLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGFibGVIZWFkZXJJdGVtLCBUYWJsZUl0ZW0sIFRhYmxlUm93IH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhcic7XG5pbXBvcnQgeyBIZWFkZXJUeXBlIH0gZnJvbSAnY2FyYm9uLWNvbXBvbmVudHMtYW5ndWxhci90YWJsZS90YWJsZS1tb2RlbC5jbGFzcyc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBjbGFzcyBTQ1RhYmxlTW9kZWwge1xuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBtb2RlbHMgaW5zdGFudGlhdGVkLCB1c2VkIGZvciAoYW1vbmcgb3RoZXIgdGhpbmdzKSB1bmlxdWUgaWQgZ2VuZXJhdGlvblxuICAgKi9cbiAgcHJvdGVjdGVkIHN0YXRpYyBDT1VOVCA9IDA7XG5cbiAgaGVhZGVyQ2hhbmdlID0gbmV3IFN1YmplY3QoKTtcbiAgZGF0YUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcm93c1NlbGVjdGVkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG4gIHJvd3NFeHBhbmRlZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuICAvKipcbiAgICogR2V0cyBlbWl0dGVkIHdoZW4gYHNlbGVjdEFsbGAgaXMgY2FsbGVkLiBFbWl0cyBmYWxzZSBpZiBhbGwgcm93cyBhcmUgZGVzZWxlY3RlZCBhbmQgdHJ1ZSBpZlxuICAgKiBhbGwgcm93cyBhcmUgc2VsZWN0ZWQuXG4gICAqL1xuICBzZWxlY3RBbGxDaGFuZ2UgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgaGVhZGVyIGNlbGxzIG9mIHRoZSB0YWJsZS5cbiAgICovXG4gIHNldCBoZWFkZXIobmV3SGVhZGVyOiBhbnkpIHtcbiAgICBpZiAoIW5ld0hlYWRlciB8fCAoQXJyYXkuaXNBcnJheShuZXdIZWFkZXIpICYmIG5ld0hlYWRlci5sZW5ndGggPT09IDApKSB7XG4gICAgICBuZXdIZWFkZXIgPSBbW11dO1xuICAgIH1cblxuICAgIHRoaXMuX2hlYWRlciA9IG5ld0hlYWRlcjtcblxuICAgIGlmICh0aGlzLmhlYWRlckNoYW5nZSkge1xuICAgICAgdGhpcy5oZWFkZXJDaGFuZ2UubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBoZWFkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGRhdGEgb2YgdGhlIHRhYmxlLlxuICAgKlxuICAgKiBNYWtlIHN1cmUgYWxsIHJvd3MgYXJlIHRoZSBzYW1lIGxlbmd0aCB0byBrZWVwIHRoZSBjb2x1bW4gY291bnQgYWNjdXJhdGUuXG4gICAqL1xuICBzZXQgZGF0YShuZXdEYXRhOiBUYWJsZUl0ZW1bXVtdKSB7XG4gICAgaWYgKCFuZXdEYXRhIHx8IChBcnJheS5pc0FycmF5KG5ld0RhdGEpICYmIG5ld0RhdGEubGVuZ3RoID09PSAwKSkge1xuICAgICAgbmV3RGF0YSA9IFtbXV07XG4gICAgfVxuXG4gICAgdGhpcy5fZGF0YSA9IG5ld0RhdGE7XG5cbiAgICAvLyBpbml0IHJvd3NTZWxlY3RlZFxuICAgIHRoaXMucm93c1NlbGVjdGVkID0gbmV3IEFycmF5PGJvb2xlYW4+KHRoaXMuX2RhdGEubGVuZ3RoKS5maWxsKGZhbHNlKTtcbiAgICB0aGlzLnJvd3NFeHBhbmRlZCA9IG5ldyBBcnJheTxib29sZWFuPih0aGlzLl9kYXRhLmxlbmd0aCkuZmlsbChmYWxzZSk7XG5cbiAgICAvLyBpbml0IHJvd3NDb250ZXh0XG4gICAgdGhpcy5yb3dzQ29udGV4dCA9IG5ldyBBcnJheTxzdHJpbmc+KHRoaXMuX2RhdGEubGVuZ3RoKTtcblxuICAgIC8vIGluaXQgcm93c0NsYXNzXG4gICAgdGhpcy5yb3dzQ2xhc3MgPSBuZXcgQXJyYXk8c3RyaW5nPih0aGlzLl9kYXRhLmxlbmd0aCk7XG5cbiAgICAvLyBvbmx5IGNyZWF0ZSBhIGZyZXNoIGhlYWRlciBpZiBuZWNlc3NhcnkgKGhlYWRlciBkb2Vzbid0IGV4aXN0IG9yIGRpZmZlcnMgaW4gbGVuZ3RoKVxuICAgIC8vIHRoaXMgd2lsbCBvbmx5IGNyZWF0ZSBhIHNpbmdsZSBsZXZlbCBvZiBoZWFkZXJzIChpdCB3aWxsIGRlc3Ryb3kgYW55IGV4aXN0aW5nIGhlYWRlciBpdGVtcylcbiAgICBpZiAoXG4gICAgICB0aGlzLmhlYWRlciA9PSBudWxsIHx8XG4gICAgICAodGhpcy5oZWFkZXJbMF0ubGVuZ3RoICE9PSB0aGlzLl9kYXRhWzBdLmxlbmd0aCAmJiB0aGlzLl9kYXRhWzBdLmxlbmd0aCA+IDApXG4gICAgKSB7XG4gICAgICBjb25zdCBuZXdIZWFkZXIgPSBbW11dO1xuICAgICAgLy8gZGlzYWJsZSB0aGlzIHRzbGludCBoZXJlIHNpbmNlIHdlIGRvbid0IGFjdHVhbGx5IHdhbnQgdG9cbiAgICAgIC8vIGxvb3AgdGhlIGNvbnRlbnRzIG9mIHRoZSBkYXRhXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZGF0YVswXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBuZXdIZWFkZXJbMF0ucHVzaChuZXcgVGFibGVIZWFkZXJJdGVtKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5oZWFkZXIgPSBuZXdIZWFkZXI7XG4gICAgfVxuXG4gICAgdGhpcy5kYXRhQ2hhbmdlLmVtaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBmdWxsIGRhdGEuXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIGl0IHRvIGFsdGVyIGluZGl2aWR1YWwgYFRhYmxlSXRlbWBzIGJ1dCBpZiB5b3UgbmVlZCB0byBjaGFuZ2VcbiAgICogdGFibGUgc3RydWN0dXJlLCB1c2UgYGFkZFJvdygpYCBhbmQvb3IgYGFkZENvbHVtbigpYFxuICAgKi9cbiAgZ2V0IGRhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogQ29udGFpbnMgaW5mb3JtYXRpb24gYWJvdXQgc2VsZWN0aW9uIHN0YXRlIG9mIHJvd3MgaW4gdGhlIHRhYmxlLlxuICAgKi9cbiAgcm93c1NlbGVjdGVkOiBib29sZWFuW10gPSBbXTtcblxuICAvKipcbiAgICogQ29udGFpbnMgaW5mb3JtYXRpb24gYWJvdXQgZXhwYW5kZWQgc3RhdGUgb2Ygcm93cyBpbiB0aGUgdGFibGUuXG4gICAqL1xuICByb3dzRXhwYW5kZWQ6IGJvb2xlYW5bXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY29udGV4dCBvZiB0aGUgcm93LlxuICAgKlxuICAgKiBJdCBhZmZlY3RzIHN0eWxpbmcgb2YgdGhlIHJvdyB0byByZWZsZWN0IHRoZSBjb250ZXh0LlxuICAgKlxuICAgKiBzdHJpbmcgY2FuIGJlIG9uZSBvZiBgXCJzdWNjZXNzXCIgfCBcIndhcm5pbmdcIiB8IFwiaW5mb1wiIHwgXCJlcnJvclwiIHwgXCJcImAgYW5kIGl0J3NcbiAgICogZW1wdHkgb3IgdW5kZWZpbmVkIGJ5IGRlZmF1bHRcbiAgICovXG4gIHJvd3NDb250ZXh0OiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyBjbGFzcyBuYW1lKHMpIG9mIHRoZSByb3cuXG4gICAqXG4gICAqIEl0IGFmZmVjdHMgc3R5bGluZyBvZiB0aGUgcm93IHRvIHJlZmxlY3QgdGhlIGFwcGVuZGVkIGNsYXNzIG5hbWUocykuXG4gICAqXG4gICAqIEl0J3MgZW1wdHkgb3IgdW5kZWZpbmVkIGJ5IGRlZmF1bHRcbiAgICovXG4gIHJvd3NDbGFzczogc3RyaW5nW10gPSBbXTtcblxuICAvKipcbiAgICogVHJhY2tzIHRoZSBjdXJyZW50IHBhZ2UuXG4gICAqL1xuICBjdXJyZW50UGFnZSA9IDE7XG5cbiAgLyoqXG4gICAqIExlbmd0aCBvZiBwYWdlLlxuICAgKi9cbiAgcGFnZUxlbmd0aCA9IDEwO1xuXG4gIC8qKlxuICAgKiBTZXQgdG8gdHJ1ZSB3aGVuIHRoZXJlIGlzIG5vIG1vcmUgZGF0YSB0byBsb2FkIGluIHRoZSB0YWJsZVxuICAgKi9cbiAgaXNFbmQgPSBmYWxzZTtcblxuICAvKipcbiAgICogU2V0IHRvIHRydWUgd2hlbiBsYXp5IGxvYWRpbmcgdG8gc2hvdyBsb2FkaW5nIGluZGljYXRvclxuICAgKi9cbiAgaXNMb2FkaW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEFic29sdXRlIHRvdGFsIG51bWJlciBvZiByb3dzIG9mIHRoZSB0YWJsZS5cbiAgICovXG4gIHByb3RlY3RlZCBfdG90YWxEYXRhTGVuZ3RoOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIE1hbnVhbGx5IHNldCBkYXRhIGxlbmd0aCBpbiBjYXNlIHRoZSBkYXRhIGluIHRoZSB0YWJsZSBkb2Vzbid0XG4gICAqIGNvcnJlY3RseSByZWZsZWN0IGFsbCB0aGUgZGF0YSB0aGF0IHRhYmxlIGlzIHRvIGRpc3BsYXkuXG4gICAqXG4gICAqIEV4YW1wbGU6IGlmIHlvdSBoYXZlIG11bHRpcGxlIHBhZ2VzIG9mIGRhdGEgdGhhdCB0YWJsZSB3aWxsIGRpc3BsYXlcbiAgICogYnV0IHlvdSdyZSBsb2FkaW5nIG9uZSBhdCBhIHRpbWUuXG4gICAqXG4gICAqIFNldCB0byBgbnVsbGAgdG8gcmVzZXQgdG8gZGVmYXVsdCBiZWhhdmlvci5cbiAgICovXG4gIHNldCB0b3RhbERhdGFMZW5ndGgobGVuZ3RoOiBudW1iZXIpIHtcbiAgICAvLyBpZiB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRob3V0IGEgcGFyYW1ldGVyIHdlIG5lZWQgdG8gc2V0IHRvIG51bGwgdG8gYXZvaWQgaGF2aW5nIHVuZGVmaW5lZCAhPSBudWxsXG4gICAgdGhpcy5fdG90YWxEYXRhTGVuZ3RoID0gbGVuZ3RoIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVG90YWwgbGVuZ3RoIG9mIGRhdGEgdGhhdCB0YWJsZSBoYXMgYWNjZXNzIHRvLCBvciB0aGUgYW1vdW50IG1hbnVhbGx5IHNldFxuICAgKi9cbiAgZ2V0IHRvdGFsRGF0YUxlbmd0aCgpIHtcbiAgICAvLyBpZiBtYW51YWxseSBzZXQgZGF0YSBsZW5ndGhcbiAgICBpZiAodGhpcy5fdG90YWxEYXRhTGVuZ3RoICE9PSBudWxsICYmIHRoaXMuX3RvdGFsRGF0YUxlbmd0aCA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdG90YWxEYXRhTGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIGlmIGVtcHR5IGRhdGFzZXRcbiAgICBpZiAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGggPT09IDEgJiYgdGhpcy5kYXRhWzBdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBpbiBgZGF0YWBcbiAgICovXG4gIHByb3RlY3RlZCBfZGF0YTogVGFibGVJdGVtW11bXSA9IFtbXV07XG5cbiAgcHJvdGVjdGVkIF9oZWFkZXI6IFRhYmxlSGVhZGVySXRlbVtdW10gPSBbW11dO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1vZGVscyBpbnN0YW50aWF0ZWQsIHRoaXMgaXMgdG8gbWFrZSBzdXJlIGVhY2ggdGFibGUgaGFzIGEgZGlmZmVyZW50XG4gICAqIG1vZGVsIGNvdW50IGZvciB1bmlxdWUgaWQgZ2VuZXJhdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCB0YWJsZU1vZGVsQ291bnQgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGFibGVNb2RlbENvdW50ID0gU0NUYWJsZU1vZGVsLkNPVU5UKys7XG4gIH1cblxuICBpc1Jvd0ZpbHRlcmVkKGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCByZWFsSW5kZXggPSB0aGlzLnJlYWxSb3dJbmRleChpbmRleCk7XG4gICAgcmV0dXJuIHRoaXMuaGVhZGVyLnNvbWUoKGhlYWRlclJvdzogVGFibGVIZWFkZXJJdGVtW10pID0+XG4gICAgICBoZWFkZXJSb3cuc29tZSgoaXRlbSwgaSkgPT4gaXRlbSAmJiBpdGVtLmZpbHRlcih0aGlzLnJvdyhyZWFsSW5kZXgpW2ldKSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaWQgZm9yIHRoZSBnaXZlbiBjb2x1bW5cbiAgICpcbiAgICogQHBhcmFtIGNvbHVtbiB0aGUgY29sdW1uIHRvIGdlbmVyYXRlIGFuIGlkIGZvclxuICAgKiBAcGFyYW0gcm93IHRoZSByb3cgb2YgdGhlIGhlYWRlciB0byBnZW5lcmF0ZSBhbiBpZCBmb3JcbiAgICovXG4gIGdldElkKGNvbHVtbjogSGVhZGVyVHlwZSwgcm93ID0gMCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGB0YWJsZS1oZWFkZXItJHtyb3d9LSR7Y29sdW1ufS0ke3RoaXMudGFibGVNb2RlbENvdW50fWA7XG4gIH1cblxuICBnZXRIZWFkZXJJZChjb2x1bW46IG51bWJlciB8ICdzZWxlY3QnIHwgJ2V4cGFuZCcsIGNvbFNwYW4gPSAxKTogc3RyaW5nIHtcbiAgICBpZiAoY29sdW1uID09PSAnc2VsZWN0JyB8fCBjb2x1bW4gPT09ICdleHBhbmQnKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRJZChjb2x1bW4pO1xuICAgIH1cblxuICAgIGNvbnN0IGlkcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSB0aGlzLmhlYWRlci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgZm9yIChsZXQgaiA9IGNvbHVtbjsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgaWYgKHRoaXMuaGVhZGVyW2ldW2pdKSB7XG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjb2xTcGFuOyBrKyspIHtcbiAgICAgICAgICAgIGlkcy5wdXNoKHRoaXMuZ2V0SWQoaiArIGssIGkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaWRzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kcyBjbG9zZXN0IGhlYWRlciBieSB0cnlpbmcgdGhlIGxvd2VzdCBjZWxsIGluIGhlYWRlciBhbmQgdGhlbiB3b3JrIGl0cyB3YXkgdG8gdGhlIGxlZnRcbiAgICogQHBhcmFtIGNvbHVtblxuICAgKi9cbiAgZ2V0SGVhZGVyKGNvbHVtbikge1xuICAgIGlmICghdGhpcy5oZWFkZXIpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSB0aGlzLmhlYWRlci5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgaGVhZGVyQ2VsbCA9IHRoaXMuaGVhZGVyW2ldW2NvbHVtbl07XG5cbiAgICAgIGlmIChoZWFkZXJDZWxsKSB7XG4gICAgICAgIHJldHVybiBoZWFkZXJDZWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBjb2x1bW47IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBoZWFkZXJDZWxsID0gdGhpcy5oZWFkZXJbMF1baV07XG4gICAgICBpZiAoaGVhZGVyQ2VsbCkge1xuICAgICAgICByZXR1cm4gaGVhZGVyQ2VsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhvdyBtYW55IHJvd3MgaXMgY3VycmVudGx5IHNlbGVjdGVkXG4gICAqL1xuICBzZWxlY3RlZFJvd3NDb3VudCgpOiBudW1iZXIge1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgaWYgKHRoaXMucm93c1NlbGVjdGVkKSB7XG4gICAgICB0aGlzLnJvd3NTZWxlY3RlZC5mb3JFYWNoKChyb3dTZWxlY3RlZCkgPT4ge1xuICAgICAgICBpZiAocm93U2VsZWN0ZWQpIHtcbiAgICAgICAgICBjb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgaG93IG1hbnkgcm93cyBpcyBjdXJyZW50bHkgZXhwYW5kZWRcbiAgICovXG4gIGV4cGFuZGVkUm93c0NvdW50KCk6IG51bWJlciB7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBpZiAodGhpcy5yb3dzRXhwYW5kZWQpIHtcbiAgICAgIHRoaXMucm93c0V4cGFuZGVkLmZvckVhY2goKHJvd0V4cGFuZGVkKSA9PiB7XG4gICAgICAgIGlmIChyb3dFeHBhbmRlZCkge1xuICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgaW5kZXhgdGggcm93IG9mIHRoZSB0YWJsZS5cbiAgICpcbiAgICogTmVnYXRpdmUgaW5kZXggc3RhcnRzIGZyb20gdGhlIGVuZC4gLTEgYmVpbmcgdGhlIGxhc3QgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4XG4gICAqL1xuICByb3coaW5kZXg6IG51bWJlcik6IFRhYmxlSXRlbVtdIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMucmVhbFJvd0luZGV4KGluZGV4KV07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHJvdyB0byB0aGUgYGluZGV4YHRoIHJvdyBvciBhcHBlbmRzIHRvIHRhYmxlIGlmIGluZGV4IG5vdCBwcm92aWRlZC5cbiAgICpcbiAgICogSWYgcm93IGlzIHNob3J0ZXIgdGhhbiBvdGhlciByb3dzIG9yIG5vdCBwcm92aWRlZCwgaXQgd2lsbCBiZSBwYWRkZWQgd2l0aFxuICAgKiBlbXB0eSBgVGFibGVJdGVtYCBlbGVtZW50cy5cbiAgICpcbiAgICogSWYgcm93IGlzIGxvbmdlciB0aGFuIG90aGVyIHJvd3MsIG90aGVycyB3aWxsIGJlIGV4dGVuZGVkIHRvIG1hdGNoIHNvIG5vIGRhdGEgaXMgbG9zdC5cbiAgICpcbiAgICogSWYgY2FsbGVkIG9uIGFuIGVtcHR5IHRhYmxlIHdpdGggbm8gcGFyYW1ldGVycywgaXQgY3JlYXRlcyBhIDF4MSB0YWJsZS5cbiAgICpcbiAgICogTmVnYXRpdmUgaW5kZXggc3RhcnRzIGZyb20gdGhlIGVuZC4gLTEgYmVpbmcgdGhlIGxhc3QgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIFtyb3ddXG4gICAqIEBwYXJhbSBbaW5kZXhdXG4gICAqL1xuICBhZGRSb3cocm93PzogVGFibGVJdGVtW10sIGluZGV4PzogbnVtYmVyKSB7XG4gICAgLy8gaWYgdGFibGUgZW1wdHkgY3JlYXRlIHRhYmxlIHdpdGggcm93XG4gICAgaWYgKCF0aGlzLmRhdGEgfHwgdGhpcy5kYXRhLmxlbmd0aCA9PT0gMCB8fCB0aGlzLmRhdGFbMF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICBsZXQgbmV3RGF0YSA9IG5ldyBBcnJheTxBcnJheTxUYWJsZUl0ZW0+PigpO1xuICAgICAgbmV3RGF0YS5wdXNoKHJvdyA/IHJvdyA6IFtuZXcgVGFibGVJdGVtKCldKTsgLy8gcm93IG9yIG9uZSBlbXB0eSBvbmUgY29sdW1uIHJvd1xuICAgICAgdGhpcy5kYXRhID0gbmV3RGF0YTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCByZWFsUm93ID0gcm93O1xuICAgIGNvbnN0IGNvbHVtbkNvdW50ID0gdGhpcy5kYXRhWzBdLmxlbmd0aDtcblxuICAgIGlmIChyb3cgPT0gbnVsbCkge1xuICAgICAgcmVhbFJvdyA9IG5ldyBBcnJheTxUYWJsZUl0ZW0+KCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbkNvdW50OyBpKyspIHtcbiAgICAgICAgcmVhbFJvdy5wdXNoKG5ldyBUYWJsZUl0ZW0oKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlYWxSb3cubGVuZ3RoIDwgY29sdW1uQ291bnQpIHtcbiAgICAgIC8vIGV4dGVuZCB0aGUgbGVuZ3RoIG9mIHJlYWxSb3dcbiAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSBjb2x1bW5Db3VudCAtIHJlYWxSb3cubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmZXJlbmNlOyBpKyspIHtcbiAgICAgICAgcmVhbFJvdy5wdXNoKG5ldyBUYWJsZUl0ZW0oKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZWFsUm93Lmxlbmd0aCA+IGNvbHVtbkNvdW50KSB7XG4gICAgICAvLyBleHRlbmQgdGhlIGxlbmd0aCBvZiBoZWFkZXJcbiAgICAgIGxldCBkaWZmZXJlbmNlID0gcmVhbFJvdy5sZW5ndGggLSB0aGlzLmhlYWRlci5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRpZmZlcmVuY2U7IGorKykge1xuICAgICAgICB0aGlzLmhlYWRlci5wdXNoKG5ldyBUYWJsZUhlYWRlckl0ZW0oKSk7XG4gICAgICB9XG4gICAgICAvLyBleHRlbmQgdGhlIGxlbmd0aCBvZiBldmVyeSBvdGhlciByb3dcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjdXJyZW50Um93ID0gdGhpcy5kYXRhW2ldO1xuICAgICAgICBkaWZmZXJlbmNlID0gcmVhbFJvdy5sZW5ndGggLSBjdXJyZW50Um93Lmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkaWZmZXJlbmNlOyBqKyspIHtcbiAgICAgICAgICBjdXJyZW50Um93LnB1c2gobmV3IFRhYmxlSXRlbSgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbmRleCA9PSBudWxsKSB7XG4gICAgICB0aGlzLmRhdGEucHVzaChyZWFsUm93KTtcblxuICAgICAgLy8gdXBkYXRlIHJvd3NTZWxlY3RlZCBwcm9wZXJ0eSBmb3IgbGVuZ3RoXG4gICAgICB0aGlzLnJvd3NTZWxlY3RlZC5wdXNoKGZhbHNlKTtcblxuICAgICAgLy8gdXBkYXRlIHJvd3NFeHBhbmRlZCBwcm9wZXJ0eSBmb3IgbGVuZ3RoXG4gICAgICB0aGlzLnJvd3NFeHBhbmRlZC5wdXNoKGZhbHNlKTtcblxuICAgICAgLy8gdXBkYXRlIHJvd3NDb250ZXh0IHByb3BlcnR5IGZvciBsZW5ndGhcbiAgICAgIHRoaXMucm93c0NvbnRleHQucHVzaCh1bmRlZmluZWQpO1xuXG4gICAgICAvLyB1cGRhdGUgcm93c0NsYXNzIHByb3BlcnR5IGZvciBsZW5ndGhcbiAgICAgIHRoaXMucm93c0NsYXNzLnB1c2godW5kZWZpbmVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmkgPSB0aGlzLnJlYWxSb3dJbmRleChpbmRleCk7XG4gICAgICB0aGlzLmRhdGEuc3BsaWNlKHJpLCAwLCByZWFsUm93KTtcblxuICAgICAgLy8gdXBkYXRlIHJvd3NTZWxlY3RlZCBwcm9wZXJ0eSBmb3IgbGVuZ3RoXG4gICAgICB0aGlzLnJvd3NTZWxlY3RlZC5zcGxpY2UocmksIDAsIGZhbHNlKTtcblxuICAgICAgLy8gdXBkYXRlIHJvd3NFeHBhbmRlZCBwcm9wZXJ0eSBmb3IgbGVuZ3RoXG4gICAgICB0aGlzLnJvd3NFeHBhbmRlZC5zcGxpY2UocmksIDAsIGZhbHNlKTtcblxuICAgICAgLy8gdXBkYXRlIHJvd3NDb250ZXh0IHByb3BlcnR5IGZvciBsZW5ndGhcbiAgICAgIHRoaXMucm93c0NvbnRleHQuc3BsaWNlKHJpLCAwLCB1bmRlZmluZWQpO1xuXG4gICAgICAvLyB1cGRhdGUgcm93c0NsYXNzIHByb3BlcnR5IGZvciBsZW5ndGhcbiAgICAgIHRoaXMucm93c0NsYXNzLnNwbGljZShyaSwgMCwgdW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGFDaGFuZ2UuZW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgYGluZGV4YHRoIHJvdy5cbiAgICpcbiAgICogTmVnYXRpdmUgaW5kZXggc3RhcnRzIGZyb20gdGhlIGVuZC4gLTEgYmVpbmcgdGhlIGxhc3QgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4XG4gICAqL1xuICBkZWxldGVSb3coaW5kZXg6IG51bWJlcikge1xuICAgIGNvbnN0IHJyaSA9IHRoaXMucmVhbFJvd0luZGV4KGluZGV4KTtcbiAgICB0aGlzLmRhdGEuc3BsaWNlKHJyaSwgMSk7XG4gICAgdGhpcy5yb3dzU2VsZWN0ZWQuc3BsaWNlKHJyaSwgMSk7XG4gICAgdGhpcy5yb3dzRXhwYW5kZWQuc3BsaWNlKHJyaSwgMSk7XG4gICAgdGhpcy5yb3dzQ29udGV4dC5zcGxpY2UocnJpLCAxKTtcbiAgICB0aGlzLnJvd3NDbGFzcy5zcGxpY2UocnJpLCAxKTtcblxuICAgIHRoaXMuZGF0YUNoYW5nZS5lbWl0KCk7XG4gIH1cblxuICBoYXNFeHBhbmRhYmxlUm93cygpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLnNvbWUoKGRhdGEpID0+IGRhdGEuc29tZSgoZCkgPT4gZCAmJiBkLmV4cGFuZGVkRGF0YSkpOyAvLyBjaGVja2luZyBmb3Igc29tZSBpbiAyRCBhcnJheVxuICB9XG5cbiAgaXNSb3dFeHBhbmRhYmxlKGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW2luZGV4XS5zb21lKChkKSA9PiBkICYmIGQuZXhwYW5kZWREYXRhKTtcbiAgfVxuXG4gIGlzUm93RXhwYW5kZWQoaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLnJvd3NFeHBhbmRlZFtpbmRleF07XG4gIH1cblxuICBnZXRSb3dDb250ZXh0KGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gdGhpcy5yb3dzQ29udGV4dFtpbmRleF07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgaW5kZXhgdGggY29sdW1uIG9mIHRoZSB0YWJsZS5cbiAgICpcbiAgICogTmVnYXRpdmUgaW5kZXggc3RhcnRzIGZyb20gdGhlIGVuZC4gLTEgYmVpbmcgdGhlIGxhc3QgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4XG4gICAqL1xuICBjb2x1bW4oaW5kZXg6IG51bWJlcik6IFRhYmxlSXRlbVtdIHtcbiAgICBsZXQgY29sdW1uID0gbmV3IEFycmF5PFRhYmxlSXRlbT4oKTtcbiAgICBjb25zdCByaSA9IHRoaXMucmVhbENvbHVtbkluZGV4KGluZGV4KTtcbiAgICBjb25zdCByYyA9IHRoaXMuZGF0YS5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJjOyBpKyspIHtcbiAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZGF0YVtpXTtcbiAgICAgIGNvbHVtbi5wdXNoKHJvd1tyaV0pO1xuICAgIH1cblxuICAgIHJldHVybiBjb2x1bW47XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNvbHVtbiB0byB0aGUgYGluZGV4YHRoIGNvbHVtbiBvciBhcHBlbmRzIHRvIHRhYmxlIGlmIGluZGV4IG5vdCBwcm92aWRlZC5cbiAgICpcbiAgICogSWYgY29sdW1uIGlzIHNob3J0ZXIgdGhhbiBvdGhlciBjb2x1bW5zIG9yIG5vdCBwcm92aWRlZCwgaXQgd2lsbCBiZSBwYWRkZWQgd2l0aFxuICAgKiBlbXB0eSBgVGFibGVJdGVtYCBlbGVtZW50cy5cbiAgICpcbiAgICogSWYgY29sdW1uIGlzIGxvbmdlciB0aGFuIG90aGVyIGNvbHVtbnMsIG90aGVycyB3aWxsIGJlIGV4dGVuZGVkIHRvIG1hdGNoIHNvIG5vIGRhdGEgaXMgbG9zdC5cbiAgICpcbiAgICogSWYgY2FsbGVkIG9uIGFuIGVtcHR5IHRhYmxlIHdpdGggbm8gcGFyYW1ldGVycywgaXQgY3JlYXRlcyBhIDF4MSB0YWJsZS5cbiAgICpcbiAgICogTmVnYXRpdmUgaW5kZXggc3RhcnRzIGZyb20gdGhlIGVuZC4gLTEgYmVpbmcgdGhlIGxhc3QgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIFtjb2x1bW5dXG4gICAqIEBwYXJhbSBbaW5kZXhdXG4gICAqL1xuICBhZGRDb2x1bW4oY29sdW1uPzogVGFibGVJdGVtW10sIGluZGV4PzogbnVtYmVyKSB7XG4gICAgLy8gaWYgdGFibGUgZW1wdHkgY3JlYXRlIHRhYmxlIHdpdGggcm93XG4gICAgaWYgKCF0aGlzLmRhdGEgfHwgdGhpcy5kYXRhLmxlbmd0aCA9PT0gMCB8fCB0aGlzLmRhdGFbMF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICBsZXQgbmV3RGF0YSA9IG5ldyBBcnJheTxBcnJheTxUYWJsZUl0ZW0+PigpO1xuICAgICAgaWYgKGNvbHVtbiA9PSBudWxsKSB7XG4gICAgICAgIG5ld0RhdGEucHVzaChbbmV3IFRhYmxlSXRlbSgpXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBpdGVtID0gY29sdW1uW2ldO1xuICAgICAgICAgIG5ld0RhdGEucHVzaChbaXRlbV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRhdGEgPSBuZXdEYXRhO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHJjID0gdGhpcy5kYXRhLmxlbmd0aDsgLy8gcm93IGNvdW50XG4gICAgbGV0IGNpID0gdGhpcy5yZWFsQ29sdW1uSW5kZXgoaW5kZXgpO1xuXG4gICAgLy8gYXBwZW5kIG1pc3Npbmcgcm93c1xuICAgIGZvciAobGV0IGkgPSAwOyBjb2x1bW4gIT0gbnVsbCAmJiBpIDwgY29sdW1uLmxlbmd0aCAtIHJjOyBpKyspIHtcbiAgICAgIHRoaXMuYWRkUm93KCk7XG4gICAgfVxuICAgIHJjID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICBpZiAoaW5kZXggPT0gbnVsbCkge1xuICAgICAgLy8gYXBwZW5kIHRvIGVuZFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYzsgaSsrKSB7XG4gICAgICAgIGxldCByb3cgPSB0aGlzLmRhdGFbaV07XG4gICAgICAgIHJvdy5wdXNoKGNvbHVtbiA9PSBudWxsIHx8IGNvbHVtbltpXSA9PSBudWxsID8gbmV3IFRhYmxlSXRlbSgpIDogY29sdW1uW2ldKTtcbiAgICAgIH1cbiAgICAgIC8vIHVwZGF0ZSBoZWFkZXIgaWYgbm90IGFscmVhZHkgc2V0IGJ5IHVzZXJcbiAgICAgIGlmICh0aGlzLmhlYWRlci5sZW5ndGggPCB0aGlzLmRhdGFbMF0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyLnB1c2gobmV3IFRhYmxlSGVhZGVySXRlbSgpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGluZGV4ID49IHRoaXMuZGF0YVswXS5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgdHJ5aW5nIHRvIGFwcGVuZFxuICAgICAgICBjaSsrO1xuICAgICAgfVxuICAgICAgLy8gaW5zZXJ0XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJjOyBpKyspIHtcbiAgICAgICAgbGV0IHJvdyA9IHRoaXMuZGF0YVtpXTtcbiAgICAgICAgcm93LnNwbGljZShjaSwgMCwgY29sdW1uID09IG51bGwgfHwgY29sdW1uW2ldID09IG51bGwgPyBuZXcgVGFibGVJdGVtKCkgOiBjb2x1bW5baV0pO1xuICAgICAgfVxuICAgICAgLy8gdXBkYXRlIGhlYWRlciBpZiBub3QgYWxyZWFkeSBzZXQgYnkgdXNlclxuICAgICAgaWYgKHRoaXMuaGVhZGVyLmxlbmd0aCA8IHRoaXMuZGF0YVswXS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5oZWFkZXIuc3BsaWNlKGNpLCAwLCBuZXcgVGFibGVIZWFkZXJJdGVtKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZGF0YUNoYW5nZS5lbWl0KCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBgaW5kZXhgdGggY29sdW1uLlxuICAgKlxuICAgKiBOZWdhdGl2ZSBpbmRleCBzdGFydHMgZnJvbSB0aGUgZW5kLiAtMSBiZWluZyB0aGUgbGFzdCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICovXG4gIGRlbGV0ZUNvbHVtbihpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3QgcmNpID0gdGhpcy5yZWFsQ29sdW1uSW5kZXgoaW5kZXgpO1xuICAgIGNvbnN0IHJvd0NvdW50ID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcbiAgICAgIHRoaXMuZGF0YVtpXS5zcGxpY2UocmNpLCAxKTtcbiAgICB9XG4gICAgLy8gdXBkYXRlIGhlYWRlciBpZiBub3QgYWxyZWFkeSBzZXQgYnkgdXNlclxuICAgIGlmICh0aGlzLmhlYWRlci5sZW5ndGggPiB0aGlzLmRhdGFbMF0ubGVuZ3RoKSB7XG4gICAgICB0aGlzLmhlYWRlci5zcGxpY2UocmNpLCAxKTtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGFDaGFuZ2UuZW1pdCgpO1xuICB9XG5cbiAgbW92ZUNvbHVtbihpbmRleEZyb206IG51bWJlciwgaW5kZXhUbzogbnVtYmVyKSB7XG4gICAgY29uc3QgaGVhZGVyRnJvbSA9IHRoaXMuaGVhZGVyW2luZGV4RnJvbV07XG5cbiAgICB0aGlzLmFkZENvbHVtbih0aGlzLmNvbHVtbihpbmRleEZyb20pLCBpbmRleFRvKTtcbiAgICB0aGlzLmRlbGV0ZUNvbHVtbihpbmRleEZyb20gKyAoaW5kZXhUbyA8IGluZGV4RnJvbSA/IDEgOiAwKSk7XG5cbiAgICB0aGlzLmhlYWRlcltpbmRleFRvICsgKGluZGV4VG8gPiBpbmRleEZyb20gPyAtMSA6IDApXSA9IGhlYWRlckZyb207XG4gIH1cblxuICAvKipcbiAgICogU29ydHMgdGhlIGRhdGEgY3VycmVudGx5IHByZXNlbnQgaW4gdGhlIG1vZGVsIGJhc2VkIG9uIGBjb21wYXJlKClgXG4gICAqXG4gICAqIERpcmVjdGlvbiBpcyBzZXQgYnkgYGFzY2VuZGluZ2AgYW5kIGBkZXNjZW5kaW5nYCBwcm9wZXJ0aWVzIG9mIGBUYWJsZUhlYWRlckl0ZW1gXG4gICAqIGluIGBpbmRleGB0aCBjb2x1bW4uXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBUaGUgY29sdW1uIGJhc2VkIG9uIHdoaWNoIGl0J3Mgc29ydGluZ1xuICAgKi9cbiAgc29ydChpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3QgaGVhZGVyVG9Tb3J0ID0gdGhpcy5nZXRIZWFkZXIoaW5kZXgpO1xuICAgIHRoaXMucHVzaFJvd1N0YXRlVG9Nb2RlbERhdGEoKTtcbiAgICB0aGlzLmRhdGEuc29ydChcbiAgICAgIChhLCBiKSA9PiAoaGVhZGVyVG9Tb3J0LmRlc2NlbmRpbmcgPyAtMSA6IDEpICogaGVhZGVyVG9Tb3J0LmNvbXBhcmUoYVtpbmRleF0sIGJbaW5kZXhdKVxuICAgICk7XG4gICAgdGhpcy5wb3BSb3dTdGF0ZUZyb21Nb2RlbERhdGEoKTtcbiAgICB0aGlzLmhlYWRlci5mb3JFYWNoKChoZWFkZXJSb3c6IFRhYmxlSGVhZGVySXRlbVtdKSA9PiB7XG4gICAgICBoZWFkZXJSb3cuZm9yRWFjaCgoY29sdW1uKSA9PiB7XG4gICAgICAgIGlmIChjb2x1bW4pIHtcbiAgICAgICAgICBjb2x1bW4uc29ydGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGhlYWRlclRvU29ydC5zb3J0ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgYHJvd3NTZWxlY3RlZGAgYW5kIGByb3dzRXhwYW5kZWRgIGluZm8gdG8gbW9kZWwgZGF0YS5cbiAgICpcbiAgICogV2hlbiBzb3J0aW5nIHJvd3MsIGRvIHRoaXMgZmlyc3Qgc28gaW5mb3JtYXRpb24gYWJvdXQgcm93IHNlbGVjdGlvblxuICAgKiBnZXRzIHNvcnRlZCB3aXRoIHRoZSBvdGhlciByb3cgaW5mby5cbiAgICpcbiAgICogQ2FsbCBgcG9wUm93U2VsZWN0aW9uRnJvbU1vZGVsRGF0YSgpYCBhZnRlciBzb3J0aW5nIHRvIG1ha2UgZXZlcnl0aGluZ1xuICAgKiByaWdodCB3aXRoIHRoZSB3b3JsZCBhZ2Fpbi5cbiAgICovXG4gIHB1c2hSb3dTdGF0ZVRvTW9kZWxEYXRhKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCByb3dTZWxlY3RlZE1hcmsgPSBuZXcgVGFibGVJdGVtKCk7XG4gICAgICByb3dTZWxlY3RlZE1hcmsuZGF0YSA9IHRoaXMucm93c1NlbGVjdGVkW2ldO1xuICAgICAgdGhpcy5kYXRhW2ldLnB1c2gocm93U2VsZWN0ZWRNYXJrKTtcblxuICAgICAgY29uc3Qgcm93RXhwYW5kZWRNYXJrID0gbmV3IFRhYmxlSXRlbSgpO1xuICAgICAgcm93RXhwYW5kZWRNYXJrLmRhdGEgPSB0aGlzLnJvd3NFeHBhbmRlZFtpXTtcbiAgICAgIHRoaXMuZGF0YVtpXS5wdXNoKHJvd0V4cGFuZGVkTWFyayk7XG5cbiAgICAgIGNvbnN0IHJvd0NvbnRleHQgPSBuZXcgVGFibGVJdGVtKCk7XG4gICAgICByb3dDb250ZXh0LmRhdGEgPSB0aGlzLnJvd3NDb250ZXh0W2ldO1xuICAgICAgdGhpcy5kYXRhW2ldLnB1c2gocm93Q29udGV4dCk7XG5cbiAgICAgIGNvbnN0IHJvd0NsYXNzID0gbmV3IFRhYmxlSXRlbSgpO1xuICAgICAgcm93Q2xhc3MuZGF0YSA9IHRoaXMucm93c0NsYXNzW2ldO1xuICAgICAgdGhpcy5kYXRhW2ldLnB1c2gocm93Q2xhc3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0b3JlcyBgcm93c1NlbGVjdGVkYCBmcm9tIGRhdGEgcHVzaGVkIGJ5IGBwdXNoUm93U2VsZWN0aW9uVG9Nb2RlbERhdGEoKWBcbiAgICpcbiAgICogQ2FsbCBhZnRlciBzb3J0aW5nIGRhdGEgKGlmIHlvdSBwcmV2aW91c2x5IHB1c2hlZCB0byBtYWludGFpbiBzZWxlY3Rpb24gb3JkZXIpXG4gICAqIHRvIG1ha2UgZXZlcnl0aGluZyByaWdodCB3aXRoIHRoZSB3b3JsZCBhZ2Fpbi5cbiAgICovXG4gIHBvcFJvd1N0YXRlRnJvbU1vZGVsRGF0YSgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5yb3dzQ2xhc3NbaV0gPSB0aGlzLmRhdGFbaV0ucG9wKCkuZGF0YTtcbiAgICAgIHRoaXMucm93c0NvbnRleHRbaV0gPSB0aGlzLmRhdGFbaV0ucG9wKCkuZGF0YTtcbiAgICAgIHRoaXMucm93c0V4cGFuZGVkW2ldID0gISF0aGlzLmRhdGFbaV0ucG9wKCkuZGF0YTtcbiAgICAgIHRoaXMucm93c1NlbGVjdGVkW2ldID0gISF0aGlzLmRhdGFbaV0ucG9wKCkuZGF0YTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0L2Rlc2VsZWN0IGBpbmRleGB0aCByb3cgYmFzZWQgb24gdmFsdWVcbiAgICpcbiAgICogQHBhcmFtIGluZGV4IGluZGV4IG9mIHRoZSByb3cgdG8gc2VsZWN0XG4gICAqIEBwYXJhbSB2YWx1ZSBzdGF0ZSB0byBzZXQgdGhlIHJvdyB0by4gRGVmYXVsdHMgdG8gYHRydWVgXG4gICAqL1xuICBzZWxlY3RSb3coaW5kZXg6IG51bWJlciwgdmFsdWUgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuaXNSb3dEaXNhYmxlZChpbmRleCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yb3dzU2VsZWN0ZWRbaW5kZXhdID0gdmFsdWU7XG4gICAgdGhpcy5yb3dzU2VsZWN0ZWRDaGFuZ2UuZW1pdChpbmRleCk7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBvciBkZXNlbGVjdHMgYWxsIHJvd3MgaW4gdGhlIG1vZGVsXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBzdGF0ZSB0byBzZXQgYWxsIHJvd3MgdG8uIERlZmF1bHRzIHRvIGB0cnVlYFxuICAgKi9cbiAgc2VsZWN0QWxsKHZhbHVlID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoID49IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzU2VsZWN0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5zZWxlY3RSb3coaSwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNlbGVjdEFsbENoYW5nZS5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGlzUm93U2VsZWN0ZWQoaW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLnJvd3NTZWxlY3RlZFtpbmRleF07XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHJvdyBpcyBkaXNhYmxlZCBvciBub3QuXG4gICAqL1xuICBpc1Jvd0Rpc2FibGVkKGluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCByb3cgPSB0aGlzLmRhdGFbaW5kZXhdIGFzIFRhYmxlUm93O1xuICAgIHJldHVybiAhIXJvdy5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBhbmRzL0NvbGxhcHNlcyBgaW5kZXhgdGggcm93IGJhc2VkIG9uIHZhbHVlXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBpbmRleCBvZiB0aGUgcm93IHRvIGV4cGFuZCBvciBjb2xsYXBzZVxuICAgKiBAcGFyYW0gdmFsdWUgZXhwYW5kZWQgc3RhdGUgb2YgdGhlIHJvdy4gYHRydWVgIGlzIGV4cGFuZGVkIGFuZCBgZmFsc2VgIGlzIGNvbGxhcHNlZFxuICAgKi9cbiAgZXhwYW5kUm93KGluZGV4OiBudW1iZXIsIHZhbHVlID0gdHJ1ZSkge1xuICAgIHRoaXMucm93c0V4cGFuZGVkW2luZGV4XSA9IHZhbHVlO1xuICAgIHRoaXMucm93c0V4cGFuZGVkQ2hhbmdlLmVtaXQoaW5kZXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRydWUgaW5kZXggb2YgYSByb3cgYmFzZWQgb24gaXQncyByZWxhdGl2ZSBwb3NpdGlvbi5cbiAgICogTGlrZSBpbiBQeXRob24sIHBvc2l0aXZlIG51bWJlcnMgc3RhcnQgZnJvbSB0aGUgdG9wIGFuZFxuICAgKiBuZWdhdGl2ZSBudW1iZXJzIHN0YXJ0IGZyb20gdGhlIGJvdHRvbS5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4XG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhbFJvd0luZGV4KGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnJlYWxJbmRleChpbmRleCwgdGhpcy5kYXRhLmxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdHJ1ZSBpbmRleCBvZiBhIGNvbHVtbiBiYXNlZCBvbiBpdCdzIHJlbGF0aXZlIHBvc2l0aW9uLlxuICAgKiBMaWtlIGluIFB5dGhvbiwgcG9zaXRpdmUgbnVtYmVycyBzdGFydCBmcm9tIHRoZSB0b3AgYW5kXG4gICAqIG5lZ2F0aXZlIG51bWJlcnMgc3RhcnQgZnJvbSB0aGUgYm90dG9tLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICovXG4gIHByb3RlY3RlZCByZWFsQ29sdW1uSW5kZXgoaW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucmVhbEluZGV4KGluZGV4LCB0aGlzLmRhdGFbMF0ubGVuZ3RoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmljIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSB0aGUgcmVhbCBpbmRleCBvZiBzb21ldGhpbmcuXG4gICAqIFVzZWQgYnkgYHJlYWxSb3dJbmRleCgpYCBhbmQgYHJlYWxDb2x1bW5JbmRleCgpYFxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXhcbiAgICogQHBhcmFtIGxlbmd0aFxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWxJbmRleChpbmRleDogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBsZW5ndGggLSAxO1xuICAgIH0gZWxzZSBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgcmV0dXJuIGluZGV4ID49IGxlbmd0aCA/IGxlbmd0aCAtIDEgOiBpbmRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC1pbmRleCA+PSBsZW5ndGggPyAwIDogbGVuZ3RoICsgaW5kZXg7XG4gICAgfVxuICB9XG59XG4iXX0=