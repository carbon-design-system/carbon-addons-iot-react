import PropTypes from 'prop-types';

export const SideNavMetaDataPropType = PropTypes.shape({
  element: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
});
