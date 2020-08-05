import { stripUnit, rem } from 'polished';

import { settings } from '../constants/Settings';
import { FlyoutMenuDirection } from '../components/FlyoutMenu/FlyoutMenu';

const { iotPrefix, prefix } = settings;

const DIRECTION_LEFT = 'left';
const DIRECTION_TOP = 'top';
const DIRECTION_RIGHT = 'right';
const DIRECTION_BOTTOM = 'bottom';

const tooltipOffset = (menuBody, menuDirection, menuElement) => {
  const arrow = menuBody.children[0];
  const arrowWidth = 7;
  const bodyRect = menuBody.getBoundingClientRect();
  const activatorRect = menuElement.getBoundingClientRect();

  const lrOffscreenLeft = activatorRect.left - bodyRect.width - arrowWidth < 0;
  const lrOffscreenRight =
    activatorRect.right + bodyRect.width + arrowWidth >
    (window.innerWidth || document.documentElement.clientWidth);
  const lrOffscreenTop = activatorRect.top - bodyRect.height / 2 - arrowWidth < 0;
  const tbOffscreenLeft = activatorRect.left - bodyRect.width / 2 - arrowWidth < 0;
  const tbOffscreenRight =
    activatorRect.right + bodyRect.width / 2 + arrowWidth >
    (window.innerWidth || document.documentElement.clientWidth);
  const tbOffscreenTop = activatorRect.top - bodyRect.height - arrowWidth < 0;

  let arrowOffset = 0;
  const toReturn = { top: 0, left: 0 };
  switch (menuDirection) {
    case DIRECTION_TOP:
      arrowOffset =
        bodyRect.width - arrow.getBoundingClientRect().width / 2 - activatorRect.width / 2;
      if (tbOffscreenLeft) {
        arrow.style.marginRight = `${arrowOffset}px`;
        toReturn.left = bodyRect.width / 2 - activatorRect.width / 2;
      } else if (tbOffscreenRight) {
        arrow.style.marginLeft = `${arrowOffset}px`;
        toReturn.left = -(bodyRect.width / 2 - activatorRect.width / 2);
      }

      if (tbOffscreenTop) {
        toReturn.top = -bodyRect.height - activatorRect.height - arrowWidth;
        menuBody.setAttribute('data-floating-menu-direction', DIRECTION_BOTTOM);
      } else {
        toReturn.top = arrowWidth;
      }
      break;

    case DIRECTION_LEFT:
      if (lrOffscreenTop) {
        arrowOffset = -bodyRect.height / 2;
        toReturn.top = bodyRect.height / 2;
      }

      if (lrOffscreenLeft) {
        menuBody.setAttribute('data-floating-menu-direction', DIRECTION_RIGHT);
        arrow.style.marginTop = `${arrowOffset + 12}px`;
        toReturn.left = -bodyRect.width - activatorRect.width - arrowWidth;
      } else {
        arrow.style.marginTop = `${arrowOffset}px`;
        toReturn.left = arrowWidth;
      }
      break;

    case DIRECTION_RIGHT:
      if (lrOffscreenTop) {
        arrowOffset = -bodyRect.height / 2 + 12;
        toReturn.top = bodyRect.height / 2 - 12;
      }

      if (lrOffscreenRight) {
        menuBody.setAttribute('data-floating-menu-direction', DIRECTION_LEFT);
        arrow.style.marginTop = `${arrowOffset - 12}px`;
        toReturn.left = -bodyRect.width - activatorRect.width - arrowWidth;
      } else {
        arrow.style.marginTop = `${arrowOffset}px`;
        toReturn.left = arrowWidth;
      }
      break;

    case DIRECTION_BOTTOM:
    default:
      toReturn.top = arrowWidth;
      arrowOffset =
        bodyRect.width - arrow.getBoundingClientRect().width / 2 - activatorRect.width / 2;
      if (tbOffscreenLeft) {
        arrow.style.marginRight = `${arrowOffset}px`;
        toReturn.left = bodyRect.width / 2 - activatorRect.width / 2;
      } else if (tbOffscreenRight) {
        arrow.style.marginLeft = `${arrowOffset}px`;
        toReturn.left = -(bodyRect.width / 2 - activatorRect.width / 2);
      }
      break;
  }

  return toReturn;
};

const overflowMenuOffset = (menuBody, menuElement, flipped) => {
  const bodyRect = menuBody.getBoundingClientRect();
  const activatorRect = menuElement.getBoundingClientRect();
  const leftOffset = bodyRect.width / 2 - activatorRect.width / 2;
  const rightBound = window.innerWidth || document.documentElement.clientWidth;
  const toReturn = { top: 0, left: leftOffset };
  if (flipped) {
    if (activatorRect.right <= bodyRect.width) {
      menuBody.classList.remove(`${prefix}--overflow-menu--flip`);
    } else {
      toReturn.left = -leftOffset;
    }
  } else if (rightBound <= activatorRect.left + bodyRect.width) {
    menuBody.classList.add(`${prefix}--overflow-menu--flip`);
    toReturn.left = -leftOffset;
  }
  return toReturn;
};

const getClassName = (flowDown, flowRight) => {
  let toReturn = `${iotPrefix}--flyout-menu--body__`;
  toReturn += flowDown ? 'bottom-' : 'top-';
  toReturn += flowRight ? 'start' : 'end';
  return toReturn;
};

