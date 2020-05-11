import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';
import { keyCodes } from '../../../constants/KeyCodeConstants';

const { iotPrefix } = settings;

const propTypes = {
  onClick: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * Toolbar button that accepts a Carbon react icon as children
 */
const TableToolbarSVGButton = ({ onClick, testId, children }) => {
  return (
    <div
      className={`${iotPrefix}--tooltip-svg-wrapper`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.keyCode === keyCodes.ENTER) onClick();
      }}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

TableToolbarSVGButton.propTypes = propTypes;

export default TableToolbarSVGButton;
