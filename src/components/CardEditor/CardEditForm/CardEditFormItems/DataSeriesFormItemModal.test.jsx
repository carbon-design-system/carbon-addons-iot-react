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
  const groupedBarConfig = {
    title: 'Untitled',
    size: 'MEDIUM',
    type: 'BAR',
    content: {
      type: 'GROUPED',
      layout: 'VERTICAL',
      series: [
        {
          dataSourceId: 'temperature',
          label: 'temperature',
          color: '#6929c4',
        },
      ],
      categoryDataSourceId: 'firmware',
    },
    dataSource: {
      groupBy: ['firmware'],
    },
  };

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
          color: '#6929c4',
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

  const editGroupedBarDataItem = {
    dataSourceId: 'temperature',
    label: 'temperature',
    color: '#6929c4',
  };

  const editTimeseriesDataItem = {
    label: 'Temperature',
    dataSourceId: 'temperature',
    color: 'red',
    aggregationMethods: [
      { id: 'last', text: 'Last' },
      { id: 'mean', text: 'Mean' },
      { id: 'max', text: 'Max' },
      { id: 'min', text: 'Min' },
    ],
  };

  const editTimeseriesDataItemAggregated = {
    label: 'Temperature Max',
    dataSourceId: 'temperature_max',
    color: 'red',
    aggregationMethods: [
      { id: 'last', text: 'Last' },
      { id: 'mean', text: 'Mean' },
      { id: 'max', text: 'Max' },
      { id: 'min', text: 'Min' },
    ],
    aggregationMethod: 'max',
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
        isSummaryDashboard
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
  it('Changes precision in a value card', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={valueCardConfig}
        editDataItem={editValueDataItem}
      />
    );

    const precisionSelector = screen.getByText('3');
    expect(precisionSelector).toBeInTheDocument();

    fireEvent.click(precisionSelector);

    const selectorOption = screen.getByText('2');
    expect(selectorOption).toBeInTheDocument();

    fireEvent.click(selectorOption);
    expect(mockSetEditDataItem).toHaveBeenCalled();
  });
  it('Removes precision in a value card', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={valueCardConfig}
        editDataItem={{ ...editValueDataItem, precision: 3 }}
      />
    );

    const precisionSelector = screen.getByText('3');
    expect(precisionSelector).toBeInTheDocument();

    fireEvent.click(precisionSelector);

    const notSetOption = screen.getByText('Not set');
    expect(notSetOption).toBeInTheDocument();

    fireEvent.click(notSetOption);

    expect(mockSetEditDataItem).toHaveBeenCalled();
  });
  it('Removes dataFilter in a value card', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        isSummaryDashboard
        cardConfig={valueCardConfig}
        editDataItem={{
          ...editValueDataItem,
          dataFilter: { manufacturer: 'Rentech' },
        }}
      />
    );

    const dataFilterSelector = screen.getByText('manufacturer');
    expect(dataFilterSelector).toBeInTheDocument();

    fireEvent.click(dataFilterSelector);

    const noneOption = screen.getByText('None');
    expect(noneOption).toBeInTheDocument();

    fireEvent.click(noneOption);

    expect(mockSetEditDataItem).toHaveBeenCalled();
  });
  it('Changes dataFilter in a ValueCard', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        isSummaryDashboard
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
        isSummaryDashboard
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
    expect(mockSetEditDataItem).toHaveBeenCalledWith({
      label: 'newLabel',
      dataSourceId: 'temperature',
      color: 'red',
      aggregationMethods: [
        {
          id: 'last',
          text: 'Last',
        },
        {
          id: 'mean',
          text: 'Mean',
        },
        {
          id: 'max',
          text: 'Max',
        },
        {
          id: 'min',
          text: 'Min',
        },
      ],
    });
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

    const colorDropdown = screen.getAllByTitle('Open menu')[2];
    expect(colorDropdown).toBeInTheDocument();

    fireEvent.click(colorDropdown);

    const magentaColor = screen.getAllByRole('option')[5];
    expect(magentaColor).toBeInTheDocument();

    fireEvent.click(magentaColor);
    expect(mockSetEditDataItem).toHaveBeenCalledWith({
      label: 'Temperature',
      dataSourceId: 'temperature',
      color: '#520408',
      aggregationMethods: [
        {
          id: 'last',
          text: 'Last',
        },
        {
          id: 'mean',
          text: 'Mean',
        },
        {
          id: 'max',
          text: 'Max',
        },
        {
          id: 'min',
          text: 'Min',
        },
      ],
    });
  });
  it('Changes grain', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={timeSeriesCardConfig}
        editDataItem={editTimeseriesDataItem}
        editDataSeries={editDataSeriesTimeSeries}
      />
    );

    const grainDropdown = screen.getByText('Input');
    expect(grainDropdown).toBeInTheDocument();

    fireEvent.click(grainDropdown);

    const grainOption = screen.getAllByRole('option')[2];
    expect(grainOption).toBeInTheDocument();

    fireEvent.click(grainOption);
    expect(mockSetEditDataItem).toHaveBeenCalled();
  });
  it('Renders an aggregation selector in summary dashboards and fires setEditDataItem', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        isSummaryDashboard
        cardConfig={timeSeriesCardConfig}
        editDataItem={editTimeseriesDataItem}
        editDataSeries={editDataSeriesTimeSeries}
      />
    );

    const aggregationDropdown = screen.getByText('Mean');
    expect(aggregationDropdown).toBeInTheDocument();

    fireEvent.click(aggregationDropdown);

    const aggregationOption = screen.getByText('Min');
    expect(aggregationOption).toBeInTheDocument();

    fireEvent.click(aggregationOption);

    expect(mockSetEditDataItem).toHaveBeenCalled();
  });
  it('Renders a read only aggregation field in instance dashboards', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={timeSeriesCardConfig}
        editDataItem={editTimeseriesDataItemAggregated}
        editDataSeries={editDataSeriesTimeSeries}
      />
    );

    const aggregationValue = screen.getByText('Max');
    expect(aggregationValue).toBeInTheDocument();
  });
  it('Closes the editor and empties out the editDataItem', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={timeSeriesCardConfig}
        editDataItem={editTimeseriesDataItemAggregated}
        editDataSeries={editDataSeriesTimeSeries}
      />
    );

    const closeButton = screen.getByRole('button', { name: 'Close' });
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);

    expect(mockSetEditDataItem).toHaveBeenCalled();
    expect(mockSetShowEditor).toHaveBeenCalled();
  });
  it('Renders the DataSeriesEditorTable', () => {
    render(
      <DataSeriesFormItemModal
        {...commonProps}
        showEditor
        cardConfig={groupedBarConfig}
        editDataItem={editGroupedBarDataItem}
        editDataSeries={[editGroupedBarDataItem]}
      />
    );

    const modalTitle = screen.getByText('Customize data series');
    expect(modalTitle).toBeInTheDocument();
  });
});
