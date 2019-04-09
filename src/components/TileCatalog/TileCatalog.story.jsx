import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Add from '@carbon/icons-react/lib/add/32';
// import { Icon } from 'carbon-components-react';

import StatefulTileCatalog from './StatefulTileCatalog';
import TileCatalog from './TileCatalog';
import CatalogContent from './CatalogContent';

const longDescription =
  'Really long string with lots of lots of text too much to show on one line and when it wraps it might cause some interesting issues especially if it starts vertically wrapping outside of tile bounds at the bottom of the tile';

const tileRenderFunction = ({ values }) => (
  <CatalogContent
    {...values}
    icon={
      <Add
        fill="black"
        width={90}
        height={90}
        description="This is a description of the icon and what it does in context"
        className="extra-class"
      />
    }
  />
);

const commonTileCatalogProps = {
  title: 'My Tile Catalog',
  id: 'entityType',
  tiles: [
    {
      id: 'test1',
      values: {
        title: 'Test Tile with really long title that should wrap',
        description: longDescription,
      },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test2',
      values: { title: 'Test Tile2', description: longDescription },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test3',
      values: { title: 'Test Tile3', description: 'Tile contents' },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test4',
      values: { title: 'Test Tile4', description: longDescription },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test5',
      values: { title: 'Test Tile5', description: longDescription },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test6',
      values: { title: 'Test Tile6', description: longDescription },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test7',
      values: { title: 'Test Tile7', description: longDescription },
      renderContent: tileRenderFunction,
    },
  ],
  onSelection: action('onSelection'),
};

storiesOf('TileCatalog', module)
  .add('default', () => <TileCatalog {...commonTileCatalogProps} />)
  .add(
    'with search',
    () => (
      // Example stateful catalog component that can search
      <StatefulTileCatalog
        {...commonTileCatalogProps}
        search={{
          placeHolderText: 'Search catalog',
          onSearch: action('onSearch'),
        }}
        pagination={{ pageSize: 6, onPage: action('onPage') }}
      />
    ),
    {
      info: {
        propTables: [TileCatalog],
        propTablesExclude: [StatefulTileCatalog],
      },
    }
  )
  .add(
    'with pages',
    () => (
      <StatefulTileCatalog
        {...commonTileCatalogProps}
        pagination={{ pageSize: 6, onPage: action('onPage') }}
      />
    ),
    {
      info: {
        propTables: [TileCatalog],
        propTablesExclude: [StatefulTileCatalog],
      },
    }
  )
  .add('loading', () => <TileCatalog {...commonTileCatalogProps} isLoading />);
