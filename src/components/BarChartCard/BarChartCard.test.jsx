import React from 'react';
import { mount } from 'enzyme';

import Table from '../Table/Table';
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
    series: [
      {
        dataSourceId: 'particles',
      },
    ],
    categoryDataSourceId: 'city',
    layout: BAR_CHART_LAYOUTS.VERTICAL,
    type: BAR_CHART_TYPES.SIMPLE,
  },
  values: barChartData.quarters.filter(q => q.quarter === '2020-Q1'),
  breakpoint: 'lg',
  size: 'LARGE',
  onCardAction: () => {},
};

describe('BarChartCard', () => {
  it('does not show bar chart when loading', () => {
    let wrapper = mount(<BarChartCard {...barChartCardProps} isLoading />);
    expect(wrapper.find('SimpleBarChart')).toHaveLength(0);

    wrapper = mount(<BarChartCard {...barChartCardProps} />);
    expect(wrapper.find('SimpleBarChart')).toHaveLength(1);
  });

  it('does not show bar chart when empty data', () => {
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

  it('shows table and chart when isExpanded', () => {
    const wrapper = mount(<BarChartCard {...barChartCardProps} isExpanded />);
    expect(wrapper.find('SimpleBarChart')).toHaveLength(1);
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('shows groupedBarChart on grouped data', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{
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
          ],
          categoryDataSourceId: 'city',
        }}
        values={barChartData.quarters.filter(a => a.quarter === '2020-Q1')}
      />
    );
    expect(wrapper.find('GroupedBarChart')).toHaveLength(1);
  });

  it('shows stackedBarChart on stacked data', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
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
          ],
          categoryDataSourceId: 'city',
        }}
        values={barChartData.quarters.filter(a => a.quarter === '2020-Q3')}
      />
    );
    expect(wrapper.find('StackedBarChart')).toHaveLength(1);
  });

  it('shows a timeSeries chart', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{
          xLabel: 'Date',
          yLabel: 'Particles',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
            },
          ],
          timeDataSourceId: 'timestamp',
        }}
        values={barChartData.timestamps.filter(t => t.city === 'Amsterdam')}
      />
    );
    expect(wrapper.find('SimpleBarChart')).toHaveLength(1);
  });

  it('shows a horizontal chart', () => {
    const wrapper = mount(
      <BarChartCard
        {...barChartCardProps}
        content={{
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
        }}
        values={barChartData.quarters.filter(a => a.quarter === '2020-Q1')}
      />
    );
    expect(wrapper.find('SimpleBarChart')).toHaveLength(1);
  });
});
