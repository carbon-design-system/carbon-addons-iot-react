import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { Icon } from 'carbon-components-react';
import withSize from 'react-sizeme';
import classNames from 'classnames';

import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';
import { getUpdatedCardSize } from '../../utils/cardUtilityFunctions';
import CardIcon from '../ImageCard/CardIcon';
import icons from '../../utils/bundledIcons';

import ValueRenderer from './ValueRenderer';
import UnitRenderer from './UnitRenderer';

const { iotPrefix } = settings;

const StyledAttribute = styled.div`
  display: flex;
  align-items: ${props => (props.isMini ? 'center' : 'baseline')};
  ${props => (props.isVertical && props.alignValue ? `justify-content: ${props.alignValue};` : '')};
  order: 1;
  ${props =>
    !props.label || props.isVertical || props.size === CARD_SIZES.SMALL
      ? 'width: 100%'
      : 'width: 50%'};
`;

const TrendIcon = styled(Icon)`
  margin-right: 0.25rem;
`;

const ThresholdIcon = styled(CardIcon)`
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
  /** Number of attributes that the parent ValueCard is trying to display */
  attributeCount: PropTypes.number.isRequired,
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
  attributeCount,
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
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

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

  const bemBase = `${iotPrefix}--value-card__attribute`;

  const renderThresholdIcon = allowedToWrap => {
    return (
      <div
        className={classNames(`${bemBase}-threshold-icon-container`, {
          [`${bemBase}-threshold-icon-container--mini`]: isMini,
          [`${bemBase}-threshold-icon-container--wrappable`]: allowedToWrap,
        })}
      >
        <ThresholdIcon
          {...matchingThreshold}
          width={16}
          height={16}
          title={`${matchingThreshold.comparison} ${matchingThreshold.value}`}
          renderIconByName={renderIconByName}
        />
      </div>
    );
  };

  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        const allowWrap = measuredSize && measuredSize.width <= 100;
        const wrapCompact = allowWrap && layout === CARD_LAYOUTS.VERTICAL && attributeCount > 2;
        return (
          <StyledAttribute
            size={newSize}
            alignValue={alignValue}
            isVertical={isVertical}
            isMini={isMini}
            label={label}
            className={classNames({ [`${bemBase}--wrappable`]: allowWrap })}
          >
            <ValueRenderer
              value={value}
              unit={unit}
              layout={layout}
              isSmall={isSmall}
              isMini={isMini}
              size={newSize}
              thresholds={thresholds}
              precision={precision}
              isVertical={isVertical}
              color={valueColor}
              allowedToWrap={allowWrap}
              wrapCompact={wrapCompact}
            />
            <UnitRenderer
              value={value}
              unit={unit}
              layout={layout}
              isMini={isMini}
              allowedToWrap={allowWrap}
              wrapCompact={wrapCompact}
              attributeCount={attributeCount}
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
            {matchingThreshold && matchingThreshold.icon ? (
              <div
                className={classNames(`${bemBase}-icon-container`, {
                  [`${bemBase}-icon-container--wrappable`]: allowWrap,
                })}
              >
                {renderThresholdIcon(allowWrap)}
              </div>
            ) : null}
          </StyledAttribute>
        );
      }}
    </withSize.SizeMe>
  );
};

Attribute.propTypes = propTypes;
Attribute.defaultProps = defaultProps;

export default Attribute;
