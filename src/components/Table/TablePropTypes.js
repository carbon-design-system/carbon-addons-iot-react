import PropTypes from 'prop-types';

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
      PropTypes.string,
      PropTypes.node,
      PropTypes.object,
      PropTypes.func,
    ]),
    disabled: PropTypes.bool,
    labelText: PropTypes.string,
    /** Action should go into the overflow menu, not be rendered inline in the row */
    isOverflow: PropTypes.bool,
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
    error: RowActionErrorPropTypes,
  })
);

export const EmptyStatePropTypes = PropTypes.oneOfType([
  PropTypes.shape({
    message: PropTypes.string.isRequired,
    /* Show a different message if no content is in the table matching the filters */
    messageWithFilters: PropTypes.string,
    /* If a label is not provided, no action button will be rendered */
    buttonLabel: PropTypes.string,
    /* Show a different button label if no content is in the table matching the filters */
    buttonLabelWithFilters: PropTypes.string,
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
     * We don't support custom nodes here, only simple primitives so we can sort and search on them */
    values: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
    ).isRequired,
    /** Optional array of rows (TableDataPropTypes) nested beneath this one */
    children: PropTypes.oneOfType([
      PropTypes.array, // an array of TableRowPropTypes or elements
    ]),
    /** Optional list of actions visible on row hover or expansion */
    rowActions: RowActionPropTypes,
    /** is this particular row selectable */
    isSelectable: PropTypes.bool,
  })
);

export const TableColumnsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isSortable: PropTypes.bool,
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

    /**
     * If omitted, no filter input will be shown for this column
     */
    filter: PropTypes.shape({
      /** I18N text for the filter */
      placeholderText: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
        })
      ),
    }),
  })
);

export const I18NPropTypes = PropTypes.shape({
  /** pagination */
  pageBackwardAria: PropTypes.string,
  pageForwardAria: PropTypes.string,
  pageNumberAria: PropTypes.string,
  itemsPerPage: PropTypes.string,
  /** (min, max) => `${min}-${max} items` */
  itemsRange: PropTypes.func,
  /** page => `page ${page}` */
  currentPage: PropTypes.func,
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
  filterButtonAria: PropTypes.string,
  clearFilterAria: PropTypes.string,
  filterAria: PropTypes.string,
  openMenuAria: PropTypes.string,
  closeMenuAria: PropTypes.string,
  clearSelectionAria: PropTypes.string,
  batchCancel: PropTypes.string,
  itemsSelected: PropTypes.string,
  itemSelected: PropTypes.string,
  /** Row actions in table body */
  /** I18N label for in progress */
  inProgressText: PropTypes.string, // eslint-disable-line
  /** I18N label for action failed */
  actionFailedText: PropTypes.string, // eslint-disable-line
  /** I18N label for learn more */
  learnMoreText: PropTypes.string, // eslint-disable-line
  /** I18N label for dismiss */
  dismissText: PropTypes.string, // eslint-disable-line
  filterNone: PropTypes.string,
  filterAscending: PropTypes.string,
  filterDescending: PropTypes.string,
});

export const defaultI18NPropTypes = {
  /** pagination */
  pageBackwardAria: 'Previous page',
  pageForwardAria: 'Next page',
  pageNumberAria: 'Page Number',
  itemsPerPage: 'Items per page:',
  itemsRange: (min, max) => `${min}–${max} items`,
  currentPage: page => `page ${page}`,
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
  filterButtonAria: 'Filters',
  searchLabel: 'Search',
  searchPlaceholder: 'Search',
  clearFilterAria: 'Clear filter',
  filterAria: 'Filter',
  openMenuAria: 'Open menu',
  closeMenuAria: 'Close menu',
  clearSelectionAria: 'Clear selection',
  batchCancel: 'Cancel',
  itemsSelected: 'items selected',
  itemSelected: 'item selected',
  /** empty state */
  emptyMessage: 'There is no data',
  emptyMessageWithFilters: 'No results match the current filters',
  emptyButtonLabel: 'Create some data',
  emptyButtonLabelWithFilters: 'Clear all filters',
  filterNone: 'Unsort rows by this header',
  filterAscending: 'Sort rows by this header in ascending order',
  filterDescending: 'Sort rows by this header in descending order',
};

export const TableSearchPropTypes = PropTypes.shape({
  value: PropTypes.string,
});
