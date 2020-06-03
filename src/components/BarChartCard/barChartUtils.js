import moment from 'moment';
import find from 'lodash/find';

/** Generate fake values for my line chart */
export const generateSampleValues = (
  series,
  timeDataSourceId,
  timeGrain = 'day',
  categoryDataSourceId
) => {
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

  if (timeDataSourceId) {
    return series.reduce((sampleData, { dataSourceId }) => {
      const now = moment().subtract(count, timeGrain);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < count; i++) {
        const nextTimeStamp = now.add(1, timeGrain).valueOf();
        const existingData = find(sampleData, { [timeDataSourceId]: nextTimeStamp });
        if (existingData) {
          // add the additional dataSource to the existing datapoint
          existingData[dataSourceId] = Math.random() * 100;
        } else if (categoryDataSourceId) {
          // 4 random datasets
          // eslint-disable-next-line no-plusplus
          for (let k = 0; k < 4; k++) {
            const value = { [categoryDataSourceId]: `Sample ${k + 1}` };
            series.forEach(datasource => {
              value[timeDataSourceId] = nextTimeStamp;
              value[datasource.dataSourceId] = Math.random() * 100;
            });
            sampleData.push(value);
          }
        } else {
          // otherwise we need explicit row
          sampleData.push({
            [timeDataSourceId]: nextTimeStamp,
            [dataSourceId]: Math.random() * 100,
          });
        }
      }
      return sampleData;
    }, []);
  }
  const sampleData = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 4; i++) {
    const value = { [categoryDataSourceId]: `Sample ${i + 1}` };
    series.forEach(datasource => {
      value[datasource.dataSourceId] = Math.random() * 100;
    });
    sampleData.push(value);
  }
  return sampleData;
};
