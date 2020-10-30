import React from 'react';
import { action } from '@storybook/addon-actions';

import AddCard from './AddCard';

export default {
  title: 'Watson IoT/AddCard',
  component: AddCard,
  parameters: {
    knobs: {
      disabled: true,
    },
  },
};

export const HandlesClick = (args) => <AddCard {...args} />;

HandlesClick.args = {
  title: 'Click me',
  onClick: action('clicked'),
};
