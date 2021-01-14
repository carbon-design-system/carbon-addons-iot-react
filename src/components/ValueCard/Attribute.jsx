import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import { CaretUp16, CaretDown16 } from '@carbon/icons-react';
import withSize from 'react-sizeme';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';
import CardIcon from '../ImageCard/CardIcon';

import ValueRenderer from './ValueRenderer';
import UnitRenderer from './UnitRenderer';
import { BASE_CLASS_NAME } from './valueCardUtils';

const propTypes = {
  attribute: PropTypes.shape({
    dataFilter: PropTypes.object,
    dataSourceId: PropTypes.string.isRequired,
    label: PropTypes.string,
    unit: PropTypes.string,
  }).isRequired,
  customFormatter: PropTypes.func,
  isEditable: PropTypes.bool,
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  locale: PropTypes.string,
  // decimal precision
  precision: PropTypes.number,
  renderIconByName: PropTypes.func,
  /** Optional trend information */
  secondaryValue: PropTypes.shape({
    color: PropTypes.string,
    trend: PropTypes.oneOf(['up', 'down']),
    value: PropTypes.any,
  }),
  // card size
  size: PropTypes.string.isRequired,
  thresholds: PropTypes.arrayOf(
    PropTypes.shape({
      comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      color: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  value: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  fontSize: PropTypes.number.isRequired,
};

const defaultProps = {
  layout: null,
  precision: 1,
  thresholds: [],
  renderIconByName: null,
  secondaryValue: null,
  locale: 'en',
  customFormatter: null,
  isEditable: false,
};

const BEM_BASE = `${BASE_CLASS_NAME}__attribute`;

/**
 * An attribute has a Value, Units and maybe a Threshold or Trend.
 * He also determines which threshold applies to a given attribute (perhaps that should be moved)
 */
const Attribute = ({
  attribute: { dataSourceId, dataFilter, label, unit },
  customFormatter,
  isEditable,
  layout,
  locale,
  precision,
  renderIconByName,
  secondaryValue,
  size,
  value,
  thresholds,
  fontSize,
}) => {
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

  return (
    <React.Fragment
      key={`fragment-${dataSourceId}-${JSON.stringify(dataFilter || {})}`}>
      <div className={`${BEM_BASE}-wrapper`}>
        <div className={`${BEM_BASE}-label`}>{label}</div>
        <withSize.SizeMe>
          {({ size: measuredSize }) => {
            return (
              <div className={`${BEM_BASE}`}>
                <ValueRenderer
                  value={value}
                  layout={layout}
                  size={size}
                  precision={precision}
                  color={valueColor}
                  locale={locale}
                  customFormatter={customFormatter}
                  fontSize={fontSize}
                />
                <UnitRenderer unit={unit} />
                {!isNil(secondaryValue) &&
                (!measuredSize || measuredSize.width > 100) ? (
                  <div
                    className={`${BEM_BASE}-secondary-value`}
                    style={{
                      '--secondary-value-color': secondaryValue.color || '#777',
                    }}>
                    {secondaryValue.trend && secondaryValue.trend === 'up' ? (
                      <CaretUp16
                        className={`${BEM_BASE}_trend-icon`}
                        aria-label="trending up"
                      />
                    ) : secondaryValue.trend === 'down' ? (
                      <CaretDown16
                        className={`${BEM_BASE}_trend-icon`}
                        aria-label="trending down"
                      />
                    ) : null}
                    {secondaryValue.value}
                  </div>
                ) : null}
                {matchingThreshold && matchingThreshold.icon ? (
                  <div className={`${BEM_BASE}-icon-container`}>
                    <div className={`${BEM_BASE}-threshold-icon-container`}>
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
      </div>
    </React.Fragment>
  );
};

Attribute.propTypes = propTypes;
Attribute.defaultProps = defaultProps;

export default Attribute;
