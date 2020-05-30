import PropTypes from 'prop-types';

const ViewItemPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  public: PropTypes.bool,
  customAction: PropTypes.func,
  icon: PropTypes.elementType,
});
export default ViewItemPropType;
