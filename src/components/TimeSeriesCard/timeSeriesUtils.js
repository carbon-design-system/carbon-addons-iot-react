import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';

/** Generate fake values for my line chart */
export const generateSampleValues = (series, timeDataSourceId, timeGrain = 'day') => {
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

  // number of each record to define
  const sampleValues = Array(count).fill(1);
  return series.reduce((sampleData, { dataSourceId, dataFilter }) => {
    const now = moment().subtract(count, timeGrain);
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
        const existingData = find(sampleData, { [timeDataSourceId]: nextTimeStamp });
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
  const sampleValues = Array(10).fill(1);
  return sampleValues.map((item, index) => ({
    id: `sample-values-${id}-${index}`,
    values: columns.reduce((obj, column) => {
      obj[column.dataSourceId] = column.type === 'TIMESTAMP' ? 'hh:mm:ss' : '--'; // eslint-disable-line no-param-reassign
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
  const sameMonth = moment(previousTickTimestamp).isSame(currentTimestamp, 'month');
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
    : (interval === 'day' || interval === 'week') && sameDay
    ? '' // if we're on the day and week and the same day then skip
    : (interval === 'day' || interval === 'week') && index === 0
    ? currentTimestamp.format(dailyFormat)
    : (interval === 'day' || interval === 'week') && index !== 0
    ? currentTimestamp.format(dailyFormat)
    : interval === 'month' && sameMonth // don't repeat same month
    ? ''
    : interval === 'month' && !sameYear
    ? currentTimestamp.format('MMM YYYY')
    : interval === 'month' && sameYear && index === 0
    ? currentTimestamp.format('MMM YYYY')
    : interval === 'month' && sameYear
    ? currentTimestamp.format('MMM')
    : interval === 'year' && sameYear
    ? '' // if we're on the year boundary and the same year, then don't repeat
    : interval === 'year' && (!sameYear || index === 0)
    ? currentTimestamp.format('YYYY')
    : interval === 'minute'
    ? currentTimestamp.format('HH:mm')
    : currentTimestamp.format(fullFormat);
};

/** compare the current datapoint to a list of alert ranges */
export const findMatchingAlertRange = (alertRanges, data) => {
  const currentDatapointTimestamp = data && data.date && data.date.valueOf();
  return (
    Array.isArray(alertRanges) &&
    alertRanges.filter(
      alert =>
        currentDatapointTimestamp <= alert.endTimestamp &&
        currentDatapointTimestamp >= alert.startTimestamp
    )
  );
};
