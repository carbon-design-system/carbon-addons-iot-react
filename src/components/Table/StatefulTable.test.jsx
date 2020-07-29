import { mount } from 'enzyme';
import React from 'react';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import { screen, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import StatefulTable from './StatefulTable';
import TableSkeletonWithHeaders from './TableSkeletonWithHeaders/TableSkeletonWithHeaders';
import { mockActions } from './Table.test.helpers';
import { initialState, tableColumnsWithAlignment } from './Table.story';
import RowActionsCell from './TableBody/RowActionsCell/RowActionsCell';

describe('stateful table with real reducer', () => {
  it('should clear filters', async () => {
    render(<StatefulTable {...initialState} actions={mockActions} />);
    const whiteboardFilter = await screen.findByDisplayValue('whiteboard');
    expect(whiteboardFilter).toBeInTheDocument();
    expect(screen.getByDisplayValue('option-B')).toBeInTheDocument();
    expect(screen.getByText('Clear all filters')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear all filters'));
    expect(mockActions.toolbar.onClearAllFilters).toHaveBeenCalled();
    expect(screen.queryByDisplayValue('whiteboard')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('option-B')).not.toBeInTheDocument();
  });

  it('should update aria label', () => {
    render(
      <StatefulTable
        {...initialState}
        options={{ hasFilter: false, hasRowExpansion: false }}
        actions={mockActions}
      />
    );
    expect(screen.getAllByLabelText('Sort rows by this header in ascending order')).toBeTruthy();
    expect(tableColumnsWithAlignment[0].isSortable).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /string/i }));
    expect(mockActions.table.onChangeSort).toHaveBeenCalled();
    expect(screen.getAllByLabelText('Sort rows by this header in descending order')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /string/i }));
    expect(mockActions.table.onChangeSort).toHaveBeenCalled();
    expect(screen.getAllByLabelText('Unsort rows by this header')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /string/i }));
    expect(mockActions.table.onChangeSort).toHaveBeenCalled();
    expect(screen.getAllByLabelText('Sort rows by this header in ascending order')).toBeTruthy();
  });

  it('verify stateful table can support loading state', () => {
    const statefulTable = mount(
      <StatefulTable
        {...merge({}, initialState, { view: { table: { loadingState: { isLoading: true } } } })}
        actions={mockActions}
      />
    );
    expect(statefulTable.find(TableSkeletonWithHeaders)).toHaveLength(1);
  });
  it('stateful table verify page change', () => {
    const statefulTable = mount(
      <StatefulTable
        {...merge(
          {},
          { ...pick(initialState, 'data', 'options', 'columns') },
          {
            view: {
              pagination: { page: 9 },
            },
          }
        )}
        actions={mockActions}
      />
    );
    statefulTable.find('.bx--pagination__button--forward').simulate('click');
    expect(statefulTable.text()).toContain('100 of 100');
  });
  it('should show singleRowEditButtons when choosing to edit a row', () => {
    const statefulTable = mount(
      <StatefulTable
        {...merge({}, initialState, {
          view: {
            table: {
              rowActions: [],
              singleRowEditButtons: <div data-testid="myButtons">myButtons</div>,
            },
          },
        })}
        options={{
          hasRowActions: true,
          hasSingleRowEdit: true,
        }}
        actions={mockActions}
      />
    );

    expect(statefulTable.text()).not.toContain('myButtons');

    return statefulTable
      .find(RowActionsCell)
      .first()
      .props()
      .onApplyRowAction('edit', 'row-1')
      .then(() => {
        expect(true).toBeTruthy();
        expect(statefulTable.text()).toContain('myButtons');
      });
  });
});
