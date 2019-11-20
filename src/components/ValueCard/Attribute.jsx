import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { Icon } from 'carbon-components-react';
import withSize from 'react-sizeme';

import icons from '../../utils/bundledIcons';
import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';

import ValueRenderer from './ValueRenderer';
import UnitRenderer from './UnitRenderer';

const StyledAttribute = styled.div`
  display: flex;
  align-items: ${props => (props.isMini ? 'center' : 'baseline')};
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
  ${props => !props.isMini && 'margin: 0 0 0.5rem 0.5rem;'}
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
  padding-left: ${props => (props.isMini ? '0.5rem' : '0.25rem')};
  margin-bottom: ${props => (props.isMini ? '0' : '0.25rem')};
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
  isMini: PropTypes.bool,
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
  renderIconByName: PropTypes.func,
  precision: PropTypes.number,
};

const defaultProps = {
  layout: null,
  precision: 1,
  thresholds: [],
  isVertical: false,
  alignValue: null,
  isSmall: false,
  isMini: false,
  label: null,
  renderIconByName: null,
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
  isMini,
  label,
  renderIconByName,
  size, // eslint-disable-line
}) => {
  // matching threshold will be the first match in the list, or a value of null
  const matchingThreshold = thresholds
    .filter(t => {
      switch (t.comparison) {
        case '<':
          return !isNil(value) && value < t.value;
        case '>':
          return value > t.value;
        case '=':
          return value === t.value;
        case '<=':
          return !isNil(value) && value <= t.value;
        case '>=':
          return value >= t.value;
        default:
          return false;
      }
    })
    .concat([null])[0];
  const valueColor =
    matchingThreshold && matchingThreshold.icon === undefined ? matchingThreshold.color : null;
  const thresholdIconProps = matchingThreshold
    ? {
        title: `${matchingThreshold.comparison} ${matchingThreshold.value}`,
        fill: matchingThreshold.color,
        tabIndex: '0',
        description: `${matchingThreshold.comparison} ${matchingThreshold.value}`,
      }
    : {};
  const thresholdIcon =
    matchingThreshold && matchingThreshold.icon ? (
      <ThresholdIconWrapper isMini={isMini}>
        {renderIconByName ? (
          renderIconByName(matchingThreshold.icon, thresholdIconProps)
        ) : (
          <ThresholdIcon
            icon={icons[matchingThreshold.icon] || icons.help}
            iconTitle={`${matchingThreshold.comparison} ${matchingThreshold.value}`}
            fill={matchingThreshold.color}
            description={`${matchingThreshold.comparison} ${matchingThreshold.value}`}
          />
        )}
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
            isMini={isMini}
            label={label}
          >
            <ValueRenderer
              value={value}
              unit={unit}
              layout={layout}
              isSmall={isSmall}
              isMini={isMini}
              size={size}
              thresholds={thresholds}
              precision={precision}
              isVertical={isVertical}
              color={valueColor}
            />
            <UnitRenderer
              isVisible={!measuredSize || measuredSize.width > 100}
              value={value}
              unit={unit}
              layout={layout}
              isMini={isMini}
            />
            {!isNil(secondaryValue) && (!measuredSize || measuredSize.width > 100) ? (
              <AttributeSecondaryValue
                color={secondaryValue.color}
                trend={secondaryValue.trend}
                isMini={isMini}
              >
                {secondaryValue.trend && secondaryValue.trend === 'up' ? (
                  <TrendIcon icon={icons.caretUp} description="trending up" />
                ) : secondaryValue.trend === 'down' ? (
                  <TrendIcon icon={icons.caretDown} description="trending down" />
                ) : null}
                {!isMini && secondaryValue.value}
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
