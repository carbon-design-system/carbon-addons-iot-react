import React from 'react';
import { action } from '@storybook/addon-actions';

import AddCard from './AddCard';

const AddCardProps = {
  onClick: action('clicked'),
  title: 'Click me',
};

export default {
  title: '1 - Watson IoT/Card/AddCard',

  parameters: {
    component: AddCard,
  },
};

export const HandlesClick = () => <AddCard {...AddCardProps} />;

HandlesClick.storyName = 'handles click';
