import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../../constants/Settings';

import TableHeader, { translateWithId, translationKeys, sortStates } from './TableHeader';

const { iotPrefix } = settings;

describe('TableHeader', () => {
  const wrapInTableRow = (th) => (
    <table>
      <thead>
        <tr>{th}</tr>
      </thead>
    </table>
  );

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
    render(wrapInTableRow(<TableHeader testId="test-header" isSortable />));

    expect(screen.getByTestId('test-header')).toBeDefined();
    expect(() => userEvent.click(screen.getByTestId('test-header'))).not.toThrowError();
  });

  it('should span column group row', () => {
    const { rerender } = render(wrapInTableRow(<TableHeader />));

    expect(screen.getByRole('columnheader')).not.toHaveClass(
      `${iotPrefix}--table-header--span-group-row`
    );
    expect(screen.getByRole('columnheader')).not.toHaveAttribute('rowspan', '2');

    rerender(wrapInTableRow(<TableHeader testId="test-header" spanGroupRow />));

    expect(screen.getByRole('columnheader')).toHaveClass(
      `${iotPrefix}--table-header--span-group-row`
    );
    expect(screen.getByRole('columnheader')).toHaveAttribute('rowspan', '2');
  });
});
