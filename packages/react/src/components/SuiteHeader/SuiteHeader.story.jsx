/* eslint-disable no-script-url */
/* eslint-disable no-alert */

import React from 'react';
import { text, object, boolean, select } from '@storybook/addon-knobs';
import { ScreenOff16, Switcher24 } from '@carbon/icons-react';
import Chip from '@carbon/icons-react/es/chip/24';
import Dashboard from '@carbon/icons-react/es/dashboard/24';
import Group from '@carbon/icons-react/es/group/24';
import NotificationOn from '@carbon/icons-react/es/notification/24';
import Bee from '@carbon/icons-react/es/bee/24';
import Car from '@carbon/icons-react/es/car/24';
import Chat from '@carbon/icons-react/es/chat/24';

import { settings } from '../../constants/Settings';
import { Tag } from '../Tag';

import SuiteHeader from './SuiteHeader';
import SuiteHeaderI18N from './i18n';
import SuiteHeaderREADME from './SuiteHeader.mdx';

const { prefix } = settings;

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

const customActionItems = [
  {
    label: 'aHiddenIcon',
    btnContent: <ScreenOff16 id="hidden-button" fill="white" description="hidden-button-icon" />,
  },
  {
    label: 'bell',
    btnContent: (
      <span id="bell-icon">
        <NotificationOn id="notification-button" fill="white" description="Icon" />
      </span>
    ),
  },
  {
    label: 'bee',
    hasHeaderPanel: true,
    btnContent: (
      <span id="bee-icon">
        <Bee
          fill="white"
          description="Icon"
          className={`${prefix}--header__menu-item ${prefix}--header__menu-title`}
        />
      </span>
    ),
    childContent: [
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is a title',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: <span id="a-message">this is my message to you</span>,
      },
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is a title',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: (
          <span id="a-message">
            this is my really long message to you that should be truncated...
          </span>
        ),
      },
      {
        metaData: {
          element: 'button',
        },
        content: (
          <span id="an-email">
            JohnDoe@ibm.com
            <Chat fill="white" description="Icon" />
          </span>
        ),
      },
    ],
  },
  {
    label: 'car',
    btnContent: (
      <span id="car-icon">
        <Car fill="white" description="Icon" />
      </span>
    ),
    childContent: [
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is my message to you',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: <span id="another-message">this is my message to you</span>,
      },
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is my really long message to you that should be truncated...',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: (
          <span id="another-message">
            this is my really long message to you that should be truncated...
          </span>
        ),
      },
      {
        metaData: {
          element: 'button',
        },
        content: (
          <span id="another-email">
            JohnDoe@ibm.com
            <Chat fill="white" description="Icon" />
          </span>
        ),
      },
    ],
  },
];

const customHelpLinks = [
  {
    metaData: {
      href: 'http://www.ibm.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      element: 'a',
    },
    content: <span id="custom-help-link">{'{A custom help link}'}</span>,
  },
  {
    metaData: {
      href: 'http://google.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      element: 'a',
    },
    content: <span id="another-custom-help-link">{'{Another custom help link}'}</span>,
  },
  {
    metaData: {
      element: 'a',
      href: 'javascript:void(0)',
      onClick: () => alert('custom help menu action'),
    },
    content: (
      <span id="yet-another-custom-help-link">
        {'{Yet another custom help link that is really long and should be truncated...}'}
      </span>
    ),
  },
];

const customProfileLinks = [
  {
    metaData: {
      href: 'http://www.ibm.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      element: 'a',
    },
    content: <span id="custom-profile-link">{'{A custom profile link}'}</span>,
  },
  {
    metaData: {
      href: 'http://google.com',
      target: '_blank',
      rel: 'noopener noreferrer',
      element: 'a',
    },
    content: <span id="another-custom-profile-link">{'{Another custom profile link}'}</span>,
  },
  {
    metaData: {
      element: 'a',
      href: 'javascript:void(0)',
      onClick: () => alert('custom profile menu action'),
    },
    content: (
      <span id="yet-another-custom-profile-link">
        {'{Yet another custom profile link that is really long and should be truncated...}'}
      </span>
    ),
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
    name: 'Another Custom Application',
    href: 'https://google.com',
    isExternal: true,
  },
];

