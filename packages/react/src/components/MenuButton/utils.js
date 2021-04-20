export const getMenuPosition = ({ label, buttonRef, onPrimaryActionClick }) => {
  const isSplitButton = label && typeof onPrimaryActionClick === 'function';
  const buttonRect = buttonRef.current.getBoundingClientRect();
  const primaryButtonRect = isSplitButton
    ? buttonRef?.current?.previousSibling?.getBoundingClientRect()
    : null;
  const menuRect = buttonRef.current.nextSibling?.getBoundingClientRect();
  const isRtl = document.dir === 'rtl';
  const { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight } = buttonRect;
  const { clientWidth: bodyWidth, clientHeight: bodyHeight } = document.body;
  const { width: primaryButtonWidth } = primaryButtonRect ?? {
    width: 0,
  };

  const hasScrollX = document.body.scrollWidth > bodyWidth;
  const scrollXOffset = hasScrollX ? 16 : 0;
  let y = buttonY + buttonHeight;
  let x = isRtl ? (isSplitButton ? buttonX + primaryButtonWidth : buttonX) : buttonX;

  // scrollbars are accounted for in rtl for some reason
  x = isRtl ? x - scrollXOffset : x;

  /* istanbul ignore else */
  if (menuRect) {
    if (y + menuRect.height > bodyHeight && x + menuRect.width > bodyWidth) {
      x += buttonWidth;
      y -= menuRect.height + buttonHeight;
    } else if (y + menuRect.height > bodyHeight) {
      x -= isSplitButton ? primaryButtonWidth : 0;
      y -= menuRect.height + buttonHeight;
    } else if (x + menuRect.width > bodyWidth) {
      x += buttonWidth;
    } else if (isSplitButton) {
      // 2 for focus borders
      x -= isRtl ? primaryButtonWidth - 2 : primaryButtonWidth;
    }
  }

  return { x, y };
};
