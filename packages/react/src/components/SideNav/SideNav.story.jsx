import React, { useState, createElement, useEffect } from 'react';
import { action } from '@storybook/addon-actions';
import { Switcher24 } from '@carbon/icons-react';
import Chip from '@carbon/icons-react/lib/chip/24';
import Dashboard from '@carbon/icons-react/lib/dashboard/24';
import Group from '@carbon/icons-react/lib/group/24';
import { HeaderContainer } from 'carbon-components-react/lib/components/UIShell';

import Header from '../Header';
import PageTitleBar from '../PageTitleBar/PageTitleBar';
import { settings } from '../../constants/Settings';
import FullWidthWrapper from '../../internal/FullWidthWrapper';
import './SideNav.story.scss';
import StatefulTable from '../Table/StatefulTable';
import { initialState } from '../Table/Table.story';

import SideNav from './SideNav';

const { prefix, iotPrefix } = settings;

React.Fragment = ({ children }) => children;

const RouterComponent = ({ children, ...rest }) => <div {...rest}>{children}</div>;

const links = [
  {
    icon: Switcher24,
    isEnabled: true,
    metaData: {
      onClick: action('menu click'),
      tabIndex: 0,
      label: 'Boards',
      element: RouterComponent,
      // isActive: true,
    },
    linkContent: 'Boards',
    childContent: [
      {
        metaData: {
          label: 'Yet another link',
          title: 'Yet another link',
          onClick: action('inner menu click'),
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
          onClick: action('inner menu click'),
          element: 'button',
        },
        content: 'Link 1',
      },
      {
        metaData: {
          label: 'Link 2',
          title: 'Link 2',
          href: '/?path=/story/watson-iot-sidenav--sidenav-component',
          onClick: action('inner menu click'),
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
          onClick: action('inner menu click'),
          element: 'button',
        },
        content: 'Link 3',
        isActive: true,
      },
    ],
  },
];

const HeaderProps = {
  user: 'JohnDoe@ibm.com',
  tenant: 'TenantId: Acme',
  className: 'custom-class-name',
  appName: 'Watson IoT Platform ',
  actionItems: [
    {
      label: 'user',
      onClick: action('click'),
      btnContent: (
        <Group
          fill="white"
          description="Icon"
          className={`${prefix}--header__menu-item ${prefix}--header__menu-title`}
        />
      ),
    },
  ],
};

export default {
  title: '1 - Watson IoT/SideNav',

  parameters: {
    component: SideNav,
    docs: {
      inlineStories: false,
    },
  },
};

export const SideNavComponent = () => (
  <FullWidthWrapper withPadding={false}>
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header
            {...HeaderProps}
            isSideNavExpanded={isSideNavExpanded}
            onClickSideNavExpand={onClickSideNavExpand}
          />
          <SideNav links={links} isSideNavExpanded={isSideNavExpanded} />
          <div className={`${iotPrefix}--main-content`}>
            <PageTitleBar title="Title" description="Description" />

            <div style={{ padding: '2rem' }}>
              <StatefulTable {...initialState} />
            </div>
          </div>
        </>
      )}
    />
  </FullWidthWrapper>
);

SideNavComponent.storyName = 'SideNav component';

SideNavComponent.parameters = {
  info: {
    text: `
  When implementing the Header and SideNav components you must utilized the HeaderContainer component

  <br/>

  ~~~js
  <HeaderContainer
  render={({ isSideNavExpanded, onClickSideNavExpand }) => (
    <>
      <Header
        {...HeaderProps}
        isSideNavExpanded={isSideNavExpanded}
        onClickSideNavExpand={onClickSideNavExpand}
      />
      <SideNav
        links={links}
        isSideNavExpanded={isSideNavExpanded}
      />
    </>
  )}
/>

  ~~~

  <br/>

  If you want to style your main content to "push over" instead of being overlayed by the sidenav you can use the ".${iotPrefix}--side-nav--expanded" class. It could look something like this.

  <br/>

  ~~~scss
  .${iotPrefix}--main-content {
    width: calc(100% - 3rem);
    transform: translateX(3rem);
    transition: all .2s ease-in;
  }

  .${iotPrefix}--side-nav--expanded + .${iotPrefix}--main-content {
    width: calc(100% - 16rem);
    transform: translateX(16rem);
  }

  html[dir='rtl'] {
    .${iotPrefix}--main-content,
    .${iotPrefix}--side-nav--expanded + .${iotPrefix}--main-content {
      transform: translateX(0);
    }

  }

  ~~~

  `,
  },
};

export const SideNavComponentWithState = () => {
  const [linksState, setLinksState] = useState([]);
  const onSideNavMenuItemClick = (linkLabel) => {
    setLinksState((currentLinks) =>
      currentLinks.map((group) => {
        return {
          ...group,
          childContent: group.childContent.map((child) => ({
            ...child,
            isActive: linkLabel === child.metaData.label,
          })),
        };
      })
    );
  };

  useEffect(() => {
    setLinksState([
      {
        isEnabled: true,
        icon: Dashboard,
        metaData: {
          label: 'Dashboards',
          element: 'button',
        },
        linkContent: 'Dashboards',
        childContent: [
          {
            metaData: {
              label: 'Link 1',
              title: 'Link 1',
              onClick: () => onSideNavMenuItemClick('Link 1'),
              element: 'button',
            },
            content: 'Link 1',
          },
          {
            metaData: {
              label: 'Link 2',
              title: 'Link 2',
              onClick: () => onSideNavMenuItemClick('Link 2'),
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
              label: 'Link 3',
              title: 'Link 3',
              onClick: () => onSideNavMenuItemClick('Link 3'),
              element: 'button',
            },
            content: 'Link 3',
            isActive: true,
          },
          {
            metaData: {
              label: 'Link 4',
              title: 'Link 4',
              onClick: () => onSideNavMenuItemClick('Link 4'),
              element: 'button',
            },
            content: 'Link 4',
            isActive: false,
          },
        ],
      },
    ]);
  }, []);

  return (
    <FullWidthWrapper withPadding={false}>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header
              {...HeaderProps}
              isSideNavExpanded={isSideNavExpanded}
              onClickSideNavExpand={onClickSideNavExpand}
            />
            <SideNav links={linksState} isSideNavExpanded={isSideNavExpanded} />
            <div className={`${iotPrefix}--main-content`}>
              <PageTitleBar title="Title" description="Description" />
            </div>
          </>
        )}
      />
    </FullWidthWrapper>
  );
};

SideNavComponentWithState.decorators = [createElement];
SideNavComponentWithState.storyName = 'SideNav component with state';
