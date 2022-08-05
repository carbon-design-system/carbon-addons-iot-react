import React from 'react';
import { text, object } from '@storybook/addon-knobs';

import MultiWorkspaceSuiteHeaderAppSwitcher from './MultiWorkspaceSuiteHeaderAppSwitcher';

export default {
  title: '1 - Watson IoT/UI Shell/SuiteHeader/MultiWorkspaceSuiteHeaderAppSwitcher',

  parameters: {
    component: MultiWorkspaceSuiteHeaderAppSwitcher,
  },
};

export const AdminView = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      allApplicationsLink={text('allApplicationsLink', 'https://www.ibm.com')}
      adminLink={text('adminLink', 'https://www.ibm.com')}
      isAdminView
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
              isExternal: false,
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
          isCurrent: false,
          applications: [
            {
              id: 'health',
              name: 'Health',
              href: 'https://www.ibm.com',
            },
            {
              id: 'manage',
              name: 'Manage',
              href: 'https://www.ibm.com',
            },
          ],
        },
        {
          id: 'workspace4',
          name: 'Workspace 4',
          href: 'https://www.ibm.com',
          isCurrent: false,
          applications: [],
        },
      ])}
      globalApplications={object('globalApplications', [
        {
          id: 'appconnect',
          name: 'AppConnect',
          href: 'https://www.ibm.com',
          isExternal: true,
        },
      ])}
    />
  </div>
);

AdminView.storyName = 'Admin view';

export const NonAdminView = () => (
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
          isCurrent: false,
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
              isExternal: false,
            },
          ],
        },
        {
          id: 'workspace2',
          name: 'Workspace 2',
          href: 'https://www.ibm.com',
          adminHref: 'https://www.ibm.com',
          isCurrent: true,
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
          isCurrent: false,
          applications: [
            {
              id: 'health',
              name: 'Health',
              href: 'https://www.ibm.com',
            },
            {
              id: 'manage',
              name: 'Manage',
              href: 'https://www.ibm.com',
            },
          ],
        },
        {
          id: 'workspace4',
          name: 'Workspace 4',
          href: 'https://www.ibm.com',
          isCurrent: false,
          applications: [],
        },
      ])}
      globalApplications={object('globalApplications', [
        {
          id: 'appconnect',
          name: 'AppConnect',
          href: 'https://www.ibm.com',
          isExternal: true,
        },
      ])}
    />
  </div>
);

NonAdminView.storyName = 'Non-admin view';

export const AdminSingleWorkspace = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      allApplicationsLink={text('allApplicationsLink', 'https://www.ibm.com')}
      adminLink={text('adminLink', 'https://www.ibm.com')}
      isAdminView
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', [
        {
          id: 'workspace',
          name: 'Workspace',
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
              isExternal: false,
            },
          ],
        },
      ])}
      globalApplications={object('globalApplications', [
        {
          id: 'appconnect',
          name: 'AppConnect',
          href: 'https://www.ibm.com',
          isExternal: true,
        },
      ])}
    />
  </div>
);

AdminSingleWorkspace.storyName = 'Admin view (single workspace)';

export const NonAdminSingleWorkspace = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      allApplicationsLink={text('allApplicationsLink', 'https://www.ibm.com')}
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', [
        {
          id: 'workspace',
          name: 'Workspace',
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
              isExternal: false,
            },
          ],
        },
      ])}
      globalApplications={object('globalApplications', [
        {
          id: 'appconnect',
          name: 'AppConnect',
          href: 'https://www.ibm.com',
          isExternal: true,
        },
      ])}
    />
  </div>
);

NonAdminSingleWorkspace.storyName = 'Non-admin view (single workspace)';

export const LoadingState = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher />
  </div>
);

LoadingState.storyName = 'Loading state';
