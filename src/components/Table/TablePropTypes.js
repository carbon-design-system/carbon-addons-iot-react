import PropTypes from 'prop-types';

export const RowActionPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
    icon: PropTypes.string,
    disabled: PropTypes.bool,
    labelText: PropTypes.string,
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
