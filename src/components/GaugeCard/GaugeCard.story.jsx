import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number, select, boolean } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';

import GaugeCard from './GaugeCard';

storiesOf('Watson IoT Experimental|GaugeCard', module).add('basic', () => {
  const content = {
    gauges: [
      {
        dataSourceId: 'usage',
        units: '%',
        minimumValue: 0,
        maximumValue: 100,
        color: 'orange',
        backgroundColor: '#e0e0e0',
        shape: 'circle',
        trend: {
          /** the key to load the trend value from the values object. */
          dataSourceId: 'usageTrend',
          color: text('Trend color', ''),
          trend: select('Trend', ['up', 'down'], 'up'),
        },
        thresholds: [
          {
            comparison: '>',
            value: 0,
            color: '#fa4d56', // red
            label: 'Poor',
          },
          {
            comparison: '>',
            value: 60,
            color: '#f1c21b', // yellow
            label: 'Fair',
          },
          {
            comparison: '>',
            value: 80,
            color: '#42be65', // green
            label: select('Threshold label (> 80%)', ['Good', null], 'Good'),
          },
        ],
      },
    ],
  };

  return (
    <div style={{ width: '142px', margin: 20 }}>
      <GaugeCard
        isLoading={boolean('Is loading', false)}
        tooltip={<p>Health - of floor 8</p>}
        id="GaugeCard"
        title={text('Text', 'Health')}
        size={CARD_SIZES.SMALL}
        values={{
          usage: number('Gauge value', 81),
          usageTrend: '12%',
        }}
        content={content}
      />
    </div>
  );
});
