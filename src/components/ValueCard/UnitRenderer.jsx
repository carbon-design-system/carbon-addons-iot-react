import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
  unit: PropTypes.string,
  layout: PropTypes.string,
  isMini: PropTypes.bool,
};

const defaultProps = {
  unit: '',
  layout: null,
  isMini: false,
};

const AttributeUnit = styled.span`
  padding-left: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: ${props =>
    props.isMini ? '1.0rem' : props.layout === CARD_LAYOUTS.HORIZONTAL ? '1.25rem' : '1.5rem'};
  font-weight: lighter;
  white-space: nowrap;
  ${props => !props.isMini && 'margin-bottom: 0.25rem;'}
`;

/** This components job is determining how to render different kinds units */
const UnitRenderer = ({ value, unit, layout, isMini }) => {
  if (typeof value === 'number') {
    return (
      <AttributeUnit layout={layout} isMini={isMini}>
        {value > 1000000000000
          ? `T ${unit}`
          : value > 1000000000
          ? `B ${unit}`
          : value > 1000000
          ? `M ${unit}`
          : value > 1000
          ? `K ${unit}`
          : unit}
      </AttributeUnit>
    );
  }
  return isMini ? (
    <div>
      <AttributeUnit layout={layout} isMini={isMini}>
        {unit}
      </AttributeUnit>
    </div>
  ) : (
    <AttributeUnit layout={layout} isMini={isMini}>
      {unit}
    </AttributeUnit>
  );
};

UnitRenderer.propTypes = propTypes;
UnitRenderer.defaultProps = defaultProps;

export default UnitRenderer;
