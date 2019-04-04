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

class MockApiClient {
  static totalRows = 100;
  static firstNames = ['Tom', 'Amy', 'Bryan', 'Cynthia', 'Claudia', 'Denny', 'Mats', 'Luaithrenn', 'Scott', 'Taylor']
  static lastNames  = ['Smith', 'Brown', 'Johnson', 'Williams', 'Miller', 'Davis', 'Wilson', ]

  constructor() {
    this.data = [];

    for (let i = 0; i < MockApiClient.totalRows; i += 1) {
      this.data = [
        ...this.data,
        {
          firstName: `${MockApiClient.firstNames[Math.floor(Math.random()*MockApiClient.firstNames.length)]} (${i + 1})`,
          lastName:  `${MockApiClient.lastNames [Math.floor(Math.random()*MockApiClient.lastNames.length )]} (${i + 1})`,
        },
      ]
    }
  }

  getData = (offset, limit, firstName = undefined, lastName = undefined) => {
    console.log('Fetching ', offset, limit, firstName, lastName);

    return new Promise((resolve, reject) => {

      // filter results
      const filteredData = this.data
        .filter(
          d => firstName === undefined || `${d.firstName.toLowerCase()}`.includes(firstName.toLowerCase())
        )
        .filter(
          d => lastName === undefined || `${d.lastName.toLowerCase()}`.includes(lastName.toLowerCase())
        )

      // cap results to total (matching) rows even if more are requested
      const maxRow = Math.min(filteredData.length, offset + limit);

      const results = filteredData.slice(offset, maxRow);

      setTimeout(
        () =>
          resolve({
            meta: {
              totalRows: filteredData.length,
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
      return update(
        baseTableReducer(state, action),
        {
          data: {
            $set: action.payload,
          },
          view: {
            pagination: {
              totalItems: { $set: action.totalItems },
            },
          },
        }
      );

    // clear all loaded data (and reset totalItems) if filter values change
    case baseTableActions.TABLE_FILTER_CLEAR:
    case baseTableActions.TABLE_FILTER_APPLY:
      return update(
        baseTableReducer(state, action),
        {
          data: {
            $set: []
          },
          view: {
            pagination: {
              totalItems: { $set: undefined },
            },
          },
        }
      );
    
    default:
      return baseTableReducer(state, action);
  }
};

const apiClient = new MockApiClient();

const AsyncTable = ({}) => {
  

  const columns = [
    { id: 'firstName', name: 'First Name' },
    { id: 'lastName', name: 'Last Name' }
  ];

  const [state, dispatch] = useReducer(reducer, {
    data: [],
    view: {
      filters: [
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
  useEffect(
    () => {
      // console.log('pagination', state.view.pagination);
      // console.log('filters', state.view.filters);

      let firstNameFilterValue, lastNameFilterValue;
      if (state.view.filters) {
        const firstNameFilter = state.view.filters.find(f => f.columnId === 'firstName');
        firstNameFilterValue = firstNameFilter ? firstNameFilter.value : undefined;

        const lastNameFilter = state.view.filters.find(f => f.columnId === 'lastName');
        lastNameFilterValue = lastNameFilter ? lastNameFilter.value : undefined;    
      }


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

        apiClient.getData(
          loadedUpTo,
          remainingToFetch, 
          firstNameFilterValue,
          lastNameFilterValue,
        ).then(data => {
          const tableData = data.results.map((r, idx) => ({ id: `${loadedUpTo + idx}`, values: r }));
          dispatch(
            baseTableActions.tableRegister([...state.data, ...tableData], data.meta.totalRows)
          );
          dispatch(baseTableActions.tableLoadingSet(false));
        });
      } else {
      }
    },
    [state.view.pagination.page, state.view.pagination.pageSize, state.view.filters]
  );

  // console.log(state);

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
      columns={columns}
      data={state.data}
      view={state.view}
      actions={actions}
      options={{
        hasFilter: true,
        hasSearch: false,
        hasPagination: true,
        hasRowSelection: true,
        hasRowExpansion: false,
        hasRowActions: false,
        hasColumnSelection: true,
        shouldExpandOnRowClick: false,
      }}
    />
  );
};

export default AsyncTable;
