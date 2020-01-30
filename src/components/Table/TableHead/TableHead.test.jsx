import React from 'react';
import { mount } from 'enzyme';

import TableHead from './TableHead';
import TableHeader from './TableHeader';

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
  hasResize: true,
};

describe('TableHead', () => {
  test('columns should render', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(3);
  });

  test('columns should render extra column for multi select', () => {
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

  test('hasRowActions flag creates empty TableHeader', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: {
        hasRowActions: true,
      },
    };
    const wrapper = mount(<TableHead {...myProps} />);
    const emptyTableHeader = wrapper.find('TableHeader .bx--table-header-label').last();
    expect(emptyTableHeader).toEqual({});
  });

  test('make sure data-column is set for width', () => {
    const myProps = { ...commonTableHeadProps };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find('th[data-column="col1"]');
    expect(tableHeaders).toHaveLength(1);
  });

  test('activeBar set to "filter" shows FilterHeaderRow', () => {
    const myProps = { ...commonTableHeadProps, tableState: { ...commonTableHeadProps.tableState } };
    myProps.tableState.activeBar = 'filter';
    let wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('FilterHeaderRow')).toBeTruthy();

    delete myProps.tableState.activeBar;
    wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('FilterHeaderRow')).toBeFalsy();
  });

  test('activeBar set to "column" shows ColumnHeaderRow', () => {
    const myProps = { ...commonTableHeadProps, tableState: { ...commonTableHeadProps.tableState } };
    myProps.tableState.activeBar = 'column';
    const wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('ColumnHeaderRow')).toBeTruthy();
  });

  test('check has resize if has resize is true ', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find('div.column-resize-handle');
    expect(tableHeaders).toHaveLength(2);
  });

  test('check not resize if has resize is false ', () => {
    const myProps = { ...commonTableHeadProps, hasResize: false };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find('div.column-resize-handle');
    expect(tableHeaders).toHaveLength(0);
  });

  test('check hidden item is not shown ', () => {
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
});
