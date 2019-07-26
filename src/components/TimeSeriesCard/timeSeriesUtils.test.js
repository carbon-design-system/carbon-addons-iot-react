import every from 'lodash/every';

import { generateSampleValues, generateTableSampleValues } from './timeSeriesUtils';

describe('timeSeriesUtils', () => {
  test('generateSampleValues', () => {
    const sampleValues = generateSampleValues(
      [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
      'timestamp'
    );
    expect(sampleValues).toHaveLength(10);
    expect(sampleValues[0].temperature).toBeDefined();
    expect(sampleValues[0].pressure).toBeDefined();
  });
  test('generateTableSampleValues', () => {
    const tableSampleValues = generateTableSampleValues([
      { dataSourceId: 'column1' },
      { dataSourceId: 'column2' },
      { dataSourceId: 'column3', type: 'TIMESTAMP' },
    ]);
    expect(tableSampleValues).toHaveLength(10);
    expect(every(tableSampleValues, 'id')).toEqual(true); // every row should have its own id
    expect(every(tableSampleValues, 'values')).toEqual(true); // every row should have its own values
    expect(tableSampleValues[0].values).toHaveProperty('column1');
    expect(tableSampleValues[0].values).toHaveProperty('column2');
    expect(tableSampleValues[0].values).toHaveProperty('column3');
  });
});
