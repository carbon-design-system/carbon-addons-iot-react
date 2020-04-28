import React from 'react';
import { mount } from 'enzyme';

import Table from '../Table/Table';
import { getIntervalChartData } from '../../utils/sample';
import { CARD_SIZES, COLORS } from '../../constants/LayoutConstants';

import TimeSeriesCard, {
  determinePrecision,
  valueFormatter,
  handleTooltip,
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
  values: getIntervalChartData('hour', 1, { min: 50, max: 100 }, 100),
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
  test('shows table with data when expanded', () => {
    const wrapper = mount(<TimeSeriesCard {...timeSeriesCardProps} isExpanded />);
    expect(wrapper.find('LineChart')).toHaveLength(1);
    // Carbon Table should be there
    expect(wrapper.find(Table)).toHaveLength(1);
  });
  test('determine precision', () => {
    expect(determinePrecision(CARD_SIZES.LARGE, 700)).toEqual(0);
    expect(determinePrecision(CARD_SIZES.SMALL, 11.45)).toEqual(0);
    expect(determinePrecision(CARD_SIZES.SMALL, 1.45, 1)).toEqual(1);
    expect(determinePrecision(CARD_SIZES.LARGE, 1.45, 1)).toEqual(1);
  });
  test('valueFormatter', () => {
    // Small should get 3 precision
    expect(valueFormatter(0.23456, CARD_SIZES.LARGE, null)).toEqual('0.235');
    // default precision
    expect(valueFormatter(1.23456, CARD_SIZES.LARGE, null)).toEqual('1.2');
    // With units
    expect(valueFormatter(0.23456, CARD_SIZES.LARGE, 'writes per second')).toEqual(
      '0.235 writes per second'
    );

    // Large numbers!
    expect(valueFormatter(1500, CARD_SIZES.LARGE, null)).toEqual('2K');
    // nil
    expect(valueFormatter(null, CARD_SIZES.LARGE, null)).toEqual('--');
  });
  test('handleTooltip should add date', () => {
    const defaultTooltip = '<li>existing tooltip</li>';
    // the date is from 2017
    const updatedTooltip = handleTooltip(
      { date: 1500000000000 },
      defaultTooltip,
      [],
      'Detected alert:'
    );
    expect(updatedTooltip).not.toEqual(defaultTooltip);
    expect(updatedTooltip).toContain('<ul');
    expect(updatedTooltip).toContain('2017');
  });
  test('show line chart when only 1 color is set', () => {
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
    expect(wrapper.find('LineChart')).toHaveLength(1);
  });
});
