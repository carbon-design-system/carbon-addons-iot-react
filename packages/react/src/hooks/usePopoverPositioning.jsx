import * as React from 'react';
import { useLangDirection } from 'use-lang-direction';

/**
 * constant override to fix the calculated result returned from getMenuOffset in carbon
 */
const RTL_OFFSET_FIX = 15;

/**
 * This is used as the callback for menuOffset on Tooltips, OverflowMenus, and FlyoutMenus.
 * That callback returns the underlying FloatingMenu element, direction, trigger element, and flipped
 * prop. It grabs the window dimensions and bounds for the menu element and determines if it is
 * overflowing the window. It returns a string indicating which directions are overflowing using the
 * same order as positioning in CSS. top, right, bottom, left. So an element can overflow on the
 * 'top-left', 'right-bottom', 'bottom-left', etc, etc.
 *
 * @param {HTMLElement} menuBody The underlying carbon FloatingMenu element
 * @param {string} menuDirection The direction prop
 * @param {HTMLElement} menuButton The button triggering the menu
 */
const isOffscreen = (
  parentElementTop,
  parentElementBottom,
  menuBody,
  menuDirection,
  menuButton /* , flipped, offset */
) => {
  const buttonRect = menuButton.getBoundingClientRect();
  const tooltipRect = menuBody.getBoundingClientRect();

  const inputTopAndTriggerButtonTopGap = parentElementTop ? buttonRect.top - parentElementTop : 0;
  const inputBottomAndTriggerButtonBottomGap = parentElementBottom
    ? parentElementBottom - buttonRect.bottom
    : 0;

  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const offTop = buttonRect.top - tooltipRect.height - inputTopAndTriggerButtonTopGap < 0;
  const offLeft = buttonRect.left - tooltipRect.width < 0;
  const offRight = buttonRect.right + tooltipRect.width > windowWidth;
  const offBottom =
    buttonRect.bottom + tooltipRect.height + inputBottomAndTriggerButtonBottomGap > windowHeight;
  const T = offTop ? 'top' : '';
  const R = offRight ? 'right' : '';
  const B = offBottom ? 'bottom' : '';
  const L = offLeft ? 'left' : '';

  return [T, R, B, L].filter(Boolean).join('-');
};

/**
 * This is used as the callback for menuOffset ONLY on Tooltips. It's needed due to
 * truncation that might happen on Tooltip trigger, therefore we need to consider
 * right position of the trigger as well. This function is used as an enhancement for
 * the isOffscreen method.
 *
 * @param {HTMLElement} menuBody The underlying carbon FloatingMenu element
 * @param {string} menuDirection The direction prop
 * @param {HTMLElement} menuButton The button triggering the menu
 * @returns {string} 'start', 'center' or 'end'
 */
const getTooltipAlignment = (menuBody, menuDirection, menuButton) => {
  const buttonRect = menuButton.getBoundingClientRect();
  const tooltipRect = menuBody.getBoundingClientRect();
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const triggerCenter = (buttonRect.left + buttonRect.right) / 2;
  const tooltipCenter = tooltipRect.width / 2;
  if (triggerCenter - tooltipCenter < 0) {
    return 'start';
  }
  if (triggerCenter + tooltipCenter > windowWidth) {
    return 'end';
  }

  return 'center';
};

/**
 * Given a subset of props from the Tooltip, OverflowMenu, or FlyoutMenu. This hook returns a decorator
 * function around the original menuOffset function. It determines if the element overflows using that
 * internal callback from the carbon FloatingMenu and adjusts the direction, flipped, and menuOffset
 * properties accordingly.
 */
