import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AddCard from './AddCard';

const AddCardProps = {
  onClick: action('clicked'),
  title: 'Click me',
};

storiesOf('AddCard', module).add('handles click', () => <AddCard {...AddCardProps} />);
