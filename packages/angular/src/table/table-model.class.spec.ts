import { TableItem, TableHeaderItem } from 'carbon-components-angular';
import { AITableModel } from './table-model.class';

describe('Table', () => {
  it('empty model should have length 0', () => {
    let tableModel = new AITableModel();
    tableModel.setData([[]]);

    expect(tableModel.totalDataLength).toEqual(0);
  });

  it('model should handle different variants of empty data', () => {
    let tableModel = new AITableModel();
    tableModel.setData(undefined);

    expect(tableModel.totalDataLength).toEqual(0);

    tableModel.setData(null);

    expect(tableModel.totalDataLength).toEqual(0);

    tableModel.setData([]);

    expect(tableModel.totalDataLength).toEqual(0);
  });

  it('should set rowsSelected when setting data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel['rowsSelected'].length).toEqual(2);
  });

  it('should set rowsExpanded when setting data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel['rowsExpanded'].length).toEqual(2);
  });

  it('should set rowsContext when setting data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel['rowsContext'].length).toEqual(2);
  });

  it('should set header when setting data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should make sure each header has the same length as data', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      [
        new TableHeaderItem({ data: 'h1' }),
        new TableHeaderItem({ data: 'h2', colSpan: 4 }),
        new TableHeaderItem({ data: 'h3' }),
      ],
      [
        new TableHeaderItem({ data: 'h11' }),
        new TableHeaderItem({ data: 'h12', colSpan: 2 }),
        new TableHeaderItem({ data: 'h13', colSpan: 2 }),
        new TableHeaderItem({ data: 'h14' }),
      ],
      [
        new TableHeaderItem({ data: 'h21' }),
        new TableHeaderItem({ data: 'h22' }),
        new TableHeaderItem({ data: 'h23' }),
        new TableHeaderItem({ data: 'h24' }),
        new TableHeaderItem({ data: 'h25' }),
        new TableHeaderItem({ data: 'h26' }),
      ],
    ]);
    tableModel.setData([
      [
        new TableItem({ data: 'A' }),
        new TableItem({ data: 'B' }),
        new TableItem({ data: 'C' }),
        new TableItem({ data: 'D' }),
        new TableItem({ data: 'E' }),
        new TableItem({ data: 'F' }),
        new TableItem({ data: 'Extra' }),
        new TableItem({ data: 'Extra' }),
      ],
      [
        new TableItem({ data: 'G' }),
        new TableItem({ data: 'H' }),
        new TableItem({ data: 'I' }),
        new TableItem({ data: 'J' }),
        new TableItem({ data: 'K' }),
        new TableItem({ data: 'L' }),
        new TableItem({ data: 'Extra' }),
        new TableItem({ data: 'Extra' }),
      ],
    ]);

    expect(tableModel['header'][0].length === tableModel.row(0).length);
    expect(tableModel['header'][1].length === tableModel.row(0).length);
    expect(tableModel['header'][2].length === tableModel.row(0).length);
  });

  it('should have same data in same table cell', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
    ]);

    expect(tableModel.row(1)[1]).toBe(tableModel.column(1)[1]);
  });

  it('should modify the data via row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
    ]);

    tableModel.row(1)[1].data = 'test';

    expect(tableModel.column(1)[1].data).toEqual('test');
  });

  it('should modify the data via column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
    ]);

    tableModel.column(1)[1].data = 'test';

    expect(tableModel.row(1)[1].data).toEqual('test');
  });

  it('should modify the data via data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
    ]);

    tableModel.setItemData(1, 1, 'test');

    expect(tableModel.column(1)[1].data).toEqual('test');
    expect(tableModel.row(1)[1].data).toEqual('test');
  });

  /* ****************************************************************
   ***********                                             ***********
   ***********                  SORTING                    ***********
   ***********                                             ***********
   ***************************************************************** */

  it('should sort data ascending', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
    ]);
    tableModel.selectRow(1, true, false);
    tableModel.setRowContext(1, 'success');

    tableModel.sort(1);
    expect(tableModel.row(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'C' }),
    ]);
    expect(tableModel.row(1)).toEqual([
      new TableItem({ data: 'D' }),
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.row(2)).toEqual([
      new TableItem({ data: 'G' }),
      new TableItem({ data: 'H' }),
      new TableItem({ data: 'I' }),
    ]);
    expect(tableModel['rowsSelected']).toEqual([false, false, true]);
    expect(tableModel.selectedRowIndices()).toEqual([2]);
    expect(tableModel['rowsContext']).toEqual([undefined, undefined, 'success']);
  });

  it('should sort data descending', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
    ]);
    tableModel.selectRow(1, true, false);
    tableModel.setRowContext(1, 'success');
    tableModel.getClosestHeader(1).descending = true;

    tableModel.sort(1);
    expect(tableModel.row(0)).toEqual([
      new TableItem({ data: 'G' }),
      new TableItem({ data: 'H' }),
      new TableItem({ data: 'I' }),
    ]);
    expect(tableModel.row(1)).toEqual([
      new TableItem({ data: 'D' }),
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.row(2)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'C' }),
    ]);
    expect(tableModel['rowsSelected']).toEqual([true, false, false]);
    expect(tableModel.selectedRowIndices()).toEqual([0]);
    expect(tableModel['rowsContext']).toEqual(['success', undefined, undefined]);
  });

  /* ****************************************************************
   ***********                                             ***********
   ***********                   ROWS                      ***********
   ***********                                             ***********
   ***************************************************************** */

  it('should get row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);
  });

  it('should get last row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel.row(-1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'D' }),
    ]);
  });

  it('should add empty row to empty table', () => {
    let tableModel = new AITableModel();
    tableModel.addRow();

    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel.row(0).length).toEqual(1);
    expect(tableModel.row(0)).toEqual([new TableItem()]);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('should add row to empty table', () => {
    let tableModel = new AITableModel();
    tableModel.addRow([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);

    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel.row(0).length).toEqual(2);
    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('first and last row in one row table should be the same', () => {
    let tableModel = new AITableModel();
    tableModel.addRow([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);

    expect(tableModel.row(0)).toBe(tableModel.row(-1));
  });

  it('should add row to the beginning', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })], 0);

    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should add row in the middle', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })], 1);

    expect(tableModel.row(1)).toEqual([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should add row to the end', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);

    expect(tableModel.row(-1)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should add shorter row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([new TableItem({ data: 'E' })]);

    expect(tableModel.row(-1)).toEqual([new TableItem({ data: 'E' }), new TableItem()]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should add longer row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
      new TableItem({ data: 'G' }),
    ]);

    expect(tableModel.row(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
      new TableItem(),
    ]);
    expect(tableModel.row(1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'D' }),
      new TableItem(),
    ]);
    expect(tableModel.row(2)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
      new TableItem({ data: 'G' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should delete first row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.deleteRow(0);

    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'C' }), new TableItem({ data: 'D' })]);
    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should delete last row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.deleteRow(-1);

    expect(tableModel.row(-1)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
    ]);
    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should delete middle row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
      [new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.deleteRow(1);

    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);
    expect(tableModel.row(1)).toEqual([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);
    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  /* ****************************************************************
   ***********                                             ***********
   ***********                  COLUMNS                    ***********
   ***********                                             ***********
   ***************************************************************** */

  it('should get column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'C' }),
    ]);
  });

  it('should get last column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel.column(-1)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'D' }),
    ]);
  });

  it('should add empty column to empty table', () => {
    let tableModel = new AITableModel();
    tableModel.addColumn();

    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel.row(0).length).toEqual(1);
    expect(tableModel.column(0)).toEqual([new TableItem()]);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('should add column to empty table', () => {
    let tableModel = new AITableModel();
    tableModel.addColumn([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);

    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel.row(0).length).toEqual(1);
    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('first and last column in one column table should be the same', () => {
    let tableModel = new AITableModel();
    tableModel.addColumn([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);

    expect(tableModel.column(0)).toEqual(tableModel.column(-1));
  });

  it('should add column to the beginning', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })], 0);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should add column in the middle', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })], 1);

    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should add column to the end', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);

    expect(tableModel.column(-1)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should add shorter column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([new TableItem({ data: 'E' })]);

    expect(tableModel.column(-1)).toEqual([new TableItem({ data: 'E' }), new TableItem()]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should add longer column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
      new TableItem({ data: 'G' }),
    ]);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'C' }),
      new TableItem(),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'D' }),
      new TableItem(),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
      new TableItem({ data: 'G' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should delete first column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.deleteColumn(0);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('should delete last column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.deleteColumn(-1);

    expect(tableModel.column(-1)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'C' }),
    ]);
    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('should delete middle column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.deleteColumn(1);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should move column to beginning', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.moveColumn(1, 0);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'E' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.getClosestHeader(0).data).toEqual('h2');
    expect(tableModel.getClosestHeader(1).data).toEqual('h1');
    expect(tableModel.getClosestHeader(2).data).toEqual('h3');
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should move column to end', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.moveColumn(1, 2);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'E' }),
    ]);
    expect(tableModel.getClosestHeader(0).data).toEqual('h1');
    expect(tableModel.getClosestHeader(1).data).toEqual('h3');
    expect(tableModel.getClosestHeader(2).data).toEqual('h2');
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should move column to left', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.moveColumn(2, 1);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'E' }),
    ]);

    expect(tableModel.getClosestHeader(0).data).toEqual(tableModel['header'][0][0].data);
    expect(tableModel.getClosestHeader(1).data).toEqual(tableModel['header'][0][1].data);
    expect(tableModel.getClosestHeader(2).data).toEqual(tableModel['header'][0][2].data);

    expect(tableModel.getClosestHeader(0).data).toEqual('h1');
    expect(tableModel.getClosestHeader(1).data).toEqual('h3');
    expect(tableModel.getClosestHeader(2).data).toEqual('h2');
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should move column to right', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.moveColumn(0, 1);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'E' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.getClosestHeader(0).data).toEqual('h2');
    expect(tableModel.getClosestHeader(1).data).toEqual('h1');
    expect(tableModel.getClosestHeader(2).data).toEqual('h3');
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should move (multi-line header) column to beginning', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      [
        new TableHeaderItem({ data: 'h1' }),
        new TableHeaderItem({ data: 'h2', colSpan: 4 }),
        new TableHeaderItem({ data: 'h3' }),
      ],
      [
        new TableHeaderItem({ data: 'h11' }),
        new TableHeaderItem({ data: 'h12', colSpan: 2 }),
        new TableHeaderItem({ data: 'h13', colSpan: 2 }),
        new TableHeaderItem({ data: 'h14' }),
      ],
      [
        new TableHeaderItem({ data: 'h21' }),
        new TableHeaderItem({ data: 'h22' }),
        new TableHeaderItem({ data: 'h23' }),
        new TableHeaderItem({ data: 'h24' }),
        new TableHeaderItem({ data: 'h25' }),
        new TableHeaderItem({ data: 'h26' }),
      ],
    ]);
    tableModel.setData([
      [
        new TableItem({ data: 'A' }),
        new TableItem({ data: 'B' }),
        new TableItem({ data: 'C' }),
        new TableItem({ data: 'D' }),
        new TableItem({ data: 'E' }),
        new TableItem({ data: 'F' }),
      ],
      [
        new TableItem({ data: 'G' }),
        new TableItem({ data: 'H' }),
        new TableItem({ data: 'I' }),
        new TableItem({ data: 'J' }),
        new TableItem({ data: 'K' }),
        new TableItem({ data: 'L' }),
      ],
    ]);

    tableModel.moveColumn(1, 0);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'H' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'I' }),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'D' }),
      new TableItem({ data: 'J' }),
    ]);
    expect(tableModel.column(3)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'K' }),
    ]);
    expect(tableModel.column(4)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'G' }),
    ]);
    expect(tableModel.column(5)).toEqual([
      new TableItem({ data: 'F' }),
      new TableItem({ data: 'L' }),
    ]);
    expect(tableModel['header'][0].length).toEqual(3);
    expect(tableModel['header'][1].length).toEqual(4);
    expect(tableModel['header'][2].length).toEqual(6);
    expect(tableModel['header'][0].map((h) => h.data)).toEqual(['h2', 'h1', 'h3']);
    expect(tableModel['header'][1].map((h) => h.data)).toEqual(['h12', 'h13', 'h11', 'h14']);
    expect(tableModel['header'][2].map((h) => h.data)).toEqual([
      'h22',
      'h23',
      'h24',
      'h25',
      'h21',
      'h26',
    ]);
  });

  it('should move (multi-line header with row spans) column to beginning', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      [
        new TableHeaderItem({ data: 'h1', colSpan: 4 }),
        new TableHeaderItem({ data: 'h2', rowSpan: 4 }),
        new TableHeaderItem({ data: 'h3', colSpan: 2, rowSpan: 2 }),
        new TableHeaderItem({ data: 'h4', colSpan: 2 }),
      ],
      [
        new TableHeaderItem({ data: 'h11' }),
        new TableHeaderItem({ data: 'h12', rowSpan: 2, colSpan: 2 }),
        new TableHeaderItem({ data: 'h13', rowSpan: 3 }),
        new TableHeaderItem({ data: 'h41', rowSpan: 3 }),
        new TableHeaderItem({ data: 'h42' }),
      ],
      [
        new TableHeaderItem({ data: 'h111' }),
        new TableHeaderItem({ data: 'h31', colSpan: 2 }),
        new TableHeaderItem({ data: 'h421' }),
      ],
      [
        new TableHeaderItem({ data: 'h1111' }),
        new TableHeaderItem({ data: 'h121' }),
        new TableHeaderItem({ data: 'h122' }),
        new TableHeaderItem({ data: 'h311' }),
        new TableHeaderItem({ data: 'h312' }),
        new TableHeaderItem({ data: 'h422' }),
      ],
    ]);

    tableModel.setData([
      [
        new TableItem({ data: 'd1111' }),
        new TableItem({ data: 'd121' }),
        new TableItem({ data: 'd122' }),
        new TableItem({ data: 'd13' }),
        new TableItem({ data: 'd2' }),
        new TableItem({ data: 'd311' }),
        new TableItem({ data: 'd312' }),
        new TableItem({ data: 'd41' }),
        new TableItem({ data: 'd422' }),
      ],
      [
        new TableItem({ data: 'd1111' }),
        new TableItem({ data: 'd121' }),
        new TableItem({ data: 'd122' }),
        new TableItem({ data: 'd13' }),
        new TableItem({ data: 'd2' }),
        new TableItem({ data: 'd311' }),
        new TableItem({ data: 'd312' }),
        new TableItem({ data: 'd41' }),
        new TableItem({ data: 'd422' }),
      ],
    ]);

    tableModel.moveColumn(2, 0, 0);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'd311' }),
      new TableItem({ data: 'd311' })
    ]);

    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'd312' }),
      new TableItem({ data: 'd312' })
    ]);

    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'd1111' }),
      new TableItem({ data: 'd1111' })
    ]);

    expect(tableModel.column(3)).toEqual([
      new TableItem({ data: 'd121' }),
      new TableItem({ data: 'd121' })
    ]);

    expect(tableModel.column(4)).toEqual([
      new TableItem({ data: 'd122' }),
      new TableItem({ data: 'd122' })
    ]);

    expect(tableModel.column(5)).toEqual([
      new TableItem({ data: 'd13' }),
      new TableItem({ data: 'd13' })
    ]);

    expect(tableModel.column(6)).toEqual([
      new TableItem({ data: 'd2' }),
      new TableItem({ data: 'd2' })
    ]);

    expect(tableModel.column(7)).toEqual([
      new TableItem({ data: 'd41' }),
      new TableItem({ data: 'd41' })
    ]);

    expect(tableModel.column(8)).toEqual([
      new TableItem({ data: 'd422' }),
      new TableItem({ data: 'd422' })
    ]);
  });

  it('should move (multi-line header with row spans) column to the end', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      [
        new TableHeaderItem({ data: 'h1', colSpan: 4 }),
        new TableHeaderItem({ data: 'h2', rowSpan: 4 }),
        new TableHeaderItem({ data: 'h3', colSpan: 2, rowSpan: 2 }),
        new TableHeaderItem({ data: 'h4', colSpan: 2 }),
      ],
      [
        new TableHeaderItem({ data: 'h11' }),
        new TableHeaderItem({ data: 'h12', rowSpan: 2, colSpan: 2 }),
        new TableHeaderItem({ data: 'h13', rowSpan: 3 }),
        new TableHeaderItem({ data: 'h41', rowSpan: 3 }),
        new TableHeaderItem({ data: 'h42' }),
      ],
      [
        new TableHeaderItem({ data: 'h111' }),
        new TableHeaderItem({ data: 'h31', colSpan: 2 }),
        new TableHeaderItem({ data: 'h421' }),
      ],
      [
        new TableHeaderItem({ data: 'h1111' }),
        new TableHeaderItem({ data: 'h121' }),
        new TableHeaderItem({ data: 'h122' }),
        new TableHeaderItem({ data: 'h311' }),
        new TableHeaderItem({ data: 'h312' }),
        new TableHeaderItem({ data: 'h422' }),
      ],
    ]);

    tableModel.setData([
      [
        new TableItem({ data: 'd1111' }),
        new TableItem({ data: 'd121' }),
        new TableItem({ data: 'd122' }),
        new TableItem({ data: 'd13' }),
        new TableItem({ data: 'd2' }),
        new TableItem({ data: 'd311' }),
        new TableItem({ data: 'd312' }),
        new TableItem({ data: 'd41' }),
        new TableItem({ data: 'd422' }),
      ],
      [
        new TableItem({ data: 'd1111' }),
        new TableItem({ data: 'd121' }),
        new TableItem({ data: 'd122' }),
        new TableItem({ data: 'd13' }),
        new TableItem({ data: 'd2' }),
        new TableItem({ data: 'd311' }),
        new TableItem({ data: 'd312' }),
        new TableItem({ data: 'd41' }),
        new TableItem({ data: 'd422' }),
      ],
    ]);

    tableModel.moveColumn(1, 3, 0);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'd1111' }),
      new TableItem({ data: 'd1111' })
    ]);

    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'd121' }),
      new TableItem({ data: 'd121' })
    ]);

    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'd122' }),
      new TableItem({ data: 'd122' })
    ]);

    expect(tableModel.column(3)).toEqual([
      new TableItem({ data: 'd13' }),
      new TableItem({ data: 'd13' })
    ]);

    expect(tableModel.column(4)).toEqual([
      new TableItem({ data: 'd311' }),
      new TableItem({ data: 'd311' })
    ]);

    expect(tableModel.column(5)).toEqual([
      new TableItem({ data: 'd312' }),
      new TableItem({ data: 'd312' })
    ]);

    expect(tableModel.column(6)).toEqual([
      new TableItem({ data: 'd41' }),
      new TableItem({ data: 'd41' })
    ]);

    expect(tableModel.column(7)).toEqual([
      new TableItem({ data: 'd422' }),
      new TableItem({ data: 'd422' })
    ]);

    expect(tableModel.column(8)).toEqual([
      new TableItem({ data: 'd2' }),
      new TableItem({ data: 'd2' })
    ]);
  });

  it('should calculate correct actual index', () => {
    const header = [
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2', colSpan: 3 }),
      new TableHeaderItem({ data: 'h3', colSpan: 4 }),
    ];
    const tableModel = new AITableModel();

    expect(tableModel['projectedIndexToActualIndex'](0, header)).toEqual(0);
    expect(tableModel['projectedIndexToActualIndex'](1, header)).toEqual(1);
    expect(tableModel['projectedIndexToActualIndex'](2, header)).toEqual(1);
    expect(tableModel['projectedIndexToActualIndex'](3, header)).toEqual(1);
    expect(tableModel['projectedIndexToActualIndex'](4, header)).toEqual(2);
    expect(tableModel['projectedIndexToActualIndex'](5, header)).toEqual(2);
    expect(tableModel['projectedIndexToActualIndex'](6, header)).toEqual(2);
    expect(tableModel['projectedIndexToActualIndex'](7, header)).toEqual(2);
  });

  it('should calculate correct projected indices', () => {
    const header = [
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2', colSpan: 3 }),
      new TableHeaderItem({ data: 'h3', colSpan: 4 }),
    ];
    const tableModel = new AITableModel();

    expect(tableModel['actualIndexToProjectedIndices'](0, header)).toEqual([0]);
    expect(tableModel['actualIndexToProjectedIndices'](1, header)).toEqual([1, 2, 3]);
    expect(tableModel['actualIndexToProjectedIndices'](2, header)).toEqual([4, 5, 6, 7]);
  });

  it('should calculate correct projected indices', () => {
    const header = [
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2', colSpan: 3 }),
      new TableHeaderItem({ data: 'h3', colSpan: 4 }),
    ];
    const header2 = [
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2', colSpan: 2 }),
      new TableHeaderItem({ data: 'h3' }),
      new TableHeaderItem({ data: 'h4', colSpan: 2 }),
      new TableHeaderItem({ data: 'h5', colSpan: 2 }),
    ];
    const tableModel = new AITableModel();

    expect(
      tableModel['projectedIndicesToActualIndices'](
        tableModel['actualIndexToProjectedIndices'](0, header),
        header2
      )
    ).toEqual([0]);
    expect(
      tableModel['projectedIndicesToActualIndices'](
        tableModel['actualIndexToProjectedIndices'](1, header),
        header2
      )
    ).toEqual([1, 2]);
    expect(
      tableModel['projectedIndicesToActualIndices'](
        tableModel['actualIndexToProjectedIndices'](2, header),
        header2
      )
    ).toEqual([3, 4]);
  });

  it('should move multiple array items to left', () => {
    const header = [
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
      new TableHeaderItem({ data: 'h4' }),
      new TableHeaderItem({ data: 'h5' }),
      new TableHeaderItem({ data: 'h6' }),
    ];
    const tableModel = new AITableModel();

    tableModel['moveMultipleToIndex']([1, 2, 3], 0, header);

    expect(header.map((item) => item.data)).toEqual(['h2', 'h3', 'h4', 'h1', 'h5', 'h6']);
  });

  it('should move one array items to left', () => {
    const header = [
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
      new TableHeaderItem({ data: 'h4' }),
      new TableHeaderItem({ data: 'h5' }),
      new TableHeaderItem({ data: 'h6' }),
    ];
    const tableModel = new AITableModel();

    tableModel['moveMultipleToIndex']([1], 0, header);

    expect(header.map((item) => item.data)).toEqual(['h2', 'h1', 'h3', 'h4', 'h5', 'h6']);
  });

  it('should move multiple array items to right', () => {
    const header = [
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
      new TableHeaderItem({ data: 'h4' }),
      new TableHeaderItem({ data: 'h5' }),
      new TableHeaderItem({ data: 'h6' }),
    ];
    const tableModel = new AITableModel();

    tableModel['moveMultipleToIndex']([1, 2, 3], 4, header);

    expect(header.map((item) => item.data)).toEqual(['h1', 'h5', 'h2', 'h3', 'h4', 'h6']);
  });

  it('should move one array items to right', () => {
    const header = [
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
      new TableHeaderItem({ data: 'h4' }),
      new TableHeaderItem({ data: 'h5' }),
      new TableHeaderItem({ data: 'h6' }),
    ];
    const tableModel = new AITableModel();

    tableModel['moveMultipleToIndex']([1], 2, header);
    expect(header.map((item) => item.data)).toEqual(['h1', 'h3', 'h2', 'h4', 'h5', 'h6']);
  });

  it('should preserve header if data is emptied', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);
    tableModel.setData([[]]);
    expect(tableModel['header'][0].length).toEqual(3);
    expect(tableModel.getClosestHeader(0).data).toEqual('h1');
    expect(tableModel.getClosestHeader(1).data).toEqual('h2');
    expect(tableModel.getClosestHeader(2).data).toEqual('h3');
  });
});
