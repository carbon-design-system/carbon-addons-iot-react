import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select, number } from '@storybook/addon-knobs';
import TileCatalog from './TileCatalog';
import { Checkbox } from '../..';
import SampleTile from './SampleTile';

const i18n = { sortOptions: [{ option: 'A-Z' }, { option: 'Most Popular' }] };

const getTiles = (num, tile) => {
  var tiles = [];
  Array(num)
    .fill(0)
    .map((i, idx) => (tiles[idx] = tile));
  return tiles;
};

const featuredTileTitle = 'Feature Product';
const featuredTile = <div className="tile-catalog--featured-tile" />;

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
        tiles={getTiles(8, <div className="tile-catalog--tile-canvas--placeholder-tile" />)}
        numColumns={number('numColumns', 4)}
        numRows={number('numRows', 2)}
      />
    </div>
  ))
  .add('Simple Canvas without placeholder tiles last page', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        tiles={getTiles(5, <div className="tile-catalog--tile-canvas--placeholder-tile" />)}
        numColumns={number('numColumns', 4)}
        numRows={number('numRows', 2)}
      />
    </div>
  ))
  .add('Simple Canvas with 3 tiles', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        tiles={getTiles(3, <div className="tile-catalog--tile-canvas--placeholder-tile" />)}
        numColumns={number('numColumns', 4)}
        numRows={number('numRows', 2)}
      />
    </div>
  ))
  .add('Enhanced Canvas with tile placeholders', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        featuredTileTitle={featuredTileTitle}
        featuredTile={featuredTile}
        tiles={getTiles(20, <div className="tile-catalog--tile-canvas--placeholder-tile" />)}
        numColumns={number('numColumns', 5)}
        numRows={number('numRows', 3)}
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
        tiles={getTiles(20, <div className="tile-catalog--tile-canvas--placeholder-tile" />)}
        numColumns={number('numColumns', 5)}
        numRows={number('numRows', 3)}
      />
    </div>
  ))
  .add('Simple Canvas with column size and row size', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog
        title="Product name"
        persistentSearch
        tiles={getTiles(20, <div className="tile-catalog--tile-canvas--placeholder-tile" />)}
        numColumns={number('numColumns', 5)}
        numRows={number('numRows', 3)}
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
        numColumns={number('numColumns', 5)}
        numRows={number('numRows', 3)}
      />
    </div>
  ));
