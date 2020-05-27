import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import { CARD_SIZES, BAR_CHART_TYPES, BAR_CHART_LAYOUTS } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { barChartData } from '../../utils/barChartDataSample';

import BarChartCard from './BarChartCard';

const COLORS = ['blue', 'red', 'green', 'yellow'];

storiesOf('Watson IoT Experimental/BarChartCard', module)
  .add('Simple bar - Vertical', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles by city')}
          id="simple-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            xLabel: 'Cities',
            yLabel: 'Particles',
            series: [
              {
                dataSourceId: 'particles',
                color: COLORS,
              },
            ],
            categoryDataSourceId: 'city',
            layout: BAR_CHART_LAYOUTS.VERTICAL,
          })}
          values={barChartData.quarters.filter(q => q.quarter === '2020-Q1')}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Simple bar - Horizontal', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles by city')}
          id="simple-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            xLabel: 'Cities',
            yLabel: 'Particles',
            series: [
              {
                dataSourceId: 'particles',
                color: {
                  Amsterdam: 'yellow',
                  'New York': 'yellow',
                  Bangkok: 'red',
                  'San Francisco': 'pink',
                },
              },
            ],
            categoryDataSourceId: 'city',
            layout: BAR_CHART_LAYOUTS.HORIZONTAL,
          })}
          values={barChartData.quarters.filter(a => a.quarter === '2020-Q1')}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Simple bar - Time series', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles over 4 days')}
          id="simple-time-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            layout: BAR_CHART_LAYOUTS.VERTICAL,
            xLabel: 'Date',
            yLabel: 'Particles',
            series: [
              {
                dataSourceId: 'particles',
                // colors: COLORS,
                label: 'Particles',
              },
            ],
            timeDataSourceId: 'timestamp',
          })}
          values={barChartData.timestamps.filter(t => t.city === 'Amsterdam')}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Grouped bar - Vertical', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles and temperature in cities')}
          id="grouped-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            type: BAR_CHART_TYPES.GROUPED,
            xLabel: 'Cities',
            yLabel: 'Total',
            series: [
              {
                dataSourceId: 'particles',
                label: 'Particles',
                color: 'blue',
              },
              {
                dataSourceId: 'temperature',
                label: 'Temperature',
              },
              {
                dataSourceId: 'emissions',
                label: 'Emissions',
              },
            ],
            categoryDataSourceId: 'city',
          })}
          values={barChartData.quarters.filter(a => a.quarter === '2020-Q1')}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Grouped bar - Horizontal', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles and temperature in cities')}
          id="grouped-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            type: BAR_CHART_TYPES.GROUPED,
            layout: BAR_CHART_LAYOUTS.HORIZONTAL,
            xLabel: 'Total',
            yLabel: 'Cities',
            series: [
              {
                dataSourceId: 'particles',
                label: 'Particles',
                color: {
                  Particles: 'yellow',
                  Temperature: 'purple',
                },
              },
              {
                dataSourceId: 'temperature',
                label: 'Temperature',
                // colors: COLORS,
              },
              {
                dataSourceId: 'emissions',
                label: 'Emissions',
              },
            ],
            categoryDataSourceId: 'city',
          })}
          values={barChartData.quarters.filter(a => a.quarter === '2020-Q2')}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Grouped bar - Time series', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles by city over time')}
          id="stacked-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            type: BAR_CHART_TYPES.STACKED,
            layout: BAR_CHART_LAYOUTS.VERTICAL,
            xLabel: 'Dates',
            yLabel: 'Total',
            series: [
              {
                dataSourceId: 'particles',
                // colors: COLORS,
              },
            ],
            timeDataSourceId: 'timestamp',
            categoryDataSourceId: 'city',
          })}
          values={barChartData.timestamps}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Stacked bar - Vertical', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles and temperature in cities')}
          id="stacked-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            type: BAR_CHART_TYPES.STACKED,
            layout: BAR_CHART_LAYOUTS.VERTICAL,
            xLabel: 'Cities',
            yLabel: 'Total',
            series: [
              {
                dataSourceId: 'particles',
                label: 'Particles',
                // colors: COLORS,
              },
              {
                dataSourceId: 'temperature',
                label: 'Temperature',
                // colors: COLORS,
              },
              {
                dataSourceId: 'emissions',
                label: 'Emission',
              },
            ],
            categoryDataSourceId: 'city',
          })}
          values={barChartData.quarters.filter(a => a.quarter === '2020-Q3')}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Stacked bar - Horizontal', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles and temperature in cities')}
          id="stacked-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            type: BAR_CHART_TYPES.STACKED,
            layout: BAR_CHART_LAYOUTS.HORIZONTAL,
            xLabel: 'Total',
            yLabel: 'Cities',
            series: [
              {
                dataSourceId: 'particles',
                label: 'Particles',
                // colors: COLORS,
              },
              {
                dataSourceId: 'temperature',
                label: 'Temperature',
                // colors: COLORS,
              },
              {
                dataSourceId: 'emissions',
                label: 'Emission',
              },
            ],
            categoryDataSourceId: 'city',
          })}
          values={barChartData.quarters.filter(a => a.quarter === '2020-Q4')}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Stacked bar - Time series', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles / emissions over 4 days')}
          id="stacked-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            type: BAR_CHART_TYPES.STACKED,
            layout: BAR_CHART_LAYOUTS.VERTICAL,
            xLabel: 'Dates',
            yLabel: 'Total',
            series: [
              {
                dataSourceId: 'particles',
                label: 'Particles',
                // colors: COLORS,
              },
              {
                dataSourceId: 'emissions',
                label: 'Emissions',
                // colors: COLORS,
              },
            ],
            timeDataSourceId: 'timestamp',
          })}
          values={barChartData.timestamps}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('No data', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUMWIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Particles and temperature in cities')}
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
                dataSourceId: 'particles',
                // colors: COLORS,
              },
            ],
            categoryDataSourceId: 'city',
            layout: BAR_CHART_LAYOUTS.VERTICAL,
          })}
          values={barChartData.quarters.filter(a => a.quarter === 'NOT_VALID')}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  });
