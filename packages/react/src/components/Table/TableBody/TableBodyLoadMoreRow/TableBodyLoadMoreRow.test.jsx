import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableBodyLoadMoreRow from './TableBodyLoadMoreRow';

const mockActions = {
  onRowLoadMore: jest.fn(),
};

const tableRowProps = {
  id: 'tableRow01',
  tableId: 'tableId',
  ordering: [{ columnId: 'col1', isHidden: false }],
  loadMoreText: 'Load more',
  nestingLevel: 1,
};

describe('TableBodyLoadMoreRow', () => {
  afterEach(() => {
    mockActions.onRowLoadMore.mockClear();
  });

  it('calls onRowLoadMore when load more id clicked', () => {
    render(
      <TableBodyLoadMoreRow
        {...tableRowProps}
        tableActions={mockActions}
        options={{
          hasRowExpansion: true,
        }}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(mockActions.onRowLoadMore).not.toHaveBeenCalled();
    userEvent.click(screen.getByRole('cell', { name: 'Load more' }));
    expect(mockActions.onRowLoadMore).toHaveBeenCalledWith(tableRowProps.id);
  });
});
