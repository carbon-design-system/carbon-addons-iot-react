/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { OverflowMenu as CarbonOverflowMenu } from 'carbon-components-react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getMenuOffset } from 'carbon-components-react/es/components/OverflowMenu/OverflowMenu';
import { keys, matches as keyCodeMatches } from 'carbon-components-react/es/internal/keyboard';
import ClickListener from 'carbon-components-react/es/internal/ClickListener';
import { PrefixContext } from 'carbon-components-react/es/internal/usePrefix';
import mergeRefs from 'carbon-components-react/es/tools/mergeRefs';
import FloatingMenu, {
  DIRECTION_TOP,
  DIRECTION_BOTTOM,
} from 'carbon-components-react/es/internal/FloatingMenu';
import { OverflowMenuVertical20 } from '@carbon/icons-react';
import { useLangDirection } from 'use-lang-direction';

import { usePopoverPositioning } from '../../hooks/usePopoverPositioning';
import { settings } from '../../constants/Settings';
import Button from '../Button';

export { OverflowMenuItem } from 'carbon-components-react';

const { prefix: carbonPrefix, iotPrefix } = settings;

const on = (element, ...args) => {
  element.addEventListener(...args);
  return {
    release() {
      element.removeEventListener(...args);
      return null;
    },
  };
};

const checkOverflowX = (parent, child, langDir) => {
  if (langDir === 'ltr') {
    const childRect = child.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return childRect.left + childRect.width > parentRect.left + parentRect.width;
  }

  return child.getBoundingClientRect().left < parent.getBoundingClientRect().left;
};

class IotOverflowMenu extends Component {
  state = {};

