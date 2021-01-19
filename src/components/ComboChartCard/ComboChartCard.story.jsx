import React from 'react';
import {
  boolean,
  withKnobs,
  object,
  select,
  text,
} from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import {
  comboEmptyData,
  comboEmptyOptions,
  comboLoadingData,
  comboLoadingOptions,
  comboData,
  comboDataOptions,
} from '../../utils/comboChartDataSample';

import ComboChartCard from './ComboChartCard';

const acceptableSizes = Object.keys(CARD_SIZES).filter(
  (size) => size.includes('MEDIUM') || size.includes('LARGE')
);

export default {
  title: 'Watson IoT/ComboChartCard',
  decorators: [withKnobs],

  parameters: {
    component: ComboChartCard,
  },
};

export const ComboChartCardEmpty = () => (
  <ComboChartCard
    id="combo-chart-1"
    values={comboEmptyData}
    options={comboEmptyOptions}
    size={select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE)}
    title={text('title', 'ComboChartCard Empty')}
    tooltip={<p>this is the external tooltip content</p>}
    isExpanded={boolean('isExpanded', false)}
    onCardAction={action('onCardAction')}
    availableActions={{ range: true, expand: true }}
  />
);

ComboChartCardEmpty.story = {
  name: 'empty',
};

export const ComboChartCardLoading = () => {
  return (
    <ComboChartCard
      id="combo-chart-1"
      values={comboLoadingData}
      options={comboLoadingOptions}
      size={select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE)}
      title={text('title', 'ComboChartCard Loading')}
      tooltip={<p>this is the external tooltip content</p>}
      isExpanded={boolean('isExpanded', false)}
      onCardAction={action('onCardAction')}
      availableActions={{ range: true, expand: true }}
    />
  );
};

ComboChartCardLoading.story = {
  name: 'loading',
};

export const ComboChartCardArea = () => (
  <ComboChartCard
    id="combo-chart-1"
    values={object('Chart Data', comboData)}
    options={object('Chart Options', comboDataOptions)}
    size={select('size', acceptableSizes, CARD_SIZES.MEDIUMWIDE)}
    title={text('title', 'ComboChartCard')}
    tooltip={<p>this is the external tooltip content</p>}
    isExpanded={boolean('isExpanded', false)}
    onCardAction={action('onCardAction')}
    availableActions={{ range: true, expand: true }}
  />
);

ComboChartCardArea.story = {
  name: 'Area and Line',
};
