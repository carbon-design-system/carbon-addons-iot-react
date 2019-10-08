import update from 'immutability-helper';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

import { getSortedData } from '../../utils/componentUtilityFunctions';

import {
  TABLE_PAGE_CHANGE,
  TABLE_FILTER_APPLY,
  TABLE_TOOLBAR_TOGGLE,
  TABLE_FILTER_CLEAR,
  TABLE_ACTION_CANCEL,
  TABLE_ACTION_APPLY,
  TABLE_COLUMN_SORT,
  TABLE_ROW_SELECT,
  TABLE_ROW_SELECT_ALL,
  TABLE_ROW_EXPAND,
  TABLE_ROW_ACTION_START,
  TABLE_ROW_ACTION_COMPLETE,
  TABLE_ROW_ACTION_ERROR,
  TABLE_COLUMN_ORDER,
  TABLE_REGISTER,
  TABLE_SEARCH_APPLY,
} from './tableActionCreators';
import { baseTableReducer } from './baseTableReducer';

// Little utility to filter data
export const filterData = (data, filters) =>
  !filters || filters.length === 0
    ? data
    : data.filter(({ values }) =>
        // return false if a value doesn't match a valid filter
        // TODO Currently assumes every value has a toString method, need to support filtering on custom cell contents
        filters.reduce(
          (acc, { columnId, value }) =>
            acc &&
            (!isNil(values[columnId]) && // only if the values is not null/undefined
              values[columnId] &&
              values[columnId].toString &&
              values[columnId]
                .toString()
                .toLowerCase()
                .includes(value.toString().toLowerCase())),
          true
        )
      );
// Little utility to search

export const searchData = (data, searchString) =>
  searchString && searchString !== ''
    ? data.filter((
        { values } // globally check row values for a match
      ) =>
        Object.values(values).find(
          value =>
            !isNil(value) &&
            value.toString &&
            value
              .toString() // case insensitive search
              .toLowerCase()
              .includes(searchString.toString().toLowerCase())
        )
      )
    : data;

// little utility to both sort and filter
export const filterSearchAndSort = (data, sort = {}, search = {}, filters = []) => {
  const { columnId, direction } = sort;
  const { value: searchValue } = search;
  const filteredData = filterData(data, filters);
  const searchedData =
    searchValue && searchValue !== '' ? searchData(filteredData, searchValue) : filteredData;
  return !isEmpty(sort) ? getSortedData(searchedData, columnId, direction) : searchedData;
};