const flyoutMenuOffset = (menuBody, menuDirection, menuElement) => {
  const toReturn = { top: 0, left: 0 };

  const bodyRect = menuBody.getBoundingClientRect();
  const activatorRect = menuElement.getBoundingClientRect();
  const rightBound = window.innerWidth || document.documentElement.clientWidth;
  const bottomBound = window.innerHeight || document.documentElement.clientHeight;
  const flowDown =
    (activatorRect.top + activatorRect.bottom) / 2 <= 0.7 * bottomBound ||
    activatorRect.top - bodyRect.height <= 0;
  const flowRight = (activatorRect.right + activatorRect.left) / 2 <= 0.5 * rightBound;
  switch (menuDirection) {
    case FlyoutMenuDirection.TopEnd:
      if (flowDown) {
        toReturn.top = -(bodyRect.height + activatorRect.height);
      }
      if (flowRight) {
        toReturn.left = bodyRect.width - activatorRect.width;
      }
      break;
    case FlyoutMenuDirection.TopStart:
      if (flowDown) {
        toReturn.top = -(bodyRect.height + activatorRect.height);
      }
      if (!flowRight) {
        toReturn.left = -(bodyRect.width - activatorRect.width);
      }
      break;
    case FlyoutMenuDirection.LeftEnd:
      if (flowDown) {
        toReturn.top = bodyRect.height;
      } else {
        toReturn.top = -activatorRect.height;
      }
      if (flowRight) {
        toReturn.left = -bodyRect.width;
      } else {
        toReturn.left = -activatorRect.width;
      }
      break;
    case FlyoutMenuDirection.LeftStart:
      if (flowDown) {
        toReturn.top = activatorRect.height;
      } else {
        toReturn.top = -bodyRect.height;
      }
      if (flowRight) {
        toReturn.left = -bodyRect.width;
      } else {
        toReturn.left = -activatorRect.width;
      }
      break;
    case FlyoutMenuDirection.RightEnd:
      if (flowDown) {
        toReturn.top = bodyRect.height;
      } else {
        toReturn.top = -activatorRect.height;
      }
      if (flowRight) {
        toReturn.left = -activatorRect.width;
      } else {
        toReturn.left = -bodyRect.width;
      }
      break;
    case FlyoutMenuDirection.RightStart:
      if (flowDown) {
        toReturn.top = activatorRect.height;
      } else {
        toReturn.top = -bodyRect.height;
      }
      if (flowRight) {
        toReturn.left = -activatorRect.width;
      } else {
        toReturn.left = -bodyRect.width;
      }
      break;
    case FlyoutMenuDirection.BottomEnd:
      if (!flowDown) {
        toReturn.top = -(activatorRect.height + bodyRect.height);
      }
      if (flowRight) {
        toReturn.left = bodyRect.width - activatorRect.width;
      }
      break;
    case FlyoutMenuDirection.BottomStart:
      if (!flowDown) {
        toReturn.top = -(activatorRect.height + bodyRect.height);
      }
      if (!flowRight) {
        toReturn.left = -(bodyRect.width - activatorRect.width);
      }
      break;
    default:
  }

  const edgePadding = 16;
  const offscreenRight = bodyRect.width + activatorRect.left + edgePadding > rightBound;
  const offscreenLeft = activatorRect.right - bodyRect.width - edgePadding < 0;
  if (flowRight && offscreenRight) {
    if (
      menuDirection === FlyoutMenuDirection.LeftEnd ||
      menuDirection === FlyoutMenuDirection.LeftStart
    ) {
      toReturn.left -= rightBound - (activatorRect.left + bodyRect.width + edgePadding);
    } else {
      toReturn.left += rightBound - (activatorRect.left + bodyRect.width + edgePadding);
    }
    menuBody.children[1].style.setProperty(
      '--after-offset',
      `${stripUnit(rem(activatorRect.left + bodyRect.width + edgePadding - rightBound)) - 1}rem`
    );
  } else if (!flowRight && offscreenLeft) {
    if (
      menuDirection === FlyoutMenuDirection.LeftEnd ||
      menuDirection === FlyoutMenuDirection.LeftStart
    ) {
      toReturn.left += activatorRect.right - bodyRect.width - edgePadding;
    } else {
      toReturn.left += -(activatorRect.right - bodyRect.width - edgePadding);
    }
    menuBody.children[1].style.setProperty(
      '--after-offset',
      `${stripUnit(rem(-activatorRect.right + bodyRect.width + edgePadding)) - 1}rem`
    );
  }
  menuBody.classList.remove(`${iotPrefix}--flyout-menu--body__${menuDirection}`);
  menuBody.classList.add(getClassName(flowDown, flowRight));
  return toReturn;
};

const menuOffset = (menuBody, menuDirection, menuElement, flipped) => {
  if (!window || !document) {
    return { top: 0, left: 0 };
  }

  if (menuBody.classList.contains(`${prefix}--tooltip`)) {
    return tooltipOffset(menuBody, menuDirection, menuElement);
  }

  if (menuBody.classList.contains(`${prefix}--overflow-menu-options`)) {
    return overflowMenuOffset(menuBody, menuElement, flipped);
  }

  if (menuElement.classList.contains(`${iotPrefix}--flyout-menu`)) {
    return flyoutMenuOffset(menuBody.parentElement.parentElement, menuDirection, menuElement);
  }
  return { top: 0, left: 0 };
};

export default menuOffset;
