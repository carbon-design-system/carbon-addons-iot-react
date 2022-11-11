import PropTypes from 'prop-types';

const TableViewItemPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  /** Callback that will be called instead of the onChangeView */
  customAction: PropTypes.func,
  icon: PropTypes.elementType,
});
export default TableViewItemPropType;
