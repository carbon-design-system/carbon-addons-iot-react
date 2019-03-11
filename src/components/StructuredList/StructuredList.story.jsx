import React from 'react';
import { select } from '@storybook/addon-knobs';
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
  .add('Simple ', () => (
    <StructuredList
      design={select('Row design', ['normal', 'mini'], 'mini')}
      data={data}
      columns={columns}
      onRowClick={() => window.alert('row clicked')}
    />
  ))
  .add('Empty', () => (
    <StructuredList
      columns={columns}
      data={[]}
      loadingDataLabel="Waiting for data to be loaded"
      onRowClick={() => window.alert('row clicked')}
    />
  ));
