import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CardEditFormSettings from './CardEditFormSettings';

const timeseriesCardConfig = {
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
};
const valueCardConfig = {
  id: 'Standard',
  title: 'value card',
  type: 'VALUE',
  size: 'MEDIUM',
  content: {
    attributes: [
      {
        dataSourceId: 'key1',
        unit: '%',
        label: 'Key 1',
      },
      {
        dataSourceId: 'key2',
        unit: 'lb',
        label: 'Key 2',
      },
    ],
    precision: 5,
  },
  fontSize: 16,
};
const imageCardConfig = {
  id: 'Standard',
  title: 'image card',
  type: 'IMAGE',
  size: 'MEDIUM',
  content: {},
};

const mockOnChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('CardEditFormSettings', () => {
  describe('Timeseries form fields', () => {
    it('should update JSON for the x axis label', () => {
      render(<CardEditFormSettings cardConfig={timeseriesCardConfig} onChange={mockOnChange} />);
      userEvent.type(screen.getByRole('textbox', { name: 'X-axis label' }), 'changed label');
      expect(mockOnChange).toHaveBeenCalled();
    });
    it('should update JSON for the y axis label', () => {
      render(<CardEditFormSettings cardConfig={timeseriesCardConfig} onChange={mockOnChange} />);
      userEvent.type(screen.getByRole('textbox', { name: 'Y-axis label' }), 'changed label');
      expect(mockOnChange).toHaveBeenCalled();
    });
    it('should update JSON for the unit field', () => {
      render(<CardEditFormSettings cardConfig={timeseriesCardConfig} onChange={mockOnChange} />);
      userEvent.type(screen.getByRole('textbox', { name: 'Unit' }), 'changed unit');
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('render image card', () => {
    it('should see open menu options translated correctly', () => {
      render(<CardEditFormSettings cardConfig={imageCardConfig} onChange={mockOnChange} />);
      expect(screen.getByText('Open menu')).toBeInTheDocument();
      userEvent.click(screen.getByText('Open menu'));
      expect(screen.getByText('Close menu')).toBeInTheDocument();
      userEvent.click(screen.getByText('gray80'));
      expect(screen.getByText('Open menu')).toBeInTheDocument();
    });
  });
  describe('other form fields', () => {
    it('should render null when not timeseries or value', () => {
      const { container } = render(
        <CardEditFormSettings
          cardConfig={{ ...valueCardConfig, type: 'bogusType' }}
          onChange={mockOnChange}
        />
      );
      expect(container).toBeEmptyDOMElement();
    });
  });
});
