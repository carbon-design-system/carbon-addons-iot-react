import React from 'react';

import AddCard from './AddCard';

export default {
  title: 'Watson IoT/AddCard',
  component: AddCard,
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    knobs: {
      disabled: true,
    },
  },
};

export const HandlesClick = (args) => <AddCard {...args} />;

HandlesClick.args = {
  title: 'Click me',
};
