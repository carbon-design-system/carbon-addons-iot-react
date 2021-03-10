import { useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import filter from 'lodash/filter';
import capitalize from 'lodash/capitalize';
import moment from 'moment';

import { convertStringsToDOMElement } from '../../utils/componentUtilityFunctions';
import { chartValueFormatter, getUpdatedCardSize } from '../../utils/cardUtilityFunctions';
import { CHART_COLORS } from '../../constants/CardPropTypes';
import { formatGraphTick, findMatchingAlertRange } from '../TimeSeriesCard/timeSeriesUtils';
import {
  CARD_SIZES,
  TIME_SERIES_TYPES,
  ZOOM_BAR_ENABLED_CARD_SIZES,
} from '../../constants/LayoutConstants';

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
const handleTooltip = (
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
const formatColors = (series = []) => {
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

/**
 * Configures the axes object for the comboChart
 */

const configureAxes = (content) => {
  const {
    domainRange,
    xLabel,
    yLabel,
    unit,
    chartType,
    decimalPrecision,
    includeZeroOnXaxis,
    interval,
    locale,
    series,
    showTimeInGMT,
    size,
    includeZeroOnYaxis,
    previousTick,
    thresholds,
  } = content;

  /** *
   * timestamp of current value
   * index of current value
   * ticks: array of current ticks
   */
  const formatTick = (timestamp, index, ticks) => {
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
  };

  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);
  const getMaxTicksPerSize = (s) => {
    switch (s) {
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
  };

  return {
    bottom: {
      title: xLabel || ' ',
      mapsTo: 'date',
      scaleType: 'time',
      ticks: {
        max: getMaxTicksPerSize(newSize),
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
      thresholds,
    },
  };
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

export const useChartData = (values, { series = [], timeDataSourceId }) => {
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

export const useChartOptions = (content) => {
  const {
    comboChartTypes,
    decimalPrecision,
    i18n,
    isEditable,
    isExpanded,
    isLoading,
    locale,
    series,
    showTimeInGMT,
    size,
    timeDataSourceId,
    tooltipDateFormatPattern,
    unit,
    values,
    zoomBar,
  } = content;

  const options = {
    experimental: true,
    animations: false,
    accessibility: true,
    axes: configureAxes(content),
    legend: {
      position: 'bottom',
      enabled: values.length > 1,
      clickable: !isEditable,
    },
    containerResizable: true,
    comboChartTypes,
    series,
    color: formatColors(series),
    timeScale: {
      addSpaceOnEdges: 0,
    },
    tooltip: {
      valueFormatter: (tooltipValue) =>
        chartValueFormatter(tooltipValue, size, unit, locale, decimalPrecision),
      customHTML: (...args) =>
        handleTooltip(...args, timeDataSourceId, showTimeInGMT, tooltipDateFormatPattern),
      groupLabel: i18n.tooltipGroupLabel,
      totalLabel: i18n.tooltipTotalLabel,
    },
    // zoomBar should only be enabled for time-based charts
    ...(zoomBar?.enabled &&
    timeDataSourceId &&
    (ZOOM_BAR_ENABLED_CARD_SIZES.includes(size) || isExpanded)
      ? {
          zoomBar: {
            top: {
              enabled: zoomBar.enabled,
              initialZoomDomain: zoomBar.initialZoomDomain,
              type: zoomBar.view || 'slider_view', // default to slider view
            },
          },
        }
      : {}),
  };

  options.data = merge(options.data, { loading: isLoading });
  return { ...options, ...content };
};

const extractDataAndColumnNames = (values, chartOptions) => {
  const { timeDataSourceId } = chartOptions;
  let maxColumnNames = [];

  const tableValues = values.map((value, index) => {
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
};

export const useTableData = (values, chartOptions) => {
  const { tableData } = useMemo(() => extractDataAndColumnNames(values, chartOptions), [
    values,
    chartOptions,
  ]);
  return tableData;
};

export const useTableColumns = (values, chartOptions) => {
  const {
    timeDataSourceId,
    // categoryDataSourceId,
    decimalPrecision,
    i18n,
    size,
    series,
    unit,
    locale,
  } = chartOptions;
  const { columnNames } = extractDataAndColumnNames(values, chartOptions);

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

  return tableColumns;
};
