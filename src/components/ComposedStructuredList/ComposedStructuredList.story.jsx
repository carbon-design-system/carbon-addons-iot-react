import React from 'react';
import { select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import DeprecationNotice, { deprecatedStoryTitle } from '../../internal/DeprecationNotice';

import ComposedStructuredList from './ComposedStructuredList';

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
      columnA: <div />,
      columnB: 'hey B',
      columnC: 'hey C',
    },
  },
  {
    id: 'row-1',
    values: {
      columnA: 'hey A again fixed column width',
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

const StructuredListInputProps = {
  className: 'checks',
};

storiesOf('Watson IoT|ComposedStructuredList (Deprecated)', module)
  .add(deprecatedStoryTitle, () => (
    <DeprecationNotice
      deprecatedComponentName="ComposedStructuredList"
      replacementComponentName="StructuredList"
    />
  ))
  .add('default ', () => (
    <ComposedStructuredList
      design={select('Row design', ['normal', 'mini'], 'mini')}
      data={data}
      columns={columns}
      onRowClick={action('onRowClick')}
      StructuredListInputProps={StructuredListInputProps}
    />
  ))
  .add('with empty state', () => (
    <ComposedStructuredList
      columns={columns}
      data={[]}
      loadingDataLabel="No data is available yet."
      onRowClick={action('onRowClick')}
    />
  ))
  .add('with fixed column widths', () => (
    <ComposedStructuredList
      columns={columns.map((i, idx) => ({ ...i, width: `${10 + idx * 2}rem` }))}
      data={data}
      isFixedWidth
      loadingDataLabel="No data is available yet."
      onRowClick={action('onRowClick')}
    />
  ))
  .add('with empty state with fixed column width', () => (
    <ComposedStructuredList
      columns={columns.map((i, idx) => ({ ...i, width: `${10 + idx * 2}rem` }))}
      data={[]}
      isFixedWidth
      loadingDataLabel="No data is available yet."
      onRowClick={action('onRowClick')}
    />
  ))
  .add(
    'custom cell renderer',
    () => (
      <ComposedStructuredList
        columns={columns.map(column => ({
          ...column,
          renderDataFunction: ({ value }) => <span style={{ color: 'blue' }}>{value}</span>,
        }))}
        data={data}
        onRowClick={action('onRowClick')}
      />
    ),
    {
      info: {
        text: `

        To render a your own widget in a list cell, pass a renderDataFunction prop along with your column metadata.

        <br />

        ~~~js
        columns=[ { id: 'columnA', title: 'A', renderDataFunction: myCustomRenderer }, ...]
        ~~~

        <br />

        The renderDataFunction is called with this payload

        <br />

        ~~~js
           {
              value: PropTypes.any (current cell value),
              columnId: PropTypes.string,
              rowId: PropTypes.string,
              row: the full data for this rowPropTypes.object like this {col: value, col2: value}
           }

           const myCustomRenderer = ({ value }) => <span style={{ color: 'blue' }}>{value}</span>
        ~~~

        <br />

          `,
      },
    }
  );
