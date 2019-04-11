import React, { useReducer, useEffect } from 'react';
import update from 'immutability-helper';

import Table from './Table';
import { baseTableReducer } from './baseTableReducer';
import * as baseTableActions from './tableActionCreators';

/**
 * Simulates a client capable of asynchronously fetching
 * paginated, filtered and sorted data from some resource (e.g. an HTTP API)
 */
class MockApiClient {
  static totalRows = 100;

  static firstNames = [
    'Tom',
    'Amy',
    'Bryan',
    'Cynthia',
    'Claudia',
    'Denny',
    'Mats',
    'Luaithrenn',
    'Scott',
    'Taylor',
  ];

  static lastNames = ['Smith', 'Brown', 'Johnson', 'Williams', 'Miller', 'Davis', 'Wilson'];

  constructor() {
    this.data = [];

    for (let i = 0; i < MockApiClient.totalRows; i += 1) {
      this.data = [
        ...this.data,
        {
          firstName: `${
            MockApiClient.firstNames[Math.floor(Math.random() * MockApiClient.firstNames.length)]
          } (${i + 1})`,
          lastName: `${
            MockApiClient.lastNames[Math.floor(Math.random() * MockApiClient.lastNames.length)]
          } (${i + 1})`,
        },
      ];
    }
  }

  /**
   * Return a promise that resolves (after a delay) to a page of data, optionally filtered and sorted.
   *
   * offset: the index of the first result in the returned page
   * limit: the (maximum) number of results to include in the returned page
   * firstName: (optional) filter results to include only those with a firstName that include this as a substring
   * lastName: (optional) filter results to include only those with a lastName that include this as a substring
   * sort: (optional) An object with fields {"fieldName":<string>, "descending":<boolean>} denoting a
   *                  a field (one of "firstName" or "lastName" on which to sort results, and the direction
   *                  of the sort.
   *
   */
  getData = (offset, limit, firstName = undefined, lastName = undefined, sortSpec = undefined) => {
    // console.log('Fetching ', offset, limit, firstName, lastName, sortSpec);

    return new Promise(resolve => {
      // filter results
      const maybeFiltered = this.data
        .filter(
          d =>
            firstName === undefined ||
            `${d.firstName.toLowerCase()}`.includes(firstName.toLowerCase())
        )
        .filter(
          d =>
            lastName === undefined || `${d.lastName.toLowerCase()}`.includes(lastName.toLowerCase())
        );

      const maybeSorted = sortSpec
        ? maybeFiltered.sort((da, db) => {
            const a = da[sortSpec.fieldName];
            const b = db[sortSpec.fieldName];
            return a === b ? 0 : (a < b ? -1 : 1) * (sortSpec.descending ? -1 : 1);
          })
        : maybeFiltered;

      // cap results to total (matching) rows even if more are requested
      const maxRow = Math.min(maybeSorted.length, offset + limit);
      const page = maybeSorted.slice(offset, maxRow);

      setTimeout(
        () =>
          resolve({
            meta: {
              totalRows: maybeSorted.length,
            },
            results: page,
          }),
        1000
      );
    });
  };
}

/**
 * Extends the baseTableReducer to perform some additional state management
 * 
 */
const reducer = (state, action) => {
  switch (action.type) {

    // Used to set the table's data (and totalItems)
    // once a data fetch completes
    case baseTableActions.TABLE_REGISTER:
      return update(baseTableReducer(state, action), {
        data: {
          $set: action.payload,
        },
        view: {
          pagination: {
            totalItems: { $set: action.totalItems },
          },
        },
      });

    // clear all loaded data (and reset totalItems) if filter or sort values change
    case baseTableActions.TABLE_COLUMN_SORT:
    case baseTableActions.TABLE_FILTER_CLEAR:
    case baseTableActions.TABLE_FILTER_APPLY:
      // baseTable reducer takes care of resetting the page back to 0 when filters change
      // NOTE: this is NOT the case when sorting changes (the page can stay as it was before
      // since sorting does not change the number of results, only their order).
      return update(baseTableReducer(state, action), {
        data: {
          $set: [],
        },
        view: {
          pagination: {
            totalItems: { $set: undefined },
          },
        },
      });

    // for all other actions, just defer immediately to baseTableReducer
    default:
      return baseTableReducer(state, action);
  }
};

const apiClient = new MockApiClient();

