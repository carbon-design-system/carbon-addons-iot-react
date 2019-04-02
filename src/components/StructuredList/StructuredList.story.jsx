import React from 'react';
import { select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import StructuredList from './StructuredList';

const columns = [
  {
    id: 'columnA',
    title: 'A',
  },
  {
    id: 'columnB',
    title: 'B',
  },
  {
    id: 'columnC',
    title: 'C',
  },
];

const data = [
  {
    id: 'row-0',
    values: {
      columnA: 'hey A',
      columnB: 'hey B',
      columnC: 'hey C',
    },
  },
  {
    id: 'row-1',
    values: {
      columnA: 'hey A again',
      columnB: 'hey B again',
      columnC: 'hey C again',
    },
  },
  {
    id: 'row-2',
    values: {
      columnA: 'hey hey A',
      columnB: 'hey hey B',
      columnC: 'hey hey C',
    },
  },
];

storiesOf('StructuredList', module)
  .add('default ', () => (
    <StructuredList
      design={select('Row design', ['normal', 'mini'], 'mini')}
      data={data}
      columns={columns}
      onRowClick={action('onRowClick')}
    />
  ))
  .add('with empty state', () => (
    <StructuredList
      columns={columns}
      data={[]}
      loadingDataLabel="No data is available yet."
      onRowClick={action('onRowClick')}
    />
  ))
  .add('with fixed column widths', () => (
    <StructuredList
      columns={columns.map((i, idx) => ({ ...i, width: `${10 + idx * 2}rem` }))}
      data={data}
      isFixedWidth
      loadingDataLabel="No data is available yet."
      onRowClick={action('onRowClick')}
    />
  ));
