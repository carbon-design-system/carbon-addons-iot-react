import React, { useState } from 'react';
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

export const getTiles = (num) => {
  const tiles = [];
  Array(num)
    .fill(0)
    .map((i, idx) => {
      tiles[idx] = (
        <SampleTile
          key={`${idx}-sample-tile`}
          title={`${idx + 1}`}
          description="This is a sample product tile"
        />
      );
      return tiles[idx];
    });
  return tiles;
};

export default {
  title: '1 - Watson IoT/TileCatalogNew',

  parameters: {
    component: TileCatalogNew,
  },
};

export const BaseWithColRowSpecified = () => {
  const numOfTiles = number('number of tiles', 7);
  return (
    <div style={{ width: '60rem' }}>
      <TileCatalogNew
        title="Product name"
        tiles={getTiles(numOfTiles)}
        numColumns={number('numColumns', 2)}
        numRows={number('numRows', 2)}
        hasSearch={boolean('hasSearch', true)}
        hasSort={boolean('hasSort', true)}
      />
    </div>
  );
};

BaseWithColRowSpecified.storyName = 'Base with col / row specified';

export const DynamicResizeWithTileWidthSpecification = () => {
  const numOfTiles = number('number of tiles', 5);
  return (
    <div>
      <TileCatalogNew
        title="Product name"
        tiles={getTiles(numOfTiles)}
        minTileWidth={text('minTileWidth', '15rem')}
        hasSearch={boolean('hasSearch', true)}
        hasSort={boolean('hasSort', true)}
      />
    </div>
  );
};

DynamicResizeWithTileWidthSpecification.storyName = 'Dynamic resize with tile width specification';

export const Loading = () => {
  const numOfTiles = number('number of tiles', 4);
  return (
    <div style={{ width: '60rem' }}>
      <TileCatalogNew
        title="Product name"
        tiles={getTiles(numOfTiles)}
        numColumns={number('numColumns', 2)}
        numRows={number('numRows', 2)}
        hasSearch={boolean('hasSearch', true)}
        hasSort={boolean('hasSort', true)}
        isLoading
      />
    </div>
  );
};

export const Error = () => {
  return (
    // Not passing in any tiles triggers an error
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
};

export const WithOverflowMenuInPagination = () => {
  const numOfTiles = number('number of tiles', 100);
  return (
    <div style={{ width: '60rem' }}>
      <TileCatalogNew
        title="Product name"
        tiles={getTiles(numOfTiles)}
        numColumns={number('numColumns', 4)}
        numRows={number('numRows', 2)}
        hasSearch={boolean('hasSearch', true)}
        hasSort={boolean('hasSort', true)}
      />
    </div>
  );
};

WithOverflowMenuInPagination.storyName = 'With OverflowMenu in Pagination';

export const WithSearch = () => (
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
);

export const WithSort = () => (
  <div style={{ width: '60rem' }}>
    <TileCatalogNew
      title="Product name"
      tiles={getTiles(8)}
      numColumns={number('numColumns', 4)}
      numRows={number('numRows', 2)}
      hasSort={boolean('hasSort', true)}
      sortOptions={sortOptions}
      onSort={action('sort', () => {})}
      selectedSortOption={selectedSortOption}
    />
  </div>
);

export const _StatefulTileCatalog = () => {
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
          onSort={(id) => {
            if (id === 'A-Z') {
              // eslint-disable-next-line func-names
              tiles.sort(function (a, b) {
                const tileA = a.props.title.toUpperCase();
                const tileB = b.props.title.toUpperCase();

                return tileA - tileB;
              });
            } else if (id === 'Z-A') {
              // eslint-disable-next-line func-names
              tiles.sort(function (a, b) {
                const tileA = a.props.title.toUpperCase();
                const tileB = b.props.title.toUpperCase();

                return tileB - tileA;
              });
            }
            setTiles([...tiles]);
          }}
          selectedSortOption={selectedSortOption}
          hasSearch={boolean('hasSearch', true)}
          onSearch={(evt) => {
            const searchTerm = evt.target.value;
            const searchFilteredTiles = tiles.filter((tile) => {
              return tile.props.title.toLowerCase().search(searchTerm.toLowerCase()) !== -1;
            });
            setTiles(searchFilteredTiles);
          }}
        />
      </div>
    );
  };

  return <StatefulTileCatalog />;
};

_StatefulTileCatalog.storyName = 'StatefulTileCatalog';
