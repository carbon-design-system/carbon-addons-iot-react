import React from 'react';
import { boolean, withKnobs, object, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { comboHealthData } from '../../utils/comboChartDataSample';
import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';

import ComboChartCard from './ComboChartCard';

const acceptableSizes = Object.keys(CARD_SIZES).filter(
  (size) => size.includes('MEDIUM') || size.includes('LARGE')
);

export const Experimental = () => <StoryNotice componentName="ComboChartCard" experimental />;
Experimental.storyName = experimentalStoryTitle;

export default {
  title: '2 - Watson IoT Experimental/☢️ ComboChartCard',
  decorators: [withKnobs],

  parameters: {
    component: ComboChartCard,
  },
  excludeStories: [],
};

/* Configuration details:
  comboChartTypes.correspondingDatasets should be an array containing the values of series.label
  This connects a dataset with a comboChartType.

  For instance:
   series: [{
      dataSourceId: 'health',
      label: 'Health',
    },
    {
      dataSourceId: 'age',
      label: 'Age',
    },
    {
      dataSourceId: 'condition',
      label: 'Condition',
    },
  ... ],
  comboChartTypes: [{
      type: 'area',
      correspondingDatasets: ['Health']
    },
    {
      type: 'line',
      correspondingDatasets: ['Age', 'Condition']
    },
  ]

  The above configuration snippet creates an area chart containing the data
  from the 'health' dataset, and line chart from the 'age' and 'condition datasets
*/

export const HealthDataAreaLine = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.LARGEWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <ComboChartCard
        title={text('title', 'Health history')}
        id="stacked-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpanded', false)}
        content={object('content', {
          xLabel: 'Date',
          yLabel: 'Score',
          series: [
            {
              dataSourceId: 'health',
              label: 'Health',
            },
            {
              dataSourceId: 'age',
              label: 'Age',
            },
            {
              dataSourceId: 'condition',
              label: 'Condition',
            },
            {
              dataSourceId: 'rul',
              label: 'RUL',
            },
          ],
          comboChartTypes: [
            {
              type: 'area',
              correspondingDatasets: ['Health'],
              options: {
                points: {
                  enabled: false,
                },
              },
            },
            {
              type: 'line',
              correspondingDatasets: ['Age', 'Condition', 'RUL'],
              points: {
                enabled: true,
              },
            },
          ],
          thresholds: [
            {
              value: 100,
              label: 'Custom label',
              fillColor: 'green',
            },
            {
              value: 70,
              fillColor: 'yellow',
            },
            {
              value: 33,
              fillColor: 'red',
            },
          ],
          includeZeroOnXaxis: true,
          includeZeroOnYaxis: true,
          curve: 'curveNatural',
          addSpaceOnEdges: 0,
          decimalPrecision: 0,
          timeDataSourceId: 'date',
          legend: {
            position: 'top',
          },
        })}
        values={comboHealthData}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true, range: true }}
      />
    </div>
  );
};

HealthDataAreaLine.storyName = 'Area/Line with health data';

export const ExpandedHealthDataAreaLine = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.LARGEWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <ComboChartCard
        title={text('title', 'Health history')}
        id="stacked-sample"
        isLoading={boolean('isLoading', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpanded', true)}
        content={object('content', {
          xLabel: 'Date',
          yLabel: 'Score',
          series: [
            {
              dataSourceId: 'health',
              label: 'Health',
            },
            {
              dataSourceId: 'age',
              label: 'Age',
            },
            {
              dataSourceId: 'condition',
              label: 'Condition',
            },
            {
              dataSourceId: 'rul',
              label: 'RUL',
            },
          ],
          comboChartTypes: [
            {
              type: 'area',
              correspondingDatasets: ['Health'],
              options: {
                points: {
                  enabled: false,
                },
              },
            },
            {
              type: 'line',
              correspondingDatasets: ['Age', 'Condition', 'RUL'],
              points: {
                enabled: true,
              },
            },
          ],
          thresholds: [
            {
              value: 100,
              label: 'Custom label',
              fillColor: 'green',
            },
            {
              value: 70,
              fillColor: 'yellow',
            },
            {
              value: 33,
              fillColor: 'red',
            },
          ],
          includeZeroOnXaxis: true,
          includeZeroOnYaxis: true,
          curve: 'curveNatural',
          addSpaceOnEdges: 0,
          decimalPrecision: 0,
          timeDataSourceId: 'date',
          legend: {
            position: 'top',
          },
        })}
        values={comboHealthData}
        size={size}
        onCardAction={action('onCardAction')}
        availableActions={{ expand: true, range: true }}
      />
    </div>
  );
};

ExpandedHealthDataAreaLine.storyName = 'Area/Line with expanded health data';

export const ComboChartCardEmpty = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <ComboChartCard
        id="combo-chart-1"
        values={[]}
        content={{}}
        size={size}
        title={text('title', 'ComboChartCard Empty')}
        tooltip={<p>this is the external tooltip content</p>}
        isExpanded={boolean('isExpanded', false)}
        onCardAction={action('onCardAction')}
        availableActions={{ range: true, expand: true }}
      />
    </div>
  );
};

ComboChartCardEmpty.storyName = 'empty';

export const ComboChartCardLoading = () => {
  const size = select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <ComboChartCard
        id="combo-chart-1"
        size={select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE)}
        title={text('title', 'ComboChartCard Loading')}
        tooltip={<p>this is the external tooltip content</p>}
        isLoading={boolean('isLoading', true)}
        isExpanded={boolean('isExpanded', false)}
        content={object('content', {
          xLabel: 'Date',
          yLabel: 'Score',
          series: [
            {
              dataSourceId: 'health',
              label: 'Health',
            },
            {
              dataSourceId: 'age',
              label: 'Age',
            },
            {
              dataSourceId: 'condition',
              label: 'Condition',
            },
            {
              dataSourceId: 'rul',
              label: 'RUL',
            },
          ],
          comboChartTypes: [
            {
              type: 'area',
              correspondingDatasets: ['Health'],
            },
            {
              type: 'line',
              correspondingDatasets: ['Age', 'Condition', 'RUL'],
            },
          ],
          includeZeroOnXaxis: true,
          includeZeroOnYaxis: true,
          addSpaceOnEdges: 0,
          timeDataSourceId: 'date',
        })}
        values={comboHealthData}
        onCardAction={action('onCardAction')}
      />
    </div>
  );
};

ComboChartCardLoading.storyName = 'loading';
