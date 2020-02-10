import React, { useState, useEffect } from 'react';
import classnames from 'classnames';

import { CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import { CardPropTypes, GaugeCardPropTypes } from '../../constants/PropTypes';
import Card from '../Card/Card';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;
// r value of the circle in SVG
const radius = 30;
// radius doubled plus stroke
const gaugeSize = radius * 2 + 8;
export const getStrokeDash = (value = 0) => {
  // circumference of SVG.
  const circum = 2 * Math.PI * radius;
  // length of stroke to match percentage
  return (value * circum) / 100;
};

export const getColor = (gauge, value) => {
  let { color } = gauge;
  let grade = '';
  const comparisons = {
    '<': (a, b) => a < b,
    '>': (a, b) => a > b,
    '=': (a, b) => a === b,
    '<=': (a, b) => a <= b,
    '>=': (a, b) => a >= b,
  };
  if (gauge.thresholds) {
    gauge.thresholds.forEach(thresh => {
      if (comparisons[thresh.comparison](value, thresh.value)) {
        color = thresh.color; /* eslint-disable-line */
        grade = thresh.label;
      }
    });
    return {
      grade,
      color,
    };
  }
  return {
    grade,
    color,
  };
};
const GaugeCard = ({
  id,
  title,
  tooltip,
  content: { gauges },
  values,
  data,
  isLoading,
  hasMoreData,
  size,
  className,
  ...others
}) => {
  const [loadedState, setLoadedState] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoadedState(true);
    }, 1000);
  }, []);

  return (
    <Card
      id={id}
      className={`${iotPrefix}--gauge-card`}
      title={title}
      size={size}
      {...others}
      tooltip={tooltip}
      isLoading={isLoading}
    >
      <div
        className={classnames(`${iotPrefix}--gauge-container`, className)}
        style={{
          paddingTop: 0,
          paddingRight: CARD_CONTENT_PADDING,
          paddingBottom: 0,
          paddingLeft: CARD_CONTENT_PADDING,
        }}
      >
        {gauges.map((gauge, i) => {
          const { color, grade } = getColor(gauge, values[gauge.dataSourceId]);
          return (
            <React.Fragment key={`${iotPrefix}-gauge-${i}`}>
              <svg
                className={classnames(
                  `${iotPrefix}--gauge`,
                  { [`${iotPrefix}--gauge__loaded`]: loadedState },
                  className
                )}
                percent="0"
                style={{
                  '--gauge-value': values[gauge.dataSourceId] || 0,
                  '--gauge-max-value': gauge.maximumValue,
                  '--gauge-colors': color,
                  '--gauge-bg': gauge.backgroundColor,
                  '--stroke-dash': getStrokeDash(values[gauge.dataSourceId]) || 0,
                  '--gauge-size': `${gaugeSize}px`,
                  '--gauge-trend-color': gauge.trend.color,
                }}
              >
                <circle
                  className={`${iotPrefix}--gauge-bg`}
                  cx={gaugeSize / 2}
                  cy={gaugeSize / 2}
                  r={radius}
                />
                <circle
                  className={`${iotPrefix}--gauge-fg`}
                  cx={gaugeSize / 2}
                  cy={gaugeSize / 2}
                  r={radius}
                />
                <text
                  className={classnames(`${iotPrefix}--gauge-value`, {
                    [`${iotPrefix}--gauge-value__centered`]: !grade,
                  })}
                  x={gaugeSize / 2}
                  y="33"
                  textAnchor="middle"
                >
                  <tspan>{values[gauge.dataSourceId] + gauge.units}</tspan>
                </text>
                <text
                  className={`${iotPrefix}--gauge-rating`}
                  x={gaugeSize / 2}
                  y="48"
                  textAnchor="middle"
                >
                  <tspan>{grade}</tspan>
                </text>
              </svg>

              {values[gauge.trend.dataSourceId] && (
                <div
                  className={classnames(`${iotPrefix}--gauge-trend`, {
                    [`${iotPrefix}--gauge-trend__up`]: gauge.trend.trend === 'up',
                    [`${iotPrefix}--gauge-trend__down`]: gauge.trend.trend === 'down',
                  })}
                  key={`${gauge.trend.dataSourceId}-${i}`}
                >
                  <p style={{ '--gauge-trend-color': gauge.trend.color }}>
                    {values[gauge.trend.dataSourceId]}
                  </p>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
};

GaugeCard.propTypes = {
  ...CardPropTypes,
  ...GaugeCardPropTypes,
};

GaugeCard.defaultProps = {
  isLoading: false,
  description: null,
  content: {
    gauges: [
      {
        dataSourceId: null,
        units: '%',
        minimumValue: 0,
        maximumValue: 100,
        renderValueFunction: null,
        color: 'yellow',
        backgroundColor: 'gray',
        // @TODO: support half-circle and line gauge
        shape: 'circle',
        trend: null,
        thresholds: null,
      },
    ],
  },
  values: [],
};

GaugeCard.displayName = 'GaugeCard';

export default GaugeCard;
