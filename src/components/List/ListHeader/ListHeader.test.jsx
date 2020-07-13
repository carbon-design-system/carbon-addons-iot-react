import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ListHeader from './ListHeader';

describe('ListHeader', () => {
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

  it('ListHeader i18n string tests', () => {
    const i18nTest = {
      searchPlaceHolderText: 'enter-value',
    };

    const searchProp = {
      onChange: () => {},
      value: 'hello',
    };

    const i18nDefault = ListHeader.defaultProps.i18n;

    render(<ListHeader i18n={i18nTest} search={searchProp} />);

    expect(screen.getByText(i18nTest.searchPlaceHolderText)).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.searchPlaceHolderText)).not.toBeInTheDocument();
  });
});
