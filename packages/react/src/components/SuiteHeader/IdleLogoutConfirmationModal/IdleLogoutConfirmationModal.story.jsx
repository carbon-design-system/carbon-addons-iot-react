import React from 'react';
import { action } from '@storybook/addon-actions';

import IdleLogoutConfirmationModal from './IdleLogoutConfirmationModal';

export default {
  title: '1 - Watson IoT/SuiteHeader/IdleLogoutConfirmationModal',

  parameters: {
    component: IdleLogoutConfirmationModal,
  },
};

export const Default = () => (
  <>
    <p>The logout confirmation dialog will show up after 10 seconds of inactivity.</p>
    <p>
      Open this story in another tab, wait for the dialog to show up in both tabs, then click
      &quot;Stay logged in&quot; to see the other dialog go away.
    </p>
    <IdleLogoutConfirmationModal
      idleTimeoutData={{
        timeout: 10,
        countdown: 10,
        cookieName: '_user_inactivity_timeout',
      }}
      routes={{
        logout: 'https://ibm.com',
        logoutInactivity: 'https://ibm.com',
        domain: '',
      }}
      onStayLoggedIn={action('onStayLoggedIn')}
    />
  </>
);

Default.storyName = 'default';
