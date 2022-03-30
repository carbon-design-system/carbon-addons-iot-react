import React from 'react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import SuiteHeaderProfile from './SuiteHeaderProfile';

export default {
  title: '1 - Watson IoT/UI Shell/SuiteHeader/SuiteHeaderProfile',

  parameters: {
    component: SuiteHeaderProfile,
  },
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

export const LoadingState = () => (
  <div style={{ width: '15rem' }}>
    <SuiteHeaderProfile
      onProfileClick={() => {
        window.location.href = 'https://www.ibm.com';
      }}
      onRequestLogout={() => {}}
    />
  </div>
);

LoadingState.storyName = 'Loading state';

export const NoLogoutButton = () => (
  <div style={{ width: '15rem' }}>
    <SuiteHeaderProfile
      displayName={text('displayName', 'Test User')}
      username={text('username', 'myuser')}
      onProfileClick={() => {
        window.location.href = 'https://www.ibm.com';
      }}
    />
  </div>
);

NoLogoutButton.storyName = 'No log out button';

export const NoLogoutButtonLoadingState = () => (
  <div style={{ width: '15rem' }}>
    <SuiteHeaderProfile
      onProfileClick={() => {
        window.location.href = 'https://www.ibm.com';
      }}
    />
  </div>
);

NoLogoutButtonLoadingState.storyName = 'Loading state (no log out button)';
