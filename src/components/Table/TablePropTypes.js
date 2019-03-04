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
