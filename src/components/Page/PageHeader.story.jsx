import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import PageHeader from './PageHeader';

const commonPageHeaderProps = {
  title: 'Page Title',
  onClose: action('onClose'),
};

storiesOf('PageHeader', module)
  .add('normal', () => <PageHeader {...commonPageHeaderProps} />)
  .add('with blurb', () => (
    <PageHeader {...commonPageHeaderProps} blurb={text('blurb', 'My blurrrrbbbb!!')} />
  ))
  .add('with children', () => (
    <PageHeader {...commonPageHeaderProps}>
      <div>child</div>
    </PageHeader>
  ));
