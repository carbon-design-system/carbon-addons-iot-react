import update from 'immutability-helper';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import find from 'lodash/find';
import { firstBy } from 'thenby';

import {
  getSortedData,
  caseInsensitiveSearch,
  sortTableData,
} from '../../utils/componentUtilityFunctions';

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
  TABLE_COLUMN_RESIZE,
  TABLE_REGISTER,
  TABLE_SEARCH_APPLY,
  TABLE_ADVANCED_FILTER_REMOVE,
  TABLE_ADVANCED_FILTER_CHANGE,
  TABLE_ADVANCED_FILTER_CREATE,
  TABLE_ADVANCED_FILTER_TOGGLE,
  TABLE_ADVANCED_FILTER_CANCEL,
  TABLE_ADVANCED_FILTER_APPLY,
  TABLE_TOGGLE_AGGREGATIONS,
  TABLE_MULTI_SORT_TOGGLE_MODAL,
  TABLE_MULTI_SORT_SAVE,
  TABLE_MULTI_SORT_CANCEL,
  TABLE_MULTI_SORT_ADD_COLUMN,
  TABLE_MULTI_SORT_REMOVE_COLUMN,
  TABLE_MULTI_SORT_CLEAR,
  TABLE_ROW_LOAD_MORE,
} from './tableActionCreators';
import { baseTableReducer } from './baseTableReducer';
import { findRow } from './tableUtilities';

/**
 * Default function to compare value 1 and 2
 * @param {*} value1, filter value
 * @param {*} value2, actual
 * returns true if value1 contains value2 for strings, and true if value1 === value2 for numbers
 */
export const defaultComparison = (value1, value2) =>
  !isNil(value1) && typeof value1 === 'number' // only if the column value filter is not null/undefined
    ? value1 === Number(value2) // for a number type, attempt to convert filter to number and direct compare
    : !isNil(value1) && // type string do a lowercase includes comparison
      caseInsensitiveSearch([value1?.toString()], value2?.toString());

export const runSimpleFilters = (data, filters, columns) => {
  return data.filter(({ values }) =>
    // return false if a value doesn't match a valid filter
    filters.reduce((acc, { columnId, value }) => {
      if (
        typeof value === 'number' ||
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        Array.isArray(value)
      ) {
        if (!isNil(columns)) {
          const { filter } = find(columns, { id: columnId }) || {};
          const filterFunction = filter?.filterFunction;
          if (Array.isArray(value) && !isEmpty(value)) {
            return (
              acc &&
              (filterFunction
                ? filterFunction(values[columnId], value)
                : value.includes(values[columnId]))
            );
          }
          return (
            acc &&
            (filterFunction
              ? filterFunction(values[columnId], value)
              : defaultComparison(values[columnId], value))
          );
        }
        if (Array.isArray(value) && !isEmpty(value)) {
          return acc && value.includes(values[columnId]);
        }
        return acc && defaultComparison(values[columnId], value);
      }
      return false;
    }, true)
  );
};

const operands = {
  NEQ: (a, b) => a !== b,
  LT: (a, b) => a < b,
  LTOET: (a, b) => a <= b,
  EQ: (a, b) => a === b,
  GTOET: (a, b) => a >= b,
  GT: (a, b) => a > b,
  CONTAINS: (a, b) => a.includes(b),
};

/**
 * Recursively check each rule and determine if it's a normal rule or a ruleGroup.
 * If it's a group dig deeper into the tree passing the values and logic down as we go.
 * If it's a normal rule just run `every` on all the rules for 'ALL' logic and `some`
 * for 'ANY' logic.
 *
 * @param {string} logic 'ALL' or 'ANY'
 * @param {Array<Object>} rules Array of all the rules in this group
 * @param {object} values The values for each column in this row of the data
 *
 * @returns boolean
 */
const reduceRuleGroup = (logic, rules, values) => {
  const processRules = ({
    columnId,
    operand,
    groupLogic: childLogic,
    rules: childRules,
    value: filterValue,
  }) => {
    if (childLogic && Array.isArray(childRules)) {
      return reduceRuleGroup(childLogic, childRules, values);
    }

    const columnValue = values[columnId]?.toString();
    const comparitor = operands[operand];

    return comparitor(columnValue, filterValue);
  };

  if (logic === 'ALL') {
    return rules.every(processRules);
  }

  if (logic === 'ANY') {
    return rules.some(processRules);
  }

  return false;
};

