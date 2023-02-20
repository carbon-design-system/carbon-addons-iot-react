export const TABLE_REGISTER = 'TABLE_REGISTER';
export const TABLE_LOAD_VIEW = 'TABLE_LOAD_VIEW';
export const TABLE_PAGE_CHANGE = 'TABLE_PAGE_CHANGE';
export const TABLE_FILTER_APPLY = 'TABLE_FILTER_APPLY';
export const TABLE_FILTER_CLEAR = 'TABLE_FILTER_CLEAR';
export const TABLE_TOOLBAR_TOGGLE = 'TABLE_TOOLBAR_TOGGLE';
export const TABLE_ACTION_CANCEL = 'TABLE_ACTION_CANCEL';
export const TABLE_ACTION_APPLY = 'TABLE_ACTION_APPLY';
export const TABLE_ROW_ACTION_START = 'TABLE_ROW_ACTION_START';
export const TABLE_ROW_ACTION_EDIT = 'TABLE_ROW_ACTION_EDIT';
export const TABLE_ROW_ACTION_COMPLETE = 'TABLE_ROW_ACTION_COMPLETE';
export const TABLE_ROW_ACTION_ERROR = 'TABLE_ROW_ACTION_ERROR';
export const TABLE_COLUMN_SORT = 'TABLE_COLUMN_SORT';
export const TABLE_COLUMN_ORDER = 'TABLE_COLUMN_ORDER';
export const TABLE_COLUMN_RESIZE = 'TABLE_COLUMN_RESIZE';
export const TABLE_ROW_SELECT = 'TABLE_ROW_SELECT';
export const TABLE_ROW_SELECT_ALL = 'TABLE_ROW_SELECT_ALL';
export const TABLE_ROW_CLICK = 'TABLE_ROW_CLICK';
export const TABLE_ROW_EXPAND = 'TABLE_ROW_EXPAND';
export const TABLE_SEARCH_APPLY = 'TABLE_SEARCH_APPLY';
export const TABLE_EMPTY_STATE_ACTION = 'TABLE_EMPTY_STATE_ACTION';
export const TABLE_LOADING_SET = 'TABLE_LOADING_SET';
export const TABLE_ADVANCED_FILTER_CANCEL = 'TABLE_ADVACNED_FILTER_CANCEL';
export const TABLE_ADVANCED_FILTER_CREATE = 'TABLE_ADVANCED_FILTER_CREATE';
export const TABLE_ADVANCED_FILTER_REMOVE = 'TABLE_ADVANCED_FILTER_REMOVE';
export const TABLE_ADVANCED_FILTER_CHANGE = 'TABLE_ADVANCED_FILTER_CHANGE';
export const TABLE_ADVANCED_FILTER_TOGGLE = 'TABLE_ADVANCED_FILTER_TOGGLE';
export const TABLE_ADVANCED_FILTER_APPLY = 'TABLE_ADVANCED_FILTER_APPLY';
export const TABLE_TOGGLE_AGGREGATIONS = 'TABLE_TOGGLE_AGGREGATIONS';
export const TABLE_MULTI_SORT_TOGGLE_MODAL = 'TABLE_MULTI_SORT_TOGGLE_MODAL';
export const TABLE_MULTI_SORT_SAVE = 'TABLE_MULTI_SORT_SAVE';
export const TABLE_MULTI_SORT_CANCEL = 'TABLE_MULTI_SORT_CANCEL';
export const TABLE_MULTI_SORT_CLEAR = 'TABLE_MULTI_SORT_CLEAR';
export const TABLE_MULTI_SORT_ADD_COLUMN = 'TABLE_MULTI_SORT_ADD_COLUMN';
export const TABLE_MULTI_SORT_REMOVE_COLUMN = 'TABLE_MULTI_SORT_REMOVE_COLUMN';
export const TABLE_ROW_LOAD_MORE = 'TABLE_ROW_LOAD_MORE';
export const tableRegister = ({
  data,
  isLoading,
  view,
  totalItems,
  hasUserViewManagement,
  hasRowSelection,
  instanceId = null,
}) => ({
  type: TABLE_REGISTER,
  payload: { data, view, isLoading, totalItems, hasUserViewManagement, hasRowSelection },
  instanceId,
});

export const tablePageChange = (page, instanceId = null) => ({
  type: TABLE_PAGE_CHANGE,
  payload: page,
  instanceId,
});

export const tableToolbarToggle = (toolbar, instanceId = null) => ({
  type: TABLE_TOOLBAR_TOGGLE,
  payload: toolbar,
  instanceId,
});

/** Apply filters */
export const tableFilterApply = (filter, instanceId = null) => ({
  type: TABLE_FILTER_APPLY,
  payload: filter,
  instanceId,
});
export const tableFilterClear = (instanceId = null) => ({
  type: TABLE_FILTER_CLEAR,
  instanceId,
});

