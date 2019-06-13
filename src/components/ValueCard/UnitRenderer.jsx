import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
  unit: PropTypes.string,
  layout: PropTypes.string,
  isVisible: PropTypes.bool,
};

const defaultProps = {
  unit: '',
  layout: null,
  isVisible: true,
};

const AttributeUnit = styled.span`
  padding-left: 0.25rem;
  padding-bottom: 0.25rem;
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL
      ? `
    font-size: 1.25rem;  
  `
      : `font-size: 1.5rem`};
  font-weight: lighter;
  white-space: nowrap;
  margin-bottom: 0.25rem;
`;

/** This components job is determining how to render different kinds units */
const UnitRenderer = ({ value, isVisible, unit, layout }) => {
  let renderUnit = unit;
  let showUnit = isVisible;
  // Should I truncate?
  if (typeof value === 'number' && value > 1000) {
    renderUnit =
      value > 1000000000000
        ? `T${unit}`
        : value > 1000000000
        ? `B${unit}`
        : value > 1000000
        ? `M${unit}`
        : `K${unit}`;
    // Need to show the unit if the value has been truncated
    showUnit = true;
  }
  return showUnit ? <AttributeUnit layout={layout}>{renderUnit}</AttributeUnit> : null;
};

UnitRenderer.propTypes = propTypes;
UnitRenderer.defaultProps = defaultProps;

export default UnitRenderer;
