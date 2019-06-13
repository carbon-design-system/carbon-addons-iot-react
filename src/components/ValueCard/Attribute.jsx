import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { Icon } from 'carbon-components-react';
import { iconCaretUp, iconCaretDown } from 'carbon-icons';
import withSize from 'react-sizeme';

import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';

import ValueRenderer from './ValueRenderer';
import UnitRenderer from './UnitRenderer';

const StyledAttribute = styled.div`
  display: flex;
  align-items: flex-end;
  ${props => (props.isVertical && props.alignValue ? `justify-content: ${props.alignValue};` : '')};
  order: 1;
  ${props =>
    !props.label || props.isVertical || props.size === CARD_SIZES.XSMALL
      ? 'width: 100%'
      : 'width: 50%'};
`;

const TrendIcon = styled(Icon)`
  margin-right: 0.25rem;
`;

const ThresholdIconWrapper = styled.div`
  width: 1rem;
  height: 1rem;
  margin: 0 0 0.5rem 0.5rem;
`;

const ThresholdIcon = styled(Icon)`
  ${props =>
    props.color &&
    `
    color: ${props.color};
    fill: ${props.color};
  `}
`;

const AttributeSecondaryValue = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  color: ${props => props.color || '#777'};
  fill: ${props => props.color || '#777'};
  font-size: 0.875rem;
  padding-left: 0.25rem;
  margin-bottom: 0.25rem;
`;

const StyledIcon = styled.div`
  margin-left: auto;
`;

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
  unit: PropTypes.any, // eslint-disable-line
  /** css rule */
  alignValue: PropTypes.oneOf(['flex-end', 'center']),
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  /** Optional trend information */
  secondaryValue: PropTypes.shape({
    color: PropTypes.string,
    trend: PropTypes.oneOf(['up', 'down']),
    value: PropTypes.any,
  }),
  /** need to render smaller attribute */
  isSmall: PropTypes.bool,
  label: PropTypes.string,
  isVertical: PropTypes.bool, // are the attributes and labels in a column?
  thresholds: PropTypes.arrayOf(
    PropTypes.shape({
      comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      color: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  precision: PropTypes.number,
};

const defaultProps = {
  layout: null,
  precision: 0,
  thresholds: [],
  isVertical: false,
  alignValue: null,
  isSmall: false,
  label: null,
  secondaryValue: null,
};

/**
 * An attribute has a Value, Units and maybe a Threshold or Trend.
 */
const Attribute = ({
  value,
  unit,
  layout,
  secondaryValue,
  thresholds,
  precision,
  isVertical,
  alignValue,
  isSmall,
  label,
  size, // eslint-disable-line
}) => {
  // matching threshold will be the first match in the list, or a value of null
  const matchingThreshold = thresholds
    .filter(t => {
      switch (t.comparison) {
        case '<':
          return value < t.value;
        case '>':
          return value > t.value;
        case '=':
          return value === t.value;
        case '<=':
          return value <= t.value;
        case '>=':
          return value >= t.value;
        default:
          return false;
      }
    })
    .concat([null])[0];
  const valueColor =
    matchingThreshold && matchingThreshold.icon === undefined ? matchingThreshold.color : null;
  const thresholdIcon =
    matchingThreshold && matchingThreshold.icon ? (
      <ThresholdIconWrapper>
        <ThresholdIcon
          iconTitle={`${matchingThreshold.comparison} ${matchingThreshold.value}`}
          name={matchingThreshold.icon}
          color={matchingThreshold.color}
        />
      </ThresholdIconWrapper>
    ) : null;

  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        return (
          <StyledAttribute
            size={size}
            alignValue={alignValue}
            isVertical={isVertical}
            label={label}
          >
            {!isNil(value) ? (
              <ValueRenderer
                value={value}
                unit={unit}
                layout={layout}
                isSmall={isSmall}
                size={size}
                thresholds={thresholds}
                precision={precision}
                isVertical={isVertical}
                color={valueColor}
              />
            ) : (
              ' '
            )}
            {!measuredSize || measuredSize.width > 100 ? (
              <UnitRenderer value={value} unit={unit} layout={layout} />
            ) : null}
            {!isNil(secondaryValue) && (!measuredSize || measuredSize.width > 100) ? (
              <AttributeSecondaryValue color={secondaryValue.color} trend={secondaryValue.trend}>
                {secondaryValue.trend && secondaryValue.trend === 'up' ? (
                  <TrendIcon icon={iconCaretUp} />
                ) : secondaryValue.trend === 'down' ? (
                  <TrendIcon icon={iconCaretDown} />
                ) : null}
                {secondaryValue.value}
              </AttributeSecondaryValue>
            ) : null}
            {thresholdIcon ? <StyledIcon>{thresholdIcon}</StyledIcon> : null}
          </StyledAttribute>
        );
      }}
    </withSize.SizeMe>
  );
};

Attribute.propTypes = propTypes;
Attribute.defaultProps = defaultProps;

export default Attribute;
