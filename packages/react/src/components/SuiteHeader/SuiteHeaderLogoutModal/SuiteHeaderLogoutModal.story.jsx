import React from 'react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import SuiteHeaderLogoutModal from './SuiteHeaderLogoutModal';

export default {
  title: '1 - Watson IoT/SuiteHeader/SuiteHeaderLogoutModal',

  parameters: {
    component: SuiteHeaderLogoutModal,
  },
};

export const Default = () => (
  <SuiteHeaderLogoutModal
    suiteName={text('suiteName', 'Application Suite')}
    displayName={text('displayName', 'Test User')}
    isOpen
    onClose={action('onClose')}
    onLogout={action('onLogout')}
  />
);

Default.storyName = 'default';