export const usePopoverPositioning = ({
  /**
   * The menuOffset as used by Tooltips, etc.
   */
  menuOffset,
  /**
   * The direction passed to the original Tooltip, OverflowMenu, or FlyoutMenu components.
   * could be top, bottom, left, right, top-start, top-end, right-start, right-end, bottom-start,
   * bottom-end, left-start, or left-end
   */
  direction = 'bottom',

  /**
   * Boolean to determine if the OverflowMenu is flipped.
   */
  flipped = false,

  /**
   * On necessary on the OverflowMenu, b/c we can't know if it's a Tooltip or OverflowMenu
   * since they both use top and bottom directions. This isn't necessary on the FlyoutMenu b/c
   * it has `-start` or `-end` suffixes, and lets us presume it's a flyout.
   */
  isOverflowMenu = false,

  /**
   * Turn off AutoPositioning and simply return the original menuOffset and directions without
   * adjustments.
   */
  useAutoPositioning = true,

  /**
   * The alignment pass to the original Tooltip, OverflowMenu, or FlyoutMenu components.
   * Could be 'start', 'center' or 'end'
   */
  defaultAlignment = 'center',

  /**
   * The top of the parent element
   */
  parentElementTop,

  /**
   * The bottom of the parent element
   */
  parentElementBottom,
}) => {
  const [adjustedDirection, setAdjustedDirection] = React.useState();
  const [adjustedAlignment, setAdjustedAlignment] = React.useState(defaultAlignment);
  const [adjustedFlipped, setAdjustedFlipped] = React.useState();
  const [{ flyoutAlignment }, setDirections] = React.useState({});
  const previousDirection = React.useRef();
  const langDir = useLangDirection();

  React.useEffect(() => {
    previousDirection.current = direction;
    setAdjustedDirection(direction);
    setDirections({
      tooltipDirection: direction.split('-')[0],
      flyoutAlignment: direction.split('-')[1],
    });
    setAdjustedFlipped(flipped);
  }, [direction, flipped]);

  /**
   * if the original menuOffset is a function, splice the updated direction and flipped
   * properties into the callback to get the appropriate values based on the new state, not
   * the original props. Otherwise, just return the offset object passed.
   */
  const getOffset = React.useCallback(
    (...args) => {
      // splice in adjusted direction and flip to calculate new appropriate offset.
      args.splice(1, 1, adjustedDirection);
      args.splice(3, 1, adjustedFlipped);

      return typeof menuOffset === 'function' ? menuOffset(...args) : menuOffset;
    },
    [adjustedDirection, adjustedFlipped, menuOffset]
  );

  const getAdjustedOffset = React.useCallback(
    (tooltipElement, flyoutDirection, buttonElement) => {
      const tooltipRect = tooltipElement.getBoundingClientRect();
      const buttonRect = flyoutAlignment
        ? buttonElement.parentNode.getBoundingClientRect()
        : buttonElement.getBoundingClientRect();
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      const directionChange = `${previousDirection.current}->${adjustedDirection}`;
      if (previousDirection.current !== adjustedDirection && flyoutAlignment) {
        switch (directionChange) {
          default:
            return {
              top: tooltipRect.y - buttonRect.y,
              left: tooltipRect.x - buttonRect.x,
            };
        }
      }

      let left = 0;

      if (langDir === 'rtl' && isOverflowMenu) {
        left -= RTL_OFFSET_FIX;
      }

      if (previousDirection.current !== adjustedDirection) {
        switch (directionChange) {
          case 'bottom->left':
            return {
              top: tooltipRect.right >= windowWidth ? 9 : 0,
              left: tooltipRect.right >= windowWidth ? tooltipRect.right - buttonRect.left + 3 : 0,
            };
          case 'top->left': {
            return {
              top: tooltipRect.right >= windowWidth ? 9 : 0,
              left: tooltipRect.right >= windowWidth ? tooltipRect.right - buttonRect.right + 3 : 0,
            };
          }
          default:
            return {
              top: 0,
              left,
            };
        }
      }

      // the flyout menus are off-by-one in either direction
      // depending on if it's left or right oriented.
      if (flyoutAlignment) {
        return {
          top: adjustedDirection.includes('right')
            ? -1
            : adjustedDirection.includes('left')
            ? 1
            : 0,
          left,
        };
      }

      return {
        top: 0,
        left,
      };
    },
    [adjustedDirection, flyoutAlignment, isOverflowMenu, langDir]
  );

  /**
   * given the directions of overflow, adjust the direction of the tooltip
   * or flyout menu to allow it to stay within the bounds of the screen.
   *
   * For example, a tooltip with given direction of `left` that overflows to the left will adjust
   * the direction to `right`. A flyout menu given `left-end` that overflows to the `top-left` will
   * be adjusted to `right-start`.
   */
  const fixOverflow = React.useCallback(
    (overflow, menuOffsetArgs, alignment) => {
      const [tooltipElement] = menuOffsetArgs;

      setAdjustedAlignment(alignment);

      switch (overflow) {
        case 'top':
          if (flyoutAlignment) {
            setAdjustedDirection(`bottom-${flyoutAlignment}`);
            tooltipElement.setAttribute('data-floating-menu-direction', 'bottom');
          } else {
            setAdjustedDirection('bottom');
          }
          break;
        case 'right':
        case 'top-right':
          if (direction === 'bottom-end') {
            break;
          }
          if (flyoutAlignment) {
            // fixes an edge case where if the flyout is right-end,
            // and causes an overflow to the top-right, then we need to
            // switch it to a left-start to fix both the overflow on the top
            // and bottom at the same time.
            if (overflow === 'top-right' && flyoutAlignment === 'end') {
              setAdjustedDirection(`left-start`);
            } else {
              setAdjustedDirection(`left-${flyoutAlignment}`);
            }
            tooltipElement.setAttribute('data-floating-menu-direction', 'left');
          } else if (isOverflowMenu) {
            setAdjustedFlipped(true);
            setAdjustedDirection((prevDirection) => (prevDirection === 'top' ? 'top' : 'bottom'));
            tooltipElement.setAttribute('data-floating-menu-direction', 'bottom');
          } else {
            setAdjustedDirection('left');
          }
          break;
        case 'right-bottom':
          if (flyoutAlignment) {
            setAdjustedDirection('top-end');
            tooltipElement.setAttribute('data-floating-menu-direction', 'top');
          } else if (isOverflowMenu) {
            setAdjustedDirection('top');
            setAdjustedFlipped(true);
            tooltipElement.setAttribute('data-floating-menu-direction', 'top');
          } else {
            setAdjustedDirection('left');
          }
          break;
        case 'bottom':
          if (flyoutAlignment) {
            setAdjustedDirection(`top-${flyoutAlignment}`);
            tooltipElement.setAttribute('data-floating-menu-direction', 'top');
          } else {
            setAdjustedDirection('top');
          }
          break;
        case 'left':
        case 'top-left':
          if (flyoutAlignment) {
            setAdjustedDirection('right-start');
            tooltipElement.setAttribute('data-floating-menu-direction', 'right');
          } else if (isOverflowMenu) {
            setAdjustedFlipped(false);
            setAdjustedDirection((prevDirection) => (prevDirection === 'top' ? 'top' : 'bottom'));
            tooltipElement.setAttribute('data-floating-menu-direction', 'bottom');
          } else {
            setAdjustedDirection('right');
          }
          break;
        case 'bottom-left':
          if (flyoutAlignment) {
            setAdjustedDirection('top-start');
            tooltipElement.setAttribute('data-floating-menu-direction', 'top');
          } else if (isOverflowMenu) {
            setAdjustedDirection('top');
            setAdjustedFlipped(false);
            tooltipElement.setAttribute('data-floating-menu-direction', 'top');
          } else {
            setAdjustedDirection('right');
          }
          break;
        case 'top-bottom':
          if (direction === 'bottom-end') {
            break;
          }
          if (flyoutAlignment) {
            setAdjustedDirection(`bottom-${flyoutAlignment}`);
            tooltipElement.setAttribute('data-floating-menu-direction', 'bottom');
          } else {
            setAdjustedDirection('bottom');
          }
          break;
        default:
          break;
      }

      // given the original offset calculate the difference between the original
      // position and the new position and return that value.
      const adjustedOffset = getAdjustedOffset(...menuOffsetArgs);
      const newOffset = getOffset(...menuOffsetArgs);

      previousDirection.current = adjustedDirection;

      return {
        top: newOffset.top + adjustedOffset.top,
        left: newOffset.left + adjustedOffset.left,
      };
    },
    [adjustedDirection, direction, flyoutAlignment, getAdjustedOffset, getOffset, isOverflowMenu]
  );

  /**
   * calculate menu offset is returned from the hook as a wrapper around the default
   * menuOffset functions for each component. This function, as a callback passed as menuOffset,
   * to the tooltips, flyout menus, etc, checks if the element overflows and adjusts the direction
   * and offset accordingly if it's fixable.
   */
  const calculateMenuOffset = React.useCallback(
    (...args) => {
      const defaultOffset = getOffset(...args);

      if (langDir === 'rtl' && isOverflowMenu) {
        defaultOffset.left -= RTL_OFFSET_FIX;
      }

      if (!useAutoPositioning) {
        return defaultOffset;
      }

      // determine if the element is off-screen.
      const overflow = isOffscreen(parentElementTop, parentElementBottom, ...args, defaultOffset);

      // determine if the element has new alignment
      const alignment = getTooltipAlignment(...args);

      // if it's offscreen in a direction we can fix, do so
      // otherwise leave it be. ie. 'top-left' is fixable, but
      // a large element with 'top-right-left' wouldn't be.
      switch (overflow) {
        case 'top-right':
        case 'right-bottom':
        case 'bottom-left':
        case 'top-left':
        case 'top':
        case 'right':
        case 'bottom':
        case 'top-bottom':
          return fixOverflow(overflow, [...args], alignment);
        case 'left':
          return fixOverflow(overflow, [...args], alignment);
        default:
          return defaultOffset;
      }
    },
    [
      fixOverflow,
      getOffset,
      isOverflowMenu,
      langDir,
      parentElementBottom,
      parentElementTop,
      useAutoPositioning,
    ]
  );

  /**
   * These adjusted valued are updated when the calculateMenuOffset is called, and are passed
   * to the tooltip, overflow menu, or flyout menu instead of the original given direction if the
   * element overflows.
   */
  return [calculateMenuOffset, { adjustedDirection, adjustedFlipped, adjustedAlignment }];
};
