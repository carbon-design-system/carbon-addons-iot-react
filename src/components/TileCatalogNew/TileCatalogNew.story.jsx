import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number, boolean, text } from '@storybook/addon-knobs';

import TileCatalogNew from './TileCatalogNew';
import SampleTile from './SampleTile';

const sortOptions = [
  { text: 'Choose from options', id: 'Choose from options' },
  { text: 'A-Z', id: 'A-Z' },
  { text: 'Most Popular', id: 'Most Popular' },
];
const selectedSortOption = 'Choose from options';

const getTiles = num => {
  const tiles = [];
  Array(num)
    .fill(0)
    .map((i, idx) => {
      tiles[idx] = <SampleTile title={`${idx + 1}`} description="This is a sample product tile" />;
      return tiles[idx];
    });
  return tiles;
};

storiesOf('Watson IoT Experimental/TileCatalogNew', module)
  .add('Base with col / row specified', () => {
    const numOfTiles = number('number of tiles', 7);
    return (
      <div style={{ width: '60rem' }}>
        <TileCatalogNew
          title="Product name"
          tiles={getTiles(
            numOfTiles,
            <SampleTile title="Sample product tile" description="This is a sample product tile" />
          )}
          numColumns={number('numColumns', 2)}
          numRows={number('numRows', 2)}
          hasSearch={boolean('hasSearch', true)}
          hasSort={boolean('hasSort', true)}
        />
      </div>
    );
  })
  .add('Base with tile width specification', () => {
    const numOfTiles = number('number of tiles', 5);
    return (
      <div style={{ width: '60rem' }}>
        <TileCatalogNew
          title="Product name"
          tiles={getTiles(
            numOfTiles,
            <SampleTile title="Sample product tile" description="This is a sample product tile" />
          )}
          minTileWidth={text('minTileWidth', '15rem')}
          hasSearch={boolean('hasSearch', true)}
          hasSort={boolean('hasSort', true)}
        />
      </div>
    );
  })
  .add('Loading', () => {
    const numOfTiles = number('number of tiles', 4);
    return (
      <div style={{ width: '60rem' }}>
        <TileCatalogNew
          title="Product name"
          tiles={getTiles(
            numOfTiles,
            <SampleTile title="Sample product tile" description="This is a sample product tile" />
          )}
          numColumns={number('numColumns', 2)}
          numRows={number('numRows', 2)}
          hasSearch={boolean('hasSearch', true)}
          hasSort={boolean('hasSort', true)}
          isLoading
        />
      </div>
    );
  })
  .add('Error', () => {
    return (
      <div style={{ width: '60rem' }}>
        <TileCatalogNew
          title="Product name"
          numColumns={number('numColumns', 2)}
          numRows={number('numRows', 2)}
          hasSearch={boolean('hasSearch', true)}
          hasSort={boolean('hasSort', true)}
        />
      </div>
    );
  })
  .add('With OverflowMenu in Pagination', () => {
    const numOfTiles = number('number of tiles', 100);
    return (
      <div style={{ width: '60rem' }}>
        <TileCatalogNew
          title="Product name"
          tiles={getTiles(
            numOfTiles,
            <SampleTile title="Sample product tile" description="This is a sample product tile" />
          )}
          numColumns={number('numColumns', 4)}
          numRows={number('numRows', 2)}
          hasSearch={boolean('hasSearch', true)}
          hasSort={boolean('hasSort', true)}
        />
      </div>
    );
  })
  .add('With Search', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalogNew
        title="Product name"
        tiles={getTiles(20)}
        numColumns={number('numColumns', 4)}
        numRows={number('numRows', 2)}
        hasSearch={boolean('hasSearch', true)}
        onSearch={action('search', () => {})}
      />
    </div>
  ))
  .add('With Sort', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalogNew
        title="Product name"
        tiles={getTiles(
          8,
          <SampleTile title="Sample product tile" description="This is a sample product tile" />
        )}
        numColumns={number('numColumns', 4)}
        numRows={number('numRows', 2)}
        hasSort={boolean('hasSort', true)}
        sortOptions={sortOptions}
        onSort={action('sort', () => {})}
        selectedSortOption={selectedSortOption}
      />
    </div>
  ))
  .add('StatefulTileCatalog', () => {
    const StatefulTileCatalog = () => {
      const [tiles, setTiles] = useState(getTiles(20));
      const sortOptions = [
        { text: 'Choose from options', id: 'Choose from options' },
        { text: 'A-Z', id: 'A-Z' },
        { text: 'Z-A', id: 'Z-A' },
      ];
      const selectedSortOption = 'Choose from options';

      return (
        <div style={{ width: '60rem' }}>
          <TileCatalogNew
            title="Product name"
            tiles={tiles}
            numColumns={number('numColumns', 4)}
            numRows={number('numRows', 2)}
            hasSort={boolean('hasSort', true)}
            sortOptions={sortOptions}
            onSort={id => {
              if (id === 'A-Z') {
                tiles.sort(function(a, b) {
                  const tileA = a.props.title.toUpperCase();
                  const tileB = b.props.title.toUpperCase();

                  return tileA - tileB;
                });
              } else if (id === 'Z-A') {
                tiles.sort(function(a, b) {
                  const tileA = a.props.title.toUpperCase();
                  const tileB = b.props.title.toUpperCase();

                  return tileB - tileA;
                });
              }
              setTiles([...tiles]);
            }}
            selectedSortOption={selectedSortOption}
            hasSearch={boolean('hasSearch', true)}
            onSearch={evt => {
              const searchTerm = evt.target.value;
              const searchFilteredTiles = tiles.filter(tile => {
                return tile.props.title.toLowerCase().search(searchTerm.toLowerCase()) !== -1;
              });
              setTiles(searchFilteredTiles);
            }}
          />
        </div>
      );
    };

    return <StatefulTileCatalog />;
  });
