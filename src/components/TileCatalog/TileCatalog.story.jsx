import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TileCatalog from './TileCatalog';

const commonTileCatalogProps = {
  title: 'My Tile Catalog',
  id: 'entityType',
  tiles: [
    { id: 'test1', content: 'Test Tile' },
    { id: 'test2', content: 'Test Tile2' },
    { id: 'test3', content: 'Test Tile 3' },
    { id: 'test4', content: 'Test Tile4' },
    { id: 'test5', content: 'Test Tile 5' },
    { id: 'test6', content: 'Test Tile 6' },
    { id: 'test7', content: 'Test Tile 7' },
  ],
  onChange: action('onChange'),
};

storiesOf('TileCatalog', module)
  .add('default', () => <TileCatalog {...commonTileCatalogProps} />)
  .add('with search', () => (
    <TileCatalog
      {...commonTileCatalogProps}
      search={{ placeHolderText: 'Search catalog', onSearch: action('onSearch') }}
    />
  ))
  .add('with pages', () => (
    <TileCatalog
      {...commonTileCatalogProps}
      pagination={{ pageSize: 6, onPage: action('onPage') }}
    />
  ));
