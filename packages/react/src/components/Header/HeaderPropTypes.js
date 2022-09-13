import PropTypes from 'prop-types';

import deprecate from '../../internal/deprecate';

/** common proptypes associated with child content for a header action */
export const ChildContentPropTypes = {
  metaData: PropTypes.shape({
    /** The specific type of element to render */
    element: PropTypes.string,
  }),
  content: PropTypes.node,
};

/** common proptypes associated with a header action */
export const HeaderActionItemPropTypes = {
  /** Optionally provide a custom class to apply to the button */
  className: PropTypes.string,
  /** label for the menu button */
  label: PropTypes.string.isRequired,
  /** should the action render a panel or a submenu */
  hasHeaderPanel: PropTypes.bool,
  /** Menu button that pops out the action panel */
  btnContent: PropTypes.node.isRequired,
  /** content to render in the action panel */
  childContent: PropTypes.arrayOf(PropTypes.shape(ChildContentPropTypes)),
  onClick: PropTypes.func,
  /** a string id that can be used by the isActionItemVisible function to determine if an item should be shown */
  id: PropTypes.string,
};

export const HeaderPanelPropTypes = {
  /** Optionally provide a custom class to apply to the underlying <li> node */
  className: PropTypes.string,
  /** the content of the header panel  */
  content: PropTypes.any,
};

export const HeaderActionPropTypes = {
  /** details of the item to render in the action */
  item: PropTypes.shape(HeaderActionItemPropTypes).isRequired,
  /** unique index for the menu item */
  index: PropTypes.number.isRequired,
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  /** Id that can be used for testing */
  testId: PropTypes.string,

  /** render only the label instead of the button */
  renderLabel: PropTypes.bool,

  /** should this action item be expanded by default */
  defaultExpanded: PropTypes.bool,

  /** a callback to trigger when the item is closed. used to managing icons for the overflow menu */
  onClose: PropTypes.func,

  i18n: PropTypes.shape({
    closeMenu: PropTypes.string,
  }),
  inOverflow: PropTypes.bool,
  showCloseIconWhenPanelExpanded: PropTypes.bool,
};