  static propTypes = {
    /**
     * The ARIA label.
     */
    ariaLabel: PropTypes.string,

    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * The menu direction.
     */
    direction: PropTypes.oneOf([DIRECTION_TOP, DIRECTION_BOTTOM]),

    /**
     * `true` if the menu alignment should be flipped.
     */
    flipped: PropTypes.bool,

    /**
     * Enable or disable focus trap behavior
     */
    focusTrap: PropTypes.bool,

    /**
     * The CSS class for the icon.
     */
    iconClass: PropTypes.string,

    /**
     * The icon description.
     */
    iconDescription: PropTypes.string.isRequired,

    /**
     * The element ID.
     */
    // eslint-disable-next-line react/require-default-props
    id: PropTypes.string,

    /**
     * `true` to use the light version. For use on $ui-01 backgrounds only.
     * Don't use this to make OverflowMenu background color same as container background color.
     */
    light: PropTypes.bool,

    /**
     * The adjustment in position applied to the floating menu.
     */
    menuOffset: PropTypes.oneOfType([
      PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
      }),
      PropTypes.func,
    ]),

    /**
     * The adjustment in position applied to the floating menu.
     */
    menuOffsetFlip: PropTypes.oneOfType([
      PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
      }),
      PropTypes.func,
    ]),

    /**
     * The class to apply to the menu options
     */
    menuOptionsClass: PropTypes.string,

    /**
     * The event handler for the `click` event.
     */
    onClick: PropTypes.func,

    /**
     * Function called when menu is closed
     */
    onClose: PropTypes.func,

    /**
     * The event handler for the `focus` event.
     */
    onFocus: PropTypes.func,

    /**
     * The event handler for the `keydown` event.
     */
    onKeyDown: PropTypes.func,

    /**
     * Function called when menu is opened
     */
    onOpen: PropTypes.func,

    /**
     * `true` if the menu should be open.
     */
    open: PropTypes.bool,

    /**
     * Function called to override icon rendering.
     */
    renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

    /**
     * Specify a CSS selector that matches the DOM element that should
     * be focused when the OverflowMenu opens
     */
    selectorPrimaryFocus: PropTypes.string,

    /**
     * Specify the size of the OverflowMenu. Currently supports either `sm`, 'md' (default) or 'lg` as an option.
     */
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),

    /**
     * Test id for the trigger component
     */
    'data-testid': PropTypes.string.isRequired,

    /**
     * Direction of the text
     */
    langDir: PropTypes.oneOf(['ltr', 'rtl']),

    /**
     * Specify the alignment of the tooltip to the icon-only button.
     * Can be one of: start, center, or end.
     */
    tooltipAlignment: PropTypes.oneOf(['start', 'center', 'end']),

    /**
     * Specify the direction of the tooltip for icon-only buttons.
     * Can be either top, right, bottom, or left.
     */
    tooltipPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  };

  // eslint-disable-next-line react/sort-comp
  static contextType = PrefixContext;

  static defaultProps = {
    ariaLabel: 'open and close list of options',
    children: [],
    className: '',
    direction: DIRECTION_BOTTOM,
    flipped: false,
    focusTrap: true,
    iconClass: '',
    open: false,
    onClick: () => {},
    onKeyDown: () => {},
    onClose: () => {},
    onOpen: () => {},
    onFocus: () => {},
    menuOffset: getMenuOffset,
    menuOffsetFlip: getMenuOffset,
    menuOptionsClass: '',
    light: false,
    langDir: 'ltr',
    renderIcon: OverflowMenuVertical20,
    selectorPrimaryFocus: '[data-overflow-menu-primary-focus]',
    tooltipAlignment: 'center',
    tooltipPosition: 'top',
    size: 'md',
  };

  /**
   * The handle of `onfocusin` or `focus` event handler.
   * @private
   */
  // eslint-disable-next-line react/sort-comp
  _hFocusIn = null;

  /**
   * The timeout handle for handling `blur` event.
   * @private
   */
  _hBlurTimeout;

  /**
   * The element ref of the tooltip's trigger button.
   * @type {React.RefObject<Element>}
   * @private
   */
  _triggerRef = React.createRef();

  componentDidMount() {
    const { langDir } = this.props;
    const tooltip = this._triggerRef.current.querySelector(`.${carbonPrefix}--assistive-text`);
    const parent = this._triggerRef.current.parentElement;
    if (tooltip && parent) {
      const hasOverflowX = checkOverflowX(parent, tooltip, langDir);

      this.setState((prevState) => ({
        ...prevState,
        tooltipAlignment:
          hasOverflowX && langDir === 'ltr'
            ? 'end'
            : hasOverflowX
            ? 'start'
            : prevState.tooltipAlignment,
      }));
    }
  }

  componentDidUpdate(_, prevState) {
    const { onClose } = this.props;
    // eslint-disable-next-line react/destructuring-assignment
    if (!this.state.open && prevState.open) {
      onClose();
    }
  }

  static getDerivedStateFromProps({ open, tooltipAlignment }, state) {
    const { prevOpen } = state;
    return prevOpen === open
      ? null
      : {
          open,
          prevOpen: open,
          tooltipAlignment,
        };
  }

  componentWillUnmount() {
    if (typeof this._hBlurTimeout === 'number') {
      clearTimeout(this._hBlurTimeout);
      this._hBlurTimeout = undefined;
    }
  }

  handleClick = (evt) => {
    evt.stopPropagation();
    if (!this._menuBody || !this._menuBody.contains(evt.target)) {
      this.setState((prevState) => ({
        ...prevState,
        open: !prevState.open,
      }));
      this.props.onClick(evt);
    }
  };

  handleKeyPress = (evt) => {
    if (
      this.state.open &&
      keyCodeMatches(evt, [keys.ArrowUp, keys.ArrowRight, keys.ArrowDown, keys.ArrowLeft])
    ) {
      evt.preventDefault();
    }

    // Close the overflow menu on escape
    if (keyCodeMatches(evt, [keys.Escape])) {
      const wasOpen = this.state.open;
      this.closeMenu(() => {
        if (wasOpen) {
          this.focusMenuEl();
        }
      });

      // Stop the esc keypress from bubbling out and closing something it shouldn't
      evt.stopPropagation();
    }
  };

  handleClickOutside = (evt) => {
    if (this.state.open && (!this._menuBody || !this._menuBody.contains(evt.target))) {
      this.closeMenu();
    }
  };

  closeMenu = (onCloseMenu) => {
    this.setState(
      (prevState) => ({
        ...prevState,
        open: false,
      }),
      () => {
        // Optional callback to be executed after the state as been set to close
        if (onCloseMenu) {
          onCloseMenu();
        }
        this.props.onClose();
      }
    );
  };

  focusMenuEl = () => {
    const { current: triggerEl } = this._triggerRef;
    if (triggerEl) {
      triggerEl.focus();
    }
  };

  /**
   * Focuses the next enabled overflow menu item given the currently focused
   * item index and direction to move
   * @param {object} params
   * @param {number} params.currentIndex - the index of the currently focused
   * overflow menu item in the list of overflow menu items
   * @param {number} params.direction - number denoting the direction to move
   * focus (1 for forwards, -1 for backwards)
   */
  handleOverflowMenuItemFocus = ({ currentIndex, direction }) => {
    const enabledIndices = React.Children.toArray(this.props.children).reduce((acc, curr, i) => {
      if (!curr.props.disabled) {
        acc.push(i);
      }
      return acc;
    }, []);
    const nextValidIndex = (() => {
      const nextIndex = enabledIndices.indexOf(currentIndex) + direction;
      switch (enabledIndices.indexOf(currentIndex) + direction) {
        case -1:
          return enabledIndices.length - 1;
        case enabledIndices.length:
          return 0;
        default:
          return nextIndex;
      }
    })();
    const { overflowMenuItem } = this[`overflowMenuItem${enabledIndices[nextValidIndex]}`];
    // eslint-disable-next-line no-unused-expressions
    overflowMenuItem?.current?.focus();
  };

  /**
   * Handles the floating menu being unmounted or non-floating menu being
   * mounted or unmounted.
   * @param {Element} menuBody The DOM element of the menu body.
   * @private
   */
  _bindMenuBody = (menuBody) => {
    if (!menuBody) {
      this._menuBody = menuBody;
    }
    if (!menuBody && this._hFocusIn) {
      this._hFocusIn = this._hFocusIn.release();
    }
  };

  /**
   * Handles the floating menu being placed.
   * @param {Element} menuBody The DOM element of the menu body.
   * @private
   */
  _handlePlace = (menuBody) => {
    if (menuBody) {
      this._menuBody = menuBody;
      const hasFocusin = 'onfocusin' in window;
      const focusinEventName = hasFocusin ? 'focusin' : 'focus';
      this._hFocusIn = on(
        menuBody.ownerDocument,
        focusinEventName,
        (event) => {
          const target = ClickListener.getEventTarget(event);
          const { current: triggerEl } = this._triggerRef;
          if (typeof target.matches === 'function') {
            if (
              !menuBody.contains(target) &&
              triggerEl &&
              !target.matches(
                `.${this.context}--overflow-menu,.${this.context}--overflow-menu-options`
              )
            ) {
              this.closeMenu();
            }
          }
        },
        !hasFocusin
      );
      this.props.onOpen();
    }
  };

  /**
   * @returns {Element} The DOM element where the floating menu is placed in.
   */
  _getTarget = () => {
    const { current: triggerEl } = this._triggerRef;
    return (triggerEl && triggerEl.closest('[data-floating-menu-container]')) || document.body;
  };

  render() {
    const prefix = this.context;
    const {
      id,
      ariaLabel,
      children,
      iconDescription,
      direction,
      flipped,
      focusTrap,
      menuOffset,
      menuOffsetFlip,
      iconClass,
      onClick,
      onOpen,
      // eslint-disable-next-line no-unused-vars
      selectorPrimaryFocus = '[data-floating-menu-primary-focus]',
      renderIcon: IconElement,
      // eslint-disable-next-line react/prop-types
      innerRef: ref,
      menuOptionsClass,
      light,
      size = 'md',
      'data-testid': testId,
      langDir,
      tooltipPosition,
      className,
      ...other
    } = this.props;

    const { open, tooltipAlignment } = this.state;

    const overflowMenuClasses = classNames(className, `${prefix}--overflow-menu`, {
      [`${prefix}--overflow-menu--open`]: open,
      [`${prefix}--overflow-menu--light`]: light,
      [`${prefix}--overflow-menu--${size}`]: size,
    });

    const overflowMenuOptionsClasses = classNames(
      menuOptionsClass,
      `${prefix}--overflow-menu-options`,
      {
        [`${prefix}--overflow-menu--flip`]: flipped,
        [`${prefix}--overflow-menu-options--open`]: open,
        [`${prefix}--overflow-menu-options--light`]: light,
        [`${prefix}--overflow-menu-options--${size}`]: size,
      }
    );

    const childrenWithProps = React.Children.toArray(children).map((child, index) =>
      React.cloneElement(child, {
        closeMenu: child?.props?.closeMenu || this.closeMenu,
        handleOverflowMenuItemFocus: this.handleOverflowMenuItemFocus,
        ref: (e) => {
          this[`overflowMenuItem${index}`] = e;
        },
        index,
      })
    );

    const menuBody = (
      <ul className={overflowMenuOptionsClasses} tabIndex="-1" role="menu" aria-label={ariaLabel}>
        {childrenWithProps}
      </ul>
    );

    const wrappedMenuBody = (
      <FloatingMenu
        focusTrap={focusTrap}
        triggerRef={this._triggerRef}
        menuDirection={direction}
        menuOffset={flipped ? menuOffsetFlip : menuOffset}
        menuRef={this._bindMenuBody}
        flipped={flipped}
        target={this._getTarget}
        onPlace={this._handlePlace}
        selectorPrimaryFocus={selectorPrimaryFocus}
      >
        {React.cloneElement(menuBody, {
          'data-floating-menu-direction': direction,
        })}
      </FloatingMenu>
    );

    return (
      <ClickListener onClickOutside={this.handleClickOutside}>
        <Button
          testId={testId}
          {...other}
          ref={mergeRefs(this._triggerRef, ref)}
          className={classNames(
            overflowMenuClasses,
            `${prefix}--btn--icon-only`,
            `${iotPrefix}--tooltip-svg-wrapper`,
            `${iotPrefix}--overflow-menu-icon`,
            {
              [`${iotPrefix}--table-toolbar-button-active`]: false, // https://github.com/carbon-design-system/carbon/issues/6160
            }
          )}
          kind="icon-selection"
          iconDescription={ariaLabel}
          onKeyDown={this.handleKeyPress}
          onClick={this.handleClick}
          renderIcon={IconElement}
          tooltipAlignment={tooltipAlignment}
          tooltipPosition={tooltipPosition}
          id={id}
          aria-haspopup
          aria-expanded={open}
        >
          {open && wrappedMenuBody}
        </Button>
      </ClickListener>
    );
  }
}

