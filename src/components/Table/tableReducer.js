import update from 'immutability-helper';
import isNil from 'lodash/isNil';

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
} from './tableActionCreators';

// Little utility to filter data
const filterData = (data, filters) =>
  data.filter(({ values }) =>
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

export const tableReducer = (state = {}, action) => {
  switch (action.type) {
    // Page Actions
    case TABLE_PAGE_CHANGE: {
      const { pageSize, totalItems, page: currentPage } = state.view.pagination;
      const { page } = action.payload;
      return page !== currentPage && page <= totalItems / pageSize
        ? update(state, {
            view: {
              pagination: {
                $merge: action.payload,
              },
            },
          })
        : state;
    }
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

      return update(state, {
        view: {
          filters: {
            $set: newFilters,
          },
          pagination: {
            page: { $set: 1 },
          },
          table: {
            filteredData: {
              $set: filterData(state.data, newFilters),
            },
          },
        },
      });
    }
    case TABLE_FILTER_CLEAR:
      return update(state, {
        view: {
          filters: {
            $set: [],
          },
          pagination: {
            page: { $set: 1 },
          },
          table: {
            filteredData: {
              $set: state.data,
            },
          },
        },
      });
    // Toolbar Actions
    case TABLE_TOOLBAR_TOGGLE: {
      const filterToggled = state.view.toolbar.activeBar === action.payload ? null : action.payload;
      return update(state, {
        view: {
          toolbar: {
            activeBar: {
              $set: filterToggled,
            },
          },
        },
      });
    }
    // Batch Actions
    case TABLE_ACTION_CANCEL:
      return update(state, {
        view: {
          table: {
            selectedIds: { $set: [] },
            isSelectAllSelected: { $set: false },
            isSelectAllIndeterminate: { $set: false },
          },
        },
      });
    case TABLE_ACTION_APPLY: {
      const { filteredData } = state.view.table;
      const data = filteredData || state.data;
      // No matter what clear selections
      const clearedSelections = update(state, {
        view: {
          table: {
            selectedIds: { $set: [] },
            isSelectAllSelected: { $set: false },
            isSelectAllIndeterminate: { $set: false },
          },
        },
      });
      // only update the data and filtered data if deleted
      if (action.payload === 'delete') {
        return update(clearedSelections, {
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
        });
      }
      return clearedSelections;
    }
    // Column operations
    case TABLE_COLUMN_SORT: {
      // TODO should check that columnId actually is valid
      const columnId = action.payload;
      const sorts = ['NONE', 'ASC', 'DESC'];
      const currentSort = state.view.table.sort;
      const currentSortDir =
        currentSort && currentSort.columnId === columnId ? state.view.table.sort.direction : 'NONE';
      const nextSortDir = sorts[(sorts.findIndex(i => i === currentSortDir) + 1) % sorts.length];
      return update(state, {
        view: {
          table: {
            sort: {
              $set:
                nextSortDir === 'NONE'
                  ? undefined
                  : {
                      columnId: action.payload,
                      direction: nextSortDir,
                    },
            },
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
      });
    }
    case TABLE_COLUMN_ORDER:
      return update(state, {
        view: {
          table: {
            ordering: { $set: action.payload },
          },
        },
      });
    // Row operations
    case TABLE_ROW_SELECT: {
      const { rowId, isSelected } = action.payload;
      const { filteredData } = state.view.table;
      const data = filteredData || state.data;
      const isClearing = !isSelected && state.view.table.selectedIds.length <= 1;
      const isSelectingAll = isSelected && state.view.table.selectedIds.length + 1 === data.length;
      return update(state, {
        view: {
          table: {
            selectedIds: {
              $set: isSelected
                ? state.view.table.selectedIds.concat([rowId])
                : state.view.table.selectedIds.filter(i => i !== rowId),
            },
            isSelectAllIndeterminate: {
              $set: !(isClearing || isSelectingAll),
            },
            isSelectAllSelected: {
              $set: isSelectingAll,
            },
          },
        },
      });
    }
    case TABLE_ROW_SELECT_ALL: {
      const { filteredData } = state.view.table;
      const data = filteredData || state.data;
      const { isSelected } = action.payload;
      return update(state, {
        view: {
          table: {
            isSelectAllSelected: {
              $set: isSelected,
            },
            selectedIds: {
              $set: isSelected && data ? data.map(i => i.id) : [],
            },
            isSelectAllIndeterminate: {
              $set: false,
            },
          },
        },
      });
    }
    case TABLE_ROW_EXPAND: {
      const { rowId, isExpanded } = action.payload;
      return update(state, {
        view: {
          table: {
            expandedIds: {
              $set: isExpanded
                ? state.view.table.expandedIds.concat([rowId])
                : state.view.table.expandedIds.filter(i => i !== rowId),
            },
          },
        },
      });
    }
    // By default we need to setup our sorted and filteredData
    case TABLE_REGISTER: {
      const { columnId, direction } = state.view.table.sort || {};
      const filteredData = filterData(state.data, state.view.filters);
      return update(state, {
        view: {
          table: {
            filteredData: {
              $set: columnId ? getSortedData(filteredData, columnId, direction) : filteredData,
            },
          },
        },
      });
    }
    default:
      return state;
  }
};
