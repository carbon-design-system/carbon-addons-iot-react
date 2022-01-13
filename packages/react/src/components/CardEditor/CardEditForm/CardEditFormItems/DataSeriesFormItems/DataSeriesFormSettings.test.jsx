import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DataSeriesFormSettings from './DataSeriesFormSettings';

const timeSeriesConfig = {
  id: 'timeSeries',
  title: 'TimeSeries',
  size: 'MEDIUM',
  type: 'TIMESERIES',
  content: {
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

const mockOnChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('DataSeriesFormSettings', () => {
  it('handles onChange function for including zeros on Xaxis', () => {
    render(<DataSeriesFormSettings cardConfig={timeSeriesConfig} onChange={mockOnChange} />);
    const includeZeroOnXaxisField = screen.getByTestId('includeZeroOnXaxis-toggle');
    expect(includeZeroOnXaxisField).toBeInTheDocument();
    fireEvent.click(includeZeroOnXaxisField);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...timeSeriesConfig,
      content: { ...timeSeriesConfig.content, includeZeroOnXaxis: true },
    });

    const includeZeroOnYaxisField = screen.getByTestId('includeZeroOnYaxis-toggle');
    expect(includeZeroOnYaxisField).toBeInTheDocument();
    fireEvent.click(includeZeroOnYaxisField);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...timeSeriesConfig,
      content: { ...timeSeriesConfig.content, includeZeroOnYaxis: true },
    });
  });

  it('handles decimal precision onChange', () => {
    render(<DataSeriesFormSettings cardConfig={timeSeriesConfig} onChange={mockOnChange} />);
    const decimalPrecisionInput = screen.getByLabelText('Decimal precision');
    expect(decimalPrecisionInput).toBeInTheDocument();
    userEvent.type(decimalPrecisionInput, '2');

    expect(mockOnChange).toHaveBeenCalledWith({
      content: {
        decimalPrecision: '2',
        series: [{ color: 'red', dataSourceId: 'temperature', label: 'Temperature' }],
        xLabel: 'Time',
        yLabel: 'Temperature (˚F)',
      },
      id: 'timeSeries',
      size: 'MEDIUM',
      title: 'TimeSeries',
      type: 'TIMESERIES',
    });
  });

  it('handles maximumDataPoints onChange', () => {
    render(<DataSeriesFormSettings cardConfig={timeSeriesConfig} onChange={mockOnChange} />);
    const maximumDataPointsInput = screen.getByLabelText('Maximum data points');
    expect(maximumDataPointsInput).toBeInTheDocument();
    userEvent.type(maximumDataPointsInput, '2');

    expect(mockOnChange).toHaveBeenCalledWith({
      content: {
        maximumDataPoints: 2,
        series: [{ color: 'red', dataSourceId: 'temperature', label: 'Temperature' }],
        xLabel: 'Time',
        yLabel: 'Temperature (˚F)',
      },
      id: 'timeSeries',
      size: 'MEDIUM',
      title: 'TimeSeries',
      type: 'TIMESERIES',
    });
  });
});
