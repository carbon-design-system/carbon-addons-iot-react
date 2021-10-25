import React, { useState, createElement, useEffect } from 'react';
import { action } from '@storybook/addon-actions';
import { Switcher24, Chip24, Dashboard24, Group24, ParentChild24 } from '@carbon/icons-react';
import { HeaderContainer } from 'carbon-components-react/lib/components/UIShell';
import { boolean } from '@storybook/addon-knobs';

import Header from '../Header';
import PageTitleBar from '../PageTitleBar/PageTitleBar';
import { settings } from '../../constants/Settings';
import FullWidthWrapper from '../../internal/FullWidthWrapper';

import SideNav from './SideNav';
import './SideNav.story.scss';

const { iotPrefix } = settings;

React.Fragment = ({ children }) => children;

const RouterComponent = ({ children, ...rest }) => <div {...rest}>{children}</div>;

const links = (isActive = false) => [
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
    icon: Chip24,
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
    icon: Dashboard24,
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
    icon: Group24,
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
        isActive,
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
        <Group24
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
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

export const SideNavComponent = () => {
  const showDeepNesting = boolean('show deep nesting example', false);
  const deepLinks = [
    ...links(),
    {
      isEnabled: true,
      icon: ParentChild24,
      metaData: {
        label: 'Nested Levels',
        element: 'button',
      },
      linkContent: 'Nested Levels',
      childContent: [
        {
          metaData: {
            label: 'Co-Parent Link',
            title: 'Co-Parent Link',
            element: 'a',
            href: 'https://www.ibm.com',
          },
          content: 'Co-Parent Link',
        },
        {
          metaData: {
            label: 'Parent',
            title: 'Parent',
            element: 'button',
          },
          content: 'Parent',
          linkContent: 'Parent',
          childContent: [
            {
              metaData: {
                label: 'Sibling 1 Link',
                title: 'Sibling 1 Link',
                element: 'a',
                href: 'https://www.ibm.com',
              },
              content: 'Sibling 1 Link',
            },
            {
              isEnabled: true,
              metaData: {
                label: 'Child',
                element: 'button',
              },
              linkContent: 'Child',
              childContent: [
                {
                  metaData: {
                    label: 'Grandchild Button',
                    title: 'Grandchild Button',
                    onClick: action('grandchild-button'),
                    element: 'button',
                  },
                  content: 'Grandchild Button',
                  isActive: true,
                },
                {
                  metaData: {
                    label: 'Grandchild Link',
                    title: 'Grandchild Link',
                    href: 'https://www.ibm.com',
                    element: 'a',
                  },
                  content: 'Grandchild Link',
                },
              ],
            },
            {
              metaData: {
                label: 'Sibling 2 Button',
                title: 'Sibling 2 Button',
                element: 'button',
                onClick: action('sibling-2-click'),
              },
              content: 'Sibling 2 Button',
            },
          ],
        },
        {
          metaData: {
            label: 'Co-Parent Button',
            title: 'Co-Parent Button',
            element: 'button',
            onClick: action('co-parent-click'),
          },
          content: 'Co-Parent Button',
        },
      ],
    },
  ];

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
            <SideNav
              links={showDeepNesting ? deepLinks : links(true)}
              isSideNavExpanded={isSideNavExpanded}
            />
            <div className={`${iotPrefix}--main-content`}>
              <PageTitleBar title="Title" description="Description" />
            </div>
          </>
        )}
      />
    </FullWidthWrapper>
  );
};

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
        icon: Dashboard24,
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
        icon: Group24,
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
