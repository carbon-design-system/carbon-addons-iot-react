import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../../../constants/Settings';

import TableBodyLoadMoreRow from './TableBodyLoadMoreRow';

const { prefix } = settings;

const getTableRowProps = (overrides = {}) => ({
  id: 'tableRow01',
  tableId: 'tableId',
  testId: 'table-test',
  totalColumns: 5,
  loadMoreText: 'Load more...',
  isLoadingMore: false,
  rowVisibilityRef: null,
  hasRowActions: true,
  hasRowExpansion: false,
  hasRowNesting: true,
  hasRowSelection: false,
  showExpanderColumn: false,
  columns: [
    {
      id: 'string',
      name: 'String',
      isSortable: true,
    },
    {
      id: 'select',
      name: 'Select',
      isSortable: true,
    },
    {
      id: 'number',
      name: 'Number',
      isSortable: true,
    },
  ],
  ...overrides,
});

describe('TableBodyLoadMoreRow', () => {
  it('calls onRowLoadMore when load more is clicked', () => {
    const mockLoadMore = jest.fn();
    render(
      <TableBodyLoadMoreRow
        {...getTableRowProps()}
        onRowLoadMore={mockLoadMore}
        options={{
          hasRowExpansion: true,
        }}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(mockLoadMore).not.toHaveBeenCalled();
    userEvent.click(screen.getByRole('button', { name: getTableRowProps().loadMoreText }));
    expect(mockLoadMore).toHaveBeenCalledWith(getTableRowProps().id);
  });

  it('renders a skeleton while loading', () => {
    const mockLoadMore = jest.fn();
    const { container } = render(
      <TableBodyLoadMoreRow
        {...getTableRowProps({ isLoadingMore: true })}
        onRowLoadMore={mockLoadMore}
        options={{
          hasRowExpansion: true,
        }}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(container.rows[0].cells.length).toEqual(getTableRowProps().totalColumns);
    expect(container.getElementsByClassName(`${prefix}--skeleton__text`).length).toEqual(
      getTableRowProps().columns.length
    );
  });
});
