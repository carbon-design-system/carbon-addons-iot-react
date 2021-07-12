/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { Button as CarbonButton } from 'carbon-components-react';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

export const ICON_SWITCH_SIZES = {
  small: 'small',
  default: 'default',
  large: 'large',
};

const IconSwitch = React.forwardRef((props, ref) => {
  const {
    className,
    index,
    name,
    renderIcon,
    onClick,
    onKeyDown,
    selected,
    size,
    text,
    light,
    testId,
    ...other
  } = props;

  const handleClick = (e) => {
    e.preventDefault();
    onClick({ index, name, text });
  };

  const handleKeyDown = (e) => {
    const key = e.key || e.which;

    if (key === 'Enter' || key === 13 || key === ' ' || key === 32) {
      onKeyDown({ index, name, text });
    }
  };

  const classes = classnames(
    className,
    `${iotPrefix}--icon-switch`,
    `${iotPrefix}--icon-switch--${size}`,
    { [`${iotPrefix}--icon-switch--unselected`]: !selected },
    { [`${iotPrefix}--icon-switch--unselected--light`]: light && !selected }
  );

  const commonProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    className: classes,
  };

  return (
    <CarbonButton
      ref={ref}
      renderIcon={renderIcon}
      iconDescription={text}
      kind="secondary"
      hasIconOnly
      tooltipPosition="top"
      data-testid={testId}
      {...other}
      {...commonProps}
    />
  );
});

IconSwitch.propTypes = {
  /**
   * Specify an optional className to be added to your Switch
   */
  className: PropTypes.string,

  /**
   * The index of your Switch in your ContentSwitcher that is used for event handlers.
   * Reserved for usage in ContentSwitcher
   */
  index: PropTypes.number.isRequired,

  /**
   * Provide the name of your Switch that is used for event handlers
   */
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * A handler that is invoked when a user clicks on the control.
   * Reserved for usage in ContentSwitcher
   */
  onClick: PropTypes.func,

  /**
   * A handler that is invoked on the key down event for the control.
   * Reserved for usage in ContentSwitcher
   */
  onKeyDown: PropTypes.func,

  /**
   * Whether your Switch is selected. Reserved for usage in ContentSwitcher
   */
  selected: PropTypes.bool,

  /**
   * The tooltip text which will display when hovering over the switch
   */
  text: PropTypes.string.isRequired,

  /**
   * Size of the IconSwitch. One of:
   *  small: 32px
   *  default: 40px
   *  large (for touch screens): 48px
   *
   *
   * Although it will scale the icon accordingly, for optimal rendering the following sizes are recommended:
   *  small: 16px
   *  default: 20px
   *  large: 24px
   */
  size: PropTypes.oneOf(Object.values(ICON_SWITCH_SIZES)),

  /**
   * Define the icon render to be rendered.
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,

  /**
   *  Light version
   */
  light: PropTypes.bool,

  testId: PropTypes.string,
};

IconSwitch.defaultProps = {
  className: undefined,
  selected: false,
  name: '',
  size: 'default',
  light: false,
  onClick: undefined,
  onKeyDown: undefined,
  testId: 'icon-switch',
};

export default IconSwitch;
