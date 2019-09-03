import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Add24 } from '@carbon/icons-react';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import Button from '../Button';

import PageTitleBar from './PageTitleBar';

export const commonPageTitleBarProps = {
  title: 'Page title',
  description: 'Descriptive text about this page and what the user can or should do on it',
  rightContent: (
    <Button className="some-right-content" renderIcon={Add24}>
      Right Content
    </Button>
  ),
};

export const pageTitleBarBreadcrumb = [
  <a href="/">Home</a>,
  <a href="/">Type</a>,
  <span>Instance</span>,
];

storiesOf('Watson IoT|PageTitleBar', module)
  .addDecorator(storyFn => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>)
  .add('base', () => <PageTitleBar title={commonPageTitleBarProps.title} />)
  .add('with breadcrumb', () => (
    <PageTitleBar title={commonPageTitleBarProps.title} breadcrumb={pageTitleBarBreadcrumb} />
  ))
  .add('with description', () => (
    <PageTitleBar
      title={commonPageTitleBarProps.title}
      description={commonPageTitleBarProps.description}
    />
  ))
  .add('with tooltip description', () => (
    <PageTitleBar
      title={commonPageTitleBarProps.title}
      description={commonPageTitleBarProps.description}
      breadcrumb={pageTitleBarBreadcrumb}
      collapsed
    />
  ))
  .add('with editable title bar', () => (
    <PageTitleBar
      title={commonPageTitleBarProps.title}
      description={commonPageTitleBarProps.description}
      editable
      onEdit={action('edit')}
    />
  ))
  .add('with rich content', () => <PageTitleBar {...commonPageTitleBarProps} collapsed />)
  .add('isLoading', () => <PageTitleBar title={commonPageTitleBarProps.title} isLoading />);
