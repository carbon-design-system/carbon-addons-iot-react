import * as React from 'react';
import { Tooltip as CarbonTooltip } from '@carbon/react';
import PropTypes from 'prop-types';
import { Information } from '@carbon/icons-react';

// will remove this method later
export const getTooltipMenuOffset = () => {
  return {
    top: 0,
    left: 0,
  };
};

export const Tooltip = ({
  triggerText = '',
  direction = 'bottom',
  align = 'center',
  renderIcon: IconCustomElement,
  useAutoPositioning = false,
  showIcon = true,
  children,
  ...other
}) => {
  let newAlign;
  // This function is to pass the old direction, align property to the new align property since The align and direction props have been merged into the align prop
  if (direction === 'bottom' && align === 'center') {
    newAlign = 'bottom';
  } else if (direction === 'bottom' && align === 'end') {
    newAlign = 'bottom-end';
  } else if (direction === 'top' && align === 'start') {
    newAlign = 'top-start';
  } else if (direction === 'top' && align === 'center') {
    newAlign = 'top';
  } else if (direction === 'top' && align === 'end') {
    newAlign = 'top-end';
  } else if (direction === 'right' && align === 'start') {
    newAlign = 'right-start';
  } else if (direction === 'right' && align === 'center') {
    newAlign = 'right';
  } else if (direction === 'right' && align === 'end') {
    newAlign = 'right-end';
  } else if (direction === 'left' && align === 'start') {
    newAlign = 'left-start';
  } else if (direction === 'left' && align === 'center') {
    newAlign = 'left';
  } else if (direction === 'left' && align === 'end') {
    newAlign = 'left-end';
  } else {
    newAlign = 'bottom-start';
  }
  let tooltip = (
    <CarbonTooltip label={children} align={newAlign} autoAlign={useAutoPositioning} {...other}>
      <div>{triggerText}</div>
    </CarbonTooltip>
  );
  if (showIcon) {
    tooltip = (
      <>
        <div style={{ marginRight: '0.5rem' }}>{triggerText}</div>
        <CarbonTooltip label={children} align={newAlign} autoAlign={useAutoPositioning} {...other}>
          {IconCustomElement ? (
            <div>
              <IconCustomElement />
            </div>
          ) : (
            <Information />
          )}
        </CarbonTooltip>
      </>
    );
  }
  return tooltip;
};

Tooltip.propTypes = {
  ...Tooltip.propTypes,
  triggerText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  direction: PropTypes.string,
  renderIcon: PropTypes.node,
  useAutoPositioning: PropTypes.bool,
  showIcon: PropTypes.bool,
};

export default Tooltip;
