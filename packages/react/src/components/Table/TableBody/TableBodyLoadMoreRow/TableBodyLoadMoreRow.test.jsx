import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableBodyLoadMoreRow from './TableBodyLoadMoreRow';

const tableRowProps = {
  id: 'tableRow01',
  tableId: 'tableId',
  testId: 'table-test',
  totalColumns: 5,
  loadMoreText: 'Load more...',
  isLoadingMore: false,
};

describe('TableBodyLoadMoreRow', () => {
  it('calls onRowLoadMore when load more is clicked', () => {
    const mockLoadMore = jest.fn();
    render(
      <TableBodyLoadMoreRow
        {...tableRowProps}
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
    userEvent.click(screen.getByRole('button', { name: tableRowProps.loadMoreText }));
    expect(mockLoadMore).toHaveBeenCalledWith(tableRowProps.id);
  });
});
