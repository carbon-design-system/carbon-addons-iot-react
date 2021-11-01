import React from 'react';
import { mount } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../../constants/Settings';
import * as componentUtilityFunctions from '../../../utils/componentUtilityFunctions';

import TableHead from './TableHead';
import TableHeader from './TableHeader';
import { MIN_COLUMN_WIDTH, DEFAULT_COLUMN_WIDTH } from './columnWidthUtilityFunctions';

const { iotPrefix, prefix } = settings;

const commonTableHeadProps = {
  tableId: 'tablehead-test',
  /** List of columns */
  columns: [
    { id: 'col1', name: 'Column 1', isSortable: false },
    { id: 'col2', name: 'Column 2', isSortable: false },
    { id: 'col3', name: 'Column 3', isSortable: true, align: 'start' },
  ],
  tableState: {
    selection: {},
    sort: {
      columnId: 'col3',
      direction: 'ASC',
    },
    ordering: [
      { columnId: 'col1', isHidden: false },
      { columnId: 'col2', isHidden: false },
      { columnId: 'col3', isHidden: false },
    ],
  },
  actions: { onChangeOrdering: jest.fn(), onOverflowItemClicked: jest.fn() },
  options: { wrapCellText: 'auto', truncateCellText: false, preserveColumnWidths: false },
};

// Needed to get the debounced window resize tested
// https://github.com/facebook/jest/issues/3465#issuecomment-449007170
jest.mock('lodash/debounce', () => (fn) => fn);

