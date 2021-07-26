import React, { useState, useEffect, Fragment } from 'react';
import classnames from 'classnames';
import { gray20, yellow } from '@carbon/colors';

import { CARD_CONTENT_PADDING, CARD_SIZES } from '../../constants/LayoutConstants';
import { CardPropTypes, GaugeCardPropTypes } from '../../constants/CardPropTypes';
import Card from '../Card/Card';
import DataStateRenderer from '../Card/DataStateRenderer';
import { settings } from '../../constants/Settings';
import { getResizeHandles } from '../../utils/cardUtilityFunctions';

const { iotPrefix } = settings;

const STROKE_SIZE = 8;
// r value of the circle in SVG
const radius = 30;
// radius doubled plus stroke
const gaugeSize = radius * 2 + STROKE_SIZE;
// circumference of SVG.
const circum = 2 * Math.PI * radius;
export const getStrokeDash = (value = 0) => {
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
    gauge.thresholds.forEach((thresh) => {
      if (comparisons[thresh.comparison](value, thresh.value)) {
        color = thresh.color; // eslint-disable-line prefer-destructuring
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
  children,
  id,
  title,
  tooltip,
  content: { gauges },
  values,
  data,
  isLoading,
  isResizable,
  hasMoreData,
  size,
  className,
  dataState,
  // TODO: remove deprecated testID in v3.
  testID,
  testId,
  ...others
}) => {
  const [loadedState, setLoadedState] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadedState(true);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const myStyles = dataState
    ? {}
    : {
        paddingTop: 0,
        paddingRight: CARD_CONTENT_PADDING,
        paddingBottom: CARD_CONTENT_PADDING,
        paddingLeft: CARD_CONTENT_PADDING,
        rowGap: size === CARD_SIZES.SMALL ? 0 : '1rem',
      };

  const resizeHandles = isResizable ? getResizeHandles(children) : [];

  return (
    <Card
      id={id}
      className={`${iotPrefix}--gauge-card`}
      title={title}
      size={size}
      resizeHandles={resizeHandles}
      // TODO: remove deprecated testID in v3.
      testId={testID || testId}
      {...others}
      tooltip={tooltip}
      isLoading={isLoading}
    >
      <div className={classnames(`${iotPrefix}--gauge-container`, className)} style={myStyles}>
        {dataState && <DataStateRenderer dataState={dataState} size={size} id={id} />}
        {!dataState &&
          gauges.map((gauge, i) => {
            const { color } = getColor(gauge, values[gauge.dataSourceId]);
            const valueLength =
              values[gauge.dataSourceId] && values[gauge.dataSourceId].toString().length;
            return (
              <Fragment key={`${iotPrefix}-gauge-${i}`}>
                <svg
                  aria-labelledby="gauge-label"
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
                    '--stroke-dash-array': circum,
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
                    id="gauge-label"
                    className={classnames(
                      `${iotPrefix}--gauge-value`,
                      `${iotPrefix}--gauge-value__centered`,
                      { [`${iotPrefix}--gauge-value-sm`]: valueLength === 4 },
                      { [`${iotPrefix}--gauge-value-md`]: valueLength === 3 },
                      { [`${iotPrefix}--gauge-value-lg`]: valueLength <= 2 }
                    )}
                    x={gaugeSize / 2}
                    y={gaugeSize / 2 + STROKE_SIZE}
                    textAnchor="middle"
                  >
                    <tspan>{values[gauge.dataSourceId]}</tspan>
                    <tspan>{gauge.units}</tspan>
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
              </Fragment>
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
        color: yellow,
        backgroundColor: gray20,
        // @TODO: support half-circle and line gauge
        shape: 'circle',
        trend: null,
        thresholds: null,
      },
    ],
  },
  values: {},
};

GaugeCard.displayName = 'GaugeCard';

export default GaugeCard;
