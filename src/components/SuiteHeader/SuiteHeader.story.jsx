import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, object, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { Button, CodeSnippet } from '../../index';

import useSuiteHeaderData from './hooks/useSuiteHeaderData';
import SuiteHeader from './SuiteHeader';
import SuiteHeaderProfile from './SuiteHeaderProfile';
import SuiteHeaderLogoutModal from './SuiteHeaderLogoutModal';
import SuiteHeaderAppSwitcher from './SuiteHeaderAppSwitcher';

const DataHookComponent = () => {
  const [data, isLoading, refreshData] = useSuiteHeaderData({
    // baseApiUrl: 'http://localhost:3001/internal',
    domain: 'testdomain',
    isTest: true,
  });
  return (
    <div>
      <Button loading={isLoading} onClick={refreshData}>
        Refresh
      </Button>
      <br />
      <CodeSnippet type="multi">{JSON.stringify(data, null, 2)}</CodeSnippet>
    </div>
  );
};

const HeaderWithDataHookComponent = () => {
  const [data, isLoading, refreshData] = useSuiteHeaderData({
    // baseApiUrl: 'http://localhost:3001/internal',
    domain: 'testdomain',
    isTest: true,
  });
  return (
    <div>
      <SuiteHeader
        suiteName="Application Suite"
        appName="Application Name"
        userDisplayName={data.userDisplayName}
        username={data.username}
        routes={data.routes}
        applications={data.applications}
      />
      <br />
      <Button loading={isLoading} onClick={refreshData}>
        Refresh
      </Button>
      <CodeSnippet type="multi">{JSON.stringify(data, null, 2)}</CodeSnippet>
    </div>
  );
};

storiesOf('Watson IoT/SuiteHeader', module)
  .add('Header', () => (
    <SuiteHeader
      suiteName={text('suiteName', 'Application Suite')}
      appName={text('appName', 'Application Name')}
      userDisplayName={text('userDisplayName', 'Admin User')}
      username={text('username', 'adminuser')}
      isAdminView={boolean('isAdminView', false)}
      routes={object('routes', {
        profile: 'https://www.ibm.com',
        navigator: 'https://www.ibm.com',
        admin: 'https://www.ibm.com',
        logout: 'https://www.ibm.com',
        whatsNew: 'https://www.ibm.com',
        gettingStarted: 'https://www.ibm.com',
        documentation: 'https://www.ibm.com',
        requestEnhancement: 'https://www.ibm.com',
        support: 'https://www.ibm.com',
        about: 'https://www.ibm.com',
      })}
      applications={object('applications', [
        {
          appId: 'monitor',
          name: 'Monitor',
          href: 'https://www.ibm.com',
        },
        {
          appId: 'health',
          name: 'Health',
          href: 'https://www.ibm.com',
          isExternal: true,
        },
      ])}
    />
  ))
  .add('Header with data hook', () => <HeaderWithDataHookComponent />)
  .add('Profile', () => (
    <div style={{ width: '15rem' }}>
      <SuiteHeaderProfile
        displayName={text('displayName', 'Test User')}
        username={text('username', 'myuser')}
        profileLink="https://www.ibm.com"
        onRequestLogout={action('onRequestLogout')}
      />
    </div>
  ))
  .add('Logout modal', () => (
    <SuiteHeaderLogoutModal
      suiteName={text('suiteName', 'Application Suite')}
      displayName={text('displayName', 'Test User')}
      isOpen
      onClose={action('onClose')}
      onLogout={action('onLogout')}
    />
  ))
  .add('Data hook', () => <DataHookComponent />)
  .add('App switcher', () => (
    <div style={{ width: '15rem', background: 'white' }}>
      <SuiteHeaderAppSwitcher
        applications={[
          {
            appId: 'monitor',
            name: 'Monitor',
            href: 'https://www.ibm.com',
          },
          {
            appId: 'health',
            name: 'Health',
            href: 'https://www.ibm.com',
            isExternal: true,
          },
        ]}
        allApplicationsLink="https://www.ibm.com"
        noAccessLink="https://www.ibm.com"
      />
    </div>
  ))
  .add('App switcher (no apps)', () => (
    <div style={{ width: '15rem', background: 'white' }}>
      <SuiteHeaderAppSwitcher
        applications={[]}
        allApplicationsLink="https://www.ibm.com"
        noAccessLink="https://www.ibm.com"
      />
    </div>
  ));
