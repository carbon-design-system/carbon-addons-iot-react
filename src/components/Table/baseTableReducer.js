import update from 'immutability-helper';

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
  TABLE_ROW_ACTION_START,
  TABLE_ROW_ACTION_COMPLETE,
  TABLE_ROW_ACTION_ERROR,
  TABLE_ROW_EXPAND,
  TABLE_COLUMN_ORDER,
  TABLE_SEARCH_APPLY,
  TABLE_LOADING_SET,
} from './tableActionCreators';

export const baseTableReducer = (state = {}, action) => {
  // To support instance matching (i.e. multiple table states in one store), just ensure
  // that a instanceId is provided on state passed to baseTableReducer.  If no instanceId
  // is provided, all matching actions will be processed by this table reducer.
  if (typeof action.instanceId === 'string' && action.instanceId !== state.instanceId) {
    return state;
  }

  switch (action.type) {
    // Page Actions
    case TABLE_PAGE_CHANGE: {
      const { pageSize: currentPageSize, totalItems, page: currentPage } = state.view.pagination;
      const { page, pageSize } = action.payload;
      const isPageSizeChange = pageSize && currentPageSize !== pageSize;
      const maxPage = Math.ceil(totalItems / pageSize);
      const isPageChange = page !== currentPage && page <= maxPage;
      const newPagination = isPageSizeChange
        ? {
            ...state.view.pagination,
            ...action.payload,
            page: 1,
          }
        : isPageChange
        ? {
            ...state.view.pagination,
            ...action.payload,
          }
        : state.view.pagination;
      const result = update(state, {
        view: {
          pagination: {
            $set: newPagination,
          },
        },
      });
      return result;
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
        },
      });
    case TABLE_SEARCH_APPLY: {
      return update(state, {
        view: {
          toolbar: {
            search: {
              $set: {
                value: action.payload,
              },
            },
          },
          pagination: {
            page: { $set: 1 },
          },
        },
      });
    }
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
      return update(state, {
        view: {
          table: {
            selectedIds: { $set: [] },
            isSelectAllSelected: { $set: false },
            isSelectAllIndeterminate: { $set: false },
          },
        },
      });
    }
    // Row Actions
    case TABLE_ROW_ACTION_START:
      return update(state, {
        view: {
          table: {
            // add the in progress row
            rowActions: { $push: [{ rowId: action.payload, isRunning: true }] },
          },
        },
      });
    case TABLE_ROW_ACTION_COMPLETE: {
      const index = state.view.table.rowActions.findIndex(
        rowAction => rowAction.rowId === action.payload
      );
      return update(state, {
        view: {
          table: {
            // remove the finished row
            rowActions: { $splice: [[index, 1]] },
          },
        },
      });
    }
    case TABLE_ROW_ACTION_ERROR: {
      const index = state.view.table.rowActions.findIndex(
        rowAction => rowAction.rowId === action.payload
      );
      return update(state, {
        view: {
          table: {
            // replace the row with the error
            rowActions: { $splice: [[index, 1, { rowId: action.payload, error: action.error }]] },
          },
        },
      });
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
      const { rowId, isSelected, hasRowSelection } = action.payload;
      const isClearing =
        hasRowSelection === 'multi' && !isSelected && state.view.table.selectedIds.length <= 1;
      const isSelectingAll =
        hasRowSelection === 'multi' &&
        isSelected &&
        state.view.table.selectedIds.length + 1 === state.data.length;

      // multi-select should add to the array. single-select should only allow one at a time, so replace the array
      const addOrReplace =
        hasRowSelection === 'multi' ? state.view.table.selectedIds.concat([rowId]) : [rowId];
      return update(state, {
        view: {
          table: {
            selectedIds: {
              $set: isSelected
                ? addOrReplace
                : state.view.table.selectedIds.filter(i => i !== rowId),
            },
            isSelectAllIndeterminate: {
              $set: !(hasRowSelection === 'multi' && (isClearing || isSelectingAll)),
            },
            isSelectAllSelected: {
              $set: isSelectingAll,
            },
          },
        },
      });
    }
    case TABLE_ROW_SELECT_ALL: {
      const { isSelected } = action.payload;
      return update(state, {
        view: {
          table: {
            isSelectAllSelected: {
              $set: isSelected,
            },
            //
            selectedIds: {
              $set: isSelected ? state.data.map(i => i.isSelectable !== false && i.id) : [],
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
    case TABLE_LOADING_SET: {
      const { isLoading, rowCount } = action.payload;
      return update(state, {
        view: {
          table: {
            loadingState: {
              isLoading: { $set: isLoading },
              rowCount: { $set: rowCount },
            },
          },
        },
      });
    }
    default:
      return state;
  }
};
