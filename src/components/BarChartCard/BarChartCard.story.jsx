import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import { CARD_SIZES, BAR_CHART_TYPES, BAR_CHART_LAYOUTS } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { barChartData } from '../../utils/barChartDataSample';

import BarChartCard from './BarChartCard';

const COLORS = ['#d91e28', '#ff832c', '#fdd13a', '#feeaaa'];

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
            series: {
              labelDataSourceId: 'city',
              dataSourceId: 'particles',
              colors: COLORS,
            },
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
            series: {
              labelDataSourceId: 'city',
              dataSourceId: 'particles',
              colors: COLORS,
            },
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
            series: {
              labelDataSourceId: 'city',
              dataSourceId: 'particles',
              colors: COLORS,
            },
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
            series: {
              dataSourceId: 'particles',
              timeDataSourceId: 'timestamp',
              colors: COLORS,
            },
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
            series: {
              groupDataSourceId: 'quarter',
              labelDataSourceId: 'city',
              dataSourceId: 'particles',
              colors: COLORS,
            },
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
            series: {
              groupDataSourceId: 'quarter',
              labelDataSourceId: 'city',
              dataSourceId: 'particles',
              colors: COLORS,
            },
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
            series: {
              groupDataSourceId: 'quarter',
              labelDataSourceId: 'city',
              dataSourceId: 'particles',
              colors: COLORS,
            },
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
            series: {
              groupDataSourceId: 'quarter',
              labelDataSourceId: 'city',
              dataSourceId: 'particles',
              colors: COLORS,
            },
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
            xLabel: 'Particles',
            yLabel: 'Quarters',
            series: {
              groupDataSourceId: 'timestamp',
              labelDataSourceId: 'city',
              dataSourceId: 'particles',
              timeDataSourceId: 'timestamp',
              colors: COLORS,
            },
          })}
          values={barChartData.timestamps}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  });
