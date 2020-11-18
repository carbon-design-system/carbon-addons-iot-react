import PropTypes from 'prop-types';

export const OverridePropTypes = PropTypes.shape({
  props: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  component: PropTypes.elementType,
});

export const HotspotIconPropType = PropTypes.shape({
  id: PropTypes.string,
  icon: PropTypes.object,
  text: PropTypes.string,
});

export const ColorPropType = PropTypes.shape({
  carbonColor: PropTypes.string,
  name: PropTypes.string,
});
