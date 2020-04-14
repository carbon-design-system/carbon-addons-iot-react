import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AppSwitcher from '@carbon/icons-react/lib/app-switcher/24';
import Chip from '@carbon/icons-react/lib/chip/24';
import Dashboard from '@carbon/icons-react/lib/dashboard/24';
import Group from '@carbon/icons-react/lib/group/24';
import { HeaderContainer } from 'carbon-components-react/lib/components/UIShell';

import Header from '../Header';
import PageTitleBar from '../PageTitleBar/PageTitleBar';
import { settings } from '../../constants/Settings';
import FullWidthWrapper from '../../internal/FullWidthWrapper';

import SideNav from './SideNav';
import Styles from './SideNav.story.scss'; // eslint-disable-line

const { iotPrefix } = settings;

React.Fragment = ({ children }) => children;

const RouterComponent = ({ children, ...rest }) => <div {...rest}>{children}</div>;

/* eslint-disable*/
const links = [
  {
    icon: AppSwitcher,
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

const switcherProps = {
  options: ['ExampleOne', 'ExampleTwo'],
  labelText: 'ExampleOne',
  onChange: () => {},
  className: 'class',
  switcherTitle: 'Applications',
};

// const link = <Icon name="header--help" fill="white" description="Icon" />;
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
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
    },
  ],
};

storiesOf('Watson IoT/SideNav', module).add(
  'SideNav component',
  () => (
    <FullWidthWrapper withPadding={false}>
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
              onClickSideNavExpand={onClickSideNavExpand}
              switcherProps={switcherProps}
            />
            <div className={`${iotPrefix}--main-content`}>
              <PageTitleBar title="Title" description="Description" />
            </div>
          </>
        )}
      />
    </FullWidthWrapper>
  ),
  {
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
            onClickSideNavExpand={onClickSideNavExpand}
          />
        </>
      )}
    />

      ~~~

      <br/>

      If you want to style your main content to "push over" instead of being overlayed by the sidenav you can use the ".iot--side-nav--expanded" class. It could look something like this.

      <br/>

      ~~~scss
      .iot--main-content {
        width: calc(100% - 3rem);
        transform: translateX(3rem);
        transition: all .2s ease-in;
      }

      .iot--side-nav--expanded + .iot--main-content {
        width: calc(100% - 16rem);
        transform: translateX(16rem);
      }

      html[dir='rtl'] {
        .iot--main-content,
        .iot--side-nav--expanded + .iot--main-content {
          transform: translateX(0);
        }

      }

      ~~~

      `,
    },
  }
);
