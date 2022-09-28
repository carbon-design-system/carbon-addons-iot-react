import { every, omit } from 'lodash-es';

import { COLORS } from '../../constants/LayoutConstants';
import { CHART_COLORS } from '../../constants/CardPropTypes';
import { barChartData } from '../../utils/barChartDataSample';
import dayjs from '../../utils/dayjs';

import {
  generateSampleValues,
  generateTableSampleValues,
  formatGraphTick,
  formatChartData,
  formatColors,
  applyFillColor,
  applyIsFilled,
  applyStrokeColor,
} from './timeSeriesUtils';

describe('timeSeriesUtils', () => {
  describe('generateSampleValues', () => {
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
    it('generateSampleValues with thresholds', () => {
      const sampleValues = generateSampleValues(
        [{ dataSourceId: 'temperature' }, { dataSourceId: 'temperature' }],
        'timestamp',
        'day',
        undefined,
        [
          {
            axis: 'y',
            value: 100,
            fillColor: 'red',
            label: 'Alert 1',
          },
          {
            axis: 'y',
            value: 5,
            fillColor: 'red',
            label: 'Alert 1',
          },
        ]
      );
      expect(sampleValues.some((value) => value.temperature > 100)).toEqual(true);
      expect(sampleValues.some((value) => value.temperature < 5)).toEqual(true);
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

      const sampleValues6 = generateSampleValues(
        [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
        'timestamp',
        'quarter'
      );
      expect(sampleValues6).toHaveLength(4);

      const sampleValues7 = generateSampleValues(
        [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
        'timestamp',
        'month',
        'this Quarter'
      );
      expect(sampleValues7).toHaveLength(3);

      const sampleValues8 = generateSampleValues(
        [{ dataSourceId: 'temperature' }, { dataSourceId: 'pressure' }],
        'timestamp',
        'unknown'
      );
      expect(sampleValues8).toHaveLength(7);

      const sampleValues9 = generateSampleValues(
        { dataSourceId: 'temperature' },
        'timestamp',
        'week'
      );
      expect(sampleValues9).toHaveLength(4);
    });
  });

  it('generateTableSampleValues', () => {
    const tableSampleValues = generateTableSampleValues('test', [
      { dataSourceId: 'column1' },
      { dataSourceId: 'column2' },
      { dataSourceId: 'column3', type: 'TIMESTAMP' },
    ]);
    expect(tableSampleValues).toHaveLength(100);
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

    // day index 0
    expect(
      formatGraphTick(1572933600000, 0, [1, 2, 3, 4, 5, 6], 'day', 'en', 1572847200000)
    ).toEqual('Nov 05');

    // month index 0
    expect(
      formatGraphTick(1572933600000, 0, [1, 2, 3, 4, 5, 6], 'month', 'en', 1572847200000)
    ).toEqual('Nov 2019');

    // year index 0
    expect(
      formatGraphTick(1572933600000, 0, [1, 2, 3, 4, 5, 6], 'year', 'en', 1572847200000)
    ).toEqual('2019');

    // not same year, index 0
    expect(
      formatGraphTick(1572933600000, 0, [1, 2, 3, 4, 5, 6], 'year', 'en', 1541397600000)
    ).toEqual('2019');

    // minute
    expect(
      formatGraphTick(1572933600000, 0, [1, 2, 3, 4, 5, 6], 'minute', 'en', 1541397600000)
    ).toEqual('00:00');

    // unknown
    expect(
      formatGraphTick(1572933600000, 0, [1, 2, 3, 4, 5, 6], 'quarter', undefined, 1541397600000)
    ).toEqual('Nov 05 2019');

    // no locale passed
    expect(
      formatGraphTick(1572933600000, 0, [1, 2, 3, 4, 5, 6], 'hour', undefined, 1541397600000)
    ).toEqual('Nov 05');

    // hour, index 0, with only one tick
    expect(formatGraphTick(1572933600000, 0, [1], 'hour', undefined, 1541397600000)).toEqual(
      'Nov 05 00:00'
    );

    // hour, index 0, with only one tick, changed locale
    expect(formatGraphTick(1572933600000, 0, [1], 'hour', 'zh', 1541397600000)).toEqual(
      '11月05日 00:00'
    );
    // reset locale after change for rest of tests.
    dayjs.locale('en');

    // unknown, index 0, changed locale
    expect(
      formatGraphTick(1572933600000, 0, [1, 2, 3, 4, 5, 6], 'quarter', 'zh', 1541397600000)
    ).toEqual('11月05日 2019');
    // reset locale after change for rest of tests.
    dayjs.locale('en');

    expect(formatGraphTick(1572933600000, 0, [1], 'hour', undefined, 1541397600000, true)).toEqual(
      'Nov 05 06:00'
    );
  });

  describe('formatChartData', () => {
    it("handles series that aren't an array", () => {
      const series = {
        label: 'Amsterdam',
        dataSourceId: 'particles',
      };

      expect(
        formatChartData(
          'timestamp',
          series,
          barChartData.timestamps.filter((data) => data.city === 'Amsterdam')
        )
      ).toEqual([
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-09T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 447,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-10T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 450,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-11T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 512,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-12T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 565,
        },
      ]);
    });
    it('returns properly formatted data without dataFilter set', () => {
      const series = [
        {
          label: 'Amsterdam',
          dataSourceId: 'particles',
        },
      ];

      expect(
        formatChartData(
          'timestamp',
          series,
          barChartData.timestamps.filter((data) => data.city === 'Amsterdam')
        )
      ).toEqual([
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-09T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 447,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-10T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 450,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-11T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 512,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-12T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 565,
        },
      ]);
    });
    it('respects dates', () => {
      const series = [
        {
          label: 'Amsterdam',
          dataSourceId: 'particles',
        },
      ];

      expect(
        formatChartData(
          undefined,
          series,
          barChartData.timestamps
            .filter((data) => data.city === 'Amsterdam')
            .map((data) => ({ ...data, timestamp: new Date(data.timestamp) }))
        )
      ).toEqual([
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-09T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 447,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-10T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 450,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-11T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 512,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-12T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 565,
        },
      ]);
    });
    it('returns properly formatted data with dataFilter set', () => {
      const series = [
        {
          label: 'Amsterdam',
          dataSourceId: 'particles',
          dataFilter: {
            city: 'Amsterdam',
          },
          color: COLORS.MAGENTA,
        },
        {
          label: 'New York',
          dataSourceId: 'particles',
          dataFilter: {
            city: 'New York',
          },
          // no color set here
        },
      ];

      expect(formatChartData('timestamp', series, barChartData.timestamps)).toEqual([
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-09T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 447,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-10T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 450,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-11T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 512,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-12T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 565,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-09T16:23:45.000Z'),
          group: 'New York',
          value: 528,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-10T16:23:45.000Z'),
          group: 'New York',
          value: 365,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-11T16:23:45.000Z'),
          group: 'New York',
          value: 442,
        },
        {
          dataSourceId: 'particles',
          date: new Date('2020-02-12T16:23:45.000Z'),
          group: 'New York',
          value: 453,
        },
      ]);
    });
    it('can handle sparse values from the backend', () => {
      const series = [
        {
          label: 'particles',
          dataSourceId: 'particles',
        },
        {
          label: 'emissions',
          dataSourceId: 'emissions',
        },
      ];
      const formattedChartData = formatChartData(
        'timestamp',
        series,
        barChartData.timestamps.slice(0, 2).map(
          (dataPoint, index) => (index % 2 === 0 ? omit(dataPoint, 'emissions') : dataPoint) // make the data sparse (this skips the emissions datapoint in a few points)
        )
      );
      expect(formattedChartData).toHaveLength(3);
      expect(formattedChartData.every((dataPoint) => dataPoint.value)).toEqual(true); // every value should be valid
    });
    it('returns empty array if no data matches dataFilter', () => {
      const series = [
        {
          label: 'Amsterdam',
          dataSourceId: 'particles',
          dataFilter: {
            city: 'Not Amsterdam',
          },
        },
      ];

      expect(
        formatChartData(
          'timestamp',
          series,
          barChartData.timestamps.filter((data) => data.city === 'Amsterdam')
        )
      ).toEqual([]);
    });
  });

  describe('formatColors', () => {
    it('returns correct format if series is array', () => {
      const series = [
        {
          label: 'Amsterdam',
          dataSourceId: 'particles',
          color: 'blue',
        },
        {
          label: 'New York',
          dataSourceId: 'particles',
          color: 'yellow',
        },
      ];

      expect(formatColors(series)).toEqual({
        scale: { Amsterdam: 'blue', 'New York': 'yellow' },
      });
    });
    it('returns correct format if series is object', () => {
      const series = {
        label: 'Amsterdam',
        dataSourceId: 'particles',
        color: 'blue',
      };

      expect(formatColors(series)).toEqual({
        scale: { Amsterdam: 'blue' },
      });

      // Default color should be used if no color is passed
      expect(formatColors(omit(series, 'color'))).toEqual({
        scale: { Amsterdam: CHART_COLORS[0] },
      });

      // loop through the colors if series is an array with no colors passed
      expect(
        formatColors([
          { label: 'Amsterdam', dataSourceId: 'particles' },
          { label: 'New York', dataSourceId: 'particles' },
        ])
      ).toEqual({
        scale: { Amsterdam: CHART_COLORS[0], 'New York': CHART_COLORS[1] },
      });
    });
  });

  describe('fill', () => {
    it('Fills points with the correct fill/stroke of matching alertRanges', () => {
      const data = {
        date: new Date(2019, 9, 29, 18, 38, 40),
        value: 82,
        group: 'Temperature',
      };

      const alertRanges = [
        {
          startTimestamp: 1572313622000,
          endTimestamp: 1572486422000,
          color: '#FF0000',
          details: 'Alert name',
        },
        {
          startTimestamp: 1572313622000,
          endTimestamp: 1572824320000,
          color: '#FFFF00',
          details: 'Less severe',
        },
      ];

      const isFilledCallback = applyIsFilled(alertRanges);
      const fillColorCallback = applyFillColor(alertRanges);
      const strokeColorCallback = applyStrokeColor(alertRanges);

      expect(isFilledCallback('Temperature', data.date.toString(), data, false)).toBe(true);
      expect(fillColorCallback('Temperature', data.date.toString(), data, '#6929c4')).toBe(
        '#FF0000'
      );
      expect(strokeColorCallback('Temperature', data.date.toString(), data, '#6929c4')).toBe(
        '#FF0000'
      );
    });

    it('Fills points with the original fill/stroke when no data given', () => {
      const alertRanges = [];

      const isFilledCallback = applyIsFilled(alertRanges);
      const fillColorCallback = applyFillColor(alertRanges);
      const strokeColorCallback = applyStrokeColor(alertRanges);

      expect(isFilledCallback('Temperature', undefined, undefined, false)).toBe(false);
      expect(fillColorCallback('Temperature', undefined, undefined, '#6929c4')).toBe('#6929c4');
      expect(strokeColorCallback('Temperature', undefined, undefined, '#6929c4')).toBe('#6929c4');
    });

    it('Fills points with the original fill/stroke when no ranges match', () => {
      const data = {
        date: new Date(2019, 9, 29, 18, 38, 40),
        value: 82,
        group: 'Temperature',
      };
      const alertRanges = [];

      const isFilledCallback = applyIsFilled(alertRanges);
      const fillColorCallback = applyFillColor(alertRanges);
      const strokeColorCallback = applyStrokeColor(alertRanges);

      expect(isFilledCallback('Temperature', data.date.toString(), data, false)).toBe(false);
      expect(fillColorCallback('Temperature', data.date.toString(), data, '#6929c4')).toBe(
        '#6929c4'
      );
      expect(strokeColorCallback('Temperature', data.date.toString(), data, '#6929c4')).toBe(
        '#6929c4'
      );
    });
  });
});
