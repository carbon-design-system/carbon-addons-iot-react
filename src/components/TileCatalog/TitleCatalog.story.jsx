import React, { useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import { Tile } from 'carbon-components-react';
import TileCatalog from './TileCatalog';
import { Checkbox } from '../..';

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

const placeholderTilesNoBackground = [
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
  <div className="tile-catalog--tile-canvas--placeholder-tile" />,
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
      <TileCatalog title="Product name" tiles={placeholderTiles} sort={sort} />
    </div>
  ))
  .add('Simple Canvas without placeholder tiles last page', () => (
    <div style={{ width: '55rem' }}>
      <TileCatalog title="Product name" tiles={placeholderTilesNoBackground} sort={sort} />
    </div>
  ))
  .add('Simple Canvas with 3 tiles', () => (
    <div style={{ width: '60rem' }}>
      <TileCatalog title="Product name" tiles={fewTiles} sort={sort} />
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
      />
    </div>
  ))
  .add('Enhanced Canvas with checkbox filter', () => (
    <div style={{ width: '80rem' }}>
      <TileCatalog
        title="Product name"
        persistentSearch
        featuredTileTitle={featuredTileTitle}
        featuredTile={featuredTile}
        tiles={placeholderTiles}
        sort={sort}
        filter={filter}
      />
    </div>
  ));
