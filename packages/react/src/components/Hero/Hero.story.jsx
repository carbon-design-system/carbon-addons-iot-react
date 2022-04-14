import React from 'react';
import { action } from '@storybook/addon-actions';

import Button from '../Button';
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
  title: '1 - Watson IoT/Deprecated/🚫 Hero',
  decorators: [(storyFn) => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>],
};

export const Deprecated = () => (
  <StoryNotice componentName="Hero" replacementComponentName="PageTitleBar" />
);
Deprecated.storyName = deprecatedStoryTitle;

export const Normal = () => <Hero title="Explore" />;

Normal.storyName = 'normal';

export const WithDescription = () => (
  <Hero title="Explore" description={commonPageHeroProps.description} />
);

WithDescription.storyName = 'with description';

export const IsLoading = () => <Hero title="Explore" isLoading />;

IsLoading.storyName = 'isLoading';

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

WithRightContent.storyName = 'with right content';

export const WithBreadcrumbWithRightContent = () => (
  <Hero
    {...commonPageHeroProps}
    breadcrumb={breadcrumb}
    rightContentBreadcrumb={<div style={{ textAlign: 'right' }}>breadcrumb Right Content</div>}
  />
);

WithBreadcrumbWithRightContent.storyName = 'with breadcrumb with right content';

export const WithBreadcrumb = () => <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} />;

WithBreadcrumb.storyName = 'with breadcrumb';

export const WithTooltip = () => (
  <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} tooltip={tooltip} />
);

WithTooltip.storyName = 'with tooltip';

export const WithTooltipNoLink = () => (
  <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} tooltip={{ message: tooltip.message }} />
);

WithTooltipNoLink.storyName = 'with tooltip (no link)';

export const WithCloseButton = () => (
  <Hero {...commonPageHeroProps} breadcrumb={breadcrumb} onClose={action('close')} />
);

WithCloseButton.storyName = 'with close button';
