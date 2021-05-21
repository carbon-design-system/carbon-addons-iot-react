import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TableMultiSortModal from './TableMultiSortModal';

const callbacks = {
  onAddMultiSortColumn: jest.fn(),
  onRemoveMultiSortColumn: jest.fn(),
  onSaveMultiSortColumns: jest.fn(),
  onCancelMultiSortColumns: jest.fn(),
};
describe('TableMultiSortModal', () => {
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

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(callbacks.onCancelMultiSortColumns).toHaveBeenCalled();

    userEvent.click(screen.getByText('Add column'));
    expect(callbacks.onAddMultiSortColumn).toHaveBeenCalledWith(0);
    userEvent.click(screen.queryAllByText('Remove column')[1]);
    expect(callbacks.onRemoveMultiSortColumn).toHaveBeenCalledWith(1);
    userEvent.click(screen.getByText('Add column'));
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
    userEvent.click(screen.getByText('String'));
    userEvent.click(screen.getByText('Number'));
    userEvent.click(screen.queryAllByText('Ascending')[0]);
    userEvent.click(screen.queryAllByText('Descending')[0]);
    userEvent.click(screen.getByRole('button', { name: 'Sort' }));
    expect(callbacks.onSaveMultiSortColumns).toHaveBeenCalledWith([
      {
        columnId: 'number',
        direction: 'DESC',
      },
      {
        columnId: 'select',
        direction: 'ASC',
      },
    ]);
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
});
