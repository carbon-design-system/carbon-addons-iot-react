import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, object, boolean, select } from '@storybook/addon-knobs';
import { Switcher24 } from '@carbon/icons-react';
import Chip from '@carbon/icons-react/lib/chip/24';
import Dashboard from '@carbon/icons-react/lib/dashboard/24';
import Group from '@carbon/icons-react/lib/group/24';

import SuiteHeader from './SuiteHeader';
import SuiteHeaderI18N from './i18n';
import useSuiteHeaderData from './hooks/useSuiteHeaderData';

const sideNavLinks = [
  {
    icon: Switcher24,
    isEnabled: true,
    metaData: {
      tabIndex: 0,
      label: 'Boards',
      element: ({ children, ...rest }) => <div {...rest}>{children}</div>,
      // isActive: true,
    },
    linkContent: 'Boards',
    childContent: [
      {
        metaData: {
          label: 'Yet another link',
          title: 'Yet another link',
          element: 'button',
        },
        content: 'Yet another link',
      },
    ],
  },
  {
    isEnabled: true,
    icon: Chip,
    metaData: {
      label: 'Devices',
      href: 'https://google.com',
      element: 'a',
      target: '_blank',
    },
    linkContent: 'Devices',
  },
  {
    isEnabled: true,
    icon: Dashboard,
    metaData: {
      label: 'Dashboards',
      href: 'https://google.com',
      element: 'a',
      target: '_blank',
    },
    linkContent: 'Dashboards',
    childContent: [
      {
        metaData: {
          label: 'Link 1',
          title: 'Link 1',
          element: 'button',
        },
        content: 'Link 1',
      },
      {
        metaData: {
          label: 'Link 2',
          title: 'Link 2',
        },
        content: 'Link 2',
      },
    ],
  },
  {
    isEnabled: true,
    icon: Group,
    metaData: {
      label: 'Members',
      element: 'button',
    },
    linkContent: 'Members',
    childContent: [
      {
        metaData: {
          label: 'Yet another link',
          title: 'Yet another link',
          element: 'button',
        },
        content: 'Link 3',
        isActive: true,
      },
    ],
  },
];

const HeaderWithHook = () => {
  const [data, isLoading, error, refreshData] = useSuiteHeaderData({
    // baseApiUrl: 'http://localhost:3001/internal',
    domain: 'mydomain.com',
    isTest: true,
    surveyConfig: {
      id: 'suite',
      delayIntervalDays: 30,
      frequencyDays: 90,
    },
  });
  const surveyLink = data.showSurvey ? 'https://www.ibm.com' : '';
  return (
    <SuiteHeader
      suiteName="Application Suite"
      appName="Application Name"
      userDisplayName={data.userDisplayName}
      username={data.username}
      routes={data.routes}
      applications={data.applications}
      sideNavProps={{
        links: sideNavLinks,
      }}
      survey={{
        link: surveyLink,
        title: 'Survey Notification Title',
        text: 'Survey notification text',
      }}
    />
  );
};

storiesOf('Watson IoT/SuiteHeader', module)
  .add('default', () => {
    const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
    return (
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
        i18n={SuiteHeaderI18N[language]}
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
      />
    );
  })
  .add('Header with side nav', () => (
    <SuiteHeader
      suiteName="Application Suite"
      appName="Application Name"
      userDisplayName="Admin User"
      username="adminuser"
      routes={{
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
      }}
      applications={[
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
      ]}
      sideNavProps={{
        links: sideNavLinks,
      }}
    />
  ))
  .add('Header with survey notification', () => {
    const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
    return (
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
        i18n={SuiteHeaderI18N[language]}
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
        survey={{
          link: 'https://www.ibm.com',
          title: 'Survey Notification Title',
          text: 'Survey notification text',
        }}
      />
    );
  })
  .add('Header with data hook', () => <HeaderWithHook />);
