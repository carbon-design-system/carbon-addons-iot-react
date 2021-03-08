import every from 'lodash/every';
import omit from 'lodash/omit';

import { COLORS } from '../../constants/LayoutConstants';
import { CHART_COLORS } from '../../constants/CardPropTypes';
import { barChartData } from '../../utils/barChartDataSample';

import {
  generateSampleValues,
  generateTableSampleValues,
  formatGraphTick,
  findMatchingAlertRange,
  handleTooltip,
  formatChartData,
  formatColors,
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

  describe('handleTooltip', () => {
    it('should add date', () => {
      const defaultTooltip = '<ul><li>existing tooltip</li></ul>';
      // the date is from 2017
      const updatedTooltip = handleTooltip(
        { date: new Date(1500000000000) },
        defaultTooltip,
        [],
        'Detected alert:'
      );
      expect(updatedTooltip).not.toEqual(defaultTooltip);
      expect(updatedTooltip).toContain('<ul');
      expect(updatedTooltip).toContain('2017');
    });
    it('with __data__ and GMT', () => {
      const defaultTooltip = '<ul><li>existing tooltip</li></ul>';
      // the date is from 2017
      const updatedTooltip = handleTooltip(
        { __data__: { date: new Date(1500000000000) } },
        defaultTooltip,
        [],
        'Detected alert:',
        true,
        'dddd' // custom format
      );
      expect(updatedTooltip).not.toEqual(defaultTooltip);
      expect(updatedTooltip).toContain('<ul');
      expect(updatedTooltip).toContain('Friday');
    });
    it('should add alert ranges if they exist', () => {
      const defaultTooltip = '<ul><li>existing tooltip</li></ul>';
      // the date is from 2017
      const updatedTooltip = handleTooltip(
        [{ date: new Date(1573073950) }],
        defaultTooltip,
        [
          {
            startTimestamp: 1573073950,
            endTimestamp: 1573073951,
            color: '#FF0000',
            details: 'Alert details',
          },
        ],
        'Detected alert:'
      );
      expect(updatedTooltip).not.toEqual(defaultTooltip);
      expect(updatedTooltip).toContain('<ul');
      expect(updatedTooltip).toContain('Detected alert:');
      expect(updatedTooltip).toContain('Alert details');
    });
  });

  describe('formatChartData', () => {
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
          date: new Date('2020-02-09T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 447,
        },
        {
          date: new Date('2020-02-10T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 450,
        },
        {
          date: new Date('2020-02-11T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 512,
        },
        {
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
          date: new Date('2020-02-09T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 447,
        },
        {
          date: new Date('2020-02-10T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 450,
        },
        {
          date: new Date('2020-02-11T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 512,
        },
        {
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
          date: new Date('2020-02-09T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 447,
        },
        {
          date: new Date('2020-02-10T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 450,
        },
        {
          date: new Date('2020-02-11T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 512,
        },
        {
          date: new Date('2020-02-12T16:23:45.000Z'),
          group: 'Amsterdam',
          value: 565,
        },
        {
          date: new Date('2020-02-09T16:23:45.000Z'),
          group: 'New York',
          value: 528,
        },
        {
          date: new Date('2020-02-10T16:23:45.000Z'),
          group: 'New York',
          value: 365,
        },
        {
          date: new Date('2020-02-11T16:23:45.000Z'),
          group: 'New York',
          value: 442,
        },
        {
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
    });
  });
});
