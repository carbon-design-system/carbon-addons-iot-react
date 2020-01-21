import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../../constants/LayoutConstants';
import { getCardMinSize } from '../../../utils/componentUtilityFunctions';

import ListItem from './ListItem';

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

class ListItemSimple extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  render = () => {
    const { size } = this.props;
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ListItem {...this.props} />
      </div>
    );
  };
}

storiesOf('Watson IoT Experimental|ListItem', module)
  .add('Simple ListItem', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);

    return <ListItemSimple id="List" size={size} value="hi" />;
  })
  .add('Another ListItem', () => <ListItem value="another list item" />);
