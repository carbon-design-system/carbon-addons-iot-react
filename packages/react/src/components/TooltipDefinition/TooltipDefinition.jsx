import { DefinitionTooltip } from '@carbon/react';
import * as React from 'react';
import PropTypes from 'prop-types';

const TooltipDefinition = (props) => {
  const { direction, align, tooltipText, ...other } = props;
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
  return (
    <DefinitionTooltip
      {...other}
      // The tooltipText prop has been renamed to definition
      definition={tooltipText}
      align={newAlign}
    />
  );
};

TooltipDefinition.propTypes = {
  direction: PropTypes.string,
  align: PropTypes.string,
  tooltipText: PropTypes.string,
};

TooltipDefinition.defaultProps = {
  direction: 'bottom',
  align: 'start',
  tooltipText: '',
};

export default TooltipDefinition;
