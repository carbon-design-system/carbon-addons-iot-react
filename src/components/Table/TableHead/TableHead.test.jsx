import React from 'react';
import { mount } from 'enzyme';
// import { DataTable } from 'carbon-components-react';

import TableHead from './TableHead';
import TableHeader from './TableHeader';

// const { TableHeader } = DataTable;

const commonTableHeadProps = {
  /** List of columns */
  columns: [{ id: 'col1', name: 'Column 1', isSortable: false }],
  tableState: {
    selection: {},
    sort: {},
    ordering: [{ columnId: 'col1', isHidden: false }, { columnId: 'col2', isHidden: false }],
  },
  actions: {},
  hasResize: true,
};

describe('TableHead', () => {
  test('columns should render', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(1);
  });
  test('make sure data-column is set for width', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find('th[data-column="col1"]');
    expect(tableHeaders).toHaveLength(1);
  });
  test('check has resize if has resize is true ', () => {
    commonTableHeadProps.hasResize = true;
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find('div.column-resize-wrapper');
    expect(tableHeaders).toHaveLength(1);
  });

  test('check not resize if has resize is false ', () => {
    commonTableHeadProps.hasResize = false;
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find('div.column-resize-wrapper');
    expect(tableHeaders).toHaveLength(0);
  });
});
