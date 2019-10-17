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
  totalColumns: 1,
  id: 'tableRow',
  tableId: 'tableId',
  ordering: [{ columnId: 'col1', isHidden: false }],
  values: { col1: 'value1' },
};

describe('TableBodyRow', () => {
  test('shouldExpandOnRowClick', () => {
    // Should expand
    const tableRowExpandByDefault = mount(
      <TableBodyRow
        options={{ hasRowExpansion: true, shouldExpandOnRowClick: true }}
        tableActions={mockActions}
        {...tableRowProps}
      />
    );
    tableRowExpandByDefault.simulate('click');
    expect(mockActions.onRowClicked).toHaveBeenCalled();
    expect(mockActions.onRowExpanded).toHaveBeenCalledWith('tableRow', true);

    // Should collapse
    const tableRowCollapseByDefault = mount(
      <TableBodyRow
        isExpanded
        options={{ hasRowExpansion: true, shouldExpandOnRowClick: true }}
        tableActions={mockActions}
        {...tableRowProps}
      />
    );
    tableRowCollapseByDefault.childAt(0).simulate('click');
    expect(mockActions.onRowClicked).toHaveBeenCalled();
    expect(mockActions.onRowExpanded).toHaveBeenCalledWith('tableRow', false);

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
  test('verify rendering with undefined column', () => {
    const tableRowPropsWithUndefined = {
      tableId: 'tableId',
      totalColumns: 1,
      id: 'tableRow',
      columns: [{ id: 'col1' }, { id: 'col2' }],
      ordering: [{ columnId: 'col1' }, { columnId: 'col2' }],
      values: { col1: 'value1', col2: undefined },
    };
    const wrapper = mount(
      <TableBodyRow tableActions={mockActions} {...tableRowPropsWithUndefined} />
    );
    expect(wrapper).toBeDefined();
  });
  test('verify custom cell renderer', () => {
    const customRenderDataFunction = ({ value, columnId, rowId, row }) => (
      <div id={value}>
        {value} {columnId} {rowId} {JSON.stringify(row)}
      </div>
    );
    const tableRowPropsWithCustomRenderer = {
      tableId: 'tableId',
      totalColumns: 1,
      id: 'tableRow',
      ordering: [
        { columnId: 'col1', renderDataFunction: customRenderDataFunction },
        { columnId: 'col2' },
      ],
      values: { col1: 'value1', col2: 'value2' },
    };
    const wrapper = mount(
      <TableBodyRow
        options={{ hasRowExpansion: true }}
        tableActions={mockActions}
        {...tableRowPropsWithCustomRenderer}
      />
    );
    const customCell = wrapper.find('#value1').at(0);
    expect(customCell).toBeDefined();
    expect(customCell.text()).toContain('value1');
    expect(customCell.text()).toContain('col1');
    expect(customCell.text()).toContain('col2');
    expect(customCell.text()).toContain('value2');
  });

  test('hasRowMultiSelect', () => {
    const mockRowSelection = jest.fn();
    const mockRowClicked = jest.fn();
    const tableRowPropsWithSelection = {
      tableId: 'tableId',
      totalColumns: 2,
      id: 'tableRow',
      options: { hasRowSelection: 'multi' },
      tableActions: { onRowSelected: mockRowSelection, onRowClicked: mockRowClicked },
      columns: [{ id: 'col1' }, { id: 'col2' }],
      ordering: [{ columnId: 'col1' }, { columnId: 'col2' }],
      values: { col1: 'value1', col2: undefined },
    };
    const wrapper = mount(
      <TableBodyRow tableActions={mockActions} {...tableRowPropsWithSelection} />
    );
    wrapper
      .find('input')
      .simulate('click', { preventDefault: () => true, stopPropagation: () => true });
    expect(mockRowSelection).toHaveBeenCalled();
  });

  test('hasRowSingleSelection', () => {
    const tableBodyRow = mount(
      <TableBodyRow
        options={{ hasRowSelection: 'single' }}
        tableActions={mockActions}
        {...tableRowProps}
      />
    );
    tableBodyRow.simulate('click');
    expect(mockActions.onRowSelected).toHaveBeenCalled();
    expect(mockActions.onRowClicked).toHaveBeenCalled();
  });
});
