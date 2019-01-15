import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ButtonEnhanced from './ButtonEnhanced';

const ButtonEnhancedProps = {
  onClick: action('click'),
  loading: true,
};

storiesOf('ButtonEnhanced', module).add(
  'loading',

  () => <ButtonEnhanced {...ButtonEnhancedProps}>Test ButtonEnhanced</ButtonEnhanced>
);
