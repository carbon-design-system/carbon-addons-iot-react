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

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  });

  it('should not clear filters when isDisabled is true', () => {
    const handleApplyFilter = jest.fn();
    render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyAdvancedFilter: handleApplyFilter,
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
    expect(handleApplyFilter).toHaveBeenCalledTimes(0);
  });

  it('should handle multi-select columns, too', () => {
    const handleApplyFilter = jest.fn();
    render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyAdvancedFilter: handleApplyFilter,
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
        }}
      />
    );
    userEvent.click(screen.getAllByTitle('Clear selection')[1]);
    userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(handleApplyFilter).toHaveBeenLastCalledWith({
      advanced: {
        filterIds: [],
      },
      simple: {
        'select-column': 'option-A',
        'number-column': '16',
        'multi-select-column': [],
      },
    });
    userEvent.click(screen.getByLabelText('Multi-Select Column'));
    userEvent.click(within(screen.getByTestId('advanced-filter-flyout')).getByText('option-X'));
    userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(handleApplyFilter).toHaveBeenLastCalledWith({
      advanced: {
        filterIds: [],
      },
      simple: {
        'select-column': 'option-A',
        'number-column': '16',
        'multi-select-column': ['option-X'],
      },
    });
  });

  it('should handle date columns, too', () => {
    const handleApplyFilter = jest.fn();
    const date = new Date();
    render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyAdvancedFilter: handleApplyFilter,
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
            id: 'date-column',
            name: 'Date Column',
            isFilterable: true,
            isDate: true,
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
              columnId: 'date-column',
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
              columnId: 'date-column',
              value: date,
            },
          ],
          advancedFilterFlyoutOpen: true,
        }}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(handleApplyFilter).toHaveBeenLastCalledWith({
      advanced: {
        filterIds: [],
      },
      simple: {
        'select-column': 'option-A',
        'number-column': '16',
        'date-column': date,
      },
    });
    userEvent.type(screen.getByPlaceholderText('yyyy-mm-dd'), '2020-01-20');
    expect(screen.getByPlaceholderText('yyyy-mm-dd').value).toEqual('2020-01-20');
    userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    expect(handleApplyFilter).toHaveBeenLastCalledWith({
      advanced: {
        filterIds: [],
      },
      simple: {
        'select-column': 'option-A',
        'number-column': '16',
        'date-column': new Date('2020-01-20T06:00:00.000Z'),
      },
    });
  });

  it('should reset the filter state if on cancel is called', () => {
    const handleApplyFilter = jest.fn();
    const handleCancelFilter = jest.fn();
    render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyAdvancedFilter: handleApplyFilter,
          onCancelAdvancedFilter: handleCancelFilter,
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
        }}
      />
    );

    userEvent.type(
      screen.getByPlaceholderText('place-holder-text-for-string-column'),
      'a-test-string'
    );
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleCancelFilter).toHaveBeenCalledTimes(1);
    userEvent.click(screen.getByRole('button', { name: 'Apply filters' }));
    // 'a-test-string' should not appear, because 'Cancel' resets the state.
    expect(handleApplyFilter).toHaveBeenLastCalledWith({
      advanced: {
        filterIds: [],
      },
      simple: {
        'select-column': 'option-A',
        'number-column': '16',
        'multi-select-column': ['option-X', 'option-Y'],
      },
    });
  });

  it('should update the filter state and call onApply when new props are passed.', () => {
    const onApplyAdvancedFilter = jest.fn();
    const onCancelAdvancedFilter = jest.fn();
    const { rerender } = render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyAdvancedFilter,
          onCancelAdvancedFilter,
        }}
        columns={[
          {
            id: 'test-column',
            name: 'Test Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-test-column',
          },
          {
            id: 'string-column',
            name: 'String Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-string-column',
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
          ],
          filters: [
            {
              columnId: 'test-column',
              value: 'test',
            },
          ],
          advancedFilterFlyoutOpen: true,
        }}
      />
    );

    expect(screen.getByLabelText('Test Column')).toBeVisible();
    userEvent.click(screen.getByLabelText('Test Column'));
    expect(screen.getByLabelText('Test Column')).toHaveValue('test');

    rerender(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyAdvancedFilter,
          onCancelAdvancedFilter,
        }}
        columns={[
          {
            id: 'test-column',
            name: 'Test Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-test-column',
          },
          {
            id: 'string-column',
            name: 'String Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-string-column',
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
          ],
          filters: [
            {
              columnId: 'test-column',
              value: 'test',
            },
            {
              columnId: 'string-column',
              value: 'string',
            },
          ],
          advancedFilterFlyoutOpen: true,
        }}
      />
    );
    expect(onApplyAdvancedFilter).toHaveBeenCalled();
  });

  it("should not clear filters on 'Enter' if isDisabled:true", () => {
    const onApplyAdvancedFilter = jest.fn();
    const onCancelAdvancedFilter = jest.fn();
    render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyAdvancedFilter,
          onCancelAdvancedFilter,
        }}
        columns={[
          {
            id: 'test-column',
            name: 'Test Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-test-column',
          },
        ]}
        i18n={null}
        tableState={{
          ordering: [
            {
              isHidden: false,
              columnId: 'test-column',
            },
          ],
          filters: [
            {
              columnId: 'test-column',
              value: 'test',
            },
          ],
          advancedFilterFlyoutOpen: true,
        }}
        isDisabled
      />
    );

    userEvent.type(screen.getByTitle('Clear filter'), '{enter}', { skipClick: true });
    expect(onApplyAdvancedFilter).not.toBeCalled();
  });

  it('should set initial selected value on multiselect from value passed in columns', () => {
    const onApplyAdvancedFilter = jest.fn();
    const onCancelAdvancedFilter = jest.fn();
    render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyAdvancedFilter,
          onCancelAdvancedFilter,
        }}
        columns={[
          {
            id: 'test-column',
            name: 'Test Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-test-column',
            isMultiselect: true,
            options: [
              {
                id: 'test-column-value',
                text: 'test-column-value',
              },
              {
                id: 'another-test-column-value',
                text: 'Another test column value',
              },
            ],
          },
          {
            id: 'string-column',
            name: 'String Column',
            isFilterable: true,
            placeholderText: 'place-holder-text-for-string-column',
            isMultiselect: true,
            options: [
              {
                id: 'string-column-value',
                text: 'string-column-value',
              },
              {
                id: 'another-string-column-value',
                text: 'Another string column value',
              },
            ],
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
          ],
          filters: [
            {
              columnId: 'test-column',
              value: 'test-column-value',
            },
            {
              columnId: 'string-column',
              value: [
                {
                  id: 'string-column-value',
                  text: 'string-column-value',
                },
              ],
            },
          ],
          advancedFilterFlyoutOpen: true,
        }}
        isDisabled
      />
    );

    const selected = screen.getAllByTitle('1');
    expect(selected).toHaveLength(2);
    expect(selected[0]).toBeVisible();
    expect(selected[1]).toBeVisible();
    userEvent.click(screen.getByLabelText('Test Column'));
    expect(screen.getByText('test-column-value')).toHaveAttribute(
      'data-contained-checkbox-state',
      'true'
    );
    userEvent.click(screen.getByLabelText('String Column'));
    expect(screen.getByText('string-column-value')).toHaveAttribute(
      'data-contained-checkbox-state',
      'true'
    );
  });

  it('should not break on empty column array prop', () => {
    const onApplyAdvancedFilter = jest.fn();
    const onCancelAdvancedFilter = jest.fn();
    render(
      <TableToolbarAdvancedFilterFlyout
        actions={{
          onApplyAdvancedFilter,
          onCancelAdvancedFilter,
        }}
        columns={[]}
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
          ],
          filters: [
            {
              columnId: 'test-column',
              value: 'test-column-value',
            },
            {
              columnId: 'string-column',
              value: [
                {
                  id: 'string-column-value',
                  text: 'string-column-value',
                },
              ],
            },
          ],
          advancedFilterFlyoutOpen: true,
        }}
        isDisabled
      />
    );

    expect(screen.getByTestId('advanced-filter-flyout-container')).toBeVisible();
  });
});
