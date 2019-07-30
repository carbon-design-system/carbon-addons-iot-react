import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from './Button';

const ButtonProps = {
  onClick: action('click'),
};

storiesOf('Watson IoT|Button', module)
  .add('loading', () => (
    <Button {...ButtonProps} loading>
      Test Button
    </Button>
  ))
  .add('loading with secondary', () => (
    <Button {...ButtonProps} kind="secondary" loading>
      Test Button
    </Button>
  ))
  .add('not loading', () => <Button {...ButtonProps}>Test Button</Button>);
