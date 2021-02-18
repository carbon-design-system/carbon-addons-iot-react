import * as React from 'react';
import { Tooltip as CarbonTooltip } from 'carbon-components-react';
import PropTypes from 'prop-types';
import {
  DIRECTION_BOTTOM,
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_TOP,
} from 'carbon-components-react/lib/internal/FloatingMenu';

import { usePopoverPositioning } from '../../hooks/usePopoverPositioning';

/**
 * @param {Element} menuBody The menu body with the menu arrow.
 * @param {string} menuDirection Where the floating menu menu should be placed relative to the trigger button.
 * @returns {FloatingMenu~offset} The adjustment of the floating menu position, upon the position of the menu arrow.
 * @private
 */
const getTooltipMenuOffset = (menuBody, menuDirection) => {
  const arrowStyle = menuBody.ownerDocument.defaultView.getComputedStyle(menuBody, ':before');
  const arrowPositionProp = {
    [DIRECTION_LEFT]: 'right',
    [DIRECTION_TOP]: 'bottom',
    [DIRECTION_RIGHT]: 'left',
    [DIRECTION_BOTTOM]: 'top',
  }[menuDirection];
  const menuPositionAdjustmentProp = {
    [DIRECTION_LEFT]: 'left',
    [DIRECTION_TOP]: 'top',
    [DIRECTION_RIGHT]: 'left',
    [DIRECTION_BOTTOM]: 'top',
  }[menuDirection];
  const values = [arrowPositionProp, 'border-bottom-width'].reduce(
    (o, name) => ({
      ...o,
      [name]: Number((/^([\d-]+)px$/.exec(arrowStyle.getPropertyValue(name)) || [])[1]),
    }),
    {}
  );
  values[arrowPositionProp] = values[arrowPositionProp] || -6; // IE, etc.
  if (Object.keys(values).every((name) => !Number.isNaN(values[name]))) {
    const { [arrowPositionProp]: arrowPosition, 'border-bottom-width': borderBottomWidth } = values;
    return {
      left: 0,
      top: 0,
      [menuPositionAdjustmentProp]: Math.sqrt(borderBottomWidth ** 2 * 2) - arrowPosition,
    };
  }

  return {
    top: 0,
    left: 0,
  };
};

export const Tooltip = ({ direction, menuOffset, useAutoPositioning, ...props }) => {
  const [calculateMenuOffset, { adjustedDirection }] = usePopoverPositioning({
    direction,
    menuOffset: menuOffset || getTooltipMenuOffset,
    useAutoPositioning,
  });

  return (
    <CarbonTooltip {...props} menuOffset={calculateMenuOffset} direction={adjustedDirection} />
  );
};

Tooltip.propTypes = {
  ...CarbonTooltip.propTypes,
  useAutoPositioning: PropTypes.bool,
};
Tooltip.defaultProps = {
  ...CarbonTooltip.defaultProps,
  useAutoPositioning: false,
};

export default Tooltip;
