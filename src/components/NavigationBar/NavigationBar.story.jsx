import React from 'react';
import { storiesOf } from '@storybook/react';

import NavigationBar from './NavigationBar';

const navBarProps = {
  tabs: [
    { id: 'tab1', label: 'Tab 1', children: 'my content' },
    { id: 'tab2', label: 'Tab 2', children: 'my content2' },
  ],
  hero: 'shared content',
};

storiesOf('NavigationBar', module).add('normal', () => <NavigationBar {...navBarProps} />);
