import React from 'react';
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
};

const defaultProps = {
  isActive: false,
  disabled: false,
};

/**
 * Toolbar button that renders an icon only button
 */
const TableToolbarSVGButton = ({ onClick, testId, className, description, isActive, ...rest }) => {
  return (
    <Button
      {...rest}
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
    />
  );
};

TableToolbarSVGButton.propTypes = propTypes;
TableToolbarSVGButton.defaultProps = defaultProps;

export default TableToolbarSVGButton;
