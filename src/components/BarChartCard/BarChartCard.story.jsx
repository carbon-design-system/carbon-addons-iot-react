import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import { CARD_SIZES, BAR_CHART_TYPES, BAR_CHART_LAYOUTS } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { barChartData } from '../../utils/barChartDataSample';

import BarChartCard from './BarChartCard';

const COLORS = ['yellow', 'blue', 'red', 'green'];

storiesOf('Watson IoT Experimental/BarChartCard', module)
  .add('Simple bar', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="simple-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            xLabel: 'Cities',
            yLabel: 'Particles',
            series: [
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[0],
                label: 'Amsterdam',
                dataFilter: {
                  city: 'Amsterdam',
                },
              },
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[1],
                label: 'New York',
                dataFilter: {
                  city: 'New York',
                },
              },
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[2],
                label: 'Bangkok',
                dataFilter: {
                  city: 'Bangkok',
                },
              },
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[3],
                label: 'San Francisco',
                dataFilter: {
                  city: 'San Francisco',
                },
              },
            ],
          })}
          values={object('values', barChartData.quarters.filter(q => q.quarter === '2020-Q1'))}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Simple bar with no data', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="simple-sample-no-data"
          isLoading={boolean('isLoading', false)}
          i18n={object('i18n', {
            noDataLabel: 'No data for this card.',
          })}
          content={object('content', {
            xLabel: 'Cities',
            yLabel: 'Particles',
            series: [
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[0],
                label: 'Amsterdam',
                dataFilter: {
                  city: 'Amsterdam',
                },
              },
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[1],
                label: 'New York',
                dataFilter: {
                  city: 'New York',
                },
              },
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[2],
                label: 'Bangkok',
                dataFilter: {
                  city: 'Bangkok',
                },
              },
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[3],
                label: 'San Francisco',
                dataFilter: {
                  city: 'San Francisco',
                },
              },
            ],
          })}
          values={object('values', barChartData.quarters.filter(a => a.quarter === 'NOT_VALID'))}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Simple bar (horizontal)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="simple-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            layout: BAR_CHART_LAYOUTS.HORIZONTAL,
            xLabel: 'Cities',
            yLabel: 'Particles',
            series: [
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[0],
                label: 'Amsterdam',
                dataFilter: {
                  city: 'Amsterdam',
                },
              },
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[1],
                label: 'New York',
                dataFilter: {
                  city: 'New York',
                },
              },
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[2],
                label: 'Bangkok',
                dataFilter: {
                  city: 'Bangkok',
                },
              },
              {
                labelDataSourceId: 'city',
                dataSourceId: 'particles',
                color: COLORS[3],
                label: 'San Francisco',
                dataFilter: {
                  city: 'San Francisco',
                },
              },
            ],
          })}
          values={object('values', barChartData.quarters.filter(a => a.quarter === '2020-Q1'))}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Simple bar (time series)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="simple-time-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            layout: BAR_CHART_LAYOUTS.VERTICAL,
            xLabel: 'Date',
            yLabel: 'Particles',
            series: [
              {
                dataSourceId: 'particles',
                label: 'Particles',
              },
            ],
            timeDataSourceId: 'timestamp',
          })}
          values={object('values', barChartData.timestamps.filter(t => t.city === 'Amsterdam'))}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Grouped bar', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="grouped-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.GROUPED,
            xLabel: 'Quarters',
            yLabel: 'Particles',
            series: [
              {
                label: 'Amsterdam',
                dataSourceId: 'particles',
                dataFilter: { city: 'Amsterdam' },
              },
              {
                label: 'New York',
                dataSourceId: 'particles',
                dataFilter: { city: 'New York' },
              },
              {
                label: 'Bangkok',
                dataSourceId: 'particles',
                dataFilter: { city: 'Bangkok' },
              },
              {
                label: 'San Francisco',
                dataSourceId: 'particles',
                dataFilter: { city: 'San Francisco' },
              },
            ],
            groupDataSourceId: 'quarter',
          })}
          values={barChartData.quarters}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Grouped bar (horizontal)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="grouped-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.GROUPED,
            layout: BAR_CHART_LAYOUTS.HORIZONTAL,
            xLabel: 'Particles',
            yLabel: 'Quarters',
            series: [
              {
                label: 'Amsterdam',
                dataSourceId: 'particles',
                dataFilter: { city: 'Amsterdam' },
              },
              {
                label: 'New York',
                dataSourceId: 'particles',
                dataFilter: { city: 'New York' },
              },
              {
                label: 'Bangkok',
                dataSourceId: 'particles',
                dataFilter: { city: 'Bangkok' },
              },
              {
                label: 'San Francisco',
                dataSourceId: 'particles',
                dataFilter: { city: 'San Francisco' },
              },
            ],
            groupDataSourceId: 'quarter',
          })}
          values={barChartData.quarters}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Stacked bar', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="stacked-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.STACKED,
            xLabel: 'Quarters',
            yLabel: 'Particles',
            series: [
              {
                label: 'Amsterdam',
                dataSourceId: 'particles',
                dataFilter: { city: 'Amsterdam' },
              },
              {
                label: 'New York',
                dataSourceId: 'particles',
                dataFilter: { city: 'New York' },
              },
              {
                label: 'Bangkok',
                dataSourceId: 'particles',
                dataFilter: { city: 'Bangkok' },
              },
              {
                label: 'San Francisco',
                dataSourceId: 'particles',
                dataFilter: { city: 'San Francisco' },
              },
            ],
            groupDataSourceId: 'quarter',
          })}
          values={barChartData.quarters}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Stacked bar (horizontal)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="stacked-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.STACKED,
            layout: BAR_CHART_LAYOUTS.HORIZONTAL,
            xLabel: 'Particles',
            yLabel: 'Quarters',
            series: [
              {
                label: 'Amsterdam',
                dataSourceId: 'particles',
                dataFilter: { city: 'Amsterdam' },
              },
              {
                label: 'New York',
                dataSourceId: 'particles',
                dataFilter: { city: 'New York' },
              },
              {
                label: 'Bangkok',
                dataSourceId: 'particles',
                dataFilter: { city: 'Bangkok' },
              },
              {
                label: 'San Francisco',
                dataSourceId: 'particles',
                dataFilter: { city: 'San Francisco' },
              },
            ],
            groupDataSourceId: 'quarter',
          })}
          values={barChartData.quarters}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Stacked bar (time series)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="stacked-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.STACKED,
            xLabel: 'Dates',
            yLabel: 'Particles',
            series: [
              {
                label: 'Amsterdam',
                dataSourceId: 'particles',
                dataFilter: { city: 'Amsterdam' },
              },
              {
                label: 'New York',
                dataSourceId: 'particles',
                dataFilter: { city: 'New York' },
              },
              {
                label: 'Bangkok',
                dataSourceId: 'particles',
                dataFilter: { city: 'Bangkok' },
              },
              {
                label: 'San Francisco',
                dataSourceId: 'particles',
                dataFilter: { city: 'San Francisco' },
              },
            ],
            groupDataSourceId: 'quarter',
            timeDataSourceId: 'timestamp',
          })}
          values={barChartData.timestamps}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  });
