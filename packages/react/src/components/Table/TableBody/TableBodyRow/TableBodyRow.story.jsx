import React from 'react';
import { actions } from '@storybook/addon-actions';
import { boolean, select } from '@storybook/addon-knobs';
import { Table, TableContainer, TableBody } from 'carbon-components-react';
import { Add32, Edit16, Stop16, TrashCan16 } from '@carbon/icons-react';

import TableBodyRow from './TableBodyRow';

const tableBodyRowProps = {
  ordering: [{ columnId: 'string' }],
  columns: [{ id: 'string', name: 'String' }],
  id: 'rowId',
  tableId: 'tableId',
  totalColumns: 1,
  values: { string: 'My String' },
  tableActions: actions(
    'onRowSelected',
    'onRowClicked',
    'onApplyRowAction',
    'onRowExpanded',
    'onClearRowError'
  ),
  options: {
    wrapCellText: 'never',
    truncateCellText: false,
  },
};

const TableDecorator = (storyFn) => (
  <TableContainer>
    <Table>
      <TableBody>{storyFn()}</TableBody>
    </Table>
  </TableContainer>
);

export default {
  title: '1 - Watson IoT/Table/TableBodyRow',
  decorators: [TableDecorator],

  parameters: {
    component: TableBodyRow,
  },
};

export const Normal = () => <TableBodyRow {...tableBodyRowProps} />;

Normal.storyName = 'normal';

export const RowActions = () => (
  <TableBodyRow
    {...tableBodyRowProps}
    isExpanded={boolean('isExpanded', false)}
    rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
    options={{
      ...tableBodyRowProps.options,
      hasRowActions: true,
      hasRowExpansion: true,
    }}
  />
);

RowActions.storyName = 'row actions';

export const RowActionsWithOverflow = () => (
  <TableBodyRow
    {...tableBodyRowProps}
    isExpanded={boolean('isExpanded', false)}
    rowActions={[
      { id: 'add', renderIcon: Add32, iconDescription: 'Add' },
      { id: 'edit', renderIcon: Edit16, isOverflow: true, labelText: 'Edit' },
      {
        id: 'test1',
        renderIcon: Stop16,
        isOverflow: true,
        labelText: 'Test 1',
        hasDivider: true,
      },
      {
        id: 'test2',
        renderIcon: Stop16,
        isOverflow: true,
        labelText: 'Test 2',
      },
      {
        id: 'test3',
        renderIcon: Stop16,
        isOverflow: true,
        labelText: 'Test 3',
      },
      {
        id: 'delete',
        renderIcon: TrashCan16,
        isOverflow: true,
        labelText: 'Delete',
        isDelete: true,
      },
    ]}
    options={{
      ...tableBodyRowProps.options,
      hasRowActions: true,
      hasRowExpansion: true,
    }}
  />
);

RowActionsWithOverflow.storyName = 'row actions with overflow';

export const IsNotSelectable = () => (
  <TableBodyRow
    {...tableBodyRowProps}
    isSelectable={boolean('isSelectable', false)}
    rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
    options={{
      ...tableBodyRowProps.options,
      hasRowActions: true,
      hasRowSelection: select('Single/Multi select', ['single', 'multi'], 'multi'),
      showRadioButton: true,
    }}
  />
);

IsNotSelectable.storyName = 'is not selectable';

export const IsSelectable = () => (
  <TableBodyRow
    {...tableBodyRowProps}
    rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
    options={{
      ...tableBodyRowProps.options,
      hasRowActions: true,
      hasRowSelection: select('Single/Multi select', ['single', 'multi'], 'multi'),
      showRadioButton: boolean('Show Radio button', false),
    }}
  />
);

IsSelectable.storyName = 'is selectable';

IsNotSelectable.storyName = 'is not selectable';

export const SingleSelect = () => (
  <TableBodyRow
    {...tableBodyRowProps}
    rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
    options={{
      ...tableBodyRowProps.options,
      hasRowActions: true,
      hasRowSelection: 'single',
      showRadioButton: boolean('show radio button', false),
    }}
  />
);

SingleSelect.storyName = 'single selected';

export const RowActionsRunning = () => (
  <TableBodyRow
    {...tableBodyRowProps}
    rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
    options={{
      ...tableBodyRowProps.options,
      hasRowActions: true,
      hasRowExpansion: true,
    }}
    isRowActionRunning
    isExpanded={boolean('isExpanded', false)}
  />
);

RowActionsRunning.storyName = 'rowActions running';

export const RowActionsError = () => (
  <TableBodyRow
    {...tableBodyRowProps}
    rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
    options={{
      ...tableBodyRowProps.options,
      hasRowActions: true,
      hasRowExpansion: true,
    }}
    rowActionsError={{
      title: 'Import failed:',
      message: 'Model type not currently supported.',
      learnMoreURL: 'http://www.cnn.com',
    }}
    isExpanded={boolean('isExpanded', false)}
  />
);

RowActionsError.storyName = 'rowActions error';
