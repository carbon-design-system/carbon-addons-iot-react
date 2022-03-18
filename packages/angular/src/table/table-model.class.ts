import { PaginationModel, TableHeaderItem, TableItem, TableRow } from 'carbon-components-angular';
import { Subject } from 'rxjs';

export type HeaderType = number | 'select' | 'expand';

export class AITableHeaderItem extends TableHeaderItem {
  /**
   * Defines the alignment of the the header item and the column below it.
   */
  alignment: 'start' | 'center' | 'end' = 'start';

  constructor(rawData?: any) {
    super(rawData);

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
export class AITableModel implements PaginationModel {
  /**
   * The number of models instantiated, used for (among other things) unique id generation
   */
  protected static COUNT = 0;

  dataChange = new Subject();
  rowsSelectedChange = new Subject<number>();
  rowsExpandedChange = new Subject<number>();
  /**
   * Gets emitted when `selectAll` is called. Emits false if all rows are deselected and true if
   * all rows are selected.
   */
  selectAllChange = new Subject<boolean>();

  /**
   * Contains class name(s) of the row.
   *
   * It affects styling of the row to reflect the appended class name(s).
   *
   * It's empty or undefined by default
   */
  rowsClass: string[] = [];

  /**
   * Tracks the current page.
   */
  currentPage = 1;

  /**
   * Length of page.
   */
  pageLength = 10;

  /**
   * Set to true when there is no more data to load in the table
   */
  isEnd = false;

  /**
   * Set to true when lazy loading to show loading indicator
   */
  isLoading = false;

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
  set totalDataLength(length: number) {
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
   * Used in `data`
   */
  protected _data: TableItem[][] = [[]];

  /**
   * Contains information about the header cells of the table.
   */
  protected header: AITableHeaderItem[][] = [[]];

  /**
   * The number of models instantiated, this is to make sure each table has a different
   * model count for unique id generation.
   */
  protected tableModelCount = 0;

  /**
   * Contains information about selection state of rows in the table.
   */
  protected rowsSelected: boolean[] = [];

  /**
   * Contains information about expanded state of rows in the table.
   */
  protected rowsExpanded: boolean[] = [];

  /**
   * Contains information about the context of the row.
   *
   * It affects styling of the row to reflect the context.
   *
   * string can be one of `"success" | "warning" | "info" | "error" | ""` and it's
   * empty or undefined by default
   */
  protected rowsContext: string[] = [];

  constructor() {
    this.tableModelCount = AITableModel.COUNT++;
  }

  /**
   * Sets data of the table.
   *
   * Make sure all rows are the same length to keep the column count accurate.
   */
  setData(newData: TableItem[][]) {
    if (!newData || (Array.isArray(newData) && newData.length === 0)) {
      newData = [[]];
    }

    this._data = newData;

    // init rowsSelected
    this.rowsSelected = new Array<boolean>(this._data.length).fill(false);
    this.rowsExpanded = new Array<boolean>(this._data.length).fill(false);

    // init rowsContext
    this.rowsContext = new Array<string>(this._data.length);

    // init rowsClass
    this.rowsClass = new Array<string>(this._data.length);

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
    } else {
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
  setHeader(
    newHeader: TableHeaderItem[][] | TableHeaderItem[] | AITableHeaderItem[][] | AITableHeaderItem[]
  ) {
    if (!newHeader) {
      newHeader = [[]];
    } else if (Array.isArray(newHeader) && newHeader.length > 0 && !Array.isArray(newHeader[0])) {
      newHeader = [newHeader as any];
    } else if (Array.isArray(newHeader) && newHeader.length === 0) {
      newHeader = [[]];
    }

    newHeader = (newHeader as any).map((row: any): AITableHeaderItem[] =>
      row.map(
        (col: any): AITableHeaderItem =>
          col.constructor.name === 'AITableHeaderItem' ? col : new AITableHeaderItem(col)
      )
    );

    this.header = newHeader as AITableHeaderItem[][];

    this.dataChange.next();
  }

  setItem(rowIndex: number, columnIndex: number, item: TableItem) {
    this._data[rowIndex][columnIndex] = item;
    // TODO make sure changes are reflected in the table
  }

  setItemData(rowIndex: number, columnIndex: number, data: any) {
    this._data[rowIndex][columnIndex].data = data;
    // TODO make sure changes are reflected in the table
  }

  /**
   * Returns an id for the given column
   *
   * @param column the column to generate an id for
   * @param row the row of the header to generate an id for
   */
  getId(column: HeaderType, row = 0): string {
    return `table-header-${row}-${column}-${this.tableModelCount}`;
  }

  /**
   * Returns the id of the header. Used to link the cells with headers (or headers with headers)
   *
   * @param column the column to start getting headers for
   * @param colSpan the number of columns to get headers for (defaults to 1)
   */
  getHeaderId(column: HeaderType, colSpan = 1): string {
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
  selectedRowIndices(): number[] {
    return this.rowsSelected.reduce((acc: number[], current, index) => {
      if (current) {
        return [...acc, index];
      }

      return acc;
    }, []);
  }

  /**
   * Returns how many rows is currently selected
   */
  selectedRowsCount(): number {
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
  expandedRowIndices(): number[] {
    return this.rowsExpanded.reduce((acc: number[], current, index) => {
      if (current) {
        return [...acc, index];
      }

      return acc;
    }, []);
  }

  /**
   * Returns how many rows is currently expanded
   */
  expandedRowsCount(): number {
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
  row(index: number): TableItem[] {
    return this._data[this.realRowIndex(index)];
  }

  /**
   * Returns all the rows.
   *
   * Use `row()` instead.
   */
  rows(): TableItem[][] {
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
  addRow(row?: TableItem[], index?: number) {
    // if table empty create table with row
    if (!this._data || this._data.length === 0 || this._data[0].length === 0) {
      let newData = new Array<Array<TableItem>>();
      newData.push(row ? row : [new TableItem()]); // row or one empty one column row
      this.setData(newData);

      return;
    }

    let realRow = row;
    const columnCount = this._data[0].length;

    if (row == null) {
      realRow = new Array<TableItem>();
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
    } else if (realRow.length > columnCount) {
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
    } else {
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
  deleteRow(index: number) {
    const rri = this.realRowIndex(index);
    this._data.splice(rri, 1);
    this.rowsSelected.splice(rri, 1);
    this.rowsExpanded.splice(rri, 1);
    this.rowsContext.splice(rri, 1);
    this.rowsClass.splice(rri, 1);

    this.dataChange.next();
  }

  rowMetaInfo(index: number) {
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

  isRowExpandable(index: number) {
    return this._data[index].some((d) => d && d.expandedData);
  }

  isRowExpanded(index: number) {
    return this.rowsExpanded[index];
  }

  getRowContext(index: number) {
    return this.rowsContext[index];
  }

  setRowContext(index: number, context: string) {
    return (this.rowsContext[index] = context);
  }

  /**
   * Returns `index`th column of the table.
   *
   * Negative index starts from the end. -1 being the last element.
   *
   * @param index
   */
  column(index: number): TableItem[] {
    let column = new Array<TableItem>();
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
  addColumn(column?: TableItem[], index?: number) {
    // if table empty create table with row
    if (!this._data || this._data.length === 0 || this._data[0].length === 0) {
      let newData = new Array<Array<TableItem>>();
      if (column == null) {
        newData.push([new TableItem()]);
      } else {
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
    } else {
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
  deleteColumn(index: number) {
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
  moveColumn(indexFrom: number, indexTo: number, rowIndex = 0) {
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
  sort(index: number) {
    const headerToSort = this.getClosestHeader(index);
    this.pushRowStateToModelData();
    this._data.sort(
      (a, b) => (headerToSort.descending ? -1 : 1) * headerToSort.compare(a[index], b[index])
    );
    this.popRowStateFromModelData();
    this.header.forEach((headerRow: AITableHeaderItem[]) => {
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
  isRowFiltered(index: number): boolean {
    const realIndex = this.realRowIndex(index);
    return this.header.some((headerRow: AITableHeaderItem[]) =>
      headerRow.some((item, i) => item && item.filter(this.row(realIndex)[i]))
    );
  }

  /**
   * Select/deselect `index`th row based on value
   *
   * @param index index of the row to select
   * @param value state to set the row to. Defaults to `true`
   */
  selectRow(index: number, value = true, emitChange = true) {
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

  isRowSelected(index: number) {
    return this.rowsSelected[index];
  }

  /**
   * Checks if row is disabled or not.
   */
  isRowDisabled(index: number) {
    const row = this._data[index] as TableRow;
    return !!row.disabled;
  }

  /**
   * Expands/Collapses `index`th row based on value
   *
   * @param index index of the row to expand or collapse
   * @param value expanded state of the row. `true` is expanded and `false` is collapsed
   */
  expandRow(index: number, value = true) {
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
  protected realRowIndex(index: number): number {
    return this.realIndex(index, this._data.length);
  }

  /**
   * Gets the true index of a column based on it's relative position.
   * Like in Python, positive numbers start from the top and
   * negative numbers start from the bottom.
   *
   * @param index
   */
  protected realColumnIndex(index: number): number {
    return this.realIndex(index, this._data[0].length);
  }

  /**
   * Generic function to calculate the real index of something.
   * Used by `realRowIndex()` and `realColumnIndex()`
   *
   * @param index
   * @param length
   */
  protected realIndex(index: number, length: number): number {
    if (index == null) {
      return length - 1;
    } else if (index >= 0) {
      return index >= length ? length - 1 : index;
    } else {
      return -index >= length ? 0 : length + index;
    }
  }

  protected projectedRowLengthSimple(itemArray: any[]) {
    return itemArray.reduce((len, item) => len + (item ? item.colSpan || 1 : 0), 0);
  }

  /**
   * @param itemArray TableItem[] | AITableHeaderItem[]
   * @returns the number of columns as if now cells were merged
   */
  protected projectedRowLength(itemArray: any[], rowIndex?: number, matrix?: any[][]) {
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
  protected projectedIndexToActualIndex(
    projectedIndex: number,
    list: AITableHeaderItem[] | TableItem[]
  ) {
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      index += item?.colSpan || 1;
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
  protected actualIndexToProjectedIndices(
    actualIndex: number,
    list: AITableHeaderItem[] | TableItem[]
  ) {
    // find the starting projected index
    let startingIndex = 0;
    for (let i = 0; i < actualIndex; i++) {
      const item = list[i];
      startingIndex += item.colSpan || 1;
    }

    return new Array(list[actualIndex].colSpan).fill(0).map((_, index) => startingIndex + index);
  }

  protected projectedIndicesToActualIndices(
    projectedIndices: number[],
    list: AITableHeaderItem[] | TableItem[]
  ) {
    const actualIndicesSet = new Set();

    for (let projectedIndex of projectedIndices) {
      actualIndicesSet.add(this.projectedIndexToActualIndex(projectedIndex, list));
    }

    return Array.from(actualIndicesSet).sort() as number[];
  }

  protected moveMultipleToIndex(indices: number[], index, list: AITableHeaderItem[] | TableItem[]) {
    // assumes indices is sorted low to high and continuous
    // NOTE might need to generalize it
    const blockStart = indices[0];
    const blockEnd = indices[indices.length - 1];
    // if moving to left
    if (blockStart > index) {
      const block = list.splice(blockStart, blockEnd - blockStart + 1);
      list.splice.apply(list, [index, 0].concat(block));
    } else {
      // if moving to right
      const block = list.slice(blockStart, blockEnd + 1);
      list.splice.apply(list, [index + 1, 0].concat(block));
      list.splice(blockStart, blockEnd - blockStart + 1);
    }
  }

  protected tabularToNested(
    headerRow: AITableHeaderItem[] = [],
    availableHeaderItems: AITableHeaderItem[][] = [],
    // This allows us to walk the leaves as if they were in a list from left to right.
    // We need to pass by reference so that we can update this value from within the recursion.
    leafIndexRef = { current: 0 },
    rowIndex = 0
  ) {
    if (!headerRow.length && rowIndex === 0) {
      headerRow = this.header[0];
    }

    if (!availableHeaderItems.length) {
      availableHeaderItems = this.header.map((headerRow) =>
        headerRow.filter((headerItem) => headerItem !== null)
      );
    }

    return headerRow
      .filter((headerItem) => headerItem !== null)
      .map((headerItem, i) => {
        const colSpan = headerItem?.colSpan || 1;
        const rowSpan = headerItem?.rowSpan || 1;

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
          spaceLeft -= nextChild?.colSpan || 1;
          children.push(nextChild);
        }

        return {
          headerItem,
          leafIndex: -1,
          rowIndex,
          children: this.tabularToNested(
            children,
            availableHeaderItems,
            leafIndexRef,
            rowIndex + rowSpan
          ),
        };
      });
  }

  protected nestedToTabular(
    nested: any,
    header: AITableHeaderItem[][] = new Array(this.header.length).fill([]),
    data: TableItem[][] = new Array(this._data.length).fill([]),
    rowIndex = 0
  ) {
    nested.forEach((headerObj: any) => {
      const rowSpan = headerObj.headerItem?.rowSpan || 1;
      const colSpan = headerObj.headerItem?.colSpan || 1;

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
  protected moveNested(
    nested: any,
    indexFrom: number,
    indexTo: number,
    rowIndex = 0,
    startingChildIndex = 0
  ) {
    if (!nested.length) {
      return;
    }

    const currentRowIndex = nested[0].rowIndex;
    if (
      currentRowIndex === rowIndex &&
      startingChildIndex <= indexFrom &&
      startingChildIndex + nested.length >= indexFrom &&
      startingChildIndex <= indexTo &&
      startingChildIndex + nested.length >= indexTo
    ) {
      this.moveMultipleToIndex(
        [indexFrom - startingChildIndex],
        indexTo - startingChildIndex,
        nested
      );
      return;
    }

    nested.forEach((headerObj: any, i: number) => {
      const rowSpan = headerObj.headerItem?.rowSpan || 1;
      const children = headerObj.children;
      this.moveNested(
        children,
        indexFrom,
        indexTo,
        rowIndex,
        this.header[currentRowIndex + rowSpan]?.indexOf(children[0]?.headerItem)
      );
    });
  }
}
