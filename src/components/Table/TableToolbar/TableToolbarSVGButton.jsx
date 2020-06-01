import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { settings } from '../../../constants/Settings';
import { keyCodes } from '../../../constants/KeyCodeConstants';

const { iotPrefix } = settings;

const propTypes = {
  onClick: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

/**
 * Toolbar button that accepts a Carbon react icon as children
 */
const TableToolbarSVGButton = ({ onClick, testId, children, disabled }) => {
  const myClasname = `${iotPrefix}--tooltip-svg-wrapper`;
  return (
    <div
      className={classNames(myClasname, { [`${myClasname}--disabled`]: disabled })}
      onClick={e => {
        if (!disabled) {
          onClick(e);
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => {
        if (e.keyCode === keyCodes.ENTER && !disabled) onClick();
      }}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

TableToolbarSVGButton.propTypes = propTypes;
TableToolbarSVGButton.defaultProps = { disabled: false };

export default TableToolbarSVGButton;
