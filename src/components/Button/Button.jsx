import React from 'react';
import PropTypes from 'prop-types';
import { Button as CarbonButton, Loading } from 'carbon-components-react';
import { ButtonTypes } from 'carbon-components-react/lib/prop-types/types';
import classNames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;
const propTypes = {
  /** Show loading spinner, only new prop */
  loading: PropTypes.bool,
  /** Disable the button will be auto disabled when loading */
  disabled: PropTypes.bool,
  /** Button label */
  children: PropTypes.node,
  /** click handler */
  onClick: PropTypes.func, // eslint-disable-line
  className: PropTypes.string,
  /** primary, secondary, etc from carbon */
  kind: ButtonTypes.buttonKind,
};

const defaultProps = {
  loading: false,
  disabled: false,
  className: null,
  kind: 'primary',
  children: null,
};

/**
 * Carbon button with added ability to show loading state
 */
const Button = props => {
  const { children, loading, disabled, className, onClick, ...other } = props;
  return (
    <CarbonButton
      {...other}
      onClick={onClick}
      className={classNames(className, `${iotPrefix}--btn`)}
      disabled={disabled || (loading !== undefined && loading !== false)}
    >
      {loading ? <Loading small withOverlay={false} /> : null}
      {children}
    </CarbonButton>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
