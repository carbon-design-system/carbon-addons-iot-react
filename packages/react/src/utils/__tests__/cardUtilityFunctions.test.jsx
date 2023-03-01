import React from 'react';

import {
  determinePrecision,
  determineCardRange,
  compareGrains,
  getUpdatedCardSize,
  formatNumberWithPrecision,
  handleCardVariables,
  getVariables,
  getCardVariables,
  replaceVariables,
  chartValueFormatter,
  increaseSmallCardSize,
  findMatchingThresholds,
  findMatchingAlertRange,
  handleTooltip,
} from '../cardUtilityFunctions';
import { CARD_SIZES } from '../../constants/LayoutConstants';

describe('cardUtilityFunctions', () => {
  it('determinePrecision', () => {
    // default precisions
    expect(determinePrecision(CARD_SIZES.SMALL, 11.45)).toEqual(0);
    expect(determinePrecision(CARD_SIZES.SMALL, 0.125)).toBeUndefined();
    // For small card sizes always trust the passed precision
    expect(determinePrecision(CARD_SIZES.SMALL, 11.45, 1)).toEqual(1);
    expect(determinePrecision(CARD_SIZES.SMALL, 0.125, 2)).toEqual(2);
    // For integers no precision
    expect(determinePrecision(CARD_SIZES.LARGE, 700)).toEqual(0);
    expect(determinePrecision(CARD_SIZES.LARGE, 1.45, 1)).toEqual(1);
  });
  it('determineCardRange', () => {
    expect(determineCardRange('last24Hours').type).toEqual('rolling');
    expect(determineCardRange('thisWeek').type).toEqual('periodToDate');
  });
  it('compareGrains', () => {
    expect(compareGrains('day', 'day')).toEqual(0);
    expect(compareGrains('hour', 'day')).toEqual(-1);
    expect(compareGrains('week', 'day')).toEqual(1);
  });
  it('GetUpdatedCardSize', () => {
    expect(getUpdatedCardSize('XSMALL')).toEqual('SMALL');
    expect(getUpdatedCardSize('XSMALLWIDE')).toEqual('SMALLWIDE');
    expect(getUpdatedCardSize('WIDE')).toEqual('MEDIUMWIDE');
    expect(getUpdatedCardSize('TALL')).toEqual('LARGETHIN');
    expect(getUpdatedCardSize('XLARGE')).toEqual('LARGEWIDE');
    expect(getUpdatedCardSize('MEDIUM')).toEqual('MEDIUM');
  });
  describe('formatNumberWithPrecision', () => {
    it('decimal separator should be comma', () => {
      expect(formatNumberWithPrecision(3.45, 1, 'fr', false)).toEqual('3,5');
    });
    it('decimal separator should be period', () => {
      expect(formatNumberWithPrecision(3.45, 2, 'en', false)).toEqual('3.45');
    });
    it('K separator', () => {
      expect(formatNumberWithPrecision(35000, 2, 'en', true)).toEqual('35.00K');
      expect(formatNumberWithPrecision(35000, null, 'en', true)).toEqual('35K');
    });
  });
  describe('card variables', () => {
    describe('handleCardVariables', () => {
      it('updates value cards with variables', () => {
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
        expect(handleCardVariables(title, content, values, others)).toEqual({
          title: updatedTitle,
          content: updatedContent,
          values: updatedValues,
          ...others,
        });
      });

      it('updates table cards with variables', () => {
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
        expect(handleCardVariables(title, content, values, others)).toEqual({
          title: updatedTitle,
          content: updatedContent,
          values: updatedValues,
          ...others,
        });
      });

      it('returns original card when no value cardVariables are specified', () => {
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
        expect(handleCardVariables(title, content, [], others)).toEqual({
          title,
          content,
          values,
          ...others,
        });
      });

      it('returns original card when no table cardVariables are specified', () => {
        const tableCardProps = {
          title: 'Max and min speed',
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
                label: 'Low Severity',
                severityLabel: 'Low severity',
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
        const { title, content, values, others } = tableCardProps;
        expect(handleCardVariables(title, content, values, others)).toEqual({
          title,
          content,
          values,
          ...others,
        });
      });

      it('updates cards with variables when there are case discrepancies in cardVariables', () => {
        const timeSeriesCardPropsWithVariables = {
          title: 'timeSeries {device}',
          content: {
            xLabel: '{x_label}',
            yLabel: '{y_label}',
            unit: '{unit}',
            series: [
              {
                dataSourceId: 'airflow_mean',
                label: '{label}',
              },
            ],
          },
          values: [],
          others: {
            cardVariables: {
              x_labEL: 'x-axis',
              y_label: 'y-axis',
              deVice: 'air',
              unit: 'F',
              Label: 'Airflow Mean',
            },
          },
        };
        const updatedTitle = 'timeSeries air';
        const updatedContent = {
          xLabel: 'x-axis',
          yLabel: 'y-axis',
          unit: 'F',
          series: [
            {
              dataSourceId: 'airflow_mean',
              label: 'Airflow Mean',
            },
          ],
        };
        const updatedValues = [];
        const { title, content, values, others } = timeSeriesCardPropsWithVariables;
        expect(handleCardVariables(title, content, values, others)).toEqual({
          title: updatedTitle,
          content: updatedContent,
          values: updatedValues,
          ...others,
        });
      });

      it('updates timeseries cards with variables', () => {
        const timeSeriesCardPropsWithVariables = {
          title: 'timeSeries {device}',
          content: {
            xLabel: '{x_label}',
            yLabel: '{y_label}',
            unit: '{unit}',
            series: [
              {
                dataSourceId: 'airflow_mean',
                label: '{label}',
              },
            ],
          },
          values: [],
          others: {
            cardVariables: {
              x_label: 'x-axis',
              y_label: 'y-axis',
              device: 'air',
              unit: 'F',
              label: 'Airflow Mean',
            },
          },
        };
        const updatedTitle = 'timeSeries air';
        const updatedContent = {
          xLabel: 'x-axis',
          yLabel: 'y-axis',
          unit: 'F',
          series: [
            {
              dataSourceId: 'airflow_mean',
              label: 'Airflow Mean',
            },
          ],
        };
        const updatedValues = [];
        const { title, content, values, others } = timeSeriesCardPropsWithVariables;
        expect(handleCardVariables(title, content, values, others)).toEqual({
          title: updatedTitle,
          content: updatedContent,
          values: updatedValues,
          ...others,
        });
      });

      it('returns original card when no timeseries cardVariables are specified', () => {
        const timeSeriesCardProps = {
          title: 'timeSeries',
          content: {
            xLabel: 'x-axis',
            yLabel: 'y-axis',
            unit: 'F',
            series: [
              {
                dataSourceId: 'airflow_mean',
                label: 'Airflow Mean',
              },
            ],
          },
          values: [],
          others: {},
        };
        const { title, content, values, others } = timeSeriesCardProps;
        expect(handleCardVariables(title, content, values, others)).toEqual({
          title,
          content,
          values,
          ...others,
        });
      });

      it('should not replace href since its being skipped', () => {
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
                href: 'www.{url}.com',
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
        expect(handleCardVariables(title, content, values, others, ['href'])).toEqual({
          title: updatedTitle,
          content: updatedContent,
          values: updatedValues,
          ...others,
        });
      });
    });

    it('getVariables should return a list of variables from a string', () => {
      const titleWithVariables = '{variable} in a title with {variables}';
      const title = 'A title without variables';
      expect(getVariables(titleWithVariables)).toEqual(['variable', 'variables']);
      expect(getVariables(title)).toEqual(undefined);
    });

    describe('getCardVariables', () => {
      it('returns variables in ValueCards', () => {
        const valueCardWithVariables = {
          id: 'fuel_flow',
          size: 'SMALL',
          title: 'Fuel {variable} flow',
          type: 'VALUE',
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
        };
        expect(getCardVariables(valueCardWithVariables)).toEqual([
          'variable',
          'unitVariable',
          'otherVariable',
        ]);
      });

      it('returns variables for an ImageCard', () => {
        const imageCardWithVariables = {
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
                      label: '{high} temp',
                      unit: '{unitVar}',
                    },
                  ],
                },
                thresholds: [
                  {
                    dataSourceId: 'temp_last',
                    comparison: '>=',
                    value: '{thresVar}',
                  },
                ],
              },
            ],
          },
          size: 'LARGE',
          title: 'Expanded {large} card',
          type: 'IMAGE',
        };
        expect(getCardVariables(imageCardWithVariables)).toEqual([
          'high',
          'unitVar',
          'thresVar',
          'large',
        ]);
      });

      it('returns variables for a TableCard', () => {
        const tableCardWithVariables = {
          id: 'speed_mean_and_max_threshold',
          size: 'LARGE',
          title: 'Max and {minimum} speed',
          type: 'TABLE',
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
                label: '{high} Severity',
                severityLabel: '{large} severity',
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
        };
        expect(getCardVariables(tableCardWithVariables)).toEqual([
          'minimum',
          'url',
          'high',
          'large',
        ]);
      });

      it('returns variables for a TimeSeriesCard', () => {
        const timeSeriesCardWithVariables = {
          id: 'air_flow_mean',
          size: 'LARGE',
          title: 'Air flow {deviceId} mean vs max',
          type: 'TIMESERIES',
          content: {
            series: [
              {
                dataSourceId: 'airflow_mean',
                label: 'Airflow Mean',
              },
              {
                dataSourceId: 'airflow_max',
                label: '{airflow_max}',
              },
            ],
            xLabel: '{x_axis}',
            yLabel: '{y_axis}',
            unit: '{unit}',
            timeDataSourceId: 'timestamp',
          },
          dataSource: {
            attributes: [
              {
                aggregator: 'mean',
                attribute: 'air_flow_rate',
                id: 'airflow_mean',
              },
              {
                aggregator: 'max',
                attribute: 'air_flow_rate',
                id: 'airflow_max',
              },
            ],
            range: {
              type: 'periodToDate',
              count: -7,
              interval: 'day',
            },
            additionalData: {
              type: 'alert',
              dataFilter: {
                name: 'alert_air_flow_rate_greater_than_1',
              },
            },
            timeGrain: 'day',
          },
        };
        expect(getCardVariables(timeSeriesCardWithVariables)).toEqual([
          'deviceId',
          'airflow_max',
          'x_axis',
          'y_axis',
          'unit',
        ]);
      });

      it('does not blow up on null or react symbols', () => {
        const timeSeriesCardWithVariables = {
          id: 'air_flow_mean',
          size: 'LARGE',
          title: 'Air flow {deviceId} mean vs max',
          type: 'TIMESERIES',
          content: {
            series: [
              {
                dataSourceId: 'airflow_max',
                label: '{airflow_max}',
              },
            ],
            xLabel: '{x_axis}',
            yLabel: '{y_axis}',
            unit: '{unit}',
            timeDataSourceId: 'timestamp',
          },
          dataSource: {
            attributes: [
              {
                aggregator: 'max',
                attribute: 'air_flow_rate',
                id: 'airflow_max',
              },
            ],
            range: {
              type: 'periodToDate',
              count: -7,
              interval: 'day',
            },
            timeGrain: 'day',
          },
          someNullProperty: null,
          someReactSymbolProperty: <p>Hi I am a React symbol</p>,
        };
        expect(getCardVariables(timeSeriesCardWithVariables)).toEqual([
          'deviceId',
          'airflow_max',
          'x_axis',
          'y_axis',
          'unit',
        ]);
      });

      it('returns empty array when no variables are given', () => {
        const imageCard = {
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
                      label: 'temp',
                      unit: 'F',
                    },
                  ],
                },
                thresholds: [
                  {
                    dataSourceId: 'temp_last',
                    comparison: '>=',
                    value: '300',
                  },
                ],
              },
            ],
          },
          size: 'LARGE',
          title: 'Expanded card',
          type: 'IMAGE',
        };
        expect(getCardVariables(imageCard)).toEqual([]);
      });

      it('does not return variables for skipped properties', () => {
        const tableCardWithVariables = {
          id: 'speed_mean_and_max_threshold',
          size: 'LARGE',
          title: 'Max and {minimum} speed',
          type: 'TABLE',
          content: {
            columns: [
              {
                dataSourceId: 'abnormal_stop_id',
                label: 'Abnormal Stop Count',
              },
              {
                dataSourceId: 'deviceid',
                linkTemplate: {
                  href: 'www.{url}.com',
                  target: '_blank',
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
                label: '{high} Severity',
                severityLabel: '{large} severity',
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
        };
        expect(getCardVariables(tableCardWithVariables, ['href'])).toEqual([
          'minimum',
          'high',
          'large',
        ]);
      });
    });

    describe('replaceVariables', () => {
      it('replaceVariables', () => {
        const card = {
          title: 'my {number_variable} {string_variable}',
          thresholds: [{ value: '{number_variable}' }, { value: '{string_variable}' }],
        };
        const updatedCard = replaceVariables(
          ['number_variable', 'string_variable'],
          { number_variable: 100, string_variable: 'mystring' },
          card
        );
        expect(updatedCard.title).toEqual('my 100 mystring');
        expect(updatedCard.thresholds[0].value).toEqual(100);
        expect(updatedCard.thresholds[1].value).toEqual('mystring');
      });

      it('replaceVariables handles nodes correctly', () => {
        const card = {
          title: <p>my default</p>,
          thresholds: [{ value: '{number_variable}' }, { value: '{string_variable}' }],
        };
        const updatedCard = replaceVariables(
          ['number_variable', 'string_variable'],
          { number_variable: 100, string_variable: 'mystring' },
          card
        );
        expect(React.isValidElement(updatedCard.title)).toEqual(true);
        expect(updatedCard.thresholds[0].value).toEqual(100);
        expect(updatedCard.thresholds[1].value).toEqual('mystring');
      });

      it('replaceVariables handles null targets', () => {
        const card = {
          title: 'untitled',
          values: [{ value1: null, value2: 'a value: {value1}' }],
        };
        const cardVariables = {
          value1: 'myValue1Value',
        };
        const variables = ['value1'];
        expect(replaceVariables(variables, cardVariables, card)).toEqual({
          title: 'untitled',
          values: [{ value1: null, value2: 'a value: myValue1Value' }],
        });
      });
    });
  });

  it('chartValueFormatter', () => {
    // Small should get 3 precision
    expect(chartValueFormatter(0.23456, CARD_SIZES.LARGE, null)).toEqual('0.235');
    // default precision
    expect(chartValueFormatter(1.23456, CARD_SIZES.LARGE, null)).toEqual('1.2');
    // With units
    expect(chartValueFormatter(0.23456, CARD_SIZES.LARGE, 'writes per second')).toEqual(
      '0.235 writes per second'
    );

    // Large numbers!
    expect(chartValueFormatter(1500, CARD_SIZES.LARGE, null)).toEqual('1,500');
    // nil
    expect(chartValueFormatter(null, CARD_SIZES.LARGE, null)).toEqual('--');
  });

  describe('Card sizes', () => {
    const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});
    let originalDev;

    beforeAll(() => {
      originalDev = global.__DEV__;
    });

    afterAll(() => {
      global.__DEV__ = originalDev;
      consoleSpy.mockRestore();
    });

    it('increaseSmallCardSize and gives warning in DEV mode', () => {
      global.__DEV__ = false;
      expect(increaseSmallCardSize(CARD_SIZES.SMALL, 'testComponent')).toEqual(CARD_SIZES.MEDIUM);
      expect(increaseSmallCardSize(CARD_SIZES.SMALLWIDE, 'testComponent')).toEqual(
        CARD_SIZES.MEDIUMWIDE
      );

      expect(consoleSpy).not.toHaveBeenCalled();

      global.__DEV__ = true;
      expect(increaseSmallCardSize(CARD_SIZES.SMALL, 'testComponent')).toEqual(CARD_SIZES.MEDIUM);
      expect(increaseSmallCardSize(CARD_SIZES.SMALLWIDE, 'testComponent')).toEqual(
        CARD_SIZES.MEDIUMWIDE
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        `Warning: testComponent does not support card size ${CARD_SIZES.SMALL}`
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        `Warning: testComponent does not support card size ${CARD_SIZES.SMALLWIDE}`
      );

      expect(increaseSmallCardSize(CARD_SIZES.MEDIUM)).toEqual(CARD_SIZES.MEDIUM);
      expect(increaseSmallCardSize(CARD_SIZES.MEDIUMTHIN)).toEqual(CARD_SIZES.MEDIUMTHIN);
      expect(increaseSmallCardSize(CARD_SIZES.MEDIUMWIDE)).toEqual(CARD_SIZES.MEDIUMWIDE);
      expect(increaseSmallCardSize(CARD_SIZES.LARGE)).toEqual(CARD_SIZES.LARGE);
      expect(increaseSmallCardSize(CARD_SIZES.LARGETHIN)).toEqual(CARD_SIZES.LARGETHIN);
      expect(increaseSmallCardSize(CARD_SIZES.LARGEWIDE)).toEqual(CARD_SIZES.LARGEWIDE);
    });
  });

  describe('findMatchingThresholds', () => {
    const thresholds = [
      { comparison: '>', dataSourceId: 'airflow_mean', severity: 3, value: 2 },
      {
        comparison: '>',
        dataSourceId: 'airflow_mean',
        severity: 1,
        value: 2.2,
      },
      { comparison: '>', dataSourceId: 'airflow_max', severity: 3, value: 4 },
      { comparison: '>', dataSourceId: 'airflow_max', severity: 1, value: 4.5 },
      {
        comparison: '=',
        dataSourceId: 'airflow_status',
        severity: 1,
        value: 'High',
      },
    ];

    it('findMatchingThresholds', () => {
      const oneMatchingThreshold = findMatchingThresholds(
        thresholds,
        { airflow_mean: 4 },
        'airflow_mean'
      );
      expect(oneMatchingThreshold).toHaveLength(1);
      // The highest severity should match
      expect(oneMatchingThreshold[0].severity).toEqual(1);
    });
    it('string value', () => {
      const oneMatchingThreshold = findMatchingThresholds(
        thresholds,
        { airflow_status: 'High' },
        'airflow_status'
      );
      expect(oneMatchingThreshold).toHaveLength(1);
      // The highest severity should match
      expect(oneMatchingThreshold[0].severity).toEqual(1);
    });
    it('multiple columns', () => {
      const twoMatchingThresholds = findMatchingThresholds(thresholds, {
        airflow_mean: 4,
        airflow_max: 5,
      });
      expect(twoMatchingThresholds).toHaveLength(2);
      // The highest severity should match
      expect(twoMatchingThresholds[0].severity).toEqual(1);
      expect(twoMatchingThresholds[0].dataSourceId).toEqual('airflow_mean');
      expect(twoMatchingThresholds[1].severity).toEqual(1);
      expect(twoMatchingThresholds[1].dataSourceId).toEqual('airflow_max');
    });
    it('no column', () => {
      const thresholds = [
        {
          comparison: '<',
          dataSourceId: 'airflow_mean',
          severity: 1,
          value: 4.5,
        },
      ];
      const oneMatchingThreshold = findMatchingThresholds(thresholds, {
        airflow_mean: 4,
      });
      expect(oneMatchingThreshold).toHaveLength(1);
      // The highest severity should match
      expect(oneMatchingThreshold[0].severity).toEqual(1);

      // shouldn't match on null values
      const zeroMatchingThreshold = findMatchingThresholds(thresholds, {
        airflow_mean: null,
      });
      expect(zeroMatchingThreshold).toHaveLength(0);
      // shouldn't match on null values
      const zeroMatchingThreshold2 = findMatchingThresholds(
        [
          {
            comparison: '<=',
            dataSourceId: 'airflow_mean',
            severity: 1,
            value: 4.5,
          },
        ],
        { airflow_mean: null }
      );
      expect(zeroMatchingThreshold2).toHaveLength(0);
    });
    it('no item', () => {
      const noMatchingThreshold = findMatchingThresholds(thresholds, null, 'airflow_status');
      expect(noMatchingThreshold).toHaveLength(0);
    });
  });

  describe('findMatchingAlertRange', () => {
    it('with out dataSourceId filter', () => {
      // Alert with out dataSourceId filter to provide backward compatibility
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
    it('with dataSourceId filter', () => {
      // alert with dataSourceId filter
      const data = {
        date: new Date(1573073951),
        dataSourceId: 'myDataSourceId1',
      };
      const alertRange = [
        {
          startTimestamp: 1573073950,
          endTimestamp: 1573073951,
          color: '#FF0000',
          details: 'Alert details 1',
          inputSource: {
            dataSourceIds: ['myDataSourceId1', 'myDataSourceId2'],
          },
        },
        {
          startTimestamp: 1573073950,
          endTimestamp: 1573073951,
          color: '#FF0000',
          details: 'Alert details 2',
          inputSource: {
            dataSourceIds: ['myDataSourceId3', 'myDataSourceId4'],
          },
        },
      ];
      const matchingAlertRange = findMatchingAlertRange(alertRange, data);
      expect(matchingAlertRange).toHaveLength(1);
      expect(matchingAlertRange[0].color).toEqual('#FF0000');
      expect(matchingAlertRange[0].details).toEqual('Alert details 1');
    });
    it('with and with out dataSourceId filter', () => {
      // alert with dataSourceId filter
      const data = {
        date: new Date(1573073951),
        dataSourceId: 'myDataSourceId1',
      };
      const alertRange = [
        {
          startTimestamp: 1573073950,
          endTimestamp: 1573073951,
          color: '#FF0000',
          details: 'Alert details 1',
          inputSource: {
            dataSourceIds: ['myDataSourceId1', 'myDataSourceId2'],
          },
        },
        {
          startTimestamp: 1573073950,
          endTimestamp: 1573073951,
          color: '#FF0000',
          details: 'Alert details 2',
          inputSource: {
            dataSourceIds: undefined,
          },
        },
        {
          startTimestamp: 1573073950,
          endTimestamp: 1573073951,
          color: '#FF0000',
          details: 'Alert details 3',
        },
      ];
      const matchingAlertRange = findMatchingAlertRange(alertRange, data);
      expect(matchingAlertRange).toHaveLength(3);
      expect(matchingAlertRange[0].color).toEqual('#FF0000');
      expect(matchingAlertRange[0].details).toEqual('Alert details 1');

      expect(matchingAlertRange[1].color).toEqual('#FF0000');
      expect(matchingAlertRange[1].details).toEqual('Alert details 2');
    });
  });

  describe('handleTooltip', () => {
    // handle edge case were there is no date data available for the tooltip to increase
    // branch testing coverage
    it('should not add date if missing', () => {
      const defaultTooltip = '<ul><li>existing tooltip</li></ul>';
      const updatedTooltip = handleTooltip([], defaultTooltip, [], 'Detected alert:');
      expect(updatedTooltip).toEqual(defaultTooltip);
    });
    it('should not throw error if dataOrHoveredElement is undefined', () => {
      const defaultTooltip = '<ul><li>existing tooltip</li></ul>';
      const updatedTooltip = handleTooltip(undefined, defaultTooltip, [], 'Detected alert:');
      expect(updatedTooltip).toEqual(defaultTooltip);
    });
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
});
