import React, { useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select, number } from '@storybook/addon-knobs';
import { Tile } from 'carbon-components-react';
import TileCatalog from './TileCatalog';
import { Checkbox } from '../..';
import SampleTile from './SampleTile';

const tiles = [<Tile />, <Tile />];
const sort = [{ option: 'A-Z' }, { option: 'Most Popular' }];

const placeholderTiles = [
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
];

const getTiles = (num, tile) => {
  var tiles = [];
  Array(num)
    .fill(0)
    .map((i, idx) => (tiles[idx] = tile));
  return tiles;
};

const tile = (
  <div>
    <h5>HI</h5>
  </div>
);

const placeholderTilesNoBackground = [
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  tile,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,

  <div className="tile-catalog--tile-canvas--no-placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--no-placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--no-placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--no-placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--no-placeholder-tile" />,
];

const fewTiles = [
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
];

const featuredTileTitle = 'Feature Product';

const featuredTile = <div className="tile-catalog--featured-tile" />;

const sampleFeaturedTile = <div>sample</div>;

const selectFilter = [
  <div className="tile-catalog--filter--content--select">
    <div>Label</div>
    <select
      className="bx--select-input"
      id="bx-pagination-select-3"
      onChange={[Function]}
      value={1}
    />
  </div>,
  <div className="tile-catalog--filter--content--select">
    <div>Label</div>
    <select
      className="bx--select-input"
      id="bx-pagination-select-3"
      onChange={[Function]}
      value={1}
    />
  </div>,
];

const checkboxFilter = (
  <div className="tile-catalog--filter--content--checkbox">
    <div>Label</div>
    <Checkbox id="" name="checkbox filter" labelText="Checkbox Label 1" onClick="" checked="" />
    <Checkbox id="" name="checkbox filter" labelText="Checkbox Label 2 " onClick="" checked="" />
  </div>
);
const filter = { selectFilter: selectFilter, checkboxFilter: checkboxFilter };

storiesOf('Watson IoT|TileCatalogNew', module)
  .add('Simple Canvas with placeholder tiles', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        tiles={placeholderTiles}
        sort={sort}
        numOfColumns="4"
        numOfRows="2"
      />
    </div>
  ))
  .add('Simple Canvas without placeholder tiles last page', () => (
    <div style={{ width: '55rem' }}>
      <TileCatalog
        title="Product name"
        tiles={placeholderTilesNoBackground}
        sort={sort}
        numOfColumns="4"
        numOfRows="2"
      />
    </div>
  ))
  .add('Simple Canvas with 3 tiles', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        tiles={fewTiles}
        sort={sort}
        numOfColumns="4"
        numOfRows="2"
      />
    </div>
  ))
  .add('Enhanced Canvas with tile placeholders', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        featuredTileTitle={featuredTileTitle}
        featuredTile={featuredTile}
        tiles={placeholderTiles}
        sort={sort}
        numOfColumns="4"
        numOfRows="2"
      />
    </div>
  ))
  .add('Enhanced Canvas with persistent search', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        persistentSearch
        featuredTileTitle={featuredTileTitle}
        featuredTile={featuredTile}
        tiles={placeholderTiles}
        sort={sort}
        numOfColumns="4"
        numOfRows="2"
      />
    </div>
  ))
  .add('Simple Canvas with column size and row size', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        persistentSearch
        tiles={getTiles(20, <div className="tile-catalog--tile-canvas--placeholder-tile" />)}
        sort={sort}
        numOfColumns={number('numOfColumns', 5)}
        numOfRows={number('numOfRows', 3)}
      />
    </div>
  ))
  .add('Simple Canvas with sample tiles', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        persistentSearch
        tiles={getTiles(
          20,
          <SampleTile title="Sample product tile" description="This is a sample product tile" />
        )}
        sort={sort}
        numColumns={number('numColumns', 5)}
        numRows={number('numRows', 3)}
      />
    </div>
  ));
// .add('Enhanced Canvas with checkbox filter', () => (
//   <div style={{ width: '80rem' }}>
//     <TileCatalog
//       title="Product name"
//       persistentSearch
//       featuredTileTitle={featuredTileTitle}
//       featuredTile={featuredTile}
//       tiles={placeholderTiles}
//       sort={sort}
//       filter={filter}
//     />
//   </div>
// ));
