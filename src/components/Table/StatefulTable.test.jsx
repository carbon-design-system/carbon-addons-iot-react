import { mount } from 'enzyme';
import React from 'react';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import { screen, render, fireEvent } from '@testing-library/react';

import StatefulTable from './StatefulTable';
import TableSkeletonWithHeaders from './TableSkeletonWithHeaders/TableSkeletonWithHeaders';
import { mockActions } from './Table.test.helpers';
import { initialState, StatefulTableWithNestedRowItems } from './Table.story';
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

  it('render nestedRows', () => {
    const tableId = 'tableId';
    render(<StatefulTableWithNestedRowItems id={tableId} actions={mockActions} />);

    expect(screen.queryByText('whiteboard can eat 2A')).toBeNull();

    fireEvent.click(
      screen
        .getByText('whiteboard can eat 2')
        .closest('tr')
        .querySelector('.bx--table-expand__button')
    );

    expect(screen.getByText('whiteboard can eat 2A')).toBeTruthy();

    fireEvent.click(screen.getByTestId(`${tableId}-row-2_A-row-actions-cell-overflow`));
    fireEvent.click(screen.getByText('Add'));

    expect(mockActions.table.onApplyRowAction).toHaveBeenCalled();
  });
  it('multiselect should filter properly with pre-selected filter', async () => {
    render(
      <StatefulTable
        {...initialState}
        columns={initialState.columns.map(column => {
          if (column.filter) {
            return {
              ...column,
              filter: { ...column.filter, isMultiselect: !!column.filter?.options },
            };
          }
          return column;
        })}
        view={{
          ...initialState.view,
          filters: [{ columnId: 'select', value: 'option-B' }], // start with filtering by option-B
          pagination: {
            ...initialState.view.pagination,
            maxPages: 10,
          },
          toolbar: {
            activeBar: 'filter',
          },
        }}
        secondaryTitle={`Row count: ${initialState.data.length}`}
        actions={mockActions}
        isSortable
        options={{
          ...initialState.options,
          hasFilter: 'onKeyPress',
          wrapCellText: 'always',
          hasSingleRowEdit: true,
        }}
      />
    );

    // start off with a filter of option-B.
    // Note: each options length count has an extra item due to the multiselect having the same title attribute as the row cell
    const initialFilteredRowsOptionA = screen.getAllByTitle('option-A');
    const initialFilteredRowsOptionB = screen.getAllByTitle('option-B');
    const initialFilteredRowsOptionC = screen.getAllByTitle('option-C');
    const initialItemCount = screen.getByText('1–10 of 33 items'); // confirm row count in the pagination
    expect(initialFilteredRowsOptionA).toHaveLength(1); // 1 instead of 0 because it sees the multiselect option
    expect(initialFilteredRowsOptionB).toHaveLength(11); // 11 instead of 10 because it sees the multiselect option
    expect(initialFilteredRowsOptionC).toHaveLength(1); // 1 instead of 0 because it sees the multiselect option
    expect(initialItemCount).toBeInTheDocument();

    // next add an additional filter with option-A
    // Note: each options length count has an extra item due to the multiselect having the same title attribute as the row cell
    fireEvent.click(screen.getAllByRole('option')[0]); // fire click on option-A in our multiselect

    const secondFilteredRowsOptionA = await screen.findAllByTitle('option-A');
    const secondFilteredRowsOptionB = await screen.findAllByTitle('option-B');
    const secondFilteredRowsOptionC = await screen.findAllByTitle('option-C');
    const secondItemCount = screen.getByText('1–10 of 67 items'); // confirm row count in the pagination
    expect(secondFilteredRowsOptionA).toHaveLength(6);
    expect(secondFilteredRowsOptionB).toHaveLength(6);
    expect(secondFilteredRowsOptionC).toHaveLength(1);
    expect(secondItemCount).toBeInTheDocument();

    // next remove filter for option-B
    // Note: each options length count has an extra item due to the multiselect having the same title attribute as the row cell
    fireEvent.click(screen.getAllByRole('option')[1]); // fire click on option-B in our multiselect

    const thirdFilteredRowsOptionA = await screen.findAllByTitle('option-A');
    const thirdFilteredRowsOptionB = await screen.findAllByTitle('option-B');
    const thirdFilteredRowsOptionC = await screen.findAllByTitle('option-C');
    const thirdItemCount = screen.getByText('1–10 of 34 items'); // confirm row count in the pagination
    expect(thirdFilteredRowsOptionA).toHaveLength(11);
    expect(thirdFilteredRowsOptionB).toHaveLength(1);
    expect(thirdFilteredRowsOptionC).toHaveLength(1);
    expect(thirdItemCount).toBeInTheDocument();

    // next clear all filters from the multiselect
    // Note: each options length count has an extra item due to the multiselect having the same title attribute as the row cell
    const clearSelectBox = screen.getByLabelText('Clear Selection');
    expect(clearSelectBox).toBeInTheDocument();

    fireEvent.click(clearSelectBox);

    const fourthFilteredRowsOptionA = await screen.findAllByTitle('option-A');
    const fourthFilteredRowsOptionB = await screen.findAllByTitle('option-B');
    const fourthFilteredRowsOptionC = await screen.findAllByTitle('option-C');
    const fourthItemCount = screen.getByText('1–10 of 100 items'); // confirm row count in the pagination
    expect(fourthFilteredRowsOptionA).toHaveLength(5);
    expect(fourthFilteredRowsOptionB).toHaveLength(4);
    expect(fourthFilteredRowsOptionC).toHaveLength(4);
    expect(fourthItemCount).toBeInTheDocument();
  });

  it('multiselect should filter properly with no pre-selected filters', async () => {
    render(
      <StatefulTable
        {...initialState}
        columns={initialState.columns.map(column => {
          if (column.filter) {
            return {
              ...column,
              filter: { ...column.filter, isMultiselect: !!column.filter?.options },
            };
          }
          return column;
        })}
        view={{
          ...initialState.view,
          filters: [], // start with no filters
          pagination: {
            ...initialState.view.pagination,
            maxPages: 10,
          },
          toolbar: {
            activeBar: 'filter',
          },
        }}
        secondaryTitle={`Row count: ${initialState.data.length}`}
        actions={mockActions}
        isSortable
        options={{
          ...initialState.options,
          hasFilter: 'onKeyPress',
          wrapCellText: 'always',
          hasSingleRowEdit: true,
        }}
      />
    );

    // start off with no filters.
    // Note: each options length count has an extra item due to the multiselect having the same title attribute as the row cell
    const initialFilteredRowsOptionA = screen.getAllByTitle('option-A');
    const initialFilteredRowsOptionB = screen.getAllByTitle('option-B');
    const initialFilteredRowsOptionC = screen.getAllByTitle('option-C');
    const initialItemCount = screen.getByText('1–10 of 100 items'); // confirm row count in the pagination
    expect(screen.queryByLabelText('Clear Selection')).toBeNull(); // there should be no clear button when there are no filters selected
    expect(initialFilteredRowsOptionA).toHaveLength(5);
    expect(initialFilteredRowsOptionB).toHaveLength(4);
    expect(initialFilteredRowsOptionC).toHaveLength(4);
    expect(initialItemCount).toBeInTheDocument();

    // next add an a filter with option-A
    // Note: each options length count has an extra item due to the multiselect having the same title attribute as the row cell
    fireEvent.click(screen.getAllByRole('option')[0]); // fire click on option-A in our multiselect

    const secondFilteredRowsOptionA = await screen.findAllByTitle('option-A');
    const secondFilteredRowsOptionB = await screen.findAllByTitle('option-B');
    const secondFilteredRowsOptionC = await screen.findAllByTitle('option-C');
    const secondItemCount = screen.getByText('1–10 of 34 items'); // confirm row count in the pagination
    expect(secondFilteredRowsOptionA).toHaveLength(11);
    expect(secondFilteredRowsOptionB).toHaveLength(1);
    expect(secondFilteredRowsOptionC).toHaveLength(1);
    expect(secondItemCount).toBeInTheDocument();

    // next clear all filters from the multiselect
    // Note: each options length count has an extra item due to the multiselect having the same title attribute as the row cell
    const clearSelectBox = screen.getByLabelText('Clear Selection');
    expect(clearSelectBox).toBeInTheDocument();

    fireEvent.click(clearSelectBox);

    const fourthFilteredRowsOptionA = await screen.findAllByTitle('option-A');
    const fourthFilteredRowsOptionB = await screen.findAllByTitle('option-B');
    const fourthFilteredRowsOptionC = await screen.findAllByTitle('option-C');
    const fourthItemCount = screen.getByText('1–10 of 100 items'); // confirm row count in the pagination
    expect(fourthFilteredRowsOptionA).toHaveLength(5);
    expect(fourthFilteredRowsOptionB).toHaveLength(4);
    expect(fourthFilteredRowsOptionC).toHaveLength(4);
    expect(fourthItemCount).toBeInTheDocument();
  });
});
