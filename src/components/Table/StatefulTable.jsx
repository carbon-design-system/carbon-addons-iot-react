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
  tableRowActionEdit,
  tableRowActionComplete,
  tableRowActionError,
  tableColumnResize,
} from './tableActionCreators';
import Table, { defaultProps } from './Table';

const callbackParent = (callback, ...args) => callback && callback(...args);

/** This component shares the exact same prop types as the Table component */
/* eslint-disable react/prop-types */
const StatefulTable = ({ data: initialData, expandedData, ...other }) => {
  const {
    id: tableId,
    columns: initialColumns,
    options: { hasUserViewManagement },
    options,
    view: {
      toolbar: { customToolbarContent },
      pagination: { totalItems },
    },
    view: initialState,
    actions: callbackActions,
    lightweight,
  } = merge({}, defaultProps({ data: initialData, ...other }), other);

  const [state, dispatch] = useReducer(tableReducer, {
    data: initialData,
    view: initialState,
    columns: initialColumns,
  });

  const isLoading = get(initialState, 'table.loadingState.isLoading');

  const {
    view,
    view: {
      table: { filteredData, selectedIds, sort },
    },
  } = state;

  const { pagination, toolbar, table, onUserViewModified } = callbackActions;

  // Need to initially sort and filter the tables data, but preserve the selectedId
  useDeepCompareEffect(
    () => {
      dispatch(
        tableRegister({
          data: initialData,
          isLoading,
          view: initialState,
          totalItems: pagination.totalItems || initialData.length,
          hasUserViewManagement,
        })
      );
    },
    [initialData, isLoading, initialState]
  );

  const columns = hasUserViewManagement ? state.columns : initialColumns;
  const initialDefaultSearch = state?.view?.toolbar?.initialDefaultSearch || '';

  const { onChangePage } = pagination || {};
  const {
    onApplyFilter,
    onToggleFilter,
    onShowRowEdit,
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
    onColumnResize,
    onOverflowItemClicked,
  } = table || {};

  const getRowAction = (data, actionId, rowId) => {
    let item;
    for (let idx = 0; idx < data.length; idx += 1) {
      const element = data[idx];
      if (element.id === rowId) {
        item = element.rowActions.find(action => action.id === actionId);
        if (item) {
          break;
        }
        if (Array.isArray(element?.children)) {
          item = getRowAction(element.children, actionId, rowId);
          if (item) {
            break;
          }
        }
      }
      if (Array.isArray(element?.children)) {
        item = getRowAction(element.children, actionId, rowId);
        if (item) {
          break;
        }
      }
    }
    return item;
  };

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
      onShowRowEdit: () => {
        dispatch(tableToolbarToggle('rowEdit'));
        callbackParent(onShowRowEdit, 'rowEdit');
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
        dispatch(tableSearchApply(string));
        callbackParent(onApplySearch, string);
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
        const action = state.data && getRowAction(state.data, actionId, rowId);

        dispatch(tableRowActionStart(rowId));
        try {
          await callbackParent(onApplyRowAction, actionId, rowId);
          if (action.isEdit) {
            dispatch(tableRowActionEdit(rowId));
          }
          dispatch(tableRowActionComplete(rowId));
        } catch (error) {
          dispatch(tableRowActionError(rowId, error));
        }
      },
      onClearRowError: rowId => {
        dispatch(tableRowActionComplete(rowId));
        callbackParent(onClearRowError, rowId);
      },
      onEmptyStateAction: onEmptyStateAction
        ? () =>
            // This action doesn't update our table state, it's up to the user
            callbackParent(onEmptyStateAction)
        : null,
      onChangeOrdering: ordering => {
        dispatch(tableColumnOrder(ordering));
        callbackParent(onChangeOrdering, ordering);
      },
      onColumnResize: resizedColumns => {
        // For backwards compatability we only update the state when hasUserViewManagement is active
        if (hasUserViewManagement) {
          dispatch(tableColumnResize(resizedColumns));
        }
        callbackParent(onColumnResize, resizedColumns);
      },
      onOverflowItemClicked: id => {
        callbackParent(onOverflowItemClicked, id);
      },
    },
    onUserViewModified: viewConfiguration => {
      callbackParent(onUserViewModified, viewConfiguration);
    },
  };

  const filteredCount = filteredData?.length || 0;
  const currentlyLoadedDataCount = state.data?.length || 0;

  const filteredTotalItems =
    filteredCount && filteredCount !== currentlyLoadedDataCount
      ? filteredCount
      : totalItems || currentlyLoadedDataCount;

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
        toolbar: {
          ...view?.toolbar,
          search: {
            ...view?.toolbar?.search,
            defaultValue: initialDefaultSearch,
          },
          customToolbarContent,
        },
        pagination: {
          ...view.pagination,
          totalItems: filteredTotalItems,
        },
      }}
      actions={actions}
      lightweight={lightweight}
    />
  ) : null;
};

export default StatefulTable;
