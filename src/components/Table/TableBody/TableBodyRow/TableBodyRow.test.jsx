import React from 'react';
import { mount } from 'enzyme';

import TableBodyRow from './TableBodyRow';

const mockActions = {
  onRowSelected: jest.fn(),
  onRowClicked: jest.fn(),
  onRowExpanded: jest.fn(),
  onApplyRowAction: jest.fn(),
};

const tableRowProps = {
  tableId: 'tableId',
  totalColumns: 1,
  id: 'tableRow',
  columns: [{ id: 'col1' }],
  children: { col1: 'value1' },
};

describe('TableBodyRow', () => {
  test('shouldExpandOnRowClick', () => {
    const tableRowExpandByDefault = mount(
      <TableBodyRow
        options={{ hasRowExpansion: true, shouldExpandOnRowClick: true }}
        tableActions={mockActions}
        {...tableRowProps}
      />
    );
    tableRowExpandByDefault.simulate('click');
    expect(mockActions.onRowClicked).toHaveBeenCalled();
    expect(mockActions.onRowExpanded).toHaveBeenCalled();

    mockActions.onRowClicked.mockClear();
    mockActions.onRowExpanded.mockClear();

    const tableRow = mount(
      <TableBodyRow
        options={{ hasRowExpansion: true }}
        tableActions={mockActions}
        {...tableRowProps}
      />
    );
    tableRow.simulate('click');
    expect(mockActions.onRowClicked).toHaveBeenCalled();
    expect(mockActions.onRowExpanded).not.toHaveBeenCalled();
  });
});
