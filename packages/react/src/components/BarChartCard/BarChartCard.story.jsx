import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';
import { withReadme } from 'storybook-readme';

import { CARD_SIZES, BAR_CHART_TYPES, BAR_CHART_LAYOUTS } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { barChartData } from '../../utils/barChartDataSample';

import BarChartCard from './BarChartCard';
import README from './BarChartCard.md';

const COLORS = ['blue', 'red', 'green', 'yellow'];

const sizes = Object.keys(CARD_SIZES).filter(
  (size) => size.includes('MEDIUM') || size.includes('LARGE')
);

const layouts = Object.keys(BAR_CHART_LAYOUTS);

export default {
  title: __DEV__ ? '1 - Watson IoT/⚠️ BarChartCard' : '1 - Watson IoT/BarChartCard',
  parameters: {
    component: BarChartCard,
  },
};

export const SimpleBar = withReadme(README, () => {
  const size = select('size', sizes, CARD_SIZES.MEDIUMWIDE);

  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles by city')}
        id="simple-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={{
          ...object('content', {
            xLabel: 'Cities',
            yLabel: 'Particles',
            series: [
              {
                dataSourceId: 'particles',
                color: COLORS,
              },
            ],
            categoryDataSourceId: 'city',
            type: BAR_CHART_TYPES.SIMPLE,
            unit: 'P',
          }),
          layout: select('content.layout', layouts, BAR_CHART_LAYOUTS.VERTICAL),
        }}
        i18n={object('i18n', {
          noDataLabel: 'No data for this card.',
        })}
        values={
          boolean('with no data', false)
            ? []
            : barChartData.quarters.filter((a) => a.quarter === '2020-Q1')
        }
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={object('availableActions', { expand: true })}
      />
    </div>
  );
});

SimpleBar.story = {
  name: 'with simple bar',
};

export const SimpleBarTimeSeriesCustomDomainRange = withReadme(README, () => {
  const size = select('size', sizes, CARD_SIZES.MEDIUMWIDE);

  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles over 4 days')}
        id="simple-time-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={{
          ...object('content', {
            xLabel: 'Date',
            yLabel: 'Particles',
            series: [
              {
                dataSourceId: 'particles',

                label: 'Particles really long label to check trunc',
              },
            ],
            timeDataSourceId: 'timestamp',
            type: 'SIMPLE',
          }),
          layout: select('content.layout', layouts, BAR_CHART_LAYOUTS.VERTICAL),
          zoomBar: {
            enabled: boolean('content.zoomBar.enabled', false),
            axes: 'top',
            view: select('content.zoomBar.view', ['slider_view', 'graph_view'], 'slider_view'),
          },
        }}
        // key is a simple storybook hack to force the chart to re-render when zoomBar changes,
        // otherwise carbon-charts won't automatically re-render it (even in their own stories).
        key={`${boolean('content.zoomBar.enabled', false)}-${select(
          'content.layout',
          layouts,
          BAR_CHART_LAYOUTS.VERTICAL
        )}`}
        i18n={object('i18n', {
          noDataLabel: 'No data for this card.',
        })}
        domainRange={object('domainRange', [1581251825000, 1581524625000])}
        values={
          boolean('with no data', false)
            ? []
            : barChartData.timestamps.filter((t) => t.city === 'Amsterdam')
        }
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={object('availableActions', { expand: true, range: true })}
      />
    </div>
  );
});

SimpleBarTimeSeriesCustomDomainRange.story = {
  name: 'with simple bar of time series data and custom domainRange',
};

export const GroupedBar = withReadme(README, () => {
  const size = select('size', sizes, CARD_SIZES.MEDIUMWIDE);

  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles and temperature in cities')}
        id="grouped-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={{
          ...object('content', {
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
          }),
          layout: select('content.layout', layouts, BAR_CHART_LAYOUTS.VERTICAL),
        }}
        i18n={object('i18n', {
          noDataLabel: 'No data for this card.',
        })}
        values={
          boolean('with no data', false)
            ? []
            : barChartData.quarters.filter((a) => a.quarter === '2020-Q1')
        }
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={object('availableActions', { expand: true })}
      />
    </div>
  );
});

