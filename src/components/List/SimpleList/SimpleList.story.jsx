import React, { useState } from 'react';
import { Add16, Close16, Edit16 } from '@carbon/icons-react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { Button } from 'carbon-components-react';

import SimpleList from './SimpleList';

const items = [
  {
    id: '1',
    name: 'Item 1',
  },
  {
    id: '2',
    name: 'Item 2',
  },
  {
    id: '3',
    name: 'Item 3',
  },
];

const buttonsToRender = [
  <Edit16 />,
  <Button renderIcon={Close16} hasIconOnly kind="secondary" size="small" onClick={() => {}} />,
  <Button renderIcon={Add16} hasIconOnly size="small" />,
];

storiesOf('Watson IoT Experimental|SimpleList', module)
  .add('basic', () => (
    <div style={{ width: 500 }}>
      <SimpleList
        title={text('Text', 'Simple List')}
        hasSearch
        i18n={{
          searchPlaceHolderText: 'Enter a search',
        }}
        buttons={buttonsToRender}
        items={items}
      />
    </div>
  ))
  .add('tall list (isFullHeight = true)', () => (
    <div style={{ width: 500, height: 1000 }}>
      <SimpleList
        title={text('Text', 'Simple List')}
        hasSearch
        i18n={{
          searchPlaceHolderText: 'Enter a search',
        }}
        buttons={buttonsToRender}
        items={items}
      />
    </div>
  ))
  .add('tall list (isFullHeight = false)', () => (
    <div style={{ width: 500, height: 1000 }}>
      <SimpleList
        title={text('Text', 'Simple List')}
        hasSearch
        i18n={{
          searchPlaceHolderText: 'Enter a search',
        }}
        buttons={buttonsToRender}
        items={items}
      />
    </div>
  ));
