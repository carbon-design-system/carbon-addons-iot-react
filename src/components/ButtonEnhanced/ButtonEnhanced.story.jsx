import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ButtonEnhanced from './ButtonEnhanced';

const ButtonEnhancedProps = {
  onClick: action('click'),
};

storiesOf('Watson IoT|ButtonEnhanced', module)
  .add('loading', () => (
    <ButtonEnhanced {...ButtonEnhancedProps} loading>
      Test ButtonEnhanced
    </ButtonEnhanced>
  ))
  .add('loading with secondary', () => (
    <ButtonEnhanced {...ButtonEnhancedProps} kind="secondary" loading>
      Test ButtonEnhanced
    </ButtonEnhanced>
  ))
  .add('not loading', () => (
    <ButtonEnhanced {...ButtonEnhancedProps}>Test ButtonEnhanced</ButtonEnhanced>
  ));
