import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import SuiteHeaderProfile from './SuiteHeaderProfile';

storiesOf('Watson IoT/SuiteHeader/SuiteHeaderProfile', module)
  .addParameters({
    component: SuiteHeaderProfile,
  })
  .add('default', () => (
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
  ));
