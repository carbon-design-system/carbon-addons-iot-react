import {
  determineCardRange,
  compareGrains,
  getUpdatedCardSize,
  handleVariables,
} from '../cardUtilityFunctions';
import { CARD_TYPES } from '../../constants/LayoutConstants';

describe('cardUtilityFunctions', () => {
  test('determineCardRange', () => {
    expect(determineCardRange('last24Hours').type).toEqual('rolling');
    expect(determineCardRange('thisWeek').type).toEqual('periodToDate');
  });
  test('compareGrains', () => {
    expect(compareGrains('day', 'day')).toEqual(0);
    expect(compareGrains('hour', 'day')).toEqual(-1);
    expect(compareGrains('week', 'day')).toEqual(1);
  });
  test('GetUpdatedCardSize', () => {
    expect(getUpdatedCardSize('XSMALL')).toEqual('SMALL');
    expect(getUpdatedCardSize('XSMALLWIDE')).toEqual('SMALLWIDE');
    expect(getUpdatedCardSize('WIDE')).toEqual('MEDIUMWIDE');
    expect(getUpdatedCardSize('TALL')).toEqual('LARGETHIN');
    expect(getUpdatedCardSize('XLARGE')).toEqual('LARGEWIDE');
    expect(getUpdatedCardSize('MEDIUM')).toEqual('MEDIUM');
  });
  test('handleVariables updates value cards with variables', () => {
    const valueCardPropsWithVariables = {
      title: 'Fuel {variable} flow',
      content: {
        attributes: [
          {
            dataSourceId: 'fuel_flow_rate',
            dataFilter: {
              deviceid: '73000',
            },
            label: 'Latest - 73000',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: 2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate2',
            dataFilter: {
              deviceid: '73001',
            },
            label: 'Latest - 73001',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: '{unitVariable}',
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_min',
            label: 'Minimum {otherVariable}',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '>',
                icon: 'Checkmark outline',
                value: -2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_max',
            label: 'Maximum',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '<',
                icon: 'Checkmark outline',
                value: 5,
              },
            ],
          },
        ],
      },
      values: [],
      others: {
        cardVariables: {
          variable: 'big',
          otherVariable: 'small',
          unitVariable: 'F',
        },
        dataSource: {
          range: {
            type: 'periodToDate',
            count: -24,
            interval: 'hour',
          },
          attributes: [
            {
              aggregator: 'last',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate',
            },
            {
              aggregator: 'last',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate2',
            },
            {
              aggregator: 'min',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate_min',
            },
            {
              aggregator: 'max',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate_max',
            },
          ],
          groupBy: ['deviceid'],
        },
      },
    };
    const updatedContent = {
      attributes: [
        {
          dataSourceId: 'fuel_flow_rate',
          dataFilter: {
            deviceid: '73000',
          },
          label: 'Latest - 73000',
          precision: 3,
          thresholds: [
            {
              color: '#F00',
              comparison: '>',
              icon: 'Warning',
              value: 2,
            },
          ],
        },
        {
          dataSourceId: 'fuel_flow_rate2',
          dataFilter: {
            deviceid: '73001',
          },
          label: 'Latest - 73001',
          precision: 3,
          thresholds: [
            {
              color: '#F00',
              comparison: '>',
              icon: 'Warning',
              value: 'F',
            },
          ],
        },
        {
          dataSourceId: 'fuel_flow_rate_min',
          label: 'Minimum small',
          precision: 3,
          thresholds: [
            {
              color: '#5aa700',
              comparison: '>',
              icon: 'Checkmark outline',
              value: -2,
            },
          ],
        },
        {
          dataSourceId: 'fuel_flow_rate_max',
          label: 'Maximum',
          precision: 3,
          thresholds: [
            {
              color: '#5aa700',
              comparison: '<',
              icon: 'Checkmark outline',
              value: 5,
            },
          ],
        },
      ],
    };
    const updatedTitle = 'Fuel big flow';
    const updatedValues = [];
    const { title, content, values, others } = valueCardPropsWithVariables;
    expect(handleVariables(CARD_TYPES.VALUE, title, content, values, others)).toEqual({
      title: updatedTitle,
      content: updatedContent,
      values: updatedValues,
      ...others,
    });
  });
  test('handleVariables updates image cards with variables', () => {
    const imageCardWithVariables = {
      title: 'Expanded {size} card',
      content: {
        alt: 'Sample image',
        src: 'static/media/landscape.69143f06.jpg',
        zoomMax: 10,
        hotspots: [
          {
            icon: 'carbon-icon',
            color: 'blue',
            content: {
              title: 'sensor readings',
              attributes: [
                {
                  dataSourceId: 'temp_last',
                  label: '{level} temp',
                  unit: '{image_unit}',
                },
              ],
            },
            thresholds: [
              {
                dataSourceId: 'temp_last',
                comparison: '>=',
                value: 12,
              },
            ],
          },
        ],
      },
      values: [],
      others: {
        cardVariables: {
          size: 'large',
          level: 'high',
          image_unit: 'Mwh',
        },
      },
    };
    const updatedTitle = 'Expanded large card';
    const updatedContent = {
      alt: 'Sample image',
      src: 'static/media/landscape.69143f06.jpg',
      zoomMax: 10,
      hotspots: [
        {
          icon: 'carbon-icon',
          color: 'blue',
          content: {
            title: 'sensor readings',
            attributes: [
              {
                dataSourceId: 'temp_last',
                label: 'high temp',
                unit: 'Mwh',
              },
            ],
          },
          thresholds: [
            {
              dataSourceId: 'temp_last',
              comparison: '>=',
              value: 12,
            },
          ],
        },
      ],
    };
    const updatedValues = [];
    const { title, content, values, others } = imageCardWithVariables;
    expect(handleVariables(CARD_TYPES.IMAGE, title, content, values, others)).toEqual({
      title: updatedTitle,
      content: updatedContent,
      values: updatedValues,
      ...others,
    });
  });
  test('handleVariables updates table cards with variables', () => {
    const tableCardPropsWithVariables = {
      title: 'Max and {minimum} speed',
      content: {
        columns: [
          {
            dataSourceId: 'abnormal_stop_id',
            label: 'Abnormal Stop Count',
          },
          {
            dataSourceId: 'speed_id_mean',
            label: 'Mean Speed',
          },
          {
            dataSourceId: 'speed_id_max',
            label: 'Max Speed',
          },
          {
            dataSourceId: 'deviceid',
            linkTemplate: {
              href: 'www.{url}.com',
              displayValue: '{url}',
            },
          },
          {
            dataSourceId: 'timestamp',
            label: 'Time stamp',
            type: 'TIMESTAMP',
          },
        ],
        thresholds: [
          {
            dataSourceId: 'abnormal_stop_id',
            comparison: '>=',
            severity: 1,
            value: 75,
            label: '{level} Severity',
            severityLabel: '{size} severity',
            icon: 'Stop filled',
            color: '#008000',
          },
        ],
        expandedRows: [
          {
            dataSourceId: 'travel_time_id',
            label: 'Mean travel time',
          },
        ],
        sort: 'DESC',
      },
      values: [],
      others: {
        cardVariables: {
          minimum: 1.24,
          url: 'google',
          level: 'high',
          size: 'large',
        },
        dataSource: {
          attributes: [
            {
              aggregator: 'mean',
              attribute: 'speed',
              id: 'speed_id_mean',
            },
            {
              aggregator: 'count',
              attribute: 'abnormal_stop_count',
              id: 'abnormal_stop_id',
            },
            {
              aggregator: 'max',
              attribute: 'speed',
              id: 'speed_id_max',
            },
            {
              aggregator: 'mean',
              attribute: 'travel_time',
              id: 'travel_time_id',
            },
          ],
          range: {
            count: -7,
            interval: 'day',
          },
          timeGrain: 'day',
          groupBy: ['deviceid'],
        },
      },
    };
    const updatedTitle = 'Max and 1.24 speed';
    const updatedContent = {
      columns: [
        {
          dataSourceId: 'abnormal_stop_id',
          label: 'Abnormal Stop Count',
        },
        {
          dataSourceId: 'speed_id_mean',
          label: 'Mean Speed',
        },
        {
          dataSourceId: 'speed_id_max',
          label: 'Max Speed',
        },
        {
          dataSourceId: 'deviceid',
          linkTemplate: {
            href: 'www.google.com',
            displayValue: 'google',
          },
        },
        {
          dataSourceId: 'timestamp',
          label: 'Time stamp',
          type: 'TIMESTAMP',
        },
      ],
      thresholds: [
        {
          dataSourceId: 'abnormal_stop_id',
          comparison: '>=',
          severity: 1,
          value: 75,
          label: 'high Severity',
          severityLabel: 'large severity',
          icon: 'Stop filled',
          color: '#008000',
        },
      ],
      expandedRows: [
        {
          dataSourceId: 'travel_time_id',
          label: 'Mean travel time',
        },
      ],
      sort: 'DESC',
    };
    const updatedValues = [];
    const { title, content, values, others } = tableCardPropsWithVariables;
    expect(handleVariables(CARD_TYPES.TABLE, title, content, values, others)).toEqual({
      title: updatedTitle,
      content: updatedContent,
      values: updatedValues,
      ...others,
    });
  });
  test('handleVariables returns original card when no cardVariables are specified', () => {
    const valueCardProps = {
      id: 'fuel_flow',
      size: 'SMALL',
      title: 'Fuel flow',
      content: {
        attributes: [
          {
            dataSourceId: 'fuel_flow_rate',
            dataFilter: {
              deviceid: '73000',
            },
            label: 'Latest - 73000',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: 2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate2',
            dataFilter: {
              deviceid: '73001',
            },
            label: 'Latest - 73001',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: '%',
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_min',
            label: 'Minimum',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '>',
                icon: 'Checkmark outline',
                value: -2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_max',
            label: 'Maximum',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '<',
                icon: 'Checkmark outline',
                value: 5,
              },
            ],
          },
        ],
      },
      values: [],
      others: {
        dataSource: {
          range: {
            type: 'periodToDate',
            count: -24,
            interval: 'hour',
          },
          attributes: [
            {
              aggregator: 'last',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate',
            },
            {
              aggregator: 'last',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate2',
            },
            {
              aggregator: 'min',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate_min',
            },
            {
              aggregator: 'max',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate_max',
            },
          ],
          groupBy: ['deviceid'],
        },
      },
    };
    const { title, content, values, others } = valueCardProps;
    expect(handleVariables(CARD_TYPES.IMAGE, title, content, [], others)).toEqual({
      title,
      content,
      values,
      ...others,
    });
  });
});
