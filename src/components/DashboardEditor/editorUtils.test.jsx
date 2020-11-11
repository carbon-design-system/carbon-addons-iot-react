import { CARD_TYPES, BAR_CHART_TYPES } from '../..';

import {
  getDuplicateCard,
  getDefaultCard,
  isCardJsonValid,
  renderBreakpointInfo,
} from './editorUtils';

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
    const i18n = {
      defaultCardTitle: 'Untitled',
    };
    it('should return ValueCard', () => {
      const defaultCard = getDefaultCard(CARD_TYPES.VALUE, i18n);
      expect(defaultCard.type).toEqual(CARD_TYPES.VALUE);
      expect(defaultCard.content).toBeDefined();
    });
    it('should return TimeSeriesCard', () => {
      const defaultCard = getDefaultCard(CARD_TYPES.TIMESERIES, i18n);
      expect(defaultCard.type).toEqual(CARD_TYPES.TIMESERIES);
      expect(defaultCard.content).toBeDefined();
    });
    it('should return simple BarChartCard', () => {
      const defaultCard = getDefaultCard('SIMPLE_BAR', i18n);
      expect(defaultCard.type).toEqual(CARD_TYPES.BAR);
      expect(defaultCard.content.type).toEqual(BAR_CHART_TYPES.SIMPLE);
    });
    it('should return grouped BarChartCard', () => {
      const defaultCard = getDefaultCard('GROUPED_BAR', i18n);
      expect(defaultCard.type).toEqual(CARD_TYPES.BAR);
      expect(defaultCard.content.type).toEqual(BAR_CHART_TYPES.GROUPED);
    });
    it('should return stacked BarChartCard', () => {
      const defaultCard = getDefaultCard('STACKED_BAR', i18n);
      expect(defaultCard.type).toEqual(CARD_TYPES.BAR);
      expect(defaultCard.content.type).toEqual(BAR_CHART_TYPES.STACKED);
    });
    it('should return TableCard', () => {
      const defaultCard = getDefaultCard(CARD_TYPES.TABLE, i18n);
      expect(defaultCard.type).toEqual(CARD_TYPES.TABLE);
      expect(defaultCard.content).toBeDefined();
    });
    it('should return ImageCard', () => {
      const defaultCard = getDefaultCard(CARD_TYPES.IMAGE, i18n);
      expect(defaultCard.type).toEqual(CARD_TYPES.IMAGE);
      expect(defaultCard.content).toBeDefined();
    });
    it('should return CustomCard', () => {
      const defaultCard = getDefaultCard(CARD_TYPES.CUSTOM, i18n);
      expect(defaultCard.type).toEqual(CARD_TYPES.CUSTOM);
      expect(defaultCard.content).toBeUndefined();
    });
  });

  describe('isCardJsonValid', () => {
    it('ValueCard', () => {
      expect(isCardJsonValid(mockValueCard)).toEqual(true);
      expect(isCardJsonValid({ ...mockValueCard, content: null })).toEqual(
        false
      );
    });
    it('TimeSeriesCard', () => {
      expect(isCardJsonValid(mockTimeSeriesCard)).toEqual(true);
      expect(isCardJsonValid({ ...mockTimeSeriesCard, content: null })).toEqual(
        false
      );
    });
    it('BarChartCard', () => {
      expect(isCardJsonValid(mockBarChartCard)).toEqual(true);
      expect(isCardJsonValid({ ...mockBarChartCard, content: null })).toEqual(
        false
      );
    });
    it('TableCard', () => {
      expect(isCardJsonValid(mockTableCard)).toEqual(true);
      expect(isCardJsonValid({ ...mockTableCard, content: null })).toEqual(
        false
      );
    });
    it('CustomCard', () => {
      expect(
        isCardJsonValid({ ...mockTableCard, type: CARD_TYPES.CUSTOM })
      ).toEqual(true);
    });
  });

  describe('renderBreakpointInfo', () => {
    const i18n = {
      layoutInfoXl: 'Xl',
      layoutInfoLg: 'Lg',
      layoutInfoMd: 'Md',
    };
    it('should return Xl', () => {
      expect(renderBreakpointInfo('xl', i18n)).toEqual('Xl');
    });
    it('should return lg', () => {
      expect(renderBreakpointInfo('lg', i18n)).toEqual('Lg');
    });
    it('should return md', () => {
      expect(renderBreakpointInfo('md', i18n)).toEqual('Md');
    });
  });
});
