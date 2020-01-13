import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import List from './List';

const items = [
  {
    id: '1',
    name: 'Item 1',
    children: [
      { id: '6', name: 'item 6' },
      { id: '7', name: 'item 7' },
      { id: '8', name: 'item 8' },
    ],
  },
  {
    id: '2',
    name: 'Item 2',
    children: [{ id: '9', name: 'item 9', children: [{ id: '15', name: 'item 15' }] }],
  },
  { id: '3', name: 'Item 3', children: [{ id: '10', name: 'item 10' }] },
  { id: '4', name: 'Item 4', children: [] },
  { id: '5', name: 'Item 5', children: [{ id: '11', name: 'item 11' }] },
];

const data2 = [
  {
    id: '1',
    name: 'Item 1',
    children: [
      { id: 'ch11', name: 'Child item 1' },
      { id: 'ch12', name: 'Child item 2' },
      { id: 'ch13', name: 'Child item 3' },
    ],
  },
  {
    id: '2',
    name: 'Item 2',
    children: [
      { id: 'ch21', name: 'Child item 1' },
      { id: 'ch22', name: 'Child item 2' },
      { id: 'ch23', name: 'Child item 3' },
    ],
  },
  {
    id: '3',
    name: 'Item 3',
    children: [
      { id: 'ch31', name: 'Child item 1' },
      { id: 'ch32', name: 'Child item 2' },
      { id: 'ch33', name: 'Child item 3' },
    ],
  },
];

const data1 = [
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

const data3 = [
  {
    id: '1',
    name: 'Item 1',
    children: [
      {
        id: 'ch11',
        name: 'Child item 1',
        children: [
          { id: 'ch111', name: 'Child item 1' },
          { id: 'ch112', name: 'Child item 2' },
          { id: 'ch113', name: 'Child item 3' },
        ],
      },
      {
        id: 'ch12',
        name: 'Child item 2',
        children: [
          { id: 'ch121', name: 'Child item 1' },
          { id: 'ch122', name: 'Child item 2' },
          { id: 'ch123', name: 'Child item 3' },
        ],
      },
      {
        id: 'ch13',
        name: 'Child item 3',
        children: [
          { id: 'ch131', name: 'Child item 1' },
          { id: 'ch132', name: 'Child item 2' },
          { id: 'ch133', name: 'Child item 3' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Item 2',
    children: [
      { id: 'ch21', name: 'Child item 1' },
      { id: 'ch22', name: 'Child item 2' },
      { id: 'ch23', name: 'Child item 3' },
    ],
  },
  {
    id: '3',
    name: 'Item 3',
    children: [
      { id: 'ch31', name: 'Child item 1' },
      { id: 'ch32', name: 'Child item 2' },
      { id: 'ch33', name: 'Child item 3' },
    ],
  },
];

class ListSimple extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  render = () => {
    const { size } = this.props;
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <List {...this.props} />
      </div>
    );
  };
}

storiesOf('Watson IoT Experimental|List', module)
  .add('Simple List', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);

    return <ListSimple id="List" title={text('Text', 'Simple List')} items={data1} size={size} />;
  })

  .add('Simple List with title and button in header', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);

    return (
      <ListSimple
        id="List"
        title={text('Text', 'Simple List')}
        items={data1}
        size={size}
        headerHasButton
      />
    );
  })
  .add('List with search', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);

    return (
      <ListSimple
        id="List"
        title={text('Text', 'Simple List')}
        items={data1}
        size={size}
        hasSearch
      />
    );
  })
  .add('Two level list, expandable list', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);

    return (
      <ListSimple id="List" title={text('Text', 'Two level list')} items={data2} size={size} />
    );
  })
  .add('Three level list, expandable list', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);

    return (
      <ListSimple id="List" title={text('Text', 'Three level list')} items={data3} size={size} />
    );
  })
  .add('expanded list with search', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);

    return (
      <ListSimple
        id="List"
        title={text('Text', '2 level List with Search and Button')}
        items={items}
        size={size}
        hasSearch={{
          placeHolderText: 'Search list',
          onSearch: action('search'),
        }}
      />
    );
  });
