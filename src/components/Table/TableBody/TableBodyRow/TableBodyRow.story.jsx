import React from 'react';
import { storiesOf } from '@storybook/react';
import { actions } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { DataTable } from 'carbon-components-react';

import TableBodyRow from './TableBodyRow';

const { Table, TableContainer, TableBody } = DataTable;

const tableBodyRowProps = {
  ordering: [{ columnId: 'string' }],
  columns: [{ id: 'string', name: 'String' }],
  id: 'rowId',
  totalColumns: 1,
  values: { string: 'My String' },
  tableActions: actions(
    'onRowSelected',
    'onRowClicked',
    'onApplyRowAction',
    'onRowExpanded',
    'onClearRowError'
  ),
};

const TableDecorator = storyFn => (
  <TableContainer>
    <Table>
      <TableBody>{storyFn()}</TableBody>
    </Table>
  </TableContainer>
);
storiesOf('TableBodyRow', module)
  // Table rows need to be rendered in a tbody or else they'll throw an error
  .addDecorator(TableDecorator)
  .add('normal', () => <TableBodyRow {...tableBodyRowProps} />)
  .add('rowActions', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      isExpanded={boolean('isExpanded', false)}
      rowActions={[{ id: 'add', icon: 'icon--add' }]}
      options={{ hasRowActions: true, hasRowExpansion: true }}
    />
  ))
  .add('is not selectable', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      isSelectable={boolean('isSelectable', false)}
      rowActions={[{ id: 'add', icon: 'icon--add' }]}
      options={{ hasRowActions: true, hasRowSelection: 'multi' }}
    />
  ))
  .add('is selectable', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      rowActions={[{ id: 'add', icon: 'icon--add' }]}
      options={{ hasRowActions: true, hasRowSelection: 'multi' }}
    />
  ))
  .add('rowActions running', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      rowActions={[{ id: 'add', icon: 'icon--add' }]}
      options={{ hasRowActions: true, hasRowExpansion: true }}
      isRowActionRunning
      isExpanded={boolean('isExpanded', false)}
    />
  ))
  .add('rowActions error', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      rowActions={[{ id: 'add', icon: 'icon--add' }]}
      options={{ hasRowActions: true, hasRowExpansion: true }}
      rowActionsError={{
        title: 'Import failed:',
        message: 'Model type not currently supported.',
        learnMoreURL: 'http://www.cnn.com',
      }}
      isExpanded={boolean('isExpanded', false)}
    />
  ));
