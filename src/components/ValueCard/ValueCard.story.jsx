import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object, boolean, number } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ValueCard from './ValueCard';

storiesOf('Watson IoT|ValueCard', module)
  .add('xsmall / basic', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Occupancy')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'occupancy',
                unit: '%',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ occupancy: number('occupancy', 88) }}
        />
      </div>
    );
  })
  .add('xsmall / long', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Occupancy')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'occupancy',
                unit: '%',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ occupancy: text('occupancy', 'Really really busy') }}
        />
      </div>
    );
  })
  .add('xsmall / units', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `150px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Occupancy')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'occupancy',
                unit: '%',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ occupancy: number('occupancy', 88) }}
        />
      </div>
    );
  })
  .add('xsmall / title', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Foot Traffic')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                label: 'Average',
                dataSourceId: 'footTraffic',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ footTraffic: number('footTraffic', 13572) }}
        />
      </div>
    );
  })
  .add('xsmall / trend down', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `150px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Foot Traffic')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'footTraffic',
                secondaryValue: { dataSourceId: 'trend', trend: 'down', color: 'red' },
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ footTraffic: number('footTraffic', 13572), trend: text('trend', '22%') }}
        />
      </div>
    );
  })
  .add('xsmall / trend up', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `150px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Alert Count')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'alerts',
                secondaryValue: { dataSourceId: 'trend', trend: 'up', color: 'green' },
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ alerts: number('alerts', 35), trend: number('trend', 12) }}
        />
      </div>
    );
  })
  .add('xsmall / thresholds (number, no icon)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Alert Count')}
          id="facilitycard"
          content={{
            attributes: [
              {
                dataSourceId: 'alertCount',
                thresholds: [
                  {
                    comparison: '>=',
                    value: 30,
                    color: 'red',
                  },
                  {
                    comparison: '<=',
                    value: 5,
                    color: 'green',
                  },
                  {
                    comparison: '<',
                    value: 30,
                    color: 'orange',
                  },
                ],
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{ alertCount: number('alertCount', 35) }}
        />
      </div>
    );
  })
  .add('xsmall / thresholds (number, icon)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Alert Count')}
          id="facilitycard"
          content={{
            attributes: [
              {
                dataSourceId: 'alertCount',
                thresholds: [
                  {
                    comparison: '<',
                    value: 5,
                    icon: 'checkmark',
                    color: 'green',
                  },
                ],
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{ alertCount: number('alertCount', 4) }}
        />
      </div>
    );
  })
  .add('xsmallwide / thresholds (string)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALLWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Status')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'status',
                thresholds: [
                  {
                    comparison: '=',
                    value: 'Healthy',
                    icon: 'checkmark',
                    color: 'green',
                  },
                  {
                    comparison: '=',
                    value: 'Unhealthy',
                    icon: 'close',
                    color: 'red',
                  },
                ],
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ status: text('status', 'Unhealthy') }}
        />
      </div>
    );
  })
  .add('xsmallwide / vertical 2', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALLWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Status')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'status',
                label: 'Status',
              },
              {
                dataSourceId: 'comfortLevel',
                label: 'Comfort level',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ status: text('status', 'Good'), comfortLevel: text('comfortLevel', 'Healthy') }}
        />
      </div>
    );
  })
  .add('xsmallwide / horizontal 2', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALLWIDE);
    return (
      <div style={{ width: `${number('cardWidth', 300)}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Status')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              {
                dataSourceId: 'status',
                label: 'Status',
              },
              {
                dataSourceId: 'comfortLevel',
                label: 'Comfort level',
                unit: 'feels',
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            status: text('status', 'Problem'),
            comfortLevel: text('comfortLevel', 'Healthy'),
          }}
        />
      </div>
    );
  })
  .add('small / vertical / single', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{ comfortLevel: number('comfortLevel', 89) }}
        />
      </div>
    );
  })
  .add('small / vertical / multiple', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
          }}
        />
      </div>
    );
  })
  .add('small / vertical /  2', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
          }}
        />
      </div>
    );
  })
  .add('small / vertical /  3', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: [
              {
                label: 'Comfort Level',
                dataSourceId: 'comfortLevel',
                unit: '%',
                thresholds: [
                  {
                    comparison: '>',
                    value: 80,
                    color: '#F00',
                    icon: 'warning',
                  },
                  {
                    comparison: '<',
                    value: 80,
                    color: '#5aa700',
                    icon: 'checkmark',
                  },
                ],
              },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
                thresholds: [
                  {
                    comparison: '>',
                    value: 80,
                    color: '#F00',
                    icon: 'warning',
                  },
                  {
                    comparison: '<',
                    value: 80,
                    color: '#5aa700',
                    icon: 'checkmark',
                  },
                ],
              },
              {
                label: 'Humidity',
                dataSourceId: 'humidity',
                unit: '˚F',
                precision: 1,
                thresholds: [
                  {
                    comparison: '>',
                    value: 80,
                    color: '#F00',
                    icon: 'warning',
                  },
                  {
                    comparison: '<',
                    value: 80,
                    color: '#5aa700',
                    icon: 'checkmark',
                  },
                ],
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', null),
            humidity: number('humidity', 76.7),
          }}
        />
      </div>
    );
  })
  .add('small / horizontal /  2', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `300px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
          }}
        />
      </div>
    );
  })
  .add('medium / horizontal /  3', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `300px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
          }}
        />
      </div>
    );
  })
  .add('large / vertical /  5', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: text('cardWidth', `300px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
              { label: 'Humidity', dataSourceId: 'humidity', unit: '%' },
              { label: 'Air Flow', dataSourceId: 'air_flow' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
            humidity: number('humidity', 50),
            air_flow: number('air_flow', 0.567),
          }}
        />
      </div>
    );
  })
  .add('tall / vertical /  6', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.TALL);
    return (
      <div style={{ width: text('cardWidth', `250px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
              { label: 'CPU', dataSourceId: 'cpu', unit: '%' },
              { label: 'Humidity', dataSourceId: 'humidity', unit: '%' },
              { label: 'Air flow', dataSourceId: 'air_flow', unit: '%' },
              { label: 'Air quality', dataSourceId: 'air_quality', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
            humidity: number('humidity', 76),
            cpu: number('cpu', 76),
            air_flow: number('air_flow', 76),
            air_quality: number('air_quality', 76),
          }}
        />
      </div>
    );
  })
  .add('wide / horizontal /  3', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: text('cardWidth', `300px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{
            attributes: object('attributes', [
              { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
              {
                label: 'Average Temperature',
                dataSourceId: 'averageTemp',
                unit: '˚F',
                precision: 1,
              },
              { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
            ]),
          }}
          breakpoint="lg"
          size={size}
          values={{
            comfortLevel: number('comfortLevel', 89),
            averageTemp: number('averageTemp', 76.7),
            utilization: number('utilization', 76),
          }}
        />
      </div>
    );
  })
  .add('with boolean', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Uncomfortable?')}
          id="facilitycard"
          content={{ attributes: [{ label: 'Monthly summary', dataSourceId: 'monthlySummary' }] }}
          breakpoint="lg"
          size={size}
          values={{ monthlySummary: boolean('monthlySummary', false) }}
        />
      </div>
    );
  })
  .add('empty state', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={{ attributes: [] }}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('long titles and values', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Really long card title?')}
          id="facilitycard"
          content={{
            attributes: [
              {
                label: 'Monthly summary',
                dataSourceId: 'monthlySummary',
                unit: text('unit', ''),
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{ monthlySummary: number('monthlySummary', 20000000000000000) }}
        />
      </div>
    );
  })
  .add('long titles and values/multiple', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Really really really long card title?')}
          id="facilitycard"
          content={{
            attributes: [
              {
                label: 'Monthly summary',
                dataSourceId: 'monthlySummary',
                unit: text('unit', 'Wh'),
              },
              {
                label: 'Yearly summary',
                dataSourceId: 'yearlySummary',
                unit: text('unit', 'Wh'),
              },
            ],
          }}
          breakpoint="lg"
          size={size}
          values={{
            monthlySummary: number('monthlySummary', 100000000),
            yearlySummary: number('yearlySummary', 40000000000000),
          }}
        />
      </div>
    );
  })
  .add('editable', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Really really really long card title?')}
          id="facilitycard"
          isEditable
          content={{
            attributes: [
              {
                label: 'Monthly summary',
                dataSourceId: 'monthlySummary',
                unit: text('unit', 'Wh'),
              },
              {
                label: 'Yearly summary',
                dataSourceId: 'yearlySummary',
                unit: text('unit', 'Wh'),
              },
            ],
          }}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  });
