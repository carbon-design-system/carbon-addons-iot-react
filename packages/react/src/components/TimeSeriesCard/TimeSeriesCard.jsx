import React, { useRef, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import 'moment/min/locales';
import { LineChart, StackedBarChart } from '@carbon/charts-react';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import filter from 'lodash/filter';
import capitalize from 'lodash/capitalize';
import useDeepCompareEffect from 'use-deep-compare-effect';

import {
  convertStringsToDOMElement,
  csvDownloadHandler,
} from '../../utils/componentUtilityFunctions';
import { CardPropTypes, ZoomBarPropTypes, CHART_COLORS } from '../../constants/CardPropTypes';
import {
  CARD_SIZES,
  TIME_SERIES_TYPES,
  ZOOM_BAR_ENABLED_CARD_SIZES,
} from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import StatefulTable from '../Table/StatefulTable';
import { settings } from '../../constants/Settings';
import {
  getUpdatedCardSize,
  handleCardVariables,
  chartValueFormatter,
  getResizeHandles,
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
    /** the number of decimals to show in the legend and on the y-axis */
    decimalPrecision: PropTypes.number,
    /** Optionally hide zero. Useful when chart values are not close to zero, giving a better view of the meaningful data */
    includeZeroOnXaxis: PropTypes.bool,
    /** Optionally hide zero. Useful when chart values are not close to zero, giving a better view of the meaningful data */
    includeZeroOnYaxis: PropTypes.bool,
    /** Which attribute is the time attribute i.e. 'timestamp' */
    timeDataSourceId: PropTypes.string,
    /** should it be a line chart or bar chart, default is line chart */
    chartType: deprecate(
      PropTypes.oneOf(Object.values(TIME_SERIES_TYPES)),
      '\nThe prop `chartType` for Card has been deprecated. BarChartCard now handles all bar chart functionality including time-based bar charts.'
    ),
    /** optional units to put in the legend */
    unit: PropTypes.string,
    /** Optionally adds a zoom bar to the chart */
    zoomBar: ZoomBarPropTypes,
    /** Number of grid-line spaces to the left and right of the chart to add white space to. Defaults to 1 */
    addSpaceOnEdges: PropTypes.number,
    /** whether or not to show a legend at the bottom of the card
     * if not explicitly stated, the card will show based on the length of the series
     */
    showLegend: PropTypes.bool,
  }).isRequired,
  i18n: PropTypes.shape({
    alertDetected: PropTypes.string,
    noData: PropTypes.string,
    tooltipGroupLabel: PropTypes.string,
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
  /** Region for value and text formatting */
  locale: PropTypes.string,
  /** Show timestamp in browser local time or GMT */
  showTimeInGMT: PropTypes.bool,
  /** tooltip format pattern that follows the moment formatting patterns */
  tooltipDateFormatPattern: PropTypes.string,
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
  // Generate a set of unique timestamps for the values
  const timestamps = [...new Set(values.map((val) => val[timeDataSourceId]))];
  const data = [];

  // Series is the different groups of datasets
  series.forEach(({ dataSourceId, dataFilter = {}, label }) => {
    timestamps.forEach((timestamp) => {
      // First filter based on on the dataFilter
      const filteredData = filter(values, dataFilter);
      if (!isEmpty(filteredData)) {
        // have to filter out null values from the dataset, as it causes Carbon Charts to break
        filteredData
          .filter((dataItem) => {
            // only allow valid timestamp matches
            return !isNil(dataItem[timeDataSourceId]) && dataItem[timeDataSourceId] === timestamp;
          })
          .forEach((dataItem) => {
            // Check to see if the data Item actually exists in this timestamp before adding to data (to support sparse data in the values)
            if (dataItem[dataSourceId]) {
              data.push({
                date:
                  dataItem[timeDataSourceId] instanceof Date
                    ? dataItem[timeDataSourceId]
                    : new Date(dataItem[timeDataSourceId]),
                value: dataItem[dataSourceId],
                group: label,
              });
            }
          });
      }
    });
  });

  return data;
};

/**
 * Extends default tooltip with the additional date information, and optionally alert information
 * @param {object} dataOrHoveredElement data object for this particular datapoint should have a date field containing the timestamp
 * @param {string} defaultTooltip Default HTML generated for this tooltip that needs to be marked up
 * @param {array} alertRanges Array of alert range information to search
 * @param {string} alertDetected Translated string to indicate that the alert is detected
 * @param {bool} showTimeInGMT
 * @param {string} tooltipDateFormatPattern
 * @returns {string} DOM representation of the tooltip
 */
export const handleTooltip = (
  dataOrHoveredElement,
  defaultTooltip,
  alertRanges,
  alertDetected,
  showTimeInGMT,
  tooltipDateFormatPattern = 'L HH:mm:ss'
) => {
  const data = dataOrHoveredElement.__data__ // eslint-disable-line no-underscore-dangle
    ? dataOrHoveredElement.__data__ // eslint-disable-line no-underscore-dangle
    : dataOrHoveredElement;
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
          (matchingAlertRange) =>
            `<li class='datapoint-tooltip'><a style="background-color:${matchingAlertRange.color}" class="tooltip-color"></a><p class='label'>${alertDetected} ${matchingAlertRange.details}</p></li>`
        )
        .join('')
    : '';

  // Convert strings to DOM Elements so we can easily reason about them and manipulate/replace pieces.
  const [defaultTooltipDOM, dateLabelDOM, matchingAlertLabelsDOM] = convertStringsToDOMElement([
    defaultTooltip,
    dateLabel,
    matchingAlertLabels,
  ]);

  // The first <li> will always be carbon chart's Dates row in this case, replace with our date format <li>
  defaultTooltipDOM.querySelector('li:first-child').replaceWith(dateLabelDOM.querySelector('li'));

  // Append all the matching alert labels
  matchingAlertLabelsDOM.querySelectorAll('li').forEach((label) => {
    defaultTooltipDOM.querySelector('ul').append(label);
  });

  return defaultTooltipDOM.innerHTML;
};

