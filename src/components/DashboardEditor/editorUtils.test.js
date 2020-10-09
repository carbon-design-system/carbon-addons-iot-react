import { CARD_TYPES } from '../..';

import { getDuplicateCard, getDefaultCard, isCardJsonValid } from './editorUtils';

describe('editorUtils', () => {
  const mockValueCard = {
    id: 'Standard',
    title: 'value card',
    type: 'VALUE',
    size: 'MEDIUM',
    content: {
      attributes: [
        {
          dataSourceId: 'key1',
          unit: '%',
          label: 'Key 1',
        },
        {
          dataSourceId: 'key2',
          unit: 'lb',
          label: 'Key 2',
        },
      ],
    },
  };
  const mockTimeSeriesCard = {
    id: 'Standard',
    title: 'timeseries card',
    type: 'TIMESERIES',
    size: 'MEDIUM',
    content: {},
  };
  const mockBarChartCard = {
    id: 'Standard',
    title: 'bar card',
    type: 'BAR',
    size: 'MEDIUM',
    content: {},
  };
  const mockTableCard = {
    id: 'Standard',
    title: 'table card',
    type: 'TABLE',
    size: 'MEDIUM',
    content: {},
  };

  describe('getDuplicateCard', () => {
    it('should return same card JSON with unique id', () => {
      expect(getDuplicateCard(mockValueCard).id).not.toEqual(mockValueCard.id);
    });
  });

  describe('getDefaultCard', () => {
    it('should return ValueCard', () => {
      expect(getDefaultCard(CARD_TYPES.VALUE).type).toEqual(CARD_TYPES.VALUE);
      expect(getDefaultCard(CARD_TYPES.VALUE).content).toBeDefined();
    });
    it('should return TimeSeriesCard', () => {
      expect(getDefaultCard(CARD_TYPES.TIMESERIES).type).toEqual(CARD_TYPES.TIMESERIES);
      expect(getDefaultCard(CARD_TYPES.TIMESERIES).content).toBeDefined();
    });
    it('should return BarChartCard', () => {
      expect(getDefaultCard(CARD_TYPES.BAR).type).toEqual(CARD_TYPES.BAR);
      expect(getDefaultCard(CARD_TYPES.TIMESERIES).content).toBeDefined();
    });
    it('should return TableCard', () => {
      expect(getDefaultCard(CARD_TYPES.TABLE).type).toEqual(CARD_TYPES.TABLE);
      expect(getDefaultCard(CARD_TYPES.TABLE).content).toBeDefined();
    });
    it('should return CustomCard', () => {
      expect(getDefaultCard(CARD_TYPES.CUSTOM).type).toEqual(CARD_TYPES.CUSTOM);
      expect(getDefaultCard(CARD_TYPES.CUSTOM).content).toBeUndefined();
    });
  });

  describe('isCardJsonValid', () => {
    it('ValueCard', () => {
      expect(isCardJsonValid(mockValueCard)).toEqual(true);
      expect(isCardJsonValid({ ...mockValueCard, content: null })).toEqual(false);
    });
    it('TimeSeriesCard', () => {
      expect(isCardJsonValid(mockTimeSeriesCard)).toEqual(true);
      expect(isCardJsonValid({ ...mockTimeSeriesCard, content: null })).toEqual(false);
    });
    it('BarChartCard', () => {
      expect(isCardJsonValid(mockBarChartCard)).toEqual(true);
      expect(isCardJsonValid({ ...mockBarChartCard, content: null })).toEqual(false);
    });
    it('TableCard', () => {
      expect(isCardJsonValid(mockTableCard)).toEqual(true);
      expect(isCardJsonValid({ ...mockTableCard, content: null })).toEqual(false);
    });
    it('CustomCard', () => {
      expect(isCardJsonValid({ ...mockTableCard, type: CARD_TYPES.CUSTOM })).toEqual(true);
    });
  });
});