export const tableSearchApply = (search, instanceId = null) => ({
  type: TABLE_SEARCH_APPLY,
  payload: search,
  instanceId,
});

/** Table Batch Actions */
export const tableActionCancel = (instanceId = null) => ({
  type: TABLE_ACTION_CANCEL,
  instanceId,
});
export const tableActionApply = (id, instanceId = null) => ({
  type: TABLE_ACTION_APPLY,
  payload: id,
  instanceId,
});

/** Table column actions */
export const tableColumnSort = (column, columns, instanceId = null) => ({
  type: TABLE_COLUMN_SORT,
  payload: column,
  columns,
  instanceId,
});
export const tableColumnOrder = (ordering, instanceId = null) => ({
  type: TABLE_COLUMN_ORDER,
  payload: ordering,
  instanceId,
});

export const tableColumnResize = (columns, instanceId = null) => ({
  type: TABLE_COLUMN_RESIZE,
  payload: columns,
  instanceId,
});

/** Table empty state action */
export const tableEmptyStateAction = (instanceId = null) => ({
  type: TABLE_EMPTY_STATE_ACTION,
  instanceId,
});

/** Table row actions */
export const tableRowActionStart = (rowId, instanceId = null) => ({
  type: TABLE_ROW_ACTION_START,
  payload: rowId,
  instanceId,
});

export const tableRowActionEdit = (rowId, instanceId = null) => ({
  type: TABLE_ROW_ACTION_EDIT,
  payload: rowId,
  instanceId,
});

export const tableRowActionComplete = (rowId, instanceId = null) => ({
  type: TABLE_ROW_ACTION_COMPLETE,
  payload: rowId,
  instanceId,
});
export const tableRowActionError = (rowId, error, instanceId = null) => ({
  type: TABLE_ROW_ACTION_ERROR,
  payload: rowId,
  error,
  instanceId,
});

/** Select a row of the table */
export const tableRowSelect = (selectedIds, hasRowSelection, instanceId = null) => ({
  type: TABLE_ROW_SELECT,
  payload: { selectedIds, hasRowSelection },
  instanceId,
});

/** Select all the currently filtered rows of the table */
export const tableRowSelectAll = (isSelected, instanceId = null) => ({
  type: TABLE_ROW_SELECT_ALL,
  payload: { isSelected },
  instanceId,
});

export const tableRowClick = (rowId, instanceId = null) => ({
  type: TABLE_ROW_CLICK,
  payload: { rowId },
  instanceId,
});

export const tableRowExpand = (rowId, isExpanded, instanceId = null, options) => ({
  type: TABLE_ROW_EXPAND,
  payload: { rowId, isExpanded, options },
  instanceId,
});

/**
 * rowCount: The number of rows currently being loaded
 */
export const tableLoadingSet = (isLoading, rowCount, instanceId = null) => ({
  type: TABLE_LOADING_SET,
  payload: { isLoading, rowCount },
  instanceId,
});

/**
 * Advanced filters
 */
export const tableAdvancedFiltersToggle = () => ({
  type: TABLE_ADVANCED_FILTER_TOGGLE,
});

export const tableAdvancedFiltersCancel = () => ({
  type: TABLE_ADVANCED_FILTER_CANCEL,
});

export const tableAdvancedFiltersCreate = () => ({
  type: TABLE_ADVANCED_FILTER_CREATE,
});

export const tableAdvancedFiltersRemove = (filterId) => ({
  type: TABLE_ADVANCED_FILTER_REMOVE,
  payload: {
    filterId,
  },
});

export const tableAdvancedFiltersChange = () => ({
  type: TABLE_ADVANCED_FILTER_CHANGE,
});

export const tableAdvancedFiltersApply = (filterState) => ({
  type: TABLE_ADVANCED_FILTER_APPLY,
  payload: filterState,
});

export const tableToggleAggregations = () => ({
  type: TABLE_TOGGLE_AGGREGATIONS,
});

export const tableMultiSortToggleModal = (meta) => ({
  type: TABLE_MULTI_SORT_TOGGLE_MODAL,
  payload: meta,
});

export const tableSaveMultiSortColumns = (sortColumns) => ({
  type: TABLE_MULTI_SORT_SAVE,
  payload: sortColumns,
});

export const tableCancelMultiSortColumns = () => ({
  type: TABLE_MULTI_SORT_CANCEL,
});

export const tableClearMultiSortColumns = () => ({
  type: TABLE_MULTI_SORT_CLEAR,
});

export const tableAddMultiSortColumn = (index) => ({
  type: TABLE_MULTI_SORT_ADD_COLUMN,
  payload: index,
});

export const tableRemoveMultiSortColumn = (index) => ({
  type: TABLE_MULTI_SORT_REMOVE_COLUMN,
  payload: index,
});

export const tableRowLoadMore = (rowId) => ({
  type: TABLE_ROW_LOAD_MORE,
  payload: rowId,
});
