import React, { useRef, useState, useLayoutEffect } from 'react';
import classNames from 'classnames';
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

const getTooltipDirection = direction => {
  switch (direction) {
    case FlyoutMenuDirection.TopStart:
    case FlyoutMenuDirection.TopEnd:
      return 'top';
    case FlyoutMenuDirection.RightStart:
    case FlyoutMenuDirection.RightEnd:
      return 'right';
    case FlyoutMenuDirection.LeftStart:
    case FlyoutMenuDirection.LeftEnd:
      return 'left';
    default:
      return 'bottom';
  }
};

const borderWidth = 1;

const getMenuOffset = (direction, menuOffset, tooltipContentRef, buttonRef) => {
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

  const buttonWidth = buttonRef.current ? buttonRef.current.getBoundingClientRect().width : 0;

  let rtlOffset = buttonWidth;

  switch (direction) {
    case FlyoutMenuDirection.BottomEnd:
      topOffset = -caretHeight;
      leftOffset = -tooltipWidth / 2 - caretWidth + buttonWidth;
      break;
    case FlyoutMenuDirection.TopStart:
      leftOffset = caretWidth + tooltipWidth / 2 + borderWidth;
      topOffset = caretHeight;
      break;
    case FlyoutMenuDirection.TopEnd:
      leftOffset = -tooltipWidth / 2 - caretWidth + buttonWidth - borderWidth;
      topOffset = caretHeight;
      break;
    case FlyoutMenuDirection.LeftStart:
      topOffset = tooltipHeight / 2 + caretHeight - borderWidth;
      rtlOffset = 0;
      break;
    case FlyoutMenuDirection.LeftEnd:
      topOffset = -tooltipHeight / 2 + caretHeight + caretWidth - borderWidth;
      rtlOffset = 0;
      break;
    case FlyoutMenuDirection.RightStart:
      topOffset = tooltipHeight / 2 + borderWidth;
      rtlOffset = 0;
      break;
    case FlyoutMenuDirection.RightEnd:
      topOffset = caretWidth - tooltipHeight / 2 + borderWidth;
      rtlOffset = 0;
      break;
    default:
      // Bottom Start
      leftOffset = caretWidth + tooltipWidth / 2 + borderWidth;
      topOffset = -caretHeight;
  }

  if (document.dir === 'rtl') {
    leftOffset -= rtlOffset;
  }

  return {
    top: topOffset + menuOffset.top,
    left: leftOffset + menuOffset.left,
  };
};

const FlyoutMenu = ({
  buttonSize,
  direction,
  menuOffset,
  defaultOpen,
  iconDescription,
  children,
  disabled,
  i18n,
  light,
  renderIcon,
  testId,
  tooltipClassName,
  passive,
  customFooter,
  onApply,
  onCancel,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [justOpened, setJustOpened] = useState(false);

  const buttonRef = useRef(null);
  const tooltipContentRef = useRef(null);
  const tooltipRef = React.createRef();

  useLayoutEffect(
    () => {
      if (isOpen && !justOpened) {
        setJustOpened(true);
      } else if (!isOpen) {
        setJustOpened(false);
      }
    },
    [isOpen, justOpened, tooltipRef]
  );

  useLayoutEffect(
    () => {
      if (justOpened && isOpen) {
        tooltipRef.current.focus();
      }
    },
    [isOpen, justOpened, tooltipRef]
  );

  const defaultFooter =
    passive === false ? (
      <div className={`${iotPrefix}-flyout-menu__bottom-container`}>
        <Button
          className={`${iotPrefix}-flyout-menu__cancel`}
          kind="secondary"
          testId="flyout-menu-cancel"
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
          testId="flyout-menu-apply"
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

  const tooltipDirection = getTooltipDirection(direction);

  return (
    <div ref={buttonRef} className={classNames([`${iotPrefix}-flyout-menu`], tooltipDirection)}>
      <Button
        aria-label={iconDescription}
        iconDescription={iconDescription}
        className={classNames([`${iotPrefix}-flyout-menu__trigger-button`], {
          [`${iotPrefix}-flyout-menu__light`]: light,
          [`${iotPrefix}-flyout-menu--open`]: isOpen,
        })}
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
            className={classNames(tooltipClassName, [`${iotPrefix}-flyout-menu--body`], {
              [`${iotPrefix}-flyout-menu__light`]: light,
            })}
            iconDescription={iconDescription}
            data-testid={testId}
            showIcon={false}
            open={isOpen}
            direction={tooltipDirection}
            menuOffset={() => getMenuOffset(direction, menuOffset, tooltipContentRef, buttonRef)}
            {...props}
          >
            <div ref={tooltipContentRef}>
              <div style={{ overflow: 'scroll' }} ref={tooltipRef} tabIndex={-1} />
              {children}

              {customFooter === null ? (
                defaultFooter
              ) : (
                <div className={`${iotPrefix}-flyout-menu__bottom-container-custom`}>
                  {customFooter}
                </div>
              )}
            </div>
            <div
              className={classNames(direction, [`${iotPrefix}-flyout-menu__shadow-block`], {
                [`${iotPrefix}-flyout-menu__light`]: light,
              })}
              style={{
                width: buttonRef.current
                  ? buttonRef.current.getBoundingClientRect().width - borderWidth * 2
                  : 0,
                height: buttonRef.current ? buttonRef.current.getBoundingClientRect().height : 0,
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
  tooltipClassName: PropTypes.string,

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
   * The adjustment of the flyout position.
   */
  menuOffset: PropTypes.oneOfType([
    PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
    }),
    PropTypes.func,
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
   * Will not render a footer
   */
  passive: PropTypes.bool,

  /**
   * Content to be rendered in place of the normal footer
   */
  customFooter: PropTypes.node,

  /**
   * On Cancel button callback
   */
  onCancel: PropTypes.func,

  /**
   * On Apply button callback
   */
  onApply: PropTypes.func,

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
  tooltipClassName: '',
  passive: false,
  customFooter: null,
  tabIndex: 0,
  testId: 'flyout-menu',
  direction: FlyoutMenuDirection.BottomStart,
  menuOffset: {
    left: 0,
    top: 0,
  },
  i18n: {
    cancelButtonText: 'Cancel',
    applyButtonText: 'Apply',
  },
  onCancel: null,
  onApply: null,
  disabled: false,
  light: true,
};

FlyoutMenu.propTypes = propTypes;
FlyoutMenu.defaultProps = defaultProps;

export default FlyoutMenu;
