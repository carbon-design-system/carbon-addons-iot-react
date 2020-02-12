import React, { useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import { Tile } from 'carbon-components-react';
import TileCatalog from './TileCatalog';

const tiles = [<Tile />, <Tile />];
const sort = [{ option: 'A-Z' }, { option: 'Most Popular' }];

storiesOf('Watson IoT|TileCatalogNew', module).add('default', () => (
  <div style={{ width: '55rem' }}>
    <TileCatalog title="Product name" tiles={tiles} sort={sort} />
  </div>
));
