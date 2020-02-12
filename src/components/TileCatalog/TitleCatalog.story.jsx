import React, { useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import { Tile } from 'carbon-components-react';
import TileCatalog from './TileCatalog';

const tiles = [<Tile />, <Tile />];
const sort = [{ option: 'A-Z' }, { option: 'Most Popular' }];

const placeholderTiles = [
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
];

const placeholderTilesNoBackground = [
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--no-placeholder-tile" />,
  <div className="tile-catalog--no-placeholder-tile" />,
  <div className="tile-catalog--no-placeholder-tile" />,
  <div className="tile-catalog--no-placeholder-tile" />,
  <div className="tile-catalog--no-placeholder-tile" />,
];

const fewTiles = [
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
];

storiesOf('Watson IoT|TileCatalogNew', module)
  .add('Simple Canvas with placeholder tiles', () => (
    <div style={{ width: '55rem' }}>
      <TileCatalog title="Product name" tiles={placeholderTiles} sort={sort} />
    </div>
  ))
  .add('Simple Canvas without placeholder tiles last page', () => (
    <div style={{ width: '55rem' }}>
      <TileCatalog title="Product name" tiles={placeholderTilesNoBackground} sort={sort} />
    </div>
  ))
  .add('Simple Canvas with 3 tiles', () => (
    <div style={{ width: '55rem' }}>
      <TileCatalog title="Product name" tiles={fewTiles} sort={sort} />
    </div>
  ));
