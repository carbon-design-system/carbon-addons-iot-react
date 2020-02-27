import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number, boolean } from '@storybook/addon-knobs';
import TileCatalog from './TileCatalog';
import SampleTile from './SampleTile';

const sortOptions = [
  { text: 'Choose from options', id: 'Choose from options' },
  { text: 'A-Z', id: 'A-Z' },
  { text: 'Most Popular', id: 'Most Popular' },
];
const selectedSortOption = 'Choose from options';

const getTiles = num => {
  var tiles = [];
  Array(num)
    .fill(0)
    .map(
      (i, idx) =>
        (tiles[idx] = (
          <SampleTile title={`${idx + 1}`} description="This is a sample product tile" />
        ))
    );
  return tiles;
};

storiesOf('Watson IoT Experimental|TileCatalog', module)
  .add('Base', () => {
    const numOfTiles = number('number of tiles', 10);
    return (
      <div style={{ width: '60rem' }}>
        <TileCatalog
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
      <TileCatalog
        title="Product name"
        tiles={getTiles(20)}
        numColumns={number('numColumns', 4)}
        numRows={number('numRows', 2)}
        hasSearch={boolean('hasSearch', true)}
        onSearch={action('search', evt => {})}
      />
    </div>
  ))
  .add('With Sort', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
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
          <TileCatalog
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
              const searchFilteredTiles = tiles.filter(tile => {
                console.log(tile.props.title);
                const searchTerm = evt.target.value;
                console.log(searchTerm);
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
