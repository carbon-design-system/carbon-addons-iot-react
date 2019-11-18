import React, { useRef, useMemo, useCallback } from 'react';
import moment from 'moment/min/moment-with-locales.min';
import { LineChart } from '@carbon/charts-react';
// TODO: waiting for @carbon/charts support https://github.com/carbon-design-system/carbon-charts/pull/389
import '@carbon/charts/dist/styles.css';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import memoize from 'lodash/memoize';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { TimeSeriesCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

import {
  generateSampleValues,
  isValuesEmpty,
  formatGraphTick,
  findMatchingAlertRange,
} from './timeSeriesUtils';

const LineChartWrapper = styled.div`
  padding-left: 16px;
  padding-right: 1rem;
  padding-top: 0px;
  padding-bottom: 16px;
  position: absolute;
  width: 100%;
  height: 100%;

  &&& {
    .chart-wrapper g.x.axis g.tick text {
      transform: rotateY(0);
      text-anchor: initial !important;
    }
    .chart-holder {
      width: 100%;
      height: 100%;
      padding-top: 0.25rem;
    }
    .axis-title {
      font-weight: 500;
    }
    .bx--cc--chart-svg {
      width: 100%;
      height: 100%;
      circle.dot.unfilled {
        stroke-opacity: ${props => (props.isEditable ? '1' : '')};
      }
      circle.dot.unfilled {
        opacity: ${props => (props.numberOfPoints > 50 ? '0' : '1')};
      }
    }
    .bx--cc--tooltip {
      display: ${props => (props.isEditable ? 'none' : '')};
    }
  }
`;

const determinePrecision = (size, value, precision) => {
  // If it's an integer don't return extra values
  if (Number.isInteger(value)) {
    return 0;
  }
  // If the card is xsmall we don't have room for decimals!
  switch (size) {
    case CARD_SIZES.XSMALL:
      return Math.abs(value) > 9 ? 0 : precision;
    default:
  }
  return precision;
};

const formatChartData = (timeDataSourceId, series, values) => {
  return {
    labels: series.map(({ label }) => label),
    datasets: series.map(({ dataSourceId, label, color }) => ({
      label,
      ...(color ? { fillColors: [color] } : {}),
      data:
        values &&
        values.map(i => ({ date: new Date(i[timeDataSourceId]), value: i[dataSourceId] })),
    })),
  };
};

const valueFormatter = (value, size, unit) => {
  const precision = determinePrecision(size, value, Math.abs(value) > 1 ? 1 : 3);
  let renderValue = value;
  if (typeof value === 'number') {
    renderValue =
      value > 1000000000000
        ? `${(value / 1000000000000).toFixed(precision)}T`
        : value > 1000000000
        ? `${(value / 1000000000).toFixed(precision)}B`
        : value > 1000000
        ? `${(value / 1000000).toFixed(precision)}M`
        : value > 1000
        ? `${(value / 1000).toFixed(precision)}K`
        : value.toFixed(precision);
  } else if (isNil(value)) {
    renderValue = '--';
  }
  return `${renderValue} ${unit || ''}`;
};

const memoizedGenerateSampleValues = memoize(generateSampleValues);

const TimeSeriesCard = ({
  title,
  content: { series, timeDataSourceId = 'timestamp', alertRanges, xLabel, yLabel, unit },
  size,
  interval,
  isEditable,
  values: valuesProp,
  locale,
  i18n: { alertDetected },
  i18n,
  ...others
}) => {
  let chartRef = useRef();
  const previousTick = useRef();

  const values = isEditable
    ? memoizedGenerateSampleValues(series, timeDataSourceId, interval)
    : valuesProp;

  const isAllValuesEmpty = isValuesEmpty(values, timeDataSourceId);

  // Unfortunately the API returns the data out of order sometimes
  const valueSort = useMemo(
    () =>
      values
        ? values.sort((left, right) =>
            moment.utc(left[timeDataSourceId]).diff(moment.utc(right[timeDataSourceId]))
          )
        : [],
    [values, timeDataSourceId]
  );

  const maxTicksPerSize = useMemo(
    () => {
      switch (size) {
        case CARD_SIZES.SMALL:
          return 2;
        case CARD_SIZES.MEDIUM:
          return 4;
        case CARD_SIZES.WIDE:
        case CARD_SIZES.LARGE:
          return 6;
        case CARD_SIZES.XLARGE:
          return 14;
        default:
          return 10;
      }
    },
    [size]
  );

  const formatTick = useCallback(
    /** *
     * timestamp of current value
     * index of current value
     * ticks: array of current ticks
     */
    (timestamp, index, ticks) => {
      const previousTimestamp = previousTick.current;
      // store current in the previous tick
      previousTick.current = timestamp;
      return formatGraphTick(timestamp, index, ticks, interval, locale, previousTimestamp);
    },
    [interval, locale]
  );

  const lines = useMemo(
    () => series.map(line => ({ ...line, color: !isEditable ? line.color : 'gray' })),
    [isEditable, series]
  );

  /** Extends default tooltip with the additional date information */
  const handleTooltip = (data, defaultTooltip) => {
    const dateLabel = `<li class='datapoint-tooltip'><p class='label'>${moment(
      Array.isArray(data) && data[0] ? data[0].date : data.date
    ).format('L HH:mm:ss')}</p></li>`;
    const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
    const matchingAlertLabel = matchingAlertRange
      ? `<li class='datapoint-tooltip'><p class='label'>${alertDetected} ${
          matchingAlertRange.details
        }</p></li>`
      : '';
    let updatedTooltip = defaultTooltip;
    if (Array.isArray(data)) {
      // prepend the date inside the existing multi tooltip
      updatedTooltip = defaultTooltip
        .replace('<li', `${dateLabel}<li`)
        .replace('</ul', `${matchingAlertLabel}</ul`);
    } else {
      // wrap to make single a multi-tooltip
      updatedTooltip = `<ul class='multi-tooltip'>${dateLabel}<li>${defaultTooltip}</li>${matchingAlertLabel}</ul>`;
    }
    return updatedTooltip;
  };

  const handleStrokeColor = (datasetLabel, label, value, data, originalStrokeColor) => {
    if (!isNil(value)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange ? matchingAlertRange.color : originalStrokeColor;
    }
    return originalStrokeColor;
  };

  const handleFillColor = (datasetLabel, label, value, data, originalFillColor) => {
    if (!isNil(value)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange ? matchingAlertRange.color : originalFillColor;
    }
    return originalFillColor;
  };

  const handleIsFilled = (datasetLabel, label, value, data, isFilled) => {
    if (!isNil(value)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange ? true : isFilled;
    }
    return isFilled;
  };

  /** This is needed to update the chart when the lines and values change */
  useDeepCompareEffect(
    () => {
      if (chartRef && chartRef.chart) {
        const chartData = formatChartData(timeDataSourceId, lines, valueSort);
        chartRef.chart.model.setData(chartData);
      }
    },
    [valueSort, lines, timeDataSourceId]
  );

  /** This caches the chart value */
  const chartData = useMemo(() => formatChartData(timeDataSourceId, lines, valueSort), [
    timeDataSourceId,
    lines,
    valueSort,
  ]);

  return (
    <Card
      title={title}
      size={size}
      i18n={i18n}
      {...others}
      isEditable={isEditable}
      isEmpty={isAllValuesEmpty}
    >
      {!others.isLoading && !isAllValuesEmpty ? (
        <LineChartWrapper
          size={size}
          isEditable={isEditable}
          numberOfPoints={valueSort && valueSort.length}
        >
          <LineChart
            ref={el => {
              chartRef = el;
            }}
            data={chartData}
            options={{
              animations: false,
              accessibility: false,
              axes: {
                bottom: {
                  title: xLabel,
                  scaleType: 'time',
                  primary: true,
                  ticks: {
                    max: maxTicksPerSize,
                    formatter: formatTick,
                  },
                },
                left: {
                  title: yLabel,
                  formatter: axisValue => valueFormatter(axisValue, size, unit),
                  yMaxAdjuster: yMaxValue => yMaxValue * 1.3,
                  secondary: true,
                },
              },
              legend: { position: 'top', clickable: !isEditable, visible: lines.length > 1 },
              containerResizable: true,
              tooltip: {
                formatter: tooltipValue => valueFormatter(tooltipValue, size, unit),
                customHTML: handleTooltip,
                gridline: {
                  enabled: false,
                },
              },
              getStrokeColor: handleStrokeColor,
              getFillColor: handleFillColor,
              getIsFilled: handleIsFilled,
            }}
            width="100%"
            height="100%"
          />
        </LineChartWrapper>
      ) : null}
    </Card>
  );
};

TimeSeriesCard.propTypes = { ...CardPropTypes, ...TimeSeriesCardPropTypes };

TimeSeriesCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
  values: [],
  i18n: {
    alertDetected: 'Alert detected:',
  },
};

export default TimeSeriesCard;
