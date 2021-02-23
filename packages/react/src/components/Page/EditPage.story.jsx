import React from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import DeprecationNotice, { deprecatedStoryTitle } from '../../internal/DeprecationNotice';

import EditPage from './EditPage';

const commonEditPageProps = {
  title: 'Page Title',
  onClose: action('onClose'),
  onSave: action('onSave'),
  children: <div>child</div>,
};
const breadcrumb = [<a href="/">Home</a>, <a href="/">Type</a>, <span>Instance</span>];

export default {
  title: 'Watson IoT/EditPage 🚫',
  decorators: [(storyFn) => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>],
};

export const Deprecated = () => (
  <DeprecationNotice deprecatedComponentName="EditPage" replacementComponentName="PageWizard" />
);
Deprecated.story = {
  name: deprecatedStoryTitle,
};

export const Normal = () => <EditPage {...commonEditPageProps} />;

Normal.story = {
  name: 'normal',
};

export const IsLoading = () => <EditPage {...commonEditPageProps} isLoading />;

IsLoading.story = {
  name: 'isLoading',
};

export const WithBlurb = () => (
  <EditPage {...commonEditPageProps} blurb={text('blurb', 'My blurrrrbbbb!!')} />
);

WithBlurb.story = {
  name: 'with blurb',
};

export const WithBreadcrumb = () => <EditPage {...commonEditPageProps} breadcrumb={breadcrumb} />;

WithBreadcrumb.story = {
  name: 'with breadcrumb',
};
