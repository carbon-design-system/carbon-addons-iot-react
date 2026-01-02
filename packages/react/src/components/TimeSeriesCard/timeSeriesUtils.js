import { isNil, isEmpty, filter, find, orderBy } from 'lodash-es';

import { CHART_COLORS } from '../../constants/CardPropTypes';
import { findMatchingAlertRange } from '../../utils/cardUtilityFunctions';
import dayjs from '../../utils/dayjs';

/**
 * Generate fake values for my line chart
 * thresholds:  axis: PropTypes.oneOf(['x', 'y']),
        value: PropTypes.number,
        label: PropTypes.string,
        fillColor: PropTypes.string,
 * */
export const generateSampleValues = (
  series,
  timeDataSourceId,
  timeGrain = 'day',
  timeRange,
  thresholds = []
) => {
  // determine interval type
  const timeRangeType = timeRange?.includes('this') ? 'periodToDate' : 'rolling';
  // for month timeGrains, we need to determine whether to show 3 for a quarter or 12 for a year
  const timeRangeInterval = timeRange?.includes('Quarter') ? 'quarter' : timeRange;
  let count = 7;
  switch (timeGrain) {
    case 'hour':
      count = 24;
      break;
    case 'day':
      count = 7;
      break;
    case 'week':
      count = 4;
      break;
    case 'month':
      count = timeRangeInterval === 'quarter' ? 3 : 12;
      break;
    case 'quarter':
      count = 4;
      break;
    case 'year':
      count = 5;
      break;
    default:
      count = 7;
      break;
  }

  // This is a bit of a workaround for carbon-design-system/carbon-charts#1034 as they don't adjust the graph axes to include thresholds
  const highestThresholdValue =
    orderBy(
      thresholds.filter((threshold) => threshold.axis === 'y'),
      'value',
      'desc'
    )?.[0]?.value || 0;

  const lowestThresholdValue =
    orderBy(
      thresholds.filter((threshold) => threshold.axis === 'y'),
      'value',
      'acc'
    )?.[0]?.value || 0;

  const generateDatapoint = (index) =>
    isEmpty(thresholds)
      ? Math.random() * 100
      : index % 2 === 0
      ? highestThresholdValue + Math.random() * 10
      : lowestThresholdValue - Math.random() * 10;
  // number of each record to define
  const sampleValues = Array(count).fill(1);
  // ensure the series is actually an array since it can also be an object
  const seriesArray = Array.isArray(series) ? series : [series];
  return seriesArray.reduce((sampleData, { dataSourceId, dataFilter }) => {
    const now =
      timeRangeType === 'periodToDate' // handle "this" intervals like "this week"
        ? dayjs().startOf(timeRangeInterval).subtract(1, timeGrain)
        : dayjs().subtract(count, timeGrain);

    let nextTimeStamp = now;
    sampleValues.forEach((value, index) => {
      nextTimeStamp = nextTimeStamp.add(1, timeGrain);
      if (!isEmpty(dataFilter)) {
        // if we have a data filter, then we need a specific row for every filter
        sampleData.push({
          [timeDataSourceId]: nextTimeStamp.valueOf(),
          [dataSourceId]: generateDatapoint(index),
          ...dataFilter,
        });
      } else {
        const existingData = find(sampleData, {
          [timeDataSourceId]: nextTimeStamp.valueOf(),
        });
        if (existingData) {
          // add the additional dataSource to the existing datapoint
          existingData[dataSourceId] = generateDatapoint(index);
        } else {
          // otherwise we need explicit row
          sampleData.push({
            [timeDataSourceId]: nextTimeStamp.valueOf(),
            [dataSourceId]: generateDatapoint(index),
          });
        }
      }
    });
    return sampleData;
  }, []);
};

/**
 * Generate fake data to fill table columns for the preview mode of the table in the dashboard
 * @param {*} columns
 */
export const generateTableSampleValues = (id, columns) => {
  const sampleValues = Array(100).fill(1);
  return sampleValues.map((item, index) => ({
    id: `sample-values-${id}-${index}`,
    values: columns.reduce((obj, column) => {
      obj[column.dataSourceId] = column.type === 'TIMESTAMP' ? 'xx/xx/xxxx xx:xx' : '--'; // eslint-disable-line no-param-reassign
      return obj;
    }, {}),
  }));
};
/** *
 * timestamp of current value
 * index of current value
 * ticks: array of current ticks or a single string with part of the date
 * interval: the type of interval formatting to use
 * locale: the current locale,
 * previousTickTimestamp
 * shouldDisplayGMT: boolean should we localize the time to the browser timezone
 */
