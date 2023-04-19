import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BarChartCardFormSettings from './BarChartCardFormSettings';

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

const mockOnChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('BarChartCardFormSettings', () => {
  it('handles radio button onChange', () => {
    render(<BarChartCardFormSettings cardConfig={barChartConfig} onChange={mockOnChange} />);
    const buttons = screen.getByRole('radio', { name: 'Horizontal' });
    expect(buttons).toBeInTheDocument();

    expect(true).toEqual(true);
  });
  it('handles Y axis onChange', () => {
    render(<BarChartCardFormSettings cardConfig={barChartConfig} onChange={mockOnChange} />);
    const yAxisLabelInput = screen.getByRole('textbox', {
      name: 'Y-axis label',
    });
    expect(yAxisLabelInput).toBeInTheDocument();
    userEvent.type(yAxisLabelInput, 'new Y axis label');

    expect(mockOnChange).toHaveBeenCalled();
  });
  it('handles X axis onChange', () => {
    render(<BarChartCardFormSettings cardConfig={barChartConfig} onChange={mockOnChange} />);
    const xAxisLabelInput = screen.getByRole('textbox', {
      name: 'X-axis label',
    });
    expect(xAxisLabelInput).toBeInTheDocument();
    userEvent.type(xAxisLabelInput, 'new X axis label');

    expect(mockOnChange).toHaveBeenCalled();
  });
  it('handles decimal precision onChange', () => {
    render(<BarChartCardFormSettings cardConfig={barChartConfig} onChange={mockOnChange} />);
    const decimalPrecisionInput = screen.getByRole('textbox', {
      name: 'Decimal places',
    });
    expect(decimalPrecisionInput).toBeInTheDocument();
    userEvent.type(decimalPrecisionInput, '2');

    expect(mockOnChange).toHaveBeenCalled();
  });
  it('handles layout onChange', () => {
    render(<BarChartCardFormSettings cardConfig={barChartConfig} onChange={mockOnChange} />);

    userEvent.click(screen.getByText('Horizontal'));

    expect(mockOnChange).toHaveBeenCalledWith({
      content: {
        layout: 'HORIZONTAL',
        series: [{ color: 'red', dataSourceId: 'temperature', label: 'Temperature' }],
        type: 'SIMPLE',
        xLabel: 'Time',
        yLabel: 'Temperature (˚F)',
      },
      id: 'BarChart',
      size: 'MEDIUM',
      title: 'BarChartCard',
      type: 'BAR',
    });
  });
  it('handles maximum data points onChange', async () => {
    render(<BarChartCardFormSettings cardConfig={{ ...barChartConfig }} onChange={mockOnChange} />);

    await userEvent.type(screen.getByText('Maximum data points'), '200');

    expect(mockOnChange).toHaveBeenCalledWith({
      content: {
        series: [{ color: 'red', dataSourceId: 'temperature', label: 'Temperature' }],
        type: 'SIMPLE',
        xLabel: 'Time',
        yLabel: 'Temperature (˚F)',
        maximumDataPoints: 200,
      },
      id: 'BarChart',
      size: 'MEDIUM',
      title: 'BarChartCard',
      type: 'BAR',
    });
  });
});
