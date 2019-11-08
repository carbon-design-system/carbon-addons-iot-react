import every from 'lodash/every';

import {
  generateSampleValues,
  generateTableSampleValues,
  isValuesEmpty,
  formatGraphTick,
  findMatchingAlertRange,
} from './timeSeriesUtils';

describe('timeSeriesUtils', () => {
  test('isValuesEmpty', () => {
    const sampleValues = [
      { timestamp: 1571162400000, sound_db: null },
      { timestamp: 1571166000000, sound_db: null },
      { timestamp: 1571169600000, sound_db: null },
      { timestamp: 1571173200000, sound_db: null },
      { timestamp: 1571176800000, sound_db: null },
      { timestamp: 1571180400000, sound_db: null },
      { timestamp: 1571184000000, sound_db: null },
      { timestamp: 1571187600000, sound_db: null },
      { timestamp: 1571191200000, sound_db: null },
      { timestamp: 1571194800000, sound_db: null },
      { timestamp: 1571198400000, sound_db: null },
      { timestamp: 1571202000000, sound_db: null },
      { timestamp: 1571205600000, sound_db: null },
      { timestamp: 1571209200000, sound_db: null },
      { timestamp: 1571212800000, sound_db: null },
      { timestamp: 1571216400000, sound_db: null },
      { timestamp: 1571220000000, sound_db: null },
      { timestamp: 1571223600000, sound_db: null },
      { timestamp: 1571227200000, sound_db: null },
      { timestamp: 1571230800000, sound_db: null },
      { timestamp: 1571234400000, sound_db: null },
      { timestamp: 1571238000000, sound_db: null },
      { timestamp: 1571241600000, sound_db: null },
      { timestamp: 1571245200000, sound_db: null },
      { timestamp: 1571248800000, sound_db: null },
    ];
    expect(isValuesEmpty(sampleValues, 'timestamp')).toEqual(true);
    expect(
      isValuesEmpty([...sampleValues, { timestamp: 1571162400000, sound_db: 10 }], 'timestamp')
    ).toEqual(false);
  });
  test('generateSampleValues', () => {
    const sampleValues = generateSampleValues(
      [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
      'timestamp'
    );
    expect(sampleValues).toHaveLength(7);
    expect(sampleValues[0].temperature).toBeDefined();
    expect(sampleValues[0].pressure).toBeDefined();
  });
  test('generateSampleValues hour', () => {
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
      'other'
    );
    expect(sampleValues5).toHaveLength(7);
  });
  test('generateTableSampleValues', () => {
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
  test('formatGraphTick', () => {
    // hour different day
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'hour', null, 1572912000000)
    ).toContain('05 Nov');
    // hour same day
    expect(
      formatGraphTick(1572933600000, 1, [1, 2, 3, 4, 5, 6], 'hour', null, 1572933600000)
    ).toContain('00:00');
    // month different year
    expect(
      formatGraphTick(1546322400000, 1, [1, 2, 3, 4, 5, 6], 'month', null, 1522558800000)
    ).toContain('Jan 2019');
    // month same year
    expect(
      formatGraphTick(1561957200000, 1, [1, 2, 3, 4, 5, 6], 'month', null, 1572584400000)
    ).toContain('Jul');
  });
  test('findMatchingAlertRange', () => {
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
    expect(matchingAlertRange.color).toEqual('#FF0000');
    expect(matchingAlertRange.details).toEqual('Alert details');
  });
});
