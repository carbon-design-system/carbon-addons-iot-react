import React from 'react';
import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableMultiSortModal from './TableMultiSortModal';

const callbacks = {
  onAddMultiSortColumn: jest.fn(),
  onRemoveMultiSortColumn: jest.fn(),
  onSaveMultiSortColumns: jest.fn(),
  onCancelMultiSortColumns: jest.fn(),
  onClearMultiSortColumns: jest.fn(),
};
describe('TableMultiSortModal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be selectable by testId', () => {
    render(
      <TableMultiSortModal
        columns={[
          {
            id: 'string',
            name: 'String',
            isSortable: true,
          },
          {
            id: 'select',
            name: 'Select',
            isSortable: true,
          },
          {
            id: 'number',
            name: 'Number',
            isSortable: true,
          },
        ]}
        ordering={[
          {
            columnId: 'string',
            isHidden: false,
          },
          {
            columnId: 'select',
            isHidden: false,
          },
          {
            columnId: 'number',
            isHidden: false,
          },
        ]}
        actions={callbacks}
        sort={[
          {
            columnId: 'string',
            direction: 'ASC',
          },
        ]}
        showMultiSortModal
        testId="multi_sort_modal"
      />
    );

    expect(screen.getByTestId('multi_sort_modal')).toBeDefined();
  });
  it('should call callbacks when saving, canceling, adding or removing columns', () => {
    render(
      <TableMultiSortModal
        columns={[
          {
            id: 'string',
            name: 'String',
            isSortable: true,
          },
          {
            id: 'select',
            name: 'Select',
            isSortable: true,
          },
          {
            id: 'number',
            name: 'Number',
            isSortable: true,
          },
        ]}
        ordering={[
          {
            columnId: 'string',
            isHidden: false,
          },
          {
            columnId: 'select',
            isHidden: false,
          },
          {
            columnId: 'number',
            isHidden: false,
          },
        ]}
        actions={callbacks}
        sort={[
          {
            columnId: 'string',
            direction: 'ASC',
          },
        ]}
        showMultiSortModal
      />
    );

    expect(screen.getByLabelText('Sort by')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Add column' }));
    expect(screen.getByLabelText('Then by')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(callbacks.onCancelMultiSortColumns).toHaveBeenCalled();
    expect(screen.queryByLabelText('Then by')).toBeNull();

    userEvent.click(screen.getByRole('button', { name: 'Add column' }));
    expect(callbacks.onAddMultiSortColumn).toHaveBeenCalledWith(0);
    userEvent.click(screen.queryAllByRole('button', { name: 'Remove column' })[1]);
    expect(callbacks.onRemoveMultiSortColumn).toHaveBeenCalledWith(1);
    userEvent.click(screen.getByRole('button', { name: 'Add column' }));
    expect(callbacks.onAddMultiSortColumn).toHaveBeenCalledWith(0);
    userEvent.click(screen.getByRole('button', { name: 'Sort' }));
    expect(callbacks.onSaveMultiSortColumns).toHaveBeenCalledWith([
      {
        columnId: 'string',
        direction: 'ASC',
      },
      {
        columnId: 'select',
        direction: 'ASC',
      },
    ]);
    userEvent.selectOptions(screen.getAllByTestId('multi-sort-modal-column-select')[0], 'number');
    userEvent.selectOptions(screen.getAllByTestId('multi-sort-modal-direction-select')[0], 'DESC');
    userEvent.click(screen.getByRole('button', { name: 'Sort' }));
    expect(callbacks.onSaveMultiSortColumns).toHaveBeenLastCalledWith([
      {
        columnId: 'number',
        direction: 'DESC',
      },
      {
        columnId: 'select',
        direction: 'ASC',
      },
    ]);

    userEvent.click(screen.getByRole('button', { name: 'Clear sorting' }));
    expect(callbacks.onClearMultiSortColumns).toHaveBeenCalled();
    expect(screen.queryByLabelText('Then by')).toBeNull();
  });

  it('should only allow selecting isSortabled and visible columns', () => {
    render(
      <TableMultiSortModal
        columns={[
          {
            id: 'string',
            name: 'String',
            isSortable: true,
          },
          {
            id: 'select',
            name: 'Select',
            isSortable: true,
          },
          {
            id: 'number',
            name: 'Number',
            isSortable: true,
          },
          {
            id: 'not sortable',
            name: 'Not sortable',
          },
        ]}
        ordering={[
          {
            columnId: 'string',
            isHidden: false,
          },
          {
            columnId: 'select',
            isHidden: false,
          },
          {
            columnId: 'number',
            isHidden: true,
          },
        ]}
        actions={callbacks}
        sort={[
          {
            columnId: 'string',
            direction: 'ASC',
          },
        ]}
        showMultiSortModal
      />
    );
    userEvent.click(screen.getByText('String'));
    expect(screen.queryByText('Number')).toBeNull();
    expect(screen.queryByText('Not sortable')).toBeNull();
  });

  it('should translate all i18n strings', () => {
    render(
      <TableMultiSortModal
        columns={[
          {
            id: 'string',
            name: 'String',
            isSortable: true,
          },
          {
            id: 'select',
            name: 'Select',
            isSortable: true,
          },
        ]}
        ordering={[
          {
            columnId: 'string',
            isHidden: false,
          },
          {
            columnId: 'select',
            isHidden: false,
          },
        ]}
        actions={callbacks}
        sort={[
          {
            columnId: 'string',
            direction: 'ASC',
          },
        ]}
        showMultiSortModal
        i18n={{
          multiSortModalTitle: '__Select columns to sort__',
          multiSortModalPrimaryLabel: '__Sort__',
          multiSortModalSecondaryLabel: '__Cancel__',
          multiSortModalClearLabel: '__Clear sorting__',
          multiSortSelectColumnLabel: '__Select a column__',
          multiSortSelectColumnSortByTitle: '__Sort by__',
          multiSortSelectColumnThenByTitle: '__Then by__',
          multiSortDirectionLabel: '__Select a direction__',
          multiSortDirectionTitle: '__Sort order__',
          multiSortAddColumn: '__Add column__',
          multiSortRemoveColumn: '__Remove column__',
          multiSortAscending: '__Ascending__',
          multiSortDescending: '__Descending__',
          multiSortCloseModal: '__Close__',
          multiSortOpenMenu: '__Open menu__',
          multiSortCloseMenu: '__Close menu__',
        }}
      />
    );

    expect(screen.getByText('__Select columns to sort__')).toBeVisible();
    expect(screen.getByRole('button', { name: '__Sort__' })).toBeVisible();
    expect(screen.getByRole('button', { name: '__Cancel__' })).toBeVisible();
    expect(screen.getByRole('button', { name: '__Clear sorting__' })).toBeVisible();
    expect(screen.getByText('__Sort by__')).toBeVisible();
    expect(screen.getByText('__Sort order__')).toBeVisible();
    expect(screen.getByText('__Add column__')).toBeVisible();
    expect(screen.getByText('__Remove column__')).toBeVisible();
    expect(screen.getByLabelText('__Close__')).toBeInTheDocument();
    expect(screen.queryAllByLabelText('__Open menu__')).not.toBeNull();
    expect(screen.queryAllByLabelText('__Close menu__')).not.toBeNull();
    userEvent.click(screen.getAllByText('__Ascending__')[0]);
    expect(screen.queryAllByText('__Ascending__')).not.toBeNull();
    expect(screen.queryAllByText('__Descending__')).not.toBeNull();
  });
  it('should fallback to a defaultDirection', () => {
    render(
      <TableMultiSortModal
        columns={[
          {
            id: 'string',
            name: 'String',
            isSortable: true,
          },
          {
            id: 'select',
            name: 'Select',
            isSortable: true,
          },
          {
            id: 'number',
            name: 'Number',
            isSortable: true,
          },
        ]}
        ordering={[
          {
            columnId: 'string',
            isHidden: false,
          },
          {
            columnId: 'select',
            isHidden: false,
          },
          {
            columnId: 'number',
            isHidden: false,
          },
        ]}
        actions={callbacks}
        sort={[
          {
            columnId: 'string',
          },
        ]}
        showMultiSortModal
        testId="multi_sort_modal"
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'Sort' }));
    expect(callbacks.onSaveMultiSortColumns).toHaveBeenCalledWith([
      { columnId: 'string', direction: 'ASC' },
    ]);
  });

  it('should properly set the default columnId when none given', () => {
    render(
      <TableMultiSortModal
        columns={[
          {
            id: 'string',
            name: 'String',
            isSortable: true,
          },
          {
            id: 'select',
            name: 'Select',
            isSortable: true,
          },
        ]}
        ordering={[
          {
            columnId: 'string',
            isHidden: false,
          },
          {
            columnId: 'select',
            isHidden: false,
          },
        ]}
        actions={callbacks}
        sort={[]}
        showMultiSortModal
        testId="multi_sort_modal"
      />
    );

    expect(screen.getByLabelText('Sort by')).toBeVisible();
    expect(
      within(screen.getByLabelText('Sort by')).getByRole('option', { name: 'String' }).selected
    ).toBe(true);
    expect(screen.queryByLabelText('Then by')).toBeNull();
  });

  it('should handle sort as either array, object, or undefined', () => {
    const modalProps = {
      columns: [
        {
          id: 'string',
          name: 'String',
          isSortable: true,
        },
        {
          id: 'select',
          name: 'Select',
          isSortable: true,
        },
      ],
      ordering: [
        {
          columnId: 'string',
          isHidden: false,
        },
        {
          columnId: 'select',
          isHidden: false,
        },
      ],
      actions: callbacks,
      sort: undefined,
      showMultiSortModal: true,
      testId: 'multi_sort_modal',
    };
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<TableMultiSortModal {...modalProps} />);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Failed prop type: The prop `sort` is marked as required in `TableMultiSortModal`'
      )
    );
    console.error.mockReset();
    expect(screen.getByLabelText('Sort by')).toBeVisible();
    expect(
      within(screen.getByLabelText('Sort by')).getByRole('option', { name: 'String' }).selected
    ).toBe(true);
    expect(screen.queryByLabelText('Then by')).toBeNull();

    rerender(<TableMultiSortModal {...modalProps} sort={[]} />);

    expect(screen.getByLabelText('Sort by')).toBeVisible();
    expect(
      within(screen.getByLabelText('Sort by')).getByRole('option', { name: 'String' }).selected
    ).toBe(true);
    expect(screen.queryByLabelText('Then by')).toBeNull();

    rerender(<TableMultiSortModal {...modalProps} sort={[{}]} />);

    expect(screen.getByLabelText('Sort by')).toBeVisible();
    expect(
      within(screen.getByLabelText('Sort by')).getByRole('option', { name: 'String' }).selected
    ).toBe(true);
    expect(screen.queryByLabelText('Then by')).toBeNull();

    rerender(
      <TableMultiSortModal {...modalProps} sort={{ columnId: 'select', direction: 'ASC' }} />
    );

    expect(screen.getByLabelText('Sort by')).toBeVisible();
    expect(
      within(screen.getByLabelText('Sort by')).getByRole('option', { name: 'Select' }).selected
    ).toBe(true);
    expect(screen.queryByLabelText('Then by')).toBeNull();
    expect(screen.getByText('String')).toBeVisible();
    userEvent.click(screen.getByLabelText('Add column'));
    expect(screen.getAllByText('Select')[0]).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Sort' }));
    expect(callbacks.onSaveMultiSortColumns).toHaveBeenCalledWith([
      {
        columnId: 'select',
        direction: 'ASC',
      },
      {
        columnId: 'string',
        direction: 'ASC',
      },
    ]);
  });

  it("should not allow the last column to be removed by the 'Remove column' button", () => {
    const modalProps = {
      columns: [
        {
          id: 'string',
          name: 'String',
          isSortable: true,
        },
        {
          id: 'select',
          name: 'Select',
          isSortable: true,
        },
      ],
      ordering: [
        {
          columnId: 'string',
          isHidden: false,
        },
        {
          columnId: 'select',
          isHidden: false,
        },
      ],
      actions: callbacks,
      sort: [
        {
          columnId: 'string',
          direction: 'ASC',
        },
      ],
      showMultiSortModal: true,
      testId: 'multi_sort_modal',
    };

    render(<TableMultiSortModal {...modalProps} />);

    expect(screen.getByLabelText('Sort by')).toBeVisible();
    expect(
      within(screen.getByLabelText('Sort by')).getByRole('option', { name: 'String' }).selected
    ).toBe(true);
    expect(screen.queryByLabelText('Then by')).toBeNull();

    expect(screen.queryAllByRole('button', { name: 'Remove column' })[0]).toBeDisabled();
  });
});
