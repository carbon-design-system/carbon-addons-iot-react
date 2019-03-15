import update from 'immutability-helper';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';

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
  TABLE_COLUMN_ORDER,
  TABLE_REGISTER,
  TABLE_SEARCH_APPLY,
} from './tableActionCreators';
import { baseTableReducer } from './baseTableReducer';

// Little utility to filter data
const filterData = (data, filters) =>
  !filters || filters.length === 0
    ? data
    : data.filter(({ values }) =>
        // return false if a value doesn't match a valid filter
        // TODO Currently assumes every value has a toString method, need to support filtering on custom cell contents
        filters.reduce(
          (acc, { columnId, value }) =>
            acc &&
            ((values[columnId] &&
              values[columnId].toString &&
              values[columnId].toString().includes(value)) ||
              isNil(values[columnId])), // If passed an invalid column keep going)
          true
        )
      );
// Little utility to search
const searchData = (data, searchString) =>
  data.filter((
    { values } // globally check row values for a match
  ) =>
    Object.values(values).find(value => value.toString && value.toString().includes(searchString))
  );

// little utility to both sort and filter
const filterSearchAndSort = (data, sort = {}, search = {}, filters) => {
  const { columnId, direction } = sort;
  const { value: searchValue } = search;
  const filteredData = filterData(data, filters);
  const searchedData =
    searchValue && searchValue !== '' ? searchData(filteredData, searchValue) : filteredData;
  return !isEmpty(sort) ? getSortedData(searchedData, columnId, direction) : searchedData;
};

export const tableReducer = (state = {}, action) => {
  switch (action.type) {
    // Page Actions
    case TABLE_PAGE_CHANGE:
      return baseTableReducer(state, action);
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
                  state.view.table && state.view.table.sort ? state.view.table.sort : undefined,
                  state.view.toolbar && state.view.toolbar.search
                    ? state.view.toolbar.search
                    : null,
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
                  state.view.table && state.view.table.sort ? state.view.table.sort : undefined,
                  state.view.toolbar && state.view.toolbar.search
                    ? state.view.toolbar.search
                    : null,
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
        state.view.table && state.view.table.sort ? state.view.table.sort : undefined,
        { value: action.payload },
        state.view.filters
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
    // Toolbar Actions
    case TABLE_TOOLBAR_TOGGLE:
      return baseTableReducer(state, action);
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
      const currentSort =
        state.view.table && state.view.table.sort ? state.view.table.sort : undefined;
      const currentSortDir =
        currentSort && currentSort.columnId === columnId ? state.view.table.sort.direction : 'NONE';
      const nextSortDir = sorts[(sorts.findIndex(i => i === currentSortDir) + 1) % sorts.length];
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
                        nextSortDir
                      )
                    : filterData(state.data, state.view.filters), // reset to original filters
              },
            },
          },
        }),
        action
      );
    }
    case TABLE_COLUMN_ORDER:
      return baseTableReducer(state, action);
    case TABLE_ROW_SELECT: {
      const data = state.view.table.filteredData || state.data;
      return baseTableReducer({ ...state, data }, action);
    }
    case TABLE_ROW_SELECT_ALL: {
      const data = state.view.table.filteredData || state.data;
      return baseTableReducer({ ...state, data }, action);
    }
    case TABLE_ROW_EXPAND:
      return baseTableReducer(state, action);
    // By default we need to setup our sorted and filteredData
    case TABLE_REGISTER: {
      return update(state, {
        view: {
          table: {
            filteredData: {
              $set: filterSearchAndSort(
                state.data,
                state.view.table && state.view.table.sort ? state.view.table.sort : undefined,
                state.view.toolbar && state.view.toolbar.search ? state.view.toolbar.search : null,
                state.view.filters
              ),
            },
          },
        },
      });
    }
    default:
      return state;
  }
};
