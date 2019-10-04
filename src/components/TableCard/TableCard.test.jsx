import React from 'react';
import { mount } from 'enzyme';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { tableColumns, tableData, actions2 } from '../../utils/sample';

import TableCard, { findMatchingThresholds } from './TableCard';

describe('TableCard', () => {
  test('findMatchingThresholds', () => {
    const thresholds = [
      { comparison: '>', dataSourceId: 'airflow_mean', severity: 3, value: 2 },
      { comparison: '>', dataSourceId: 'airflow_mean', severity: 1, value: 2.2 },
      { comparison: '>', dataSourceId: 'airflow_max', severity: 3, value: 4 },
      { comparison: '>', dataSourceId: 'airflow_max', severity: 1, value: 4.5 },
    ];
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
    const thresholds = [
      { comparison: '>', dataSourceId: 'airflow_mean', severity: 3, value: 2 },
      { comparison: '>', dataSourceId: 'airflow_mean', severity: 1, value: 2.2 },
      { comparison: '>', dataSourceId: 'airflow_max', severity: 3, value: 4 },
      { comparison: '>', dataSourceId: 'airflow_max', severity: 1, value: 4.5 },
    ];
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
        size={CARD_SIZES.XLARGE}
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
  test('Columns displayed Tall', () => {
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        size={CARD_SIZES.TALL}
      />
    );

    const totalColumns = tableColumns.filter(item => item.priority === 1);
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
});
