import merge from 'lodash/merge';
import omit from 'lodash/omit';

import { tableReducer } from './tableReducer';
import {
  tableRegister,
  tablePageChange,
  tableToolbarToggle,
  tableFilterApply,
  tableFilterClear,
  tableActionCancel,
  tableActionApply,
  tableColumnSort,
  tableColumnOrder,
  tableRowSelect,
  tableRowSelectAll,
  tableRowExpand,
  tableSearchApply,
} from './tableActionCreators';
import { initialState, tableColumns } from './Table.story';

describe('table reducer testcases', () => {
  test('nothing', () => {
    expect(tableReducer(undefined, { type: 'BOGUS' })).toEqual({});
  });
  describe('filter tests', () => {
    test('TABLE_FILTER_CLEAR', () => {
      expect(tableReducer(initialState, tableFilterClear()).view.filters).toEqual([]);
    });
    test('TABLE_FILTER_APPLY filter with invalid column id', () => {
      const updatedState = tableReducer(
        initialState,
        tableFilterApply({ invalidColumnName: 'filtervalue' })
      );
      // Apply the filter visually
      expect(updatedState.view.filters).toEqual([
        { columnId: 'invalidColumnName', value: 'filtervalue' },
      ]);
      // but data should be the same
      expect(updatedState.view.table.filteredData).toEqual(initialState.data);
    });
    test('TABLE_FILTER_APPLY filter should filter data', () => {
      const updatedState = tableReducer(
        initialState,
        tableFilterApply({ [tableColumns[0].id]: '1' })
      );
      // Apply the filter
      expect(updatedState.view.filters).toEqual([{ columnId: tableColumns[0].id, value: '1' }]);
      // data should result in less records
      expect(updatedState.view.table.filteredData.length).toBeLessThan(initialState.data.length);
    });
  });
  describe('pagination tests', () => {
    test('TABLE_PAGE_CHANGE ', () => {
      const updatedState = tableReducer(initialState, tablePageChange({ page: 3 }));
      expect(updatedState.view.pagination.page).toEqual(3);
    });
    test('TABLE_PAGE_CHANGE with invalid page', () => {
      const updatedState = tableReducer(initialState, tablePageChange({ page: 65 }));
      expect(updatedState.view.pagination.page).toEqual(1);
    });
  });
  describe('toolbar actions', () => {
    test('TABLE_TOOLBAR_TOGGLE ', () => {
      const updatedState = tableReducer(initialState, tableToolbarToggle('column'));
      expect(updatedState.view.toolbar.activeBar).toEqual('column');
    });
    test('TABLE_SEARCH_APPLY filter should search data', () => {
      const searchString = 'searchString';
      const updatedState = tableReducer(initialState, tableSearchApply(searchString));
      // Apply the search
      expect(updatedState.view.toolbar.search.value).toEqual(searchString);
      expect(updatedState.view.pagination.page).toEqual(1);
    });
  });
  describe('table actions', () => {
    test('TABLE_ACTION_CANCEL ', () => {
      const tableWithSelection = tableReducer(initialState, tableRowSelectAll(true));
      // All should be selected
      expect(tableWithSelection.view.table.selectedIds.length).toEqual(initialState.data.length);

      const tableAfterCancel = tableReducer(initialState, tableActionCancel());
      expect(tableAfterCancel.view.table.selectedIds).toEqual([]);
      expect(tableAfterCancel.view.table.isSelectAllSelected).toEqual(false);
      expect(tableAfterCancel.view.table.isSelectAllIndeterminate).toEqual(false);
    });
    test('TABLE_ACTION_APPLY ', () => {
      // Select everything first
      const tableWithSelection = tableReducer(initialState, tableRowSelectAll(true));

      // All should be selected
      expect(tableWithSelection.view.table.selectedIds.length).toEqual(initialState.data.length);

      // If it's not delete we should clear the selection
      const tableAfterCustomAction = tableReducer(tableWithSelection, tableActionApply('custom'));
      expect(tableAfterCustomAction.view.table.selectedIds).toEqual([]);
      expect(tableAfterCustomAction.view.table.isSelectAllSelected).toEqual(false);
      expect(tableAfterCustomAction.view.table.isSelectAllIndeterminate).toEqual(false);
      expect(tableAfterCustomAction.data).toEqual(initialState.data);
      expect(tableAfterCustomAction.view.table.filteredData).toEqual(
        initialState.view.table.filteredData
      );

      // If it is delete we should update data and filtered data
      const tableAfterDeleteAction = tableReducer(tableWithSelection, tableActionApply('delete'));
      expect(tableAfterDeleteAction.view.table.selectedIds).toEqual([]);
      expect(tableAfterDeleteAction.view.table.isSelectAllSelected).toEqual(false);
      expect(tableAfterDeleteAction.view.table.isSelectAllIndeterminate).toEqual(false);
      expect(tableAfterDeleteAction.data).toEqual([]);
      expect(tableAfterDeleteAction.view.table.filteredData).toEqual([]);
    });
  });
  describe('table column actions', () => {
    test('TABLE_COLUMN_SORT', () => {
      const sortColumnAction = tableColumnSort(tableColumns[0].id);
      // First sort ASC
      expect(initialState.view.table.sort).toBeUndefined();
      const tableSorted = tableReducer(initialState, sortColumnAction);
      expect(tableSorted.view.table.sort.columnId).toEqual(tableColumns[0].id);
      expect(tableSorted.view.table.sort.direction).toEqual('ASC');
      // Order should be changed in the filteredData
      expect(initialState.data).not.toEqual(tableSorted.view.table.filteredData);

      // Then sort descending
      const tableSortedDesc = tableReducer(tableSorted, sortColumnAction);
      expect(tableSortedDesc.view.table.sort.columnId).toEqual(tableColumns[0].id);
      expect(tableSortedDesc.view.table.sort.direction).toEqual('DESC');
      // The previous sorted data shouldn't match
      expect(tableSortedDesc.view.table.filteredData).not.toEqual(
        tableSorted.view.table.filteredData
      );

      const tableSortedNone = tableReducer(tableSortedDesc, sortColumnAction);
      const filteredTable = tableReducer(initialState, tableRegister());
      expect(tableSortedNone.view.table.sort).toBeUndefined();
      // Data should no longer be sorted but should be filtered
      expect(filteredTable.view.table.filteredData).toEqual(
        tableSortedNone.view.table.filteredData
      );
    });
    test('TABLE_COLUMN_ORDER', () => {
      expect(initialState.view.table.ordering[0].isHidden).toBe(false);
      // Hide the first column
      const columnHideAction = tableColumnOrder([{ columnId: tableColumns[0].id, isHidden: true }]);
      const tableWithHiddenColumn = tableReducer(initialState, columnHideAction);
      expect(tableWithHiddenColumn.view.table.ordering[0].isHidden).toBe(true);
    });
  });
  describe('Table Row Operations', () => {
    test('TABLE_ROW_SELECT', () => {
      expect(initialState.view.table.selectedIds).toEqual([]);

      // Negative case where I unselect a row
      const tableWithNoRowsSelected = tableReducer(initialState, tableRowSelect('row-1', false));
      expect(tableWithNoRowsSelected.view.table.selectedIds).toEqual([]);
      expect(tableWithNoRowsSelected.view.table.isSelectAllSelected).toEqual(false);
      expect(tableWithNoRowsSelected.view.table.isSelectAllIndeterminate).toEqual(false);

      // Select a row
      const tableWithSelectedRow = tableReducer(initialState, tableRowSelect('row-1', true));
      expect(tableWithSelectedRow.view.table.selectedIds).toEqual(['row-1']);
      expect(tableWithSelectedRow.view.table.isSelectAllSelected).toEqual(false);
      expect(tableWithSelectedRow.view.table.isSelectAllIndeterminate).toEqual(true);

      // Unselect the row
      const tableWithUnSelectedRow = tableReducer(
        tableWithSelectedRow,
        tableRowSelect('row-1', false)
      );
      expect(tableWithUnSelectedRow.view.table.selectedIds).toEqual([]);
      expect(tableWithUnSelectedRow.view.table.isSelectAllSelected).toEqual(false);
      expect(tableWithUnSelectedRow.view.table.isSelectAllIndeterminate).toEqual(false);
    });
    test('TABLE_ROW_SELECT_ALL', () => {
      expect(initialState.view.table.selectedIds).toEqual([]);
      // Select all
      const tableWithSelectedAll = tableReducer(initialState, tableRowSelectAll(true));
      expect(tableWithSelectedAll.view.table.selectedIds.length).toEqual(
        tableWithSelectedAll.data.length
      );
      expect(tableWithSelectedAll.view.table.isSelectAllIndeterminate).toEqual(false);
      expect(tableWithSelectedAll.view.table.isSelectAllSelected).toEqual(true);
      // Unselect all
      const tableWithUnSelectedAll = tableReducer(initialState, tableRowSelectAll(false));
      expect(tableWithUnSelectedAll.view.table.selectedIds.length).toEqual(0);
      expect(tableWithUnSelectedAll.view.table.isSelectAllIndeterminate).toEqual(false);
      expect(tableWithUnSelectedAll.view.table.isSelectAllSelected).toEqual(false);
    });
    test('TABLE_ROW_EXPAND', () => {
      expect(initialState.view.table.expandedIds).toEqual([]);
      // Expanded row
      const tableWithExpandedRow = tableReducer(initialState, tableRowExpand('row-1', true));
      expect(tableWithExpandedRow.view.table.expandedIds).toEqual(['row-1']);
      // Collapsed row
      const tableWithCollapsedRow = tableReducer(initialState, tableRowExpand('row-1', false));
      expect(tableWithCollapsedRow.view.table.expandedIds).toEqual([]);
    });
    test('REGISTER_TABLE', () => {
      // Data should be filtered once table registers
      expect(initialState.view.table.filteredData).toBeUndefined();
      const tableWithFilteredData = tableReducer(initialState, tableRegister());
      expect(tableWithFilteredData.view.table.filteredData.length).toBeGreaterThan(0);
      expect(tableWithFilteredData.view.table.filteredData.length).not.toEqual(
        initialState.data.length
      );

      // Initial state with sort specified but no filters
      const initialStateWithSortAndNoFilters = merge({}, omit(initialState, 'view.filters'), {
        view: { table: { sort: { columnId: 'string', direction: 'ASC' } }, filters: [] },
      });
      const tableWithSortedData = tableReducer(initialStateWithSortAndNoFilters, tableRegister());
      expect(tableWithSortedData.view.table.filteredData.length).toEqual(
        initialStateWithSortAndNoFilters.data.length
      );
      // But they shouldn't be equal because the order changed
      expect(tableWithSortedData.view.table.filteredData).not.toEqual(
        initialStateWithSortAndNoFilters.data
      );
    });
  });
});
