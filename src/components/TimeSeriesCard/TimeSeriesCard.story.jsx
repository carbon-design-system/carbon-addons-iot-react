import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';
import { spacing05 } from '@carbon/layout';

import { COLORS, CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { getIntervalChartData, chartData } from '../../utils/sample';

import TimeSeriesCard from './TimeSeriesCard';

// need a timeOffset to make the data always show up
// const timeOffset = new Date().getTime() - Object.values(chartData.dataItemToMostRecentTimestamp)[0];
storiesOf('Watson IoT/TimeSeriesCard', module)
  .add('single point', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    const interval = select(
      'interval',
      ['hour', 'day', 'week', 'quarter', 'month', 'year'],
      'hour'
    );
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData(interval, 1, { min: 10, max: 100 }, 100)}
          interval={interval}
          breakpoint="lg"
          size={size}
          showTimeInGMT={boolean('showTimeInGMT', false)}
          onCardAction={action('onCardAction')}
          tooltipDateFormatPattern={text('tooltipDateFormatPattern', 'L HH:mm:ss')}
        />
      </div>
    );
  })
  .add(
    'with variables',
    () => {
      const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
      const interval = select(
        'interval',
        ['hour', 'day', 'week', 'quarter', 'month', 'year'],
        'hour'
      );
      return (
        <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
          <TimeSeriesCard
            title={text('title', 'Temperature {not-working}')}
            id="facility-temperature"
            isLoading={boolean('isLoading', false)}
            isExpanded={boolean('isExpandable', false)}
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
              xLabel: 'Time {not-working}',
              yLabel: 'Temperature {not-working} (˚F)',
              includeZeroOnXaxis: true,
              includeZeroOnYaxis: true,
              timeDataSourceId: 'timestamp',
            })}
            values={getIntervalChartData(interval, 1, { min: 10, max: 100 }, 100)}
            interval={interval}
            showTimeInGMT={boolean('showTimeInGMT', false)}
            breakpoint="lg"
            size={size}
            onCardAction={action('onCardAction')}
            tooltipDateFormatPattern={text('tooltipDateFormatPattern', 'L HH:mm:ss')}
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
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('hour', 10, { min: 10, max: 100 }, 100)}
          domainRange={[new Date(), new Date()]}
          interval="hour"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
          tooltipDateFormatPattern={text('tooltipDateFormatPattern', 'L HH:mm:ss')}
        />
      </div>
    );
  })
  .add('medium / single line - custom domain', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    const data = getIntervalChartData('day', 50, { min: 10, max: 100 }, 100);
    const timestamps = data.map(d => d.timestamp);
    const minDate = new Date(Math.min(...timestamps));
    const day = minDate.getDay();
    minDate.setDate(day + 10);

    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time t',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={data}
          availableActions={{ range: true }}
          interval="hour"
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
          domainRange={[minDate.valueOf(), Math.max(...timestamps)]}
        />
      </div>
    );
  })
  .add('multi line - (No X/Y Label)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],

            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
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
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('month', 6, { min: 10, max: 100 }, 100, 1569945252000)}
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
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
              {
                label: 'Humidity',
                dataSourceId: 'humidity',
              },
              {
                label: 'Ecount',
                dataSourceId: 'ecount',
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('month', 6, { min: 10, max: 100 }, 100, 1569945252000)}
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
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
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
    const interval = select(
      'interval',
      ['hour', 'day', 'week', 'quarter', 'month', 'year'],
      'hour'
    );
    return (
      <div
        style={{
          width: text('cardWidth', `${getCardMinSize('lg', size).x}px`),
          margin: spacing05 + 4,
        }}
      >
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
              },
              {
                label: 'Humidity',
                dataSourceId: 'humidity',
              },
              {
                label: 'Count',
                dataSourceId: 'ecount',
              },
            ],
            xLabel: '',
            yLabel: '',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData(interval, 12, { min: 10, max: 100 }, 100)}
          interval={interval}
          showTimeInGMT={boolean('showTimeInGMT', false)}
          breakpoint="lg"
          size={size}
          tooltipDateFormatPattern={text('tooltipDateFormatPattern', 'L HH:mm:ss')}
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
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: false,
            includeZeroOnYaxis: false,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('minute', 15, { min: 4700000, max: 4800000 }, 100)}
          interval="minute"
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
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 7, { min: 10, max: 100 }, 100)}
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
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
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
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
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
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature',
            includeZeroOnXaxis: false,
            includeZeroOnYaxis: false,
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
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
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

  .add('custom colors', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    const interval = select(
      'interval',
      ['hour', 'day', 'week', 'quarter', 'month', 'year'],
      'hour'
    );
    return (
      <div
        style={{
          width: text('cardWidth', `${getCardMinSize('lg', size).x}px`),
          margin: spacing05 + 4,
        }}
      >
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
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
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData(interval, 12, { min: 10, max: 100 }, 100)}
          interval={interval}
          breakpoint="lg"
          showTimeInGMT={boolean('showTimeInGMT', false)}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('large / units', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: text('color', COLORS.MAGENTA),
              },
            ],
            unit: '˚F',
            xLabel: 'Time',
            yLabel: 'Temperature',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 10, { min: 10, max: 100 }, 100)}
          interval="day"
          breakpoint="lg"
          size={size}
          showTimeInGMT={boolean('showTimeInGMT', false)}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('empty', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
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
          showTimeInGMT={boolean('showTimeInGMT', false)}
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
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
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
          showTimeInGMT={boolean('showTimeInGMT', false)}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('empty for a range', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
                color: COLORS.PURPLE,
              },
            ],
            timeDataSourceId: 'timestamp',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
          })}
          range="day"
          interval="hour"
          breakpoint="lg"
          showTimeInGMT={boolean('showTimeInGMT', false)}
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
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Temperature',
                dataSourceId: 'temperature',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={getIntervalChartData('day', 100, { min: 10, max: 100 }, 100, 1572824320000)}
          interval="hour"
          breakpoint="lg"
          showTimeInGMT={boolean('showTimeInGMT', false)}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('isEditable', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isEditable={boolean('isEditable', true)}
          isExpanded={boolean('isExpandable', false)}
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
            xLabel: 'Time',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          interval={select('interval', ['hour', 'day', 'week', 'month', 'year'], 'hour')}
          breakpoint="lg"
          showTimeInGMT={boolean('showTimeInGMT', false)}
          values={[]}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('isExpanded', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    // needs static data so that the snapshot will always retain the same values
    const staticData = [
      {
        ENTITY_ID: 'Sensor2-1',
        temperature: 20,
        humidity: 5.51,
        ecount: 6,
        devname: '6ctgim0Qcq',
        pressure: 7.4,
        status: true,
        timestamp: 1569945252000,
      },
      {
        ENTITY_ID: 'Sensor2-1',
        temperature: 19,
        humidity: 7.36,
        ecount: 58,
        devname: '6ctgim0Qcq',
        pressure: 9.21,
        status: true,
        timestamp: 1567353252000,
      },
      {
        ENTITY_ID: 'Sensor2-1',
        temperature: 29,
        humidity: 3.32,
        ecount: 32,
        devname: '6ctgim0Qcq',
        pressure: 9.58,
        status: true,
        timestamp: 1564674852000,
      },
      {
        ENTITY_ID: 'Sensor2-1',
        temperature: 86,
        humidity: 2.98,
        ecount: 45,
        devname: '6ctgim0Qcq',
        pressure: 8.72,
        status: true,
        timestamp: 1561996452000,
      },
      {
        ENTITY_ID: 'Sensor2-1',
        temperature: 11,
        humidity: 9.25,
        ecount: 38,
        devname: '6ctgim0Qcq',
        pressure: 9.57,
        status: true,
        timestamp: 1559404452000,
      },
      {
        ENTITY_ID: 'Sensor2-1',
        temperature: 35,
        humidity: 8.15,
        ecount: 18,
        devname: '6ctgim0Qcq',
        pressure: 8.3,
        status: true,
        timestamp: 1556726052000,
      },
    ];
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          id="facility-temperature"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', true)}
          content={object('content', {
            series: [
              {
                label: 'Temp',
                dataSourceId: 'temperature',
              },
              {
                label: 'Humidity',
                dataSourceId: 'humidity',
              },
              {
                label: 'Electricity',
                dataSourceId: 'ecount',
              },
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
              },
            ],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          values={staticData}
          interval="month"
          breakpoint="lg"
          size={size}
        />
      </div>
    );
  })
  .add('dataFilter', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Temperature')}
          key="dataFilter"
          id="facility-temperature"
          isEditable={boolean('isEditable', false)}
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
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
            xLabel: 'Time',
            yLabel: 'Temperature',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
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
          showTimeInGMT={boolean('showTimeInGMT', false)}
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
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: spacing05 + 4 }}>
        <TimeSeriesCard
          title={text('title', 'Pressure')}
          id="facility-pressure"
          isLoading={boolean('isLoading', false)}
          isExpanded={boolean('isExpandable', false)}
          content={object('content', {
            series: [
              {
                label: 'Pressure',
                dataSourceId: 'pressure',
                color: text('color', COLORS.MAGENTA),
              },
            ],
            unit: 'm/sec',
            xLabel: 'Time',
            yLabel: 'Pressure',
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
          })}
          locale={select('locale', ['fr', 'en'], 'fr')}
          values={getIntervalChartData('day', 12, { min: 10, max: 100000 }, 100)}
          interval="day"
          breakpoint="lg"
          showTimeInGMT={boolean('showTimeInGMT', false)}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  });
