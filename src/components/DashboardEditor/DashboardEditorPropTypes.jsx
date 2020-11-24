import PropTypes from 'prop-types';

export const DataItemsPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    dataSourceId: PropTypes.string,
    label: PropTypes.string,
  })
);
