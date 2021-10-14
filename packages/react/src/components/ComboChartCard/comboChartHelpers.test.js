import { renderHook } from '@testing-library/react-hooks';

import { CARD_SIZES, TIME_SERIES_TYPES } from '../../constants/LayoutConstants';
import { handleTooltip } from '../../utils/cardUtilityFunctions';
import dayjs from '../../utils/dayjs';

import { useChartData, useChartOptions } from './comboChartHelpers';

jest.mock('../../utils/cardUtilityFunctions', () => {
  const originalModule = jest.requireActual('../../utils/cardUtilityFunctions');

  return {
    __esModule: true,
    ...originalModule,
    handleTooltip: jest.fn(() => 'mocked handleTooltip'),
  };
});

const getChartOptionsParams = () => ({
  size: 'WIDE', // Old size that gets translated
  addSpaceOnEdges: 0,
  chartTitle: undefined,
  comboChartTypes: [],
  curve: 'curveNatural',
  decimalPrecision: 0,
  i18n: {},
  includeZeroOnXaxis: true,
  includeZeroOnYaxis: true,
  interval: undefined,
  isEditable: false,
  isLoading: false,
  legend: { position: 'top' },
  previousTick: { current: 'Sat Dec 01 2018 00:00:00' },
  series: [],
  showLegend: true,
  showTimeInGMT: false,
  thresholds: [],
  timeDataSourceId: 'date-id',
  tooltipDateFormatPattern: 'L HH:mm:ss',
  values: [],
  xLabel: 'Date',
  yLabel: 'Score',
});

