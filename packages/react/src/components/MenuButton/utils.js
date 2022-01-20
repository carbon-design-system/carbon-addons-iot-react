import { settings } from '../../constants/Settings';

const { prefix } = settings;

const getBoundingClientRects = (buttonRef, isSplitButton) => {
  const buttonRect = buttonRef.current.getBoundingClientRect();
  const primaryButtonRect = isSplitButton
    ? buttonRef?.current?.previousSibling?.getBoundingClientRect()
    : null;
  // Once the menuButton can accept a target for the react portal, we can
  // use this method again once the menu is placed within the same div as the
  // button.
  // const menuRect = buttonRef.current.nextSibling?.getBoundingClientRect();
  const node =
    buttonRef.current?.nextSibling ??
    document.querySelector(`.${prefix}--menu.${prefix}--menu--open.${prefix}--menu--root`);
  const menuRect = node?.getBoundingClientRect();

  return { buttonRect, primaryButtonRect, menuRect };
};

const getMenuDimensions = (menuRect) => ({
  menuHeight: menuRect?.height ?? 0,
  menuWidth: menuRect?.width ?? 0,
});

const getOverflow = (menuRect, buttonRect) => {
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const { menuHeight, menuWidth } = getMenuDimensions(menuRect);
  const offTop = buttonRect.top - menuHeight < 0;
  const offLeft = buttonRect.left - menuWidth < 0;
  const offRight = buttonRect.right + menuWidth > windowWidth;
  const offBottom = buttonRect.bottom + menuHeight > windowHeight;
  const T = offTop ? 'top' : '';
  const R = offRight ? 'right' : '';
  const B = offBottom ? 'bottom' : '';
  const L = offLeft ? 'left' : '';

  return [T, R, B, L].filter(Boolean).join('-');
};

export const getShadowBlockerConfig = (buttonRef) => {
  const { buttonRect, menuRect } = getBoundingClientRects(buttonRef);
  const { menuHeight } = getMenuDimensions(menuRect);
  const overflow = getOverflow(menuRect, buttonRect);
  const flippedX = overflow?.includes('bottom') && !overflow?.includes('top');
  const flippedY = overflow?.includes('right');
  const opensHorizontally = overflow?.includes('top') && overflow?.includes('bottom');
  return { menuHeight, flippedX, flippedY, opensHorizontally };
};

export const getMenuPosition = ({ label, buttonRef, onPrimaryActionClick, langDir }) => {
  const isSplitButton = label && typeof onPrimaryActionClick === 'function';
  const { buttonRect, primaryButtonRect, menuRect } = getBoundingClientRects(
    buttonRef,
    isSplitButton
  );
  const isRtl = langDir === 'rtl';
  const { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight } = buttonRect;
  const { clientHeight: bodyHeight } = document.body;
  const { width: primaryButtonWidth } = primaryButtonRect ?? {
    width: 0,
  };

  const hasScrollY = document.body.scrollHeight >= bodyHeight;
  const scrollXOffset = hasScrollY ? 15 : 0;
  let y = buttonY + buttonHeight;
  let x = isSplitButton ? buttonX + primaryButtonWidth : buttonX;

  const { menuHeight, menuWidth } = getMenuDimensions(menuRect);
  const overflow = getOverflow(menuRect, buttonRect);

  /* istanbul ignore else */
  if (menuRect) {
    switch (overflow) {
      case 'top-right-bottom':
        x = isSplitButton
          ? isRtl
            ? buttonRect.left - menuWidth + scrollXOffset
            : primaryButtonRect.left - menuWidth
          : buttonX;
        y = buttonY;
        break;
      case 'top-bottom-left':
      case 'top-bottom':
        x = isSplitButton
          ? isRtl
            ? primaryButtonRect.right + scrollXOffset
            : buttonX + buttonWidth
          : buttonX + buttonWidth;
        y = buttonY;
        break;
      case 'top-left':
        x = isSplitButton ? (isRtl ? buttonX : buttonX - primaryButtonWidth) : buttonX;
        y = buttonY + buttonHeight;
        break;
      case 'top-right':
        x = isSplitButton
          ? isRtl
            ? buttonX + buttonWidth + primaryButtonWidth
            : buttonX - primaryButtonWidth - buttonWidth
          : buttonX + buttonWidth;
        y = buttonY + buttonHeight;
        break;
      case 'right-bottom':
        x = isSplitButton
          ? isRtl
            ? buttonX + buttonWidth + primaryButtonWidth
            : buttonX + buttonWidth
          : buttonX + buttonWidth;
        y = buttonY - menuHeight;
        break;
      case 'bottom-left':
      case 'bottom':
        x = isSplitButton ? (isRtl ? buttonX : buttonX - primaryButtonWidth) : buttonX;
        y = buttonY - menuHeight;
        break;
      case 'top':
      case 'left':
        x = isSplitButton ? (isRtl ? buttonX : buttonX - primaryButtonWidth) : buttonX;
        y = buttonY + buttonHeight;
        break;
      case 'right':
        x = isSplitButton
          ? isRtl
            ? buttonX + buttonWidth + primaryButtonWidth
            : buttonX + buttonWidth
          : buttonX + buttonWidth;
        y = buttonY + buttonHeight;
        break;
      default:
        x = isSplitButton ? (isRtl ? buttonX : buttonX - primaryButtonWidth) : buttonX;
        y = buttonY + buttonHeight;
    }

    if (isRtl) {
      x -= scrollXOffset;
    }
  }

  return { x, y };
};
