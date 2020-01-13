import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

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

storiesOf('Watson IoT Experimental|SimpleList', module).add('Simple List', () => {
  return (
    <SimpleList
      title={text('Text', 'Simple List')}
      search={{
        placeHolderText: 'Enter a search',
        onChange: value => console.log(`search changed: ${value}`),
      }}
      buttons={[]}
      items={items}
    />
  );
});
