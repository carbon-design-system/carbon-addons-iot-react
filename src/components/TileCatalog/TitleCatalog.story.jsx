import React, { useState, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import { Tile } from 'carbon-components-react';
import TileCatalog from './TileCatalog';

const tiles = [<Tile />, <Tile />];

storiesOf('Watson IoT|TileCatalogNew', module).add('default', () => (
  <TileCatalog title="product name" tiles={tiles} />
));
