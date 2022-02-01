import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../../../constants/Settings';

import TableBodyLoadMoreRow from './TableBodyLoadMoreRow';

const { prefix } = settings;

const getTableRowPropsNotLoading = () => ({
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
});

const getTableRowPropsLoading = () => ({
  ...getTableRowPropsNotLoading(),
  isLoadingMore: true,
});

describe('TableBodyLoadMoreRow', () => {
  it('calls onRowLoadMore when load more is clicked', () => {
    const mockLoadMore = jest.fn();
    render(
      <TableBodyLoadMoreRow
        {...getTableRowPropsNotLoading()}
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
    userEvent.click(
      screen.getByRole('button', { name: getTableRowPropsNotLoading().loadMoreText })
    );
    expect(mockLoadMore).toHaveBeenCalledWith(getTableRowPropsNotLoading().id);
  });

  it('renders a skeleton while loading', () => {
    const mockLoadMore = jest.fn();
    const { container } = render(
      <TableBodyLoadMoreRow
        {...getTableRowPropsLoading()}
        onRowLoadMore={mockLoadMore}
        options={{
          hasRowExpansion: true,
        }}
      />,
      {
        container: document.body.appendChild(document.createElement('tbody')),
      }
    );
    expect(container.rows[0].cells.length).toEqual(getTableRowPropsLoading().totalColumns);
    expect(container.getElementsByClassName(`${prefix}--skeleton__text`).length).toEqual(
      getTableRowPropsNotLoading().columns.length
    );
  });
});
