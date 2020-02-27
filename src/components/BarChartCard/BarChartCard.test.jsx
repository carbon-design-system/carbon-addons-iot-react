import React from 'react';
import { mount } from 'enzyme';

import { barChartData } from '../../utils/barChartDataSample';
import { BAR_CHART_LAYOUTS, BAR_CHART_TYPES } from '../../constants/LayoutConstants';

import BarChartCard from './BarChartCard';

const barChartCardProps = {
  title: 'Sample',
  id: 'sample-bar-chart',
  isLoading: false,
  content: {
    xLabel: 'Cities',
    yLabel: 'Particles',
    series: {
      labelDataSourceId: 'city',
      dataSourceId: 'particles',
    },
    layout: BAR_CHART_LAYOUTS.VERTICAL,
  },
  values: barChartData.quarters.filter(q => q.quarter === '2020-Q1'),
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
      <BarChartCard
        {...barChartCardProps}
        values={barChartData.quarters.filter(q => q.quarter === 'NOT_VALID')}
      />
    );
    expect(wrapper.find('SimpleBarChart')).toHaveLength(0);

    wrapper = mount(<BarChartCard {...barChartCardProps} values={null} />);
    expect(wrapper.find('SimpleBarChart')).toHaveLength(0);
  });

  test('shows groupedBarChart on grouped data', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{
          series: {
            groupDataSourceId: 'quarter',
            labelDataSourceId: 'city',
            dataSourceId: 'particles',
          },
          chartType: BAR_CHART_TYPES.GROUPED,
        }}
        values={barChartData.quarters}
      />
    );
    expect(wrapper.find('GroupedBarChart')).toHaveLength(1);
  });

  test('shows stackedBarChart on stacked data', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{
          series: {
            groupDataSourceId: 'quarter',
            labelDataSourceId: 'city',
            dataSourceId: 'particles',
          },
          chartType: BAR_CHART_TYPES.STACKED,
        }}
        values={barChartData.quarters}
      />
    );
    expect(wrapper.find('StackedBarChart')).toHaveLength(1);
  });

  test('shows a timeSeries chart', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{
          xLabel: 'Date',
          yLabel: 'Particles',
          series: {
            dataSourceId: 'particles',
            timeDataSourceId: 'timestamp',
          },
        }}
        values={barChartData.timestamps.filter(t => t.city === 'Amsterdam')}
      />
    );
    expect(wrapper.find('SimpleBarChart')).toHaveLength(1);
  });

  test('shows a horizontal chart', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{
          xLabel: 'Date',
          yLabel: 'Particles',
          series: {
            dataSourceId: 'particles',
            timeDataSourceId: 'timestamp',
          },
          layout: BAR_CHART_LAYOUTS.HORIZONTAL,
        }}
        values={barChartData.timestamps.filter(t => t.city === 'Amsterdam')}
      />
    );
    expect(wrapper.find('SimpleBarChart')).toHaveLength(1);
  });
});
