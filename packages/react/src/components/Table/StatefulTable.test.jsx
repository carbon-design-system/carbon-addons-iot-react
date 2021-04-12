import { mount } from 'enzyme';
import React from 'react';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import { screen, render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
        {...merge({}, initialState, {
          view: { table: { loadingState: { isLoading: true } } },
        })}
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
    statefulTable.find('button.bx--pagination__button--forward').simulate('click');
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

    userEvent.click(
      screen
        .getByText('can pinocchio whiteboard 4')
        .closest('tr')
        .querySelector('.bx--table-expand__button')
    );
    userEvent.click(
      screen
        .getByText('can pinocchio whiteboard 4B')
        .closest('tr')
        .querySelector('.bx--table-expand__button')
    );
    userEvent.click(
      screen
        .getByText('can pinocchio whiteboard 4B-2')
        .closest('tr')
        .querySelector('.bx--table-expand__button')
    );
    expect(screen.getByText('can pinocchio whiteboard 4B-2-B')).toBeTruthy();
    userEvent.click(screen.getByTestId(`${tableId}-row-4_B-2-B-row-actions-cell-overflow`));
    userEvent.click(screen.getByText('Add'));
    expect(mockActions.table.onApplyRowAction).toHaveBeenCalled();
  });

  it('multiselect should filter properly with pre-selected filter', async () => {
    render(
      <StatefulTable
        {...initialState}
        columns={initialState.columns.map((column) => {
          if (column.filter) {
            return {
              ...column,
              filter: {
                ...column.filter,
                isMultiselect: !!column.filter?.options,
              },
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
    const initialFilteredRowsOptionA = screen.queryByTitle('option-A');
    const initialFilteredRowsOptionB = screen.queryAllByTitle('option-B');
    const initialFilteredRowsOptionC = screen.queryByTitle('option-C');
    const initialItemCount = screen.getByText('1–10 of 33 items'); // confirm row count in the pagination
    expect(initialFilteredRowsOptionA).toBeNull();
    expect(initialFilteredRowsOptionB).toHaveLength(10);
    expect(initialFilteredRowsOptionC).toBeNull();
    expect(initialItemCount).toBeInTheDocument();

    // next add an additional filter with option-A
    // open the multiselect
    userEvent.click(screen.getByPlaceholderText('pick an option'));
    userEvent.click(screen.getByRole('option', { name: 'option-A' })); // fire click on option-A in our multiselect

    const secondFilteredRowsOptionA = screen.queryAllByTitle('option-A');
    const secondFilteredRowsOptionB = screen.queryAllByTitle('option-B');
    const secondFilteredRowsOptionC = screen.queryByTitle('option-C');
    const secondItemCount = screen.getByText('1–10 of 67 items'); // confirm row count in the pagination
    expect(secondFilteredRowsOptionA).toHaveLength(5);
    expect(secondFilteredRowsOptionB).toHaveLength(5);
    expect(secondFilteredRowsOptionC).toBeNull();
    expect(secondItemCount).toBeInTheDocument();

    // next remove filter for option-B
    // open the multiselect
    userEvent.click(screen.getAllByPlaceholderText('pick an option')[0]);
    userEvent.click(screen.getByRole('option', { name: 'option-B' })); // fire click on option-B in our multiselect

    const thirdFilteredRowsOptionA = screen.queryAllByTitle('option-A');
    const thirdFilteredRowsOptionB = screen.queryByTitle('option-B');
    const thirdFilteredRowsOptionC = screen.queryByTitle('option-C');
    const thirdItemCount = screen.getByText('1–10 of 34 items'); // confirm row count in the pagination
    expect(thirdFilteredRowsOptionA).toHaveLength(10);
    expect(thirdFilteredRowsOptionB).toBeNull();
    expect(thirdFilteredRowsOptionC).toBeNull();
    expect(thirdItemCount).toBeInTheDocument();

    // next clear all filters from the multiselect
    const clearSelectBox = screen.getByLabelText('Clear selection');
    expect(clearSelectBox).toBeInTheDocument();
    userEvent.click(clearSelectBox);

    const fourthFilteredRowsOptionA = screen.queryAllByTitle('option-A');
    const fourthFilteredRowsOptionB = screen.queryAllByTitle('option-B');
    const fourthFilteredRowsOptionC = screen.queryAllByTitle('option-C');
    const fourthItemCount = screen.getByText('1–10 of 100 items'); // confirm row count in the pagination
    expect(fourthFilteredRowsOptionA).toHaveLength(4);
    expect(fourthFilteredRowsOptionB).toHaveLength(3);
    expect(fourthFilteredRowsOptionC).toHaveLength(3);
    expect(fourthItemCount).toBeInTheDocument();
  });

  it('multiselect should filter properly with no pre-selected filters', async () => {
    render(
      <StatefulTable
        {...initialState}
        columns={initialState.columns.map((column) => {
          if (column.filter) {
            return {
              ...column,
              filter: {
                ...column.filter,
                isMultiselect: !!column.filter?.options,
              },
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
          table: {
            ...initialState.view.table,
            sort: {
              select: {
                columnId: 'select',
                direction: 'DESC',
              },
            },
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
    const initialFilteredRowsOptionA = screen.getAllByTitle('option-A');
    const initialFilteredRowsOptionB = screen.getAllByTitle('option-B');
    const initialFilteredRowsOptionC = screen.getAllByTitle('option-C');
    const initialItemCount = screen.getByText('1–10 of 100 items'); // confirm row count in the pagination
    expect(screen.queryByLabelText('Clear selection')).toBeNull(); // there should be no clear button when there are no filters selected
    expect(initialFilteredRowsOptionA).toHaveLength(4);
    expect(initialFilteredRowsOptionB).toHaveLength(3);
    expect(initialFilteredRowsOptionC).toHaveLength(3);
    expect(initialItemCount).toBeInTheDocument();

    // next add an a filter with option-A
    // open the multiselect
    userEvent.click(screen.getAllByPlaceholderText('pick an option')[0]);
    userEvent.click(screen.getByRole('option', { name: 'option-A' })); // fire click on option-A in our multiselect

    const secondFilteredRowsOptionA = screen.queryAllByTitle('option-A');
    const secondFilteredRowsOptionB = screen.queryByTitle('option-B');
    const secondFilteredRowsOptionC = screen.queryByTitle('option-C');
    const secondItemCount = screen.getByText('1–10 of 34 items'); // confirm row count in the pagination
    expect(secondFilteredRowsOptionA).toHaveLength(10);
    expect(secondFilteredRowsOptionB).toBeNull();
    expect(secondFilteredRowsOptionC).toBeNull();
    expect(secondItemCount).toBeInTheDocument();

    // next clear all filters from the multiselect
    const clearSelectBox = screen.getByLabelText('Clear selection');
    expect(clearSelectBox).toBeInTheDocument();
    fireEvent.click(clearSelectBox);

    const fourthFilteredRowsOptionA = await screen.findAllByTitle('option-A');
    const fourthFilteredRowsOptionB = await screen.findAllByTitle('option-B');
    const fourthFilteredRowsOptionC = await screen.findAllByTitle('option-C');
    const fourthItemCount = screen.getByText('1–10 of 100 items'); // confirm row count in the pagination
    expect(fourthFilteredRowsOptionA).toHaveLength(4);
    expect(fourthFilteredRowsOptionB).toHaveLength(3);
    expect(fourthFilteredRowsOptionC).toHaveLength(3);
    expect(fourthItemCount).toBeInTheDocument();

    userEvent.click(screen.getByTitle('Select'));
    expect(mockActions.table.onChangeSort).toHaveBeenCalledWith('select', undefined);
  });

  it('re-renders custom toolbar elements', () => {
    const tableId = 'tableId';
    const TestComp = ({ myMessage }) => {
      return <div>{myMessage}</div>;
    };
    const AppWrapper = ({ message }) => {
      return (
        <StatefulTable
          id={tableId}
          {...merge({}, initialState, {
            view: {
              toolbar: {
                customToolbarContent: <TestComp myMessage={message} />,
              },
            },
          })}
          actions={mockActions}
        />
      );
    };

    const { rerender } = render(<AppWrapper message="message1" />);
    expect(screen.queryByText('message1')).toBeVisible();

    rerender(<AppWrapper message="message2" />);
    expect(screen.queryByText('message2')).toBeVisible();
  });

  it('returns columns, view and search value in callback onUserViewModified', () => {
    let viewProps;
    const onUserViewModified = jest
      .fn()
      .mockImplementation(({ view, columns, state: { currentSearchValue } }) => {
        viewProps = {
          columns,
          view: {
            filters: view.filters,
            table: { ordering: view.table.ordering, sort: view.table.sort },
            toolbar: {
              activeBar: view.toolbar.activeBar,
              search: {
                ...view.toolbar.search,
                defaultValue: currentSearchValue,
              },
            },
          },
        };
      });

    render(
      <StatefulTable
        {...merge({}, initialState, {
          view: { toolbar: { search: { defaultValue: 'Initial search' } } },
        })}
        options={{ ...initialState.options, hasUserViewManagement: true }}
        actions={{ ...mockActions, onUserViewModified }}
        data={[initialState.data[0]]}
      />
    );

    fireEvent.click(screen.getByText('Clear all filters'));

    expect(viewProps).toEqual({
      columns: initialState.columns,
      view: {
        filters: [],
        table: { ordering: initialState.view.table.ordering, sort: {} },
        toolbar: {
          activeBar: initialState.view.toolbar.activeBar,
          search: {
            ...initialState.view.toolbar.search,
            defaultValue: 'Initial search',
          },
        },
      },
    });

    const searchField = screen.queryByRole('searchbox');
    fireEvent.change(searchField, { target: { value: 'testval1' } });

    expect(viewProps).toEqual({
      columns: initialState.columns,
      view: {
        filters: [],
        table: { ordering: initialState.view.table.ordering, sort: {} },
        toolbar: {
          activeBar: initialState.view.toolbar.activeBar,
          search: {
            ...initialState.view.toolbar.search,
            defaultValue: 'testval1',
          },
        },
      },
    });
  });

  it('stateful table total items can be set independently', () => {
    const totalItems = 500;
    render(
      <StatefulTable
        {...merge(
          {},
          { ...pick(initialState, 'data', 'options', 'columns') },
          {
            view: {
              pagination: { totalItems },
            },
          }
        )}
      />
    );

    expect(initialState.data.length).toEqual(100);
    expect(screen.queryByText('1–10 of 500 items')).toBeTruthy();
  });

  it('stateful table every third row unselectable', () => {
    const modifiedData = initialState.data.map((eachRow, index) => ({
      ...eachRow,
      isSelectable: index % 3 !== 0,
    }));

    const dataCount = modifiedData.filter((data) => data.isSelectable).length;
    render(
      <StatefulTable
        {...merge({}, { ...pick(initialState, 'columns', 'actions') })}
        options={{
          hasRowSelection: 'multi',
          hasRowExpansion: false,
        }}
        data={modifiedData}
        view={{ table: { selectedIds: [] } }}
      />
    );

    // check if checkboxes displayed correctly
    const checkboxes = screen.getAllByLabelText('Select row');
    checkboxes.forEach((box, i) => {
      if (i % 3 !== 0) {
        expect(box).toHaveProperty('disabled', false);
      } else {
        expect(box).toHaveProperty('disabled', true);
      }
    });

    // select all elements
    const selectAllCheckbox = screen.getByLabelText('Select all items');
    expect(selectAllCheckbox).toBeInTheDocument();
    expect(selectAllCheckbox).toHaveProperty('checked', false);
    fireEvent.click(selectAllCheckbox);

    // check that only selectable items are counted
    expect(selectAllCheckbox).toHaveProperty('checked', true);
    expect(screen.getByText(`${dataCount} items selected`)).toBeInTheDocument();

    // check if selectable checkboxes checked
    checkboxes.forEach((box, i) => {
      if (i % 3 !== 0) {
        expect(box).toHaveProperty('checked', true);
      } else {
        expect(box).toHaveProperty('checked', false);
      }
    });
  });

  it('should use callback fallbacks when props not passed', () => {
    expect(() =>
      render(
        <StatefulTable
          {...initialState}
          actions={{
            pagination: null,
            toolbar: null,
            table: null,
            onUserViewModified: null,
          }}
        />
      )
    ).not.toThrowError();
  });

  describe('AdvancedFilters', () => {
    it('properly filters the table when advancedRules have simple logic', async () => {
      const { container } = render(
        <StatefulTable
          id="advanced-filters-with-simple-logic"
          {...initialState}
          options={{
            ...initialState.options,
            hasFilter: false,
            hasAdvancedFilter: true,
          }}
          view={{
            ...initialState.view,
            toolbar: {
              ...initialState.view.toolbar,
              advancedFilterFlyoutOpen: true,
            },
            selectedAdvancedFilterIds: ['my-filter', 'next-filter'],
            advancedFilters: [
              {
                filterId: 'my-filter',
                filterTitleText: 'My Filter',
                filterRules: {
                  id: '14p5ho3pcu',
                  groupLogic: 'ALL',
                  rules: [
                    {
                      id: 'rsiru4rjba',
                      columnId: 'date',
                      operand: 'CONTAINS',
                      value: '19',
                    },
                    {
                      id: '34bvyub9jq',
                      columnId: 'boolean',
                      operand: 'EQ',
                      value: 'true',
                    },
                  ],
                },
              },
              {
                filterId: 'next-filter',
                filterTitleText: 'Next Filter',
                filterRules: {
                  id: '14p5ho3pcu',
                  groupLogic: 'ANY',
                  rules: [
                    {
                      id: 'rsiru4rjb1',
                      columnId: 'string',
                      operand: 'CONTAINS',
                      value: 'eat',
                    },
                    {
                      id: '34bvyub9j2',
                      columnId: 'number',
                      operand: 'EQ',
                      value: '4096',
                    },
                  ],
                },
              },
            ],
          }}
        />
      );

      expect(container.querySelectorAll('tbody > tr')).toHaveLength(3);
    });

    it('properly filters the table when advancedRules have complex logic', async () => {
      const { container } = render(
        <StatefulTable
          id="advanced-filters-with-simple-logic"
          {...initialState}
          options={{
            ...initialState.options,
            hasFilter: false,
            hasAdvancedFilter: true,
          }}
          view={{
            ...initialState.view,
            toolbar: {
              ...initialState.view.toolbar,
              advancedFilterFlyoutOpen: true,
            },
            selectedAdvancedFilterIds: ['my-filter', 'next-filter'],
            advancedFilters: [
              {
                filterId: 'my-filter',
                filterTitleText: 'My Filter',
                filterRules: {
                  id: '14p5ho3pcu',
                  groupLogic: 'ANY',
                  rules: [
                    {
                      id: 'rsiru4rjba',
                      columnId: 'date',
                      operand: 'CONTAINS',
                      value: '19',
                    },
                    {
                      id: '14p5ho3pcu',
                      groupLogic: 'ANY',
                      rules: [
                        {
                          id: 'rsiru4rjb1',
                          columnId: 'string',
                          operand: 'CONTAINS',
                          value: 'eat',
                        },
                        {
                          id: '34bvyub9j2',
                          columnId: 'number',
                          operand: 'EQ',
                          value: '4096',
                        },
                        {
                          id: '14p5ho3pcu',
                          groupLogic: 'ANY',
                          rules: [
                            {
                              id: '34bvyub9jq',
                              columnId: 'boolean',
                              operand: 'EQ',
                              value: 'true',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          }}
        />
      );

      expect(container.querySelectorAll('tbody > tr')).toHaveLength(10);
      expect(screen.getByText('1–10 of 11 items')).toBeVisible();
    });
  });
});
