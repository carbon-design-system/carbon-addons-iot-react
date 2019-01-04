import React from 'react';
import PropTypes from 'prop-types';
import { Button as CarbonButton, Loading } from 'carbon-components-react';

import './ButtonEnhanced.css';

const propTypes = {
  /** Show loading spinner, only new prop */
  loading: PropTypes.bool,
  /** Disable the button will be auto disabled when loading */
  disabled: PropTypes.bool,
  /** Button label */
  children: PropTypes.node.isRequired,
  /** click handler */
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {
  loading: false,
  disabled: false,
};

/**
 * Carbon button with added ability to show loading state
 */
const ButtonEnhanced = props => {
  const { children, loading, disabled, ...other } = props;
  return (
    <CarbonButton
      styleName="buttonEnhanced"
      {...other}
      disabled={disabled || (loading !== undefined && loading !== false)}>
      {loading ? <Loading small withOverlay={false} /> : null}
      {children}
    </CarbonButton>
  );
};

ButtonEnhanced.propTypes = propTypes;
ButtonEnhanced.defaultProps = defaultProps;

export default ButtonEnhanced;
