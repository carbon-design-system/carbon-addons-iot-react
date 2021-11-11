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
  TABLE_ROW_ACTION_EDIT,
  TABLE_ROW_ACTION_COMPLETE,
  TABLE_ROW_ACTION_ERROR,
  TABLE_ROW_EXPAND,
  TABLE_COLUMN_ORDER,
  TABLE_SEARCH_APPLY,
  TABLE_LOADING_SET,
  TABLE_COLUMN_RESIZE,
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
        .filter((i) => i);

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
                defaultValue: action.payload,
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
    case TABLE_ROW_ACTION_EDIT:
      return update(state, {
        view: {
          table: {
            // mark the row as being in edit mode
            rowActions: {
              $push: [{ rowId: action.payload, isEditMode: true }],
            },
          },
        },
      });
    case TABLE_ROW_ACTION_COMPLETE: {
      const index = state.view.table.rowActions.findIndex(
        (rowAction) => rowAction.rowId === action.payload
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
        (rowAction) => rowAction.rowId === action.payload
      );
      return update(state, {
        view: {
          table: {
            // replace the row with the error
            rowActions: {
              $splice: [[index, 1, { rowId: action.payload, error: action.error }]],
            },
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
      const isInMultiSort =
        Array.isArray(currentSort) && currentSort.some((column) => column.columnId === columnId);
      const currentSortDir = isInMultiSort
        ? currentSort.find((sort) => sort.columnId === columnId).direction
        : currentSort && currentSort.columnId === columnId
        ? currentSort.direction
        : 'NONE';
      const nextSortDir = isInMultiSort
        ? currentSortDir === 'ASC'
          ? 'DESC'
          : 'ASC'
        : sorts[(sorts.findIndex((i) => i === currentSortDir) + 1) % sorts.length];

      let sort;
      if (isInMultiSort) {
        sort = currentSort.reduce((carry, column) => {
          if (column.columnId === columnId) {
            return [...carry, { ...column, direction: nextSortDir }];
          }

          return [...carry, column];
        }, []);
      } else {
        sort =
          nextSortDir === 'NONE'
            ? undefined
            : {
                columnId: action.payload,
                direction: nextSortDir,
              };
      }
      return update(state, {
        view: {
          table: {
            sort: {
              $set: sort,
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

    case TABLE_COLUMN_RESIZE:
      return update(state, { columns: { $set: action.payload } });

    // Row operations
    case TABLE_ROW_SELECT: {
      const { selectedIds, hasRowSelection } = action.payload;
      const isMultiSelect = hasRowSelection === 'multi';
      const isClearing = isMultiSelect && selectedIds.length === 0;
      const isSelectingAll = isMultiSelect && selectedIds.length === state.data.length;

      return update(state, {
        view: {
          table: {
            selectedIds: {
              $set: selectedIds,
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
      const { isSelected } = action.payload;
      return update(state, {
        view: {
          table: {
            isSelectAllSelected: {
              $set: isSelected,
            },
            selectedIds: {
              $set: isSelected
                ? state.data.filter((i) => i.isSelectable !== false).map((i) => i.id)
                : [],
            },
            isSelectAllIndeterminate: {
              $set: false,
            },
          },
        },
      });
    }
    case TABLE_ROW_EXPAND: {
      const { rowId, isExpanded, options } = action.payload;
      return update(state, {
        view: {
          table: {
            expandedIds: {
              $set: isExpanded
                ? options?.expandRowsExclusively
                  ? [rowId]
                  : state.view.table.expandedIds.concat([rowId])
                : state.view.table.expandedIds.filter((i) => i !== rowId),
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
