import React, { useState, useEffect } from 'react';
/* eslint-disable */
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { InlineLoading } from 'carbon-components-react';

import { CARD_CONTENT_PADDING } from '../../constants/LayoutConstants';
import { CardPropTypes, GaugeCardPropTypes } from '../../constants/PropTypes';
import Card from '../Card/Card';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;
// r value of the circle in SVG
const radius = 30;
// radius doubled plus stroke
const gaugeSize = radius * 2 + 8;

const GaugeCard = ({
  id,
  title,
  description,
  content: { gauges },
  values,
  data,
  isLoading,
  loadData,
  hasMoreData,
  size,
  className,
  ...others
}) => {
  const [loadedState, setLoadedState] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoadedState(true);
    }, 1500);
  }, []);
  const handleScroll = e => {
    const element = e.target;
    //  height of the elements content - height element’s content is scrolled vertically === height of the scrollable part of the element
    if (
      element.scrollHeight - element.scrollTop === element.clientHeight &&
      hasMoreData &&
      !isLoading
    ) {
      loadData();
    }
  };
  const findStrokeDash = value => {
    //circumference of SVG. If r attribute changes this must also be changed here.
    const circum = 2 * Math.PI * radius;
    return (value * circum) / 100;
  };
  return (
    <Card id={id} title={title} size={size} onScroll={handleScroll} {...others}>
      <div
        className={classnames(`${iotPrefix}--gauge-container`, className)}
        style={{
          paddingTop: 0,
          paddingRight: CARD_CONTENT_PADDING,
          paddingBottom: 0,
          paddingLeft: CARD_CONTENT_PADDING,
        }}
      >
        {gauges.map((gauge, i) => (
          <meter
            key={`${gauge.dataSourceId}-${i}`}
            value={values[gauge.dataSourceId]}
            min={gauge.minimumValue}
            max={gauge.maximumValue}
            title={gauge.units}
          >
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
                '--gauge-colors': gauge.color,
                '--gauge-bg': gauge.backgroundColor,
                '--stroke-dash': findStrokeDash(values[gauge.dataSourceId]) || 0,
                '--gauge-size': gaugeSize + 'px',
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
                className={`${iotPrefix}--gauge-value`}
                x={gaugeSize / 2}
                y="32"
                textAnchor="middle"
              >
                <tspan>{values[gauge.dataSourceId]}</tspan>
              </text>
              <text
                className={`${iotPrefix}--gauge-rating`}
                x={gaugeSize / 2}
                y="50"
                textAnchor="middle"
              >
                <tspan>CPU</tspan>
              </text>
            </svg>
          </meter>
        ))}
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
        shape: 'half-circle',
        trend: null,
        thresholds: null,
      },
    ],
  },
  values: [],
};

GaugeCard.displayName = 'GaugeCard';

export default GaugeCard;
