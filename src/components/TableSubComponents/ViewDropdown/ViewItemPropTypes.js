import PropTypes from 'prop-types';

const ViewItemPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  /** Callback that will be called instead of the onChangeView */
  customAction: PropTypes.func,
  icon: PropTypes.elementType,
});
export default ViewItemPropType;
