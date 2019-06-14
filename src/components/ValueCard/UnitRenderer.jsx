import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
  unit: PropTypes.string,
  layout: PropTypes.string,
  isMini: PropTypes.bool,
  isVisible: PropTypes.bool,
};

const defaultProps = {
  unit: '',
  layout: null,
  isMini: false,
  isVisible: true,
};

const AttributeUnit = styled.span`
  padding-left: 0.25rem;
  padding-bottom: ${props => (props.isMini ? '0' : '0.25rem')};
  font-size: ${props =>
    props.isMini ? '1.0rem' : props.layout === CARD_LAYOUTS.HORIZONTAL ? '1.25rem' : '1.5rem'};
  font-weight: lighter;
  white-space: nowrap;
  ${props => !props.isMini && 'margin-bottom: 0.25rem;'}
`;

/** This components job is determining how to render different kinds units */
const UnitRenderer = ({ isVisible, unit, layout, isMini }) => {
  return isVisible ? (
    isMini ? (
      <div>
        <AttributeUnit layout={layout} isMini={isMini}>
          {unit}
        </AttributeUnit>
      </div>
    ) : (
      <AttributeUnit layout={layout} isMini={isMini}>
        {unit}
      </AttributeUnit>
    )
  ) : null;
};

UnitRenderer.propTypes = propTypes;
UnitRenderer.defaultProps = defaultProps;

export default UnitRenderer;