describe('TableHead', () => {
  it('be selectable by testID or testId', () => {
    const columns = commonTableHeadProps.columns.map((c) => ({
      ...c,
      overflowMenuItems: [
        {
          id: '1',
          text: 'one',
        },
        {
          id: '2',
          text: 'two',
        },
      ],
    }));
    const { rerender } = render(
      <TableHead {...commonTableHeadProps} columns={columns} testID="TABLE_HEAD" />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );

    expect(screen.getByTestId('TABLE_HEAD')).toBeDefined();
    expect(screen.getByTestId('TABLE_HEAD-column-col1')).toBeDefined();
    expect(screen.getByTestId('TABLE_HEAD-column-col2')).toBeDefined();
    expect(screen.getByTestId('TABLE_HEAD-column-col3')).toBeDefined();
    expect(screen.getAllByTestId('table-head--overflow')).toHaveLength(3);
    userEvent.click(screen.getAllByRole('button', { name: 'open and close list of options' })[1]);
    expect(screen.getByTestId('TABLE_HEAD-column-overflow-menu-item-1')).toBeDefined();
    expect(screen.getByTestId('TABLE_HEAD-column-overflow-menu-item-2')).toBeDefined();

    rerender(<TableHead {...commonTableHeadProps} columns={columns} testId="table_head" />, {
      container: document.body.appendChild(document.createElement('table')),
    });

    expect(screen.getByTestId('table_head')).toBeDefined();
    expect(screen.getByTestId('table_head-column-col1')).toBeDefined();
    expect(screen.getByTestId('table_head-column-col2')).toBeDefined();
    expect(screen.getByTestId('table_head-column-col3')).toBeDefined();
    expect(screen.getAllByTestId('table-head--overflow')).toHaveLength(3);
    userEvent.click(screen.getAllByRole('button', { name: 'open and close list of options' })[0]);
    expect(screen.getByTestId('table_head-column-overflow-menu-item-1')).toBeDefined();
    expect(screen.getByTestId('table_head-column-overflow-menu-item-2')).toBeDefined();
  });
  it('columns should render', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />, {
      attachTo: document.createElement('table'),
    });
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(3);
  });

  it('columns should render extra column for multi select', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: {
        ...commonTableHeadProps.options,
        hasRowExpansion: true,
        hasRowSelection: 'multi',
      },
    };
    const wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(4);
  });

  it('hasRowActions flag creates empty TableHeader', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: {
        ...commonTableHeadProps.options,
        hasRowActions: true,
      },
    };
    const wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    const lastTableHeader = wrapper.find('TableHeader').last();

    expect(lastTableHeader.getDOMNode().className).toEqual(
      `${iotPrefix}--table-header-row-action-column`
    );

    expect(lastTableHeader.find(`.${prefix}--table-header-label`).getDOMNode().innerHTML).toEqual(
      ''
    );
  });

  it('make sure data-column is set for width', () => {
    const myProps = { ...commonTableHeadProps };
    const wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    const tableHeaders = wrapper.find('th[data-column="col1"]');
    expect(tableHeaders).toHaveLength(1);
  });

  it('activeBar set to "filter" shows FilterHeaderRow', () => {
    const myProps = {
      ...commonTableHeadProps,
      tableState: { ...commonTableHeadProps.tableState },
    };
    myProps.tableState.activeBar = 'filter';
    let wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    expect(wrapper.exists('FilterHeaderRow')).toBeTruthy();

    delete myProps.tableState.activeBar;
    wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    expect(wrapper.exists('FilterHeaderRow')).toBeFalsy();
  });

  it('activeBar set to "column" shows ColumnHeaderRow', () => {
    const myProps = {
      ...commonTableHeadProps,
      tableState: { ...commonTableHeadProps.tableState },
    };
    myProps.tableState.activeBar = 'column';
    const wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    expect(wrapper.exists('ColumnHeaderRow')).toBeTruthy();
  });

  it('check not resize if has resize is false ', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: { ...commonTableHeadProps.options, hasResize: false },
    };
    const wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    const tableHeaders = wrapper.find('div.column-resize-handle');
    expect(tableHeaders).toHaveLength(0);
  });

  it('check hidden item is not shown ', () => {
    const myProps = {
      ...commonTableHeadProps,
      tableState: {
        ...commonTableHeadProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: false },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: true },
        ],
      },
      hasResize: false,
    };

    const wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(2);
  });

  it('header renders with resizing columns when columns are empty on initial render', () => {
    const wrapper = mount(
      <TableHead
        tableId="tablehead-test"
        columns={[]}
        tableState={{
          filters: [],
          expandedIds: [],
          isSelectAllSelected: false,
          selectedIds: [],
          rowActions: [],
          sort: {},
          ordering: [],
          loadingState: { rowCount: 5 },
          selection: { isSelectAllSelected: false },
        }}
        actions={{ onColumnResize: jest.fn() }}
        options={{ ...commonTableHeadProps.options, hasResize: true }}
      />,
      {
        attachTo: document.createElement('table'),
      }
    );
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(0);
    // trigger a re-render with non-empty columns
    wrapper.setProps({
      ...commonTableHeadProps,
      options: { ...commonTableHeadProps.options, hasResize: true },
    });
    // sync enzyme component tree with the updated dom

    wrapper.update();
    const tableHeaderResizeHandles = wrapper.find(`div.${iotPrefix}--column-resize-handle`);
    tableHeaderResizeHandles.first().simulate('mouseDown');
    tableHeaderResizeHandles.first().simulate('mouseMove');
    tableHeaderResizeHandles.first().simulate('mouseUp');
    expect(tableHeaderResizeHandles).toHaveLength(2);
  });

  it('fixed column widths for non-resizable columns', () => {
    const myProps = {
      ...commonTableHeadProps,
      columns: [{ id: 'col1', name: 'Column 1', width: '101px', isSortable: false }],
      tableState: {
        ...commonTableHeadProps.tableState,
        ordering: [{ columnId: 'col1', isHidden: false }],
      },
      options: { ...commonTableHeadProps.options, hasResize: false },
    };

    let wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    const nonSortableTableHead = wrapper.find(TableHeader).first().find('th');
    expect(nonSortableTableHead.prop('width')).toBe('101px');

    myProps.columns[0].isSortable = true;
    wrapper = mount(<TableHead {...myProps} />, {
      attachTo: document.createElement('table'),
    });
    const sortableTableHead = wrapper.find(TableHeader).first().find('th');
    expect(sortableTableHead.prop('width')).toBe('101px');
  });

  it('adds tableTranslateWithId to TableHeader that calls it', () => {
    jest.spyOn(componentUtilityFunctions, 'tableTranslateWithId');
    render(<TableHead {...commonTableHeadProps} />, {
      container: document.body.appendChild(document.createElement('table')),
    });
    expect(componentUtilityFunctions.tableTranslateWithId).toHaveBeenCalled();
    componentUtilityFunctions.tableTranslateWithId.mockRestore();
  });

  it('adds multisort overflow to headers', async () => {
    const myOptions = { ...commonTableHeadProps.options, hasMultiSort: true };
    const myTableState = {
      ...commonTableHeadProps.tableState,
      sort: [
        {
          columnId: 'col3',
          direction: 'ASC',
        },
      ],
    };
    render(<TableHead {...commonTableHeadProps} options={myOptions} tableState={myTableState} />, {
      container: document.body.appendChild(document.createElement('table')),
    });

    const column3 = screen.getByRole('columnheader', { name: /Column 3/i });
    expect(column3).toHaveClass(`${iotPrefix}--table-head--table-header--with-overflow`);
    expect(within(column3).getByText('1')).toHaveClass(
      `${iotPrefix}--table-header-label__sort-order`
    );
  });

  it('calls onOverflowItemClicked when multi-sort overflow is clicked', async () => {
    const myOptions = { ...commonTableHeadProps.options, hasMultiSort: true };
    const myTableState = {
      ...commonTableHeadProps.tableState,
      sort: [
        {
          columnId: 'col3',
          direction: 'ASC',
        },
      ],
    };
    render(
      <TableHead
        {...commonTableHeadProps}
        options={myOptions}
        tableState={myTableState}
        i18n={{ multiSortOverflowItem: 'Multi-sort' }}
      />,
      {
        container: document.body.appendChild(document.createElement('table')),
      }
    );

    const column3 = screen.getByRole('columnheader', { name: /Column 3/i });
    expect(screen.queryByText('Multi-sort')).not.toBeInTheDocument();
    userEvent.click(
      within(column3).getByRole('button', { name: 'open and close list of options' })
    );
    await waitFor(() => expect(screen.getByText('Multi-sort')).toBeInTheDocument());

    userEvent.click(screen.getByText(/Multi-sort/i));
    expect(commonTableHeadProps.actions.onOverflowItemClicked).toHaveBeenCalledWith('multi-sort', {
      columnId: 'col3',
    });
  });

  describe('Column resizing active', () => {
    let ordering;
    let columns;
    let myActions;
    let myProps;
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();

    beforeAll(() => {
      Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    });

    beforeEach(() => {
      ordering = [
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ];
      columns = [
        { id: 'col1', name: 'Column 1', width: '100px' },
        { id: 'col2', name: 'Column 2', width: '100px' },
        { id: 'col3', name: 'Column 3', width: '100px' },
      ];

      myActions = { onChangeOrdering: jest.fn(), onColumnResize: jest.fn() };
      myProps = {
        ...commonTableHeadProps,
        columns,
        tableState: {
          ...commonTableHeadProps.tableState,
          ordering,
          activeBar: 'column',
        },
        options: {
          hasResize: true,
          wrapCellText: 'auto',
          truncateCellText: false,
          preserveColumnWidths: false,
        },
        actions: myActions,
        showExpanderColumn: true,
      };
    });

    afterAll(() => {
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it('shows resize handle if hasResize:true ', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      const { container } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      expect(container.querySelector(`.${iotPrefix}--column-resize-handle`)).toBeInTheDocument();
    });

    it('sets new columns widths after window resize if useAutoTableLayoutForResize:true', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const myOptions = { ...myProps.options, useAutoTableLayoutForResize: true };
      myProps.columns = [
        { id: 'col1', name: 'Column 1' },
        { id: 'col2', name: 'Column 2' },
        { id: 'col3', name: 'Column 3' },
      ];

      render(<TableHead {...myProps} options={myOptions} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      fireEvent(window, new Event('resize'));

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '200px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '200px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '200px',
      });
    });

    it('toggle hide column correctly updates the column widths of visible columns', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const { container } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Hide col1. The width of col1 is proportionally distributed over
      // the remaining visible columns.
      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 1')
      );

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: '100px' },
        { id: 'col2', name: 'Column 2', width: '150px' },
        { id: 'col3', name: 'Column 3', width: '150px' },
      ]);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: true },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ]);
    });

    it('toggle show column correctly updates the column widths of visible columns', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: true },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: false },
        ],
      };

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      const { container } = render(
        <TableHead
          {...myProps}
          columns={[
            { id: 'col1', name: 'Column 1', width: '200px' },
            { id: 'col2', name: 'Column 2', width: '200px' },
            { id: 'col3', name: 'Column 3', width: '200px' },
          ]}
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      // Show col1. The width needed for col1 is proportionally subtracted from
      // the other visible columns.
      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 1')
      );

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: '133px' },
        { id: 'col2', name: 'Column 2', width: '133px' },
        { id: 'col3', name: 'Column 3', width: '133px' },
      ]);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ]);
    });

    it('toggle show column does not allow columns to shrink below MIN WIDTH', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: true },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: false },
        ],
      };

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const { container } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Show col1. The width needed for col1 is proportionally subtracted from
      // the other visible columns.
      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 1')
      );

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: '67px' },
        { id: 'col2', name: 'Column 2', width: `67px` },
        { id: 'col3', name: 'Column 3', width: `67px` },
      ]);

      myActions.onColumnResize.mock.calls[0][0].forEach((column) => {
        expect(parseInt(column.width, 10)).toBeGreaterThanOrEqual(MIN_COLUMN_WIDTH);
      });

      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ]);
    });

    it('toggle show column without initial width correctly updates the column widths of visible columns', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: false },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: true },
        ],
      };
      myProps.columns = [
        { id: 'col1', name: 'Column 1', width: '200px' },
        { id: 'col2', name: 'Column 2', width: '200px' },
        { id: 'col3', name: 'Column 3' },
      ];

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      const { container } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Show col3 which has no initial column width.
      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 3')
      );

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: '133px' },
        { id: 'col2', name: 'Column 2', width: '133px' },
        { id: 'col3', name: 'Column 3', width: '133px' },
      ]);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ]);
    });

    it('uses last known widths for hidden columns when all  columns in column prop lack width', () => {
      myProps.options = {
        hasResize: true,
        preserveColumnWidths: false,
      };

      myProps.columns = [
        { id: 'col1', name: 'Column 1', width: '200px' },
        { id: 'col2', name: 'Column 2', width: '200px' },
        { id: 'col3', name: 'Column 3', width: '200px' },
      ];

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      const { container, rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: true },
          { columnId: 'col2', isHidden: true },
          { columnId: 'col3', isHidden: true },
        ],
      };
      myProps.columns = [
        { id: 'col1', name: 'Column 1', width: undefined },
        { id: 'col2', name: 'Column 2' },
        { id: 'col3', name: 'Column 3' },
      ];

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 1')
      );

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: `${MIN_COLUMN_WIDTH}px` },
        { id: 'col2', name: 'Column 2', width: '200px' },
        { id: 'col3', name: 'Column 3', width: '200px' },
      ]);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: true },
        { columnId: 'col3', isHidden: true },
      ]);
    });

    it('handles column toggle show after all has been hidden, using min width if needed', () => {
      myProps.options = {
        hasResize: true,
        preserveColumnWidths: false,
      };

      myProps.columns = [
        { id: 'col1', name: 'Column 1' },
        { id: 'col2', name: 'Column 2' },
        { id: 'col3', name: 'Column 3' },
      ];

      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: true },
          { columnId: 'col2', isHidden: true },
          { columnId: 'col3', isHidden: true },
        ],
      };

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      const { container, rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 1')
      );

      const columnsAfterToggle = [
        { id: 'col1', name: 'Column 1', width: `${MIN_COLUMN_WIDTH}px` },
        { id: 'col2', name: 'Column 2', width: undefined },
        { id: 'col3', name: 'Column 3', width: undefined },
      ];
      const orderingAfterToggle = [
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: true },
        { columnId: 'col3', isHidden: true },
      ];
      expect(myActions.onColumnResize).toHaveBeenCalledWith(columnsAfterToggle);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith(orderingAfterToggle);

      myProps.tableState = {
        ...myProps.tableState,
        ordering: orderingAfterToggle,
      };
      myProps.columns = columnsAfterToggle;

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 2')
      );

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: `${MIN_COLUMN_WIDTH}px` },
        { id: 'col2', name: 'Column 2', width: `${MIN_COLUMN_WIDTH}px` },
        { id: 'col3', name: 'Column 3', width: undefined },
      ]);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: true },
      ]);
    });

    it('handles column toggle when all columns are hidden and without width', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: true },
          { columnId: 'col2', isHidden: true },
          { columnId: 'col3', isHidden: true },
        ],
      };
      myProps.columns = [
        { id: 'col1', name: 'Column 1', width: undefined },
        { id: 'col2', name: 'Column 2' },
        { id: 'col3', name: 'Column 3' },
      ];

      myProps.options = {
        hasResize: true,
        preserveColumnWidths: false,
      };

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      const { container } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Show col3 which has no initial column width.
      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 3')
      );

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: undefined },
        { id: 'col2', name: 'Column 2', width: undefined },
        { id: 'col3', name: 'Column 3', width: `${MIN_COLUMN_WIDTH}px` },
      ]);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: true },
        { columnId: 'col2', isHidden: true },
        { columnId: 'col3', isHidden: false },
      ]);
    });

    it('should not add resize handle to the last visible column if there is no expander column', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: false },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: false },
        ],
      };
      myProps.showExpanderColumn = false;
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const { rerender } = render(<TableHead {...myProps} testId="my-test" />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.queryAllByRole('button', 'Resize column')).toHaveLength(2);

      let lastTableHeader = screen.getByTestId('my-test-column-col3');
      expect(within(lastTableHeader).queryAllByRole('button', 'Resize column')).toHaveLength(0);

      // Hide the last column (use shortcut via props)
      const orderingAfterToggleHide = cloneDeep(myProps.tableState.ordering).map((col) =>
        col.columnId === 'col3' ? { ...col, isHidden: true } : col
      );

      rerender(
        <TableHead
          {...myProps}
          tableState={{ ...myProps.tableState, ordering: orderingAfterToggleHide }}
          testId="my-test"
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );
      expect(screen.queryAllByRole('button', 'Resize column')).toHaveLength(1);

      lastTableHeader = screen.getByTestId('my-test-column-col2');
      expect(within(lastTableHeader).queryAllByRole('button', 'Resize column')).toHaveLength(0);
    });

    it('should always add resize handle to the last visible column if there is an expander column', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: false },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: false },
        ],
      };
      myProps.showExpanderColumn = true;

      render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      const lastColumnResizeHandle = within(screen.getByTitle('Column 3').closest('th')).getByRole(
        'button',
        {
          name: 'Resize column',
        }
      );

      expect(lastColumnResizeHandle).not.toBeNull();
    });

    it('should add an extra expander column if prop showExpanderColumn:true', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: false },
          { columnId: 'col2', isHidden: false },
        ],
      };
      myProps.showExpanderColumn = true;
      myProps.testID = 'my-test';

      render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      expect(screen.getByTestId('my-test-expander-column')).not.toBeNull();
    });

    it('should not add an extra expander column if prop showExpanderColumn:false', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: false },
          { columnId: 'col2', isHidden: false },
        ],
      };
      myProps.showExpanderColumn = false;
      myProps.testID = 'my-test';

      render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      expect(screen.queryByTestId('my-test-expander-column')).toBeNull();
    });

    it('should update the column widths when column prop changes and all column prop have widths defined', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '100px',
      });

      // All props have widths so the column widths are updated
      rerender(
        <TableHead
          {...myProps}
          columns={[
            { id: 'col1', name: 'Column 1', width: '250px' },
            { id: 'col2', name: 'Column 2', width: '150px' },
            { id: 'col3', name: 'Column 3', width: '100px' },
          ]}
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );
      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '250px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '150px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
    });

    it('should update the column widths when column prop changes and all visible column props have widths defined', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      const orderingWidthHiddenCol1 = [
        { columnId: 'col1', isHidden: true },
        ...myProps.tableState.ordering.slice(1),
      ];
      myProps.tableState.ordering = orderingWidthHiddenCol1;

      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      rerender(
        <TableHead
          {...myProps}
          columns={[
            { id: 'col1', name: 'Column 1' },
            { id: 'col2', name: 'Column 2', width: '300px' },
            { id: 'col3', name: 'Column 3', width: '400px' },
          ]}
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '300px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '400px',
      });
    });

    it('should not update the column widths when column prop changes and visible columns are lacking width', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      rerender(
        <TableHead
          {...myProps}
          columns={[
            { id: 'col1', name: 'Column 1', width: undefined },
            { id: 'col2', name: 'Column 2', width: '150px' },
            { id: 'col3', name: 'Column 3', width: '100px' },
          ]}
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );
      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });

      rerender(
        <TableHead
          {...myProps}
          columns={[
            { id: 'col1', name: 'Column 1', width: '100' },
            { id: 'col2', name: 'Column 2', width: '150px' },
            { id: 'col3', name: 'Column 3' },
          ]}
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );
      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
    });

    it('handles removing columns by distributing the width on remaining cols', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      myProps.tableState.ordering = myProps.tableState.ordering.slice(2);
      myProps.columns = myProps.columns.slice(2);

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '300px',
      });
    });

    it('handles removing hidden columns without any widths', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      const orderingWidthHiddenCol1 = [
        { columnId: 'col1', isHidden: true },
        ...myProps.tableState.ordering.slice(1),
      ];
      myProps.tableState.ordering = orderingWidthHiddenCol1;
      myProps.tableState.activeBar = 'column';

      const { rerender, container } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      myProps.tableState.ordering = myProps.tableState.ordering.slice(1);
      myProps.columns = myProps.columns.slice(1);

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      const toggleHideButtons = container.querySelector(
        `.${iotPrefix}--column-header-row--select-wrapper`
      );
      userEvent.click(within(toggleHideButtons).getByText('Column 2'));

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col2', name: 'Column 2', width: '100px' },
        { id: 'col3', name: 'Column 3', width: '200px' },
      ]);
    });

    it('handles adding new columns by subtracting the needed width from other visible columns', () => {
      // Make sure all columns have an initial width of 200 so that there is plenty of space to subtract
      myProps.columns = myProps.columns.map((col) => ({
        ...col,
        width: '200px',
      }));
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '200px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '200px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '200px',
      });

      // Add two new columns
      myProps.tableState.ordering = [
        ...myProps.tableState.ordering,
        { columnId: 'col4', isHidden: false },
        { columnId: 'col5', isHidden: false },
      ];
      myProps.columns = [
        ...myProps.columns,
        { id: 'col4', name: 'Column 4', width: '150px' },
        { id: 'col5', name: 'Column 5', width: '150px' },
      ];

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '120px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '120px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '120px',
      });
      expect(screen.getAllByText('Column 4')[0].closest('th')).toHaveStyle({
        width: '120px',
      });
      expect(screen.getAllByText('Column 5')[0].closest('th')).toHaveStyle({
        width: '120px',
      });
    });

    it('handles adding and removing columns during the same rerender', () => {
      // Make sure all columns have an initial width of 200 so that there is plenty of space to subtract
      myProps.columns = myProps.columns.map((col) => ({
        ...col,
        width: '200px',
      }));
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '200px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '200px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '200px',
      });

      // Add 2 new columns
      myProps.tableState.ordering = [
        ...myProps.tableState.ordering,
        { columnId: 'col4', isHidden: false },
        { columnId: 'col5', isHidden: false },
      ];
      myProps.columns = [
        ...myProps.columns,
        { id: 'col4', name: 'Column 4', width: '200px' },
        { id: 'col5', name: 'Column 5', width: '200px' },
      ];
      // Remove one column
      myProps.tableState.ordering = myProps.tableState.ordering.slice(1);
      myProps.columns = myProps.columns.slice(1);

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '150px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '150px',
      });
      expect(screen.getAllByText('Column 4')[0].closest('th')).toHaveStyle({
        width: '150px',
      });
    });

    it('handles adding a new hidden column', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Add 1 new hidden columns
      myProps.tableState.ordering = [
        ...myProps.tableState.ordering,
        { columnId: 'col4', isHidden: true },
      ];
      myProps.columns = [...myProps.columns, { id: 'col4', name: 'Column 4', width: '100px' }];

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 4')[0].closest('th')).not.toHaveStyle({
        width: '100px',
      });
    });

    it('prevents missing inital column widths from geting a value below the minimum width', () => {
      const WIDTH_SMALLER_THAN_MIN_WIDTH = 50;
      myProps.columns = [
        { id: 'col1', name: 'Column 1' },
        { id: 'col2', name: 'Column 2', width: undefined },
        { id: 'col3', name: 'Column 3', width: '800px' },
      ];
      mockGetBoundingClientRect.mockImplementation(() => ({
        width: WIDTH_SMALLER_THAN_MIN_WIDTH,
      }));
      render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: `${DEFAULT_COLUMN_WIDTH}px`,
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: `${DEFAULT_COLUMN_WIDTH}px`,
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '800px',
      });
    });
  });

  describe('Column resizing active - preserveColumnWidths', () => {
    let ordering;
    let columns;
    let myActions;
    let myProps;
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    const mockGetBoundingClientRect = jest.fn();

    beforeAll(() => {
      Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    });

    beforeEach(() => {
      ordering = [
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ];
      columns = [
        { id: 'col1', name: 'Column 1', width: '100px' },
        { id: 'col2', name: 'Column 2', width: '100px' },
        { id: 'col3', name: 'Column 3', width: '100px' },
      ];

      myActions = { onChangeOrdering: jest.fn(), onColumnResize: jest.fn() };
      myProps = {
        ...commonTableHeadProps,
        columns,
        tableState: {
          ...commonTableHeadProps.tableState,
          ordering,
          activeBar: 'column',
        },
        options: {
          hasResize: true,
          wrapCellText: 'auto',
          truncateCellText: false,
          preserveColumnWidths: true,
        },
        actions: myActions,
        showExpanderColumn: true,
      };
    });

    afterAll(() => {
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it('toggle hide column does not modify the widths of visible columns', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const { container } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 1')
      );

      expect(myActions.onColumnResize).not.toHaveBeenCalled();
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: true },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ]);
    });

    it('toggle show column does not modify the widths of visible columns', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: true },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: false },
        ],
      };

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      const { container } = render(
        <TableHead
          {...myProps}
          columns={[
            { id: 'col1', name: 'Column 1', width: '200px' },
            { id: 'col2', name: 'Column 2', width: '200px' },
            { id: 'col3', name: 'Column 3', width: '200px' },
          ]}
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 1')
      );

      expect(myActions.onColumnResize).not.toHaveBeenCalled();
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ]);
    });

    it('toggle show column without a width will set the width to default width', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: true },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: false },
        ],
      };

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 200 }));

      const { container } = render(
        <TableHead
          {...myProps}
          columns={[
            { id: 'col1', name: 'Column 1', width: undefined },
            { id: 'col2', name: 'Column 2', width: '200px' },
            { id: 'col3', name: 'Column 3', width: '200px' },
          ]}
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      userEvent.click(
        within(
          container.querySelector(`.${iotPrefix}--column-header-row--select-wrapper`)
        ).getByText('Column 1')
      );

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: `${DEFAULT_COLUMN_WIDTH}px` },
        { id: 'col2', name: 'Column 2', width: '200px' },
        { id: 'col3', name: 'Column 3', width: '200px' },
      ]);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith([
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ]);
    });

    it('preservs remaining column widths when columns are removed', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      myProps.options = { ...myProps.options, preserveColumnWidths: true };
      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      myProps.tableState.ordering = myProps.tableState.ordering.slice(2);
      myProps.columns = myProps.columns.slice(2);

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });

      expect(screen.queryByText('Column 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Column 2')).not.toBeInTheDocument();
    });

    it('preservs remaining column widths when removing hidden columns without any widths', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      const orderingWidthHiddenCol1 = [
        { columnId: 'col1', isHidden: true },
        ...myProps.tableState.ordering.slice(1),
      ];
      myProps.tableState.ordering = orderingWidthHiddenCol1;
      myProps.tableState.activeBar = 'column';

      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });
      myProps.tableState.ordering = myProps.tableState.ordering.slice(1);
      myProps.columns = myProps.columns.slice(1);

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(myActions.onColumnResize).not.toHaveBeenCalled();
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
    });

    it('preservs existing column widths when adding new columns', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Add two new columns
      myProps.tableState.ordering = [
        ...myProps.tableState.ordering,
        { columnId: 'col4', isHidden: false },
        { columnId: 'col5', isHidden: false },
      ];
      myProps.columns = [
        ...myProps.columns,
        { id: 'col4', name: 'Column 4', width: '150px' },
        { id: 'col5', name: 'Column 5', width: '300px' },
      ];

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 4')[0].closest('th')).toHaveStyle({
        width: '150px',
      });
      expect(screen.getAllByText('Column 5')[0].closest('th')).toHaveStyle({
        width: '300px',
      });
    });

    it('uses default width when new columns without widths are added', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Add two new columns
      myProps.tableState.ordering = [
        ...myProps.tableState.ordering,
        { columnId: 'col4', isHidden: false },
        { columnId: 'col5', isHidden: false },
      ];
      myProps.columns = [
        ...myProps.columns,
        { id: 'col4', name: 'Column 4' },
        { id: 'col5', name: 'Column 5', width: undefined },
      ];

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 4')[0].closest('th')).toHaveStyle({
        width: `${DEFAULT_COLUMN_WIDTH}px`,
      });
      expect(screen.getAllByText('Column 5')[0].closest('th')).toHaveStyle({
        width: `${DEFAULT_COLUMN_WIDTH}px`,
      });

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: '100px' },
        { id: 'col2', name: 'Column 2', width: '100px' },
        { id: 'col3', name: 'Column 3', width: '100px' },
        { id: 'col4', name: 'Column 4', width: `${DEFAULT_COLUMN_WIDTH}px` },
        { id: 'col5', name: 'Column 5', width: `${DEFAULT_COLUMN_WIDTH}px` },
      ]);
    });

    it('uses rendred widths when columns are modified and initial columns lack widths', () => {
      const renderedWidth = 105;
      mockGetBoundingClientRect.mockImplementation(() => ({ width: renderedWidth }));
      myProps.columns = [
        { id: 'col1', name: 'Column 1' },
        { id: 'col2', name: 'Column 2', width: undefined },
        { id: 'col3', name: 'Column 3', width: '300px' },
      ];
      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Add a new column
      myProps.tableState.ordering = [
        ...myProps.tableState.ordering,
        { columnId: 'col4', isHidden: false },
      ];
      myProps.columns = [...myProps.columns, { id: 'col4', name: 'Column 4', width: '400px' }];

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: `${renderedWidth}px` },
        { id: 'col2', name: 'Column 2', width: `${renderedWidth}px` },
        { id: 'col3', name: 'Column 3', width: '300px' },
        { id: 'col4', name: 'Column 4', width: '400px' },
      ]);
    });

    it('handles adding and removing columns during the same rerender', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Add 2 new columns
      myProps.tableState.ordering = [
        ...myProps.tableState.ordering,
        { columnId: 'col4', isHidden: false },
        { columnId: 'col5', isHidden: false },
      ];
      myProps.columns = [
        ...myProps.columns,
        { id: 'col4', name: 'Column 4', width: '400px' },
        { id: 'col5', name: 'Column 5', width: '500px' },
      ];
      // Remove one column
      myProps.tableState.ordering = myProps.tableState.ordering.slice(1);
      myProps.columns = myProps.columns.slice(1);

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 4')[0].closest('th')).toHaveStyle({
        width: '400px',
      });
      expect(screen.getAllByText('Column 5')[0].closest('th')).toHaveStyle({
        width: '500px',
      });
    });

    it('handles adding a new hidden column', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));
      const { rerender } = render(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      // Add 1 new hidden columns
      myProps.tableState.ordering = [
        ...myProps.tableState.ordering,
        { columnId: 'col4', isHidden: true },
      ];
      myProps.columns = [...myProps.columns, { id: 'col4', name: 'Column 4', width: '100px' }];

      rerender(<TableHead {...myProps} />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getAllByText('Column 1')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 2')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 3')[0].closest('th')).toHaveStyle({
        width: '100px',
      });
      expect(screen.getAllByText('Column 4')[0].closest('th')).not.toHaveStyle({
        width: '100px',
      });
    });
  });

  describe('Column grouping', () => {
    let myProps;

    beforeEach(() => {
      myProps = {
        tableId: 'my Table',
        columns: [
          { id: 'col1', name: 'Column 1', width: '100px' },
          { id: 'col2', name: 'Column 2', width: '100px' },
          { id: 'col3', name: 'Column 3', width: '100px' },
          { id: 'col4', name: 'Column 4', width: '100px' },
          { id: 'col5', name: 'Column 5', width: '100px' },
        ],
        columnGroups: [
          { id: 'groupA', name: 'Group A' },
          { id: 'groupB', name: 'Group B' },
        ],
        tableState: {
          sort: {},
          ordering: [
            { columnId: 'col1', columnGroupId: 'groupA' },
            { columnId: 'col2', columnGroupId: 'groupA' },
            { columnId: 'col3', columnGroupId: 'groupB' },
            { columnId: 'col4', columnGroupId: 'groupB' },
            { columnId: 'col5' },
          ],
          selection: {},
        },
        actions: { onChangeOrdering: jest.fn(), onColumnResize: jest.fn() },
        // wrapCellText & truncateCellText are required in versions < 3.0
        options: { wrapCellText: 'auto', truncateCellText: false },
      };
    });

    it('shows column groups row if there are visible columns belonging to that group', () => {
      const ordering = [
        { columnId: 'col1', columnGroupId: 'groupA' },
        { columnId: 'col2', columnGroupId: 'groupA' },
        { columnId: 'col3' },
        { columnId: 'col4' },
        { columnId: 'col5' },
      ];
      const columnGroups = [{ id: 'groupA', name: 'Group A' }];

      render(
        <TableHead
          {...myProps}
          columnGroups={columnGroups}
          tableState={{ ...myProps.tableState, ordering }}
          testId="my-tablehead"
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      expect(screen.getByTestId('my-tablehead-column-grouping')).toBeDefined();
      expect(screen.getByText('Group A')).toBeDefined();
    });

    it('does not show column groups row if there are no visible columns belonging to that group', () => {
      const ordering = [
        { columnId: 'col1', columnGroupId: 'groupB' },
        { columnId: 'col2', columnGroupId: 'groupC' },
        { columnId: 'col3' },
        { columnId: 'col4' },
        { columnId: 'col5' },
      ];
      const columnGroups = [{ id: 'groupA', name: 'Group A' }];

      render(
        <TableHead
          {...myProps}
          columnGroups={columnGroups}
          tableState={{ ...myProps.tableState, ordering }}
          testId="my-tablehead"
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      expect(screen.queryByText('Group A')).not.toBeInTheDocument();
      expect(screen.queryByTestId('my-tablehead-column-grouping')).not.toBeInTheDocument();
    });

    it('adds the correct number of column headers', () => {
      render(<TableHead {...myProps} testId="my-tablehead" />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(
        within(screen.getByTestId('my-tablehead-column-grouping')).getAllByRole('columnheader')
      ).toHaveLength(2);
    });

    it('appends an extra column header for resize with showExpanderColumn', () => {
      render(
        <TableHead
          {...myProps}
          options={{
            hasResize: true,
            preserveColumnWidths: true,
          }}
          showExpanderColumn
          testId="my-tablehead"
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );
      const lastHeaderIndex = 2;
      const theHeadersInGroupRow = within(
        screen.getByTestId('my-tablehead-column-grouping')
      ).getAllByRole('columnheader');

      expect(theHeadersInGroupRow).toHaveLength(2 + 1);
      expect(theHeadersInGroupRow[lastHeaderIndex]).toHaveClass(
        `${iotPrefix}--table-header__group-row-spacer`
      );
    });

    it('appends an extra column header for row actions', () => {
      render(
        <TableHead
          {...myProps}
          options={{
            hasRowActions: true,
          }}
          testId="my-tablehead"
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );
      const lastHeaderIndex = 2;
      const theHeadersInGroupRow = within(
        screen.getByTestId('my-tablehead-column-grouping')
      ).getAllByRole('columnheader');

      expect(theHeadersInGroupRow).toHaveLength(2 + 1);
      expect(theHeadersInGroupRow[lastHeaderIndex]).toHaveClass(
        `${iotPrefix}--table-header__group-row-spacer`
      );
    });

    it('only appends one extra column header for both row actions and resize with showExpanderColumn', () => {
      render(
        <TableHead
          {...myProps}
          options={{
            hasRowActions: true,
            hasResize: true,
            preserveColumnWidths: true,
          }}
          testId="my-tablehead"
          showExpanderColumn
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      const lastHeaderIndex = 2;
      const theHeadersInGroupRow = within(
        screen.getByTestId('my-tablehead-column-grouping')
      ).getAllByRole('columnheader');

      expect(theHeadersInGroupRow).toHaveLength(2 + 1);
      expect(theHeadersInGroupRow[lastHeaderIndex]).toHaveAttribute('colspan', '2');
      expect(theHeadersInGroupRow[lastHeaderIndex]).toHaveClass(
        `${iotPrefix}--table-header__group-row-spacer`
      );
    });

    it('prepends one extra column header for multi row selection', () => {
      render(
        <TableHead
          {...myProps}
          options={{
            hasRowSelection: 'multi',
          }}
          testId="my-tablehead"
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      const firstHeaderIndex = 0;
      const theHeadersInGroupRow = within(
        screen.getByTestId('my-tablehead-column-grouping')
      ).getAllByRole('columnheader');

      expect(theHeadersInGroupRow).toHaveLength(2 + 1);
      expect(theHeadersInGroupRow[firstHeaderIndex]).toHaveClass(
        `${iotPrefix}--table-header__group-row-spacer`
      );
    });

    it('prepends one extra column header for row expansion', () => {
      render(
        <TableHead
          {...myProps}
          options={{
            hasRowExpansion: true,
          }}
          testId="my-tablehead"
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      const firstHeaderIndex = 0;
      const theHeadersInGroupRow = within(
        screen.getByTestId('my-tablehead-column-grouping')
      ).getAllByRole('columnheader');

      expect(theHeadersInGroupRow).toHaveLength(1 + 2);
      expect(theHeadersInGroupRow[firstHeaderIndex]).toHaveClass(
        `${iotPrefix}--table-header__group-row-spacer`
      );
    });

    it('prepends one extra column header for row nesting', () => {
      render(
        <TableHead
          {...myProps}
          options={{
            hasRowNesting: true,
          }}
          testId="my-tablehead"
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      const firstHeaderIndex = 0;
      const theHeadersInGroupRow = within(
        screen.getByTestId('my-tablehead-column-grouping')
      ).getAllByRole('columnheader');

      expect(theHeadersInGroupRow).toHaveLength(1 + 2);
      expect(theHeadersInGroupRow[firstHeaderIndex]).toHaveClass(
        `${iotPrefix}--table-header__group-row-spacer`
      );
    });

    it('only prepends one extra column header for row nesting and multi row selection', () => {
      render(
        <TableHead
          {...myProps}
          options={{
            hasRowNesting: true,
            hasRowSelection: 'multi',
          }}
          testId="my-tablehead"
        />,
        {
          container: document.body.appendChild(document.createElement('table')),
        }
      );

      const firstHeaderIndex = 0;
      const theHeadersInGroupRow = within(
        screen.getByTestId('my-tablehead-column-grouping')
      ).getAllByRole('columnheader');

      expect(theHeadersInGroupRow).toHaveLength(1 + 2);
      expect(theHeadersInGroupRow[firstHeaderIndex]).toHaveAttribute('colspan', '2');
      expect(theHeadersInGroupRow[firstHeaderIndex]).toHaveClass(
        `${iotPrefix}--table-header__group-row-spacer`
      );
    });

    it('adds rowspan to "normal column headers" that do not belong to a group while group row is showing', () => {
      render(<TableHead {...myProps} testId="my-tablehead" />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getByText('Column 5').closest('th')).toHaveAttribute('rowspan', '2');
    });

    it('adds with-column-groups class to table head container', () => {
      render(<TableHead {...myProps} testId="my-tablehead" />, {
        container: document.body.appendChild(document.createElement('table')),
      });

      expect(screen.getByTestId('my-tablehead')).toHaveClass(
        `${iotPrefix}--table-head--with-column-groups`
      );
    });
  });
});
