import PropTypes from 'prop-types';

import deprecate from '../../internal/deprecate';
import { bundledIconNames } from '../../utils/bundledIcons';

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
        svgData: PropTypes.object.isRequired,
      }),
      PropTypes.oneOf(bundledIconNames),
      PropTypes.node,
      PropTypes.object,
      PropTypes.func,
    ]),
    disabled: PropTypes.bool,
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
    message: PropTypes.node.isRequired,
    messageBody: PropTypes.node,
    /* Show a different message if no content is in the table matching the filters */
    messageWithFilters: PropTypes.node,
    messageWithFiltersBody: PropTypes.node,
    /* If a label is not provided, no action button will be rendered */
    buttonLabel: PropTypes.node,
    /* Show a different button label if no content is in the table matching the filters */
    buttonLabelWithFilters: PropTypes.node,
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

export const TableRowPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
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
  })
);

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
      /** custom filtration function, called back with (columnValue, filterValue) */
      filterFunction: PropTypes.func,
    }),

    /**
     * If omitted, column overflow menu will not render
     */
    options: PropTypes.arrayOf(
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
  multiSortClearAll: PropTypes.string,
  multiSortOpenMenu: PropTypes.string,
  multiSortCloseMenu: PropTypes.string,
  /** I18N label for load more row */
  loadMoreText: PropTypes.string,
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
};

export const TableSearchPropTypes = PropTypes.shape({
  value: deprecate(
    PropTypes.string,
    '\n The prop `value` has been deprecated in favor of `defaultValue`'
  ),
  defaultValue: PropTypes.string,
  defaultExpanded: PropTypes.bool,
  onChange: PropTypes.func,
  onExpand: PropTypes.func,
});

/** Which toolbar is currently active */
export const ActiveTableToolbarPropType = PropTypes.oneOf(['column', 'filter', 'rowEdit']);

export const TableSortPropType = PropTypes.shape({
  columnId: PropTypes.string,
  direction: PropTypes.oneOf(['NONE', 'ASC', 'DESC']),
});
