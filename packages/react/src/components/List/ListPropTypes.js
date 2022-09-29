import PropTypes from 'prop-types';

export const ListItemPropTypes = {
  children: PropTypes.arrayOf(PropTypes.object),
  content: PropTypes.shape({
    icon: PropTypes.node,
    rowActions: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.func]),
    secondaryValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.shape({
        value: PropTypes.func,
        label: PropTypes.string,
      }),
    ]),
    /** The nodes should be Carbon Tags components */
    tags: PropTypes.arrayOf(PropTypes.node),
    value: PropTypes.string,
    title: PropTypes.string,
  }),
  /** boolean to define load more row is needed */
  hasLoadMore: PropTypes.bool,
  id: PropTypes.string,
  isCategory: PropTypes.bool,
  isSelectable: PropTypes.bool,
};
