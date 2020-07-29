import { settings } from '../constants/Settings';

const { prefix } = settings;

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
    case 'top':
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
        menuBody.setAttribute('data-floating-menu-direction', 'bottom');
      } else {
        toReturn.top = arrowWidth;
      }
      break;

    case 'left':
      if (lrOffscreenTop) {
        arrowOffset = -bodyRect.height / 2;
        toReturn.top = bodyRect.height / 2;
      }

      if (lrOffscreenLeft) {
        menuBody.setAttribute('data-floating-menu-direction', 'right');
        arrow.style.marginTop = `${arrowOffset + 12}px`;
        toReturn.left = -bodyRect.width - activatorRect.width - arrowWidth;
      } else {
        arrow.style.marginTop = `${arrowOffset}px`;
        toReturn.left = arrowWidth;
      }
      break;

    case 'right':
      if (lrOffscreenTop) {
        arrowOffset = -bodyRect.height / 2 + 12;
        toReturn.top = bodyRect.height / 2 - 12;
      }

      if (lrOffscreenRight) {
        menuBody.setAttribute('data-floating-menu-direction', 'left');
        arrow.style.marginTop = `${arrowOffset - 12}px`;
        toReturn.left = -bodyRect.width - activatorRect.width - arrowWidth;
      } else {
        arrow.style.marginTop = `${arrowOffset}px`;
        toReturn.left = arrowWidth;
      }
      break;

    case 'bottom':
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
  const toReturn = { top: 0, left: leftOffset };
  if (flipped) {
    if (activatorRect.right <= bodyRect.width) {
      menuBody.classList.remove(`${prefix}--overflow-menu--flip`);
    } else {
      toReturn.left = -leftOffset;
    }
  } else if (document.documentElement.clientWidth <= activatorRect.left + bodyRect.width) {
    menuBody.classList.add(`${prefix}--overflow-menu--flip`);
    toReturn.left = -leftOffset;
  }
  return toReturn;
};

export const menuOffset = (menuBody, menuDirection, menuElement, flipped) => {
  if (!window || !document) {
    return { top: 0, left: 0 };
  }

  if (menuBody.classList.contains(`${prefix}--tooltip`)) {
    return tooltipOffset(menuBody, menuDirection, menuElement);
  }

  if (menuBody.classList.contains(`${prefix}--overflow-menu-options`)) {
    return overflowMenuOffset(menuBody, menuElement, flipped);
  }
  return { top: 0, left: 0 };
};
