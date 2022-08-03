import React from 'react';
import { text, object } from '@storybook/addon-knobs';

import MultiWorkspaceSuiteHeaderAppSwitcher from './MultiWorkspaceSuiteHeaderAppSwitcher';

export default {
  title: '1 - Watson IoT/UI Shell/SuiteHeader/MultiWorkspaceSuiteHeaderAppSwitcher',

  parameters: {
    component: MultiWorkspaceSuiteHeaderAppSwitcher,
  },
};

export const Default = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      allApplicationsLink={text('allApplicationsLink', 'https://www.ibm.com')}
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', [
        {
          id: 'workspace1',
          name: 'Workspace 1',
          href: 'https://www.ibm.com',
          adminHref: 'https://www.ibm.com',
          isCurrent: true,
          applications: [
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
          ],
        },
        {
          id: 'workspace2',
          name: 'Workspace 2',
          href: 'https://www.ibm.com',
          adminHref: 'https://www.ibm.com',
          isCurrent: false,
          applications: [
            {
              id: 'monitor',
              name: 'Monitor',
              href: 'https://www.ibm.com',
            },
          ],
        },
        {
          id: 'workspace3',
          name: 'Workspace 3',
          href: 'https://www.ibm.com',
          adminHref: 'https://www.ibm.com',
          isCurrent: false,
          applications: [
            {
              id: 'Health',
              name: 'Health',
              href: 'https://www.ibm.com',
            },
          ],
        },
      ])}
    />
  </div>
);

Default.storyName = 'default';
