import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from '../../Button';
import { settings } from '../../../constants/Settings';

const { iotPrefix, prefix } = settings;

const propTypes = {
  onClick: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  renderIcon: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  description: PropTypes.node.isRequired,
  /** is the button currently 'toggled' active, used for column filters */
  isActive: PropTypes.bool,
  /** is the button disabled */
  disabled: PropTypes.bool,
  tooltipAlignment: PropTypes.oneOf(['start', 'center', 'end']),
  tooltipPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  langDir: PropTypes.oneOf(['ltr', 'rtl']),
};

const defaultProps = {
  isActive: false,
  disabled: false,
  tooltipAlignment: 'center',
  tooltipPosition: 'bottom',
  langDir: 'ltr',
};

/**
 * Toolbar button that renders an icon only button
 */
const TableToolbarSVGButton = ({
  onClick,
  testId,
  className,
  description,
  isActive,
  tooltipAlignment,
  tooltipPosition,
  langDir,
  ...rest
}) => {
  const [adjustedTooltipAlignment, setAdjustedTooltipAlignment] = useState(tooltipAlignment);

  return (
    <Button
      {...rest}
      ref={(node) => {
        /* istanbul ignore else */
        if (node) {
          const tooltip = node.querySelector(`.${prefix}--assistive-text`);
          if (!tooltip) {
            return;
          }
          const childRect = tooltip.getBoundingClientRect();
          const parentRect = node.parentElement.getBoundingClientRect();
          /* istanbul ignore else */
          if (
            langDir === 'ltr' &&
            childRect.left + childRect.width > parentRect.left + parentRect.width
          ) {
            setAdjustedTooltipAlignment('end');
            return;
          }
          /* istanbul ignore else */
          if (langDir === 'rtl' && childRect.left < parentRect.left) {
            setAdjustedTooltipAlignment('start');
          }
        }
      }}
      className={classnames(
        `${prefix}--btn--icon-only`,
        `${iotPrefix}--tooltip-svg-wrapper`,
        className,
        {
          [`${iotPrefix}--table-toolbar-button-active`]: isActive, // https://github.com/carbon-design-system/carbon/issues/6160
        }
      )}
      kind="icon-selection"
      onClick={onClick}
      iconDescription={description}
      testId={testId}
      tooltipAlignment={adjustedTooltipAlignment}
      tooltipPosition={tooltipPosition}
    />
  );
};

TableToolbarSVGButton.propTypes = propTypes;
TableToolbarSVGButton.defaultProps = defaultProps;

export default TableToolbarSVGButton;
