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
