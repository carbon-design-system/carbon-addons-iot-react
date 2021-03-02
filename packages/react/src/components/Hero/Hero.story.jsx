import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from 'carbon-components-react';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import StoryNotice, { deprecatedStoryTitle } from '../../internal/StoryNotice';

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

export default {
  title: 'Watson IoT/🚫 Hero',
  decorators: [(storyFn) => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>],
};

export const Deprecated = () => (
  <StoryNotice componentName="Hero" replacementComponentName="PageTitleBar" />
);
Deprecated.story = {
  name: deprecatedStoryTitle,
};

export const Normal = () => <Hero title="Explore" />;

Normal.story = {
  name: 'normal',
};

export const WithDescription = () => (
  <Hero title="Explore" description={commonPageHeroProps.description} />
);

WithDescription.story = {
  name: 'with description',
};

export const IsLoading = () => <Hero title="Explore" isLoading />;

IsLoading.story = {
  name: 'isLoading',
};

export const WithRightContent = () => (
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
);

WithRightContent.story = {
  name: 'with right content',
};

export const WithBreadcrumbWithRightContent = () => (
  <Hero
    {...commonPageHeroProps}
    breadcrumb={breadcrumb}
    rightContentBreadcrumb={<div style={{ textAlign: 'right' }}>breadcrumb Right Content</div>}
  />
);

WithBreadcrumbWithRightContent.story = {
  name: 'with breadcrumb with right content',
};

export const WithBreadcrumb = () => <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} />;

WithBreadcrumb.story = {
  name: 'with breadcrumb',
};

export const WithTooltip = () => (
  <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} tooltip={tooltip} />
);

WithTooltip.story = {
  name: 'with tooltip',
};

export const WithTooltipNoLink = () => (
  <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} tooltip={{ message: tooltip.message }} />
);

WithTooltipNoLink.story = {
  name: 'with tooltip (no link)',
};

export const WithCloseButton = () => (
  <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} onClose={action('close')} />
);

WithCloseButton.story = {
  name: 'with close button',
};
