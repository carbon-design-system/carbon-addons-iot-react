import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import PageHero from './PageHero';

const commonPageHeroProps = {
  title: 'Your Devices',
  blurb:
    'Your data lake displays a detailed view of the entity types that are connected in Watson IoT Platform. To explore the metrics and dimensions of your entities in more detail, select Entities. To start applying calculations and analyzing your entity data, select Data.',
  big: true,
  rightContent: <div style={{ textAlign: 'right' }}>Right Content</div>,
};

storiesOf('PageHero', module)
  .add('normal', () => <PageHero {...commonPageHeroProps} />)
  .add('normal with action', () => (
    <PageHero
      {...commonPageHeroProps}
      switchers={{
        onChange: action('onChange'),
        switcher: [
          {
            switcherId: 'allDevices',
            switcherText: 'All Devices',
            onClick: action('onClick'),
            disabled: null,
          },

          {
            switcherId: 'diagnose',
            switcherText: 'Diagnose',
            onClick: action('onClick'),
            disabled: null,
          },
        ],
      }}
    />
  ))
  .add('with section', () => <PageHero {...commonPageHeroProps} section="Explore" />)
  .add('has breadcrumb', () => (
    <PageHero {...commonPageHeroProps} crumb={<div>breadcrumb/mybread</div>} />
  ))
  .add('has left content', () => (
    <PageHero {...commonPageHeroProps} leftContent={<div>Left Content</div>} />
  ));
