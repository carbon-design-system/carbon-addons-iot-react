import React, { useState, Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select } from '@storybook/addon-knobs';
import { Add16 } from '@carbon/icons-react';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import List from './List';
import Button from '../Button/Button';

const data3 = [
  {
    id: '1',
    content: { value: 'Item 1' },
    children: [
      {
        id: 'ch11',
        content: { value: 'Child item 1' },
        children: [
          { id: 'ch111', content: { value: 'Child item 1' }, isSelectable: true },
          { id: 'ch112', content: { value: 'Child item 2' }, isSelectable: true },
          { id: 'ch113', content: { value: 'Child item 3' }, isSelectable: true },
        ],
      },
      {
        id: 'ch12',
        content: { value: 'Child item 2' },
        children: [
          { id: 'ch121', content: { value: 'Child item 1' }, isSelectable: true },
          { id: 'ch122', content: { value: 'Child item 2' }, isSelectable: true },
          { id: 'ch123', content: { value: 'Child item 3' }, isSelectable: true },
        ],
      },
      {
        id: 'ch13',
        content: { value: 'Child item 3' },
        children: [
          { id: 'ch131', content: { value: 'Child item 1' }, isSelectable: true },
          { id: 'ch132', content: { value: 'Child item 2' }, isSelectable: true },
          { id: 'ch133', content: { value: 'Child item 3' }, isSelectable: true },
        ],
      },
    ],
  },
  {
    id: '2',
    content: { value: 'Item 2' },
    children: [
      { id: 'ch21', content: { value: 'Child item 1' }, isSelectable: true },
      { id: 'ch22', content: { value: 'Child item 2' }, isSelectable: true },
      { id: 'ch23', content: { value: 'Child item 3' }, isSelectable: true },
    ],
  },
  {
    id: '3',
    content: { value: 'Item 3' },
    children: [
      { id: 'ch31', content: { value: 'Child item 1' }, isSelectable: true },
      { id: 'ch32', content: { value: 'Child item 2' }, isSelectable: true },
      { id: 'ch33', content: { value: 'Child item 3' }, isSelectable: true },
    ],
  },
];

const ExpandableList = () => {
  const [searchValue, setSearchValue] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);
  return (
    <List
      title="List"
      buttons={[<Button renderIcon={Add16} hasIconOnly size="small" />]}
      search={{
        value: searchValue,
        onChange: evt => setSearchValue(evt.target.value),
      }}
      items={data3}
      expandedIds={expandedIds}
      toggleExpansion={id => {
        if (expandedIds.filter(rowId => rowId === id).length > 0) {
          // remove id from array
          setExpandedIds(expandedIds.filter(rowId => rowId !== id));
        } else {
          setExpandedIds(expandedIds.concat([id]));
        }
      }}
      handleSelect={id => setSelectedId(id)}
      selectedId={selectedId}
      i18n={{
        searchPlaceHolderText: 'Search...',
      }}
    />
  );
};

storiesOf('Watson IoT Experimental|List', module).add(
  'Stateful list with dynamic expansion',
  () => (
    <div style={{ width: 400 }}>
      <ExpandableList />
    </div>
  )
);

/*
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
    const size = select('size', Object.keyrom(CARD_SIZES), CARD_SIZES.MEDIUM);

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
  */
