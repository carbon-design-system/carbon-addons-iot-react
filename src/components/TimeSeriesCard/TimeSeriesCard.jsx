import React, { useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/min/locales';
import LineChart from '@carbon/charts-react/line-chart';
import StackedBarChart from '@carbon/charts-react/bar-chart-stacked';
import { spacing02, spacing05 } from '@carbon/layout';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import filter from 'lodash/filter';
import memoize from 'lodash/memoize';
import capitalize from 'lodash/capitalize';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { csvDownloadHandler } from '../../utils/componentUtilityFunctions';
import { CardPropTypes } from '../../constants/CardPropTypes';
import { CARD_SIZES, TIME_SERIES_TYPES, DISABLED_COLORS } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import StatefulTable from '../Table/StatefulTable';
import { settings } from '../../constants/Settings';
import {
  getUpdatedCardSize,
  handleCardVariables,
  chartValueFormatter,
} from '../../utils/cardUtilityFunctions';
import deprecate from '../../internal/deprecate';

import { generateSampleValues, formatGraphTick, findMatchingAlertRange } from './timeSeriesUtils';

const { iotPrefix } = settings;

const TimeSeriesDatasetPropTypes = PropTypes.shape({
  label: PropTypes.string.isRequired,
  /** the attribute in values to map to */
  dataSourceId: PropTypes.string.isRequired,
  /** optional filter to apply to this particular line */
  dataFilter: PropTypes.objectOf(PropTypes.any),
  /** optional param to set the colors */
  color: PropTypes.string,
});

const TimeSeriesCardPropTypes = {
  content: PropTypes.shape({
    series: PropTypes.oneOfType([
      TimeSeriesDatasetPropTypes,
      PropTypes.arrayOf(TimeSeriesDatasetPropTypes),
    ]).isRequired,
    /** Custom X-axis label */
    xLabel: PropTypes.string,
    /** Custom Y-axis label */
    yLabel: PropTypes.string,
    /** Optionally hide zero. Useful when chart values are not close to zero, giving a better view of the meaningful data */
    includeZeroOnXaxis: PropTypes.bool,
    /** Optionally hide zero. Useful when chart values are not close to zero, giving a better view of the meaningful data */
    includeZeroOnYaxis: PropTypes.bool,
    /** Which attribute is the time attribute i.e. 'timestamp' */
    timeDataSourceId: PropTypes.string,
    /** Show timestamp in browser local time or GMT */
    showTimeInGMT: PropTypes.bool,
    /** tooltip format pattern that follows the moment formatting patterns */
    tooltipDateFormatPattern: PropTypes.string,
    /** should it be a line chart or bar chart, default is line chart */
    chartType: deprecate(
      PropTypes.oneOf(Object.values(TIME_SERIES_TYPES)),
      '\nThe prop `chartType` for Card has been deprecated. BarChartCard now handles all bar chart functionality including time-based bar charts.'
    ),
    /** optional units to put in the legend */
    unit: PropTypes.string,
  }).isRequired,
  i18n: PropTypes.shape({
    alertDetected: PropTypes.string,
    noData: PropTypes.string,
  }),
  /** array of data from the backend for instance [{timestamp: Date object || ms timestamp, temperature: 35, humidity: 10}, ...] */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    })
  ),
  cardVariables: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.number, PropTypes.bool])
  ),
  /** Interval for time series configuration used for formatting the x-axis */
  interval: PropTypes.oneOf(['minute', 'hour', 'day', 'week', 'quarter', 'month', 'year']),
  /** optional domain to graph from. First value is the beginning of the range. Second value is the end of the range
   * can be date instance or timestamp
   */
  domainRange: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.object])),
};

