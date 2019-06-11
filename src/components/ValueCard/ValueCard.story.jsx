import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object, boolean, number } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ValueCard from './ValueCard';

storiesOf('ValueCard (Experimental)', module)
  .add('xsmall / basic', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Occupancy')}
          id="facilitycard"
          content={object('content', [
            {
              dataSourceId: 'occupancy',
              unit: '%',
            },
          ])}
          breakpoint="lg"
          size={size}
          values={{ occupancy: number('occupancy', 88) }}
        />
      </div>
    );
  })
  .add('xsmall / with title', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Foot Traffic')}
          id="facilitycard"
          content={object('content', [
            {
              label: 'Average',
              dataSourceId: 'footTraffic',
            },
          ])}
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
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Foot Traffic')}
          id="facilitycard"
          content={object('content', [
            {
              dataSourceId: 'footTraffic',
              secondaryValue: { dataSourceId: 'trend', trend: 'down', color: 'red' },
            },
          ])}
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
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Alert Count')}
          id="facilitycard"
          content={object('content', [
            {
              dataSourceId: 'alerts',
              secondaryValue: { dataSourceId: 'trend', trend: 'up', color: 'green' },
            },
          ])}
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
          content={[
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
          ]}
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
          content={[
            {
              dataSourceId: 'alertCount',
              thresholds: [
                {
                  comparison: '<',
                  value: 5,
                  icon: 'icon--checkmark--solid',
                  color: 'green',
                },
              ],
            },
          ]}
          breakpoint="lg"
          size={size}
          values={{ alertCount: number('alertCount', 4) }}
        />
      </div>
    );
  })
  .add('xsmall / thresholds (string)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Status')}
          id="facilitycard"
          content={object('content', [
            {
              dataSourceId: 'status',
              thresholds: [
                {
                  comparison: '=',
                  value: 'Good',
                  icon: 'icon--checkmark--solid',
                  color: 'green',
                },
                {
                  comparison: '=',
                  value: 'Bad',
                  icon: 'icon--close--solid',
                  color: 'red',
                },
              ],
            },
          ])}
          breakpoint="lg"
          size={size}
          values={{ status: text('status', 'Bad') }}
        />
      </div>
    );
  })
  .add('small / single', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={object('content', [
            { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
          ])}
          breakpoint="lg"
          size={size}
          values={{ comfortLevel: number('comfortLevel', 89) }}
        />
      </div>
    );
  })
  .add('small / multiple', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <ValueCard
          title={text('title', 'Facility Conditions')}
          id="facilitycard"
          content={object('content', [
            { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
            { label: 'Average Temperature', dataSourceId: 'averageTemp', unit: '˚F', precision: 1 },
            { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
          ])}
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
          content={[{ label: 'Monthly summary', dataSourceId: 'monthlySummary' }]}
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
          content={[]}
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
          content={[
            {
              label: 'Monthly summary',
              dataSourceId: 'monthlySummary',
              unit: text('unit', ''),
            },
          ]}
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
          content={[
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
          ]}
          breakpoint="lg"
          size={size}
          values={{
            monthlySummary: number('monthlySummary', 100000000),
            yearlySummary: number('yearlySummary', 40000000000000),
          }}
        />
      </div>
    );
  });
