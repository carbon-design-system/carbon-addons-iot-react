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
              value: 88,
              unit: '%',
            },
          ])}
          breakpoint="lg"
          size={size}
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
              title: 'Average',
              value: 13572,
            },
          ])}
          breakpoint="lg"
          size={size}
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
              value: 13572,
              secondaryValue: { value: '22%', trend: 'down', color: 'red' },
            },
          ])}
          breakpoint="lg"
          size={size}
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
              value: 35,
              secondaryValue: { value: '12', trend: 'up', color: 'green' },
            },
          ])}
          breakpoint="lg"
          size={size}
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
              value: number('value', 35),
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
        />
      </div>
    );
  })
  .add('xsmallwide / thresholds (number, icon)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALLWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ValueCard
          title={text('title', 'Alert Count')}
          id="facilitycard"
          content={[
            {
              value: number('value', 4),
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
          content={object('content', [
            {
              value: text('value', 'Unhealthy'),
              thresholds: [
                {
                  comparison: '=',
                  value: 'Healthy',
                  icon: 'icon--checkmark--solid',
                  color: 'green',
                },
                {
                  comparison: '=',
                  value: 'Unhealthy',
                  icon: 'icon--close--solid',
                  color: 'red',
                },
              ],
            },
          ])}
          breakpoint="lg"
          size={size}
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
          content={object('content', [{ title: 'Comfort Level', value: 89, unit: '%' }])}
          breakpoint="lg"
          size={size}
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
            { title: 'Comfort Level', value: 89, unit: '%' },
            { title: 'Average Temperature', value: 76.7, unit: '˚F', precision: 1 },
            { title: 'Utilization', value: 76, unit: '%' },
          ])}
          breakpoint="lg"
          size={size}
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
          content={[{ title: 'Monthly summary', value: boolean('value', false) }]}
          breakpoint="lg"
          size={size}
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
              title: 'Monthly summary',
              value: number('value', 20000000000000000),
              unit: text('unit', ''),
            },
          ]}
          breakpoint="lg"
          size={size}
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
              title: 'Monthly summary',
              value: number('value', 100000000),
              unit: text('unit', 'Wh'),
            },
            {
              title: 'Yearly summary',
              value: number('value', 40000000000000),
              unit: text('unit', 'Wh'),
            },
          ]}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  });
