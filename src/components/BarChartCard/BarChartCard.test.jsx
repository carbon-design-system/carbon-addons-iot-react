import React from 'react';
import { mount } from 'enzyme';

import { barChartData } from '../../utils/barChartDataSample';
import { BAR_CHART_ORIENTATION, BAR_CHART_TYPES } from '../../constants/LayoutConstants';

import BarChartCard from './BarChartCard';

const barChartCardProps = {
  title: 'Sample',
  id: 'sample-bar-chart',
  isLoading: false,
  content: {
    xLabel: 'X Label',
    yLabel: 'Y Label',
    data: barChartData.simple,
    orientation: BAR_CHART_ORIENTATION.VERTICAL,
  },
  breakpoint: 'lg',
  size: 'LARGE',
  onCardAction: () => {},
};

describe('BarChartCard tests', () => {
  test('does not show bar chart when loading', () => {
    let wrapper = mount(<BarChartCard {...barChartCardProps} isLoading />);
    expect(wrapper.find('SimpleBarChart')).toHaveLength(0);

    wrapper = mount(<BarChartCard {...barChartCardProps} />);
    expect(wrapper.find('SimpleBarChart')).toHaveLength(1);
  });

  test('does not show bar chart when empty data', () => {
    let wrapper = mount(
      <BarChartCard {...barChartCardProps} content={{ data: barChartData.empty }} />
    );
    expect(wrapper.find('SimpleBarChart')).toHaveLength(0);

    wrapper = mount(<BarChartCard {...barChartCardProps} content={{ data: null }} />);
    expect(wrapper.find('SimpleBarChart')).toHaveLength(0);
  });

  test('shows groupedBarChart on grouped data', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{ data: barChartData.grouped, chartType: BAR_CHART_TYPES.GROUPED }}
      />
    );
    expect(wrapper.find('GroupedBarChart')).toHaveLength(1);
  });

  test('shows groupedBarChart on stacked data', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{ data: barChartData.stacked, chartType: BAR_CHART_TYPES.STACKED }}
      />
    );
    expect(wrapper.find('StackedBarChart')).toHaveLength(1);
  });

  test('shows a timeSeries chart', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{ data: barChartData.timeSeries, isTimeSeries: true }}
      />
    );
    expect(wrapper.find('SimpleBarChart')).toHaveLength(1);
  });

  test('shows a horizontal chart', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{
          data: barChartData.timeSeries,
          isTimeSeries: true,
          orientation: BAR_CHART_ORIENTATION.HORIZONTAL,
        }}
      />
    );
    expect(wrapper.find('SimpleBarChart')).toHaveLength(1);
  });
});