describe('comboChartHelpers', () => {
  describe('useChartOptions - axes', () => {
    it('creates a ticks formatter function for the bottom axis ', () => {
      const { result } = renderHook(() => useChartOptions(getChartOptionsParams()));
      expect(
        result.current.axes.bottom.ticks.formatter('Wed Jan 02 2019 00:00:00', 0, 'Jan 2019')
      ).toEqual('Jan 02 2019');
    });

    it('sets max ticks to the bottom axis depending on size', () => {
      let params = { ...getChartOptionsParams(), size: CARD_SIZES.MEDIUMTHIN };
      let wrappedResult = renderHook(() => useChartOptions(params));
      expect(wrappedResult.result.current.axes.bottom.ticks.max).toEqual(2);

      params = { ...getChartOptionsParams(), size: CARD_SIZES.MEDIUM };
      wrappedResult = renderHook(() => useChartOptions(params));
      expect(wrappedResult.result.current.axes.bottom.ticks.max).toEqual(4);

      params = { ...getChartOptionsParams(), size: CARD_SIZES.MEDIUMWIDE };
      wrappedResult = renderHook(() => useChartOptions(params));
      expect(wrappedResult.result.current.axes.bottom.ticks.max).toEqual(6);

      params = { ...getChartOptionsParams(), size: CARD_SIZES.LARGE };
      wrappedResult = renderHook(() => useChartOptions(params));
      expect(wrappedResult.result.current.axes.bottom.ticks.max).toEqual(6);

      params = { ...getChartOptionsParams(), size: CARD_SIZES.LARGEWIDE };
      wrappedResult = renderHook(() => useChartOptions(params));
      expect(wrappedResult.result.current.axes.bottom.ticks.max).toEqual(14);

      params = { ...getChartOptionsParams(), size: undefined };
      wrappedResult = renderHook(() => useChartOptions(params));
      expect(wrappedResult.result.current.axes.bottom.ticks.max).toEqual(10);
    });

    it('sets a domain range to the bottom axis if present', () => {
      const domainRange = [
        new Date('Tue Jan 01 2019 00:00:00'),
        new Date('Sat Dec 01 2018 00:00:00'),
      ];
      const params = { ...getChartOptionsParams(), domainRange };
      const { result } = renderHook(() => useChartOptions(params));
      expect(result.current.axes.bottom.domain).toEqual(domainRange);
    });

    it('sets a unit to the left axis title if present', () => {
      const params = { ...getChartOptionsParams(), unit: 'my unit' };
      const { result } = renderHook(() => useChartOptions(params));
      expect(result.current.axes.left.title).toEqual('Score (my unit)');
    });

    it('stacks the left axis for BAR with multiple series', () => {
      const params = {
        ...getChartOptionsParams(),
        chartType: TIME_SERIES_TYPES.BAR,
        series: [
          { dataSourceId: 'health', label: 'Health' },
          { dataSourceId: 'age', label: 'Age' },
        ],
      };
      const { result } = renderHook(() => useChartOptions(params));
      expect(result.current.axes.left.stacked).toEqual(true);
    });
  });
  describe('useChartOptions - tooltip', () => {
    it('creates a tooltip value formatter function', () => {
      let params = {
        ...getChartOptionsParams(),
        decimalPrecision: 4,
        locale: 'fr',
        size: CARD_SIZES.LARGE,
        unit: 'My unit',
      };
      let wrappedResult = renderHook(() => useChartOptions(params));
      expect(wrappedResult.result.current.tooltip.valueFormatter(10.4567898)).toEqual(
        '10,4568 My unit'
      );

      params = {
        ...getChartOptionsParams(),
        decimalPrecision: 3,
        locale: 'us',
        size: CARD_SIZES.MEDIUMTHIN,
      };
      wrappedResult = renderHook(() => useChartOptions(params));
      expect(wrappedResult.result.current.tooltip.valueFormatter(10.4567898)).toEqual('10.457');

      params = {
        ...getChartOptionsParams(),
        decimalPrecision: 3,
        locale: 'us',
        size: CARD_SIZES.MEDIUMTHIN,
      };
      wrappedResult = renderHook(() => useChartOptions(params));
      expect(wrappedResult.result.current.tooltip.valueFormatter(null)).toEqual('--');
    });

    it('creates a custom tooltip HTML function based on handleTooltip', () => {
      const dateValue = new Date(1500000000000);
      let params = { ...getChartOptionsParams() };
      let wrappedResult = renderHook(() => useChartOptions(params));
      wrappedResult.result.current.tooltip.customHTML(dateValue);
      expect(handleTooltip).toHaveBeenCalledWith(
        dateValue,
        'date-id',
        false,
        'L HH:mm:ss',
        undefined
      );

      params = {
        ...getChartOptionsParams(),
        locale: 'fr',
        showTimeInGMT: true,
        tooltipDateFormatPattern: 'L HH:mm',
      };
      wrappedResult = renderHook(() => useChartOptions(params));
      wrappedResult.result.current.tooltip.customHTML(dateValue);
      expect(handleTooltip).toHaveBeenCalledWith(dateValue, 'date-id', true, 'L HH:mm', 'fr');
    });
  });
  describe('useChartData', () => {
    it('it returns dates as data type Date when input is data type Date', () => {
      const { result } = renderHook(() =>
        useChartData(
          [
            { date: new Date('2018-12-01T00:00:00'), health: 85, age: 78, condition: 97, rul: 93 },
            { date: new Date('2018-12-15T00:00:00'), health: 83, age: 77, condition: 95, rul: 92 },
            { date: new Date('2019-01-01T00:00:00'), health: 83, age: 77, condition: 94, rul: 92 },
          ],
          {
            series: [
              { dataSourceId: 'health', label: 'Health' },
              { dataSourceId: 'age', label: 'Age' },
              { dataSourceId: 'condition', label: 'Condition' },
              { dataSourceId: 'rul', label: 'RUL' },
            ],
            timeDataSourceId: 'date',
          }
        )
      );
      expect(result.current.length).toEqual(12);
      expect(result.current[0]).toEqual({
        date: new Date('2018-12-01T00:00:00'),
        group: 'Health',
        value: 85,
      });
    });

    it('it returns dates as dayjs objects when input is date strings', () => {
      const { result } = renderHook(() =>
        useChartData(
          [
            { date: '2018-12-01T00:00:00', health: 85, age: 78, condition: 97, rul: 93 },
            { date: '2018-12-15T00:00:00', health: 83, age: 77, condition: 95, rul: 92 },
            { date: '2019-01-01T00:00:00', health: 83, age: 77, condition: 94, rul: 92 },
          ],
          {
            series: [
              { dataSourceId: 'health', label: 'Health' },
              { dataSourceId: 'age', label: 'Age' },
              { dataSourceId: 'condition', label: 'Condition' },
              { dataSourceId: 'rul', label: 'RUL' },
            ],
            timeDataSourceId: 'date',
          }
        )
      );
      expect(result.current.length).toEqual(12);
      expect(result.current[0]).toEqual({
        date: dayjs('2018-12-01T00:00:00'),
        group: 'Health',
        value: 85,
      });
    });

    it('it returns dates in dayjs utc object when input is date strings and showTimeInGMT is true', () => {
      const { result } = renderHook(() =>
        useChartData(
          [
            { date: '2018-12-01T00:00:00', health: 85, age: 78, condition: 97, rul: 93 },
            { date: '2018-12-15T00:00:00', health: 83, age: 77, condition: 95, rul: 92 },
            { date: '2019-01-01T00:00:00', health: 83, age: 77, condition: 94, rul: 92 },
          ],
          {
            series: [
              { dataSourceId: 'health', label: 'Health' },
              { dataSourceId: 'age', label: 'Age' },
              { dataSourceId: 'condition', label: 'Condition' },
              { dataSourceId: 'rul', label: 'RUL' },
            ],
            timeDataSourceId: 'date',
            showTimeInGMT: true,
          }
        )
      );
      expect(result.current.length).toEqual(12);
      expect(result.current[0]).toEqual({
        date: dayjs.utc('2018-12-01T00:00:00'),
        group: 'Health',
        value: 85,
      });
    });
  });
});
