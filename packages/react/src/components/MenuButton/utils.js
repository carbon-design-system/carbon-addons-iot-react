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
  let x = buttonX;

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
        y = buttonY;
        x = isSplitButton ? buttonX : buttonX;
        break;
      case 'top-bottom-left':
        x = isSplitButton ? buttonX + buttonWidth + primaryButtonWidth : buttonX + buttonWidth;
        y = buttonY;
        break;
      case 'top-bottom':
        y -= buttonHeight;
        x = isSplitButton ? buttonX + buttonWidth + primaryButtonWidth : buttonX + buttonWidth;
        break;
      case 'top-left':
        y = buttonY + buttonHeight;
        x = buttonX;
        break;
      case 'top-right':
        x = isSplitButton ? buttonX + primaryButtonWidth + buttonWidth : buttonX + buttonWidth;
        y = buttonY + buttonHeight;
        break;
      case 'right-bottom':
        x = isSplitButton ? buttonX + primaryButtonWidth + buttonWidth : buttonX + buttonWidth;
        y = buttonY - menuHeight;
        break;
      case 'bottom-left':
        x = buttonX;
        y = buttonY - menuHeight;
        break;
      case 'top':
        y = buttonY + buttonHeight;
        x = buttonX;
        break;
      case 'left':
        x = buttonX;
        y = buttonY + buttonHeight;
        break;
      case 'bottom':
        x = isSplitButton ? buttonX : x;
        y = buttonY - menuHeight;
        break;
      case 'right':
        x = isSplitButton ? buttonX + primaryButtonWidth + buttonWidth : buttonX + buttonWidth;
        break;
      default:
        x = buttonX;
        y = buttonY + buttonHeight;
    }

    if (isRtl) {
      x -= scrollXOffset;
    }
  }

  return { x, y };
};
