import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableToolbarAdvancedFilterFlyout from './TableToolbarAdvancedFilterFlyout';

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
describe('TableToolbarAdvancedFilterFlyout', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 900,
      y: 300,
      height: 200,
      width: 400,
      top: 300,
      bottom: 500,
      left: 500,
      right: 900,
    }));
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should use defaults when no i18n provided', () => {
    render(
      <TableToolbarAdvancedFilterFlyout
        columns={[
          {
            id: 'test-column',
            name: 'Test Column',
            isFilterable: false,
            placeholderText: 'place-holder-text-for-test-column',
          },
          {
            id: 'string-column',
            name: 'String Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-string-column',
          },
          {
            id: 'number-column',
            name: 'Number Column',
            isFilterable: true,
          },
          {
            id: 'select-column',
            name: 'Select Column',
            isFilterable: true,
            options: [
              { text: 'option-A', id: 'option-A' },
              { text: 'option-B', id: 'option-B' },
              { text: 'option-C', id: 'option-C' },
            ],
          },
          {
            id: 'multi-select-column',
            name: 'Select Column',
            isFilterable: true,
            options: [
              { text: 'option-X', id: 'option-X' },
              { text: 'option-Y', id: 'option-Y' },
              { text: 'option-Z', id: 'option-Z' },
            ],
            isMultiselect: true,
          },
        ]}
        i18n={null}
        tableState={{
          ordering: [
            {
              isHidden: false,
              columnId: 'test-column',
            },
            {
              isHidden: false,
              columnId: 'string-column',
            },
            {
              isHidden: false,
              columnId: 'number-column',
            },
            {
              isHidden: false,
              columnId: 'select-column',
            },
            {
              isHidden: false,
              columnId: 'multi-select-column',
            },
          ],
          filters: [
            {
              columnId: 'number-column',
              value: '16',
            },
            {
              columnId: 'select-column',
              value: 'option-A',
            },
          ],
          advancedFilterFlyoutOpen: true,
        }}
      />
    );

    expect(screen.getByRole('tab', { name: 'Simple filters' })).toBeVisible();
    // this column is not filterable, so it should not appear.
    expect(screen.queryByPlaceholderText('place-holder-text-for-test-column')).toBeNull();
    expect(screen.getByPlaceholderText('place-holder-text-for-string-column')).toBeVisible();
    expect(screen.getByPlaceholderText('Type and hit enter to apply')).toBeVisible();
    expect(
      within(screen.getByTestId('advanced-filter-flyout')).queryAllByPlaceholderText(
        'Choose an option'
      )
    ).not.toBeNull();
  });

  it('should not clear filters when isDisabled is true', () => {
    const handleApplyFilter = jest.fn();
    render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyFilter: handleApplyFilter,
        }}
        columns={[
          {
            id: 'test-column',
            name: 'Test Column',
            isFilterable: false,
            placeholderText: 'place-holder-text-for-test-column',
          },
          {
            id: 'string-column',
            name: 'String Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-string-column',
          },
          {
            id: 'number-column',
            name: 'Number Column',
            isFilterable: true,
          },
          {
            id: 'select-column',
            name: 'Select Column',
            isFilterable: true,
            options: [
              { text: 'option-A', id: 'option-A' },
              { text: 'option-B', id: 'option-B' },
              { text: 'option-C', id: 'option-C' },
            ],
          },
          {
            id: 'multi-select-column',
            name: 'Select Column',
            isFilterable: true,
            options: [
              { text: 'option-X', id: 'option-X' },
              { text: 'option-Y', id: 'option-Y' },
              { text: 'option-Z', id: 'option-Z' },
            ],
            isMultiselect: true,
          },
        ]}
        i18n={null}
        tableState={{
          ordering: [
            {
              isHidden: false,
              columnId: 'test-column',
            },
            {
              isHidden: false,
              columnId: 'string-column',
            },
            {
              isHidden: false,
              columnId: 'number-column',
            },
            {
              isHidden: false,
              columnId: 'select-column',
            },
            {
              isHidden: false,
              columnId: 'multi-select-column',
            },
          ],
          filters: [
            {
              columnId: 'number-column',
              value: '16',
            },
            {
              columnId: 'select-column',
              value: 'option-A',
            },
          ],
          advancedFilterFlyoutOpen: true,
          isDisabled: true,
        }}
      />
    );
    const numberInputClear = screen.getByRole('button', { name: 'Clear filter' });
    userEvent.click(numberInputClear);
    expect(handleApplyFilter).toHaveBeenCalledTimes(1);
  });

  it('should handle multi-select columns, too', () => {
    const handleApplyFilter = jest.fn();
    render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyFilter: handleApplyFilter,
        }}
        columns={[
          {
            id: 'test-column',
            name: 'Test Column',
            isFilterable: false,
            placeholderText: 'place-holder-text-for-test-column',
          },
          {
            id: 'string-column',
            name: 'String Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-string-column',
          },
          {
            id: 'number-column',
            name: 'Number Column',
            isFilterable: true,
          },
          {
            id: 'select-column',
            name: 'Select Column',
            isFilterable: true,
            options: [
              { text: 'option-A', id: 'option-A' },
              { text: 'option-B', id: 'option-B' },
              { text: 'option-C', id: 'option-C' },
            ],
          },
          {
            id: 'multi-select-column',
            name: 'Multi-Select Column',
            isFilterable: true,
            options: [
              { text: 'option-X', id: 'option-X' },
              { text: 'option-Y', id: 'option-Y' },
              { text: 'option-Z', id: 'option-Z' },
            ],
            isMultiselect: true,
          },
        ]}
        i18n={null}
        tableState={{
          ordering: [
            {
              isHidden: false,
              columnId: 'test-column',
            },
            {
              isHidden: false,
              columnId: 'string-column',
            },
            {
              isHidden: false,
              columnId: 'number-column',
            },
            {
              isHidden: false,
              columnId: 'select-column',
            },
            {
              isHidden: false,
              columnId: 'multi-select-column',
            },
          ],
          filters: [
            {
              columnId: 'number-column',
              value: '16',
            },
            {
              columnId: 'select-column',
              value: 'option-A',
            },
            {
              columnId: 'multi-select-column',
              value: ['option-X', 'option-Y'],
            },
          ],
          advancedFilterFlyoutOpen: true,
          isDisabled: true,
        }}
      />
    );
    userEvent.click(screen.getAllByTitle('Clear selection')[1]);
    expect(handleApplyFilter).toHaveBeenLastCalledWith({
      advanced: {
        filterId: null,
      },
      simple: {
        'select-column': 'option-A',
        'number-column': '16',
        'multi-select-column': [],
      },
    });
    userEvent.click(screen.getAllByLabelText('Multi-Select Column')[1]);
    userEvent.click(within(screen.getByTestId('advanced-filter-flyout')).getByText('option-X'));
    expect(handleApplyFilter).toHaveBeenLastCalledWith({
      advanced: {
        filterId: null,
      },
      simple: {
        'select-column': 'option-A',
        'number-column': '16',
        'multi-select-column': ['option-X'],
      },
    });
  });
});
