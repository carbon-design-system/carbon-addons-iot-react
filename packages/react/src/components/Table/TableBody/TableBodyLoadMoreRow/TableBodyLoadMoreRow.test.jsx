import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableBodyLoadMoreRow from './TableBodyLoadMoreRow';

const tableRowProps = {
  id: 'tableRow01',
  tableId: 'tableId',
  ordering: [{ columnId: 'col1', isHidden: false }],
  loadMoreText: 'Load more',
  nestingLevel: 1,
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
    userEvent.click(screen.getByRole('cell', { name: 'Load more' }));
    expect(mockLoadMore).toHaveBeenCalledWith(tableRowProps.id);
  });
});
