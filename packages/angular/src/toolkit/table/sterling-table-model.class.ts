import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';
import { Subject } from 'rxjs';

export class SCTableModel extends TableModel {
	headerChange = new Subject();

	/**
	 * Contains information about the header cells of the table.
	 */
	set header(newHeader: any) {
		if (!newHeader || (Array.isArray(newHeader) && newHeader.length === 0) ) {
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
	set data(newData: TableItem[][]) {
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
		if (this.header == null || (this.header[0].length !== this._data[0].length && this._data[0].length > 0)) {
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

	protected _header: TableHeaderItem[][] = [[]];

	isRowFiltered(index: number): boolean {
		const realIndex = this.realRowIndex(index);
		return this.header.some(
			(headerRow: TableHeaderItem[]) => headerRow.some(
				(item, i) => item && item.filter(this.row(realIndex)[i])
			)
		);
	}

	getHeaderId(column: number | 'select' | 'expand', colSpan = 1): string  {
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
	 * Sorts the data currently present in the model based on `compare()`
	 *
	 * Direction is set by `ascending` and `descending` properties of `TableHeaderItem`
	 * in `index`th column.
	 *
	 * @param index The column based on which it's sorting
	 */
	sort(index: number) {
		const headerToSort = this.getHeader(index);
		this.pushRowStateToModelData();
		this.data.sort((a, b) => (headerToSort.descending ? -1 : 1) * headerToSort.compare(a[index], b[index]));
		this.popRowStateFromModelData();
		this.header.forEach((headerRow: TableHeaderItem[]) => {
			headerRow.forEach((column) => {
				if (column) { column.sorted = false; }
			});
		});
		headerToSort.sorted = true;
	}
}
