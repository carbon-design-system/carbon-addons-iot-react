import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DataSeriesFormItem, { formatSeries } from './DataSeriesFormItem';

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

const dataItems = ['Temperature', 'Pressure'];

const mockOnChange = jest.fn();
const mockGetValidDataItems = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('DataSeriesFormItem', () => {
  describe('formatSeries', () => {
    const cardJsonWithoutColorDefinition = {
      content: {
        series: [
          {
            label: 'Temperature',
            dataSourceId: 'temperature',
          },
          {
            label: 'Pressure',
            dataSourceId: 'pressure',
          },
        ],
      },
    };
    const selectedItems = [{ id: 'Temperature' }, { id: 'Pressure' }];
    it('should correctly format the card series', () => {
      expect(formatSeries(selectedItems, cardJson)).toEqual([
        { dataSourceId: 'temperature', label: 'Temperature', color: 'red' },
        { dataSourceId: 'pressure', label: 'Pressure', color: 'blue' },
      ]);
    });
    it('should correctly generate colors for dataItems with no color defined', () => {
      expect(
        formatSeries(selectedItems, cardJsonWithoutColorDefinition)
      ).toEqual([
        { dataSourceId: 'temperature', label: 'Temperature', color: '#6929c4' },
        { dataSourceId: 'pressure', label: 'Pressure', color: '#1192e8' },
      ]);
    });
  });
  describe('dataItems', () => {
    it('should prioritize getValidDataItems', async () => {
      render(
        <DataSeriesFormItem
          cardJson={cardJson}
          onChange={mockOnChange}
          getValidDataItems={mockGetValidDataItems}
          dataItems={dataItems}
        />
      );
      expect(mockGetValidDataItems).toHaveBeenCalled();
    });
  });
  describe('dataItem editor', () => {
    it('should open dataItem editor, edit, and submit', async () => {
      render(
        <DataSeriesFormItem
          cardJson={cardJson}
          onChange={mockOnChange}
          dataItems={dataItems}
        />
      );
      const dataItemsDropdown = screen.getByText('Select data items');
      expect(dataItemsDropdown).toBeInTheDocument();
      fireEvent.click(dataItemsDropdown);
      const pressureDataItem = await screen.findAllByText('Pressure');
      expect(pressureDataItem[0]).toBeInTheDocument();
      fireEvent.click(pressureDataItem[0]);
      expect(mockOnChange).toHaveBeenCalled();
      const editButton = screen.getAllByText('Edit');
      expect(editButton[0]).toBeInTheDocument();
      fireEvent.click(editButton[0]);
      const legendColorPicker = screen.getByText('Legend color');
      expect(legendColorPicker).toBeInTheDocument();
      userEvent.type(
        screen.getByRole('textbox', { name: 'Label' }),
        'changed label'
      );
      expect(mockOnChange).toHaveBeenCalled();
      const submitButton = screen.getByText('Save');
      fireEvent.click(submitButton);
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
