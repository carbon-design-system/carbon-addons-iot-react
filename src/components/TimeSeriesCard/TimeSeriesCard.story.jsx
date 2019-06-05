import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import { COLORS, CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { chartData } from '../../utils/sample';

import TimeSeriesCard from './TimeSeriesCard';

storiesOf('TimeSeriesCard (Experimental)', module)
  .add('single line - no range', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    const field = 'temperature';
    const timeOffset = new Date().getTime() - chartData.dataItemToMostRecentTimestamp[field];
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            data: [
              {
                label: 'Temperature',
                values: chartData.events
                  .filter((i, idx) => idx < 20)
                  .map(i => ({
                    t: new Date(i.timestamp + timeOffset).toISOString(),
                    v: i[field],
                  })),
                color: COLORS.RED,
              },
            ],
          })}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('multi line - no range', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    const timeOffset = new Date().getTime() - chartData.dataItemToMostRecentTimestamp.temperature;
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Facility Metrics')}
          id="facility-multi"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            data: [
              {
                label: 'Temperature',
                values: chartData.events
                  .filter((i, idx) => idx < 20)
                  .map(i => ({
                    t: new Date(i.timestamp + timeOffset).toISOString(),
                    v: i.temperature,
                  })),
                color: COLORS.RED,
              },
              {
                label: 'Pressure',
                values: chartData.events
                  .filter((i, idx) => idx < 20)
                  .map(i => ({
                    t: new Date(i.timestamp + timeOffset).toISOString(),
                    v: i.pressure,
                  })),
                color: COLORS.BLUE,
              },
            ],
          })}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('single line - day', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    const field = 'temperature';
    const timeOffset = new Date().getTime() - chartData.dataItemToMostRecentTimestamp[field];
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            range: 'day',
            data: {
              label: 'Temperature',
              values: chartData.events.map(i => ({
                t: new Date(i.timestamp + timeOffset).toISOString(),
                v: i[field],
              })),
              color: COLORS.RED,
            },
          })}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('single line - week', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    const field = 'pressure';
    const timeOffset = new Date().getTime() - chartData.dataItemToMostRecentTimestamp[field];
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Pressure')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            range: 'week',
            data: {
              label: 'Pressure',
              values: chartData.events.map(i => ({
                t: new Date(i.timestamp + timeOffset).toISOString(),
                v: i[field],
              })),
              color: COLORS.BLUE,
            },
          })}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  });
