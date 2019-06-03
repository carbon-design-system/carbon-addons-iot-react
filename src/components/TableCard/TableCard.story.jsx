import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import TableCard from './TableCard';

const renderCustomCell = ({ value: alert }) => {
  return (
    <div>
      <svg height="10" width="10">
        <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="red" />
      </svg>
      <span style={{ marginLeft: '10px' }}>{alert}</span>
    </div>
  );
};

const tableColumns = [
  {
    id: 'alert',
    name: 'Alert',
    renderDataFunction: renderCustomCell,
    priority: 1,
  },
  {
    id: 'creator',
    name: 'Creator',
    isSortable: true,
    priority: 3,
  },
  {
    id: 'hour',
    name: 'Hour',
    isSortable: true,
    priority: 2,
  },
];

const data = [
  {
    id: `row-1`,
    values: {
      alert: 'AHI005 Asset failure',
      creator: 'ME',
      hour: '16:20h',
      actionColumn: [
        {
          id: 'open',
          labelText: 'Openn',
        },
        {
          id: 'view',
          labelText: 'Vieww',
        },
        {
          id: 'open',
          labelText: 'Open Tickygyget',
        },
      ],
    },
  },
  {
    id: `row-2`,
    values: {
      alert: 'AHI003 process need to optimize, afjust X variables',
      creator: 'ME',
      hour: '09:40h',
      actionColumn: [
        {
          id: 'open',
          labelText: 'Open',
          icon: 'icon--edit',
        },
      ],
    },
  },
  {
    id: `row-3`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
      actionColumn: [
        {
          id: 'open',
          labelText: 'Open',
        },
        {
          id: 'view',
          labelText: 'View',
        },
        {
          id: 'open',
          labelText: 'Open Ticket',
        },
      ],
    },
  },
  {
    id: `row-4`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
      actionColumn: [
        {
          id: 'open',
          labelText: 'Open',
        },
        {
          id: 'view',
          labelText: 'View',
        },
        {
          id: 'open',
          labelText: 'Open Ticket',
        },
      ],
    },
  },
  {
    id: `row-5`,
    values: {
      alert: 'AHI001 proccess need to optimize',
      creator: 'Line Supervisor',
      hour: '16:20h',
      actionColumn: [
        {
          id: 'open',
          labelText: 'Open',
        },
        {
          id: 'view',
          labelText: 'View',
        },
        {
          id: 'open',
          labelText: 'Open Ticket',
        },
      ],
    },
  },
  {
    id: `row-6`,
    values: {
      alert: 'AHI001 proccess need to optimize.',
      creator: 'Line Supervisor',
      hour: '16:20h',
      actionColumn: [
        {
          id: 'open',
          labelText: 'Open',
        },
        {
          id: 'view',
          labelText: 'View',
        },
        {
          id: 'open',
          labelText: 'Open Ticket',
        },
      ],
    },
  },
  {
    id: `row-7`,
    values: {
      alert: 'AHI001 proccess need to optimize',
      creator: 'Line Supervisor',
      hour: '16:20h',
      actionColumn: [
        {
          id: 'open',
          labelText: 'Open',
          icon: 'icon--edit',
        },
      ],
    },
  },
  {
    id: `row-8`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
      actionColumn: [
        {
          id: 'open',
          labelText: 'Open',
        },
        {
          id: 'view',
          labelText: 'View',
        },
        {
          id: 'open',
          labelText: 'Open Ticket',
        },
      ],
    },
  },
  {
    id: `row-9`,
    values: {
      alert: 'AHI001 proccess need to optimize, adjust Y variables',
      creator: 'Line Supervisor',
      hour: '16:20h',
      actionColumn: [
        {
          id: 'open',
          labelText: 'Open',
        },
        {
          id: 'view',
          labelText: 'View',
        },
        {
          id: 'open',
          labelText: 'Open Ticket',
        },
      ],
    },
  },
];

const actions = {
  pagination: {
    /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
    onChangePage: action('onChangePage'),
  },
  table: {
    onChangeSort: action('onChangeSort'),
    onRowClicked: action('onRowClicked'),
  },
};

storiesOf('Table Card (Experimental)', module).add('medium', () => {
  const size = select(
    'size',
    [CARD_SIZES.TALL, CARD_SIZES.LARGE, CARD_SIZES.XLARGE],
    CARD_SIZES.LARGE
  );

  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <TableCard
        title={text('title', 'Open Alerts')}
        id="table-list"
        data={data}
        columns={tableColumns}
        size={size}
        actions={actions}
        view={{
          pagination: {
            pageSize: 8,
            pageSizes: [8],
            page: 1,
            totalItems: data.length,
          },
          table: {
            ordering: null,
            sort: {
              columnId: 'alert',
              direction: 'ASC',
            },
          },
        }}
      />
    </div>
  );
});
