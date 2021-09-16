import React from 'react';
import { TrashCan16 } from '@carbon/icons-react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import Table from './Table';
import {
  addRowActions,
  getRowExpansionContentFunction,
  getSelectData,
  getTableColumns,
  getTableData,
  getWords,
} from './Table.test.helpers';

describe('Table visual regression tests', () => {
  const words = getWords();
  const selectData = getSelectData();
  const tableData = addRowActions(getTableData(20, words, selectData));

  it('match snapshot', () => {
    cy.viewport(1680, 900);
    mount(
      <div data-testid="all-tables">
        <Table
          testId="snapshot-1"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true" // False
          lightweight={false} // True
          expandedData={tableData.map((data) => ({
            rowId: data.id,
            content: getRowExpansionContentFunction(data.id, tableData),
          }))}
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false, // true
                },
              ],
            },
            table: {
              selectedIds: [],
              // expandedIds: ['row-1', 'row-2'],
              expandedRows: [
                {
                  rowId: 'row-2',
                  content: getRowExpansionContentFunction('row-2', tableData),
                },
              ],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
        <Table
          testId="snapshot-2"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true"
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false,
                },
              ],
            },
            table: {
              selectedIds: [],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
        <Table
          testId="snapshot-3"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true"
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false,
                },
              ],
            },
            table: {
              selectedIds: [],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
        <Table
          testId="snapshot-4"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true"
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false,
                },
              ],
            },
            table: {
              selectedIds: [],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
        <Table
          testId="snapshot-5"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true"
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false,
                },
              ],
            },
            table: {
              selectedIds: [],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
        <Table
          testId="snapshot-6"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true"
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false,
                },
              ],
            },
            table: {
              selectedIds: [],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
        <Table
          testId="snapshot-7"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true"
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false,
                },
              ],
            },
            table: {
              selectedIds: [],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
        <Table
          testId="snapshot-8"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true"
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false,
                },
              ],
            },
            table: {
              selectedIds: [],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
        <Table
          testId="snapshot-9"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true"
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false,
                },
              ],
            },
            table: {
              selectedIds: [],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
        <Table
          testId="snapshot-10"
          columns={getTableColumns(selectData)}
          data={tableData}
          secondaryTitle="Visual snapshot test table"
          useZebraStyles="true"
          options={{
            // hasAdvancedFilter: true,
            hasAggregations: true,
            hasColumnSelection: true,
            hasColumnSelectionConfig: true,
            hasFilter: true,
            // hasMultiSort: true,
            hasPagination: true,
            hasResize: true,
            hasRowExpansion: true,
            hasRowActions: true,
            hasRowNesting: true,
            hasRowSelection: 'multi', // multi, single, false
            hasSearch: true,
            hasSort: true,
            // preserveColumnWidths: true,
            useAutoTableLayoutForResize: false,
            // wrapCellText: 'alwaysTruncate', // 'always' is the default
          }}
          view={{
            aggregations: {
              label: 'Total:',
              columns: [
                {
                  id: 'number',
                  align: 'start', // ['start', 'center', 'end']
                  isSortable: false,
                },
              ],
            },
            table: {
              selectedIds: [],
            },
            toolbar: {
              activeBar: 'filter', // filter, column, rowEdit
              batchActions: [
                {
                  iconDescription: 'Delete Item',
                  id: 'delete',
                  labelText: 'Delete',
                  renderIcon: TrashCan16,
                },
              ],
            },
          }}
        />
      </div>
    );

    // cy.findByText(/\/\* Visual snapshot test table \*\//).should('be.visible');

    // This component throws a network error with too many calls to the cdn script it loads so adding snapshot to existing instance
    onlyOn('headless', () => {
      cy.findByTestId('all-tables').compareSnapshot('table', 0.131767);
      // cy.findByTestId('snapshot-1').compareSnapshot('snapshot-1');
      // cy.findByTestId('snapshot-2').compareSnapshot('snapshot-2');
      // cy.findByTestId('snapshot-3').compareSnapshot('snapshot-3');
      // cy.findByTestId('snapshot-4').compareSnapshot('snapshot-4');
      // cy.findByTestId('snapshot-5').compareSnapshot('snapshot-5');
      // cy.findByTestId('snapshot-6').compareSnapshot('snapshot-6');
      // cy.findByTestId('snapshot-7').compareSnapshot('snapshot-7');
      // cy.findByTestId('snapshot-8').compareSnapshot('snapshot-8');
      // cy.findByTestId('snapshot-9').compareSnapshot('snapshot-9');
      // cy.findByTestId('snapshot-10').compareSnapshot('snapshot-10');
    });
  });
});
