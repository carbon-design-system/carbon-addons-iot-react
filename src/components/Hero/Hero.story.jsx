import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from 'carbon-components-react';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import DeprecationNotice, { deprecatedStoryTitle } from '../../internal/DeprecationNotice';

import Hero from './Hero';

const commonPageHeroProps = {
  title: 'Explore',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut auctor tortor, et condimentum dolor. Pellentesque ac justo nec dui semper bibendum. Sed mollis euismod nisi nec dapibus. Vestibulum vehicula tristique mi facilisis aliquet. Sed lacinia nisi eget dolor suscipit convallis',
  rightContent: <div style={{ textAlign: 'right' }}>Right Content</div>,
};

const breadcrumb = [<a href="/">Home</a>, <a href="/">Type</a>, <span>Instance</span>];

const tooltip = {
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut auctor tortor, et condimentum dolor.',
  href: '/',
  linkLabel: 'Learn more',
};

storiesOf('Watson IoT|Hero (Deprecated)', module)
  .addDecorator(storyFn => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>)
  .add(deprecatedStoryTitle, () => (
    <DeprecationNotice deprecatedComponentName="Hero" replacementComponentName="PageTitleBar" />
  ))
  .add('normal', () => <Hero title="Explore" />)
  .add('with description', () => (
    <Hero title="Explore" description={commonPageHeroProps.description} />
  ))
  .add('isLoading', () => <Hero title="Explore" isLoading />)
  .add('with right content', () => (
    <Hero
      {...commonPageHeroProps}
      rightContent={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>Here is a long message relating some status...&nbsp;</div>
          <Button kind="secondary">Cancel</Button>
          <Button kind="primary">Take action!</Button>
        </div>
      }
    />
  ))
  .add('with breadcrumb with right content', () => (
    <Hero
      {...commonPageHeroProps}
      breadcrumb={breadcrumb}
      rightContentBreadcrumb={<div style={{ textAlign: 'right' }}>breadcrumb Right Content</div>}
    />
  ))
  .add('with breadcrumb', () => <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} />)
  .add('with tooltip', () => (
    <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} tooltip={tooltip} />
  ))
  .add('with tooltip (no link)', () => (
    <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} tooltip={{ message: tooltip.message }} />
  ))
  .add('with close button', () => (
    <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} onClose={action('close')} />
  ));
