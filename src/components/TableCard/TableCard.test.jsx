import React from 'react';
import { mount } from 'enzyme';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { tableColumns, tableData } from '../../utils/sample';

import TableCard from './TableCard';

describe('TableCard', () => {
  test('Clicked row actions', () => {
    const onCardAction = jest.fn();

    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
          data: tableData,
        }}
        onCardAction={onCardAction}
        size={CARD_SIZES.LARGE}
      />
    );

    wrapper
      .find('Icon [name="icon--edit"]')
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
          data: tableData,
        }}
        size={CARD_SIZES.XLARGE}
      />
    );
    expect(wrapper.find('TableHeader').length).toBe(tableColumns.length + 1); // +1 for action column
  });
  test('Columns displayed Large', () => {
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
          data: tableData,
        }}
        size={CARD_SIZES.LARGE}
      />
    );

    const totalColumns = tableColumns.filter(item => item.priority === 1 || item.priority === 2);
    expect(wrapper.find('TableHeader').length).toBe(totalColumns.length + 1); // +1 for action column
  });
  test('Columns displayed Tall', () => {
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        content={{
          columns: tableColumns,
          data: tableData,
        }}
        size={CARD_SIZES.TALL}
      />
    );

    const totalColumns = tableColumns.filter(item => item.priority === 1);
    expect(wrapper.find('TableHeader').length).toBe(totalColumns.length + 1); // +1 for action column
  });
});
