import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import {
  CARD_SIZES,
  BAR_CHART_TYPES,
  BAR_CHART_ORIENTATION,
} from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { barChartData } from '../../utils/barChartDataSample';

import BarChartCard from './BarChartCard';

storiesOf('Watson IoT Experimental|BarChartCard', module)
  .add('Simple bar', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="simple-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            xLabel: 'X Label',
            yLabel: 'Y Label',
            data: barChartData.simple,
          })}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('Simple bar with no data', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="simple-sample"
          isLoading={boolean('isLoading', false)}
          i18n={object('i18n', {
            noDataLabel: 'No data for this card.',
          })}
          content={object('content', {
            xLabel: 'X Label',
            yLabel: 'Y Label',
            data: barChartData.empty,
            hasLegend: false,
          })}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Simple bar (horizontal)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="simple-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            orientation: BAR_CHART_ORIENTATION.HORIZONTAL,
            xLabel: 'X Label',
            yLabel: 'Y Label',
            data: barChartData.simple,
          })}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Simple bar (time series)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="simple-time-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            isTimeSeries: true,
            orientation: BAR_CHART_ORIENTATION.VERTICAL,
            xLabel: 'X Label',
            yLabel: 'Y Label',
            data: barChartData.timeSeries,
          })}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Grouped bar', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="grouped-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.GROUPED,
            xLabel: 'X Label',
            yLabel: 'Y Label',
            data: barChartData.grouped,
          })}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Grouped bar (horizontal)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="grouped-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.GROUPED,
            orientation: BAR_CHART_ORIENTATION.HORIZONTAL,
            xLabel: 'X Label',
            yLabel: 'Y Label',
            data: barChartData.grouped,
          })}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Stacked bar', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="stacked-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.STACKED,
            xLabel: 'X Label',
            yLabel: 'Y Label',
            data: barChartData.stacked,
          })}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Stacked bar (horizontal)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="stacked-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.STACKED,
            orientation: BAR_CHART_ORIENTATION.HORIZONTAL,
            xLabel: 'X Label',
            yLabel: 'Y Label',
            data: barChartData.stacked,
          })}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })

  .add('Stacked bar (time series)', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <BarChartCard
          title={text('title', 'Sample')}
          id="stacked-horizontal-sample"
          isLoading={boolean('isLoading', false)}
          content={object('content', {
            chartType: BAR_CHART_TYPES.STACKED,
            isTimeSeries: true,
            xLabel: 'X Label',
            yLabel: 'Y Label',
            data: barChartData.stackedTimeSeries,
          })}
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  });
