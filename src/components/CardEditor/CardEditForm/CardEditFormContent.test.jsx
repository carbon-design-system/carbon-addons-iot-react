import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CardEditFormContent from './CardEditFormContent';

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
const mockGetValidTimeRanges = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('CardEditFormContent', () => {
  describe('Form fields', () => {
    it('should update JSON for the x axis label', () => {
      render(
        <CardEditFormContent
          cardJson={cardJson}
          onChange={mockOnChange}
          getValidTimeRanges={mockGetValidTimeRanges}
        />
      );
      userEvent.type(
        screen.getByRole('textbox', { name: 'Card title' }),
        'changed title'
      );
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockGetValidTimeRanges).toHaveBeenCalled();
    });
  });
});
