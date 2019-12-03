import React, { useReducer } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import merge from 'lodash/merge';
import get from 'lodash/get';

import { tableReducer } from './tableReducer';
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
  tableRowActionStart,
  tableRowActionComplete,
  tableRowActionError,
} from './tableActionCreators';
import Table, { defaultProps } from './Table';

const callbackParent = (callback, ...args) => callback && callback(...args);

/** This component shares the exact same prop types as the Table component */
/* eslint-disable react/prop-types */
const StatefulTable = ({ data: initialData, expandedData, ...other }) => {
  const {
    id: tableId,
    columns,
    options,
    view: initialState,
    actions: callbackActions,
    lightweight,
  } = merge({}, defaultProps({ data: initialData, ...other }), other);
  const [state, dispatch] = useReducer(tableReducer, {
    data: initialData,
    view: initialState,
  });
  const isLoading = get(initialState, 'table.loadingState.isLoading');
  // Need to initially sort and filter the tables data, but preserve the selectedId
  useDeepCompareEffect(
    () => {
      dispatch(
        tableRegister({
          data: initialData,
          isLoading,
          view: initialState,
          totalItems: initialData.length,
        })
      );
    },
    [initialData, isLoading, initialState]
  );

  const {
    view,
    view: {
      table: { filteredData, selectedIds, sort },
    },
  } = state;

  const { pagination, toolbar, table } = callbackActions;
  const { onChangePage } = pagination || {};
  const {
    onApplyFilter,
    onToggleFilter,
    onToggleColumnSelection,
    onClearAllFilters,
    onCancelBatchAction,
    onApplyBatchAction,
    onApplySearch,
    onDownloadCSV,
  } = toolbar || {};
  const {
    onChangeSort,
    onRowSelected,
    onRowClicked,
    onSelectAll,
    onRowExpanded,
    onApplyRowAction,
    onClearRowError,
    onEmptyStateAction,
    onChangeOrdering,
  } = table || {};

  // In addition to updating the store, I always callback to the parent in case they want to do something
  const actions = {
    pagination: {
      onChangePage: paginationValues => {
        dispatch(tablePageChange(paginationValues));
        callbackParent(onChangePage, paginationValues);
      },
    },
    toolbar: {
      onApplyFilter: filterValues => {
        dispatch(tableFilterApply(filterValues));
        callbackParent(onApplyFilter, filterValues);
      },
      onToggleFilter: () => {
        dispatch(tableToolbarToggle('filter'));
        callbackParent(onToggleFilter, 'filter');
      },
      onToggleColumnSelection: () => {
        dispatch(tableToolbarToggle('column'));
        callbackParent(onToggleColumnSelection, 'column');
      },
      onClearAllFilters: () => {
        dispatch(tableFilterClear());
        callbackParent(onClearAllFilters);
      },
      onCancelBatchAction: () => {
        dispatch(tableActionCancel());
        callbackParent(onCancelBatchAction);
      },
      onApplyBatchAction: id => {
        dispatch(tableActionApply(id));
        callbackParent(onApplyBatchAction, id, selectedIds);
      },
      onApplySearch: string => {
        callbackParent(onApplySearch, string);
        dispatch(tableSearchApply(string));
      },
      onDownloadCSV,
    },
    table: {
      onChangeSort: column => {
        const sortDirection = sort ? sort.direction : undefined;
        dispatch(tableColumnSort(column, columns));
        callbackParent(onChangeSort, column, sortDirection);
      },
      onRowSelected: (rowId, isSelected) => {
        dispatch(tableRowSelect(rowId, isSelected, options.hasRowSelection));
        callbackParent(onRowSelected, rowId, isSelected);
      },
      onRowClicked: rowId => {
        // This action doesn't update our table state, it's up to the user
        callbackParent(onRowClicked, rowId);
      },
      onSelectAll: isSelected => {
        dispatch(tableRowSelectAll(isSelected));
        callbackParent(onSelectAll, isSelected);
      },
      onRowExpanded: (rowId, isExpanded) => {
        dispatch(tableRowExpand(rowId, isExpanded));
        callbackParent(onRowExpanded, rowId, isExpanded);
      },
      onApplyRowAction: async (actionId, rowId) => {
        dispatch(tableRowActionStart(rowId));
        try {
          await callbackParent(onApplyRowAction, actionId, rowId);
          dispatch(tableRowActionComplete(rowId));
        } catch (error) {
          dispatch(tableRowActionError(rowId, error));
        }
      },
      onClearRowError: rowId => {
        dispatch(tableRowActionComplete(rowId));
        callbackParent(onClearRowError, rowId);
      },
      onEmptyStateAction: () =>
        // This action doesn't update our table state, it's up to the user
        callbackParent(onEmptyStateAction),
      onChangeOrdering: ordering => {
        dispatch(tableColumnOrder(ordering));
        callbackParent(onChangeOrdering, ordering);
      },
    },
  };
  return filteredData ? (
    <Table
      {...other} // need to passthrough all other props
      id={tableId}
      columns={columns}
      data={filteredData}
      expandedData={expandedData}
      options={options}
      view={{
        ...view,
        pagination: {
          ...view.pagination,
          totalItems: filteredData.length,
        },
      }}
      actions={actions}
      lightweight={lightweight}
    />
  ) : null;
};

export default StatefulTable;
