import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { SettingsAdjust16 as SettingsAdjust } from '@carbon/icons-react';

import Button from '../Button/Button';
import { Tooltip } from '../Tooltip';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

export const FlyoutMenuDirection = {
  BottomStart: 'bottom-start',
  BottomEnd: 'bottom-end',
  TopStart: 'top-start',
  TopEnd: 'top-end',
  LeftStart: 'left-start',
  LeftEnd: 'left-end',
  RightStart: 'right-start',
  RightEnd: 'right-end',
};

const FlyoutMenu = ({
  buttonSize,
  direction,
  defaultOpen,
  iconDescription,
  children,
  className,
  disabled,
  i18n,
  light,
  renderIcon,
  testId,
  transactional,
  onApply,
  onCancel,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const buttonRef = useRef(null);
  const tooltipContentRef = useRef(null);

  const defaultFooter =
    transactional === true ? (
      <div className={`${iotPrefix}-flyout-menu__bottom-container`}>
        <Button
          className={`${iotPrefix}-flyout-menu__cancel`}
          kind="secondary"
          onClick={() => {
            setIsOpen(false);

            if (onCancel) {
              onCancel();
            }
          }}
          aria-label={i18n.cancelButtonText}
        >
          {i18n.cancelButtonText}
        </Button>
        <Button
          className={`${iotPrefix}-flyout-menu__submit`}
          aria-label={i18n.applyButtonText}
          onClick={() => {
            setIsOpen(false);

            if (onApply) {
              onApply();
            }
          }}
        >
          {i18n.applyButtonText}
        </Button>
      </div>
    ) : null;

  let tooltipDirection;

  switch (direction) {
    case FlyoutMenuDirection.TopStart:
    case FlyoutMenuDirection.TopEnd:
      tooltipDirection = 'top';
      break;
    case FlyoutMenuDirection.RightStart:
    case FlyoutMenuDirection.RightEnd:
      tooltipDirection = 'right';
      break;
    case FlyoutMenuDirection.LeftStart:
    case FlyoutMenuDirection.LeftEnd:
      tooltipDirection = 'left';
      break;
    default:
      tooltipDirection = 'bottom';
      break;
  }

  return (
    <div ref={buttonRef} className={`${iotPrefix}-flyout-menu ${tooltipDirection}`}>
      <Button
        aria-label={iconDescription}
        iconDescription={iconDescription}
        className={`${iotPrefix}-flyout-menu__trigger-button ${
          light ? `${iotPrefix}-flyout-menu__light` : ''
        }${isOpen ? ` ${iotPrefix}-flyout-menu--open` : ''}`}
        disabled={disabled}
        hasIconOnly
        kind="ghost"
        size={buttonSize}
        renderIcon={renderIcon}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      {
        <div className={`${iotPrefix}-flyout-menu--tooltip-anchor`}>
          <Tooltip
            disabled={disabled}
            className={`${className} ${iotPrefix}-flyout-menu--body${
              light ? ` ${iotPrefix}-flyout-menu__light` : ''
            }`}
            iconDescription={iconDescription}
            data-testid={testId}
            showIcon={false}
            open={isOpen}
            testId="flyout-body"
            direction={tooltipDirection}
            menuOffset={() => {
              let topOffset = 0;
              let leftOffset = 0;

              const caretWidth = 16;
              const caretHeight = 14;

              const tooltipWidth = tooltipContentRef.current
                ? tooltipContentRef.current.getBoundingClientRect().width
                : 0;
              const tooltipHeight = tooltipContentRef.current
                ? tooltipContentRef.current.getBoundingClientRect().height
                : 0;

              const buttonWidth = buttonRef.current
                ? buttonRef.current.getBoundingClientRect().width
                : 0;

              let rtlOffset = buttonWidth;

              switch (direction) {
                case FlyoutMenuDirection.BottomEnd:
                  topOffset = -caretHeight;
                  leftOffset = -tooltipWidth / 2 - caretWidth + buttonWidth;
                  break;
                case FlyoutMenuDirection.TopStart:
                  leftOffset = caretWidth + tooltipWidth / 2;
                  topOffset = caretHeight;
                  break;
                case FlyoutMenuDirection.TopEnd:
                  leftOffset = -tooltipWidth / 2 - caretWidth + buttonWidth;
                  topOffset = caretHeight;
                  break;
                case FlyoutMenuDirection.LeftStart:
                  topOffset = tooltipHeight / 2 + caretHeight;
                  rtlOffset = 0;
                  break;
                case FlyoutMenuDirection.LeftEnd:
                  topOffset = -tooltipHeight / 2 + caretHeight + caretWidth;
                  rtlOffset = 0;
                  break;
                case FlyoutMenuDirection.RightStart:
                  topOffset = tooltipHeight / 2;
                  rtlOffset = 0;
                  break;
                case FlyoutMenuDirection.RightEnd:
                  topOffset = caretWidth - tooltipHeight / 2;
                  rtlOffset = 0;
                  break;
                default:
                  // Bottom Start
                  leftOffset = caretWidth + tooltipWidth / 2;
                  topOffset = -caretHeight;
              }

              if (document.dir === 'rtl') {
                leftOffset -= rtlOffset;
              }

              return {
                top: topOffset,
                left: leftOffset,
              };
            }}
            {...props}
          >
            <div ref={tooltipContentRef}>
              {children}

              {typeof transactional === 'boolean' ? (
                defaultFooter
              ) : (
                <div className={`${iotPrefix}-flyout-menu__bottom-container-custom`}>
                  {transactional}
                </div>
              )}
            </div>
            <div
              className={light ? `${iotPrefix}-flyout-menu__light` : ''}
              style={{
                width: buttonRef.current ? buttonRef.current.getBoundingClientRect().width : 0,
                top: '-0.1875rem',
                left: 0,
                height: '0.1875rem',
                position: 'absolute',
                display: 'block',
              }}
            />
          </Tooltip>
        </div>
      }
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
   * Contents to put into the flyout menu.
   */
  children: PropTypes.node,

  /**
   * The CSS class names of the flyout menu.
   */
  className: PropTypes.string,

  /**
   * Where to put the flyout menu, relative to the trigger UI.
   */
  direction: PropTypes.oneOf([
    FlyoutMenuDirection.BottomStart,
    FlyoutMenuDirection.BottomEnd,
    FlyoutMenuDirection.TopStart,
    FlyoutMenuDirection.TopEnd,
    FlyoutMenuDirection.LeftStart,
    FlyoutMenuDirection.LeftEnd,
    FlyoutMenuDirection.RightStart,
    FlyoutMenuDirection.RightEnd,
  ]),

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
   * If true renders the default submit / cancel footer
   * Can pass in a custom footer
   */
  transactional: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),

  /**
   * On Cancel button callback
   */
  onCancel: PropTypes.func.isRequired,

  /**
   * On Apply button callback
   */
  onApply: PropTypes.func.isRequired,

  /** Set of internationalized button names */
  i18n: PropTypes.shape({
    cancelButton: PropTypes.string,
    applyButton: PropTypes.string,
  }),

  /**
   * Define the icon render to be rendered.
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   *  Disable the button and tooltip
   */
  disabled: PropTypes.bool,

  buttonSize: PropTypes.string,

  light: PropTypes.bool,
};

const defaultProps = {
  renderIcon: SettingsAdjust,
  buttonSize: 'default',
  tooltipId: 'flyout-tooltip',
  triggerId: 'flyout-trigger-id',
  defaultOpen: false,
  children: undefined,
  className: '',
  transactional: false,
  tabIndex: 0,
  testId: 'flyout-menu',
  direction: FlyoutMenuDirection.BottomStart,
  i18n: {
    cancelButtonText: 'Cancel',
    applyButtonText: 'Apply',
  },
  disabled: false,
  light: true,
};

FlyoutMenu.propTypes = propTypes;
FlyoutMenu.defaultProps = defaultProps;

export default FlyoutMenu;
