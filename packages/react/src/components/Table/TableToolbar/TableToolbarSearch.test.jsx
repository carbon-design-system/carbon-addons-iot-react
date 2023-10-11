import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { settings } from '../../../constants/Settings';

import TableToolbarSearch from './TableToolbarSearch';

const { prefix } = settings;

describe('TableToolbarSearch', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be accessible by test id', () => {
    render(
      <TableToolbarSearch
        tableId="table-1"
        options={{
          hasFastSearch: true,
          hasUserViewManagement: true,
        }}
        actions={{
          onApplySearch: jest.fn(),
          onSearchExpand: jest.fn(),
        }}
        tableState={{
          search: {
            isExpanded: false,
            defaultValue: '',
          },
          isDisabled: false,
        }}
        testId="table-1"
      />
    );
    expect(screen.getByTestId('table-1-search')).toBeDefined();
  });

  it('should render default value', () => {
    render(
      <TableToolbarSearch
        tableId="table-1"
        options={{
          hasFastSearch: true,
          hasUserViewManagement: true,
        }}
        actions={{
          onApplySearch: jest.fn(),
          onSearchExpand: jest.fn(),
        }}
        tableState={{
          search: {
            isExpanded: false,
            defaultValue: 'Default search',
          },
          isDisabled: false,
        }}
        testId="table-1"
      />
    );
    expect(screen.getByRole('searchbox')).toHaveValue('Default search');
  });

  it('should expand on focus', () => {
    render(
      <TableToolbarSearch
        tableId="table-1"
        options={{
          hasFastSearch: true,
          hasUserViewManagement: true,
        }}
        actions={{
          onApplySearch: jest.fn(),
          onSearchExpand: jest.fn(),
        }}
        tableState={{
          search: {
            isExpanded: false,
            defaultValue: 'Default search',
          },
          isDisabled: false,
        }}
        testId="table-1"
      />
    );
    const searchWrapper = screen.getByRole('search');
    fireEvent.focus(searchWrapper);
    expect(searchWrapper).toHaveClass(`${prefix}--toolbar-search-container-active`);
  });
});