export const OverflowMenu = ({
  direction,
  menuOffset,
  useAutoPositioning,
  flipped,
  testId,
  withCarbonTooltip,
  ...props
}) => {
  const langDir = useLangDirection();
  const [calculateMenuOffset, { adjustedDirection, adjustedFlipped }] = usePopoverPositioning({
    direction,
    flipped,
    menuOffset: menuOffset || getMenuOffset,
    isOverflowMenu: true,
    useAutoPositioning,
  });

  if (withCarbonTooltip) {
    return (
      <IotOverflowMenu
        data-testid={testId}
        {...props}
        direction={adjustedDirection}
        flipped={adjustedFlipped}
        menuOffset={calculateMenuOffset}
        menuOffsetFlip={calculateMenuOffset}
        langDir={langDir}
      />
    );
  }

  return (
    <CarbonOverflowMenu
      data-testid={testId}
      {...props}
      direction={adjustedDirection}
      flipped={adjustedFlipped}
      menuOffset={calculateMenuOffset}
      menuOffsetFlip={calculateMenuOffset}
    />
  );
};

OverflowMenu.propTypes = {
  ...CarbonOverflowMenu.propTypes,
  useAutoPositioning: PropTypes.bool,
  testId: PropTypes.string,
  withCarbonTooltip: PropTypes.bool,
};

OverflowMenu.defaultProps = {
  ...CarbonOverflowMenu.defaultProps,
  useAutoPositioning: false,
  testId: 'overflow-menu',
  withCarbonTooltip: false,
};

export default OverflowMenu;
