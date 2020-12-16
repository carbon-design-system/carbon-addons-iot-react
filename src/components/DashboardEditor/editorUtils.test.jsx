import omit from 'lodash/omit';

import { CARD_TYPES, BAR_CHART_TYPES } from '../..';

import {
  getDuplicateCard,
  getDefaultCard,
  isCardJsonValid,
  renderBreakpointInfo,
  formatSeries,
  formatAttributes,
  handleDataSeriesChange,
  handleDataItemEdit,
} from './editorUtils';

describe('editorUtils', () => {
  const cardConfig = {
    id: 'Timeseries',
    title: 'Untitled',
    size: 'MEDIUMWIDE',
    type: 'TIMESERIES',
    content: {
      series: [
        {
          label: 'Temperature',
          dataSourceId: 'temperature',
          color: 'red',
        },
        {
          label: 'Pressure',
          dataSourceId: 'pressure',
        },
      ],
      xLabel: 'Time',
      yLabel: 'Temperature (˚F)',
      includeZeroOnXaxis: true,
      includeZeroOnYaxis: true,
      timeDataSourceId: 'timestamp',
      addSpaceOnEdges: 1,
    },
    interval: 'day',
  };

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
    content: {
      series: [
        {
          dataSourceId: 'airflow',
          label: 'Airflow',
        },
        {
          dataSourceId: 'torque',
          label: 'Torque',
        },
      ],
    },
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
  describe('formatSeries', () => {
    const cardConfigWithoutColorDefinition = {
      content: {
        series: [
          {
            label: 'Temperature',
            dataSourceId: 'temperature',
          },
          {
            label: 'Pressure',
            dataSourceId: 'pressure',
          },
        ],
      },
    };
    const selectedItems = [
      { id: 'temperature', text: 'Temperature' },
      { id: 'pressure', text: 'Pressure' },
    ];
    it('should correctly format the card series', () => {
      expect(formatSeries(selectedItems, cardConfig)).toEqual([
        { dataSourceId: 'temperature', label: 'Temperature', color: 'red' },
        { dataSourceId: 'pressure', label: 'Pressure', color: '#1192e8' },
      ]);
    });
    it('should correctly generate colors for dataItems with no color defined', () => {
      expect(
        formatSeries(selectedItems, cardConfigWithoutColorDefinition)
      ).toEqual([
        { dataSourceId: 'temperature', label: 'Temperature', color: '#6929c4' },
        { dataSourceId: 'pressure', label: 'Pressure', color: '#1192e8' },
      ]);
    });
  });
  describe('formatAttributes', () => {
    it('should correctly format the card attributes', () => {
      const mockValueCard2 = {
        id: 'Standard',
        title: 'value card',
        type: 'VALUE',
        size: 'MEDIUM',
        content: {
          attributes: [
            {
              dataSourceId: 'key1',
              unit: '%',
              precision: 2,
              thresholds: [],
              dataFilter: { deviceid: '73000' },
            },
            {
              dataSourceId: 'key2',
              unit: 'lb',
              label: 'Key 2',
            },
          ],
        },
      };
      const selectedItems = [
        { id: 'key1', text: 'Key 1' },
        { id: 'key2', text: 'Key 2' },
      ];
      expect(formatAttributes(selectedItems, mockValueCard2)).toEqual([
        {
          dataSourceId: 'key1',
          label: 'key1',
          precision: 2,
          dataFilter: { deviceid: '73000' },
        },
        { dataSourceId: 'key2', label: 'Key 2' },
      ]);
    });
  });
  describe('handleDataSeriesChange', () => {
    it('should just return cardConfig if there is no Type', () => {
      const newCard = handleDataSeriesChange(
        [],
        omit(mockTimeSeriesCard, 'type')
      );
      expect(newCard).toEqual(omit(mockTimeSeriesCard, 'type'));
    });

    it('should correctly format the data in Timeseries', () => {
      const selectedItems = [
        { id: 'key1', text: 'Key 1' },
        { id: 'key2', text: 'Key 2' },
      ];
      const newCard = handleDataSeriesChange(
        selectedItems,
        mockTimeSeriesCard,
        () => {}
      );
      expect(newCard).toEqual({
        content: {
          series: [
            {
              color: '#6929c4',
              dataSourceId: 'key1',
              label: 'key1',
            },
            {
              color: '#1192e8',
              dataSourceId: 'key2',
              label: 'key2',
            },
          ],
        },
        id: 'Standard',
        size: 'MEDIUM',
        title: 'timeseries card',
        type: 'TIMESERIES',
      });
    });
    it('should correctly format the data in Value', () => {
      const selectedItems = [
        { id: 'key1', text: 'Key 1' },
        { id: 'key2', text: 'Key 2' },
      ];
      const newCard = handleDataSeriesChange(selectedItems, mockValueCard);
      expect(newCard).toEqual({
        content: {
          attributes: [
            {
              dataSourceId: 'key1',
              label: 'Key 1',
            },
            {
              dataSourceId: 'key2',
              label: 'Key 2',
            },
          ],
        },
        id: 'Standard',
        size: 'MEDIUM',
        title: 'value card',
        type: 'VALUE',
      });
    });

    it('should correctly format the data in Image Card', () => {
      const mockImageCard = {
        type: CARD_TYPES.IMAGE,
        content: {
          hotspots: [
            {
              title: 'elevators',
              content: {
                attributes: [
                  {
                    dataSourceId: 'temp_last',
                    label: '{high} temp',
                    unit: '{unitVar}',
                  },
                  {
                    dataSourceId: 'elevators',
                    label: 'Elevators',
                    unit: 'floor',
                  },
                ],
              },
            },
          ],
        },
        thresholds: [
          {
            dataSourceId: 'temp_last',
            comparison: '>=',
            color: '#da1e28',
            icon: 'Checkmark',
            value: 98,
          },
        ],
      };
      const selectedItems = [
        { dataSourceId: 'temp_last', label: '{high} temp', unit: '{unitVar}' },
        { dataSourceId: 'elevators', label: 'Elevators', unit: '°' },
        { dataSourceId: 'pressure', label: 'Pressure', unit: 'psi' },
      ];
      const newCard = handleDataSeriesChange(
        selectedItems,
        mockImageCard,
        null,
        0
      );

      expect(newCard).toEqual({
        type: CARD_TYPES.IMAGE,
        content: {
          hotspots: [
            {
              title: 'elevators',
              content: {
                attributes: [
                  {
                    dataSourceId: 'temp_last',
                    label: '{high} temp',
                    unit: '{unitVar}',
                  },
                  {
                    dataSourceId: 'elevators',
                    label: 'Elevators',
                    unit: '°',
                  },
                  {
                    dataSourceId: 'pressure',
                    label: 'Pressure',
                    unit: 'psi',
                  },
                ],
              },
            },
          ],
        },
        thresholds: [
          {
            dataSourceId: 'temp_last',
            comparison: '>=',
            color: '#da1e28',
            icon: 'Checkmark',
            value: 98,
          },
        ],
      });
    });
  });
  describe('handleDataItemEdit', () => {
    it('should correctly format the data in Image Card', () => {
      const mockImageCard = {
        type: CARD_TYPES.IMAGE,
        content: {
          hotspots: [
            {
              title: 'elevators',
              content: {
                attributes: [
                  {
                    dataSourceId: 'temp_last',
                    label: '{high} temp',
                    unit: '{unitVar}',
                  },
                ],
              },
            },
          ],
        },
      };
      const editDataItem = {
        dataSourceId: 'temp_last',
        label: '{high} temps',
        unit: 'degrees',
        thresholds: [
          {
            dataSourceId: 'temp_last',
            comparison: '>',
            color: '#da1e28',
            icon: 'Checkmark',
            value: 98,
          },
          {
            dataSourceId: 'temp_last',
            comparison: '=',
            color: '#ffffff',
            icon: 'Checkmark',
            value: 100,
          },
        ],
      };
      let newCard = handleDataItemEdit(editDataItem, mockImageCard, null, 0);

      expect(newCard).toEqual({
        type: CARD_TYPES.IMAGE,
        content: {
          hotspots: [
            {
              title: 'elevators',
              content: {
                attributes: [
                  {
                    dataSourceId: 'temp_last',
                    label: '{high} temps',
                    unit: 'degrees',
                  },
                ],
              },
            },
          ],
        },
        thresholds: [
          {
            dataSourceId: 'temp_last',
            comparison: '>',
            color: '#da1e28',
            icon: 'Checkmark',
            value: 98,
          },
          {
            dataSourceId: 'temp_last',
            comparison: '=',
            color: '#ffffff',
            icon: 'Checkmark',
            value: 100,
          },
        ],
      });

      const withoutThresholds = omit(mockImageCard, 'thresholds');
      newCard = handleDataSeriesChange(
        editDataItem,
        withoutThresholds,
        null,
        0
      );

      expect(newCard).toEqual(withoutThresholds);
    });

    it('should correctly format the data in Timeseries', () => {
      const editDataItem = {
        dataSourceId: 'torque',
        label: 'Torque',
        xLabel: 'X axis',
        yLabel: 'Y axis',
        unit: 'PSI',
      };
      const newCard = handleDataItemEdit(editDataItem, mockTimeSeriesCard, [
        editDataItem,
      ]);
      expect(newCard).toEqual({
        id: 'Standard',
        title: 'timeseries card',
        type: 'TIMESERIES',
        size: 'MEDIUM',
        content: {
          series: [
            {
              dataSourceId: 'torque',
              label: 'Torque',
              xLabel: 'X axis',
              yLabel: 'Y axis',
              unit: 'PSI',
            },
          ],
        },
      });
    });
    it('should correctly format the data in Value', () => {
      const editDataItem = {
        dataSourceId: 'key2',
        unit: 'F',
        label: 'Updated Key 2',
      };
      const newCard = handleDataItemEdit(editDataItem, mockValueCard);
      expect(newCard).toEqual({
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
              unit: 'F',
              label: 'Updated Key 2',
            },
          ],
        },
      });
    });
  });
});