const LineChartWrapper = styled.div`
  padding-left: ${spacing05};
  padding-right: ${spacing05};
  padding-top: 0px;
  padding-bottom: ${spacing05};
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
      padding-top: ${spacing02};
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
              date:
                dataItem[timeDataSourceId] instanceof Date
                  ? dataItem[timeDataSourceId]
                  : new Date(dataItem[timeDataSourceId]),
              value: dataItem[dataSourceId],
              group: label,
            })
          );
      }
    });
  });

  return data;
};

const memoizedGenerateSampleValues = memoize(generateSampleValues);

/**
 * Extends default tooltip with the additional date information, and optionally alert information
 * @param {object} data data object for this particular datapoint should have a date field containing the timestamp
 * @param {string} defaultTooltip Default HTML generated for this tooltip that needs to be marked up
 * @param {array} alertRanges Array of alert range information to search
 * @param {string} alertDetected Translated string to indicate that the alert is detected
 * @param {bool} showTimeInGMT
 */
export const handleTooltip = (
  dataOrHoveredElement,
  defaultTooltip,
  alertRanges,
  alertDetected,
  showTimeInGMT,
  tooltipDateFormatPattern = 'L HH:mm:ss'
) => {
  // TODO: need to fix this in carbon-charts to support true stacked bar charts in the tooltip
  const data = dataOrHoveredElement.__data__ ? dataOrHoveredElement.__data__ : dataOrHoveredElement; // eslint-disable-line no-underscore-dangle
  const timeStamp = Array.isArray(data) ? data[0]?.date?.getTime() : data?.date?.getTime();
  const dateLabel = timeStamp
    ? `<li class='datapoint-tooltip'>
                        <p class='label'>${(showTimeInGMT // show timestamp in gmt or local time
                          ? moment.utc(timeStamp)
                          : moment(timeStamp)
                        ).format(tooltipDateFormatPattern)}</p>
                     </li>`
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
  domainRange,
  showTimeInGMT,
  tooltipDateFormatPattern,
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
      return formatGraphTick(
        timestamp,
        index,
        ticks,
        interval,
        locale,
        previousTimestamp,
        showTimeInGMT
      );
    },
    [interval, locale, showTimeInGMT]
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

  const isChartDataEmpty = isEmpty(chartData);

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
        columnNames.map(columnName => {
          const matchingDataSource = Array.isArray(series)
            ? series.find(d => d.dataSourceId === columnName)
            : series;
          return {
            id: columnName,
            // use the label if one exists as it will be the user-defined, readable name
            name: matchingDataSource ? matchingDataSource.label : columnName,
            isSortable: true,
            filter: { placeholderText: i18n.defaultFilterStringPlaceholdText },
          };
        })
      );
    },
    [columnNames, i18n.defaultFilterStringPlaceholdText, series, timeDataSourceId]
  );

  // TODO: remove in next release
  const ChartComponent = chartType === TIME_SERIES_TYPES.BAR ? StackedBarChart : LineChart;

  return (
    <Card
      title={title}
      size={newSize}
      i18n={i18n}
      {...others}
      isExpanded={isExpanded}
      isEditable={isEditable}
      isEmpty={isChartDataEmpty}
      isLazyLoading={isLazyLoading || (valueSort && valueSort.length > 200)}
      isLoading={isLoading}
    >
      {!isChartDataEmpty ? (
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
                    ...(domainRange ? { domain: domainRange } : {}),
                  },
                  left: {
                    title: `${yLabel || ''} ${unit ? `(${unit})` : ''}`,
                    mapsTo: 'value',
                    ticks: {
                      formatter: axisValue => chartValueFormatter(axisValue, newSize, null, locale),
                    },
                    ...(chartType !== TIME_SERIES_TYPES.BAR
                      ? { yMaxAdjuster: yMaxValue => yMaxValue * 1.3 }
                      : {}),
                    stacked: chartType === TIME_SERIES_TYPES.BAR && lines.length > 1,
                    includeZero: includeZeroOnYaxis,
                    scaleType: 'linear',
                  },
                },
                legend: { position: 'top', clickable: !isEditable, enabled: lines.length > 1 },
                containerResizable: true,
                tooltip: {
                  valueFormatter: tooltipValue =>
                    chartValueFormatter(tooltipValue, newSize, unit, locale),
                  customHTML: (...args) =>
                    handleTooltip(
                      ...args,
                      alertRanges,
                      alertDetected,
                      showTimeInGMT,
                      tooltipDateFormatPattern
                    ),
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
              options={{
                hasPagination: true,
                hasSearch: true,
                hasFilter: true,
              }}
              actions={{
                toolbar: {
                  onDownloadCSV: filteredData => csvDownloadHandler(filteredData, title),
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
    noDataLabel: 'No data is available for this time range.',
  },
  chartType: TIME_SERIES_TYPES.LINE,
  locale: 'en',
  content: {
    includeZeroOnXaxis: false,
    includeZeroOnYaxis: false,
  },
  showTimeInGMT: false,
  domainRange: null,
  tooltipDateFormatPattern: 'L HH:mm:ss',
};

export default TimeSeriesCard;
