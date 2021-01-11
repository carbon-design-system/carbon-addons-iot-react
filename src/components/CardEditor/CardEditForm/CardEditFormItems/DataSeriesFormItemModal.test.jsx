import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import DataSeriesFormItemModal from './DataSeriesFormItemModal';

describe('DataSeriesFormItemModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOnChange = jest.fn();
  const mockSetShowEditor = jest.fn();
  const mockSetEditDataItem = jest.fn();
  const mockSetEditDataSeries = jest.fn();
  const timeSeriesCardConfig = {
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
          precision: 3,
          label: 'Key 1',
        },
        {
          dataSourceId: 'key2',
          unit: 'lb',
          label: 'Key 2',
          precision: 3,
        },
      ],
    },
  };

  const editTimeseriesDataItem = {
    label: 'Temperature',
    dataSourceId: 'temperature',
    color: 'red',
  };

  const editDataSeriesTimeSeries = [
    {
      label: 'Temperature',
      dataSourceId: 'temperature',
      color: 'red',
    },
  ];

  const editValueDataItem = {
    dataSourceId: 'key1',
    unit: '%',
    precision: 3,
    label: 'Key 1',
  };

  const availableDimensions = {
    deviceid: ['73000', '73001', '73002'],
    manufacturer: ['Rentech', 'GHI Industries'],
  };

  const commonProps = {
    onChange: mockOnChange,
    setShowEditor: mockSetShowEditor,
    setEditDataItem: mockSetEditDataItem,
    setEditDataSeries: mockSetEditDataSeries,
    availableDimensions,
  };

  it('Renders for timeseries card data', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={timeSeriesCardConfig}
        editDataItem={editTimeseriesDataItem}
        editDataSeries={editDataSeriesTimeSeries}
      />
    );

    const label = screen.getByText('Custom label');
    const legendColorLabel = screen.getByText('Line color');
    expect(label).toBeInTheDocument();
    expect(legendColorLabel).toBeInTheDocument();
  });
  it('Renders for value card data', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={valueCardConfig}
        editDataItem={editValueDataItem}
      />
    );

    const customLabel = screen.getByText('Custom label');
    const unitLabel = screen.getByText('Unit');
    const dataFilterLabel = screen.getByText('Data filter');
    expect(customLabel).toBeInTheDocument();
    expect(unitLabel).toBeInTheDocument();
    expect(dataFilterLabel).toBeInTheDocument();
  });
  it('Adds a custom label in a value card', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={valueCardConfig}
        editDataItem={editValueDataItem}
      />
    );

    const customLabelInput = screen.getByDisplayValue('Key 1');
    expect(customLabelInput).toBeInTheDocument();

    fireEvent.change(customLabelInput, {
      target: { value: 'newLabel' },
    });
    expect(mockSetEditDataItem).toHaveBeenCalledWith({
      dataSourceId: 'key1',
      label: 'newLabel',
      precision: 3,
      unit: '%',
    });
  });
  it('Changes unit in a value card', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={valueCardConfig}
        editDataItem={editValueDataItem}
      />
    );

    const unitInput = screen.getByDisplayValue('%');
    expect(unitInput).toBeInTheDocument();

    fireEvent.change(unitInput, {
      target: { value: 'PSI' },
    });
    expect(mockSetEditDataItem).toHaveBeenCalledWith({
      dataSourceId: 'key1',
      label: 'Key 1',
      precision: 3,
      unit: 'PSI',
    });
  });
  it('changes precision in a valueCard', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={valueCardConfig}
        editDataItem={editValueDataItem}
      />
    );

    const precisionInput = screen.getByText('3');
    expect(precisionInput).toBeInTheDocument();
    fireEvent.click(precisionInput);

    const precisionOption = screen.getByText('4');
    expect(precisionOption).toBeInTheDocument();

    fireEvent.click(precisionOption);

    expect(mockSetEditDataItem).toHaveBeenCalledWith({
      dataSourceId: 'key1',
      unit: '%',
      precision: 4,
      label: 'Key 1',
    });
  });
  it('Changes dataFilter in a ValueCard', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={valueCardConfig}
        editDataItem={editValueDataItem}
      />
    );

    const dataFilterDimensionInput = screen.getByText('None');
    expect(dataFilterDimensionInput).toBeInTheDocument();

    fireEvent.click(dataFilterDimensionInput);

    const deviceIdOption = screen.getByText('deviceid');
    expect(deviceIdOption).toBeInTheDocument();

    fireEvent.click(deviceIdOption);

    expect(mockSetEditDataItem).toHaveBeenCalledWith({
      dataFilter: {
        deviceid: '73000',
      },
      dataSourceId: 'key1',
      label: 'Key 1',
      precision: 3,
      unit: '%',
    });
  });
  it('Changes dataFilter value in a ValueCard', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={valueCardConfig}
        editDataItem={{
          dataFilter: {
            deviceid: '73000',
          },
          dataSourceId: 'key1',
          label: 'Key 1',
          precision: 3,
          unit: '%',
        }}
      />
    );

    const dataFilterValueInput = screen.getByText('73000');
    expect(dataFilterValueInput).toBeInTheDocument();

    fireEvent.click(dataFilterValueInput);

    const valueOption = screen.getByText('73001');
    expect(valueOption).toBeInTheDocument();

    fireEvent.click(valueOption);

    expect(mockSetEditDataItem).toHaveBeenCalledWith({
      dataFilter: {
        deviceid: '73001',
      },
      dataSourceId: 'key1',
      label: 'Key 1',
      precision: 3,
      unit: '%',
    });
  });
  it('Changes the label in a TimeseriesCard', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={timeSeriesCardConfig}
        editDataItem={editTimeseriesDataItem}
        editDataSeries={editDataSeriesTimeSeries}
      />
    );

    const labelInput = screen.getByDisplayValue('Temperature');
    expect(labelInput).toBeInTheDocument();

    fireEvent.change(labelInput, {
      target: { value: 'newLabel' },
    });
    expect(mockSetEditDataSeries).toHaveBeenCalledWith([
      {
        label: 'newLabel',
        dataSourceId: 'temperature',
        color: 'red',
      },
    ]);
  });
  it('Changes the color in a TimeseriesCard', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={timeSeriesCardConfig}
        editDataItem={editTimeseriesDataItem}
        editDataSeries={editDataSeriesTimeSeries}
      />
    );

    const colorDropdown = screen.getByRole('img', { name: 'Open menu' });
    expect(colorDropdown).toBeInTheDocument();

    fireEvent.click(colorDropdown);

    const magentaColor = screen.getAllByRole('option')[5];
    expect(magentaColor).toBeInTheDocument();

    fireEvent.click(magentaColor);
    expect(mockSetEditDataSeries).toHaveBeenCalledWith([
      {
        label: 'Temperature',
        dataSourceId: 'temperature',
        color: '#520408',
      },
    ]);
  });
});
