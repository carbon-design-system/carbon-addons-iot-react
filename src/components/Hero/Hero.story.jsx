import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Breadcrumb, BreadcrumbItem, Tabs, Tab } from 'carbon-components-react';

import Hero from './Hero';

const commonPageHeroProps = {
  title: 'Explore',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut auctor tortor, et condimentum dolor. Pellentesque ac justo nec dui semper bibendum. Sed mollis euismod nisi nec dapibus. Vestibulum vehicula tristique mi facilisis aliquet. Sed lacinia nisi eget dolor suscipit convallis',
  rightContent: <div style={{ textAlign: 'right' }}>Right Content</div>,
};

const breadcrumb = (
  <Breadcrumb noTrailingSlash={false} onClick={action('onClickBreadcrumb')}>
    <BreadcrumbItem>
      <a href="/?selectedKind=Hero">Breadcrumb 1</a>
    </BreadcrumbItem>
    <BreadcrumbItem href="/?selectedKind=Hero">Breadcrumb 2</BreadcrumbItem>
    <BreadcrumbItem href="/?selectedKind=Hero">Breadcrumb 3</BreadcrumbItem>
  </Breadcrumb>
);

const nav = (
  <Tabs
    selected={1}
    onClick={action('Tabs onClick')}
    onSelectionChange={action('Tabs onSelectionChange')}
  >
    <Tab onClick={action('Tab 1 onClick')} label="Tab label 1">
      <div style={{ paddingLeft: 16 }}>Content for first tab goes here.</div>
    </Tab>
    <Tab onClick={action('Tab 2 onClick')} label="Tab label 2">
      <div style={{ paddingLeft: 16 }}>Content for second tab goes here.</div>
    </Tab>
    <Tab onClick={action('Tab 3 onClick')} label="Tab label 3">
      <div style={{ paddingLeft: 16 }}>Content for third tab goes here.</div>
    </Tab>
  </Tabs>
);

storiesOf('Hero', module)
  .add('normal', () => <Hero title="Explore" />)
  .add('with description', () => (
    <Hero title="Explore" description={commonPageHeroProps.description} />
  ))
  .add('with rigth content', () => <Hero {...commonPageHeroProps} />)
  .add('with breadcrumb', () => <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} />)
  .add('with breadcrumb and nav', () => (
    <Hero title={commonPageHeroProps.title} breadcrumb={breadcrumb} secundaryNav={nav} />
  ));
