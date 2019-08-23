import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Add24 } from '@carbon/icons-react';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import Button from '../Button';

import Hero from './Hero';

export const commonHeroProps = {
  title: 'Page title',
  description: 'Descriptive text about this page and what the user can or should do on it',
  rightContent: (
    <Button className="some-right-content" renderIcon={Add24}>
      Right Content
    </Button>
  ),
};

export const heroBreadcrumb = [<a href="/">Home</a>, <a href="/">Type</a>, <span>Instance</span>];

storiesOf('Watson IoT|Hero', module)
  .addDecorator(storyFn => <FullWidthWrapper>{storyFn()}</FullWidthWrapper>)
  .add('base', () => <Hero title={commonHeroProps.title} />)
  .add('with breadcrumb', () => <Hero title={commonHeroProps.title} breadcrumb={heroBreadcrumb} />)
  .add('with description', () => (
    <Hero title={commonHeroProps.title} description={commonHeroProps.description} />
  ))
  .add('with tooltip description', () => (
    <Hero
      title={commonHeroProps.title}
      description={commonHeroProps.description}
      breadcrumb={heroBreadcrumb}
      collapsed
    />
  ))
  .add('with editable title bar', () => (
    <Hero
      title={commonHeroProps.title}
      description={commonHeroProps.description}
      editable
      onEdit={action('edit')}
    />
  ))
  .add('with rich content', () => <Hero {...commonHeroProps} collapsed />)
  .add('isLoading', () => <Hero title={commonHeroProps.title} isLoading />);
