import moment from 'moment';
import uuidv1 from 'uuid/v1';

export const generateSampleValues = (series, timeDataSourceId) => {
  const attributeNames = series.map(line => line.dataSourceId);
  const now = moment();
  const sampleValues = Array(10).fill(1);
  return sampleValues.map(() => ({
    [timeDataSourceId]: now.add(1, 'day').valueOf(),
    ...attributeNames.reduce((allAttributes, attribute) => {
      allAttributes[attribute] = Math.random() * 100; // eslint-disable-line
      return allAttributes;
    }, {}),
  }));
};

/**
 * Generate fake data to fill table columns for the preview mode of the table in the dashboard
 * @param {*} columns
 */
export const generateTableSampleValues = columns => {
  const sampleValues = Array(10).fill(1);
  return sampleValues.map(() => ({
    id: uuidv1(),
    values: columns.reduce((obj, column) => {
      obj[column.dataSourceId] = column.type === 'TIMESTAMP' ? 'hh:mm:ss' : '--'; // eslint-disable-line
      return obj;
    }, {}),
  }));
};
