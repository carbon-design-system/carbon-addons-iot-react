import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import DataSeriesFormSettings from './DataSeriesFormSettings';

const timeSeriesConfig = {
  id: 'timeSeries',
  title: 'TimeSeriees',
  size: 'MEDIUM',
  type: 'TIMESERIS',
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
    const includeZeroOnXaxisField = screen.getByTestId('includeZeroOnXaxis toggle');
    expect(includeZeroOnXaxisField).toBeInTheDocument();
    fireEvent.click(includeZeroOnXaxisField);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...timeSeriesConfig,
      content: { ...timeSeriesConfig.content, includeZeroOnXaxis: true },
    });

    const includeZeroOnYaxisField = screen.getByTestId('includeZeroOnYaxis toggle');
    expect(includeZeroOnYaxisField).toBeInTheDocument();
    fireEvent.click(includeZeroOnYaxisField);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...timeSeriesConfig,
      content: { ...timeSeriesConfig.content, includeZeroOnYaxis: true },
    });
  });
});