/**
 * Loop through all the currently active advanced filters TREATING THEM AS 'AND' CONDITIONS
 * to determine which rows should be shown.
 *
 * @param {Array<Object>} data tableData
 * @param {Array<{filterId: string; filterTitleText: string; filterRules: Object}>} advancedFilters All the currently active filters
 * @returns boolean
 */
export const runAdvancedFilters = (data, advancedFilters) => {
  return data.filter(({ values }) => {
    return advancedFilters.every(({ filterRules: { groupLogic, rules } }) => {
      return reduceRuleGroup(groupLogic, rules, values);
    });
  });
};

/**
 * Little utility to filter data
 * @param {Array<Object>} data data to filter
 * @param {Array<{columnId: string, value: any}>} filters
 * @param {Array<Object>} columns AKA headers
 */
export const filterData = (data, filters, columns, advancedFilters) => {
  const hasSimpleFilters = Array.isArray(filters) && filters.length;
  const hasAdvancedFilters = Array.isArray(advancedFilters) && advancedFilters.length;

  if (!hasSimpleFilters && !hasAdvancedFilters) {
    return data;
  }

  if (!hasAdvancedFilters) {
    return runSimpleFilters(data, filters, columns);
  }

  if (!hasSimpleFilters) {
    return runAdvancedFilters(data, advancedFilters);
  }

  return runSimpleFilters(runAdvancedFilters(data, advancedFilters), filters, columns);
};

