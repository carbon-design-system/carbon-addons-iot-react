import PropTypes from 'prop-types';

import { SvgPropType } from '../../constants/SharedPropTypes';
import deprecate from '../../internal/deprecate';
import { bundledIconNames } from '../../utils/bundledIcons';

import { PIN_COLUMN } from './tableUtilities';

export const RowActionPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    /** Unique id of the action */
    id: PropTypes.string.isRequired,
    /** icon ultimately gets passed through all the way to <Button>, or is rendered in the OverflowMenu, this definition handles both cases, including custom svg as a function */
    renderIcon: PropTypes.oneOfType([
      PropTypes.shape({
        width: PropTypes.string,
        height: PropTypes.string,
        viewBox: PropTypes.string.isRequired,
        svgData: SvgPropType.isRequired,
      }),
      PropTypes.oneOf(bundledIconNames),
      PropTypes.node,
      PropTypes.object,
      PropTypes.func,
    ]),
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    labelText: PropTypes.string,
    /** Action should go into the overflow menu, not be rendered inline in the row */
    isOverflow: PropTypes.bool,
    hasDivider: PropTypes.bool,
    isDelete: PropTypes.bool,
    isEdit: PropTypes.bool,
  })
);

export const RowActionErrorPropTypes = PropTypes.shape({
  title: PropTypes.node,
  message: PropTypes.node,
  learnMoreURL: PropTypes.string,
});

export const RowActionsStatePropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    rowId: PropTypes.string,
    isRunning: PropTypes.bool,
    isEditMode: PropTypes.bool,
    error: RowActionErrorPropTypes,
  })
);

export const EmptyStatePropTypes = PropTypes.oneOfType([
  PropTypes.shape({
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
    messageBody: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /* Show a different message if no content is in the table matching the filters */
    messageWithFilters: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    messageWithFiltersBody: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /* If a label is not provided, no action button will be rendered */
    buttonLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /* Show a different button label if no content is in the table matching the filters */
    buttonLabelWithFilters: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  }),
  /* If a React element is provided, it will be rendered in place of the default */
  PropTypes.element,
]);

/** Construct ahead of time with correct content */
export const ExpandedRowsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    rowId: PropTypes.string,
    content: PropTypes.node,
  })
);

export const TableRowPropTypes = PropTypes.shape({
  /** id is sent back on each event callback as users interact with the row */
  id: PropTypes.string.isRequired,
  /** {key: value} object where each key is a column identifier so that it can be dynamically ordered and value is the underlying data value of the each field.
   * If the item is a boolean, string, or number, it can be searched, filtered, and sorted. Else, it will not be able to. */
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  /** Optional array of rows (TableDataPropTypes) nested beneath this one */
  children: PropTypes.oneOfType([
    PropTypes.array, // an array of TableRowPropTypes or elements
  ]),
  /** Optional list of actions visible on row hover or expansion */
  rowActions: RowActionPropTypes,
  /** is this particular row selectable */
  isSelectable: PropTypes.bool,
  /** boolean to define load more row */
  hasLoadMore: PropTypes.bool,
  /** If this row can be dragged. The table must be set to use `hasDragAndDrop`. */
  isDraggable: PropTypes.bool,
});

export const TableRowsPropTypes = PropTypes.arrayOf(TableRowPropTypes);

export const TableColumnsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isSortable: PropTypes.bool,
    /** optional sort function for this column, called back with the column to sort on and the in-memory data as parameters
     * { columnId: PropTypes.string, direction: PropTypes.oneOf(['ASC','DESC']), data: PropTypes.array }
     * You should return the updated data
     */
    sortFunction: PropTypes.func,
    width: PropTypes.string, // ex: 150px, or 2rem
    align: PropTypes.oneOf(['start', 'center', 'end']), // ex: start, center, end
    /** for each column you can register a render callback function that is called with this object payload
     * {
     *    value: PropTypes.any (current cell value),
     *    columnId: PropTypes.string,
     *    rowId: PropTypes.string,
     *    row: PropTypes.object like this {col: value, col2: value}
     * }, you should return the node that should render within that cell */
    renderDataFunction: PropTypes.func,
    /** tooltip to show with the column, for instance to provide more information */
    tooltip: PropTypes.string,
    /**
     * If omitted, no filter input will be shown for this column
     */
    filter: PropTypes.shape({
      /** I18N text for the filter */
      placeholderText: PropTypes.string,
      /** if isMultiselect is true, the table is filtered based on a multiselect */
      isMultiselect: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
          text: PropTypes.string.isRequired,
        })
      ),
      /** if isDate and isFilterable are true, the table is filtered base on a date picker */
      isDate: PropTypes.bool,
      /** if dateOptions is empty array, assume a default format and locale */
      dateOptions: PropTypes.shape({
        dateFormat: PropTypes.string,
        locale: PropTypes.string,
      }),
      /** custom filtration function, called back with (columnValue, filterValue) */
      filterFunction: PropTypes.func,
    }),

    /**
     * If omitted, column overflow menu will not render
     */
    overflowMenuItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
        text: PropTypes.string.isRequired,
      })
    ),
  })
);

