import Table from './Table';

import React, { useReducer, useEffect } from 'react';

import update from 'immutability-helper';

import { baseTableReducer } from './baseTableReducer';
/*
import {
  tableRegister,
  tablePageChange,
  tableFilterApply,
  tableFilterClear,
  tableSearchApply,
  tableToolbarToggle,
  tableActionCancel,
  tableActionApply,
  tableColumnSort,
  tableRowSelect,
  tableRowSelectAll,
  tableRowExpand,
  tableColumnOrder,
  tableDataUpdate,
} from './tableActionCreators';
*/

import * as baseTableActions from './tableActionCreators';
console.log(baseTableActions);

class MockApiClient {
  static totalRows = 100;

  getData = (offset, limit) => {
    return new Promise((resolve, reject) => {
      // cap results to totalRows even if more are requested
      const maxRow = Math.min(MockApiClient.totalRows, offset + limit);

      let results = [];
      for (let i = offset; i < maxRow; i += 1) {
        results = [
          ...results,
          {
            firstName: `${i + 1} first name`,
            lastName: `${i + 1} last name`,
          },
        ];
      }

      setTimeout(
        () =>
          resolve({
            meta: {
              totalRows: MockApiClient.totalRows,
            },
            results: results,
          }),
        1000
      );
    });
  };
}

const reducer = (state, action) => {
  switch (action.type) {
    case baseTableActions.TABLE_REGISTER:
      return update(state, {
        data: {
          $set: action.payload,
        },
        view: {
          pagination: {
            totalItems: { $set: action.totalItems },
          },
        },
      });
    default:
      return baseTableReducer(state, action);
  }
};

const AsyncTable = ({}) => {
  const apiClient = new MockApiClient();

  const [state, dispatch] = useReducer(reducer, {
    data: [],
    view: {
      filters: [
        {
          columnId: 'string',
          value: 'whiteboard',
        },
        {
          columnId: 'select',
          value: 'option-B',
        },
      ],
      pagination: {
        pageSize: 10,
        pageSizes: [10, 20, 30],
        page: 1,
        totalItems: undefined,
      },
      table: {
        isSelectAllSelected: false,
        selectedIds: [],
        sort: undefined,
        ordering: [],
        expandedIds: [],
        loadingState: {
          isLoading: false,
        },
      },
      toolbar: {
        activeBar: 'filter',
        batchActions: [
          {
            id: 'delete',
            labelText: 'Delete',
            icon: 'delete',
            iconDescription: 'Delete',
          },
        ],
        search: {
          placeHolderText: 'My Search',
        },
      },
    },
  });

  // This hook is responsible for refetching more data asynchronously
  // as necessary when the page is changed
  useEffect(() => {
    const page = state.view.pagination.page;
    const pageSize = state.view.pagination.pageSize;

    const requestedFrom = (page - 1) * pageSize;

    // cap by totalItems to avoid unnecessarily reloading the final page in cases where totalItems % pageSize > 0
    // (unless this is the first fetch - in which case totalItems will be undefined)
    const requestedUpTo =
      state.view.pagination.totalItems === undefined
        ? requestedFrom + pageSize
        : Math.min(requestedFrom + pageSize, state.view.pagination.totalItems);

    // do we need to load more data?
    const loadedUpTo = state.data.length;

    const remainingToFetch = requestedUpTo - loadedUpTo;

    if (remainingToFetch > 0) {
      dispatch(baseTableActions.tableLoadingSet(true, remainingToFetch));

      apiClient.getData(loadedUpTo, remainingToFetch).then(data => {
        const tableData = data.results.map((r, idx) => ({ id: `${loadedUpTo + idx}`, values: r }));
        dispatch(
          baseTableActions.tableRegister([...state.data, ...tableData], data.meta.totalRows)
        );
        dispatch(baseTableActions.tableLoadingSet(false));
      });
    } else {
    }
  }, [state.view.pagination.page, state.view.pagination.pageSize]);

  //console.log(state);

  const actions = {
    pagination: {
      onChangePage: paginationValues => {
        dispatch(baseTableActions.tablePageChange(paginationValues));
      },
    },
    toolbar: {
      onApplyFilter: filterValues => {
        dispatch(baseTableActions.tableFilterApply(filterValues));
      },
      onToggleFilter: () => {
        dispatch(baseTableActions.tableToolbarToggle('filter'));
      },
      onToggleColumnSelection: () => {
        dispatch(baseTableActions.tableToolbarToggle('column'));
      },
      onClearAllFilters: () => {
        dispatch(baseTableActions.tableFilterClear());
      },
      onCancelBatchAction: () => {
        dispatch(baseTableActions.tableActionCancel());
      },
      onApplyBatchAction: id => {
        dispatch(baseTableActions.tableActionApply(id));
      },
      onApplySearch: string => {
        dispatch(baseTableActions.tableSearchApply(string));
      },
    },
    table: {
      onChangeSort: column => {
        dispatch(baseTableActions.tableColumnSort(column));
      },
      onRowSelected: (rowId, isSelected) => {
        dispatch(baseTableActions.tableRowSelect(rowId, isSelected));
      },
      onRowClicked: rowId => {
        // This action doesn't update our table state, it's up to the user
      },
      onSelectAll: isSelected => {
        dispatch(baseTableActions.tableRowSelectAll(isSelected));
      },
      onRowExpanded: (rowId, isExpanded) => {
        dispatch(baseTableActions.tableRowExpand(rowId, isExpanded));
      },
      onApplyRowAction: (rowId, actionId) => {},
      // This action doesn't update our table state, it's up to the user
      onEmptyStateAction: () => {},
      // This action doesn't update our table state, it's up to the user
      onChangeOrdering: ordering => {
        dispatch(baseTableActions.tableColumnOrder(ordering));
      },
    },
  };

  return (
    <Table
      columns={[{ id: 'firstName', name: 'First Name' }, { id: 'lastName', name: 'Last Name' }]}
      data={state.data}
      view={state.view}
      actions={actions}
      options={{
        hasFilter: true,
        hasSearch: true,
        hasPagination: true,
        hasRowSelection: true,
        hasRowExpansion: true,
        hasRowActions: true,
        hasColumnSelection: true,
        shouldExpandOnRowClick: false,
      }}
    />
  );
};

export default AsyncTable;
