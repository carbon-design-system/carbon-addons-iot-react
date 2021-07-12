import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
  columns: [
    {
      id: 'col1',
      name: 'col1',
    },
  ],
};

describe('TableBodyRow', () => {
  it('shouldExpandOnRowClick', () => {
    // Should expand
    const { rerender, container } = render(
      <TableBodyRow
        options={{
          hasRowExpansion: true,
          shouldExpandOnRowClick: true,
          wrapCellText: 'always',
          truncateCellText: true,
        }}
        tableActions={mockActions}
        {...tableRowProps}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    userEvent.click(container.querySelector('tr'));
    userEvent.click(screen.queryByRole('button', { name: 'Click to expand.' }));
    expect(mockActions.onRowClicked).toHaveBeenCalled();
    expect(mockActions.onRowExpanded).toHaveBeenCalledWith('tableRow', true);

    // Should collapse
    rerender(
      <TableBodyRow
        isExpanded
        options={{
          hasRowExpansion: true,
          shouldExpandOnRowClick: true,
          wrapCellText: 'always',
          truncateCellText: true,
        }}
        tableActions={mockActions}
        {...tableRowProps}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    userEvent.click(screen.queryByRole('button', { name: 'Click to collapse.' }));
    expect(mockActions.onRowClicked).toHaveBeenCalled();
    expect(mockActions.onRowExpanded).toHaveBeenCalledWith('tableRow', false);

    mockActions.onRowClicked.mockClear();
    mockActions.onRowExpanded.mockClear();

    rerender(
      <TableBodyRow
        options={{ hasRowExpansion: true, wrapCellText: 'always', truncateCellText: true }}
        tableActions={mockActions}
        {...tableRowProps}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    userEvent.click(container.querySelector('tr'));
    expect(mockActions.onRowClicked).toHaveBeenCalled();
    expect(mockActions.onRowExpanded).not.toHaveBeenCalled();
  });
  it('verify rendering with undefined column', () => {
    const tableRowPropsWithUndefined = {
      tableId: 'tableId',
      totalColumns: 1,
      id: 'tableRow',
      columns: [
        { id: 'col1', name: 'col1' },
        { id: 'col2', name: 'col2' },
      ],
      ordering: [{ columnId: 'col1' }, { columnId: 'col2' }],
      values: { col1: 'value1', col2: undefined },
      options: {
        wrapCellText: 'always',
        truncateCellText: true,
      },
    };
    const { container } = render(
      <TableBodyRow tableActions={mockActions} {...tableRowPropsWithUndefined} />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(container).toBeDefined();
  });
  it('verify custom cell renderer', () => {
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
      columns: [
        { id: 'col1', name: 'col1' },
        { id: 'col2', name: 'col2' },
      ],
      values: { col1: 'value1', col2: 'value2' },
    };
    const { container } = render(
      <TableBodyRow
        options={{ hasRowExpansion: true, wrapCellText: 'always', truncateCellText: true }}
        tableActions={mockActions}
        {...tableRowPropsWithCustomRenderer}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );

    const customCell = container.querySelectorAll('#value1')[0];
    expect(customCell).toBeDefined();
    expect(customCell.innerHTML).toContain('value1');
    expect(customCell.innerHTML).toContain('col1');
    expect(customCell.innerHTML).toContain('col2');
    expect(customCell.innerHTML).toContain('value2');
  });

  it('hasRowMultiSelect', () => {
    const mockRowSelection = jest.fn();
    const mockRowClicked = jest.fn();
    const tableRowPropsWithSelection = {
      tableId: 'tableId',
      totalColumns: 2,
      id: 'tableRow',
      options: { hasRowSelection: 'multi', wrapCellText: 'always', truncateCellText: true },
      tableActions: {
        onRowSelected: mockRowSelection,
        onRowClicked: mockRowClicked,
      },
      columns: [
        { id: 'col1', name: 'col1' },
        { id: 'col2', name: 'col2' },
      ],
      ordering: [{ columnId: 'col1' }, { columnId: 'col2' }],
      values: { col1: 'value1', col2: undefined },
    };
    render(<TableBodyRow tableActions={mockActions} {...tableRowPropsWithSelection} />, {
      container: document.body.appendChild(document.createElement('tbody')),
    });
    userEvent.click(screen.queryByLabelText('Select row'));
    expect(mockRowSelection).toHaveBeenCalled();
  });

  it('hasRowSingleSelection', () => {
    const { container } = render(
      <TableBodyRow
        options={{ hasRowSelection: 'single', wrapCellText: 'always', truncateCellText: true }}
        tableActions={mockActions}
        {...tableRowProps}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    userEvent.click(container.querySelector('tr'));
    expect(mockActions.onRowSelected).toHaveBeenCalled();
    expect(mockActions.onRowClicked).toHaveBeenCalled();
  });

  it('adds an extra cell for the expander column when showExpanderColumn is true', () => {
    const { container } = render(
      <TableBodyRow
        showExpanderColumn
        tableActions={mockActions}
        options={{ wrapCellText: 'always', truncateCellText: true }}
        {...tableRowProps}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(container.querySelectorAll('td').length).toEqual(2);
  });
});
