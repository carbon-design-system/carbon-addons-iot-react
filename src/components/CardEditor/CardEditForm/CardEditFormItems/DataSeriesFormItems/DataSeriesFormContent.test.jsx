import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DataSeriesFormItem, {
  formatDataItemsForDropdown,
} from './DataSeriesFormContent';

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
const barChartCardConfig = {
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
  interval: 'day',
};
const valueCardConfig = {
  id: 'ValueCard',
  title: 'Value Card',
  type: 'VALUE',
  size: 'MEDIUM',
  content: {
    attributes: [
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

const dataItems = [
  { dataSourceId: 'temperature', label: 'Temperature' },
  { dataSourceId: 'pressure', label: 'Pressure' },
];

const mockOnChange = jest.fn();
const mockGetValidDataItems = jest.fn();
const mockSetSelectedDataItems = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});
describe('DataSeriesFormItem', () => {
  describe('formatDataItemsForDropdown', () => {
    it('should correctly format the items for the dropdown', () => {
      expect(formatDataItemsForDropdown(dataItems)).toEqual([
        { id: 'temperature', text: 'temperature' },
        { id: 'pressure', text: 'pressure' },
      ]);
    });
  });
  describe('dataItems', () => {
    it('should prioritize getValidDataItems', () => {
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
    it('handles initial dataItems', () => {
      render(
        <DataSeriesFormItem
          cardJson={{ ...cardConfig, content: {} }}
          onChange={mockOnChange}
          getValidDataItems={mockGetValidDataItems}
          dataItems={dataItems}
          setSelectedDataItems={mockSetSelectedDataItems}
        />
      );
      expect(screen.getByText('Data')).toBeInTheDocument();
    });
    it('should remove the category if the card is a stacked timeseries bar', () => {
      render(
        <DataSeriesFormItem
          cardConfig={barChartCardConfig}
          onChange={mockOnChange}
          dataItems={dataItems}
          setSelectedDataItems={mockSetSelectedDataItems}
        />
      );
      const dataItemDropDown = screen.getByText('Select data items');
      expect(dataItemDropDown).toBeInTheDocument();
      fireEvent.click(dataItemDropDown);

      const pressureOption = screen.getByText('pressure');
      expect(pressureOption).toBeInTheDocument();
      fireEvent.click(pressureOption);

      expect(mockOnChange).toHaveBeenCalledWith({
        id: 'BarChart',
        interval: 'day',
        size: 'MEDIUM',
        title: 'BarChartCard',
        type: 'BAR',
        content: {
          series: [
            {
              color: 'red',
              dataSourceId: 'temperature',
              label: 'Temperature',
            },
            {
              color: '#1192e8',
              dataSourceId: 'pressure',
              label: 'pressure',
            },
          ],
          timeDataSourceId: 'timestamp',
          type: 'STACKED',
          xLabel: 'Time',
          yLabel: 'Temperature (˚F)',
        },
      });
    });
    it('sets selected data items in a simple bar chart', () => {
      render(
        <DataSeriesFormItem
          cardConfig={{
            ...barChartCardConfig,
            content: { ...barChartCardConfig.content, type: 'SIMPLE' },
          }}
          onChange={mockOnChange}
          dataItems={dataItems}
          setSelectedDataItems={mockSetSelectedDataItems}
        />
      );
      const dataItemDropDown = screen.getByText('temperature');
      expect(dataItemDropDown).toBeInTheDocument();
      fireEvent.click(dataItemDropDown);

      const pressureOption = screen.getByText('pressure');
      expect(pressureOption).toBeInTheDocument();
      fireEvent.click(pressureOption);

      expect(mockOnChange).toHaveBeenCalled();
      expect(mockSetSelectedDataItems).toHaveBeenCalled();
    });
    it('handles row actions for dataItems for complexDataSeries', () => {
      render(
        <DataSeriesFormItem
          cardConfig={barChartCardConfig}
          onChange={mockOnChange}
          dataItems={dataItems}
          setSelectedDataItems={mockSetSelectedDataItems}
        />
      );

      const dataItemRowAction = screen.getByRole('button', {
        name: 'Remove',
      });
      fireEvent.click(dataItemRowAction);

      expect(mockSetSelectedDataItems).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalled();
    });
    it('handles row actions for dataItems for simpleDataSeries', () => {
      render(
        <DataSeriesFormItem
          cardConfig={valueCardConfig}
          onChange={mockOnChange}
          dataItems={dataItems}
          setSelectedDataItems={mockSetSelectedDataItems}
        />
      );

      const dataItemRowAction = screen.getByRole('button', {
        name: 'Edit',
      });
      fireEvent.click(dataItemRowAction);

      const editDataItemModal = screen.getByText('Data item');
      expect(editDataItemModal).toBeInTheDocument();
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
      const pressureDataItem = await screen.findAllByText('pressure');
      expect(pressureDataItem[0]).toBeInTheDocument();
      fireEvent.click(pressureDataItem[0]);
      // assert that onChange was called
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockSetSelectedDataItems).toHaveBeenCalled();
      // click the edit icon on the data item
      const customizeButton = screen.getByText('Customize');
      expect(customizeButton).toBeInTheDocument();
      fireEvent.click(customizeButton);

      userEvent.type(
        screen.getByRole('cell', { name: 'Temperature' }),
        'changed label'
      );
      expect(mockOnChange).toHaveBeenCalled();
      // submit the changes
      const submitButton = screen.getByText('Save');
      fireEvent.click(submitButton);
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
