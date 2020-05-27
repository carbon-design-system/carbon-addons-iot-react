import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';
import { keyCodes } from '../../../constants/KeyCodeConstants';

const { iotPrefix } = settings;

const propTypes = {
  onClick: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  renderIcon: PropTypes.func.isRequired,
  description: PropTypes.node.isRequired,
};

/**
 * Toolbar button that accepts a Carbon react icon as children
 */
const TableToolbarSVGButton = ({ onClick, testId, description, renderIcon }) => {
  return (
    <Button
      className={`${iotPrefix}--tooltip-svg-wrapper`}
      hasIconOnly
      onClick={onClick}
      kind="ghost"
      renderIcon={renderIcon}
      tooltipAlignment="center"
      tooltipPosition="top"
      onKeyDown={e => {
        if (e.keyCode === keyCodes.ENTER) onClick();
      }}
      iconDescription={description}
      data-testid={testId}
    />
  );
};

TableToolbarSVGButton.propTypes = propTypes;

export default TableToolbarSVGButton;
