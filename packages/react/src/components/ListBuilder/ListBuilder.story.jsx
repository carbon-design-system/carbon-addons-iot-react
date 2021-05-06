import React, { createElement, useState } from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { withReadme } from 'storybook-readme';

import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';

import ListBuilder from './ListBuilder';
import README from './README.md';

export const Experimental = () => <StoryNotice componentName="ListBuilder" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

export const NoItemsSelected = withReadme(README, () => (
  <ListBuilder
    onAdd={action('onAdd')}
    onRemove={action('onRemove')}
    items={[
      {
        id: '1',
        content: {
          value: 'item one',
        },
      },
      { id: '2', content: { value: 'item two' } },
    ]}
  />
));

NoItemsSelected.story = {
  name: 'with no items selected',
};

export const ItemsSelected = withReadme(README, () => (
  <ListBuilder
    onAdd={action('onAdd')}
    onRemove={action('onRemove')}
    items={[
      {
        id: '1',
        content: {
          value: 'item one',
        },
      },
    ]}
    selectedItems={[{ id: '2', content: { value: 'item two' } }]}
  />
));

ItemsSelected.story = {
  name: 'with items selected',
};

export const StatefulExample = withReadme(README, () => {
  const [selected, setSelected] = useState([]);
  const [items, setItems] = useState([
    {
      id: '1',
      content: {
        value: 'item one',
      },
    },
    {
      id: '2',
      content: {
        value: 'item two',
      },
    },
    {
      id: '3',
      content: {
        value: 'item three',
      },
    },
  ]);

  const handleAdd = (event, id) => {
    setSelected((prev) => {
      const newItem = items.find((item) => item.id === id);
      return [...prev, newItem];
    });
    setItems((prev) => {
      return prev.filter((pItem) => pItem.id !== id);
    });

    // just to show the actions in storybook
    action('onAdd')(event, id);
  };

  const handleRemove = (event, id) => {
    setItems((prev) => {
      const removedItem = selected.find((item) => item.id === id);
      return [...prev, removedItem];
    });
    setSelected((prev) => prev.filter((pItem) => pItem.id !== id));

    // just to show the actions in storybook
    action('onRemove')(event, id);
  };

  return (
    <ListBuilder onAdd={handleAdd} onRemove={handleRemove} items={items} selectedItems={selected} />
  );
});

StatefulExample.story = {
  name: 'stateful example',
  decorators: [createElement],
};

export default {
  title: 'Watson IoT Experimental/☢️ ListBuilder',
  decorators: [withKnobs],
  parameters: {
    component: ListBuilder,
  },
};
