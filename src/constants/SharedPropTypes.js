import PropTypes from 'prop-types';

export const OverridePropTypes = PropTypes.shape({
  props: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  component: PropTypes.elementType,
});
