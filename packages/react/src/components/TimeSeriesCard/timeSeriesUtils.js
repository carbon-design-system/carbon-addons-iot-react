import moment from 'moment';
import 'moment/min/locales';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import find from 'lodash/find';

import { convertStringsToDOMElement } from '../../utils/componentUtilityFunctions';
import { CHART_COLORS } from '../../constants/CardPropTypes';

/** Generate fake values for my line chart */
export const generateSampleValues = (series, timeDataSourceId, timeGrain = 'day', timeRange) => {
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

  // number of each record to define
  const sampleValues = Array(count).fill(1);
  return series.reduce((sampleData, { dataSourceId, dataFilter }) => {
    const now =
      timeRangeType === 'periodToDate' // handle "this" intervals like "this week"
        ? moment().startOf(timeRangeInterval).subtract(1, timeGrain)
        : moment().subtract(count, timeGrain);
    sampleValues.forEach(() => {
      const nextTimeStamp = now.add(1, timeGrain).valueOf();
      if (!isEmpty(dataFilter)) {
        // if we have a data filter, then we need a specific row for every filter
        sampleData.push({
          [timeDataSourceId]: nextTimeStamp,
          [dataSourceId]: Math.random() * 100,
          ...dataFilter,
        });
      } else {
        const existingData = find(sampleData, {
          [timeDataSourceId]: nextTimeStamp,
        });
        if (existingData) {
          // add the additional dataSource to the existing datapoint
          existingData[dataSourceId] = Math.random() * 100;
        } else {
          // otherwise we need explicit row
          sampleData.push({
            [timeDataSourceId]: nextTimeStamp,
            [dataSourceId]: Math.random() * 100,
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
 * ticks: array of current ticks
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
  moment.locale(locale);
  const currentTimestamp = shouldDisplayGMT ? moment.utc(timestamp) : moment(timestamp);

  const sameDay = moment(previousTickTimestamp).isSame(currentTimestamp, 'day');
  const sameMonth = moment(previousTickTimestamp).isSame(currentTimestamp, 'month');
  const sameYear = moment(previousTickTimestamp).isSame(currentTimestamp, 'year');

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
  if (interval === 'month' && sameMonth) {
    return ''; // don't repeat same month
  }
  if (interval === 'month' && !sameYear) {
    return currentTimestamp.format('MMM YYYY');
  }
  if (interval === 'month' && sameYear && index === 0) {
    return currentTimestamp.format('MMM YYYY');
  }
  if (interval === 'month' && sameYear) {
    return currentTimestamp.format('MMM');
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

/** compare the current datapoint to a list of alert ranges */
export const findMatchingAlertRange = (alertRanges, data) => {
  const currentDataPoint = Array.isArray(data) ? data[0]?.date : data.date;
  const currentDatapointTimestamp = currentDataPoint.valueOf();
  return (
    Array.isArray(alertRanges) &&
    alertRanges.filter(
      (alert) =>
        currentDatapointTimestamp <= alert.endTimestamp &&
        currentDatapointTimestamp >= alert.startTimestamp
    )
  );
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