GroupedBar.story = {
  name: 'with grouped bar',
};

export const StackedBar = withReadme(README, () => {
  const size = select('size', sizes, CARD_SIZES.MEDIUMWIDE);

  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles and temperature in cities')}
        id="stacked-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={{
          ...object('content', {
            type: BAR_CHART_TYPES.STACKED,
            xLabel: 'Cities',
            yLabel: 'Total',
            series: [
              {
                dataSourceId: 'particles',
                label: 'Particles',
              },
              {
                dataSourceId: 'temperature',
                label: 'Temperature',
              },
              {
                dataSourceId: 'emissions',
                label: 'Emission',
              },
            ],
            categoryDataSourceId: 'city',
          }),
          layout: select('content.layout', layouts, BAR_CHART_LAYOUTS.VERTICAL),
        }}
        i18n={object('i18n', {
          noDataLabel: 'No data for this card.',
        })}
        values={
          boolean('with no data', false)
            ? []
            : barChartData.quarters.filter((a) => a.quarter === '2020-Q3')
        }
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={object('availableActions', { expand: true })}
      />
    </div>
  );
});

StackedBar.story = {
  name: 'with stacked bar',
};

export const StackedBarTimeSeries = withReadme(README, () => {
  const size = select('size', sizes, CARD_SIZES.MEDIUMWIDE);

  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles / emissions over 4 days')}
        id="stacked-horizontal-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={{
          type: BAR_CHART_TYPES.STACKED,
          xLabel: 'Dates',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
            },
            {
              dataSourceId: 'emissions',
              label: 'Emissions',
            },
          ],
          timeDataSourceId: 'timestamp',
          layout: select(`content.layout`, layouts, BAR_CHART_LAYOUTS.VERTICAL),
          zoomBar: {
            enabled: boolean('content.zoomBar.enabled', false),
            axes: 'top',
            view: select('content.zoomBar.view', ['slider_view', 'graph_view'], 'slider_view'),
          },
        }}
        // key is a simple storybook hack to force the chart to re-render when zoomBar changes,
        // otherwise carbon-charts won't automatically re-render it (even in their own stories).
        key={boolean('content.zoomBar.enabled', false) ? 'with zoombar' : 'without zoom bar'}
        i18n={object('i18n', {
          noDataLabel: 'No data for this card.',
        })}
        values={boolean('with no data', false) ? [] : barChartData.timestamps}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={object('availableActions', { expand: true, range: true })}
      />
    </div>
  );
});

StackedBarTimeSeries.story = {
  name: 'with stacked bar of time series data',
};

export const StackedBarTimeSeriesWithCategories = withReadme(README, () => {
  const size = select('size', sizes, CARD_SIZES.MEDIUMWIDE);

  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Particles by city over time')}
        id="stacked-horizontal-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpandable', false)}
        content={{
          type: BAR_CHART_TYPES.STACKED,
          xLabel: 'Dates',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
            },
          ],
          timeDataSourceId: 'timestamp',
          categoryDataSourceId: select('content.categoryDataSourceId', ['city'], 'city'),
          layout: select(`content.layout`, layouts, BAR_CHART_LAYOUTS.VERTICAL),
          zoomBar: {
            enabled: boolean('content.zoomBar.enabled', false),
            axes: 'top',
            view: select('content.zoomBar.view', ['slider_view', 'graph_view'], 'slider_view'),
          },
        }}
        // key is a simple storybook hack to force the chart to re-render when zoomBar changes,
        // otherwise carbon-charts won't automatically re-render it (even in their own stories).
        key={boolean('content.zoomBar.enabled', false) ? 'with zoombar' : 'without zoom bar'}
        i18n={object('i18n', {
          noDataLabel: 'No data for this card.',
        })}
        values={boolean('with no data', false) ? [] : barChartData.timestamps}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={object('availableActions', { expand: true, range: true })}
      />
    </div>
  );
});

StackedBarTimeSeriesWithCategories.story = {
  name: 'with stacked bar of time series data and categories',
};
