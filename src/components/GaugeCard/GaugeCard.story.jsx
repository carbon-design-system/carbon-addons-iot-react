import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number, select, boolean } from '@storybook/addon-knobs';
import { layout05 } from '@carbon/layout';

import { CARD_SIZES, CARD_DATA_STATE } from '../../constants/LayoutConstants';
import { getDataStateProp } from '../Card/Card.story';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import GaugeCard from './GaugeCard';

storiesOf('Watson IoT Experimental/GaugeCard', module)
  .add('basic', () => {
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
      <div style={{ width: `${getCardMinSize('sm', CARD_SIZES.SMALL).x}px`, margin: layout05 }}>
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
  })
  .add('with data state no-data', () => {
    const myDataState = {
      type: select('dataState : Type', Object.keys(CARD_DATA_STATE), CARD_DATA_STATE.NO_DATA),
      ...getDataStateProp(),
    };
    const content = {
      gauges: [],
    };

    return (
      <div style={{ width: '252px', margin: layout05 }}>
        <GaugeCard
          isLoading={boolean('Is loading', false)}
          tooltip={<p>Health - of floor 8</p>}
          id="GaugeCard"
          title={text('Text', 'Health')}
          size={select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL)}
          values={{
            usage: number('Gauge value', 81),
            usageTrend: '12%',
          }}
          content={content}
          dataState={myDataState}
        />
        <div style={{ height: '150vh' }} />
      </div>
    );
  });
