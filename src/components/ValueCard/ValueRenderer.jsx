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
  if (typeof value === 'number') {
    return value > 1000000
      ? `${(value / 1000000).toFixed(1)}m`
      : value > 1000
      ? `${(value / 1000).toFixed(1)}k`
      : value;
  }
  return value;
};

ValueRenderer.propTypes = propTypes;

export default ValueRenderer;
