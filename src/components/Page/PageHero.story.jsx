import React from 'react';
import { storiesOf } from '@storybook/react';

import PageHero from './PageHero';

const commonPageHeroProps = {
  title: 'Your Devices',
  blurb:
    'Your data lake displays a detailed view of the entity types that are connected in Watson IoT Platform. To explore the metrics and dimensions of your entities in more detail, select Entities. To start applying calculations and analyzing your entity data, select Data.',
  big: true,
  rightContent: <div>Right Content</div>,
};

storiesOf('PageHero', module)
  .add('normal', () => <PageHero {...commonPageHeroProps} />)
  .add('with section', () => <PageHero {...commonPageHeroProps} section="Explore" />)
  .add('has breadcrumb', () => (
    <PageHero {...commonPageHeroProps} crumb={<div>breadcrumb/mybread</div>} />
  ));
