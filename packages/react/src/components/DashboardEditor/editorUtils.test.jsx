import { omit } from 'lodash-es';
import { render, screen } from '@testing-library/react';

import { CARD_TYPES, BAR_CHART_TYPES } from '../../constants/LayoutConstants';

import {
  getDuplicateCard,
  getDefaultCard,
  isCardJsonValid,
  renderBreakpointInfo,
  formatSeries,
  formatAttributes,
  handleDataSeriesChange,
  handleDataItemEdit,
  renderDefaultIconByName,
  handleKeyDown,
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
          dataItemId: 'key1',
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

  describe('renderDefaultIconByName', () => {
    it('verify hotspot icon is found', () => {
      render(renderDefaultIconByName('User'));
      expect(screen.queryByTitle('User')).toBeDefined();
    });
    it('verify threshold icon is found', () => {
      render(renderDefaultIconByName('Error filled'));
      expect(screen.queryByTitle('Error filled')).toBeDefined();
    });
  });

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
      expect(defaultCard.content.showHeader).toEqual(true);
      expect(defaultCard.content.allowNavigation).toEqual(true);
    });
    it('should return ImageCard', () => {
      const defaultCard = getDefaultCard(CARD_TYPES.IMAGE, i18n);
      expect(defaultCard.type).toEqual(CARD_TYPES.IMAGE);
      expect(defaultCard.content).toBeDefined();
      expect(defaultCard.content.displayOption).toEqual('contain');
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

  describe('renderBreakpointInfo', () => {
    const i18n = {
      layoutInfoLg: 'Lg',
      layoutInfoMd: 'Md',
      layoutInfoSm: 'Sm',
    };
    it('should return Lg', () => {
      expect(renderBreakpointInfo('lg', i18n)).toEqual('Lg');
    });
    it('should return md', () => {
      expect(renderBreakpointInfo('md', i18n)).toEqual('Md');
    });
    it('should return sm', () => {
      expect(renderBreakpointInfo('sm', i18n)).toEqual('Sm');
    });
    it('should return Lg as default', () => {
      expect(renderBreakpointInfo('', i18n)).toEqual('Lg');
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
      {
        dataSourceId: 'temperature',
        dataItemId: 'temperature',
        aggregationMethod: 'last',
        id: 'temperature',
        text: 'Temperature',
        label: 'Temperature',
      },
      {
        dataSourceId: 'pressure',
        dataItemId: 'pressure',
        aggregationMethod: 'last',
        id: 'pressure',
        text: 'Pressure',
        label: 'Pressure',
      },
    ];
    it('should correctly format the card series', () => {
      expect(formatSeries(selectedItems, cardConfig)).toEqual([
        {
          dataSourceId: 'temperature',
          dataItemId: 'temperature',
          aggregationMethod: 'last',
          label: 'Temperature',
          color: 'red',
        },
        {
          dataSourceId: 'pressure',
          dataItemId: 'pressure',
          aggregationMethod: 'last',
          label: 'Pressure',
          color: '#1192e8',
        },
      ]);
    });
    it('should correctly generate colors for dataItems with no color defined', () => {
      expect(formatSeries(selectedItems, cardConfigWithoutColorDefinition)).toEqual([
        {
          dataSourceId: 'temperature',
          dataItemId: 'temperature',
          aggregationMethod: 'last',
          label: 'Temperature',
          color: '#6929c4',
        },
        {
          dataSourceId: 'pressure',
          dataItemId: 'pressure',
          aggregationMethod: 'last',
          label: 'Pressure',
          color: '#1192e8',
        },
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
        {
          id: 'key1',
          text: 'Key 1',
          dataItemId: 'key1',
          aggregationMethod: 'last',
          label: 'Key 1',
          dataSourceId: 'key1',
        },
        {
          id: 'key2',
          text: 'Key 2',
          dataItemId: 'key2',
          aggregationMethod: 'last',
          label: 'Key 2',
          dataSourceId: 'key2',
        },
      ];
      expect(formatAttributes(selectedItems, mockValueCard2)).toEqual([
        {
          dataSourceId: 'key1',
          dataItemId: 'key1',
          label: 'Key 1',
          precision: 2,
          aggregationMethod: 'last',
          thresholds: [],
          unit: '%',
          dataFilter: { deviceid: '73000' },
        },
        {
          dataSourceId: 'key2',
          dataItemId: 'key2',
          aggregationMethod: 'last',
          label: 'Key 2',
          unit: 'lb',
        },
      ]);
    });
  });
  describe('handleDataSeriesChange', () => {
    it('should just return cardConfig if there is no Type', () => {
      const newCard = handleDataSeriesChange([], omit(mockTimeSeriesCard, 'type'));
      expect(newCard).toEqual(omit(mockTimeSeriesCard, 'type'));
    });
    // base table card
    const mockTableCard = {
      id: 'Standard',
      title: 'table card',
      type: 'TABLE',
      size: 'LARGE',
      content: {},
    };
    it('handleDataSeriesChange should correctly format the columns for new table card attributes', () => {
      const selectedItems = [
        {
          id: 'key1',
          text: 'Key 1',
          dataItemId: 'key1',
          aggregationMethod: 'last',
          label: 'Key 1',
          dataSourceId: 'key1',
        },
        {
          id: 'key2',
          text: 'Key 2',
          dataItemId: 'key2',
          aggregationMethod: 'last',
          label: 'Key 2',
          dataSourceId: 'key2',
        },
      ];
      const newCard = handleDataSeriesChange(selectedItems, mockTableCard, () => {});
      expect(newCard).toEqual({
        ...mockTableCard,
        content: {
          columns: [
            {
              dataItemId: 'timestamp',
              dataSourceId: 'timestamp',
              label: 'Timestamp',
              type: 'TIMESTAMP',
              sort: 'DESC',
            },
            {
              id: 'key1',
              text: 'Key 1',
              dataItemId: 'key1',
              aggregationMethod: 'last',
              dataSourceId: 'key1',
              label: 'Key 1',
            },
            {
              id: 'key2',
              text: 'Key 2',
              dataItemId: 'key2',
              aggregationMethod: 'last',
              dataSourceId: 'key2',
              label: 'Key 2',
            },
          ],
        },
      });
    });
    it('handleDataSeriesChange existing card should correctly add the columns for new table card attributes', () => {
      const selectedItems = [
        {
          id: 'key1',
          text: 'Key 1',
          dataItemId: 'key1',
          aggregationMethod: 'last',
          label: 'Key 1',
          dataSourceId: 'key1',
          type: 'NUMBER',
        },
        {
          id: 'key2',
          text: 'Key 2',
          dataItemId: 'key2',
          aggregationMethod: 'last',
          label: 'Key 2',
          dataSourceId: 'key2',
          type: 'NUMBER',
        },
        {
          id: 'key3',
          text: 'Key 3',
          dataItemId: 'key3',
          aggregationMethod: 'last',
          label: 'Key 3',
          dataSourceId: 'key3',
          type: 'TIMESTAMP',
        },
      ];
      const newCard = handleDataSeriesChange(
        selectedItems,
        {
          ...mockTableCard,
          content: {
            columns: [
              {
                dataSourceId: 'timestamp',
                label: 'Timestamp',
                type: 'TIMESTAMP',
                sort: 'DESC',
              },
              {
                dataSourceId: 'manufacturer',
                label: 'Manufacturer',
                dataItemType: 'DIMENSION',
              },
            ],
          },
        },
        () => {}
      );
      expect(newCard).toEqual({
        ...mockTableCard,
        content: {
          columns: [
            {
              dataSourceId: 'timestamp',
              label: 'Timestamp',
              type: 'TIMESTAMP',
              sort: 'DESC',
            },
            {
              dataSourceId: 'manufacturer',
              label: 'Manufacturer',
              dataItemType: 'DIMENSION',
            },
            {
              id: 'key1',
              text: 'Key 1',
              dataItemId: 'key1',
              aggregationMethod: 'last',
              dataSourceId: 'key1',
              label: 'Key 1',
              type: 'NUMBER',
            },
            {
              id: 'key2',
              text: 'Key 2',
              dataItemId: 'key2',
              aggregationMethod: 'last',
              dataSourceId: 'key2',
              label: 'Key 2',
              type: 'NUMBER',
            },
            {
              id: 'key3',
              text: 'Key 3',
              dataItemId: 'key3',
              aggregationMethod: 'last',
              label: 'Key 3',
              dataSourceId: 'key3',
              type: 'TIMESTAMP',
            },
          ],
        },
      });
    });
    it('handleDataSeriesChange should correctly format the columns for new table card dimensions', () => {
      const selectedItems = [
        {
          dataItemId: 'manufacturer',
          dataSourceId: 'manufacturer',
          label: 'Manufacturer',
          dataItemType: 'DIMENSION',
        },
      ];
      const newCard = handleDataSeriesChange(selectedItems, mockTableCard, () => {}, null, true);
      expect(newCard).toEqual({
        ...mockTableCard,
        content: {
          columns: [
            {
              dataItemId: 'timestamp',
              dataSourceId: 'timestamp',
              label: 'Timestamp',
              type: 'TIMESTAMP',
              sort: 'DESC',
            },
            {
              dataItemId: 'manufacturer',
              dataSourceId: 'manufacturer',
              label: 'Manufacturer',
              dataItemType: 'DIMENSION',
            },
          ],
        },
      });
    });
    it('handleDataSeriesChange existing card should correctly add the columns for new table card dimensions', () => {
      const selectedItems = [
        { id: 'manufacturer', text: 'Manufacturer', dataItemType: 'DIMENSION' },
        { id: 'deviceid', text: 'Device', dataItemType: 'DIMENSION' },
      ];
      const newCard = handleDataSeriesChange(
        selectedItems,
        {
          ...mockTableCard,
          content: {
            columns: [
              {
                dataSourceId: 'timestamp',
                label: 'Timestamp',
                type: 'TIMESTAMP',
              },
              {
                dataSourceId: 'manufacturer',
                label: 'Manufacturer',
                dataItemType: 'DIMENSION',
              },
              {
                dataSourceId: 'deviceid',
                label: 'Device',
                dataItemType: 'DIMENSION',
              },
              {
                dataSourceId: 'key1',
                label: 'Key 1',
              },
            ],
          },
        },
        () => {},
        null,
        true
      );
      expect(newCard).toEqual({
        ...mockTableCard,
        content: {
          columns: [
            {
              dataSourceId: 'timestamp',
              label: 'Timestamp',
              type: 'TIMESTAMP',
            },
            {
              dataSourceId: 'manufacturer',
              label: 'Manufacturer',
              dataItemType: 'DIMENSION',
            },
            {
              dataSourceId: 'deviceid',
              label: 'Device',
              dataItemType: 'DIMENSION',
            },
            {
              dataSourceId: 'key1',
              label: 'Key 1',
            },
          ],
        },
      });
    });
    it('should correctly format the data in Timeseries', () => {
      const selectedItems = [
        {
          id: 'key1',
          text: 'Key 1',
          dataItemId: 'key1',
          aggregationMethod: 'last',
          label: 'Key 1',
          dataSourceId: 'key1',
        },
        {
          id: 'key2',
          text: 'Key 2',
          dataItemId: 'key2',
          aggregationMethod: 'last',
          label: 'Key 2',
          dataSourceId: 'key2',
        },
      ];
      const newCard = handleDataSeriesChange(selectedItems, mockTimeSeriesCard, () => {});
      expect(newCard).toEqual({
        content: {
          series: [
            {
              aggregationMethod: 'last',
              color: '#6929c4',
              dataSourceId: 'key1',
              dataItemId: 'key1',
              label: 'Key 1',
            },
            {
              aggregationMethod: 'last',
              color: '#1192e8',
              dataSourceId: 'key2',
              dataItemId: 'key2',
              label: 'Key 2',
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
        {
          id: 'key1',
          text: 'Key 1',
          dataItemId: 'key1',
          aggregationMethod: 'last',
          label: 'Key 1',
          dataSourceId: 'key1',
        },
        {
          id: 'key2',
          text: 'Key 2',
          dataItemId: 'key2',
          aggregationMethod: 'last',
          label: 'Key 2',
          dataSourceId: 'key2',
        },
      ];
      const newCard = handleDataSeriesChange(selectedItems, mockValueCard);
      expect(newCard).toEqual({
        content: {
          attributes: [
            {
              aggregationMethod: 'last',
              dataSourceId: 'key1',
              dataItemId: 'key1',
              label: 'Key 1',
              unit: '%',
            },
            {
              aggregationMethod: 'last',
              dataSourceId: 'key2',
              dataItemId: 'key2',
              label: 'Key 2',
              unit: 'lb',
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
      };
      const selectedItems = [
        {
          dataSourceId: 'temp_last',
          label: '{high} temp',
          unit: '{unitVar}',
          // Adding thresholds through the editorUtils
          thresholds: [
            {
              dataSourceId: 'temp_last',
              comparison: '>=',
              color: '#da1e28',
              icon: 'Checkmark',
              value: 98,
            },
          ],
        },
        { dataSourceId: 'elevators', label: 'Elevators', unit: '°' },
        { dataSourceId: 'pressure', label: 'Pressure', unit: 'psi' },
      ];
      const newCard = handleDataSeriesChange(selectedItems, mockImageCard, null, 0);

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
                    thresholds: [
                      {
                        dataSourceId: 'temp_last',
                        comparison: '>=',
                        color: '#da1e28',
                        icon: 'Checkmark',
                        value: 98,
                      },
                    ],
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
      });
    });
  });
  describe('handleDataItemEdit', () => {
    it('handles keydown', () => {
      const onSelectCard = jest.fn();
      handleKeyDown({ key: 'Esc' }, onSelectCard, 'test-id1');
      expect(onSelectCard).not.toHaveBeenCalled();
      handleKeyDown({ key: 'Enter' }, onSelectCard, 'test-id2');
      expect(onSelectCard).toHaveBeenCalledWith('test-id2');
      handleKeyDown({ key: 'Space' }, onSelectCard, 'test-id3');
      expect(onSelectCard).toHaveBeenCalledWith('test-id3');
    });

    //   DONUT, CUSTOM, GAUGE LIST PIE
    it('returns unmodified cardConfig for some cards', () => {
      const mockDonutCard = {
        type: CARD_TYPES.DONUT,
        content: 'not modified',
      };
      expect(handleDataItemEdit(null, mockDonutCard, null, null)).toBe(mockDonutCard);

      const mockCustomCard = {
        type: CARD_TYPES.CUSTOM,
        content: 'not modified',
      };
      expect(handleDataItemEdit(null, mockCustomCard, null, null)).toBe(mockCustomCard);

      const mockGaugeCard = {
        type: CARD_TYPES.GAUGE,
        content: 'not modified',
      };
      expect(handleDataItemEdit(null, mockGaugeCard, null, null)).toBe(mockGaugeCard);

      const mockListCard = {
        type: CARD_TYPES.LIST,
        content: 'not modified',
      };
      expect(handleDataItemEdit(null, mockListCard, null, null)).toBe(mockListCard);

      const mockPieCard = {
        type: CARD_TYPES.PIE,
        content: 'not modified',
      };
      expect(handleDataItemEdit(null, mockPieCard, null, null)).toBe(mockPieCard);
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
                ],
              },
            },
          ],
        },
      };
      const editDataItem = {
        dataSourceId: 'temp_last',
        label: '{high} temps', // update the label
        unit: 'degrees', // update the unit
        thresholds: [
          // adding two thresholds
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
      const newCard = handleDataItemEdit(editDataItem, mockImageCard, null, 0);

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
                  },
                ],
              },
            },
          ],
        },
      });

      // Test without hotspots prop
      delete mockImageCard.content.hotspots;
      const newCardWithoutHotspots = handleDataItemEdit(editDataItem, mockImageCard, null, 0);

      expect(newCardWithoutHotspots).toEqual({
        type: CARD_TYPES.IMAGE,
        content: { hotspots: [] },
      });
    });

    it('handleDataItemEdit for Image Card updates the correct hotspot', () => {
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
            {
              title: 'hotspot2',
              content: {
                attributes: [
                  {
                    dataSourceId: 'pressure',
                    label: 'pressure',
                    unit: 'psi',
                  },
                ],
              },
            },
          ],
        },
      };
      const editDataItem = {
        dataSourceId: 'pressure',
        label: 'Pressure', // This is the change the user is making
        unit: 'psi',
      };
      // Notice we're updating the second hotspot!
      const newCard = handleDataItemEdit(editDataItem, mockImageCard, null, 1);

      // Only the second hotspot should be updated with a new label
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
                ],
              },
            },
            {
              title: 'hotspot2',
              content: {
                attributes: [
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
      });
    });
    it('should correctly format the data in Timeseries', () => {
      const editDataItem = {
        dataSourceId: 'torque',
        label: 'Torque',
        xLabel: 'X axis',
        yLabel: 'Y axis',
        unit: 'PSI',
      };
      const newCard = handleDataItemEdit(editDataItem, mockTimeSeriesCard, [editDataItem]);
      expect(newCard).toEqual({
        id: 'Standard',
        title: 'timeseries card',
        type: 'TIMESERIES',
        size: 'MEDIUM',
        content: {
          series: [
            { dataSourceId: 'airflow', label: 'Airflow' },
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
        dataItemId: 'key2',
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
              dataItemId: 'key1',
              dataSourceId: 'key1',
              unit: '%',
              label: 'Key 1',
            },
            {
              dataItemId: 'key2',
              dataSourceId: 'key2',
              unit: 'F',
              label: 'Updated Key 2',
            },
          ],
        },
      });

      // Data item not within attributes
      const editDataItemNotInContent = {
        dataItemId: 'key3',
        dataSourceId: 'key3',
        unit: 'F',
        label: 'Updated Key 3',
      };
      expect(handleDataItemEdit(editDataItemNotInContent, mockValueCard)).toEqual({
        id: 'Standard',
        title: 'value card',
        type: 'VALUE',
        size: 'MEDIUM',
        content: {
          attributes: [
            {
              dataItemId: 'key1',
              dataSourceId: 'key1',
              unit: '%',
              label: 'Key 1',
            },
            {
              dataSourceId: 'key2',
              unit: 'lb',
              label: 'Key 2',
            },
            {
              dataItemId: 'key3',
              dataSourceId: 'key3',
              unit: 'F',
              label: 'Updated Key 3',
            },
          ],
        },
      });
    });
  });
});