export const formatGraphTick = (
  timestamp,
  index,
  ticks,
  interval,
  locale = 'en',
  previousTickTimestamp,
  shouldDisplayGMT
) => {
  dayjs.locale(locale);
  const currentTimestamp = shouldDisplayGMT ? dayjs.utc(timestamp) : dayjs(timestamp);

  const sameDay = dayjs(previousTickTimestamp).isSame(currentTimestamp, 'day');
  const sameMonth = dayjs(previousTickTimestamp).isSame(currentTimestamp, 'month');
  const sameYear = dayjs(previousTickTimestamp).isSame(currentTimestamp, 'year');

  // This works around a bug in moment where some Chinese languages are missing the day indicator
  // https://github.com/moment/moment/issues/5350
  const dailyFormat = !locale.includes('zh') ? 'MMM DD' : 'MMMDD日';
  const fullFormat = !locale.includes('zh') ? 'MMM DD YYYY' : 'MMMDD日 YYYY';

  if (interval === 'hour' && index === 0) {
    return ticks.length > 1
      ? currentTimestamp.format(dailyFormat)
      : currentTimestamp.format(`${dailyFormat} HH:mm`);
  }
  if (interval === 'hour' && index !== 0 && !sameDay) {
    return currentTimestamp.format(dailyFormat);
  }
  if (interval === 'hour') {
    return currentTimestamp.format('HH:mm');
  }
  if ((interval === 'day' || interval === 'week') && sameDay) {
    return ''; // if we're on the day and week and the same day then skip
  }
  if ((interval === 'day' || interval === 'week') && index === 0) {
    return currentTimestamp.format(dailyFormat);
  }
  if ((interval === 'day' || interval === 'week') && index !== 0) {
    return currentTimestamp.format(dailyFormat);
  }

  if (interval === 'month' && index === 0) {
    return currentTimestamp.format('MMM YYYY');
  }

  if (interval === 'month' && sameMonth) {
    return ''; // don't repeat same month
  }
  if (interval === 'month' && !sameYear) {
    return currentTimestamp.format('MMM YYYY');
  }
  if (interval === 'month' && sameYear) {
    return currentTimestamp.format('MMM');
  }
  if (interval === 'year' && index === 0) {
    return currentTimestamp.format('YYYY');
  }
  if (interval === 'year' && sameYear) {
    return ''; // if we're on the year boundary and the same year, then don't repeat
  }
  if (interval === 'year' && (!sameYear || index === 0)) {
    return currentTimestamp.format('YYYY');
  }
  return interval === 'minute'
    ? currentTimestamp.format('HH:mm')
    : currentTimestamp.format(fullFormat);
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
  // ensure is actually is an array since proptypes allow for an object, too.
  const seriesArray = Array.isArray(series) ? series : [series];
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
            if (!isNil(dataItem[dataSourceId])) {
              data.push({
                date:
                  dataItem[timeDataSourceId] instanceof Date
                    ? dataItem[timeDataSourceId]
                    : new Date(dataItem[timeDataSourceId]),
                value: dataItem[dataSourceId],
                group: label,
                dataSourceId,
              });
            }
          });
      }
    });
  });

  return data;
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

/**
 * Determines the dot stroke color (the border of the data point)
 * @param {string} datasetLabel --> map to group property
 * @param {string} label --> map to key property
 * @param {Object} data --> map to value property
 * @param {string} originalStrokeColor --> map to defaultStrokeColor. Default setting from carbon charts
 * @returns {string} stroke color
 */
export const applyStrokeColor =
  (alertRanges) => (datasetLabel, label, data, originalStrokeColor) => {
    if (!isNil(data)) {
      const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
      return matchingAlertRange?.length > 0 ? matchingAlertRange[0].color : originalStrokeColor;
    }
    return originalStrokeColor;
  };

/**
 * Determines the dot fill color based on matching alerts
 * @param {string} datasetLabel --> map to group property
 * @param {string} label --> map to key property
 * @param {Object} data --> map to value property
 * @param {string} originalFillColor --> map to defaultFillColor property. Default setting from carbon charts
 * @returns {string} fill color
 */
export const applyFillColor = (alertRanges) => (datasetLabel, label, data, originalFillColor) => {
  if (!isNil(data)) {
    const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
    return matchingAlertRange?.length > 0 ? matchingAlertRange[0].color : originalFillColor;
  }
  return originalFillColor;
};

/**
 * Determines if the dot is filled based on matching alerts
 * @param {string} datasetLabel --> map to group property
 * @param {string} label --> map to key property
 * @param {Object} data --> map to value property
 * @param {Boolean} isFilled  --> map to defaultFilled property. Default setting from carbon charts
 * @returns {Boolean}
 */
export const applyIsFilled = (alertRanges) => (datasetLabel, label, data, isFilled) => {
  if (!isNil(data)) {
    const matchingAlertRange = findMatchingAlertRange(alertRanges, data);
    return matchingAlertRange?.length > 0 ? true : isFilled;
  }

  return isFilled;
};