const AsyncTable = () => {
  const columns = [
    { id: 'firstName', name: 'First Name', isSortable: true },
    { id: 'lastName', name: 'Last Name', isSortable: true },
  ];

  const [state, dispatch] = useReducer(reducer, {
    data: [],
    view: {
      filters: [],
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
        ordering: columns.map(({ id }) => ({
          columnId: id,
          isHidden: false,
        })),
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

  // console.log(state);

  // This hook is responsible for refetching more data asynchronously
  // as necessary when the page, filters or sort properties are changed
  useEffect(() => {
    // console.log('pagination', state.view.pagination);
    // console.log('filters', state.view.filters);
    // console.log('sort', state.view.table.sort);

    // Determine what our filters should be
    let firstNameFilterValue;
    let lastNameFilterValue;
    if (state.view.filters) {
      const firstNameFilter = state.view.filters.find(f => f.columnId === 'firstName');
      firstNameFilterValue = firstNameFilter ? firstNameFilter.value : undefined;
      const lastNameFilter = state.view.filters.find(f => f.columnId === 'lastName');
      lastNameFilterValue = lastNameFilter ? lastNameFilter.value : undefined;
    }

    // Determine what our sortSpec should be
    let sortSpec;
    if (state.view.table.sort) {
      sortSpec = {
        fieldName: state.view.table.sort.columnId,
        descending: state.view.table.sort.direction === 'DESC',
      };
    }

    const { page } = state.view.pagination;
    const { pageSize } = state.view.pagination;
    const { totalItems } = state.view.pagination;

    // The index of the first result that should appear in the table
    // based on the pagination properties set by the user
    // NOTE: (page - 1) because pages start from 1, but our results are zero-indexed
    const requestedFrom = (page - 1) * pageSize;

    // The index of the last result that should appear in the table
    // based on the pagination properties set by the user
    const requestedUpTo = requestedFrom + pageSize;

    // Cap by totalItems to avoid unnecessarily reloading the final page
    // in cases where totalItems % pageSize > 0
    // NOTE: (unless this is the first fetch, in which case we don't have totalItems
    // and definitely need to load some results)
    const requestedUpToCapped =
      totalItems === undefined ? requestedUpTo : Math.min(requestedUpTo, totalItems);

    // We have already loaded results in to memory up to this index
    const loadedUpTo = state.data.length;

    // The remaining number of results we need to fetch
    // NOTE: (maybe <=0, in which case no fetch will be performed)
    const remainingToFetch = requestedUpToCapped - loadedUpTo;

    if (remainingToFetch > 0) {
      // put the table in loading state while the data is fetched
      dispatch(baseTableActions.tableLoadingSet(true, remainingToFetch));

      // fetch the data
      apiClient
        .getData(loadedUpTo, remainingToFetch, firstNameFilterValue, lastNameFilterValue, sortSpec)
        .then(data => {
          // map the results into a form suitable for the table data field
          const tableData = data.results.map((r, idx) => ({
            id: `${loadedUpTo + idx}`,
            values: r,
          }));

          // update the table data
          dispatch(
            baseTableActions.tableRegister([...state.data, ...tableData], data.meta.totalRows)
          );

          // and reset the table's loading state
          dispatch(baseTableActions.tableLoadingSet(false));
        });
      }
    }, 
    
    // The effect above will fire whenever any of these
    // state variables change
    [
      state.view.pagination.page,
      state.view.pagination.pageSize,
      state.view.filters,
      state.view.table.sort,
      state.view.pagination.totalItems,
      state.data,
      state.view.pagination,
    ]
  );

  // This hooks up our table to our reducer, ensuring that the appropriate
  // action is dispatched as the user interacts with the table's components
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

      onSelectAll: isSelected => {
        dispatch(baseTableActions.tableRowSelectAll(isSelected));
      },
      onRowExpanded: (rowId, isExpanded) => {
        dispatch(baseTableActions.tableRowExpand(rowId, isExpanded));
      },
      onChangeOrdering: ordering => {
        dispatch(baseTableActions.tableColumnOrder(ordering));
      },

      // These actions don't have any impact on table state
      // (and we don't need to make use of them in this example)
      // Blank implementations are provided to suppress console warnings
      onEmptyStateAction: () => {},
      onApplyRowAction: (/* rowId, actionId */) => {},
      onRowClicked: (/* rowId */) => {},
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
        hasSearch: true,
        hasPagination: true,
        hasRowSelection: false,
        hasRowExpansion: false,
        hasRowActions: false,
        hasColumnSelection: true,
        shouldExpandOnRowClick: false,
      }}
    />
  );
};

export default AsyncTable;
