import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { CaretUp16, CaretDown16 } from '@carbon/icons-react';
import withSize from 'react-sizeme';
import classnames from 'classnames';

import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import { getUpdatedCardSize } from '../../utils/cardUtilityFunctions';
import CardIcon from '../ImageCard/CardIcon';

import ValueRenderer from './ValueRenderer';
import UnitRenderer from './UnitRenderer';
import { baseClassName } from './valueCardUtils';

const AttributeSecondaryValue = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  color: ${(props) => props.color || '#777'};
  fill: ${(props) => props.color || '#777'};
  font-size: 0.875rem;
  padding-left: '0.25rem')};
  margin-bottom: '0.25rem')};
`;

const propTypes = {
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types, react/require-default-props
  unit: PropTypes.any, // eslint-disable-line react/forbid-prop-types, react/require-default-props
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  /** Optional trend information */
  secondaryValue: PropTypes.shape({
    color: PropTypes.string,
    trend: PropTypes.oneOf(['up', 'down']),
    value: PropTypes.any,
  }),
  label: PropTypes.string,
  thresholds: PropTypes.arrayOf(
    PropTypes.shape({
      comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      color: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  renderIconByName: PropTypes.func,
  precision: PropTypes.number,
  /** Number of attributes that the parent ValueCard is trying to display */
  attributeCount: PropTypes.number.isRequired,
  locale: PropTypes.string,
  customFormatter: PropTypes.func,
  isEditable: PropTypes.bool,
  size: PropTypes.string.isRequired,
};

const defaultProps = {
  layout: null,
  precision: 1,
  thresholds: [],
  label: null,
  renderIconByName: null,
  secondaryValue: null,
  locale: 'en',
  customFormatter: null,
  isEditable: false,
};

/**
 * An attribute has a Value, Units and maybe a Threshold or Trend.
 * He also determines which threshold applies to a given attribute (perhaps that should be moved)
 */
const Attribute = ({
  attributeCount,
  value,
  unit,
  layout,
  secondaryValue,
  thresholds,
  precision,
  label,
  renderIconByName,
  size,
  locale,
  customFormatter,
  isEditable,
}) => {
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  // matching threshold will be the first match in the list, or a value of null if not isEditable
  const matchingThreshold = isEditable
    ? thresholds[0]
    : thresholds
        .filter((t) => {
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
    matchingThreshold && matchingThreshold.icon === undefined
      ? matchingThreshold.color
      : null;

  const bemBase = `${baseClassName}__attribute`;

  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        const allowWrap = measuredSize && measuredSize.width <= 100;
        const wrapCompact =
          allowWrap && layout === CARD_LAYOUTS.VERTICAL && attributeCount > 2;
        return (
          <div
            className={classnames(`${baseClassName}__attribute`, {
              [`${bemBase}--wrappable`]: allowWrap,
              [`${bemBase}--small`]: !label || size === CARD_SIZES.SMALL,
            })}
            size={newSize}
            label={label}>
            <ValueRenderer
              value={value}
              unit={unit}
              layout={layout}
              size={newSize}
              thresholds={thresholds}
              precision={precision}
              color={valueColor}
              allowedToWrap={allowWrap}
              wrapCompact={wrapCompact}
              locale={locale}
              customFormatter={customFormatter}
            />
            <UnitRenderer
              value={value}
              unit={unit}
              layout={layout}
              allowedToWrap={allowWrap}
              wrapCompact={wrapCompact}
              attributeCount={attributeCount}
            />
            {!isNil(secondaryValue) &&
            (!measuredSize || measuredSize.width > 100) ? (
              <AttributeSecondaryValue
                color={secondaryValue.color}
                trend={secondaryValue.trend}>
                {secondaryValue.trend && secondaryValue.trend === 'up' ? (
                  <CaretUp16
                    className={`${bemBase}_trend-icon`}
                    aria-label="trending up"
                  />
                ) : secondaryValue.trend === 'down' ? (
                  <CaretDown16
                    className={`${bemBase}_trend-icon`}
                    aria-label="trending down"
                  />
                ) : null}
                {secondaryValue.value}
              </AttributeSecondaryValue>
            ) : null}
            {matchingThreshold && matchingThreshold.icon ? (
              <div
                className={classnames(`${bemBase}-icon-container`, {
                  [`${bemBase}-icon-container--wrappable`]: allowWrap,
                })}>
                <div
                  className={classnames(`${bemBase}-threshold-icon-container`, {
                    [`${bemBase}-threshold-icon-container--wrappable`]: allowWrap,
                  })}>
                  <CardIcon
                    fill={matchingThreshold.color}
                    color={matchingThreshold.color}
                    width={16}
                    height={16}
                    title={`${matchingThreshold.comparison} ${matchingThreshold.value}`}
                    renderIconByName={renderIconByName}
                  />
                </div>
              </div>
            ) : null}
          </div>
        );
      }}
    </withSize.SizeMe>
  );
};

Attribute.propTypes = propTypes;
Attribute.defaultProps = defaultProps;

export default Attribute;
