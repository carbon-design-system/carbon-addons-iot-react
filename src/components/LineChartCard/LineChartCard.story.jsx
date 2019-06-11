import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import { COLORS, CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { chartData } from '../../utils/sample';

import LineChartCard from './LineChartCard';

// need a timeOffset to make the data always show up
const timeOffset = new Date().getTime() - Object.values(chartData.dataItemToMostRecentTimestamp)[0];
storiesOf('LineChartCard (Experimental)', module)
  .add('single line - no range', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <LineChartCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: {
              label: 'Temperature',
              descriptionLabel: 'Actual Temperature',
              dataSourceId: 'temperature',
              color: text('color', COLORS.PURPLE),
            },
            xLabel: text('xLabel', 'X Axis'),
            yLabel: text('yLabel', 'Y Axis'),
            timeDataSourceId: 'timestamp',
          })}
          values={chartData.events}
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('multi line - no range', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <LineChartCard
          title={text('title', 'Facility Metrics')}
          id="facility-multi"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                descriptionLabel: 'Actual Temperature',
                dataSourceId: 'temperature',
                color: COLORS.PURPLE,
              },
              {
                label: 'Pressure',
                descriptionLabel: 'Actual Pressure',
                dataSourceId: 'pressure',
                color: COLORS.TEAL,
              },
            ],
            timeDataSourceId: 'timestamp',
            xLabel: text('xLabel', 'X Axis'),
            yLabel: text('yLabel', 'Y Axis'),
          })}
          breakpoint="lg"
          values={chartData.events}
          size={size}
        />
      </div>
    );
  })
  .add('single line - day', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <LineChartCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: {
              label: 'Temperature',
              dataSourceId: 'temperature',
              color: COLORS.PURPLE,
            },
            timeDataSourceId: 'timestamp',
          })}
          range="day"
          breakpoint="lg"
          // Need to update the values to have recent dates
          values={chartData.events.map(data => ({
            ...data,
            timestamp: data.timestamp + timeOffset,
          }))}
          size={size}
        />
      </div>
    );
  })
  .add('single line - week', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <LineChartCard
          title={text('title', 'Pressure')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          range="week"
          content={object('content', {
            series: {
              label: 'Pressure',
              dataSourceId: 'pressure',
              color: COLORS.MAGENTA,
            },
            timeDataSourceId: 'timestamp',
          })}
          breakpoint="lg"
          // Need to update the values to have recent dates
          values={chartData.events.map(data => ({
            ...data,
            timestamp: data.timestamp + timeOffset,
          }))}
          size={size}
        />
      </div>
    );
  })
  .add('empty', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <LineChartCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: {
              label: 'Temperature',
              dataSourceId: 'temperature',
              color: COLORS.PURPLE,
            },
            timeDataSourceId: 'timestamp',
          })}
          range="day"
          breakpoint="lg"
          values={[]}
          size={size}
        />
      </div>
    );
  })
  .add('empty for a range', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <LineChartCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: {
              label: 'Temperature',
              dataSourceId: 'temperature',
              color: COLORS.PURPLE,
            },
            timeDataSourceId: 'timestamp',
          })}
          range="day"
          breakpoint="lg"
          values={chartData.events}
          size={size}
        />
      </div>
    );
  });
