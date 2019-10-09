import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

import Table from '../Table';
import * as baseTableActions from '../tableActionCreators';

import reducer from './asyncTableReducer';

const AsyncTable = ({ fetchData, id }) => {
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
        ordering: columns.map(({ id: columnId }) => ({
          columnId,
          isHidden: false,
        })),
        expandedIds: [],
        loadingState: {
          isLoading: false,
        },
      },
      toolbar: {
        batchActions: [],
        search: {},
      },
    },
  });

  // console.log(state);

  // This hook is responsible for refetching more data asynchronously
  // as necessary when the page, filters or sort properties are changed
  useEffect(
    () => {
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
        fetchData(
          loadedUpTo,
          remainingToFetch,
          firstNameFilterValue,
          lastNameFilterValue,
          sortSpec
        ).then(data => {
          // map the results into a form suitable for the table data field
          const tableData = data.results.map((r, idx) => ({
            id: `${loadedUpTo + idx}`,
            values: r,
          }));

          // update the table data
          dispatch(
            baseTableActions.tableRegister(
              { data: [...state.data, ...tableData] },
              data.meta.totalRows
            )
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
      fetchData,
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
      onApplyBatchAction: actionId => {
        dispatch(baseTableActions.tableActionApply(actionId));
      },
      onApplySearch: string => {
        dispatch(baseTableActions.tableSearchApply(string));
      },
    },
    table: {
      onChangeSort: column => {
        dispatch(baseTableActions.tableColumnSort(column, columns));
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
      onApplyRowAction: (/* actionId, rowId */) => {},
      onRowClicked: (/* rowId */) => {},
    },
  };

  return (
    <Table
      id={id}
      columns={columns}
      data={state.data}
      view={state.view}
      actions={actions}
      options={{
        hasFilter: true,
        hasSearch: false,
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

AsyncTable.propTypes = {
  fetchData: PropTypes.func.isRequired,
  /** The unique id of the table */
  id: PropTypes.string,
};

AsyncTable.defaultProps = {
  id: 'AsyncTable',
};

export default AsyncTable;
