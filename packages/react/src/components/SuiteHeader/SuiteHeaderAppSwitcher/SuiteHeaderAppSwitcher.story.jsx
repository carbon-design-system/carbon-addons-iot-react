import React from 'react';
import { text, object } from '@storybook/addon-knobs';

import SuiteHeaderAppSwitcher from './SuiteHeaderAppSwitcher';

export default {
  title:
    '1 - Watson IoT/UI Shell/SuiteHeader/Legacy (single workspace only)/SuiteHeaderAppSwitcher',

  parameters: {
    component: SuiteHeaderAppSwitcher,
  },
};

export const Default = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <SuiteHeaderAppSwitcher
      applications={object('applications', [
        {
          id: 'monitor',
          name: 'Monitor',
          href: 'https://www.ibm.com',
        },
        {
          id: 'health',
          name: 'Health',
          href: 'https://www.ibm.com',
          isExternal: true,
        },
      ])}
      allApplicationsLink={text('allApplicationsLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
    />
  </div>
);

Default.storyName = 'default';

export const NoApplications = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <SuiteHeaderAppSwitcher
      applications={[]}
      allApplicationsLink="https://www.ibm.com"
      noAccessLink="https://www.ibm.com"
    />
  </div>
);

NoApplications.storyName = 'No applications';

export const LoadingState = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <SuiteHeaderAppSwitcher />
  </div>
);

LoadingState.storyName = 'Loading state';
