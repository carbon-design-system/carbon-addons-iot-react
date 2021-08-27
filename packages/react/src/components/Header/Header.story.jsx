import React from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import NotificationOn from '@carbon/icons-react/lib/notification/16';
import HeaderHelp from '@carbon/icons-react/lib/help/16';
import Avatar from '@carbon/icons-react/lib/user--avatar/16';
import { Bullhorn16, Checkbox16 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';
import { Tag } from '../Tag';

import Header from './Header';

const { iotPrefix } = settings;

React.Fragment = ({ children }) => children;

const HeaderProps = {
  user: 'JohnDoe@ibm.com',
  tenant: 'TenantId: Acme',
  url: 'http://localhost:8989',
  className: 'custom-class-name',
  appName: 'Application Name',
  skipto: 'skip',
  i18n: {
    openMenu: 'Open the menu',
  },
  actionItems: [
    {
      label: 'alerts',
      onClick: action('click fired'),
      btnContent: <NotificationOn fill="white" description="Icon" />,
    },
    {
      label: 'help',
      hasHeaderPanel: true,
      btnContent: (
        <HeaderHelp
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
            onClick: action('do another action'),
            className: 'this',
            element: 'button',
          },
          content: (
            <span>
              JohnDoe@ibm.com
              <Avatar fill="white" description="Icon" />
            </span>
          ),
        },
      ],
    },
    {
      label: 'user',
      btnContent: <Avatar fill="white" description="Icon" />,
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
            onClick: action('do another action'),
            className: 'this',
            element: 'button',
          },
          content: (
            <span>
              JohnDoe@ibm.com
              <Avatar fill="white" description="Icon" />
            </span>
          ),
        },
      ],
    },
  ],
};

const HeaderMenuProps = {
  user: 'JohnDoe@ibm.com',
  tenant: 'TenantId: Acme',
  url: 'http://localhost:8989',
  className: 'custom-class-name',
  appName: 'Application Name',
  skipto: 'skip',
  actionItems: [
    {
      label: 'user',
      btnContent: <Avatar fill="white" description="Icon" />,
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
            onClick: action('do another action'),
            className: 'this',
            element: 'button',
          },
          content: (
            <span>
              JohnDoe@ibm.com
              <Avatar fill="white" description="Icon" />
            </span>
          ),
        },
      ],
    },
  ],
};

const headerPanel = {
  className: 'header-panel',

  content: React.forwardRef((props, ref) => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a href="#" ref={ref} {...props}>
      Header panel content
    </a>
  )),
};

export default {
  title: '1 - Watson IoT/Header',

  parameters: {
    component: Header,
    docs: {
      inlineStories: false,
    },
  },
};

export const HeaderActionButtonsWithDropdowns = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <Header
      {...HeaderProps}
      className={`${iotPrefix}--header--story-test-class`}
      headerPanel={headerPanel}
      appSwitcherLabel={text('AppSwitcher label', 'AppSwitcher')}
    />
    <div id="skip" />
  </div>
);

HeaderActionButtonsWithDropdowns.storyName = 'Header action buttons with dropdowns';

export const HeaderSubmenu = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <Header {...HeaderMenuProps} className={`${iotPrefix}--header--story-test-class`} />
  </div>
);

HeaderSubmenu.storyName = 'header submenu';

export const HeaderNoSubmenu = () => (
  <Header
    {...HeaderProps}
    className={`${iotPrefix}--header--story-test-class`}
    actionItems={[
      {
        label: 'user',
        onClick: action('click'),
        btnContent: <Avatar fill="white" description="Icon" />,
      },
    ]}
  />
);

HeaderNoSubmenu.storyName = 'Header no submenu';

export const HeaderSubtitle = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <Header {...HeaderMenuProps} subtitle="Monitor" />
  </div>
);

HeaderSubtitle.storyName = 'header subtitle';

export const SmallBreakpoint = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <style>{`.isReallyHidden {
      display: none !important;
    }`}</style>
    <Header
      {...HeaderProps}
      actionItems={[
        {
          label: 'A Hidden Icon',
          onClick: action('click fired'),
          btnContent: <Bullhorn16 fill="white" description="A Hidden Icon" />,
          className: 'isReallyHidden',
        },
        {
          label: 'Announcements',
          onClick: action('click fired'),
          btnContent: <Bullhorn16 fill="white" description="Announcements" />,
        },
        {
          label: 'Custom icon 1',
          onClick: action('click fired'),
          btnContent: <Checkbox16 fill="white" description="icon" />,
        },
        {
          label: 'Custom icon 2',
          onClick: action('click fired'),
          btnContent: <Checkbox16 fill="white" description="icon" />,
        },
        {
          label: 'Custom icon 3',
          onClick: action('click fired'),
          btnContent: <Checkbox16 fill="white" description="icon" />,
        },
        ...HeaderProps.actionItems,
      ]}
      appName={text('appName', 'Maximo Application Suite')}
      shortAppName={text('shortAppName', 'Maximo')}
      subtitle={text('subtitle', 'Manage')}
      isActionItemVisible={(label) => {
        action('isActionItemVisible')(label);
        if (label === 'A Hidden Icon') {
          return false;
        }

        return true;
      }}
    />
  </div>
);

SmallBreakpoint.storyName = 'small breakpoint';

export const HeaderComponentSubtitle = () => (
  <div style={{ width: '100%', height: '100vh' }}>
    <Header
      {...HeaderMenuProps}
      className={`${iotPrefix}--header--story-test-class`}
      subtitle={
        <div>
          {'Monitor'}
          <span style={{ marginLeft: '1rem' }}>
            <Tag>Admin Mode</Tag>
          </span>
        </div>
      }
    />
  </div>
);

HeaderComponentSubtitle.storyName = 'header subtitle component';
