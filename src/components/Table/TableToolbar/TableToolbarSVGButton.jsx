import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';

const { iotPrefix, prefix } = settings;

const propTypes = {
  onClick: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  renderIcon: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  description: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
};

const defaultProps = {
  isActive: false,
};

/**
 * Toolbar button that renders an icon only button
 */
const TableToolbarSVGButton = ({ onClick, testId, className, description, isActive, ...rest }) => {
  return (
    <Button
      {...rest}
      className={classNames(
        `${prefix}--btn--icon-only`,
        `${iotPrefix}--tooltip-svg-wrapper`,
        className,
        {
          [`${iotPrefix}--table-toolbar-button-active`]: isActive, // https://github.com/carbon-design-system/carbon/issues/6160
        }
      )}
      hasIconOnly={!isActive} // hide the tooltip if the button is active
      kind="ghost"
      onClick={onClick}
      tooltipAlignment="center"
      tooltipPosition="top"
      iconDescription={description}
      data-testid={testId}
    />
  );
};

TableToolbarSVGButton.propTypes = propTypes;
TableToolbarSVGButton.defaultProps = defaultProps;

export default TableToolbarSVGButton;
