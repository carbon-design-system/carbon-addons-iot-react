import React from 'react';
import { render, screen } from '@testing-library/react';

import ListHeader from './ListHeader';

describe('ListHeader', () => {
  it('ListHeader gets rendered', () => {
    render(<ListHeader title="List Header" i18n={{}} />);
    expect(screen.getByText('List Header')).toBeTruthy();
  });

  it('ListHeader with defaultProps onChange function', () => {
    expect(ListHeader.defaultProps.search.onChange).toBeDefined();
    ListHeader.defaultProps.search.onChange();
  });

  it('ListHeader with no title', () => {
    render(<ListHeader i18n={{}} />);
    expect(screen.queryByText('List Header')).toBeNull();
  });
});
