export const getMenuPosition = ({ label, buttonRef, onPrimaryActionClick, langDir }) => {
  const isSplitButton = label && typeof onPrimaryActionClick === 'function';
  const buttonRect = buttonRef.current.getBoundingClientRect();
  const primaryButtonRect = isSplitButton
    ? buttonRef?.current?.previousSibling?.getBoundingClientRect()
    : null;
  const menuRect = buttonRef.current.nextSibling?.getBoundingClientRect();
  const isRtl = langDir === 'rtl';
  const { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight } = buttonRect;
  const { clientHeight: bodyHeight } = document.body;
  const { width: primaryButtonWidth } = primaryButtonRect ?? {
    width: 0,
  };

  const hasScrollY = document.body.scrollHeight > bodyHeight;
  const scrollXOffset = hasScrollY ? 14 : 0;
  let y = buttonY + buttonHeight;
  let x = isSplitButton ? buttonX + primaryButtonWidth : buttonX;

  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const menuHeight = menuRect?.height ?? 0;
  const menuWidth = menuRect?.width ?? 0;
  const offTop = buttonRect.top - menuHeight < 0;
  const offLeft = buttonRect.left - menuWidth < 0;
  const offRight = buttonRect.right + menuWidth > windowWidth;
  const offBottom = buttonRect.bottom + menuHeight > windowHeight;
  const T = offTop ? 'top' : '';
  const R = offRight ? 'right' : '';
  const B = offBottom ? 'bottom' : '';
  const L = offLeft ? 'left' : '';

  const overflow = [T, R, B, L].filter(Boolean).join('-');

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
