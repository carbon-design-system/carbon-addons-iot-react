import React from 'react';
import PropTypes from 'prop-types';
import WarningAlt from '@carbon/icons-react/lib/warning--alt/32';
import CheckmarkOutline from '@carbon/icons-react/lib/checkmark--outline/32';
import styled from 'styled-components';

import { COLORS } from '../../styles/styles';

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
};

const StyledWarningAlt = styled(WarningAlt)`
  > path {
    fill: ${COLORS.errorRed};
  }
`;

const StyledCheckmarkOutline = styled(CheckmarkOutline)`
  > path {
    fill: ${COLORS.okayGreen};
  }
`;

/** This components job is determining how to render different kinds of card values */
const ValueRenderer = ({ value }) => {
  if (typeof value === 'boolean') {
    return value ? <StyledWarningAlt /> : <StyledCheckmarkOutline />;
  }
  return value;
};

ValueRenderer.propTypes = propTypes;

export default ValueRenderer;