/**
 * Formats and maps the colors to their corresponding datasets in the carbon charts tabular data format
 * @param {Array} series an array of dataset group classifications
 * @returns {Object} colors - formatted
 */
export const formatColors = (series) => {
  const colors = {
    scale: {},
  };
  if (Array.isArray(series)) {
    series.forEach((dataset, index) => {
      colors.scale[dataset.label] = dataset.color || CHART_COLORS[index % CHART_COLORS.length];
    });
  } else {
    colors.scale[series.label] = series.color || CHART_COLORS[0];
  }
  return colors;
};

const TimeSeriesCard = ({
  title: titleProp,
  content,
  children,
  size,
  interval,
  isEditable,
  isResizable,
  values: initialValues,
  locale,
  i18n: { alertDetected, noDataLabel },
  i18n,
  isExpanded,
  timeRange,
  isLazyLoading,
  isLoading,
  domainRange,
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
      decimalPrecision,
      unit,
      chartType,
      zoomBar,
      showTimeInGMT,
      showLegend,
      tooltipDateFormatPattern,
      addSpaceOnEdges,
    },
    values: valuesProp,
  } = handleCardVariables(titleProp, content, initialValues, others);
  let chartRef = useRef();
  const previousTick = useRef();
  moment.locale(locale);

  const sampleValues = useMemo(
    () => generateSampleValues(series, timeDataSourceId, interval, timeRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, interval, timeRange]
  );

  const values = isEditable ? sampleValues : valuesProp;

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

  const maxTicksPerSize = useMemo(() => {
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
  }, [newSize]);

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

  // Set the colors for each dataset
  const colors = formatColors(series);

  /**
   * Determines the dot stroke color (the border of the data point)
   * @param {string} datasetLabel
   * @param {string} label
   * @param {Object} data
   * @param {string} originalStrokeColor from carbon charts
   * @returns {string} stroke color
   */
  const handleStrokeColor = (datasetLabel, label, data, originalStrokeColor) => {
    if (!isNil(data)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange?.length > 0 ? matchingAlertRange[0].color : originalStrokeColor;
    }
    return originalStrokeColor;
  };

  /**
   * Determines the dot fill color based on matching alerts
   * @param {string} datasetLabel
   * @param {string} label
   * @param {Object} data
   * @param {string} originalFillColor from carbon charts
   * @returns {string} fill color
   */
  const handleFillColor = (datasetLabel, label, data, originalFillColor) => {
    // If it's editable don't fill the dot
    const defaultFillColor = !isEditable ? originalFillColor : '#f3f3f3';
    if (!isNil(data)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange?.length > 0 ? matchingAlertRange[0].color : defaultFillColor;
    }

    return defaultFillColor;
  };

  /**
   * Determines if the dot is filled based on matching alerts
   * @param {string} datasetLabel
   * @param {string} label
   * @param {Object} data
   * @param {Boolean} isFilled default setting from carbon charts
   * @returns {Boolean}
   */
  const handleIsFilled = (datasetLabel, label, data, isFilled) => {
    if (!isNil(data)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange?.length > 0 ? true : isFilled;
    }

    return isFilled;
  };

  /** This is needed to update the chart when the lines and values change */
  useDeepCompareEffect(() => {
    if (chartRef && chartRef.chart) {
      const chartData = formatChartData(timeDataSourceId, series, valueSort);
      chartRef.chart.model.setData(chartData);
    }
  }, [valueSort, series, timeDataSourceId]);

  /** This caches the chart value */
  const chartData = useMemo(() => formatChartData(timeDataSourceId, series, valueSort), [
    timeDataSourceId,
    series,
    valueSort,
  ]);

  const isChartDataEmpty = isEmpty(chartData);

  const { tableData, columnNames } = useMemo(() => {
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
  }, [timeDataSourceId, valueSort]);

  // In expanded mode we show the data underneath the linechart in a table so need to build the columns
  const tableColumns = useMemo(() => {
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
      columnNames.map((columnName) => {
        const matchingDataSource = Array.isArray(series)
          ? series.find((d) => d.dataSourceId === columnName)
          : series;
        return {
          id: columnName,
          // use the label if one exists as it will be the user-defined, readable name
          // UNLESS dataFilter is enabled as the matchingDataSource will only find the first match
          name: matchingDataSource
            ? matchingDataSource.dataFilter
              ? matchingDataSource.dataSourceId
              : matchingDataSource.label
            : columnName,
          isSortable: true,
          filter: { placeholderText: i18n.defaultFilterStringPlaceholdText },
          renderDataFunction: ({ value }) => {
            if (typeof value === 'number' && !isNil(decimalPrecision)) {
              return chartValueFormatter(value, size, unit, locale, decimalPrecision);
            }
            return value;
          },
        };
      })
    );
  }, [
    columnNames,
    decimalPrecision,
    i18n.defaultFilterStringPlaceholdText,
    locale,
    series,
    size,
    timeDataSourceId,
    unit,
  ]);

  // TODO: remove in next release
  const ChartComponent = chartType === TIME_SERIES_TYPES.BAR ? StackedBarChart : LineChart;

  const resizeHandles = isResizable ? getResizeHandles(children) : [];

  return (
    <Card
      title={title}
      size={newSize}
      i18n={i18n}
      timeRange={timeRange}
      {...others}
      isExpanded={isExpanded}
      isEditable={isEditable}
      isEmpty={isChartDataEmpty}
      isLazyLoading={isLazyLoading || (valueSort && valueSort.length > 200)}
      isLoading={isLoading}
      resizeHandles={resizeHandles}
    >
      {!isChartDataEmpty ? (
        <>
          <div
            className={classNames(`${iotPrefix}--time-series-card--wrapper`, {
              [`${iotPrefix}--time-series-card--wrapper__expanded`]: isExpanded,
              [`${iotPrefix}--time-series-card--wrapper__lots-of-points`]:
                valueSort && valueSort.length > 50,
              [`${iotPrefix}--time-series-card--wrapper__editable`]: isEditable,
            })}
          >
            <ChartComponent
              ref={(el) => {
                chartRef = el;
              }}
              data={chartData}
              options={{
                animations: false,
                accessibility: false,
                axes: {
                  bottom: {
                    title: xLabel || ' ',
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
                      formatter: (axisValue) =>
                        chartValueFormatter(axisValue, newSize, null, locale, decimalPrecision),
                    },
                    ...(chartType !== TIME_SERIES_TYPES.BAR
                      ? { yMaxAdjuster: (yMaxValue) => yMaxValue * 1.3 }
                      : {}),
                    stacked: chartType === TIME_SERIES_TYPES.BAR && series.length > 1,
                    includeZero: includeZeroOnYaxis,
                    scaleType: 'linear',
                  },
                },
                legend: {
                  position: 'bottom',
                  clickable: !isEditable,
                  enabled: showLegend ?? series.length > 1,
                },
                containerResizable: true,
                tooltip: {
                  valueFormatter: (tooltipValue) =>
                    chartValueFormatter(tooltipValue, newSize, unit, locale, decimalPrecision),
                  customHTML: (...args) =>
                    handleTooltip(
                      ...args,
                      alertRanges,
                      alertDetected,
                      showTimeInGMT,
                      tooltipDateFormatPattern
                    ),
                  groupLabel: i18n.tooltipGroupLabel,
                },
                getStrokeColor: handleStrokeColor,
                getFillColor: handleFillColor,
                getIsFilled: handleIsFilled,
                color: colors,
                ...(zoomBar?.enabled && (ZOOM_BAR_ENABLED_CARD_SIZES.includes(size) || isExpanded)
                  ? {
                      zoomBar: {
                        // [zoomBar.axes]: {    TODO: the top axis is the only axis supported at the moment so default to top
                        top: {
                          enabled: zoomBar.enabled,
                          initialZoomDomain: zoomBar.initialZoomDomain,
                          type: zoomBar.view || 'slider_view', // default to slider view
                        },
                      },
                    }
                  : {}),
                timeScale: {
                  addSpaceOnEdges: !isNil(addSpaceOnEdges) ? addSpaceOnEdges : 1,
                },
              }}
              width="100%"
              height="100%"
            />
          </div>
          {isExpanded ? (
            <StatefulTable
              id="TimeSeries-table"
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
                  onDownloadCSV: (filteredData) => csvDownloadHandler(filteredData, title),
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
    tooltipGroupLabel: 'Group',
  },

  chartType: TIME_SERIES_TYPES.LINE,
  locale: 'en',
  content: {
    includeZeroOnXaxis: false,
    includeZeroOnYaxis: false,
    showLegend: true,
  },
  showTimeInGMT: false,
  domainRange: null,
  tooltipDateFormatPattern: 'L HH:mm:ss',
};

export default TimeSeriesCard;
