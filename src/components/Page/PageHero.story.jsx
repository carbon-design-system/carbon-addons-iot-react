import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import DeprecationNotice, { deprecatedStoryTitle } from '../../internal/DeprecationNotice';

import PageHero from './PageHero';

const commonPageHeroProps = {
  title: 'Your Devices',
  blurb:
    'Your data lake displays a detailed view of the entity types that are connected in Watson IoT Platform. To explore the metrics and dimensions of your entities in more detail, select Entities. To start applying calculations and analyzing your entity data, select Data.',
  big: true,
  rightContent: <div style={{ textAlign: 'right' }}>Right Content</div>,
};

storiesOf('Watson IoT|PageHero (Deprecated)', module)
  .addDecorator(storyFn => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>)
  .add(deprecatedStoryTitle, () => (
    <DeprecationNotice deprecatedComponentName="PageHero" replacementComponentName="Hero" />
  ))
  .add('normal', () => <PageHero {...commonPageHeroProps} />)
  .add('normal with content switcher', () => (
    <PageHero
      {...commonPageHeroProps}
      switcher={{
        onChange: action('onChange'),
        selectedIndex: 1,
        options: [
          {
            id: 'allDevices',
            text: 'All Devices',
          },
          {
            id: 'diagnose',
            text: 'Diagnose',
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
