import React from 'react';
import { text, object, boolean, select } from '@storybook/addon-knobs';
import { Switcher24 } from '@carbon/icons-react';
import Chip from '@carbon/icons-react/lib/chip/24';
import Dashboard from '@carbon/icons-react/lib/dashboard/24';
import Group from '@carbon/icons-react/lib/group/24';
import NotificationOn from '@carbon/icons-react/lib/notification/24';
import Bee from '@carbon/icons-react/lib/bee/24';
import Car from '@carbon/icons-react/lib/car/24';
import Chat from '@carbon/icons-react/lib/chat/24';

import SuiteHeader from './SuiteHeader';
import SuiteHeaderI18N from './i18n';
// import getSuiteHeaderData from './util/suiteHeaderData';
// import useSuiteHeaderData from './hooks/useSuiteHeaderData';

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
    label: 'alerts',
    btnContent: <NotificationOn fill="white" description="Icon" />,
  },
  {
    label: 'help',
    hasHeaderPanel: true,
    btnContent: (
      <Bee
        fill="white"
        description="Icon"
        className="bx--header__menu-item bx--header__menu-title"
      />
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
        content: 'this is my message to you',
      },
      {
        metaData: {
          className: 'this',
          element: 'button',
        },
        content: (
          <span>
            JohnDoe@ibm.com
            <Chat fill="white" description="Icon" />
          </span>
        ),
      },
    ],
  },
  {
    label: 'user',
    btnContent: <Car fill="white" description="Icon" />,
    childContent: [
      {
        metaData: {
          href: 'http://google.com',
          title: 'this is a title',
          target: '_blank',
          rel: 'noopener noreferrer',
          element: 'a',
        },
        content: 'this is my message to you',
      },
      {
        metaData: {
          className: 'this',
          element: 'button',
        },
        content: (
          <span>
            JohnDoe@ibm.com
            <Chat fill="white" description="Icon" />
          </span>
        ),
      },
    ],
  },
];

export default {
  title: 'Watson IoT/SuiteHeader',

  parameters: {
    component: SuiteHeader,
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

Default.story = {
  name: 'default',
};

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

HeaderWithSideNav.story = {
  name: 'Header with side nav',
};

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
        href: 'https://www.ibm.com',
        isExternal: true,
      },
    ]}
    customActionItems={customActionItems}
  />
);

HeaderWithCustomActionItems.story = {
  name: 'Header with custom action items',
};

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

/* Sample of SuiteHeader usage with data hook
export const HeaderWithHook = () => {
  const StatefulExample = () => {
    const [data] = useSuiteHeaderData({
      // baseApiUrl: 'http://localhost:3001/internal',
      domain: 'mydomain.com',
      isTest: true,
      surveyConfig: {
        id: 'suite',
        delayIntervalDays: 30,
        frequencyDays: 90,
      },
      lang: 'en',
    });
    const surveyData = data.showSurvey
      ? {
          surveyLink: 'https://www.ibm.com',
          privacyLink: 'https://www.ibm.com',
        }
      : null;
    return data.username ? (
      <SuiteHeader
        suiteName="Application Suite"
        appName="Application Name"
        userDisplayName={data.userDisplayName}
        username={data.username}
        routes={data.routes}
        applications={data.applications}
        i18n={data.i18n}
        surveyData={surveyData}
      />
    ) : null;
  };
  return <StatefulExample />;
};

HeaderWithHook.story = {
  name: 'Header with hook',
};

export const HeaderWithDataFetching = () => {
  const StatefulExample = () => {
    const [data, setData] = useState({
      username: null,
      userDisplayName: null,
      email: null,
      routes: {
        profile: null,
        navigator: null,
        admin: null,
        logout: null,
        about: null,
        documentation: null,
        whatsNew: null,
        requestEnhancement: null,
        support: null,
        gettingStarted: null,
      },
      applications: [],
      showSurvey: false,
    });
    useEffect(() => {
      getSuiteHeaderData({
        // baseApiUrl: 'http://localhost:3001/internal',
        domain: 'mydomain.com',
        isTest: true,
        surveyConfig: {
          id: 'suite',
          delayIntervalDays: 30,
          frequencyDays: 90,
        },
        lang: 'en',
      }).then((suiteHeaderData) => setData(suiteHeaderData));
    }, []);

    const surveyData = data.showSurvey
      ? {
          surveyLink: 'https://www.ibm.com',
          privacyLink: 'https://www.ibm.com',
        }
      : null;
    return data.username ? (
      <SuiteHeader
        suiteName="Application Suite"
        appName="Application Name"
        userDisplayName={data.userDisplayName}
        username={data.username}
        routes={data.routes}
        applications={data.applications}
        i18n={data.i18n}
        surveyData={surveyData}
      />
    ) : null;
  };
  return <StatefulExample />;
};

HeaderWithDataFetching.story = {
  name: 'Header with data fetching',
};

*/

HeaderWithSurveyNotification.story = {
  name: 'Header with survey notification',
};
