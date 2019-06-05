import React from 'react';
import { storiesOf } from '@storybook/react';
// @TODO: an action on this element sets off fb synthetic event warning. Need to debug
// import { action } from '@storybook/addon-actions';

import AddCard from './AddCard';

const AddCardProps = {
  onClick: () => console.log('clicked'),
  title: 'Click Me',
};

storiesOf('AddCard', module).add('handles click', () => <AddCard {...AddCardProps} />);
