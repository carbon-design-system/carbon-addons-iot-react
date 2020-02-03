import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';

import GaugeCard from './GaugeCard';

const content = {
  gauges: [
    {
      dataSourceId: 'usage',
      units: '%',
      minimumValue: 0,
      maximumValue: 100,
      color: 'orange',
      backgroundColor: 'gray',
      shape: 'half-circle',
      trend: {
        /** the key to load the trend value from the values object. */
        dataSourceId: 'usageTrend',
        color: 'green',
        trend: 'up',
      },
      thresholds: [
        {
          comparison: '>',
          value: 0,
          color: '#fa4d56', // red
          label: 'poor',
        },
        {
          comparison: '>',
          value: 60,
          color: '#f1c21b', // yellow
          label: 'fair',
        },
        {
          comparison: '>',
          value: 60,
          color: '#42be65', // green
          label: 'good',
        },
      ],
    },
  ],
};
const data = {
  usage: 68,
  usageTrend: 12,
};

storiesOf('Watson IoT Experimental|GaugeCard', module).add('basic', () => {
  return (
    <div style={{ width: '142px', margin: 20 }}>
      <GaugeCard
        id="GaugeCard"
        title={text('Text', 'Health')}
        size={CARD_SIZES.XSMALL}
        values={data}
        content={content}
      />
    </div>
  );
});
