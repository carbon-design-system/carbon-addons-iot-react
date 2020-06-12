import './_flyout-menu.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { SettingsAdjust16 as SettingsAdjust } from '@carbon/icons-react';
import { Tooltip, Button } from 'carbon-components-react';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const FlyoutMenu = props => {
  const { children, onApply, onCancel } = props;
  return (
    <Tooltip {...props} renderIcon={SettingsAdjust}>
      {children}

      <div className={`${iotPrefix}-flyout-menu__bottom-container`}>
        <Button className={`${iotPrefix}-flyout-menu__cancel`} kind="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button className={`${iotPrefix}-flyout-menu__submit`} onClick={onApply}>
          Apply
        </Button>
      </div>
    </Tooltip>
  );
};

const propTypes = {
  /**
   * The ID of the trigger button.
   */
  triggerId: PropTypes.string,

  /**
   * The ID of the flyout menu content.
   */
  menuId: PropTypes.string,

  /**
   * The ID of the flyout menu body content.
   */
  menuBodyId: PropTypes.string,

  /**
   * Optional starting value for uncontrolled state
   */
  defaultOpen: PropTypes.bool,

  /**
   * Open/closed state.
   */
  open: PropTypes.bool,

  /**
   * Contents to put into the flyout menu.
   */
  children: PropTypes.node,

  /**
   * The CSS class names of the flyout menu.
   */
  className: PropTypes.string,

  /**
   * The CSS class names of the trigger UI.
   */
  triggerClassName: PropTypes.string,

  /**
   * Where to put the flyout menu, relative to the trigger UI.
   */
  direction: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),

  /**
   * Specify a CSS selector that matches the DOM element that should
   * be focused when the flyout menu opens
   */
  selectorPrimaryFocus: PropTypes.string,

  /**
   * The name of the default tooltip icon.
   */
  iconName: PropTypes.string,

  iconDescription: PropTypes.string,

  /**
   * Optional prop to specify the tabIndex of the Tooltip
   */
  tabIndex: PropTypes.number,

  onCancel: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

const defaultProps = {
  triggerId: undefined,
  menuId: undefined,
  menuBodyId: undefined,
  defaultOpen: false,
  open: undefined,
  children: undefined,
  className: `${iotPrefix}-flyout-menu`,
  triggerClassName: '',
  iconName: 'SettingsAdjust32',
  iconDescription: undefined,
  tabIndex: 0,
  direction: 'bottom',
  selectorPrimaryFocus: undefined,
};

FlyoutMenu.propTypes = propTypes;
FlyoutMenu.defaultProps = defaultProps;

export default FlyoutMenu;
