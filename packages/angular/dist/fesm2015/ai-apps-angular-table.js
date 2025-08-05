/**
 *
 * @ai-apps/angular v2.155.1 | ai-apps-angular-table.js
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


import { Component, ViewEncapsulation, HostBinding, Input, NgModule } from '@angular/core';
import { TableHeaderItem, TableItem, TableHeadCell, TableHead, Table, TableBody, TableRowComponent, DialogModule, ButtonModule, TableModule, IconService } from 'carbon-components-angular';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import ArrowsVertical16 from '@carbon/icons/es/arrows--vertical/16';
import ArrowDown16 from '@carbon/icons/es/arrow--down/16';
import Filter16 from '@carbon/icons/es/filter/16';

class AITableHeaderItem extends TableHeaderItem {
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
class AITableModel {
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

class AITableHeadCell extends TableHeadCell {
    constructor() {
        super(...arguments);
        this.cssClass = true;
    }
}
AITableHeadCell.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line: component-selector
                selector: '[aiTableHeadCell]',
                template: `
    <ng-container *ngIf="!skeleton">
      <button
        class="bx--table-sort table-header-label iot--table-head--table-header"
        [ngClass]="{
          'table-header-label-start': column.alignment === 'start',
          'table-header-label-center': column.alignment === 'center',
          'table-header-label-end': column.alignment === 'end'
        }"
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
          class="bx--table-header-label"
          [title]="column.data"
          tabindex="-1"
        >
          <span>
            {{ column.data }}
          </span>
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
        [attr.data-floating-menu-container]="true"
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
                encapsulation: ViewEncapsulation.None
            },] }
];
AITableHeadCell.propDecorators = {
    cssClass: [{ type: HostBinding, args: ['class.iot--table-head-cell',] }],
    column: [{ type: Input }]
};

/**
 * A subcomponent that creates the thead of the table
 *
 * Example
 *
 * ```html
 * 	<thead aiTableHead [model]="model"></thead>
 * ```
 */
class AITableHeadComponent extends TableHead {
}
AITableHeadComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: '[aiTableHead]',
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
            aiTableHeadCell
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
            [ngClass]="{
              'iot--table-head--table-header': true,
              'table-header-label-start': column.alignment === 'start',
              'table-header-label-center': column.alignment === 'center',
              'table-header-label-end': column.alignment === 'end'
            }"
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
                encapsulation: ViewEncapsulation.None
            },] }
];
AITableHeadComponent.propDecorators = {
    model: [{ type: Input }]
};

/**
 * AI PAL table component
 *
 * Example:
 * ```
 * <ai-table></ai-table>
 * ```
 */
class AITableComponent extends Table {
}
AITableComponent.decorators = [
    { type: Component, args: [{
                selector: 'ai-table',
                template: `
    <table
      ibmTable
      [sortable]="true"
      [size]="size"
      [striped]="striped"
      [skeleton]="skeleton"
      [ngClass]="{ 'bx--data-table--sticky-header': stickyHeader }"
      class="iot-table"
    >
      <thead
        aiTableHead
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
        aiTableBody
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
        *ngIf="model.totalDataLength; else noDataTemplate"
      ></tbody>
      <ng-template #noDataTemplate>
        <tbody>
          <tr class="iot--empty-table--table-row">
            <td colspan="100%">
              <div class="empty-table-cell--default">
                <ng-content></ng-content>
              </div>
            </td>
          </tr>
        </tbody>
      </ng-template>
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
                encapsulation: ViewEncapsulation.None
            },] }
];
AITableComponent.propDecorators = {
    model: [{ type: Input }]
};

class AITableBody extends TableBody {
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

class AITableRowComponent extends TableRowComponent {
}
AITableRowComponent.decorators = [
    { type: Component, args: [{
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
  `
            },] }
];
AITableRowComponent.propDecorators = {
    model: [{ type: Input }]
};

class AITableModule {
    constructor(iconService) {
        this.iconService = iconService;
        iconService.registerAll([ArrowsVertical16, ArrowDown16, Filter16]);
    }
}
AITableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    AITableComponent,
                    AITableBody,
                    AITableHeadComponent,
                    AITableHeadCell,
                    AITableRowComponent,
                ],
                imports: [DialogModule, ButtonModule, CommonModule, TableModule],
                exports: [
                    AITableComponent,
                    AITableBody,
                    AITableHeadComponent,
                    AITableHeadCell,
                    AITableRowComponent,
                ],
            },] }
];
AITableModule.ctorParameters = () => [
    { type: IconService }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AITableBody, AITableComponent, AITableHeadCell, AITableHeadComponent, AITableHeaderItem, AITableModel, AITableModule, AITableRowComponent };
//# sourceMappingURL=ai-apps-angular-table.js.map