export const I18NPropTypes = PropTypes.shape({
  /** pagination */
  pageBackwardAria: PropTypes.string,
  pageForwardAria: PropTypes.string,
  pageNumberAria: PropTypes.string,
  itemsPerPage: PropTypes.string,
  /** (min, max, total) => `${min}-${max} of ${total} items` */
  itemsRangeWithTotal: PropTypes.func,
  /** (current, total) => `${current} of ${total} pages` */
  /** table body */
  pageRange: PropTypes.func,
  overflowMenuAria: PropTypes.string,
  clickToExpandAria: PropTypes.string,
  clickToCollapseAria: PropTypes.string,
  selectAllAria: PropTypes.string,
  selectRowAria: PropTypes.string,
  /** toolbar */
  searchLabel: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  clearAllFilters: PropTypes.string,
  columnSelectionButtonAria: PropTypes.string,
  columnSelectionConfig: PropTypes.string,
  filterButtonAria: PropTypes.string,
  editButtonAria: PropTypes.string,
  clearFilterAria: PropTypes.string,
  filterAria: PropTypes.string,
  downloadIconDescription: PropTypes.string,
  openMenuAria: PropTypes.string,
  closeMenuAria: PropTypes.string,
  clearSelectionAria: PropTypes.string,
  batchCancel: PropTypes.string,
  toolbarLabelAria: PropTypes.string,
  /** String 'items selected' or function receiving the selectedCount as param:
   * (selectedCount) => `${selectedCount} items selected` */
  itemsSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /** String 'item selected' or function receiving the selectedCount as param:
   * (selectedCount) => `${selectedCount} item selected` */
  itemSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /** Row actions in table body */
  /** I18N label for in progress */
  inProgressText: PropTypes.string,
  /** I18N label for action failed */
  actionFailedText: PropTypes.string,
  /** I18N label for learn more */
  learnMoreText: PropTypes.string,
  /** I18N label for dismiss */
  dismissText: PropTypes.string,
  filterNone: PropTypes.string,
  filterAscending: PropTypes.string,
  filterDescending: PropTypes.string,
  rowCountInHeader: PropTypes.func,
  toggleAggregations: PropTypes.string,
  multiSortModalTitle: PropTypes.string,
  multiSortModalPrimaryLabel: PropTypes.string,
  multiSortModalSecondaryLabel: PropTypes.string,
  multiSortModalClearLabel: PropTypes.string,
  multiSortSelectColumnLabel: PropTypes.string,
  multiSortSelectColumnSortByTitle: PropTypes.string,
  multiSortSelectColumnThenByTitle: PropTypes.string,
  multiSortDirectionLabel: PropTypes.string,
  multiSortDirectionTitle: PropTypes.string,
  multiSortAddColumn: PropTypes.string,
  multiSortRemoveColumn: PropTypes.string,
  multiSortAscending: PropTypes.string,
  multiSortDescending: PropTypes.string,
  multiSortCloseModal: PropTypes.string,
  multiSortOpenMenu: PropTypes.string,
  multiSortCloseMenu: PropTypes.string,
  multiSortDragHandle: PropTypes.string,
  /** I18N label for load more row */
  loadMoreText: PropTypes.string,
  /** aria-label applied to the tooltip in the toolbar (if given) */
  toolbarTooltipLabel: PropTypes.string,
  /** tooltip text for filter row icon button */
  filterRowIconDescription: PropTypes.string,
  /** button label for batch action overflow menu */
  batchActionsOverflowMenuText: PropTypes.string,
  /** overflow menu text callback for truncated filter tags */
  filterTagsOverflowMenuText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /** I18N label for search icon in toolbar */
  toolbarSearchIconDescription: PropTypes.string,
});

