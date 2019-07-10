import React from 'react';
import { storiesOf } from '@storybook/react';

import Hero from './Hero';

const commonPageHeroProps = {
  title: 'Explore',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut auctor tortor, et condimentum dolor. Pellentesque ac justo nec dui semper bibendum. Sed mollis euismod nisi nec dapibus. Vestibulum vehicula tristique mi facilisis aliquet. Sed lacinia nisi eget dolor suscipit convallis',
  rightContent: <div style={{ textAlign: 'right' }}>Right Content</div>,
};

const breadcrumb = [
  { label: 'Home', href: '/' },
  { label: 'Items', href: '/items' },
  { label: 'Item 1', isCurrentPage: true },
];

const tooltip = {
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut auctor tortor, et condimentum dolor.',
  href: '/',
  linkLabel: 'Learn more',
};
storiesOf('Hero (Experimental)', module)
  .add('normal', () => <Hero title="Explore" />)
  .add('with description', () => (
    <Hero title="Explore" description={commonPageHeroProps.description} />
  ))
  .add('with rigth content', () => <Hero {...commonPageHeroProps} />)
  .add('with breadcrumb', () => <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} />)
  .add('with tooltip', () => (
    <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} tooltip={tooltip} />
  ));
