import React from 'react';
import { text, object } from '@storybook/addon-knobs';

import MultiWorkspaceSuiteHeaderAppSwitcher from './MultiWorkspaceSuiteHeaderAppSwitcher';

const workspaces = [
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
    isCurrent: true,
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
];

const globalApplications = [
  {
    id: 'appconnect',
    name: 'AppConnect',
    href: 'https://www.ibm.com',
    isExternal: true,
  },
];

const customApplications = [
  {
    id: 'customapp1',
    name: 'Custom Application',
    href: 'https://www.ibm.com',
  },
  {
    id: 'customapp2',
    name: 'External Custom Application',
    href: 'https://google.com',
    isExternal: true,
  },
];

export default {
  title: '1 - Watson IoT/UI Shell/SuiteHeader/Multi-workspace/MultiWorkspaceSuiteHeaderAppSwitcher',

  parameters: {
    component: MultiWorkspaceSuiteHeaderAppSwitcher,
  },
};

export const AdminView = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      isAdminView
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', workspaces)}
    />
  </div>
);

AdminView.storyName = 'Admin view';

export const NonAdminView = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', workspaces)}
    />
  </div>
);

NonAdminView.storyName = 'Non-admin view';

export const AdminSingleWorkspace = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      isAdminView
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', [workspaces[0]])}
    />
  </div>
);

AdminSingleWorkspace.storyName = 'Admin view - Single workspace';

export const NonAdminSingleWorkspace = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', [workspaces[0]])}
    />
  </div>
);

NonAdminSingleWorkspace.storyName = 'Non-admin view - Single workspace';

export const WithGlobalAndCustomApplications = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher
      adminLink={text('adminLink', 'https://www.ibm.com')}
      noAccessLink={text('noAccessLink', 'https://www.ibm.com')}
      workspaces={object('workspaces', workspaces)}
      globalApplications={object('globalApplications', globalApplications)}
      customApplications={object('customApplications', customApplications)}
    />
  </div>
);

WithGlobalAndCustomApplications.storyName = 'With global and custom applications';

export const LoadingState = () => (
  <div style={{ width: '15rem', background: 'white' }}>
    <MultiWorkspaceSuiteHeaderAppSwitcher />
  </div>
);

LoadingState.storyName = 'Loading state';
