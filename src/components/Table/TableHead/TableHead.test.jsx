import React from 'react';
import { mount } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';

import { settings } from '../../../constants/Settings';

import TableHead from './TableHead';
import TableHeader from './TableHeader';

const { iotPrefix } = settings;

const commonTableHeadProps = {
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
  actions: { onChangeOrdering: jest.fn() },
};

describe('TableHead', () => {
  it('columns should render', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(3);
  });

  it('columns should render extra column for multi select', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: {
        hasRowExpansion: true,
        hasRowSelection: 'multi',
      },
    };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(4);
  });

  it('hasRowActions flag creates empty TableHeader', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: {
        hasRowActions: true,
      },
    };
    const wrapper = mount(<TableHead {...myProps} />);
    const lastTableHeader = wrapper.find('TableHeader').last();

    expect(lastTableHeader.getDOMNode().className).toEqual(
      `${iotPrefix}--table-header-row-action-column`
    );

    expect(lastTableHeader.find('.bx--table-header-label').getDOMNode().innerHTML).toEqual('');
  });

  it('make sure data-column is set for width', () => {
    const myProps = { ...commonTableHeadProps };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find('th[data-column="col1"]');
    expect(tableHeaders).toHaveLength(1);
  });

  it('activeBar set to "filter" shows FilterHeaderRow', () => {
    const myProps = { ...commonTableHeadProps, tableState: { ...commonTableHeadProps.tableState } };
    myProps.tableState.activeBar = 'filter';
    let wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('FilterHeaderRow')).toBeTruthy();

    delete myProps.tableState.activeBar;
    wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('FilterHeaderRow')).toBeFalsy();
  });

  it('activeBar set to "column" shows ColumnHeaderRow', () => {
    const myProps = { ...commonTableHeadProps, tableState: { ...commonTableHeadProps.tableState } };
    myProps.tableState.activeBar = 'column';
    const wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('ColumnHeaderRow')).toBeTruthy();
  });

  it('check has resize if has resize is true ', () => {
    const myProps = { ...commonTableHeadProps, options: { hasResize: true } };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find(`div.${iotPrefix}--column-resize-handle`);
    tableHeaders.first().simulate('click');
    expect(tableHeaders).toHaveLength(2);
  });

  it('check not resize if has resize is false ', () => {
    const myProps = { ...commonTableHeadProps, options: { hasResize: false } };
    const wrapper = mount(<TableHead {...myProps} />);
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

    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(2);
  });

  it('header renders with resizing columns when columns are empty on initial render', () => {
    const wrapper = mount(
      <TableHead
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
        options={{ hasResize: true }}
      />
    );
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(0);
    // trigger a re-render with non-empty columns
    wrapper.setProps({ ...commonTableHeadProps, options: { hasResize: true } });
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
      columns: [{ id: 'col1', name: 'Column 1', width: '101' }],
      tableState: {
        ...commonTableHeadProps.tableState,
        ordering: [{ columnId: 'col1', isHidden: false }],
      },
      options: { hasResize: false },
    };

    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeader = wrapper.find(TableHeader).first();
    expect(tableHeader.prop('width')).toBe('101');
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
        options: { hasResize: true },
        actions: myActions,
      };
    });

    afterAll(() => {
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it('toggle hide column correctly updates the column widths of visible columns', () => {
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const wrapper = mount(<TableHead {...myProps} />);
      const onColumnToggleFunc = wrapper.find('ColumnHeaderRow').prop('onColumnToggle');
      const orderingAfterTogleHide = [
        { columnId: 'col1', isHidden: true },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ];

      // Hide col1. The width of col1 is proportionally distributed over
      // the remaining visible columns.

      onColumnToggleFunc('col1', orderingAfterTogleHide);

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: '100px' },
        { id: 'col2', name: 'Column 2', width: '150px' },
        { id: 'col3', name: 'Column 3', width: '150px' },
      ]);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith(orderingAfterTogleHide);
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

      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const wrapper = mount(<TableHead {...myProps} />);
      const onColumnToggleFunc = wrapper.find('ColumnHeaderRow').prop('onColumnToggle');

      const orderingAfterTogleShow = [
        { columnId: 'col1', isHidden: false },
        { columnId: 'col2', isHidden: false },
        { columnId: 'col3', isHidden: false },
      ];

      // Show col1. The width needed for col1 is proportionally subtracted from
      // the other visible columns.
      onColumnToggleFunc('col1', orderingAfterTogleShow);

      expect(myActions.onColumnResize).toHaveBeenCalledWith([
        { id: 'col1', name: 'Column 1', width: '100px' },
        { id: 'col2', name: 'Column 2', width: '50px' },
        { id: 'col3', name: 'Column 3', width: '50px' },
      ]);
      expect(myActions.onChangeOrdering).toHaveBeenCalledWith(orderingAfterTogleShow);
    });

    it('the last visible column should never have a resize handle', () => {
      myProps.tableState = {
        ...myProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: false },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: false },
        ],
      };
      mockGetBoundingClientRect.mockImplementation(() => ({ width: 100 }));

      const wrapper = mount(<TableHead {...myProps} />);
      const resizeHandles = wrapper.find(`div.${iotPrefix}--column-resize-handle`);
      expect(resizeHandles).toHaveLength(2);
      const lastTableHeader = wrapper.find(`.${iotPrefix}--table-header-resize`).last();
      expect(lastTableHeader.find(`div.${iotPrefix}--column-resize-handle`)).toHaveLength(0);

      // Hide the last column (use shortcut via props)
      const orderingAfterToggleHide = cloneDeep(myProps.tableState.ordering).map(col =>
        col.columnId === 'col3' ? { ...col, isHidden: true } : col
      );
      wrapper.setProps({
        ...myProps,
        tableState: { ...myProps.tableState, ordering: orderingAfterToggleHide },
      });
      wrapper.update();
      const updatedResizeHandles = wrapper.find(`div.${iotPrefix}--column-resize-handle`);
      expect(updatedResizeHandles).toHaveLength(1);

      const modLastTableHeader = wrapper.find(`.${iotPrefix}--table-header-resize`).last();
      expect(modLastTableHeader.find(`div.${iotPrefix}--column-resize-handle`)).toHaveLength(0);
    });
  });
});