export const defaultI18NPropTypes = {
  /** pagination */
  pageBackwardAria: 'Previous page',
  pageForwardAria: 'Next page',
  pageNumberAria: 'Page Number',
  itemsPerPage: 'Items per page:',
  itemsRangeWithTotal: (min, max, total) => `${min}–${max} of ${total} items`,
  pageRange: (current, total) => `${current} of ${total} pages`,
  /** table body */
  overflowMenuAria: 'More actions',
  clickToExpandAria: 'Click to expand content',
  clickToCollapseAria: 'Click to collapse content',
  selectAllAria: 'Select all items',
  selectRowAria: 'Select row',
  /** toolbar */
  clearAllFilters: 'Clear all filters',
  columnSelectionButtonAria: 'Column Selection',
  columnSelectionConfig: 'Manage columns',
  filterButtonAria: 'Filters',
  editButtonAria: 'Edit rows',
  searchLabel: 'Search',
  searchPlaceholder: 'Search',
  clearFilterAria: 'Clear filter',
  filterAria: 'Filter',
  openMenuAria: 'Open menu',
  closeMenuAria: 'Close menu',
  clearSelectionAria: 'Clear selection',
  batchCancel: 'Cancel',
  itemsSelected: (selectedCount) => `${selectedCount} items selected`,
  itemSelected: (selectedCount) => `${selectedCount} item selected`,
  applyButtonText: 'Apply filters',
  cancelButtonText: 'Cancel',
  advancedFilterLabelText: 'Select an existing filter or',
  createNewAdvancedFilterText: 'create a new advanced filter',
  advancedFilterPlaceholderText: 'Select a filter',
  simpleFiltersTabLabel: 'Simple filters',
  advancedFiltersTabLabel: 'Advanced filters',
  /** empty state */
  emptyMessage: 'There is no data',
  emptyMessageWithFilters: 'No results match the current filters',
  emptyButtonLabel: 'Create some data',
  emptyButtonLabelWithFilters: 'Clear all filters',
  filterNone: 'Unsort rows by this header',
  filterAscending: 'Sort rows by this header in ascending order',
  filterDescending: 'Sort rows by this header in descending order',
  rowCountInHeader: (totalRowCount) => `Results: ${totalRowCount}`,
  toggleAggregations: 'Toggle aggregations',
  multiSortModalTitle: 'Select columns to sort',
  multiSortModalPrimaryLabel: 'Sort',
  multiSortModalSecondaryLabel: 'Cancel',
  multiSortSelectColumnLabel: 'Select a column',
  multiSortSelectColumnSortByTitle: 'Sort by',
  multiSortSelectColumnThenByTitle: 'Then by',
  multiSortDirectionLabel: 'Select a direction',
  multiSortDirectionTitle: 'Sort order',
  multiSortAddColumn: 'Add column',
  multiSortRemoveColumn: 'Remove column',
  multiSortAscending: 'Ascending',
  multiSortDescending: 'Descending',
  multiSortCloseModal: 'Close',
  multiSortOpenMenu: 'Open menu',
  multiSortCloseMenu: 'Close menu',
  multiSortDragHandle: 'Drag handle',
  toolbarTooltipLabel: 'Toolbar tooltip',
};

export const TableSearchPropTypes = PropTypes.shape({
  value: deprecate(
    PropTypes.string,
    '\n The prop `value` has been deprecated in favor of `defaultValue`'
  ),
  defaultValue: PropTypes.string,
  defaultExpanded: PropTypes.bool,
  onChange: deprecate(
    PropTypes.func,
    '\n The prop `onChange` has been deprecated in favor of `onApplySearch` in table actions object'
  ),
  onExpand: deprecate(
    PropTypes.func,
    '\n The prop `onExpand` has been deprecated in favor of `onSearchExpand` in table actions object'
  ),
  isExpanded: PropTypes.bool,
});

/** Which toolbar is currently active */
export const ActiveTableToolbarPropType = PropTypes.oneOf(['column', 'filter', 'rowEdit']);

export const TableSortPropType = PropTypes.shape({
  columnId: PropTypes.string,
  direction: PropTypes.oneOf(['NONE', 'ASC', 'DESC']),
});

/** Specify the properties of each column group in the table */
export const TableColumnGroupPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })
);

/** Specify the order, visibility and group belonging of the table columns */
export const TableOrderingPropType = PropTypes.arrayOf(
  PropTypes.shape({
    columnId: PropTypes.string.isRequired,
    /* Visibility of column in table, defaults to false */
    isHidden: PropTypes.bool,
    /* The id of the column group this column belongs to if any */
    columnGroupId: PropTypes.string,
  })
);

export const TableFiltersPropType = PropTypes.arrayOf(
  PropTypes.shape({
    columnId: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
  })
);

export const TableSharedActionPropTypes = {
  id: PropTypes.string.isRequired,
  /** the item is displayed, but disabled */
  disabled: PropTypes.bool,
  /** the text for the option */
  labelText: PropTypes.string.isRequired,
  /** filters out the option so it isn't displayed */
  hidden: PropTypes.bool,
  /** the icon to render for this action */
  renderIcon: PropTypes.oneOfType([
    PropTypes.shape({
      width: PropTypes.string,
      height: PropTypes.string,
      viewBox: PropTypes.string.isRequired,
      svgData: SvgPropType.isRequired,
    }),
    PropTypes.oneOf(bundledIconNames),
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
};

export const TableSharedOverflowMenuPropTypes = {
  ...TableSharedActionPropTypes,
  /** displays the option in red */
  isDelete: PropTypes.bool,
  /** show a divider above this item */
  hasDivider: PropTypes.bool,
  /** should this action be shown in the overflow menu */
  isOverflow: PropTypes.bool,
};

export const TableToolbarActionsPropType = PropTypes.oneOfType([
  /** allow the actions to be generated dynamically by a callback */
  PropTypes.func,
  PropTypes.arrayOf(
    PropTypes.shape({
      ...TableSharedOverflowMenuPropTypes,
      /** only used for actions in the toolbar (not overflow menu) to show when they are active */
      isActive: PropTypes.bool,
    })
  ),
]);

export const PinColumnPropTypes = PropTypes.oneOf(Object.values(PIN_COLUMN));
