import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
  interval: 'day',
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
    fontSize: 16,
    precision: 5,
  },
};

const mockOnChange = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('CardEditFormSettings', () => {
  describe('Timeseries form fields', () => {
    it('should update JSON for the x axis label', () => {
      render(
        <CardEditFormSettings
          cardConfig={timeseriesCardConfig}
          onChange={mockOnChange}
        />
      );
      userEvent.type(
        screen.getByRole('textbox', { name: 'X-axis label' }),
        'changed label'
      );
      expect(mockOnChange).toHaveBeenCalled();
    });
    it('should update JSON for the y axis label', () => {
      render(
        <CardEditFormSettings
          cardConfig={timeseriesCardConfig}
          onChange={mockOnChange}
        />
      );
      userEvent.type(
        screen.getByRole('textbox', { name: 'Y-axis label' }),
        'changed label'
      );
      expect(mockOnChange).toHaveBeenCalled();
    });
    it('should update JSON for the unit field', () => {
      render(
        <CardEditFormSettings
          cardConfig={timeseriesCardConfig}
          onChange={mockOnChange}
        />
      );
      userEvent.type(
        screen.getByRole('textbox', { name: 'Unit' }),
        'changed unit'
      );
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
  describe('Value form fields', () => {
    it('should update JSON for the font size', () => {
      render(
        <CardEditFormSettings
          cardConfig={valueCardConfig}
          onChange={mockOnChange}
        />
      );
      const fontSizeInput = screen.getByDisplayValue('16');
      expect(fontSizeInput).toBeInTheDocument();

      fireEvent.change(fontSizeInput, {
        target: { value: 30 },
      });
      expect(mockOnChange).toHaveBeenCalledWith({
        content: {
          attributes: [
            {
              dataSourceId: 'key1',
              label: 'Key 1',
              unit: '%',
            },
            {
              dataSourceId: 'key2',
              label: 'Key 2',
              unit: 'lb',
            },
          ],
          fontSize: 30,
          precision: 5,
        },
        id: 'Standard',
        size: 'MEDIUM',
        title: 'value card',
        type: 'VALUE',
      });
    });
    it('should update JSON for the precision', () => {
      render(
        <CardEditFormSettings
          cardConfig={valueCardConfig}
          onChange={mockOnChange}
        />
      );
      const precisionInput = screen.getByText('5');
      expect(precisionInput).toBeInTheDocument();

      fireEvent.click(precisionInput);
      const precisionOption = screen.getByText('3');
      expect(precisionOption).toBeInTheDocument();

      fireEvent.click(precisionOption);

      expect(mockOnChange).toHaveBeenCalledWith({
        content: {
          attributes: [
            {
              dataSourceId: 'key1',
              label: 'Key 1',
              unit: '%',
            },
            {
              dataSourceId: 'key2',
              label: 'Key 2',
              unit: 'lb',
            },
          ],
          fontSize: 16,
          precision: 3,
        },
        id: 'Standard',
        size: 'MEDIUM',
        title: 'value card',
        type: 'VALUE',
      });
    });
    it('should handle undefined content', () => {
      render(
        <CardEditFormSettings
          cardConfig={{
            id: 'Standard',
            title: 'value card',
            type: 'VALUE',
            size: 'MEDIUM',
          }}
          onChange={mockOnChange}
        />
      );
      const fontSizeInput = screen.getByText('Font size');
      expect(fontSizeInput).toBeInTheDocument();
      const precisionInput = screen.getByText('Precision');
      expect(precisionInput).toBeInTheDocument();
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
