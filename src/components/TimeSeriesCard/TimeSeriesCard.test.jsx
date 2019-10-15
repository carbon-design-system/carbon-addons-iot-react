import React from 'react';
import { mount } from 'enzyme';

import { getIntervalChartData } from '../../utils/sample';
import { CARD_SIZES } from '../../constants/LayoutConstants';

/* eslint-disable */
import TimeSeriesCard, {
  determineHeight,
  determinePrecision,
  formatChartData,
  valueFormatter,
} from './TimeSeriesCard';

const timeSeriesCardProps = {
  title: 'Temperature',
  id: 'facility-temperature',
  isLoading: false,
  content: {
    series: [
      {
        label: 'Temperature',
        dataSourceId: 'temperature',
        // color: text('color', COLORS.PURPLE),
      },
    ],
    xLabel: 'Time',
    yLabel: 'Temperature (˚F)',
    timeDataSourceId: 'timestamp',
  },
  values: getIntervalChartData('hour', 1, { min: 10, max: 100 }, 100),
  interval: 'hour',
  breakpoint: 'lg',
  size: 'LARGE',
  onCardAction: () => {},
};

describe('TimeSeriesCard tests', () => {
  test('does not show line chart when loading', () => {
    let wrapper = mount(<TimeSeriesCard {...timeSeriesCardProps} isLoading />);
    expect(wrapper.find('LineChart')).toHaveLength(0);

    wrapper = mount(<TimeSeriesCard {...timeSeriesCardProps} />);
    expect(wrapper.find('LineChart')).toHaveLength(1);
  });

  test('determine height', () => {
    expect(determineHeight(CARD_SIZES.LARGE, 700)).toEqual('90%');
    expect(determineHeight(CARD_SIZES.LARGE, 500)).toEqual('100%');
    expect(determineHeight(CARD_SIZES.MEDIUM, 700)).toEqual('90%');
    expect(determineHeight(CARD_SIZES.XLARGE, 700)).toEqual('90%');
    expect(determineHeight('default', 700)).toEqual('100%');
  });

  test('determine precision', () => {
    expect(determinePrecision(CARD_SIZES.LARGE, 700)).toEqual(0);
    expect(determinePrecision(CARD_SIZES.XSMALL, 11.45)).toEqual(0);
    expect(determinePrecision(CARD_SIZES.XSMALL, 1.45, 1)).toEqual(1);
    expect(determinePrecision(CARD_SIZES.LARGE, 1.45, 1)).toEqual(1);
  });
});
