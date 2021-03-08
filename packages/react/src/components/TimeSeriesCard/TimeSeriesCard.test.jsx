import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';

import Table from '../Table/Table';
import { getIntervalChartData } from '../../utils/sample';
import { CARD_SIZES, COLORS, TIME_SERIES_TYPES } from '../../constants/LayoutConstants';

import TimeSeriesCard from './TimeSeriesCard';

const timeSeriesCardProps = {
  title: 'Temperature',
  id: 'facility-temperature',
  isLoading: false,
  content: {
    series: [
      {
        label: 'Temp',
        dataSourceId: 'temperature',
        // color: text('color', COLORS.PURPLE),
      },
    ],
    xLabel: 'Time',
    yLabel: 'Temperature (˚F)',
    timeDataSourceId: 'timestamp',
  },
  values: getIntervalChartData('hour', 1, { min: 50, max: 100 }, 100),
  interval: 'hour',
  breakpoint: 'lg',
  size: 'LARGE',
  onCardAction: () => {},
};

describe('TimeSeriesCard', () => {
  it('does not show line chart when loading', () => {
    let wrapper = mount(
      <TimeSeriesCard {...timeSeriesCardProps} isLoading size={CARD_SIZES.MEDIUM} />
    );
    expect(wrapper.find('#mock-line-chart')).toHaveLength(0);
    expect(wrapper.find('SkeletonText')).toHaveLength(1);

    wrapper = mount(<TimeSeriesCard {...timeSeriesCardProps} size={CARD_SIZES.MEDIUM} />);
    expect(wrapper.find('#mock-line-chart')).toHaveLength(1);
    expect(wrapper.find('SkeletonText')).toHaveLength(0);
  });
  it('does not fail to render if no data is given', () => {
    // For whatever reason, these devices do not give back real data so the No data message
    // should render instead of the line graph
    const emptyValues = [{ deviceid: 'robot1' }, { deviceid: 'robot2' }];
    render(
      <TimeSeriesCard {...timeSeriesCardProps} values={emptyValues} size={CARD_SIZES.MEDIUM} />
    );

    expect(screen.getByText('No data is available for this time range.')).toBeInTheDocument();
  });
  it('shows table with data when expanded', () => {
    const wrapper = mount(
      <TimeSeriesCard {...timeSeriesCardProps} isExpanded size={CARD_SIZES.MEDIUMTHIN} />
    );
    expect(wrapper.find('#mock-line-chart')).toHaveLength(1);
    // Carbon Table should be there
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('type bar shows', () => {
    const wrapper = mount(
      <TimeSeriesCard
        {...timeSeriesCardProps}
        content={{
          ...timeSeriesCardProps.content,
          chartType: TIME_SERIES_TYPES.BAR,
        }}
        size={CARD_SIZES.MEDIUMTHIN}
      />
    );
    expect(wrapper.find('#mock-bar-chart-stacked')).toHaveLength(1);
  });

  it('show line chart when only 1 color is set', () => {
    const timeSeriesCardWithOneColorProps = {
      title: 'Temperature',
      id: 'facility-temperature',
      isLoading: false,
      content: {
        series: [
          {
            label: 'Temperature Device 1',
            dataSourceId: 'temperature',
            dataFilter: {
              ENTITY_ID: 'Sensor2-1',
            },
            color: COLORS.MAGENTA,
          },
          {
            label: 'Temperature Device 2',
            dataSourceId: 'temperature',
            dataFilter: {
              ENTITY_ID: 'Sensor2-3',
            },
            // no color set here
          },
        ],
        xLabel: 'Time',
        yLabel: 'Temperature (˚F)',
        timeDataSourceId: 'timestamp',
      },
      values: getIntervalChartData('day', 12, { min: 10, max: 100 }, 100).reduce(
        (acc, dataPoint) => {
          // make "two devices worth of data" so that we can filter
          acc.push(dataPoint);
          acc.push({
            ...dataPoint,
            temperature: dataPoint.temperature / 2,
            ENTITY_ID: 'Sensor2-3',
          });
          return acc;
        },
        []
      ),
      interval: 'hour',
      breakpoint: 'lg',
      size: 'LARGE',
      onCardAction: () => {},
    };
    const wrapper = mount(<TimeSeriesCard {...timeSeriesCardWithOneColorProps} />);
    expect(wrapper.find('#mock-line-chart')).toHaveLength(1);
  });

  it('tableColumn headers should use the label, not the dataSourceId', () => {
    render(<TimeSeriesCard {...timeSeriesCardProps} isExpanded size={CARD_SIZES.MEDIUM} />);

    // the dataSourceId is temperature so this should show the appreviated label Temp instead
    expect(screen.getByText('Temp')).toBeInTheDocument();
  });
});
