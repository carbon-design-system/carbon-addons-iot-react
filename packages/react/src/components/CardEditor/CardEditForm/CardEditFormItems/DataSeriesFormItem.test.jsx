import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DataSeriesFormItem, { formatSeries } from './DataSeriesFormItem';

const cardConfig = {
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
const mockSetSelectedDataItems = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('DataSeriesFormItem', () => {
  describe('formatSeries', () => {
    const cardConfigWithoutColorDefinition = {
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
      expect(formatSeries(selectedItems, cardConfig)).toEqual([
        { dataSourceId: 'temperature', label: 'Temperature', color: 'red' },
        { dataSourceId: 'pressure', label: 'Pressure', color: 'blue' },
      ]);
    });
    it('should correctly generate colors for dataItems with no color defined', () => {
      expect(
        formatSeries(selectedItems, cardConfigWithoutColorDefinition)
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
          cardConfig={cardConfig}
          onChange={mockOnChange}
          getValidDataItems={mockGetValidDataItems}
          dataItems={dataItems}
          setSelectedDataItems={mockSetSelectedDataItems}
        />
      );
      expect(mockGetValidDataItems).toHaveBeenCalled();
    });
  });
  describe('dataItem editor', () => {
    it('should open dataItem editor, edit, and submit', async () => {
      render(
        <DataSeriesFormItem
          cardConfig={cardConfig}
          onChange={mockOnChange}
          dataItems={dataItems}
          setSelectedDataItems={mockSetSelectedDataItems}
        />
      );
      const dataItemsDropdown = screen.getByText('Select data items');
      expect(dataItemsDropdown).toBeInTheDocument();
      fireEvent.click(dataItemsDropdown);
      // click on a data item
      const pressureDataItem = await screen.findAllByText('Pressure');
      expect(pressureDataItem[0]).toBeInTheDocument();
      fireEvent.click(pressureDataItem[0]);
      // assert that onChange was called
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockSetSelectedDataItems).toHaveBeenCalled();
      // click the edit icon on the data item
      const editButton = screen.getAllByText('Edit');
      expect(editButton[0]).toBeInTheDocument();
      fireEvent.click(editButton[0]);
      // the legend color picker is only present on the edit data item modal
      const legendColorPicker = screen.getByText('Legend color');
      expect(legendColorPicker).toBeInTheDocument();
      userEvent.type(screen.getByRole('textbox', { name: 'Label' }), 'changed label');
      expect(mockOnChange).toHaveBeenCalled();
      // submit the changes
      const submitButton = screen.getByText('Save');
      fireEvent.click(submitButton);
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
