import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SettingsAdjust16 as SettingsAdjust } from '@carbon/icons-react';

import Button from '../Button/Button';
import { Tooltip } from '../Tooltip';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const FlyoutMenu = ({
  buttonProps,
  defaultOpen,
  iconDescription,
  children,
  className,
  disabled,
  i18n,
  light,
  renderButton,
  testId,
  transactional,
  open,
  onApply,
  onCancel,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(open === undefined ? defaultOpen : open);

  const renderTooltip = () => {
    return (
      <Tooltip
        disabled={disabled}
        className={`${className} ${iotPrefix}-flyout-menu${
          light ? ` ${iotPrefix}-flyout-menu--light` : ''
        }`}
        iconDescription={iconDescription}
        data-testid={testId}
        showIcon={false}
        open={open !== undefined ? open : isOpen}
        {...props}
      >
        {children}

        {transactional ? (
          <div className={`${iotPrefix}-flyout-menu__bottom-container`}>
            <Button
              className={`${iotPrefix}-flyout-menu__cancel`}
              kind="secondary"
              onClick={() => {
                if (open === undefined) {
                  setIsOpen(false);
                }

                onCancel();
              }}
              aria-label={i18n.cancelButton}
            >
              {i18n.cancelButton}
            </Button>
            <Button
              className={`${iotPrefix}-flyout-menu__submit`}
              aria-label={i18n.applyButton}
              onClick={() => {
                if (open === undefined) {
                  setIsOpen(false);
                }

                onApply();
              }}
            >
              {i18n.applyButton}
            </Button>
          </div>
        ) : null}
      </Tooltip>
    );
  };

  return (
    <div>
      {renderButton ? (
        <Button
          aria-label={iconDescription}
          iconDescription={iconDescription}
          className={`${buttonProps.className ??
            buttonProps.className} ${iotPrefix}-flyout-menu__trigger-button ${
            light ? `${iotPrefix}-flyout-menu--light` : ''
          }${open || isOpen ? ` ${iotPrefix}-flyout-menu--open` : ''}`}
          disabled={disabled}
          kind="ghost"
          {...buttonProps}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {renderTooltip()}
        </Button>
      ) : null}

      {renderButton ? null : renderTooltip()}
    </div>
  );
};

const propTypes = {
  tooltipId: PropTypes.string,

  /**
   * The ID of the trigger button.
   */
  triggerId: PropTypes.string,

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
   * The description of the default flyout icon
   */
  iconDescription: PropTypes.string.isRequired,

  /**
   * Optional prop to specify the tabIndex of the Tooltip
   */
  tabIndex: PropTypes.number,

  /**
   * Optional prop to specify the test id of the flyout
   */
  testId: PropTypes.string,

  /**
   * Renders cancel and apply button group
   */
  transactional: PropTypes.bool,

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

  renderButton: PropTypes.bool,
  /**
   *  Disable the button and tooltip
   */
  disabled: PropTypes.bool,

  buttonProps: PropTypes.shape({
    className: PropTypes.string,
    size: PropTypes.string,
  }),

  light: PropTypes.bool,
};

const defaultProps = {
  buttonProps: {
    className: '',
    renderIcon: SettingsAdjust,
    size: 'default',
  },
  tooltipId: 'flyout-tooltip',
  triggerId: 'flyout-trigger-id',
  defaultOpen: false,
  open: undefined,
  children: undefined,
  className: '',
  triggerClassName: 'flyout-trigger',
  transactional: false,
  tabIndex: 0,
  testId: 'flyout-menu',
  direction: 'bottom',
  i18n: {
    cancelButton: 'Cancel',
    applyButton: 'Apply',
  },

  renderButton: true,
  disabled: false,
  light: true,
};

FlyoutMenu.propTypes = propTypes;
FlyoutMenu.defaultProps = defaultProps;

export default FlyoutMenu;
