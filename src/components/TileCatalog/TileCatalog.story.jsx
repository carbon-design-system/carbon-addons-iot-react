import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Icon } from 'carbon-components-react';

import TileCatalog from './TileCatalog';
import CatalogContent from './CatalogContent';

const longDescription =
  'Really long string with lots of lots of text too much to show on one line and when it wraps it might cause some interesting issues especially if it starts vertically wrapping outside of tile bounds at the bottom of the tile';

const commonTileCatalogProps = {
  title: 'My Tile Catalog',
  id: 'entityType',
  tiles: [
    {
      id: 'test1',
      content: (
        <CatalogContent
          title="Test Tile with really long title that should wrap"
          description={longDescription}
          icon={<Icon width={50} height={50} name="icon--add" />}
        />
      ),
    },
    {
      id: 'test2',
      content: (
        <CatalogContent
          title="Test Tile2"
          description={longDescription}
          icon={<Icon width={50} height={50} name="icon--add" />}
        />
      ),
    },
    {
      id: 'test3',
      content: (
        <CatalogContent
          title="Test Tile3"
          description="Tile contents"
          icon={<Icon width={50} height={50} name="icon--add" />}
        />
      ),
    },
    {
      id: 'test4',
      content: (
        <CatalogContent
          title="Test Tile4"
          description="Tile contents"
          icon={<Icon width={50} height={50} name="icon--add" />}
        />
      ),
    },
    {
      id: 'test5',
      content: (
        <CatalogContent
          title="Test Tile5"
          description="Tile contents"
          icon={<Icon width={50} height={50} name="icon--add" />}
        />
      ),
    },
    {
      id: 'test6',
      content: (
        <CatalogContent
          title="Test Tile6"
          description="Tile contents"
          icon={<Icon width={50} height={50} name="icon--add" />}
        />
      ),
    },
    {
      id: 'test7',
      content: (
        <CatalogContent
          title="Test Tile7"
          description="Tile contents"
          icon={<Icon width={50} height={50} name="icon--add" />}
        />
      ),
    },
  ],
  onChange: action('onChange'),
};

const SearchableTileCatalog = () => {
  const [search, setSearch] = useState();
  const filteredTiles = search
    ? commonTileCatalogProps.tiles.filter(tile => tile.content.includes(search))
    : commonTileCatalogProps.tiles;

  return (
    <TileCatalog
      {...commonTileCatalogProps}
      tiles={filteredTiles}
      search={{
        placeHolderText: 'Search catalog',
        onSearch: searchText => {
          setSearch(searchText);
          action('onSearch')(searchText);
        },
      }}
    />
  );
};
storiesOf('TileCatalog', module)
  .add('default', () => <TileCatalog {...commonTileCatalogProps} />)
  .add(
    'with search',
    () => (
      // Example stateful catalog component that can search
      <SearchableTileCatalog />
    ),
    {
      info: {
        propTables: [TileCatalog],
        propTablesExclude: [SearchableTileCatalog],
        source: false,
      },
    }
  )
  .add('with pages', () => (
    <TileCatalog
      {...commonTileCatalogProps}
      pagination={{ pageSize: 6, onPage: action('onPage') }}
    />
  ));
