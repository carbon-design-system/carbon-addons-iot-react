import React from 'react';
import PropTypes from 'prop-types';
import { Button as CarbonButton, Loading } from 'carbon-components-react';
import { ButtonTypes } from 'carbon-components-react/lib/prop-types/types';
import styled from 'styled-components';
import { settings } from 'carbon-components';

const { prefix } = settings;

const StyledButton = styled(CarbonButton)`
  &&& {
    justify-content: flex-start;
    .${prefix}--loading {
      margin-top: -1rem;
      margin-bottom: -1rem;
    }
    .${prefix}--loading__stroke {
      stroke: #8c8c8c;
    }
  }
`;

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
    <StyledButton
      {...other}
      onClick={onClick}
      className={className}
      disabled={disabled || (loading !== undefined && loading !== false)}
    >
      {loading ? <Loading small withOverlay={false} /> : null}
      {children}
    </StyledButton>
  );
};

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
