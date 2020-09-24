import every from 'lodash/every';

import {
  generateSampleValues,
  generateTableSampleValues,
  formatGraphTick,
  findMatchingAlertRange,
} from './timeSeriesUtils';

describe('timeSeriesUtils', () => {
  it('generateSampleValues', () => {
    const sampleValues = generateSampleValues(
      [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
      'timestamp'
    );
    expect(sampleValues).toHaveLength(7);
    expect(sampleValues[0].temperature).toBeDefined();
    expect(sampleValues[0].pressure).toBeDefined();
  });
  it('generateSampleValues with data Filters', () => {
    const sampleValues = generateSampleValues(
      [
        { dataSourceId: 'temperature', dataFilter: { severity: 5 } },
        { dataSourceId: 'temperature', dataFilter: { severity: 3 } },
      ],
      'timestamp'
    );
    expect(sampleValues).toHaveLength(14);
    expect(sampleValues[0].temperature).toBeDefined();
    expect(sampleValues[0].severity).toEqual(5);
    expect(sampleValues[7].temperature).toBeDefined();
    expect(sampleValues[7].severity).toEqual(3);
  });
  it('generateSampleValues hour', () => {
    const sampleValues = generateSampleValues(
      [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
      'timestamp',
      'hour'
    );

    expect(sampleValues).toHaveLength(24);
    expect(sampleValues[0].temperature).toBeDefined();
    expect(sampleValues[0].pressure).toBeDefined();

    const sampleValues2 = generateSampleValues(
      [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
      'timestamp',
      'week'
    );
    expect(sampleValues2).toHaveLength(4);

    const sampleValues3 = generateSampleValues(
      [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
      'timestamp',
      'month'
    );
    expect(sampleValues3).toHaveLength(12);

    const sampleValues4 = generateSampleValues(
      [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
      'timestamp',
      'year'
    );
    expect(sampleValues4).toHaveLength(5);

    const sampleValues5 = generateSampleValues(
      [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
      'timestamp',
      'day'
    );
    expect(sampleValues5).toHaveLength(7);
  });
  it('generateTableSampleValues', () => {
    const tableSampleValues = generateTableSampleValues('test', [
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
  it('formatGraphTick', () => {
    // hour different day
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'hour', 'en', 1572912000000)
    ).toContain('Nov 05');
    // hour same day
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'hour', 'en', 1572933600000)
    ).toContain('00:00');
    // day same day should skip
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'day', 'en', 1572933600000)
    ).toEqual('');
    // month different year
    expect(
      formatGraphTick(1546322400000, 1, [1, 2, 3, 4, 5, 6], 'month', 'en', 1522558800000)
    ).toContain('Jan 2019');
    // month same year
    expect(
      formatGraphTick(1561957200000, 1, [1, 2, 3, 4, 5, 6], 'month', 'en', 1572584400000)
    ).toContain('Jul');
    // week shouldn't show year
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'week', 'en', 1572912000000)
    ).toContain('Nov 05');
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'week', 'en', 1572912000000)
    ).not.toContain('Nov 05 2019');
    // same year should not repeat
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'year', 'en', 1572933600000)
    ).toEqual('');
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'year', 'en', 872912000000)
    ).toContain('2019');

    // same month should not repeat
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'month', 'en', 1572933600000)
    ).toEqual('');
  });
  it('findMatchingAlertRange', () => {
    const data = {
      date: new Date(1573073951),
    };
    const alertRange = [
      {
        startTimestamp: 1573073950,
        endTimestamp: 1573073951,
        color: '#FF0000',
        details: 'Alert details',
      },
    ];
    const matchingAlertRange = findMatchingAlertRange(alertRange, data);
    expect(matchingAlertRange).toHaveLength(1);
    expect(matchingAlertRange[0].color).toEqual('#FF0000');
    expect(matchingAlertRange[0].details).toEqual('Alert details');
  });
});
