import React from 'react';
import { render } from '@testing-library/react';

import ListHeader from './ListHeader';

describe('ListHeader tests', () => {
  it('ListHeader gets rendered', () => {
    const { getByText } = render(<ListHeader title="List Header" i18n={{}} />);
    expect(getByText('List Header')).toBeTruthy();
  });

  it('ListHeader with defaultProps onChange function', () => {
    expect(ListHeader.defaultProps.search.onChange).toBeDefined();
    ListHeader.defaultProps.search.onChange();
  });

  it('ListHeader with no title', () => {
    const { queryByText } = render(<ListHeader i18n={{}} />);
    expect(queryByText('List Header')).toBeNull();
  });
});
