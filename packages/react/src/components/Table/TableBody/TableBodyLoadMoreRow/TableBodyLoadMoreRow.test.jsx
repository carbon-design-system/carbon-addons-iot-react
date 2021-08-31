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
  it('calls onRowLoadMore when load more id clicked', () => {
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
    userEvent.click(screen.getByTestId(`${tableRowProps.testId}-${tableRowProps.id}-load-more`));
    expect(mockLoadMore).toHaveBeenCalledWith(tableRowProps.id);
  });
});