/** This reducer handles sort, filter and search that needs data otherwise it proxies for the baseTableReducer */
export const tableReducer = (state = {}, action) => {
  switch (action.type) {
    // Filter Actions
    case TABLE_FILTER_APPLY: {
      const newFilters = Object.entries(action.payload)
        .map(([key, value]) =>
          value !== ''
            ? {
                columnId: key,
                value,
              }
            : null
        )
        .filter(i => i);

      return baseTableReducer(
        update(state, {
          view: {
            table: {
              filteredData: {
                $set: filterSearchAndSort(
                  state.data,
                  get(state, 'view.table.sort'),
                  get(state, 'view.toolbar.search'),
                  newFilters
                ),
              },
            },
          },
        }),
        action
      );
    }
    case TABLE_FILTER_CLEAR:
      return baseTableReducer(
        update(state, {
          view: {
            table: {
              filteredData: {
                $set: filterSearchAndSort(
                  state.data,
                  get(state, 'view.table.sort'),
                  get(state, 'view.toolbar.search'),
                  []
                ),
              },
            },
          },
        }),
        action
      );
    case TABLE_SEARCH_APPLY: {
      // Quick search should search within the filtered and sorted data
      const data = filterSearchAndSort(
        state.data,
        get(state, 'view.table.sort'),
        { value: action.payload },
        get(state, 'view.filters')
      );
      return baseTableReducer(
        update(state, {
          view: {
            table: {
              filteredData: {
                $set: data,
              },
            },
          },
        }),
        action
      );
    }

    // Batch Actions
    case TABLE_ACTION_CANCEL:
      return baseTableReducer(state, action);
    case TABLE_ACTION_APPLY: {
      const { filteredData } = state.view.table;
      const data = filteredData || state.data;
      // only update the data and filtered data if deleted
      if (action.payload === 'delete') {
        return baseTableReducer(
          update(state, {
            data: {
              $set: state.data.filter(i => !state.view.table.selectedIds.includes(i.id)),
            },
            view: {
              table: {
                filteredData: {
                  $set: data.filter(i => !state.view.table.selectedIds.includes(i.id)),
                },
              },
            },
          }),
          action
        );
      }
      return baseTableReducer(state, action);
    }
    // Column operations
    case TABLE_COLUMN_SORT: {
      // TODO should check that columnId actually is valid
      const columnId = action.payload;
      const sorts = ['NONE', 'ASC', 'DESC'];
      const currentSort = get(state, 'view.table.sort');
      const currentSortDir =
        currentSort && currentSort.columnId === columnId ? currentSort.direction : 'NONE';

      const nextSortDir = sorts[(sorts.findIndex(i => i === currentSortDir) + 1) % sorts.length];

      // validate if there is any column of timestamp type
      const isTimestampColumn =
        action.columns &&
        action.columns.filter(column => column.id === columnId && column.type === 'TIMESTAMP')
          .length > 0;

      return baseTableReducer(
        update(state, {
          view: {
            table: {
              filteredData: {
                $set:
                  nextSortDir !== 'NONE'
                    ? getSortedData(
                        state.view.table.filteredData || state.data,
                        columnId,
                        nextSortDir,
                        isTimestampColumn
                      )
                    : filterData(state.data, state.view.filters), // reset to original filters
              },
            },
          },
        }),
        action
      );
    }

    case TABLE_ROW_SELECT: {
      const data = state.view.table.filteredData || state.data;
      return baseTableReducer({ ...state, data }, action);
    }
    case TABLE_ROW_SELECT_ALL: {
      const data = state.view.table.filteredData || state.data;
      return baseTableReducer({ ...state, data }, action);
    }
    // By default we need to setup our sorted and filteredData and turn off the loading state
    case TABLE_REGISTER: {
      const updatedData = action.payload.data || state.data;
      const { view, totalItems } = action.payload;
      const { pageSize, pageSizes } = get(view, 'pagination') || {};
      const pagination = get(state, 'view.pagination')
        ? {
            totalItems: { $set: totalItems || updatedData.length },
            pageSize: { $set: pageSize },
            pageSizes: { $set: pageSizes },
          }
        : {};
      return update(state, {
        data: {
          $set: updatedData,
        },
        view: {
          pagination,
          table: {
            filteredData: {
              $set: filterSearchAndSort(
                updatedData,
                get(state, 'view.table.sort'),
                get(state, 'view.toolbar.search'),
                get(state, 'view.filters')
              ),
            },
            loadingState: {
              $set: {
                isLoading: action.payload.isLoading,
                rowCount: updatedData ? updatedData.length : 0,
              },
            },
            // Reset the selection to the previous values
            selectedIds: {
              $set: view ? view.table.selectedIds : [],
            },
            isSelectAllIndeterminate: {
              $set: view ? view.table.isSelectAllIndeterminate : false,
            },
            isSelectAllSelected: {
              $set: view ? view.table.isSelectAllSelected : false,
            },
          },
        },
      });
    }
    // Actions that are handled by the base reducer
    case TABLE_PAGE_CHANGE:
    case TABLE_ROW_ACTION_START:
    case TABLE_ROW_ACTION_COMPLETE:
    case TABLE_ROW_ACTION_ERROR:
    case TABLE_TOOLBAR_TOGGLE:
    case TABLE_COLUMN_ORDER:
    case TABLE_ROW_EXPAND:
      return baseTableReducer(state, action);
    default:
      return state;
  }
};
