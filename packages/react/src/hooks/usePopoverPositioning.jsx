import * as React from 'react';

const isOffscreen = (menuBody, menuDirection, menuButton /* , flipped, offset */) => {
  const buttonRect = menuButton.getBoundingClientRect();
  const tooltipRect = menuBody.getBoundingClientRect();

  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  const offTop = buttonRect.top - tooltipRect.height < 0;
  const offLeft = buttonRect.left - tooltipRect.width < 0;
  const offRight = buttonRect.right + tooltipRect.width > windowWidth;
  const offBottom = buttonRect.bottom + tooltipRect.height > windowHeight;
  const T = offTop ? 'top' : '';
  const R = offRight ? 'right' : '';
  const B = offBottom ? 'bottom' : '';
  const L = offLeft ? 'left' : '';

  return [T, R, B, L].filter(Boolean).join('-');
};

export const usePopoverPositioning = ({
  direction,
  menuOffset,
  flipped = false,
  isOverflowMenu = false,
  useAutoPositioning = true,
}) => {
  const [adjustedDirection, setAdjustedDirection] = React.useState();
  const [adjustedFlipped, setAdjustedFlipped] = React.useState();
  const [{ flyoutAlignment }, setDirections] = React.useState({});
  const previousDirection = React.useRef();

  React.useEffect(() => {
    previousDirection.current = direction;
    setAdjustedDirection(direction);
    setDirections({
      tooltipDirection: direction.split('-')[0],
      flyoutAlignment: direction.split('-')[1],
    });
    setAdjustedFlipped(flipped);
  }, [direction, flipped]);

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
      const buttonRect = buttonElement.parentNode.getBoundingClientRect();
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

      return {
        top: 0,
        left: 0,
      };
    },
    [adjustedDirection, flyoutAlignment]
  );

  const fixOverflow = React.useCallback(
    (overflow, menuOffsetArgs) => {
      const [tooltipElement] = menuOffsetArgs;
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
          if (flyoutAlignment) {
            setAdjustedDirection(`left-${flyoutAlignment}`);
            tooltipElement.setAttribute('data-floating-menu-direction', 'left');
          } else if (isOverflowMenu) {
            setAdjustedFlipped(true);
            setAdjustedDirection('bottom');
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
            setAdjustedDirection('bottom');
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
        default:
          break;
      }

      const adjustedOffset = getAdjustedOffset(...menuOffsetArgs);
      const newOffset = getOffset(...menuOffsetArgs);

      previousDirection.current = adjustedDirection;

      return {
        top: newOffset.top + adjustedOffset.top,
        left: newOffset.left + adjustedOffset.left,
      };
    },
    [adjustedDirection, flyoutAlignment, getAdjustedOffset, getOffset, isOverflowMenu]
  );

  const calculateMenuOffset = React.useCallback(
    (...args) => {
      const defaultOffset = getOffset(...args);

      if (!useAutoPositioning) {
        return defaultOffset;
      }

      const overflow = isOffscreen(...args, defaultOffset);

      switch (overflow) {
        case 'top-right':
        case 'right-bottom':
        case 'bottom-left':
        case 'top-left':
        case 'top':
        case 'right':
        case 'bottom':
        case 'left':
          return fixOverflow(overflow, [...args]);
        default:
          return defaultOffset;
      }
    },
    [fixOverflow, getOffset, useAutoPositioning]
  );

  return [calculateMenuOffset, { adjustedDirection, adjustedFlipped }];
};
