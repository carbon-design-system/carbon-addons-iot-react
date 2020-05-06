import React from 'react';
import { mount } from 'enzyme';

import { barChartData } from '../../utils/barChartDataSample';
import { BAR_CHART_LAYOUTS, BAR_CHART_TYPES } from '../../constants/LayoutConstants';

import BarChartCard, { mapValuesToAxes, formatChartData, formatColors } from './BarChartCard';

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
  test('mapValuesToAxes returns axes for non-timebased group charts ', () => {
    const series = {
      groupDataSourceId: 'quarter',
      labelDataSourceId: 'city',
      dataSourceId: 'particles',
    };
    // check horizontal layout
    expect(mapValuesToAxes(series, BAR_CHART_LAYOUTS.HORIZONTAL)).toEqual({
      bottomAxesMapsTo: 'value',
      leftAxesMapsTo: 'key',
    });
    // check vertical layout
    expect(mapValuesToAxes(series, BAR_CHART_LAYOUTS.VERTICAL)).toEqual({
      bottomAxesMapsTo: 'key',
      leftAxesMapsTo: 'value',
    });
  });
  test('mapValuesToAxes returns axes for timebased group charts ', () => {
    const series = {
      groupDataSourceId: 'quarter',
      labelDataSourceId: 'city',
      dataSourceId: 'particles',
      timeDataSourceId: 'timestamp',
    };
    // check horizontal layout
    expect(mapValuesToAxes(series, BAR_CHART_LAYOUTS.HORIZONTAL)).toEqual({
      bottomAxesMapsTo: 'value',
      leftAxesMapsTo: 'date',
    });
    // check vertical layout
    expect(mapValuesToAxes(series, BAR_CHART_LAYOUTS.VERTICAL)).toEqual({
      bottomAxesMapsTo: 'date',
      leftAxesMapsTo: 'value',
    });
  });
  test('mapValuesToAxes returns axes for non-timebased and non-group charts AKA simple', () => {
    const series = {
      labelDataSourceId: 'city',
      dataSourceId: 'particles',
    };
    // check horizontal layout
    expect(mapValuesToAxes(series, BAR_CHART_LAYOUTS.HORIZONTAL)).toEqual({
      bottomAxesMapsTo: 'value',
      leftAxesMapsTo: 'group',
    });
    // check vertical layout
    expect(mapValuesToAxes(series, BAR_CHART_LAYOUTS.VERTICAL)).toEqual({
      bottomAxesMapsTo: 'group',
      leftAxesMapsTo: 'value',
    });
  });
  test('formatChartData returns formatted data for group-based chart', () => {
    const series = {
      groupDataSourceId: 'quarter',
      labelDataSourceId: 'city',
      dataSourceId: 'particles',
    };
    // check horizontal layout
    expect(formatChartData(series, barChartData.quarters)).toEqual([
      {
        group: 'Amsterdam',
        key: '2020-Q1',
        value: 44700,
      },
      {
        group: 'New York',
        key: '2020-Q1',
        value: 52800,
      },
      {
        group: 'Bangkok',
        key: '2020-Q1',
        value: 43500,
      },
      {
        group: 'San Francisco',
        key: '2020-Q1',
        value: 38800,
      },
      {
        group: 'Amsterdam',
        key: '2020-Q2',
        value: 45000,
      },
      {
        group: 'New York',
        key: '2020-Q2',
        value: 36500,
      },
      {
        group: 'Bangkok',
        key: '2020-Q2',
        value: 41000,
      },
      {
        group: 'San Francisco',
        key: '2020-Q2',
        value: 34100,
      },
      {
        group: 'Amsterdam',
        key: '2020-Q3',
        value: 51200,
      },
      {
        group: 'New York',
        key: '2020-Q3',
        value: 44200,
      },
      {
        group: 'Bangkok',
        key: '2020-Q3',
        value: 39700,
      },
      {
        group: 'San Francisco',
        key: '2020-Q3',
        value: 27000,
      },
      {
        group: 'Amsterdam',
        key: '2020-Q4',
        value: 56500,
      },
      {
        group: 'New York',
        key: '2020-Q4',
        value: 45300,
      },
      {
        group: 'Bangkok',
        key: '2020-Q4',
        value: 41200,
      },
      {
        group: 'San Francisco',
        key: '2020-Q4',
        value: 48900,
      },
    ]);
  });
  test('formatChartData returns formatted data for time-based and group-based chart', () => {
    const series = {
      groupDataSourceId: 'timestamp',
      labelDataSourceId: 'city',
      dataSourceId: 'particles',
      timeDataSourceId: 'timestamp',
    };
    // check horizontal layout
    expect(formatChartData(series, barChartData.timestamps)).toEqual([
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Amsterdam',
        key: 1581265425000,
        value: 44700,
      },
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'New York',
        key: 1581265425000,
        value: 52800,
      },
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Bangkok',
        key: 1581265425000,
        value: 43500,
      },
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'San Francisco',
        key: 1581265425000,
        value: 38800,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Amsterdam',
        key: 1581351825000,
        value: 45000,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'New York',
        key: 1581351825000,
        value: 36500,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Bangkok',
        key: 1581351825000,
        value: 41000,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'San Francisco',
        key: 1581351825000,
        value: 34100,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Amsterdam',
        key: 1581438225000,
        value: 51200,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'New York',
        key: 1581438225000,
        value: 44200,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Bangkok',
        key: 1581438225000,
        value: 39700,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'San Francisco',
        key: 1581438225000,
        value: 27000,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Amsterdam',
        key: 1581524625000,
        value: 56500,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'New York',
        key: 1581524625000,
        value: 45300,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Bangkok',
        key: 1581524625000,
        value: 41200,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'San Francisco',
        key: 1581524625000,
        value: 48900,
      },
    ]);
  });
  test('formatChartData returns formatted data for simple, non-time and non-group chart', () => {
    const series = {
      labelDataSourceId: 'city',
      dataSourceId: 'particles',
    };
    // check horizontal layout
    expect(formatChartData(series, barChartData.timestamps)).toEqual([
      {
        group: 'Amsterdam',
        value: 44700,
      },
      {
        group: 'Amsterdam',
        value: 45000,
      },
      {
        group: 'Amsterdam',
        value: 51200,
      },
      {
        group: 'Amsterdam',
        value: 56500,
      },
      {
        group: 'New York',
        value: 52800,
      },
      {
        group: 'New York',
        value: 36500,
      },
      {
        group: 'New York',
        value: 44200,
      },
      {
        group: 'New York',
        value: 45300,
      },
      {
        group: 'Bangkok',
        value: 43500,
      },
      {
        group: 'Bangkok',
        value: 41000,
      },
      {
        group: 'Bangkok',
        value: 39700,
      },
      {
        group: 'Bangkok',
        value: 41200,
      },
      {
        group: 'San Francisco',
        value: 38800,
      },
      {
        group: 'San Francisco',
        value: 34100,
      },
      {
        group: 'San Francisco',
        value: 27000,
      },
      {
        group: 'San Francisco',
        value: 48900,
      },
    ]);
  });
  test('formatChartData returns formatted data for time-based, non-group chart', () => {
    const series = {
      dataSourceId: 'particles',
      timeDataSourceId: 'timestamp',
    };
    // check horizontal layout
    expect(formatChartData(series, barChartData.timestamps)).toEqual([
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Particles',
        value: 44700,
      },
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Particles',
        value: 52800,
      },
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Particles',
        value: 43500,
      },
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Particles',
        value: 38800,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Particles',
        value: 45000,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Particles',
        value: 36500,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Particles',
        value: 41000,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Particles',
        value: 34100,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Particles',
        value: 51200,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Particles',
        value: 44200,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Particles',
        value: 39700,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Particles',
        value: 27000,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Particles',
        value: 56500,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Particles',
        value: 45300,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Particles',
        value: 41200,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Particles',
        value: 48900,
      },
    ]);
  });
  test('formatColors returns correct format if series is array', () => {
    const series = {
      dataSourceId: 'particles',
      timeDataSourceId: 'timestamp',
      colors: ['blue', 'yellow'],
    };
    const uniqueBarLabels = ['Amsterdam', 'New York'];

    expect(formatColors(series, uniqueBarLabels)).toEqual({
      identifier: 'group',
      scale: { Amsterdam: 'blue', 'New York': 'yellow' },
    });
  });
});
