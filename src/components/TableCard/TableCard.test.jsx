import React from 'react';
import { mount } from 'enzyme';
import { render, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { tableColumns, tableData, actions2, tableColumnsWithLinks } from '../../utils/sample';

import TableCard, { findMatchingThresholds, createColumnsWithFormattedLinks } from './TableCard';

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
  test('createColumnsWithFormattedLinks adds renderDataFunction to columns with links', () => {
    const columnsWithFormattedLinks = createColumnsWithFormattedLinks(tableColumnsWithLinks);
    const columnsWithlinks = columnsWithFormattedLinks.filter(column => column.renderDataFunction);
    expect(columnsWithlinks).toHaveLength(1);
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
        pressure: 0,
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
  test('threshold columns should render in correct column regardless of order', () => {
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
        severity: 3,
      },
      {
        dataSourceId: 'count',
        comparison: '>=',
        value: 10,
        severity: 1,
      },
      {
        dataSourceId: 'count',
        comparison: '=',
        value: 7,
        severity: 2,
      },
    ];
    const { getByTitle, queryByTitle } = render(
      <TableCard
        id="table-list"
        title="Open Alerts"
        content={{
          columns: tableColumns,
          thresholds: customThresholds,
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
  test('threshold columns should render in correct column regardless of quantity', () => {
    // If there are more than 2 thresholds, they should still render to the left of the datasource column
    const customThresholds = [
      {
        dataSourceId: 'pressure',
        comparison: '>=',
        value: 10,
        severity: 1,
      },
      {
        dataSourceId: 'count',
        comparison: '<',
        value: 5,
        severity: 3,
      },
      {
        dataSourceId: 'count',
        comparison: '>=',
        value: 10,
        severity: 1,
      },
      {
        dataSourceId: 'count',
        comparison: '=',
        value: 7,
        severity: 2,
      },
      {
        dataSourceId: 'hour',
        comparison: '<',
        value: 1563877570000,
        severity: 1, // High threshold, medium, or low used for sorting and defined filtration
      },
    ];
    // First the component needs to be rendered. getByTitle doesn't need to be used
    // eslint-disable-next-line no-unused-vars
    const { getByTitle } = render(
      <TableCard
        id="table-list"
        title="Open Alerts"
        content={{
          columns: tableColumns,
          thresholds: customThresholds,
        }}
        values={tableData}
        size={CARD_SIZES.LARGEWIDE}
      />
    );

    // Then get all of the th elements. This is how the ordering will be determined
    const tableHeader = document.getElementsByTagName('th');
    // The within function comes in SUPER handy here
    const countSeverityIndex = 1;
    const { getByText } = within(tableHeader[countSeverityIndex]);
    expect(getByText('Count Severity')).toBeTruthy();

    const hourSeverityIndex = 3;
    const { getByText: getByTextHour } = within(tableHeader[hourSeverityIndex]);
    expect(getByTextHour('Hour Severity')).toBeTruthy();

    const pressureSeverityIndex = 5;
    const { getByText: getByTextPressure } = within(tableHeader[pressureSeverityIndex]);
    expect(getByTextPressure('Pressure Severity')).toBeTruthy();
  });
  test('threshold icon labels should not display when showSeverityLabel is false', () => {
    const customThresholds = [
      {
        dataSourceId: 'pressure',
        comparison: '>=',
        value: 10,
        severity: 1,
      },
      {
        dataSourceId: 'count',
        comparison: '<',
        value: 5,
        severity: 3,
        showSeverityLabel: false,
      },
      {
        dataSourceId: 'count',
        comparison: '=',
        value: 7,
        severity: 2,
        showSeverityLabel: false,
      },
    ];
    const { queryByText, queryAllByText } = render(
      <TableCard
        id="table-list"
        title="Open Alerts"
        content={{
          columns: tableColumns,
          thresholds: customThresholds,
          expandedRows: [
            {
              id: 'pressure',
              label: 'Pressure',
            },
          ],
        }}
        values={tableData}
        size={CARD_SIZES.LARGEWIDE}
      />
    );

    // The Pressure threshold is the only threshold that has a 'Critical' severity
    // and doesn't have showSeverityLabel: false, so it should be the only severity text to appear
    expect(queryAllByText(/Critical/g)).toHaveLength(3);
    expect(queryByText(/Moderate/g)).not.toBeInTheDocument();
    expect(queryByText(/Low/g)).not.toBeInTheDocument();
  });
  test('threshold icon label should not display default strings', () => {
    const customThresholds = [
      {
        dataSourceId: 'pressure',
        comparison: '>=',
        value: 10,
        severity: 1,
      },
      {
        dataSourceId: 'count',
        comparison: '<',
        value: 5,
        severity: 3,
        severityLabel: 'Lowest',
      },
      {
        dataSourceId: 'count',
        comparison: '=',
        value: 7,
        severity: 2,
        severityLabel: 'Medium',
      },
    ];
    const { queryByText, queryAllByText } = render(
      <TableCard
        id="table-list"
        title="Open Alerts"
        content={{
          columns: tableColumns,
          thresholds: customThresholds,
        }}
        values={tableData}
        size={CARD_SIZES.LARGETHIN}
      />
    );

    // Critical should exist as that is the only threshold that doesn't have custom label text
    expect(queryAllByText(/^Critical$/g)).toHaveLength(3);
    // These are default labels, so they should not exist
    expect(queryByText(/^Moderate$/g)).not.toBeInTheDocument();
    expect(queryByText(/^Low$/g)).not.toBeInTheDocument();
    // These are the custom labels that should appear instead of the defaults above
    expect(queryAllByText(/^Medium$/g)).toHaveLength(1);
    expect(queryAllByText(/^Lowest$/g)).toHaveLength(5);
  });
});
