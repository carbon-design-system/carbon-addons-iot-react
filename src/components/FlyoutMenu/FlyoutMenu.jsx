import React from 'react';
import PropTypes from 'prop-types';
import { SettingsAdjust16 as SettingsAdjust } from '@carbon/icons-react';

import Button from '../Button';
import { Tooltip } from '../Tooltip';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const FlyoutMenu = ({ children, i18n, testId, onApply, onCancel, ...props }) => {
  return (
    <>
      <Tooltip iconDescription="flyout" renderIcon={SettingsAdjust} data-testId={testId} {...props}>
        {children}

        <div className={`${iotPrefix}-flyout-menu__bottom-container`}>
          <Button
            className={`${iotPrefix}-flyout-menu__cancel`}
            kind="secondary"
            onClick={onCancel}
            aria-label={i18n.cancelButton}
          >
            {i18n.cancelButton}
          </Button>
          <Button
            className={`${iotPrefix}-flyout-menu__submit`}
            aria-label={i18n.applyButton}
            onClick={onApply}
          >
            {i18n.applyButton}
          </Button>
        </div>
      </Tooltip>
    </>
  );
};

const propTypes = {
  tooltipId: PropTypes.string,

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
   * The name of the default flyout icon.
   */
  iconName: PropTypes.string,

  /**
   * The description of the default flyout icon
   */
  iconDescription: PropTypes.string,

  /**
   * Optional prop to specify the tabIndex of the Tooltip
   */
  tabIndex: PropTypes.number,

  /**
   * Optional prop to specify the test id of the flyout
   */
  testId: PropTypes.string,

  /**
   * On Cancel button callback
   */
  onCancel: PropTypes.func.isRequired,

  /**
   * On Apply button callback
   */
  onApply: PropTypes.func.isRequired,

  i18n: PropTypes.shape({
    cancelButton: PropTypes.string,
    applyButton: PropTypes.string,
  }),
};

const defaultProps = {
  tooltipId: 'flyout-tooltip',
  triggerId: 'flyout-trigger-id',
  menuId: undefined,
  menuBodyId: undefined,
  defaultOpen: false,
  open: undefined,
  children: undefined,
  className: `${iotPrefix}-flyout-menu`,
  triggerClassName: 'flyout-trigger',
  iconName: 'SettingsAdjust32',
  iconDescription: undefined,
  tabIndex: 0,
  testId: 'flyout-menu',
  direction: 'bottom',
  selectorPrimaryFocus: undefined,
  i18n: {
    cancelButton: 'Cancel',
    applyButton: 'Apply',
  },
};

FlyoutMenu.propTypes = propTypes;
FlyoutMenu.defaultProps = defaultProps;

export default FlyoutMenu;
