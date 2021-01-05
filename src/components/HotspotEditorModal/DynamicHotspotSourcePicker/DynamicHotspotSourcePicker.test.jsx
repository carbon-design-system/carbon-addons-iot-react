import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import DynamicHotspotSourcePicker from './DynamicHotspotSourcePicker';

const getDataItems = () => [
  {
    dataSourceId: 'temperature',
    label: 'Temperature',
  },
  {
    dataSourceId: 'pressure',
    label: 'Pressure',
  },
];

const getCallbacks = () => ({
  onXValueChange: jest.fn(),
  onYValueChange: jest.fn(),
  onClear: jest.fn(),
});

describe('DynamicHotspotSourcePicker', () => {
  it('renders dropdowns for x and y coordinates', () => {
    render(
      <DynamicHotspotSourcePicker
        dataSourceItems={getDataItems()}
        {...getCallbacks()}
      />
    );

    expect(
      screen.getByLabelText('X coordinate', { selector: 'button' })
    ).toBeVisible();
  });

  it('Renders selected items', () => {
    const xSourceItem = getDataItems()[0];
    const ySourceItem = getDataItems()[1];

    render(
      <DynamicHotspotSourcePicker
        dataSourceItems={getDataItems()}
        selectedSourceIdX={xSourceItem.dataSourceId}
        selectedSourceIdY={ySourceItem.dataSourceId}
        {...getCallbacks()}
      />
    );

    expect(screen.getByText(xSourceItem.label)).toBeVisible();
    expect(screen.getByText(ySourceItem.label)).toBeVisible();
  });

  it('Shows clear button when both x & y cources are selected', () => {
    const xSourceItem = getDataItems()[0];
    const ySourceItem = getDataItems()[1];
    const invisible =
      'iot--dynamic-hotspot-source-picker__clear-button--invisible';
    const pickerTestId = 'test-picker-clear-dropdown';

    const { rerender } = render(
      <DynamicHotspotSourcePicker
        testID="test-picker"
        dataSourceItems={getDataItems()}
        {...getCallbacks()}
      />
    );
    expect(screen.getByTestId(pickerTestId)).toHaveClass(invisible);

    rerender(
      <DynamicHotspotSourcePicker
        testID="test-picker"
        dataSourceItems={getDataItems()}
        selectedSourceIdX={xSourceItem.dataSourceId}
        {...getCallbacks()}
      />
    );

    expect(screen.getByTestId(pickerTestId)).toHaveClass(invisible);

    rerender(
      <DynamicHotspotSourcePicker
        testID="test-picker"
        dataSourceItems={getDataItems()}
        selectedSourceIdY={xSourceItem.dataSourceId}
        selectedSourceIdX={ySourceItem.dataSourceId}
        {...getCallbacks()}
      />
    );

    expect(screen.getByTestId(pickerTestId)).not.toHaveClass(invisible);
  });

  it('calls onClear callback when cleared', () => {
    const xSourceItem = getDataItems()[0];
    const ySourceItem = getDataItems()[1];
    const { onClear, ...restCallbacks } = getCallbacks();

    render(
      <DynamicHotspotSourcePicker
        {...restCallbacks}
        testID="test-picker"
        dataSourceItems={getDataItems()}
        selectedSourceIdX={xSourceItem.dataSourceId}
        selectedSourceIdY={ySourceItem.dataSourceId}
        xCoordinateDropdownLabelText="select x"
        yCoordinateDropdownLabelText="select y"
        onClear={onClear}
      />
    );

    expect(screen.queryAllByText('select x')).toHaveLength(0);
    expect(screen.queryAllByText('select y')).toHaveLength(0);
    expect(onClear).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('test-picker-clear-dropdown'));
    expect(onClear).toHaveBeenCalled();
  });

  it('renders empty dropdowns when selectedSourceIdX & selectedSourceIdY are undefined', () => {
    const xSourceItem = getDataItems()[0];
    const ySourceItem = getDataItems()[1];

    const { rerender } = render(
      <DynamicHotspotSourcePicker
        {...getCallbacks()}
        dataSourceItems={getDataItems()}
        selectedSourceIdX={xSourceItem.dataSourceId}
        selectedSourceIdY={ySourceItem.dataSourceId}
        xCoordinateDropdownLabelText="select x"
        yCoordinateDropdownLabelText="select y"
      />
    );

    expect(screen.queryAllByText('select x')).toHaveLength(0);
    expect(screen.queryAllByText('select y')).toHaveLength(0);

    rerender(
      <DynamicHotspotSourcePicker
        {...getCallbacks()}
        dataSourceItems={getDataItems()}
        selectedSourceIdX={undefined}
        selectedSourceIdY={undefined}
        xCoordinateDropdownLabelText="select x"
        yCoordinateDropdownLabelText="select y"
      />
    );
    expect(screen.getByText('select x')).toBeVisible();
    expect(screen.getByText('select y')).toBeVisible();
  });

  it('calls onXValueChange & onYValueChange callback when values change', () => {
    const xSourceItem = getDataItems()[0];
    const ySourceItem = getDataItems()[1];
    const { onXValueChange, onYValueChange, onClear } = getCallbacks();

    render(
      <DynamicHotspotSourcePicker
        testID="test-picker"
        xCoordinateDropdownLabelText="select x"
        yCoordinateDropdownLabelText="select y"
        dataSourceItems={getDataItems()}
        onXValueChange={onXValueChange}
        onYValueChange={onYValueChange}
        onClear={onClear}
      />
    );

    expect(onXValueChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('select x'));
    fireEvent.click(screen.getAllByText(xSourceItem.label)[0]);
    expect(onXValueChange).toHaveBeenCalledWith(xSourceItem.dataSourceId);

    expect(onYValueChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('select y'));
    fireEvent.click(screen.getAllByText(ySourceItem.label)[0]);
    expect(onYValueChange).toHaveBeenCalledWith(ySourceItem.dataSourceId);
  });
});
