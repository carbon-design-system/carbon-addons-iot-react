import { useMemo } from 'react';
import { isEmpty, isNil, merge, omit, filter, capitalize } from 'lodash-es';

import {
  chartValueFormatter,
  getUpdatedCardSize,
  handleTooltip,
} from '../../utils/cardUtilityFunctions';
import { CHART_COLORS } from '../../constants/CardPropTypes';
import { formatGraphTick } from '../TimeSeriesCard/timeSeriesUtils';
import { CARD_SIZES, TIME_SERIES_TYPES } from '../../constants/LayoutConstants';
import dayjs from '../../utils/dayjs';

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
   * ticks: array of current ticks or a single string with part of the date, e.g. month or year & month
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

export const useChartData = (values, { series = [], timeDataSourceId, showTimeInGMT }) => {
  // Carbon charts is incredibly slow with large datasets sometimes, so let's shave off a little time where we can
  return useMemo(() => {
    // Generate a set of unique timestamps for the values
    const timestamps = [...new Set(values.map((val) => val[timeDataSourceId]))];
    const data = [];

    const seriesArray = Array.isArray(series) ? series : [series];

    // Series is the different groups of datasets
    seriesArray.forEach(({ dataSourceId, dataFilter = {}, label }) => {
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
                      : showTimeInGMT
                      ? dayjs.utc(dataItem[timeDataSourceId])
                      : dayjs(dataItem[timeDataSourceId]),
                  value: dataItem[dataSourceId],
                  group: label,
                });
              }
            });
        }
      });
    });

    return data;
  }, [values, series, timeDataSourceId, showTimeInGMT]);
};

export const useChartOptions = (content) => {
  return useMemo(() => {
    const {
      comboChartTypes,
      decimalPrecision,
      i18n,
      isEditable,
      isLoading,
      locale,
      series,
      showTimeInGMT,
      size,
      timeDataSourceId,
      tooltipDateFormatPattern,
      defaultDateFormatPattern,
      unit,
      values,
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
          handleTooltip(...args, timeDataSourceId, showTimeInGMT, tooltipDateFormatPattern, locale),
        groupLabel: i18n.tooltipGroupLabel,
        totalLabel: i18n.tooltipTotalLabel,
      },
      toolbar: {
        enabled: false,
      },
      defaultDateFormatPattern,
    };

    options.data = merge(options.data, { loading: isLoading });
    return { ...options, ...content };
  }, [content]);
};

const extractDataAndColumnNames = (values, chartOptions) => {
  const { timeDataSourceId, showTimeInGMT, defaultDateFormatPattern } = chartOptions;
  let maxColumnNames = [];

  const tableValues = values.map((value, index) => {
    const currentValueColumns = Object.keys(omit(value, timeDataSourceId));
    maxColumnNames =
      currentValueColumns.length > maxColumnNames.length ? currentValueColumns : maxColumnNames;
    return {
      id: `dataindex-${index}`,
      values: {
        ...omit(value, timeDataSourceId), // skip the timestamp so we can format it locally
        [timeDataSourceId]: (showTimeInGMT
          ? dayjs.utc(value[timeDataSourceId])
          : dayjs(value[timeDataSourceId])
        ).format(defaultDateFormatPattern),
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
  const { timeDataSourceId, decimalPrecision, i18n, size, series, unit, locale } = chartOptions;
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
