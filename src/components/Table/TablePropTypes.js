import PropTypes from 'prop-types';

export const RowActionPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    /** Unique id of the action */
    id: PropTypes.string.isRequired,
    /* icon ultimately gets passed through all the way to <Button>, which has this same copied proptype definition for icon */
    icon: PropTypes.oneOfType([
      PropTypes.shape({
        width: PropTypes.string,
        height: PropTypes.string,
        viewBox: PropTypes.string.isRequired,
        svgData: PropTypes.object.isRequired,
      }),
      PropTypes.string,
      PropTypes.node,
    ]),
    disabled: PropTypes.bool,
    labelText: PropTypes.string,
    /** Action should go into the overflow menu, not be rendered inline in the row */
    isOverflow: PropTypes.bool,
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
    /** Optional list of actions visible on row hover or expansion */
    rowActions: RowActionPropTypes,
  })
);

export const TableColumnsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isSortable: PropTypes.bool,
    width: PropTypes.string, // ex: 150px, or 2rem
    /** for each column you can register a render callback function that is called with this object payload
     * {
     *    value: PropTypes.any (current cell value),
     *    columnId: PropTypes.string,
     *    rowId: PropTypes.string,
     *    row: PropTypes.object like this {col: value, col2: value}
     * }, you should return the node that should render within that cell */
    renderDataFunction: PropTypes.func,
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
  clearAllFilters: PropTypes.string,
  columnSelectionButtonAria: PropTypes.string,
  filterButtonAria: PropTypes.string,
  clearFilterAria: PropTypes.string,
  filterAria: PropTypes.string,
  openMenuAria: PropTypes.string,
  closeMenuAria: PropTypes.string,
  clearSelectionAria: PropTypes.string,
});

export const TableSearchPropTypes = PropTypes.shape({
  value: PropTypes.string,
});
