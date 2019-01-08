import React from 'react';
import PropTypes from 'prop-types';
import { Button as CarbonButton, Loading } from 'carbon-components-react';
import styled from 'styled-components';

const StyledButton = styled(CarbonButton)`
  &&& {
    display: inline-flex;
    flex-flow: row nowrap;
    svg {
      stroke: ${props => (props.kind === 'primary' ? 'white' : null)};
    }
  }
`;

const propTypes = {
  /** Show loading spinner, only new prop */
  loading: PropTypes.bool,
  /** Disable the button will be auto disabled when loading */
  disabled: PropTypes.bool,
  /** Button label */
  children: PropTypes.node.isRequired,
  /** click handler */
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  kind: PropTypes.string,
};

const defaultProps = {
  loading: false,
  disabled: false,
  className: null,
  kind: 'primary',
};

/**
 * Carbon button with added ability to show loading state
 */
const ButtonEnhanced = props => {
  const { children, loading, disabled, className, ...other } = props;
  return (
    <StyledButton
      {...other}
      className={className}
      disabled={disabled || (loading !== undefined && loading !== false)}>
      {loading ? <Loading small withOverlay={false} /> : null}
      {children}
    </StyledButton>
  );
};

ButtonEnhanced.propTypes = propTypes;
ButtonEnhanced.defaultProps = defaultProps;

export default ButtonEnhanced;
