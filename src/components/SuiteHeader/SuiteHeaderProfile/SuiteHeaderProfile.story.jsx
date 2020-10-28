import React from 'react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import SuiteHeaderProfile from './SuiteHeaderProfile';

export default {
  title: 'Watson IoT/SuiteHeader/SuiteHeaderProfile',
};

export const Default = () => (
  <div style={{ width: '15rem' }}>
    <SuiteHeaderProfile
      displayName={text('displayName', 'Test User')}
      username={text('username', 'myuser')}
      onProfileClick={() => {
        window.location.href = 'https://www.ibm.com';
      }}
      onRequestLogout={action('onRequestLogout')}
    />
  </div>
);

Default.storyName = 'default';