export default {
  title: '1 - Watson IoT/SuiteHeader',

  parameters: {
    component: SuiteHeader,
    docs: {
      page: SuiteHeaderREADME,
    },
  },
};

export const Default = () => {
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
        workspaceId: 'workspace1',
        domain: 'ibm.com',
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
};

Default.storyName = 'default';

export const HeaderWithExtraContent = () => {
  const language = select('Language', Object.keys(SuiteHeaderI18N), 'en');
  return (
    <SuiteHeader
      suiteName="Application Suite"
      appName="Application Name"
      extraContent={<Tag>Admin Mode</Tag>}
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
        workspaceId: 'workspace1',
        domain: 'ibm.com',
      }}
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
};

HeaderWithExtraContent.storyName = 'Header with extra content';

export const HeaderWithSideNav = () => (
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
);

HeaderWithSideNav.storyName = 'Header with side nav';

export const HeaderWithCustomSideNav = () => (
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
    hasSideNav
    onSideNavToggled={() => alert('onSideNavToggled')}
  />
);
HeaderWithCustomSideNav.storyName = 'Header with application-controlled side nav';

export const HeaderWithCustomActionItems = () => (
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
        href: 'https://google.com',
        isExternal: true,
      },
    ]}
    customActionItems={customActionItems}
    customHelpLinks={customHelpLinks}
    customProfileLinks={customProfileLinks}
    customApplications={customApplications}
    isActionItemVisible={(item) => {
      if (item.label === 'aHiddenIcon' || item.id === 'app-switcher') {
        return false;
      }

      return true;
    }}
  />
);

HeaderWithCustomActionItems.storyName = 'Header with custom action items and hidden icons';

export const HeaderWithSurveyNotification = () => {
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
      i18n={{
        ...SuiteHeaderI18N[language],
        surveyTitle: (solutionName) =>
          SuiteHeaderI18N[language].surveyTitle.replace('{solutionName}', solutionName),
        profileLogoutModalBody: (solutionName, userName) =>
          SuiteHeaderI18N[language].profileLogoutModalBody
            .replace('{solutionName}', solutionName)
            .replace('{userName}', userName),
      }}
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
      surveyData={object('survey', {
        surveyLink: 'https://www.ibm.com',
        privacyLink: 'https://www.ibm.com',
      })}
    />
  );
};

HeaderWithSurveyNotification.storyName = 'Header with survey notification';

export const LoadingState = () => {
  return <SuiteHeader suiteName="Application Suite" appName="Application Name" />;
};

LoadingState.storyName = 'Loading state';

export const HeaderWithIdleLogoutConfirmation = () => (
  <>
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
        logoutInactivity: 'https://www.ibm.com',
        whatsNew: 'https://www.ibm.com',
        gettingStarted: 'https://www.ibm.com',
        documentation: 'https://www.ibm.com',
        requestEnhancement: 'https://www.ibm.com',
        support: 'https://www.ibm.com',
        about: 'https://www.ibm.com',
      }}
      idleTimeoutData={{
        timeout: 10,
        countdown: 10,
        cookieName: '_user_inactivity_timeout',
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
          href: 'https://google.com',
          isExternal: true,
        },
      ]}
    />
    <p>The logout confirmation dialog will show up after 10 seconds of inactivity.</p>
    <p>
      Open this story in another tab, wait for the dialog to show up in both tabs, then click
      &ldquo;Stay logged in&ldquo; to see the other dialog go away.
    </p>
  </>
);

HeaderWithIdleLogoutConfirmation.storyName = 'Header with idle user detection';
