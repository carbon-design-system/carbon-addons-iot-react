import React, { useRef, useMemo, useCallback } from 'react';
import moment from 'moment/min/moment-with-locales.min';
// TODO: fix once carbon/charts 0.16.10 comes out
import LineChart from '@carbon/charts-react/line-chart';
import '@carbon/charts/style.css';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import memoize from 'lodash/memoize';
import useDeepCompareEffect from 'use-deep-compare-effect';
import withSize from 'react-sizeme';

import { TimeSeriesCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

import { generateSampleValues, isValuesEmpty } from './timeSeriesUtils';

const LineChartWrapper = styled.div`
  padding-left: 16px;
  padding-right: 1rem;
  padding-top: ${props => (props.isLegendHidden ? '16px' : '0px')};
  padding-bottom: ${props => (!props.size === CARD_SIZES.MEDIUM ? '16px' : '0px')};
  position: absolute;
  width: 100%;
  height: ${props => props.contentHeight};

  &&& {
    .chart-wrapper g.x.axis g.tick text {
      transform: rotateY(0);
      text-anchor: initial !important;
    }
    .chart-wrapper svg.chart-svg g.x.grid g.tick line {
      stroke: #dcdcdc;
    }
    .expand-btn {
      display: ${props => (props.isEditable ? 'none' : '')};
    }
    .legend-wrapper {
      display: ${props => (props.isLegendHidden ? 'none' : '')};
      height: ${props => (!props.size === CARD_SIZES.MEDIUM ? '40px' : '20px')} !important;
      margin-top: -10px;
      padding-right: 20px;
    }
    .chart-holder {
      width: 100%;
      height: 100%;
    }
    .chart-svg {
      width: 100%;
      height: 100%;
      margin-top: ${props => (props.isLegendHidden ? '-10px' : '')};
      circle.dot {
        stroke-opacity: ${props => (props.isEditable ? '1' : '')};
      }
    }
    .chart-tooltip {
      display: ${props => (props.isEditable ? 'none' : '')};
    }
  }
`;

export const determineHeight = (size, measuredWidth) => {
  let height = '100%';
  switch (size) {
    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.LARGE:
      if (measuredWidth && measuredWidth > 635) {
        height = '90%';
      }
      break;
    case CARD_SIZES.XLARGE:
      height = '90%';
      break;
    default:
      break;
  }
  return height;
};

export const determinePrecision = (size, value, precision) => {
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

export const formatChartData = (labels, series, values) => {
  return {
    labels,
    datasets: series.map(({ dataSourceId, label, color }) => ({
      label,
      backgroundColors: color ? [color] : null,
      data: values.map(i => i[dataSourceId]),
    })),
  };
};

export const valueFormatter = (value, size, unit) => {
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
  content: { series, timeDataSourceId = 'timestamp', xLabel, yLabel, unit },
  size,
  interval,
  isEditable,
  values: valuesProp,
  locale,
  ...others
}) => {
  let chartRef = useRef();

  const values = isEditable
    ? memoizedGenerateSampleValues(series, timeDataSourceId, interval)
    : valuesProp;

  const isAllValuesEmpty = isValuesEmpty(valuesProp, timeDataSourceId);

  const valueSort = useMemo(
    () =>
      values
        ? values.sort((left, right) =>
            moment.utc(left[timeDataSourceId]).diff(moment.utc(right[timeDataSourceId]))
          )
        : [],
    [values, timeDataSourceId]
  );

  const sameYear =
    !isEmpty(values) &&
    moment(moment.unix(valueSort[0][timeDataSourceId] / 1000)).isSame(moment(), 'year') &&
    moment(moment.unix(valueSort[valueSort.length - 1][timeDataSourceId] / 1000)).isSame(
      moment(),
      'year'
    );

  const formatInterval = useCallback(
    (timestamp, index, ticksInterval, length) => {
      // moment locale default to english
      moment.locale('en');
      if (locale) {
        moment.locale(locale);
      }
      const m = moment.unix(timestamp / 1000);

      return interval === 'hour' && index === 0
        ? length > 1
          ? m.format('DD MMM')
          : m.format('DD MMM HH:mm')
        : interval === 'hour' &&
          index !== 0 &&
          !moment(moment.unix(valueSort[index - ticksInterval].timestamp / 1000)).isSame(
            moment.unix(valueSort[index].timestamp / 1000),
            'day'
          )
        ? m.format('DD MMM')
        : interval === 'hour'
        ? m.format('HH:mm')
        : interval === 'day' && index === 0
        ? m.format('DD MMM')
        : interval === 'day' && index !== 0
        ? m.format('DD MMM')
        : interval === 'month' && !sameYear
        ? m.format('MMM YYYY')
        : interval === 'month' && sameYear && index === 0
        ? m.format('MMM YYYY')
        : interval === 'month' && sameYear
        ? m.format('MMM')
        : interval === 'year'
        ? m.format('YYYY')
        : interval === 'minute'
        ? m.format('HH:mm')
        : m.format('DD MMM YYYY');
    },
    [interval, locale, sameYear, valueSort]
  );

  const maxTicksPerSize = useCallback(
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

  const ticksInterval =
    Math.round(valueSort.length / maxTicksPerSize(size)) !== 0
      ? Math.round(valueSort.length / maxTicksPerSize(size))
      : 1;

  const labels = useMemo(
    () =>
      valueSort.map((i, idx) =>
        idx % ticksInterval === 0
          ? formatInterval(i[timeDataSourceId], idx, ticksInterval, valueSort.length)
          : ' '.repeat(idx)
      ),
    [formatInterval, ticksInterval, timeDataSourceId, valueSort]
  );

  const lines = useMemo(
    () => series.map(line => ({ ...line, color: !isEditable ? line.color : 'gray' })),
    [isEditable, series]
  );

  useDeepCompareEffect(
    () => {
      if (chartRef && chartRef.chart) {
        const chartData = formatChartData(labels, lines, values);
        chartRef.chart.setData(chartData);
      }
    },
    [values, labels, lines]
  );

  const chartData = useMemo(() => formatChartData(labels, lines, values), [labels, lines, values]);
  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        const height = determineHeight(size, measuredSize.width);
        return (
          <Card
            title={title}
            size={size}
            {...others}
            isEditable={isEditable}
            isEmpty={isAllValuesEmpty}
          >
            {!others.isLoading && !isAllValuesEmpty ? (
              <LineChartWrapper
                size={size}
                contentHeight={height}
                isLegendHidden={lines.length === 1}
                isEditable={isEditable}
              >
                <LineChart
                  ref={el => {
                    chartRef = el;
                  }}
                  data={chartData}
                  options={{
                    animations: false,
                    accessibility: false,
                    scales: {
                      x: {
                        title: xLabel,
                      },
                      y: {
                        title: yLabel,
                        formatter: axisValue => valueFormatter(axisValue, size, unit),
                        // numberOfTicks: 8,
                        yMaxAdjuster: yMaxValue => yMaxValue * 1.3,
                      },
                    },
                    legendClickable: !isEditable,
                    containerResizable: true,
                    tooltip: {
                      formatter: tooltipValue => valueFormatter(tooltipValue, size, unit),
                    },
                  }}
                  width="100%"
                  height="100%"
                />
              </LineChartWrapper>
            ) : null}
          </Card>
        );
      }}
    </withSize.SizeMe>
  );
};

TimeSeriesCard.propTypes = { ...CardPropTypes, ...TimeSeriesCardPropTypes };

TimeSeriesCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
  values: [],
};

export default TimeSeriesCard;
