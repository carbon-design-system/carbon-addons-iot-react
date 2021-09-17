import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableHeader, { translateWithId, translationKeys, sortStates } from './TableHeader';

describe('TableHeader', () => {
  it('should translate ids correctly', () => {
    expect(
      translateWithId(translationKeys.iconDescription, {
        isSortHeader: true,
        sortDirection: sortStates.NONE,
      })
    ).toBe('Sort rows by this header in ascending order');
    expect(
      translateWithId(translationKeys.iconDescription, {
        isSortHeader: true,
        sortDirection: sortStates.ASC,
      })
    ).toBe('Sort rows by this header in descending order');
    expect(
      translateWithId(translationKeys.iconDescription, {
        isSortHeader: true,
        sortDirection: sortStates.DESC,
      })
    ).toBe('Un sort rows by this header');
    expect(
      translateWithId(translationKeys.iconDescription, {
        isSortHeader: true,
        sortDirection: undefined,
      })
    ).toBe('Un sort rows by this header');
    expect(
      translateWithId(translationKeys.iconDescription, {
        isSortHeader: false,
        sortDirection: sortStates.DESC,
      })
    ).toBe('Sort rows by this header in ascending order');
    expect(
      translateWithId(translationKeys.iconDescription, {
        isSortHeader: false,
      })
    ).toBe('Sort rows by this header in ascending order');
    expect(
      translateWithId(undefined, {
        isSortHeader: false,
      })
    ).toBe('');
  });

  it('should use the default onClick', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeader data-testid="test-header" isSortable />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByTestId('test-header')).toBeDefined();
    expect(() => userEvent.click(screen.getByTestId('test-header'))).not.toThrowError();
  });
});
