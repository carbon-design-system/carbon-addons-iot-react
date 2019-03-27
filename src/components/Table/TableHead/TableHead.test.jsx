import React from 'react';
import { mount } from 'enzyme';
import { DataTable } from 'carbon-components-react';

import TableHead from './TableHead';

const { TableHeader } = DataTable;

const commonTableHeadProps = {
  /** List of columns */
  columns: [{ id: 'col1', name: 'Column 1', isSortable: false }],
  tableState: { selection: {}, sort: {}, ordering: [{ columnId: 'col1', isHidden: false }] },
  actions: {},
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
});
