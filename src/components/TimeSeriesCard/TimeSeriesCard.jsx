import React, { Fragment, useRef, useMemo, useCallback } from 'react';
import moment from 'moment/min/moment-with-locales.min';
import LineChart from '@carbon/charts-react/line-chart';
// TODO: waiting for @carbon/charts support https://github.com/carbon-design-system/carbon-charts/pull/389
import '@carbon/charts/dist/styles.css';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import omit from 'lodash/omit';
import memoize from 'lodash/memoize';
import capitalize from 'lodash/capitalize';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { csvDownloadHandler } from '../../utils/componentUtilityFunctions';
import { TimeSeriesCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import StatefulTable from '../Table/StatefulTable';

import {
  generateSampleValues,
  isValuesEmpty,
  formatGraphTick,
  findMatchingAlertRange,
} from './timeSeriesUtils';

const StyledTable = styled(StatefulTable)`
  position: absolute;
  top: 55%;
  height: 45%;
  width: 100%;
  overflow-y: scroll;
`;

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
      height: ${props => (props.isExpanded ? '50%' : '100%')};
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

/**
 * Determines how many decimals to show for a value based on the value, the available size of the card
 * @param {string} size constant that describes the size of the Table card
 * @param {any} value will be checked to determine how many decimals to show
 * @param {*} defaultPrecision Desired decimal precision, but may be overridden based on the value type or card size
 */
export const determinePrecision = (size, value, defaultPrecision) => {
  // If it's an integer don't return extra values
  if (Number.isInteger(value)) {
    return 0;
  }
  // If the card is xsmall we don't have room for decimals!
  switch (size) {
    case CARD_SIZES.XSMALL:
      return Math.abs(value) > 9 ? 0 : defaultPrecision;
    default:
  }
  return defaultPrecision;
};

/**
 * Translates our raw data into a language the carbon-charts understand
 * @param {string} timeDataSourceId, the field that identifies the timestamp value in the data
 * @param {array} series, an array of lines to create in our chart
 * @param {array} values, the array of values from our data layer
 *
 * @returns {object} with a labels array and a datasets array
 */
export const formatChartData = (timeDataSourceId = 'timestamp', series, values) => {
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

/**
 * Determines how to format our values for our lines
 *
 * @param {any} value any value possible, but will only special format if a number
 * @param {string} size card size
 * @param {string} unit any optional units to show
 */
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
  return `${renderValue}${!isNil(unit) ? ` ${unit}` : ''}`;
};

const memoizedGenerateSampleValues = memoize(generateSampleValues);

/**
 * Extends default tooltip with the additional date information, and optionally alert information
 * @param {object} data data object for this particular datapoint should have a date field containing the timestamp
 * @param {string} defaultTooltip Default HTML generated for this tooltip that needs to be marked up
 * @param {array} alertRanges Array of alert range information to search
 * @param {string} alertDetected Translated string to indicate that the alert is detected
 */
export const handleTooltip = (data, defaultTooltip, alertRanges, alertDetected) => {
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

const TimeSeriesCard = ({
  title,
  content: { series, timeDataSourceId = 'timestamp', alertRanges, xLabel, yLabel, unit },
  size,
  interval,
  isEditable,
  values: valuesProp,
  locale,
  i18n: { alertDetected, noDataLabel },
  i18n,
  isExpanded,
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

  const handleStrokeColor = (datasetLabel, label, value, data, originalStrokeColor) => {
    if (!isNil(value)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange ? matchingAlertRange.color : originalStrokeColor;
    }
    return originalStrokeColor;
  };

  const handleFillColor = (datasetLabel, label, value, data, originalFillColor) => {
    const defaultFillColor = !isEditable ? originalFillColor : '#f3f3f3';
    if (!isNil(value)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange ? matchingAlertRange.color : defaultFillColor;
    }
    // If it's editable don't fill the dot
    return defaultFillColor;
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

  const tableData = useMemo(
    () => {
      return valueSort.map((value, index) => ({
        id: `dataindex-${index}`,
        values: {
          ...omit(value, timeDataSourceId), // skip the timestamp so we can format it locally
          [timeDataSourceId]: moment(value[timeDataSourceId]).format('L HH:mm'),
        },
        isSelectable: false,
      }));
    },
    [timeDataSourceId, valueSort]
  );

  // In expanded mode we show the data underneath the linechart in a table so need to build the columns
  const tableColumns = useMemo(
    () => {
      // First column is timestamp
      const columns = [
        {
          id: timeDataSourceId,
          name: capitalize(timeDataSourceId),
          isSortable: true,
          type: 'TIMESTAMP',
        },
      ];
      // then the rest in series order
      return columns.concat(
        series.map(line => ({
          id: line.dataSourceId,
          name: line.label,
          isSortable: true,
          filter: { placeholderText: i18n.defaultFilterStringPlaceholdText },
        }))
      );
    },
    [i18n.defaultFilterStringPlaceholdText, series, timeDataSourceId]
  );

  return (
    <Card
      title={title}
      size={size}
      i18n={i18n}
      {...others}
      isExpanded={isExpanded}
      isEditable={isEditable}
      isEmpty={isAllValuesEmpty}
    >
      {!others.isLoading && !isAllValuesEmpty ? (
        <Fragment>
          <LineChartWrapper
            size={size}
            isEditable={isEditable}
            isExpanded={isExpanded}
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
                  customHTML: (...args) => handleTooltip(...args, alertRanges, alertDetected),
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
          {isExpanded ? (
            <StyledTable
              columns={tableColumns}
              data={tableData}
              isExpanded={isExpanded}
              options={{
                hasPagination: true,
                hasSearch: true,
                hasFilter: true,
              }}
              actions={{
                toolbar: {
                  onDownloadCSV: () => csvDownloadHandler(tableData, title),
                },
              }}
              view={{
                pagination: {
                  pageSize: 10,
                  pageSizes: [10, 20, 30],
                },
                toolbar: {
                  activeBar: null,
                },
                filters: [],
                table: {
                  sort: {
                    columnId: timeDataSourceId,
                    direction: 'DESC',
                  },
                  emptyState: {
                    message: noDataLabel,
                  },
                },
              }}
              i18n={i18n}
            />
          ) : null}
        </Fragment>
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
