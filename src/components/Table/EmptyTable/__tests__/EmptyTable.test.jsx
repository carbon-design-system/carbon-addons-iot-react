import React from 'react';
import { render } from '@testing-library/react';

import EmptyTable from '../EmptyTable';

const commonTableProps = {
  id: 'tableid',
  totalColumns: 3,
  isFiltered: false,
};

describe('EmptyTable', () => {
  it('custom empty state', () => {
    const { queryAllByText } = render(
      <EmptyTable {...commonTableProps} emptyState={<span>my custom element</span>} />
    );
    expect(queryAllByText('my custom element')).toHaveLength(1);
  });
  it('no empty state action does not render button', () => {
    const { queryAllByText } = render(
      <EmptyTable
        {...commonTableProps}
        emptyState={{ message: 'I am empty', buttonLabel: 'clickme' }}
      />
    );
    expect(queryAllByText('I am empty')).toHaveLength(1);
    expect(queryAllByText('clickme')).toHaveLength(0);
  });
  it('empty state action with custom button', () => {
    const { queryAllByText } = render(
      <EmptyTable
        {...commonTableProps}
        emptyState={{
          message: 'I am empty',
          buttonLabel: 'clickme',
        }}
        onEmptyStateAction={jest.fn()}
      />
    );
    expect(queryAllByText('I am empty')).toHaveLength(1);
    expect(queryAllByText('clickme')).toHaveLength(1);
  });
  it('empty state action with custom filtered button', () => {
    const { queryAllByText } = render(
      <EmptyTable
        {...commonTableProps}
        isFiltered
        emptyState={{
          message: 'I am empty',
          buttonLabelWithFilters: 'clickmyfilters',
        }}
        onEmptyStateAction={jest.fn()}
      />
    );
    expect(queryAllByText('I am empty')).toHaveLength(1);
    expect(queryAllByText('clickmyfilters')).toHaveLength(1);
  });
});
