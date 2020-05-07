import React, { useRef, useMemo, useCallback } from 'react';
import moment from 'moment';
import 'moment/min/locales';
import LineChart from '@carbon/charts-react/line-chart';
import StackedBarChart from '@carbon/charts-react/bar-chart-stacked';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import filter from 'lodash/filter';
import memoize from 'lodash/memoize';
import capitalize from 'lodash/capitalize';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { csvDownloadHandler } from '../../utils/componentUtilityFunctions';
import { TimeSeriesCardPropTypes, CardPropTypes } from '../../constants/CardPropTypes';
import { CARD_SIZES, TIME_SERIES_TYPES, DISABLED_COLORS } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import StatefulTable from '../Table/StatefulTable';
import { settings } from '../../constants/Settings';
import {
  getUpdatedCardSize,
  formatNumberWithPrecision,
  handleCardVariables,
} from '../../utils/cardUtilityFunctions';

import {
  generateSampleValues,
  isValuesEmpty,
  formatGraphTick,
  findMatchingAlertRange,
} from './timeSeriesUtils';

const { iotPrefix } = settings;

const LineChartWrapper = styled.div`
  padding-left: 16px;
  padding-right: 1rem;
  padding-top: 0px;
  padding-bottom: 16px;
  position: absolute;
  width: 100%;
  height: ${props => (props.isExpanded ? '55%' : '100%')};

  &&& {
    .chart-wrapper g.x.axis g.tick text {
      transform: rotateY(0);
      text-anchor: initial !important;
    }
    .chart-holder {
      width: 100%;
      padding-top: 0.25rem;
    }
    .axis-title {
      font-weight: 500;
    }
    .bx--cc--chart-svg {
      width: 100%;
      height: 100%;
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
    case CARD_SIZES.SMALL:
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
 * TODO: Handle empty data lines gracefully and notify the user of data lines that did not
 * match the dataFilter
 *
 * @returns {object} with a labels array and a datasets array
 */
export const formatChartData = (timeDataSourceId = 'timestamp', series, values) => {
  const timestamps = [...new Set(values.map(val => val[timeDataSourceId]))];
  const data = [];
  // Series is the different groups of datasets
  series.forEach(({ dataSourceId, dataFilter = {}, label }) => {
    timestamps.forEach(timestamp => {
      // First filter based on on the dataFilter
      const filteredData = filter(values, dataFilter);
      if (!isEmpty(filteredData)) {
        // have to filter out null values from the dataset, as it causes Carbon Charts to break
        filteredData
          .filter(dataItem => {
            return !isNil(dataItem[dataSourceId]) && dataItem[timeDataSourceId] === timestamp;
          })
          .forEach(dataItem =>
            data.push({
              date: new Date(dataItem[timeDataSourceId]),
              value: dataItem[dataSourceId],
              group: label,
            })
          );
      }
    });
  });

  return data;
};

/**
 * Determines how to format our values for our lines
 *
 * @param {any} value any value possible, but will only special format if a number
 * @param {string} size card size
 * @param {string} unit any optional units to show
 */
export const valueFormatter = (value, size, unit, locale) => {
  const precision = determinePrecision(size, value, Math.abs(value) > 1 ? 1 : 3);
  let renderValue = value;
  if (typeof value === 'number') {
    renderValue = formatNumberWithPrecision(value, precision, locale);
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
export const handleTooltip = (dataOrHoveredElement, defaultTooltip, alertRanges, alertDetected) => {
  // TODO: need to fix this in carbon-charts to support true stacked bar charts in the tooltip
  const data = dataOrHoveredElement.__data__ ? dataOrHoveredElement.__data__ : dataOrHoveredElement; // eslint-disable-line
  const timeStamp = Array.isArray(data) && data[0] ? data[0].date : data.date || data.label;
  const dateLabel = timeStamp
    ? `<li class='datapoint-tooltip'><p class='label'>${moment(timeStamp).format(
        'L HH:mm:ss'
      )}</p></li>`
    : '';
  const matchingAlertRanges = findMatchingAlertRange(alertRanges, data);
  const matchingAlertLabels = Array.isArray(matchingAlertRanges)
    ? matchingAlertRanges
        .map(
          matchingAlertRange =>
            `<li class='datapoint-tooltip'><a style="background-color:${
              matchingAlertRange.color
            }" class="tooltip-color"></a><p class='label'>${alertDetected} ${
              matchingAlertRange.details
            }</p></li>`
        )
        .join('')
    : '';
  let updatedTooltip = defaultTooltip;
  if (Array.isArray(data)) {
    // prepend the date inside the existing multi tooltip
    updatedTooltip = defaultTooltip
      .replace('<li', `${dateLabel}<li`)
      .replace('</ul', `${matchingAlertLabels}</ul`);
  } else {
    // wrap to make single a multi-tooltip
    updatedTooltip = `<ul class='multi-tooltip'>${dateLabel}<li>${defaultTooltip}</li>${matchingAlertLabels}</ul>`;
  }
  return updatedTooltip;
};

/**
 * Formats and maps the colors to their corresponding datasets in the carbon charts tabular data format
 * @param {Array} series an array of dataset group classifications
 * @returns {Object} colors - formatted
 */
export const formatColors = series => {
  const colors = { identifier: 'group', scale: {} };
  if (Array.isArray(series)) {
    series.forEach(dataset => {
      colors.scale[dataset.label] = dataset.color;
    });
  } else {
    colors.scale[series.label] = series.color;
  }
  return colors;
};

const TimeSeriesCard = ({
  title: titleProp,
  content,
  size,
  interval,
  isEditable,
  values: initialValues,
  locale,
  i18n: { alertDetected, noDataLabel },
  i18n,
  isExpanded,
  isLazyLoading,
  isLoading,
  ...others
}) => {
  const {
    title,
    content: {
      series,
      timeDataSourceId = 'timestamp',
      alertRanges,
      xLabel,
      yLabel,
      includeZeroOnXaxis,
      includeZeroOnYaxis,
      unit,
      chartType,
    },
    values: valuesProp,
  } = handleCardVariables(titleProp, content, initialValues, others);
  let chartRef = useRef();
  const previousTick = useRef();
  moment.locale(locale);

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

  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const maxTicksPerSize = useMemo(
    () => {
      switch (newSize) {
        case CARD_SIZES.MEDIUMTHIN:
          return 2;
        case CARD_SIZES.MEDIUM:
          return 4;
        case CARD_SIZES.MEDIUMWIDE:
        case CARD_SIZES.LARGE:
          return 6;
        case CARD_SIZES.LARGEWIDE:
          return 14;
        default:
          return 10;
      }
    },
    [newSize]
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
    () =>
      series.map((line, index) => ({
        ...line,
        color: !isEditable ? line.color : DISABLED_COLORS[index % DISABLED_COLORS.length],
      })),
    [isEditable, series]
  );

  // Set the colors for each dataset
  const colors = formatColors(series);

  const handleStrokeColor = (datasetLabel, label, data, originalStrokeColor) => {
    if (!isNil(data)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange?.length > 0 ? matchingAlertRange[0].color : originalStrokeColor;
    }
    return originalStrokeColor;
  };

  const handleFillColor = (datasetLabel, label, data, originalFillColor) => {
    // If it's editable don't fill the dot
    const defaultFillColor = !isEditable ? originalFillColor : '#f3f3f3';
    if (!isNil(data)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange?.length > 0 ? matchingAlertRange[0].color : defaultFillColor;
    }

    return defaultFillColor;
  };

  const handleIsFilled = (datasetLabel, label, data, isFilled) => {
    if (!isNil(data)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange?.length > 0 ? true : isFilled;
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

  const { tableData, columnNames } = useMemo(
    () => {
      let maxColumnNames = [];
      const tableValues = valueSort.map((value, index) => {
        const currentValueColumns = Object.keys(omit(value, timeDataSourceId));
        maxColumnNames =
          currentValueColumns.length > maxColumnNames.length ? currentValueColumns : maxColumnNames;
        return {
          id: `dataindex-${index}`,
          values: {
            ...omit(value, timeDataSourceId), // skip the timestamp so we can format it locally
            [timeDataSourceId]: moment(value[timeDataSourceId]).format('L HH:mm'),
          },
          isSelectable: false,
        };
      });
      return { tableData: tableValues, columnNames: maxColumnNames };
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
        columnNames.map(columnName => ({
          id: columnName,
          name: capitalize(columnName),
          isSortable: true,
          filter: { placeholderText: i18n.defaultFilterStringPlaceholdText },
        }))
      );
    },
    [columnNames, i18n.defaultFilterStringPlaceholdText, timeDataSourceId]
  );

  const ChartComponent = chartType === TIME_SERIES_TYPES.BAR ? StackedBarChart : LineChart;

  return (
    <Card
      title={title}
      size={newSize}
      i18n={i18n}
      {...others}
      isExpanded={isExpanded}
      isEditable={isEditable}
      isEmpty={isAllValuesEmpty}
      isLazyLoading={isLazyLoading || (valueSort && valueSort.length > 200)}
    >
      {!isLoading && !isAllValuesEmpty ? (
        <>
          <LineChartWrapper
            size={newSize}
            isEditable={isEditable}
            isExpanded={isExpanded}
            numberOfPoints={valueSort && valueSort.length}
          >
            <ChartComponent
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
                    mapsTo: 'date',
                    scaleType: 'time',
                    ticks: {
                      max: maxTicksPerSize,
                      formatter: formatTick,
                    },
                    includeZero: includeZeroOnXaxis,
                  },
                  left: {
                    title: `${yLabel || ''} ${unit ? `(${unit})` : ''}`,
                    mapsTo: 'value',
                    ticks: {
                      formatter: axisValue => valueFormatter(axisValue, newSize, null, locale),
                    },
                    ...(chartType !== TIME_SERIES_TYPES.BAR
                      ? { yMaxAdjuster: yMaxValue => yMaxValue * 1.3 }
                      : {}),
                    stacked: chartType === TIME_SERIES_TYPES.BAR && lines.length > 1,
                    includeZero: includeZeroOnYaxis,
                  },
                },
                legend: { position: 'top', clickable: !isEditable, enabled: lines.length > 1 },
                containerResizable: true,
                tooltip: {
                  valueFormatter: tooltipValue =>
                    valueFormatter(tooltipValue, newSize, unit, locale),
                  customHTML: (...args) =>
                    handleTooltip(...args, alertRanges, alertDetected, locale),
                  gridline: {
                    enabled: false,
                  },
                },
                getStrokeColor: handleStrokeColor,
                getFillColor: handleFillColor,
                getIsFilled: handleIsFilled,
                color: colors,
              }}
              width="100%"
              height="100%"
            />
          </LineChartWrapper>
          {isExpanded ? (
            <StatefulTable
              className={`${iotPrefix}--time-series-card--stateful-table`}
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
        </>
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
  chartType: TIME_SERIES_TYPES.LINE,
  locale: 'en',
  content: {
    includeZeroOnXaxis: false,
    includeZeroOnYaxis: false,
  },
};

export default TimeSeriesCard;
