import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import EmptyTable from '../EmptyTable';

const commonTableProps = {
  id: 'tableid',
  totalColumns: 3,
  isFiltered: false,
};

describe('EmptyTable', () => {
  it('should be selectable by testID and testId', () => {
    const { rerender } = render(
      <EmptyTable
        {...commonTableProps}
        emptyState={<span>my custom element</span>}
        testID="EMPTY"
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(screen.getByTestId('EMPTY')).toBeDefined();

    rerender(
      <EmptyTable
        {...commonTableProps}
        emptyState={<span>my custom element</span>}
        testId="empty"
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(screen.getByTestId('empty')).toBeDefined();
  });
  it('custom empty state', () => {
    render(<EmptyTable {...commonTableProps} emptyState={<span>my custom element</span>} />, {
      container: document.body.appendChild(document.createElement('table')),
    });
    expect(screen.queryAllByText('my custom element')).toHaveLength(1);
  });
  it('no empty state action does not render button', () => {
    render(
      <EmptyTable
        {...commonTableProps}
        emptyState={{ message: 'I am empty', buttonLabel: 'clickme' }}
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(screen.queryAllByText('I am empty')).toHaveLength(1);
    expect(screen.queryAllByText('clickme')).toHaveLength(0);
  });
  it('empty state action with custom button', () => {
    const mockEmptyStateAction = jest.fn();
    render(
      <EmptyTable
        {...commonTableProps}
        emptyState={{
          message: 'I am empty',
          buttonLabel: 'clickme',
        }}
        onEmptyStateAction={mockEmptyStateAction}
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );

    expect(screen.queryAllByText('I am empty')).toHaveLength(1);
    expect(screen.queryAllByText('clickme')).toHaveLength(1);
    fireEvent.click(screen.getByText('clickme'));
    expect(mockEmptyStateAction).toHaveBeenCalled();
  });
  it('empty state action with custom filtered button', () => {
    const mockEmptyStateAction = jest.fn();
    render(
      <EmptyTable
        {...commonTableProps}
        isFiltered
        emptyState={{
          message: 'I am empty',
          messageWithFilters: 'I am filter',
          buttonLabelWithFilters: 'clickmyfilters',
        }}
        onEmptyStateAction={mockEmptyStateAction}
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );
    expect(screen.queryAllByText('I am filter')).toHaveLength(1);
    expect(screen.queryAllByText('clickmyfilters')).toHaveLength(1);
    fireEvent.click(screen.getByText('clickmyfilters'));
    expect(mockEmptyStateAction).toHaveBeenCalled();
  });
});
