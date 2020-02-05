import React from 'react';
import { storiesOf } from '@storybook/react';
import { Table as CarbonTable } from 'carbon-components-react';

import TableHead from './TableHead';

export const tableColumns = [
  { id: 'col1', name: 'Column 1', isSortable: false },
  { id: 'col2', name: 'Column 2', isSortable: false },
  { id: 'col3', name: 'Column 3', isSortable: false },
];

const commonTableHeadProps = {
  /** List of columns */
  columns: tableColumns,
  tableState: {
    selection: {},
    sort: {},
    ordering: [
      { columnId: 'col1', isHidden: false },
      { columnId: 'col2', isHidden: false },
      { columnId: 'col3', isHidden: false },
    ],
  },
  actions: {},
  options: { hasResize: true },
};

storiesOf('Watson IoT|TableHead', module)
  .add('Resizable TableHead in CarbonTable', () => (
    <CarbonTable>
      <TableHead {...commonTableHeadProps} />
    </CarbonTable>
  ))
  .add('Non resizable TableHead in CarbonTable', () => (
    <CarbonTable>
      <TableHead {...commonTableHeadProps} hasResize={false} />
    </CarbonTable>
  ));
