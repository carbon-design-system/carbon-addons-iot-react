import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';

const { prefix } = settings;

const menuOffset = (menuBody, menuDirection, menuElement, flipped) => {
  const bodyRect = menuBody.getBoundingClientRect();
  const activatorRect = menuElement.getBoundingClientRect();
  if (
    menuElement.parentElement.parentElement.classList.contains(`${prefix}--tooltip__label`) ||
    menuElement.parentElement.classList.contains(`${prefix}--tooltip__label`) ||
    menuElement.classList.contains(`${prefix}--tooltip__label`)
  ) {
    // if tooltip
    const arrow = menuBody.children[0];
    if (menuDirection === 'bottom') {
      if (activatorRect.left - bodyRect.width / 2 < 0) {
        // if off page on left, open on right
        arrow.style.marginRight = `${bodyRect.width -
          arrow.getBoundingClientRect().width / 2 -
          activatorRect.width / 2}px`;
        return { top: 7, left: bodyRect.width / 2 - activatorRect.width / 2 };
      }
      if (
        activatorRect.right + bodyRect.width / 2 >
        (window.innerWidth || document.documentElement.clientWidth)
      ) {
        // if off page on right, open on left
        arrow.style.marginLeft = `${bodyRect.width -
          arrow.getBoundingClientRect().width / 2 -
          activatorRect.width / 2}px`;
        return { top: 7, left: -(bodyRect.width / 2 - activatorRect.width / 2) };
      }
      return { top: 7, left: 0 };
    }
  } else if (menuElement.classList.contains(`${prefix}--overflow-menu`)) {
    // if overflow menu
    if (flipped) {
      if (activatorRect.right <= bodyRect.width) {
        // if offscreen on left, open on right
        menuBody.classList.remove('bx--overflow-menu--flip');
        return { top: 0, left: bodyRect.width / 2 - activatorRect.width / 2 };
      }
      // else open on left
      return { top: 0, left: -(bodyRect.width / 2 - activatorRect.width / 2) };
    }
    if (flipped === false) {
      if (document.documentElement.clientWidth <= activatorRect.left + bodyRect.width) {
        // if offscreen on right, open left
        menuBody.classList.add('bx--overflow-menu--flip');
        return { top: 0, left: -(bodyRect.width / 2 - activatorRect.width / 2) };
      }
      // else open on right
      return { top: 0, left: bodyRect.width / 2 - activatorRect.width / 2 };
    }
  }
  return { top: 0, left: 0 };
};

const PopupPositioningPropTypes = {
  children: PropTypes.node.isRequired,
};

const PopupPositioning = ({ children }) => {
  const popup = React.cloneElement(
    children,
    children.type.render.displayName === 'OverflowMenu'
      ? {
          menuOffset,
          menuOffsetFlip: menuOffset,
        }
      : {
          menuOffset,
        }
  );

  return <>{popup}</>;
};

PopupPositioning.propTypes = PopupPositioningPropTypes;
export default PopupPositioning;
