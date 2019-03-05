import PropTypes from 'prop-types';

export const RowActionPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    /** Unique id of the action */
    id: PropTypes.string.isRequired,
    icon: PropTypes.string,
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
    /* Show a different utton label if no content is in the table matching the filters */
    buttonLabelWithFilters: PropTypes.string,
  }),
  /* If a React element is provided, it will be rendered in place of the default */
  PropTypes.element,
]);

export const ExpandedRowsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    rowId: PropTypes.string,
    content: PropTypes.element,
  })
);

export const TableDataPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
    /** Optional list of actions visible on row hover or expansion */
    rowActions: RowActionPropTypes,
  })
);

export const TableColumnsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    isSortable: PropTypes.bool,
    filter: PropTypes.shape({
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
