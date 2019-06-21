import moment from 'moment';

export const generateSampleValues = (series, timeDataSourceId) => {
  const attributeNames = series.map(line => line.dataSourceId);
  const now = moment();
  const sampleValues = Array(10).fill(1);
  return sampleValues.map(() => ({
    [timeDataSourceId]: now.subtract(5, 'minutes').valueOf(),
    ...attributeNames.reduce((allAttributes, attribute) => {
      allAttributes[attribute] = Math.random() * 100; // eslint-disable-line
      return allAttributes;
    }, {}),
  }));
};
