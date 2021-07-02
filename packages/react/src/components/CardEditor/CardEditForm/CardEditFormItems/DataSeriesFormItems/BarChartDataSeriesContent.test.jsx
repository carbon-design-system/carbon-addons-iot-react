import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import BarChartDataSeriesContent from './BarChartDataSeriesContent';

const barChartConfig = {
  id: 'BarChart',
  title: 'BarChartCard',
  size: 'MEDIUM',
  type: 'BAR',
  content: {
    type: 'SIMPLE',
    series: [
      {
        label: 'Temperature',
        dataSourceId: 'temperature',
        color: 'red',
      },
    ],
    xLabel: 'Time',
    yLabel: 'Temperature (˚F)',
  },
};
const stackedBarChartConfig = {
  id: 'BarChart',
  title: 'BarChartCard',
  size: 'MEDIUM',
  type: 'BAR',
  content: {
    type: 'STACKED',
    series: [
      {
        label: 'Temperature',
        dataSourceId: 'temperature',
        color: 'red',
      },
    ],
    xLabel: 'Time',
    yLabel: 'Temperature (˚F)',
    timeDataSourceId: 'timestamp',
  },
};

const availableDimensions = {
  manufacturer: ['rentech', 'GHI Industries'],
};

const mockOnChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('BarChartDataSeriesContent', () => {
  it('Defaults the groupBy to "timestamp" when no category is defined in a non-grouped chart', () => {
    render(
      <BarChartDataSeriesContent
        cardConfig={barChartConfig}
        onChange={mockOnChange}
        translateWithId={jest.fn()}
      />
    );
    const defaultedGroupBy = screen.getByText('Time interval');
    expect(defaultedGroupBy).toBeInTheDocument();
  });
  it('Should not show subgroup if there are no available Dimensions', () => {
    render(
      <BarChartDataSeriesContent
        cardConfig={barChartConfig}
        onChange={mockOnChange}
        translateWithId={jest.fn()}
      />
    );
    const defaultedGroupBy = screen.queryByText('Sub-group');
    expect(defaultedGroupBy).toBeNull();
  });
  it('handles onChange function for groupBy', () => {
    render(
      <BarChartDataSeriesContent
        cardConfig={barChartConfig}
        onChange={mockOnChange}
        availableDimensions={availableDimensions}
        translateWithId={jest.fn()}
      />
    );
    const groupByField = screen.getByText('Time interval');
    expect(groupByField).toBeInTheDocument();
    fireEvent.click(groupByField);

    const manufacturerOption = screen.getByText('manufacturer');
    expect(manufacturerOption).toBeInTheDocument();
    fireEvent.click(manufacturerOption);

    expect(mockOnChange).toHaveBeenCalled();
  });
  it('handles onChange function for groupBy with initial value', () => {
    render(
      <BarChartDataSeriesContent
        cardConfig={{
          ...barChartConfig,
          content: {
            ...barChartConfig.content,
            categoryDataSourceId: 'manufacturer',
          },
        }}
        onChange={mockOnChange}
        availableDimensions={availableDimensions}
        translateWithId={jest.fn()}
      />
    );

    const groupByField = screen.getByText('manufacturer');
    expect(groupByField).toBeInTheDocument();
    fireEvent.click(groupByField);

    const timeIntervalOption = screen.getByText('Time interval');
    expect(timeIntervalOption).toBeInTheDocument();
    fireEvent.click(timeIntervalOption);

    expect(mockOnChange).toHaveBeenCalled();
  });
  it('handles onChange function for sub-groupBy in stacked charts', () => {
    render(
      <BarChartDataSeriesContent
        cardConfig={stackedBarChartConfig}
        onChange={mockOnChange}
        availableDimensions={availableDimensions}
        translateWithId={jest.fn()}
      />
    );

    const subGroupByField = screen.getByText('Select a category');
    expect(subGroupByField).toBeInTheDocument();
    fireEvent.click(subGroupByField);

    const manufacturerOption = screen.getByText('manufacturer');
    expect(manufacturerOption).toBeInTheDocument();
    fireEvent.click(manufacturerOption);

    expect(mockOnChange).toHaveBeenCalled();
  });
});
