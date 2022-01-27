import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableBodyLoadMoreRow from './TableBodyLoadMoreRow';

const tableRowPropsNotLoading = {
  id: 'tableRow01',
  tableId: 'tableId',
  testId: 'table-test',
  totalColumns: 5,
  loadMoreText: 'Load more...',
  isLoadingMore: false,
};

const tableRowPropsLoading = {
  id: 'tableRow01',
  tableId: 'tableId',
  testId: 'table-test',
  totalColumns: 5,
  loadMoreText: 'Load more...',
  isLoadingMore: true,
};

describe('TableBodyLoadMoreRow', () => {
  it('calls onRowLoadMore when load more is clicked', () => {
    const mockLoadMore = jest.fn();
    render(
      <TableBodyLoadMoreRow
        {...tableRowPropsNotLoading}
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
    userEvent.click(screen.getByRole('button', { name: tableRowPropsNotLoading.loadMoreText }));
    expect(mockLoadMore).toHaveBeenCalledWith(tableRowPropsNotLoading.id);
  });

  it('renders a skeleton while loading', () => {
    const mockLoadMore = jest.fn();
    render(
      <TableBodyLoadMoreRow
        {...tableRowPropsLoading}
        onRowLoadMore={mockLoadMore}
        options={{
          hasRowExpansion: true,
        }}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(screen.getAllByTestId('table-test-tableRow01-skeleton').length).toEqual(
      tableRowPropsLoading.totalColumns
    );
  });
});
