import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import SuiteHeaderLogoutModal from './SuiteHeaderLogoutModal';

storiesOf('Watson IoT/SuiteHeader/SuiteHeaderLogoutModal', module)
  .addParameters({
    component: SuiteHeaderLogoutModal,
  })
  .add('default', () => (
    <SuiteHeaderLogoutModal
      suiteName={text('suiteName', 'Application Suite')}
      displayName={text('displayName', 'Test User')}
      isOpen
      onClose={action('onClose')}
      onLogout={action('onLogout')}
    />
  ));