// Little utility to search
export const searchData = (data, searchString) =>
  searchString && searchString !== ''
    ? data.filter((
        { values } // globally check row values for a match
      ) =>
        // eslint-disable-next-line array-callback-return, consistent-return
        Object.values(values).find((value) => {
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
    columnId && columns && columns.find((column) => column.id === columnId);
  return currentlySortedColumn && currentlySortedColumn.sortFunction; // see if there's a custom sort function passed
};

/**
 * multi-sort helper for more readable code.
 *
 * @param {array} sort An array of sort objects [{columnId: string, direction: 'ASC' | 'DESC'}]
 * @param {array} columns An array of table columns matching the table column prop
 * @param {array} data An array of row data for the Table
 *
 * @returns the table data sorted by multiple dimensions
 */
const handleMultiSort = (sort, columns, data) => {
  // setup the stack with a inert firstBy, so that we can jump straight into the
  // thenBys below from the sort array
  let sortStack = firstBy(() => 0);
  sort.forEach(({ columnId, direction }) => {
    const customSortFn = getCustomColumnSort(columns, columnId);
    if (customSortFn) {
      const sortedValues = customSortFn({ data, columnId, direction }).map(({ values }) => values);
      sortStack = sortStack.thenBy((row) => row.values[columnId], {
        cmp: (a, b) => {
          return (
            sortedValues.findIndex((row) => row[columnId] === a) -
            sortedValues.findIndex((row) => row[columnId] === b)
          );
        },
      });
    } else {
      sortStack = sortStack.thenBy((row) => row.values[columnId], {
        cmp: sortTableData(columnId),
        direction: direction === 'ASC' ? 'asc' : 'desc',
      });
    }
  });

  return data.sort(sortStack);
};

// little utility to both sort and filter
export const filterSearchAndSort = (
  data,
  sort = {},
  search = {},
  filters = [],
  columns,
  advancedFilters = []
) => {
  const { value: searchValue } = search;
  const filteredData = filterData(data, filters, columns, advancedFilters);
  const searchedData =
    searchValue && searchValue !== '' ? searchData(filteredData, searchValue) : filteredData;

  if (isEmpty(sort)) {
    return searchedData;
  }

  if (Array.isArray(sort)) {
    return handleMultiSort(sort, columns, searchedData);
  }

  const { columnId, direction } = sort;
  return getCustomColumnSort(columns, columnId)
    ? getCustomColumnSort(columns, columnId)({ data: searchedData, columnId, direction })
    : getSortedData(searchedData, columnId, direction);
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
        .filter((i) => i);

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
            selectedAdvancedFilterIds: {
              $set: [],
            },
            table: {
              filteredData: {
                $set: filterSearchAndSort(
                  state.data,
                  get(state, 'view.table.sort'),
                  get(state, 'view.toolbar.search'),
                  [],
                  get(state, 'columns'),
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
        const { selectedIds } = state.view.table;
        const { pagination } = state.view;
        const totalItems = pagination.totalItems - selectedIds.length;
        const numberOfPages = Math.ceil(totalItems / pagination.pageSize);
        const page = pagination.page > numberOfPages ? numberOfPages : pagination.page;
        return baseTableReducer(
          update(state, {
            data: {
              $set: state.data.filter((i) => !selectedIds.includes(i.id)),
            },
            view: {
              table: {
                filteredData: {
                  $set: data.filter((i) => !selectedIds.includes(i.id)),
                },
              },
              pagination: {
                $set: {
                  ...pagination,
                  totalItems,
                  page,
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

      // validate if there is any column of timestamp type
      const isTimestampColumn =
        action.columns &&
        action.columns.filter((column) => column.id === columnId && column.type === 'TIMESTAMP')
          .length > 0;

      const customColumnSort = getCustomColumnSort(get(state, 'columns'), columnId);

      let filteredData;
      let nextSort;
      if (isInMultiSort) {
        nextSort = currentSort.reduce((carry, column) => {
          if (column.columnId === columnId) {
            return [...carry, { ...column, direction: nextSortDir }];
          }

          return [...carry, column];
        }, []);
        filteredData = handleMultiSort(nextSort, state.columns, state.data);
      } else {
        filteredData =
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
            : filterData(state.data, state.view.filters, state.columns); // reset to original filters
      }
      return baseTableReducer(
        update(state, {
          view: {
            table: {
              filteredData: {
                $set: filteredData,
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

      // The only thing that changes after additional child rows have been loaded is the
      // actual data, so we use that diff to find out which ids in loadingMoreIds that
      // we should keep.
      const loadingMoreIds =
        state.view?.table?.loadingMoreIds?.filter((loadMoreRowId) => {
          const oldChildCount = findRow(loadMoreRowId, state.data)?.children?.length;
          const newChildCount = findRow(loadMoreRowId, action.payload.data)?.children?.length;
          return oldChildCount === newChildCount;
        }) ?? [];

      const { view, totalItems, hasUserViewManagement } = action.payload;
      const { pageSize, pageSizes } = get(view, 'pagination') || {};
      const paginationFromState = get(state, 'view.pagination');
      const initialDefaultSearch =
        get(view, 'toolbar.search.defaultValue') || get(view, 'toolbar.search.value');
      // update the column ordering if I'm passed new columns
      // but only if hasUserViewManagement is not active.
      const ordering = hasUserViewManagement
        ? get(state, 'view.table.ordering')
        : get(view, 'table.ordering') || get(state, 'view.table.ordering');

      // update the search if a new one is passed
      const searchFromState = get(state, 'view.toolbar.search');

      // if hasUserViewManagement is active we rely on defaultValue
      const searchTermFromState = hasUserViewManagement
        ? searchFromState?.defaultValue
        : searchFromState?.value;

      const pagination = get(state, 'view.pagination')
        ? {
            totalItems: { $set: totalItems || updatedData.length },
            pageSize: { $set: paginationFromState.pageSize || pageSize },
            pageSizes: { $set: pageSizes },
          }
        : {};

      const advancedFilters = get(view, 'advancedFilters', []);
      const selectedAdvancedFilterIds =
        get(view, 'selectedAdvancedFilterIds') || get(state, 'view.selectedAdvancedFilterIds', []);
      const selectedAdvancedFilters = advancedFilters.filter((advFilter) =>
        selectedAdvancedFilterIds.includes(advFilter.filterId)
      );
      return update(state, {
        data: {
          $set: updatedData,
        },
        view: {
          pagination,
          advancedFilters: {
            $set: advancedFilters,
          },
          toolbar: {
            initialDefaultSearch: { $set: initialDefaultSearch },
            search: { $set: searchFromState },
          },
          table: {
            ordering: { $set: ordering },
            filteredData: {
              $set: filterSearchAndSort(
                updatedData,
                get(state, 'view.table.sort'),
                { value: searchTermFromState },
                get(state, 'view.filters'),
                get(state, 'columns'),
                selectedAdvancedFilters
              ),
            },
            loadingState: {
              $set: {
                isLoading: action.payload.isLoading,
                rowCount: get(state, 'view.table.loadingState.rowCount') || 0,
                columnCount: get(state, 'view.table.loadingState.columnCount') || 0,
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
            loadingMoreIds: {
              $set: loadingMoreIds,
            },
          },
        },
      });
    }

    case TABLE_ADVANCED_FILTER_TOGGLE: {
      const isOpen = state.view.toolbar.advancedFilterFlyoutOpen === true;
      return update(state, {
        view: {
          toolbar: {
            $set: {
              advancedFilterFlyoutOpen: !isOpen,
            },
          },
        },
      });
    }
    case TABLE_ADVANCED_FILTER_REMOVE: {
      const { filterId } = action.payload;
      const newSelectedFilters = state.view.selectedAdvancedFilterIds.filter(
        (id) => id !== filterId
      );
      return update(state, {
        view: {
          selectedAdvancedFilterIds: {
            $set: newSelectedFilters,
          },
        },
      });
    }

    case TABLE_ADVANCED_FILTER_CHANGE: {
      return state;
    }

    case TABLE_ADVANCED_FILTER_CREATE: {
      return state;
    }

    case TABLE_ADVANCED_FILTER_CANCEL: {
      return update(state, {
        view: {
          toolbar: {
            $set: {
              advancedFilterFlyoutOpen: false,
            },
          },
        },
      });
    }

    case TABLE_ADVANCED_FILTER_APPLY: {
      const newSimpleFilters = Object.entries(action.payload?.simple ?? {})
        .map(([key, value]) =>
          value !== ''
            ? {
                columnId: key,
                value,
              }
            : null
        )
        .filter((i) => i);

      const newAdvancedFilters = state.view.advancedFilters.filter((advFilter) =>
        action?.payload?.advanced?.filterIds?.includes(advFilter.filterId)
      );

      return baseTableReducer(
        update(state, {
          view: {
            selectedAdvancedFilterIds: {
              $set: newAdvancedFilters.map((advFilter) => advFilter.filterId),
            },
            table: {
              filteredData: {
                $set: filterSearchAndSort(
                  state.data,
                  get(state, 'view.table.sort'),
                  get(state, 'view.toolbar.search'),
                  newSimpleFilters,
                  get(state, 'columns'),
                  newAdvancedFilters
                ),
              },
            },
            toolbar: {
              advancedFilterFlyoutOpen: {
                $set: false,
              },
            },
          },
        }),
        action
      );
    }

    case TABLE_TOGGLE_AGGREGATIONS: {
      return update(state, {
        view: {
          aggregations: {
            isHidden: {
              $set: !state.view.aggregations.isHidden,
            },
          },
        },
      });
    }

    case TABLE_MULTI_SORT_TOGGLE_MODAL: {
      const { columnId } = action.payload;
      const { sort: currentSort } = state.view.table;

      const arrayifiedSort = Array.isArray(currentSort)
        ? currentSort
        : currentSort !== undefined
        ? [currentSort]
        : [];

      const alreadySortedBy = arrayifiedSort.some((by) => by.columnId === columnId);

      return update(state, {
        view: {
          table: {
            showMultiSortModal: {
              $set: !state.view.table.showMultiSortModal,
            },
            anticipatedMultiSortColumn: {
              $set: !alreadySortedBy ? { columnId, direction: 'ASC' } : undefined,
            },
          },
        },
      });
    }

    case TABLE_MULTI_SORT_SAVE: {
      return update(state, {
        view: {
          table: {
            sort: {
              $set: action.payload,
            },
            filteredData: {
              $set: filterSearchAndSort(
                state.data,
                action.payload,
                get(state, 'view.toolbar.search'),
                get(state, 'view.filters'),
                get(state, 'columns'),
                get(state, 'view.advancedFilters')
              ),
            },
            showMultiSortModal: {
              $set: false,
            },
          },
        },
      });
    }

    case TABLE_MULTI_SORT_CANCEL: {
      return update(state, {
        view: {
          table: {
            showMultiSortModal: {
              $set: false,
            },
          },
        },
      });
    }

    case TABLE_MULTI_SORT_CLEAR: {
      return update(state, {
        view: {
          table: {
            showMultiSortModal: {
              $set: false,
            },
            sort: {
              $set: undefined,
            },
            filteredData: {
              $set: filterData(state.data, state.view.filters, state.columns),
            },
          },
        },
      });
    }

    case TABLE_MULTI_SORT_ADD_COLUMN: {
      return state;
    }

    case TABLE_MULTI_SORT_REMOVE_COLUMN: {
      return state;
    }

    case TABLE_ROW_LOAD_MORE: {
      return update(state, {
        view: {
          table: {
            loadingMoreIds: {
              $set: [...state.view.table.loadingMoreIds, action.payload],
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
    case TABLE_COLUMN_RESIZE:
      return baseTableReducer(state, action);
    default:
      return state;
  }
};
