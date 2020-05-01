import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';
import memoize from 'lodash/memoize';

import { COLORS, CARD_SIZES, TIME_SERIES_TYPES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { getIntervalChartData as getFakeData, chartData } from '../../utils/sample';

import TimeSeriesCard from './TimeSeriesCard';

const getIntervalChartData = memoize(getFakeData);

// need a timeOffset to make the data always show up
// const timeOffset = new Date().getTime() - Object.values(chartData.dataItemToMostRecentTimestamp)[0];
storiesOf('Watson IoT/TimeSeriesCard', module)
  .add('medium / single point - interval hour', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('hour', 1, { min: 10, max: 100 }, 100)}
          interval="hour"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add(
    'medium / single point - with variables',
    () => {
      const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
      return (
        <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
          <TimeSeriesCard
            title={text('title', 'Temperature {not-working}')}
            id="facility-temperature"
            isLoading={boolean('isLoading', false)}
            cardVariables={object('Variables', {
              'not-working': 'working',
            })}
            content={object('content', {
              series: [
                {
                  label: 'Temperature {not-working}',
                  dataSourceId: 'temperature',
                },
              ],
              xLabel: text('xLabel', 'Time {not-working}'),
              yLabel: text('yLabel', 'Temperature {not-working} (˚F)'),
              includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
              includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
              timeDataSourceId: 'timestamp',
            })}
            values={getIntervalChartData('hour', 1, { min: 10, max: 100 }, 100)}
            interval="hour"
            breakpoint="lg"
            size={size}
            onCardAction={action('onCardAction')}
          />
        </div>
      );
    },
    {
      info: {
        text: `
      # Passing variables
      To pass a variable into your card, identify a variable to be used by wrapping it in curly brackets.
      Make sure you have added a prop called 'cardVariables' to your card that is an object with key value pairs such that the key is the variable name and the value is the value to replace it with.
      Optionally you may use a callback as the cardVariables value that will be given the variable and the card as arguments.
      `,
      },
    }
  )
  .add('medium / single line - interval hour', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('hour', 10, { min: 10, max: 100 }, 100)}
          interval="hour"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('medium / single line - timeRange dayByHour', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],

            xLabel: text('xLabel', 'Time t'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 10, { min: 10, max: 100 }, 100)}
          availableActions={{ range: true }}
          interval="day"
          timeRange="last7Days"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('medium / single line - interval day (Week)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 12, { min: 10, max: 100 }, 100)}
          interval="day"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('medium / single line - interval day (Month)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],

            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 30, { min: 10, max: 100 }, 100)}
          interval="day"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('medium / single line - interval month (Year/ Same Year)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('month', 6, { min: 10, max: 100 }, 100)}
          interval="month"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('medium / multiple line - interval month (Year/ Same Year)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
              {
                label: 'Humidity',
                dataSourceId: 'humidity',
                // color: text('color', COLORS.PURPLE),
              },
              {
                label: 'Ecount',
                dataSourceId: 'ecount',
                // color: text('color', COLORS.PURPLE),
              },
              {
                label: 'Presurre',
                dataSourceId: 'pressure',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('month', 6, { min: 10, max: 100 }, 100)}
          interval="month"
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('medium / single line - interval year (Two data point)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('year', 2, { min: 10, max: 100 }, 100)}
          interval="year"
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('medium / multi line - (No X/Y Label)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.MAGENTA),
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
                // color: text('color', COLORS.TEAL),
              },
              {
                label: 'Humidity',
                dataSourceId: 'humidity',
                // color: text('color', COLORS.TEAL),
              },
              {
                label: 'Count',
                dataSourceId: 'ecount',
                // color: text('color', COLORS.TEAL),
              },
            ],
            xLabel: text('xLabel', ''),
            yLabel: text('yLabel', ''),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('minute', 12, { min: 10, max: 100 }, 100)}
          interval="hour"
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('large / single line - interval hour (Same day)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('minute', 15, { min: 10, max: 100 }, 100)}
          interval="hour"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('large / single line - interval day (Week)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 24, { min: 10, max: 100 }, 100)}
          interval="day"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('large / single line - interval day (Month)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 30, { min: 10, max: 100 }, 100)}
          interval="day"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('large / single line - interval month (Year/ Diff Year)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('month', 24, { min: 10, max: 100 }, 100)}
          interval="month"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('large / single line - year interval (One data point)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('year', 10, { min: 10, max: 100 }, 100)}
          interval="year"
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('large / multi line - no interval', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 12, { min: 10, max: 100 }, 100)}
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('large / multi line - (Custom color)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: COLORS.MAGENTA,
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
                color: COLORS.TEAL,
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('minute', 12, { min: 10, max: 100 }, 100)}
          interval="hour"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('large / multi line - (No X/Y Label)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: text('cardWidth', `${getCardMinSize('lg', size).x}px`), margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: text('color', COLORS.MAGENTA),
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
                color: text('color', COLORS.TEAL),
              },
            ],
            xLabel: text('xLabel', ''),
            yLabel: text('yLabel', ''),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('minute', 12, { min: 10, max: 100 }, 100)}
          interval="hour"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('large / units', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: text('color', COLORS.MAGENTA),
              },
            ],
            unit: '˚F',
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 10, { min: 10, max: 100 }, 100)}
          interval="day"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('largewide / multi line - (No X/Y Label)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGEWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: text('color', COLORS.MAGENTA),
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
                color: text('color', COLORS.TEAL),
              },
            ],
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('minute', 12, { min: 10, max: 100 }, 100)}
          interval="hour"
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('empty', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: COLORS.PURPLE,
              },
            ],
            timeDataSourceId: 'timestamp',
          })}
          interval="hour"
          breakpoint="lg"
          values={[]}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('highlight alert ranges', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    // console.log(getIntervalChartData('day', 30, { min: 10, max: 100 }, 100));
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
            alertRanges: [
              {
                startTimestamp: 1572313622000,
                endTimestamp: 1572486422000,
                color: '#FF0000',
                details: 'Alert name',
              },
              {
                startTimestamp: 1572313622000,
                endTimestamp: 1572824320000,
                color: '#FFFF00',
                details: 'Less severe',
              },
            ],
          })}
          values={getIntervalChartData('day', 100, { min: 10, max: 100 }, 100, 1572824320000)}
          interval="hour"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('empty for a range', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: COLORS.PURPLE,
              },
            ],
            timeDataSourceId: 'timestamp',
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
          })}
          range="day"
          interval="hour"
          breakpoint="lg"
          values={chartData.events.slice(0, 20)}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('lots of dots', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                // color: text('color', COLORS.PURPLE),
              },
            ],
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature (˚F)'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 100, { min: 10, max: 100 }, 100, 1572824320000)}
          interval="hour"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('isEditable', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isEditable={boolean('isEditable', true)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: COLORS.PURPLE,
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
                color: COLORS.MAGENTA,
              },
              {
                label: 'Humidity',
                dataSourceId: 'humidity',
                color: COLORS.TEAL,
              },
            ],
            xLabel: text('xLabel', 'Time'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          interval={select('interval', ['hour', 'day', 'week', 'month', 'year'], 'hour')}
          breakpoint="lg"
          values={[]}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('bar chart', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          key="bar chart"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: text('color', COLORS.MAGENTA),
              },
            ],
            unit: '˚F',
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
            chartType: TIME_SERIES_TYPES.BAR,
          })}
          values={getIntervalChartData('day', 12, { min: 10, max: 100 }, 100)}
          interval="day"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('dataFilter', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          key="dataFilter"
          id="facility-temperature"
          isEditable={boolean('isEditable', false)}
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature Device 1',
                dataSourceId: 'temperature',
                dataFilter: {
                  ENTITY_ID: 'Sensor2-1',
                },
                color: text('color1', COLORS.MAGENTA),
              },
              {
                label: 'Temperature Device 2',
                dataSourceId: 'temperature',
                dataFilter: {
                  ENTITY_ID: 'Sensor2-3',
                },
                color: text('color2', COLORS.BLUE),
              },
            ],
            unit: '˚F',
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Temperature'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 12, { min: 10, max: 100 }, 100).reduce(
            (acc, dataPoint) => {
              // make "two devices worth of data" so that we can filter
              acc.push(dataPoint);
              acc.push({
                ...dataPoint,
                temperature: dataPoint.temperature / 2,
                ENTITY_ID: 'Sensor2-3',
              });
              return acc;
            },
            []
          )}
          interval="day"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('locale', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Pressure')}
          id="facility-pressure"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            series: [
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
                color: text('color', COLORS.MAGENTA),
              },
            ],
            unit: 'm/sec',
            xLabel: text('xLabel', 'Time'),
            yLabel: text('yLabel', 'Pressure'),
            includeZeroOnXaxis: boolean('Include Zero On X-Axis', true),
            includeZeroOnYaxis: boolean('Include Zero On Y-Axis', true),
            timeDataSourceId: 'timestamp',
          })}
          locale={select('locale', ['fr', 'en'], 'fr')}
          values={getIntervalChartData('day', 12, { min: 10, max: 100000 }, 100)}
          interval="day"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  });
