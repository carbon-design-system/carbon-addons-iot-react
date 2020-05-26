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
    series: [
      {
        dataSourceId: 'particles',
      },
    ],
    categoryDataSourceId: 'city',
    layout: BAR_CHART_LAYOUTS.VERTICAL,
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
              // colors: COLORS,
            },
            {
              dataSourceId: 'temperature',
              label: 'Temperature',
              // colors: COLORS,
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
  it('mapValuesToAxes returns axes for non-timebased group charts ', () => {
    // check horizontal layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.HORIZONTAL, 'city', null, BAR_CHART_TYPES.GROUPED)
    ).toEqual({
      bottomAxesMapsTo: 'value',
      leftAxesMapsTo: 'key',
    });
    // check vertical layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.VERTICAL, 'city', null, BAR_CHART_TYPES.GROUPED)
    ).toEqual({
      bottomAxesMapsTo: 'key',
      leftAxesMapsTo: 'value',
    });
  });
  it('mapValuesToAxes returns axes for timebased group charts ', () => {
    // check horizontal layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.HORIZONTAL, 'city', 'timestamp', BAR_CHART_TYPES.GROUPED)
    ).toEqual({
      bottomAxesMapsTo: 'value',
      leftAxesMapsTo: 'date',
    });
    // check vertical layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.VERTICAL, 'city', 'timestamp', BAR_CHART_TYPES.GROUPED)
    ).toEqual({
      bottomAxesMapsTo: 'date',
      leftAxesMapsTo: 'value',
    });
  });
  it('mapValuesToAxes returns axes for non-timebased and non-group charts AKA simple', () => {
    // check horizontal layout
    expect(
      mapValuesToAxes(BAR_CHART_LAYOUTS.HORIZONTAL, null, null, BAR_CHART_TYPES.SIMPLE)
    ).toEqual({
      bottomAxesMapsTo: 'value',
      leftAxesMapsTo: 'group',
    });
    // check vertical layout
    expect(mapValuesToAxes(BAR_CHART_LAYOUTS.VERTICAL, null, null, BAR_CHART_TYPES.SIMPLE)).toEqual(
      {
        bottomAxesMapsTo: 'group',
        leftAxesMapsTo: 'value',
      }
    );
  });
  it('formatChartData returns formatted data for group-based chart', () => {
    const series = [
      {
        dataSourceId: 'particles',
        label: 'Particles',
      },
    ];
    // check horizontal layout
    expect(
      formatChartData(
        series,
        barChartData.quarters.filter(a => a.quarter === '2020-Q3'),
        'city',
        null,
        BAR_CHART_TYPES.GROUPED
      )
    ).toEqual([
      {
        group: 'Particles',
        key: 'Amsterdam',
        value: 512,
      },
      {
        group: 'Particles',
        key: 'New York',
        value: 442,
      },
      {
        group: 'Particles',
        key: 'Bangkok',
        value: 397,
      },
      {
        group: 'Particles',
        key: 'San Francisco',
        value: 270,
      },
    ]);
  });
  it('formatChartData returns formatted data for time-based and group-based chart', () => {
    const series = [
      {
        dataSourceId: 'particles',
        label: 'Particles',
      },
      {
        dataSourceId: 'emissions',
        label: 'Emissions',
      },
    ];
    // check horizontal layout
    expect(
      formatChartData(
        series,
        barChartData.timestamps.filter(t => t.city === 'Amsterdam'),
        null,
        'timestamp',
        BAR_CHART_TYPES.STACKED
      )
    ).toEqual([
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Particles',
        key: 1581265425000,
        value: 447,
      },
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Emissions',
        key: 1581265425000,
        value: 120,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Particles',
        key: 1581351825000,
        value: 450,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Emissions',
        key: 1581351825000,
        value: 150,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Particles',
        key: 1581438225000,
        value: 512,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Emissions',
        key: 1581438225000,
        value: 170,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Particles',
        key: 1581524625000,
        value: 565,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Emissions',
        key: 1581524625000,
        value: 200,
      },
    ]);
  });
  it('formatChartData returns formatted data for simple, non-time and non-group chart', () => {
    const series = [
      {
        dataSourceId: 'particles',
      },
    ];
    // check horizontal layout
    expect(
      formatChartData(
        series,
        barChartData.quarters.filter(q => q.quarter === '2020-Q1'),
        'city',
        null,
        BAR_CHART_TYPES.SIMPLE
      )
    ).toEqual([
      {
        group: 'Amsterdam',
        value: 447,
      },
      {
        group: 'New York',
        value: 528,
      },
      {
        group: 'Bangkok',
        value: 435,
      },
      {
        group: 'San Francisco',
        value: 388,
      },
    ]);
  });
  it('formatChartData returns formatted data for time-based, non-group chart', () => {
    const series = [
      {
        dataSourceId: 'particles',
      },
    ];
    // check horizontal layout
    expect(
      formatChartData(
        series,
        barChartData.timestamps.filter(t => t.city === 'Amsterdam'),
        null,
        'timestamp',
        BAR_CHART_TYPES.SIMPLE
      )
    ).toEqual([
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'particles',
        value: 447,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'particles',
        value: 450,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'particles',
        value: 512,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'particles',
        value: 565,
      },
    ]);
  });
  it('formatColors returns correct format if color is string', () => {
    const series = [
      {
        dataSourceId: 'particles',
        color: 'blue',
        label: 'Particles',
      },
      {
        dataSourceId: 'temperature',
        color: 'yellow',
        label: 'Temperature',
      },
    ];

    expect(formatColors(series)).toEqual({
      identifier: 'group',
      scale: { Particles: 'blue', Temperature: 'yellow' },
    });
  });
  it('formatColors returns correct format if color is array', () => {
    const series = [
      {
        dataSourceId: 'particles',
        color: ['blue', 'red', 'green'],
        label: 'Particles',
      },
    ];

    const uniqueDatasetNames = ['Particles', 'Temperature', 'Emissions'];

    expect(formatColors(series, uniqueDatasetNames)).toEqual({
      identifier: 'group',
      scale: { Particles: 'blue', Temperature: 'red', Emissions: 'green' },
    });
  });
  it('formatColors returns correct format if color is object', () => {
    const series = [
      {
        dataSourceId: 'particles',
        color: { Particles: 'blue', Temperature: 'red' },
        label: 'Particles',
      },
      {
        dataSourceId: 'temperature',
        label: 'Temperature',
      },
    ];

    expect(formatColors(series)).toEqual({
      identifier: 'group',
      scale: { Particles: 'blue', Temperature: 'red' },
    });
  });
});
