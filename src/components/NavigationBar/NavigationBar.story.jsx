import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import PageHero from '../Page/PageHero';

import NavigationBar from './NavigationBar';

const commonPageHeroProps = {
  section: 'Explore',
  title: 'Your Devices',
  blurb:
    'Your data lake displays a detailed view of the entity types that are connected in Watson IoT Platform. To explore the metrics and dimensions of your entities in more detail, select Entities. To start applying calculations and analyzing your entity data, select Data.',
  big: true,
  rightContent: <div>Right Content</div>,
};

const navBarProps = {
  tabs: [
    { id: 'tab1', label: 'Tab 1', children: 'my content' },
    { id: 'tab2', label: 'Tab 2', children: 'my content2' },
  ],
  hero: <PageHero {...commonPageHeroProps} />,
  onSelectionChange: action('onSelectionChange'),
};

const StatefulNavigationBar = () => {
  const [workAreaOpen, setWorkAreaOpen] = useState(false);
  const handleNew = () => {
    setWorkAreaOpen(!workAreaOpen);
    action('button1');
  };
  return (
    <NavigationBar
      {...navBarProps}
      actions={[{ id: 'button1', children: 'New Entity Type', onClick: handleNew }]}
    />
  );
};

storiesOf('NavigationBar', module)
  .add('normal', () => <NavigationBar {...navBarProps} />)
  .add('with actions', () => (
    <NavigationBar
      {...navBarProps}
      actions={[
        { id: 'button1', children: 'New Entity Type', onClick: action('button1') },
        { id: 'button2', children: 'Button 2', kind: 'secondary', onClick: action('button2') },
      ]}
    />
  ))
  .add('example with workArea', () => <StatefulNavigationBar />);
