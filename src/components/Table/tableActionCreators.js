export const TABLE_REGISTER = 'TABLE_REGISTER';
export const TABLE_PAGE_CHANGE = 'TABLE_PAGE_CHANGE';
export const TABLE_FILTER_APPLY = 'TABLE_FILTER_APPLY';
export const TABLE_FILTER_CLEAR = 'TABLE_FILTER_CLEAR';
export const TABLE_TOOLBAR_TOGGLE = 'TABLE_TOOLBAR_TOGGLE';
export const TABLE_ACTION_CANCEL = 'TABLE_ACTION_CANCEL';
export const TABLE_ACTION_APPLY = 'TABLE_ACTION_APPLY';
export const TABLE_COLUMN_SORT = 'TABLE_COLUMN_SORT';
export const TABLE_COLUMN_ORDER = 'TABLE_COLUMN_ORDER';
export const TABLE_ROW_SELECT = 'TABLE_ROW_SELECT';
export const TABLE_ROW_SELECT_ALL = 'TABLE_ROW_SELECT_ALL';
export const TABLE_ROW_CLICK = 'TABLE_ROW_CLICK';
export const TABLE_ROW_EXPAND = 'TABLE_ROW_EXPAND';
export const TABLE_ROW_ACTION_APPLY = 'TABLE_ROW_ACTION_APPLY';
export const TABLE_SEARCH_APPLY = 'TABLE_SEARCH_APPLY';
export const TABLE_EMPTY_STATE_ACTION = 'TABLE_EMPTY_STATE_ACTION';

export const tableRegister = data => ({ type: TABLE_REGISTER, payload: data });
export const tablePageChange = page => ({ type: TABLE_PAGE_CHANGE, payload: page });
export const tableToolbarToggle = toolbar => ({ type: TABLE_TOOLBAR_TOGGLE, payload: toolbar });
/** Apply filters */
export const tableFilterApply = filter => ({ type: TABLE_FILTER_APPLY, payload: filter });
export const tableFilterClear = () => ({ type: TABLE_FILTER_CLEAR });

export const tableSearchApply = search => ({ type: TABLE_SEARCH_APPLY, payload: search });
/** Table Batch Actions */
export const tableActionCancel = () => ({ type: TABLE_ACTION_CANCEL });
export const tableActionApply = id => ({ type: TABLE_ACTION_APPLY, payload: id });
/** Table column actions */
export const tableColumnSort = column => ({ type: TABLE_COLUMN_SORT, payload: column });
export const tableColumnOrder = ordering => ({ type: TABLE_COLUMN_ORDER, payload: ordering });
/** Table empty state action */
export const tableEmptyStateAction = () => ({ type: TABLE_EMPTY_STATE_ACTION });

/** Select a row of the table */
export const tableRowSelect = (rowId, isSelected) => ({
  type: TABLE_ROW_SELECT,
  payload: { rowId, isSelected },
});
/** Select all the currently filtered rows of the table */
export const tableRowSelectAll = isSelected => ({
  type: TABLE_ROW_SELECT_ALL,
  payload: { isSelected },
});
export const tableRowClick = rowId => ({
  type: TABLE_ROW_CLICK,
  payload: { rowId },
});
export const tableRowExpand = (rowId, isExpanded) => ({
  type: TABLE_ROW_EXPAND,
  payload: { rowId, isExpanded },
});
export const tableRowActionApply = (rowId, actionId) => ({
  type: TABLE_ROW_ACTION_APPLY,
  payload: { rowId, actionId },
});
