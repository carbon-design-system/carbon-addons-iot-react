import moment from 'moment';
import isNil from 'lodash/isNil';
import every from 'lodash/every';
import omit from 'lodash/omit';

/** Generate fake values for my line chart */
export const generateSampleValues = (series, timeDataSourceId, timeGrain = 'day') => {
  const attributeNames = series.map(line => line.dataSourceId);

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
      count = 12;
      break;
    case 'year':
      count = 5;
      break;
    default:
      count = 7;
      break;
  }
  const now = moment().subtract(count, timeGrain);
  const sampleValues = Array(count).fill(1);
  return sampleValues.map(() => ({
    [timeDataSourceId]: now.add(1, timeGrain).valueOf(),
    ...attributeNames.reduce((allAttributes, attribute) => {
      allAttributes[attribute] = Math.random() * 100; // eslint-disable-line
      return allAttributes;
    }, {}),
  }));
};

/**
 * Is every value empty except timestamp in the data
 * @param {} values
 * @param {*} timeDataSourceId
 */
export const isValuesEmpty = (values, timeDataSourceId) =>
  every(values, dataPoint =>
    every(Object.values(omit(dataPoint, [timeDataSourceId])), value => isNil(value))
  );

/**
 * Generate fake data to fill table columns for the preview mode of the table in the dashboard
 * @param {*} columns
 */
export const generateTableSampleValues = (id, columns) => {
  const sampleValues = Array(10).fill(1);
  return sampleValues.map((item, index) => ({
    id: `sample-values-${id}-${index}`,
    values: columns.reduce((obj, column) => {
      obj[column.dataSourceId] = column.type === 'TIMESTAMP' ? 'hh:mm:ss' : '--'; // eslint-disable-line
      return obj;
    }, {}),
  }));
};
/** *
 * timestamp of current value
 * index of current value
 * ticks: array of current ticks
 */
export const formatGraphTick = (
  timestamp,
  index,
  ticks,
  interval,
  locale = 'en',
  previousTickTimestamp
) => {
  moment.locale(locale);
  const currentTimestamp = moment.unix(timestamp / 1000);

  const sameDay = moment(previousTickTimestamp).isSame(currentTimestamp, 'day');
  const sameYear = moment(previousTickTimestamp).isSame(currentTimestamp, 'year');

  // This works around a bug in moment where some Chinese languages are missing the day indicator
  // https://github.com/moment/moment/issues/5350
  const dailyFormat = !locale.includes('zh') ? 'MMM DD' : 'MMMDD日';
  const fullFormat = !locale.includes('zh') ? 'MMM DD YYYY' : 'MMMDD日 YYYY';

  return interval === 'hour' && index === 0
    ? ticks.length > 1
      ? currentTimestamp.format(dailyFormat)
      : currentTimestamp.format(`${dailyFormat} HH:mm`)
    : interval === 'hour' && index !== 0 && !sameDay
    ? currentTimestamp.format(dailyFormat)
    : interval === 'hour'
    ? currentTimestamp.format('HH:mm')
    : interval === 'day' && index === 0
    ? currentTimestamp.format(dailyFormat)
    : interval === 'day' && index !== 0
    ? currentTimestamp.format(dailyFormat)
    : interval === 'month' && !sameYear
    ? currentTimestamp.format('MMM YYYY')
    : interval === 'month' && sameYear && index === 0
    ? currentTimestamp.format('MMM YYYY')
    : interval === 'month' && sameYear
    ? currentTimestamp.format('MMM')
    : interval === 'year' && sameYear && index !== 0
    ? currentTimestamp.format('MMM') // if we're on the year boundary and the same year, then don't repeat
    : interval === 'year' && (!sameYear || index === 0)
    ? currentTimestamp.format('YYYY')
    : interval === 'minute'
    ? currentTimestamp.format('HH:mm')
    : currentTimestamp.format(fullFormat);
};

/**
 * compare the current datapoint to alert ranges keyed by timestamp
 * @param {*} alertRanges, object of alert data keyed by timestamp
 * @param {*} data, particular data item to check
 */
export const findMatchingAlertRange = (alertRanges, data) => {
  const currentDatapointTimestamp = data && data.date && data.date.valueOf();
  return alertRanges[currentDatapointTimestamp];
};
