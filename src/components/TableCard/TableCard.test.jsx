import React from 'react';
import { mount } from 'enzyme';

import { CARD_SIZES } from '../../constants/LayoutConstants';

import TableCard from './TableCard';
import { data } from './TableCard.story';

const renderCustomCell = ({ value: alert }) => {
  return (
    <div>
      <svg height="10" width="10">
        <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="red" />
      </svg>
      <span style={{ marginLeft: '10px' }}>{alert}</span>
    </div>
  );
};

const tableColumns = [
  {
    id: 'alert',
    name: 'Alert',
    renderDataFunction: renderCustomCell,
    priority: 1,
  },
  {
    id: 'creator',
    name: 'Creator',
    isSortable: true,
    priority: 3,
  },
  {
    id: 'hour',
    name: 'Hour',
    isSortable: true,
    priority: 2,
  },
];

const actions = {
  pagination: {
    /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
    onChangePage: jest.fn(),
  },
  table: {
    onChangeSort: jest.fn(),
  },
};

describe('TableCard', () => {
  test('Clicked row actions', () => {
    const onRowClick = jest.fn();

    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        columns={tableColumns}
        data={data}
        actions={actions}
        size={CARD_SIZES.LARGE}
        view={{
          pagination: {
            pageSize: 8,
            pageSizes: [8],
            page: 1,
            totalItems: data.length,
            isItemPerPageHidden: true,
          },
          table: {
            sort: {
              columnId: 'alert',
              direction: 'ASC',
            },
          },
        }}
        onRowActionClick={onRowClick}
      />
    );

    wrapper
      .find('Icon [name="icon--edit"]')
      .first()
      .simulate('click');

    expect(onRowClick.mock.calls).toHaveLength(1);
  });
  test('Columns displayed XLarge', () => {
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        columns={tableColumns}
        data={data}
        actions={actions}
        size={CARD_SIZES.XLARGE}
        view={{
          pagination: {
            pageSize: 8,
            pageSizes: [8],
            page: 1,
            totalItems: data.length,
            isItemPerPageHidden: true,
          },
          table: {
            sort: {
              columnId: 'alert',
              direction: 'ASC',
            },
          },
        }}
        onRowActionClick={jest.fn()}
      />
    );
    expect(wrapper.find('TableHeader').length).toBe(tableColumns.length + 1); // +1 for action column
  });
  test('Columns displayed Large', () => {
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        columns={tableColumns}
        data={data}
        actions={actions}
        size={CARD_SIZES.LARGE}
        view={{
          pagination: {
            pageSize: 8,
            pageSizes: [8],
            page: 1,
            totalItems: data.length,
            isItemPerPageHidden: true,
          },
          table: {
            sort: {
              columnId: 'alert',
              direction: 'ASC',
            },
          },
        }}
        onRowActionClick={jest.fn()}
      />
    );

    const totalColumns = tableColumns.filter(item => item.priority === 1 || item.priority === 2);
    expect(wrapper.find('TableHeader').length).toBe(totalColumns.length + 1); // +1 for action column
  });
  test('Columns displayed Tall', () => {
    const wrapper = mount(
      <TableCard
        title="Open Alerts"
        columns={tableColumns}
        data={data}
        actions={actions}
        size={CARD_SIZES.TALL}
        view={{
          pagination: {
            pageSize: 8,
            pageSizes: [8],
            page: 1,
            totalItems: data.length,
            isItemPerPageHidden: true,
          },
          table: {
            sort: {
              columnId: 'alert',
              direction: 'ASC',
            },
          },
        }}
        onRowActionClick={jest.fn()}
      />
    );

    const totalColumns = tableColumns.filter(item => item.priority === 1);
    expect(wrapper.find('TableHeader').length).toBe(totalColumns.length + 1); // +1 for action column
  });
});
