import update from 'immutability-helper';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import find from 'lodash/find';

import { getSortedData, caseInsensitiveSearch } from '../../utils/componentUtilityFunctions';

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
  TABLE_ROW_ACTION_EDIT,
  TABLE_ROW_ACTION_COMPLETE,
  TABLE_ROW_ACTION_ERROR,
  TABLE_COLUMN_ORDER,
  TABLE_REGISTER,
  TABLE_SEARCH_APPLY,
} from './tableActionCreators';
import { baseTableReducer } from './baseTableReducer';

/**
 * Default function to compare value 1 and 2
 * @param {*} value1, filter value
 * @param {*} value2, actual
 * returns true if value1 contains value2 for strings, and true if value1 === value2 for numbers
 */
export const defaultComparison = (value1, value2) =>
  !isNil(value1) && typeof value1 === 'number' // only if the column value filter is not null/undefined
    ? value1 === value2 // type number do a direct comparison
    : value1 && // type string do a lowercase includes comparison
      value1.toString &&
      caseInsensitiveSearch([value1.toString()], value2.toString());

/**
 * Little utility to filter data
 * @param {Array<Object>} data data to filter
 * @param {Array<{columnId: string, value: any}>} filters
 * @param {Array<Object>} columns AKA headers
 */
export const filterData = (data, filters, columns) => {
  return !filters || filters.length === 0
    ? data
    : data.filter(({ values }) =>
        // return false if a value doesn't match a valid filter
        filters.reduce((acc, { columnId, value }) => {
          if (
            typeof value === 'number' ||
            typeof value === 'string' ||
            typeof value === 'boolean'
          ) {
            if (!isNil(columns)) {
              const { filter } = find(columns, { id: columnId }) || {};
              const filterFunction = filter?.filterFunction;
              return (
                acc &&
                (filterFunction
                  ? filterFunction(values[columnId], value)
                  : defaultComparison(values[columnId], value))
              );
            }
            return acc && defaultComparison(values[columnId], value);
          }
          return false;
        }, true)
      );
};

// Little utility to search
export const searchData = (data, searchString) =>
  searchString && searchString !== ''
    ? data.filter((
        { values } // globally check row values for a match
      ) =>
        // eslint-disable-next-line array-callback-return, consistent-return
        Object.values(values).find(value => {
          if (
            typeof value === 'number' ||
            typeof value === 'string' ||
            typeof value === 'boolean'
          ) {
            if (!isNil(value)) {
              return caseInsensitiveSearch([value.toString()], searchString.toString());
            }
          }
        })
      )
    : data;

export const getCustomColumnSort = (columns, columnId) => {
  const currentlySortedColumn =
    columnId && columns && columns.find(column => column.id === columnId);
  return currentlySortedColumn && currentlySortedColumn.sortFunction; // see if there's a custom sort function passed
};

// little utility to both sort and filter
export const filterSearchAndSort = (data, sort = {}, search = {}, filters = [], columns) => {
  const { columnId, direction } = sort;

  const { value: searchValue } = search;
  const filteredData = filterData(data, filters, columns);
  const searchedData =
    searchValue && searchValue !== '' ? searchData(filteredData, searchValue) : filteredData;
  return !isEmpty(sort)
    ? getCustomColumnSort(columns, columnId)
      ? getCustomColumnSort(columns, columnId)({ data: searchedData, columnId, direction })
      : getSortedData(searchedData, columnId, direction)
    : searchedData;
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
                  newFilters,
                  get(state, 'columns')
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
                  [],
                  get(state, 'columns')
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
        get(state, 'view.filters'),
        get(state, 'columns')
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

      const customColumnSort = getCustomColumnSort(get(state, 'columns'), columnId);

      return baseTableReducer(
        update(state, {
          view: {
            table: {
              filteredData: {
                $set:
                  nextSortDir !== 'NONE'
                    ? customColumnSort // if there's a custom column sort apply it
                      ? customColumnSort({
                          data: state.view.table.filteredData || state.data,
                          columnId,
                          direction: nextSortDir,
                        })
                      : getSortedData(
                          state.view.table.filteredData || state.data,
                          columnId,
                          nextSortDir,
                          isTimestampColumn
                        )
                    : filterData(state.data, state.view.filters, state.columns), // reset to original filters
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
      const paginationFromState = get(state, 'view.pagination');
      // update the column ordering if I'm passed new columns
      const ordering = get(view, 'table.ordering') || get(state, 'view.table.ordering');
      const pagination = get(state, 'view.pagination')
        ? {
            totalItems: { $set: totalItems || updatedData.length },
            pageSize: { $set: paginationFromState.pageSize || pageSize },
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
            ordering: { $set: ordering },
            filteredData: {
              $set: filterSearchAndSort(
                updatedData,
                get(state, 'view.table.sort'),
                get(state, 'view.toolbar.search'),
                get(state, 'view.filters'),
                get(state, 'columns')
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
    case TABLE_ROW_ACTION_EDIT:
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
