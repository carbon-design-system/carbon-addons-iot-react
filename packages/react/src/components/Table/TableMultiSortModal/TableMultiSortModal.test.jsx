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
    userEvent.click(screen.getByText('Select a column'));
    userEvent.click(screen.getByText('Select'));
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

  it('should translate all i18n strings', () => {
    render(
      <TableMultiSortModal
        columns={[
          {
            id: 'string',
            name: 'String',
          },
          {
            id: 'select',
            name: 'Select',
          },
        ]}
        actions={callbacks}
        sort={[
          {
            columnId: '',
            direction: '',
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
        }}
      />
    );

    expect(screen.getByText('__Select columns to sort__')).toBeVisible();
    expect(screen.getByRole('button', { name: '__Sort__' })).toBeVisible();
    expect(screen.getByRole('button', { name: '__Cancel__' })).toBeVisible();
    expect(screen.getByText('__Select a column__')).toBeVisible();
    expect(screen.getByText('__Sort by__')).toBeVisible();
    expect(screen.getByText('__Select a direction__')).toBeVisible();
    expect(screen.getByText('__Sort order__')).toBeVisible();
    expect(screen.getByText('__Add column__')).toBeVisible();
    expect(screen.getByText('__Remove column__')).toBeVisible();
    userEvent.click(screen.getByText('__Select a direction__'));
    expect(screen.getByText('__Ascending__')).toBeVisible();
    expect(screen.getByText('__Descending__')).toBeVisible();
  });
});
