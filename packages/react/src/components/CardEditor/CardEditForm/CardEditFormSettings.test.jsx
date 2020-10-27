import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CardEditFormSettings from './CardEditFormSettings';

const cardJson = {
  id: 'Timeseries',
  title: 'Untitled',
  size: 'MEDIUMWIDE',
  type: 'TIMESERIES',
  content: {
    series: [
      {
        label: 'Temperature',
        dataSourceId: 'temperature',
        color: 'red',
      },
      {
        label: 'Pressure',
        dataSourceId: 'pressure',
        color: 'blue',
      },
    ],
    xLabel: 'Time',
    yLabel: 'Temperature (˚F)',
    includeZeroOnXaxis: true,
    includeZeroOnYaxis: true,
    timeDataSourceId: 'timestamp',
    addSpaceOnEdges: 1,
  },
  interval: 'day',
};

const mockOnChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('CardEditFormSettings', () => {
  describe('Form fields', () => {
    it('should update JSON for the x axis label', () => {
      render(<CardEditFormSettings cardJson={cardJson} onChange={mockOnChange} />);
      userEvent.type(screen.getByRole('textbox', { name: 'X-axis label' }), 'changed label');
      expect(mockOnChange).toHaveBeenCalled();
    });
    it('should update JSON for the y axis label', () => {
      render(<CardEditFormSettings cardJson={cardJson} onChange={mockOnChange} />);
      userEvent.type(screen.getByRole('textbox', { name: 'Y-axis label' }), 'changed label');
      expect(mockOnChange).toHaveBeenCalled();
    });
    it('should update JSON for the unit field', () => {
      render(<CardEditFormSettings cardJson={cardJson} onChange={mockOnChange} />);
      userEvent.type(screen.getByRole('textbox', { name: 'Unit' }), 'changed unit');
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
