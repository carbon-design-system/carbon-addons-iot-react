import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import TableCard from './TableCard';

const tableColumns = [
  {
    id: 'alert',
    name: 'Alert',
  },
  {
    id: 'creator',
    name: 'Creator',
    isSortable: true,
  },
  {
    id: 'hour',
    name: 'Hour',
    isSortable: true,
  },
];

const data = [
  {
    id: `row-1`,
    values: {
      alert: 'AHI005 Asset failure',
      creator: 'ME',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-2`,
    values: {
      alert: 'AHI003 process need to optimize, afjust X variables',
      creator: 'ME',
      hour: '09:40h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-3`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-4`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-5`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-6`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-7`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-8`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-9`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-10`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
  {
    id: `row-11`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
    },
    rowActions: [
      {
        id: 'open',
        labelText: 'Open',
        isOverflow: true,
      },
      {
        id: 'view',
        labelText: 'View',
        isOverflow: true,
      },
      {
        id: 'openTicket',
        labelText: 'Open ticket',
        isOverflow: true,
      },
    ],
  },
];

const actions = {
  pagination: {
    /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
    onChangePage: action('onChangePage'),
  },
  table: {
    onRowClicked: action('onRowClicked'),
    onApplyRowAction: action('onApplyRowAction'),
  },
};

const defaultOrdering = tableColumns.map(c => ({
  columnId: c.id,
}));

storiesOf('List Card (Experimental)', module).add('medium', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.WIDE);
  console.log('Size', size);
  console.log('Min size for card? ', getCardMinSize('lg', size));
  console.log(tableColumns);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        data={data}
        columns={tableColumns}
        size={size}
        actions={actions}
        options={{
          hasRowActions: true,
          hasPagination: true,
        }}
        onRowClick={action('row clicked')}
        view={{
          filters: [],
          table: {
            ordering: defaultOrdering,
            sort: {
              columnId: 'view',
              direction: 'ASC',
            },
          },
          pagination: {
            pageSize: 10,
            pageSizes: [10, 20, 30],
            page: 1,
            totalItems: data.length,
          },
        }}
      />
    </div>
  );
});
