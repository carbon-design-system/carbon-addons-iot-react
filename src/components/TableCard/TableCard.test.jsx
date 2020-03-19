import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { tableColumns, tableData, actions2 } from '../../utils/sample';

import TableCard, { findMatchingThresholds } from './TableCard';

describe('TableCard', () => {
  const thresholds = [
    { comparison: '>', dataSourceId: 'airflow_mean', severity: 3, value: 2 },
    { comparison: '>', dataSourceId: 'airflow_mean', severity: 1, value: 2.2 },
    { comparison: '>', dataSourceId: 'airflow_max', severity: 3, value: 4 },
    { comparison: '>', dataSourceId: 'airflow_max', severity: 1, value: 4.5 },
  ];
  test('findMatchingThresholds', () => {
    const oneMatchingThreshold = findMatchingThresholds(
      thresholds,
      { airflow_mean: 4 },
      'airflow_mean'
    );
    expect(oneMatchingThreshold).toHaveLength(1);
    // The highest severity should match
    expect(oneMatchingThreshold[0].severity).toEqual(1);
  });
  test('findMatchingThresholds multiple columns', () => {
    const twoMatchingThresholds = findMatchingThresholds(thresholds, {
      airflow_mean: 4,
      airflow_max: 5,
    });
    expect(twoMatchingThresholds).toHaveLength(2);
    // The highest severity should match
    expect(twoMatchingThresholds[0].severity).toEqual(1);
    expect(twoMatchingThresholds[0].dataSourceId).toEqual('airflow_mean');
    expect(twoMatchingThresholds[1].severity).toEqual(1);
    expect(twoMatchingThresholds[1].dataSourceId).toEqual('airflow_max');
  });
  test('findMatchingThresholds no column', () => {
    const thresholds = [{ comparison: '<', dataSourceId: 'airflow_mean', severity: 1, value: 4.5 }];
    const oneMatchingThreshold = findMatchingThresholds(thresholds, { airflow_mean: 4 });
    expect(oneMatchingThreshold).toHaveLength(1);
    // The highest severity should match
    expect(oneMatchingThreshold[0].severity).toEqual(1);

    // shouldn't match on null values
    const zeroMatchingThreshold = findMatchingThresholds(thresholds, { airflow_mean: null });
    expect(zeroMatchingThreshold).toHaveLength(0);
    // shouldn't match on null values
    const zeroMatchingThreshold2 = findMatchingThresholds(
      [{ comparison: '<=', dataSourceId: 'airflow_mean', severity: 1, value: 4.5 }],
      { airflow_mean: null }
    );
    expect(zeroMatchingThreshold2).toHaveLength(0);
  });
  test('Clicked row actions', () => {
    const onCardAction = jest.fn();

    const tableDataWithActions = tableData.map(item => {
      return {
        ...item,
        actions: actions2,
      };
    });

    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
        }}
        values={tableDataWithActions}
        onCardAction={onCardAction}
        size={CARD_SIZES.LARGE}
      />
    );

    wrapper
      .find('Icon')
      .find({ icon: { name: 'icon--edit' } })
      .first()
      .simulate('click');
    expect(onCardAction.mock.calls).toHaveLength(1);
  });
  test('Columns displayed XLarge', () => {
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.LARGEWIDE}
      />
    );
    expect(wrapper.find('TableHeader').length).toBe(tableColumns.length);
  });
  test('Columns displayed Large', () => {
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.LARGE}
      />
    );

    const totalColumns = tableColumns.filter(item => item.priority === 1 || item.priority === 2);
    expect(wrapper.find('TableHeader').length).toBe(totalColumns.length);
  });
  test('Columns displayed Large with actions', () => {
    const tableDataWithActions = tableData.map(item => {
      return {
        ...item,
        actions: actions2,
      };
    });

    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
        }}
        values={tableDataWithActions}
        size={CARD_SIZES.LARGE}
      />
    );

    const totalColumns = tableColumns.filter(item => item.priority === 1 || item.priority === 2);
    expect(wrapper.find('TableHeader').length).toBe(totalColumns.length + 1); // +1 for action column
  });
  test('Columns should use custom render fuction when present', () => {
    const mockRenderFunc = jest.fn(() => {
      return <p className="myCustomRenderedCell" />;
    });
    const columnWithRenderFunction = [
      {
        dataSourceId: 'alert',
        label: 'Alert',
        priority: 1,
        renderDataFunction: mockRenderFunc,
      },
    ];
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: columnWithRenderFunction,
        }}
        values={[tableData[0]]}
        size={CARD_SIZES.LARGE}
      />
    );
    expect(wrapper.find('TableCell .myCustomRenderedCell').length).toBe(1);
    expect(mockRenderFunc).toHaveBeenCalledWith({
      columnId: 'alert',
      row: {
        alert: 'AHI005 Asset failure',
        count: 1.2039201932,
        hour: 1563877570000,
        long_description: 'long description for a given event payload',
      },
      rowId: 'row-1',
      value: 'AHI005 Asset failure',
    });

    const columnNormal = [
      {
        dataSourceId: 'alert',
        label: 'Alert 2',
        priority: 1,
      },
    ];
    const wrapper2 = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: columnNormal,
        }}
        values={[tableData[0]]}
        size={CARD_SIZES.LARGE}
      />
    );
    expect(wrapper2.find('TableCell .myCustomRenderedCell').length).toBe(0);
  });
  test('threshold colums should render in correct column regardless of order', () => {
    const tableCustomColumns = tableColumns.map(item =>
      item.dataSourceId === 'count' ? { ...item, precision: 1 } : { ...item }
    );

    // The pressure header comes after the count header, but the ordering should not matter when
    // it comes to rendering the threshold columns
    const customThresholds = [
      {
        dataSourceId: 'pressure',
        comparison: '>=',
        value: 10,
        severity: 1,
        icon: 'bee',
        color: 'black',
        label: 'Pressure Sev',
      },
      {
        dataSourceId: 'count',
        comparison: '<',
        value: 5,
        severity: 3, // High threshold, medium, or low used for sorting and defined filtration
      },
      {
        dataSourceId: 'count',
        comparison: '>=',
        value: 10,
        severity: 1, // High threshold, medium, or low used for sorting and defined filtration
      },
      {
        dataSourceId: 'count',
        comparison: '=',
        value: 7,
        severity: 2, // High threshold, medium, or low used for sorting and defined filtration
      },
    ];
    const { getByTitle, queryByTitle } = render(
      <TableCard
        id="table-list"
        title="Open Alerts"
        content={{
          columns: tableCustomColumns,
          thresholds: customThresholds,
          expandedRows: [
            {
              id: 'long_description',
              label: 'Description',
            },
            {
              id: 'other_description',
              label: 'Other Description',
            },
            {
              id: 'pressure',
              label: 'Pressure',
            },
            {
              id: 'temperature',
              label: 'Temperature',
            },
          ],
        }}
        values={tableData}
        size={CARD_SIZES.LARGEWIDE}
      />
    );

    // If the ordering was being affected, Count Severity would not appear. Instead, Pressure Severity would appear
    expect(getByTitle('Count Severity')).toBeInTheDocument();
    expect(queryByTitle('Pressure Severity')).not.toBeInTheDocument();
    expect(getByTitle('Pressure Sev')).toBeInTheDocument();
  });
});
