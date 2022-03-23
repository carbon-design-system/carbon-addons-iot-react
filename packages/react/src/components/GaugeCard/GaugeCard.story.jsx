import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, number, select, boolean } from '@storybook/addon-knobs';
import { layout05 } from '@carbon/layout';
import { gray20, yellow } from '@carbon/colors';

import { CARD_SIZES, CARD_DATA_STATE } from '../../constants/LayoutConstants';
import { getDataStateProp } from '../Card/Card.story';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import GaugeCard from './GaugeCard';

const getContent = () => ({
  gauges: [
    {
      dataSourceId: 'usage',
      units: '%',
      minimumValue: 0,
      maximumValue: 100,
      color: 'orange',
      backgroundColor: gray20,
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
          color: 'red', // red
          label: 'Poor',
        },
        {
          comparison: '>',
          value: 60,
          color: yellow, // yellow
          label: 'Fair',
        },
        {
          comparison: '>',
          value: 80,
          color: 'green', // green
          label: select('Threshold label (> 80%)', ['Good', null], 'Good'),
        },
      ],
    },
  ],
});

export default {
  title: '1 - Watson IoT/Card/GaugeCard',

  parameters: {
    component: GaugeCard,
  },
};

export const Basic = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
  const breakpoint = select('breakpoint', ['lg', 'md', 'sm', 'xs'], 'sm');
  return (
    <div
      style={{
        width: `${getCardMinSize(breakpoint, size).x}px`,
        margin: layout05,
      }}
    >
      <GaugeCard
        isLoading={boolean('Is loading', false)}
        tooltip={<p>Health - of floor 8</p>}
        id="GaugeCard"
        title={text('Text', 'Health')}
        size={size}
        breakpoint={breakpoint}
        values={{
          usage: number('Gauge value', 81),
          usageTrend: '12%',
        }}
        content={getContent()}
      />
    </div>
  );
};

Basic.storyName = 'basic';

export const MultipleGauges = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  const breakpoint = select('breakpoint', ['lg', 'md', 'sm', 'xs'], 'sm');
  return (
    <div
      style={{
        width: `${getCardMinSize(breakpoint, size).x}px`,
        margin: layout05,
      }}
    >
      <GaugeCard
        isLoading={boolean('Is loading', false)}
        tooltip={<p>Health - of floor 8</p>}
        id="GaugeCard"
        title={text('Text', 'Health')}
        size={size}
        breakpoint={breakpoint}
        values={{
          usage: number('Gauge value', 81),
          usageTrend: '12%',
          gaugeTwo: 32,
          gaugeTwoTrend: '23%',
          gaugeThree: 74,
          gaugeThreeTrend: '12%',
        }}
        content={{
          gauges: [
            {
              dataSourceId: 'usage',
              units: '%',
              minimumValue: 0,
              maximumValue: 100,
              color: 'orange',
              backgroundColor: gray20,
              shape: 'circle',
              trend: {
                /** the key to load the trend value from the values object. */
                dataSourceId: 'usageTrend',
                color: '',
                trend: 'up',
              },
              thresholds: [
                {
                  comparison: '>',
                  value: 0,
                  color: 'red', // red
                  label: 'Poor',
                },
                {
                  comparison: '>',
                  value: 60,
                  color: yellow, // yellow
                  label: 'Fair',
                },
                {
                  comparison: '>',
                  value: 80,
                  color: 'green', // green
                  label: select('Threshold label (> 80%)', ['Good', null], 'Good'),
                },
              ],
            },
            {
              dataSourceId: 'gaugeTwo',
              units: '%',
              minimumValue: 0,
              maximumValue: 100,
              color: 'orange',
              backgroundColor: gray20,
              shape: 'circle',
              trend: {
                /** the key to load the trend value from the values object. */
                dataSourceId: 'gaugeTwoTrend',
                color: '',
                trend: 'down',
              },
              thresholds: [
                {
                  comparison: '>',
                  value: 0,
                  color: 'red', // red
                  label: 'Poor',
                },
                {
                  comparison: '>',
                  value: 60,
                  color: yellow, // yellow
                  label: 'Fair',
                },
                {
                  comparison: '>',
                  value: 80,
                  color: 'green', // green
                  label: 'Good',
                },
              ],
            },
            {
              dataSourceId: 'gaugeThree',
              units: '%',
              minimumValue: 0,
              maximumValue: 100,
              color: 'orange',
              backgroundColor: gray20,
              shape: 'circle',
              trend: {
                /** the key to load the trend value from the values object. */
                dataSourceId: 'gaugeThreeTrend',
                color: '',
                trend: 'up',
              },
              thresholds: [
                {
                  comparison: '>',
                  value: 0,
                  color: 'red', // red
                  label: 'Poor',
                },
                {
                  comparison: '>',
                  value: 60,
                  color: yellow, // yellow
                  label: 'Fair',
                },
                {
                  comparison: '>',
                  value: 80,
                  color: 'green', // green
                  label: 'Good',
                },
              ],
            },
          ],
        }}
      />
    </div>
  );
};

MultipleGauges.storyName = 'with multiple gauges';

export const BasicWithExpand = () => {
  return (
    <div
      style={{
        width: `${getCardMinSize('sm', CARD_SIZES.SMALL).x}px`,
        margin: layout05,
      }}
    >
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
        isExpanded={false}
        availableActions={{
          expand: true,
        }}
        content={getContent()}
        onCardAction={action('Expand button clicked')}
      />
    </div>
  );
};

BasicWithExpand.storyName = 'basic with expand';

export const WithDataStateNoData = () => {
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
};

WithDataStateNoData.storyName = 'with data state no-data';
