import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import TimeSeriesCard from './TimeSeriesCard';
import { timeSeriesSample } from './sample';

storiesOf('TimeSeriesCard (Experimental)', module)
  .add('single line - no range', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    const field = 'temperature';
    const timeOffset = new Date().getTime() - timeSeriesSample.dataItemToMostRecentTimestamp[field];
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          content={object('content', {
            data: {
              label: 'Temperature',
              values: timeSeriesSample.events.map(i => ({
                t: new Date(i.timestamp + timeOffset).toISOString(),
                v: i[field],
              })),
            },
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
    const timeOffset = new Date().getTime() - timeSeriesSample.dataItemToMostRecentTimestamp[field];
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          content={object('content', {
            range: 'day',
            data: {
              label: 'Temperature',
              values: timeSeriesSample.events.map(i => ({
                t: new Date(i.timestamp + timeOffset).toISOString(),
                v: i[field],
              })),
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
    const timeOffset = new Date().getTime() - timeSeriesSample.dataItemToMostRecentTimestamp[field];
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Pressure')}
          id="facility-temperature"
          content={object('content', {
            range: 'week',
            data: {
              label: 'Pressure',
              values: timeSeriesSample.events.map(i => ({
                t: new Date(i.timestamp + timeOffset).toISOString(),
                v: i[field],
              })),
            },
          })}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  });
