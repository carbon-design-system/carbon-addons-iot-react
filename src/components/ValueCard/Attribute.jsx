import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { Icon } from 'carbon-components-react';
import { iconCaretUp, iconCaretDown } from 'carbon-icons';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';

import ValueRenderer from './ValueRenderer';
import UnitRenderer from './UnitRenderer';

const StyledAttribute = styled.div`
  display: flex;
  align-items: flex-end;
`;

const TrendIcon = styled(Icon)`
  margin-right: 0.25rem;
`;

const AttributeSecondaryValue = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  color: ${props => props.color || '#777'};
  fill: ${props => props.color || '#777'};
  font-size: 0.875rem;
  padding-left: 0.25rem;
`;

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
  unit: PropTypes.any, // eslint-disable-line
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  secondaryValue: PropTypes.any, // eslint-disable-line
  precision: PropTypes.number,
};

const defaultProps = {
  layout: null,
  precision: 0,
};

const Attribute = ({ value, unit, layout, secondaryValue, precision }) => {
  return (
    <StyledAttribute>
      {!isNil(value) ? (
        <ValueRenderer
          value={value}
          unit={unit}
          layout={layout}
          hasSecondary={secondaryValue !== undefined}
          precision={precision}
        />
      ) : (
        ' '
      )}
      <UnitRenderer value={value} unit={unit} layout={layout} />
      {secondaryValue !== undefined ? (
        typeof secondaryValue === 'object' ? (
          <AttributeSecondaryValue color={secondaryValue.color} trend={secondaryValue.trend}>
            {secondaryValue.trend && secondaryValue.trend === 'up' ? (
              <TrendIcon icon={iconCaretUp} />
            ) : secondaryValue.trend === 'down' ? (
              <TrendIcon icon={iconCaretDown} />
            ) : null}
            {secondaryValue.value}
          </AttributeSecondaryValue>
        ) : (
          <AttributeSecondaryValue>{secondaryValue}</AttributeSecondaryValue>
        )
      ) : null}
    </StyledAttribute>
  );
};

Attribute.propTypes = propTypes;
Attribute.defaultProps = defaultProps;

export default Attribute;
