import React from 'react';
import { mount, render } from 'enzyme';
import { Switcher24, Chip24, Group24 } from '@carbon/icons-react';

import SideNav from './SideNav';

React.Fragment = ({ children }) => children;

describe('SideNav', () => {
  const links = [
    {
      icon: () => (
        <Switcher24
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      isEnabled: true,
      metaData: {
        onClick: jest.fn(),
        tabIndex: 0,
        label: 'Boards',
        element: 'a',
      },
      linkContent: 'Boards',
    },
    {
      current: true,
      isEnabled: true,
      icon: () => (
        <Chip24
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
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
      icon: () => (
        <Group24
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      metaData: {
        label: 'Members',
        element: 'button',
      },
      linkContent: 'Members',
      childContent: [
        {
          metaData: {
            label: 'Devices',
            onClick: jest.fn(),
            element: 'button',
          },
          content: 'Yet another link',
        },
      ],
    },
  ];

  const links2 = [
    {
      icon: () => (
        <Switcher24
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      isEnabled: true,
      metaData: {
        onClick: jest.fn(),
        tabIndex: 0,
        label: 'Boards',
        element: 'a',
      },
      linkContent: 'Boards',
    },
  ];

  const linksDisabled = [
    {
      icon: () => (
        <Switcher24
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      isEnabled: false,
      metaData: {
        onClick: jest.fn(),
        tabIndex: 0,
        label: 'Boards',
        element: 'a',
      },
      linkContent: 'Boards',
    },
    {
      current: true,
      isEnabled: true,
      icon: () => (
        <Chip24
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
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
      icon: () => (
        <Group24
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      metaData: {
        label: 'Members',
        element: 'button',
      },
      linkContent: 'Members',
    },
  ];

  let mockProps;

  beforeEach(() => {
    mockProps = {
      links,
      'aria-label': 'Side navigation',
    };
  });

  it('should render two levels of navigation links', () => {
    const wrapper = mount(<SideNav {...mockProps} />);
    expect(render(wrapper.find('ul'))).toHaveLength(2);
  });

  it('should render an button tag for a subNav', () => {
    const wrapper = mount(<SideNav {...mockProps} />);
    expect(
      render(
        wrapper
          .find('ul')
          .first()
          .childAt(2)
      )
        .children()
        .first()[0].name
    ).toEqual('button');
  });

  it('should render one level of navigation links', () => {
    mockProps = {
      links: links2,
      'aria-label': 'Side navigation',
    };
    const wrapper = mount(<SideNav {...mockProps} />);
    expect(render(wrapper.find('ul'))).toHaveLength(1);
  });

  it('should still render an a tag', () => {
    mockProps = {
      links: links2,
      'aria-label': 'Side navigation',
    };
    const wrapper = mount(<SideNav {...mockProps} />);

    expect(
      render(
        wrapper
          .find('ul')
          .first()
          .childAt(0)
      )
        .children()
        .first()[0].name
    ).toEqual('a');
  });

  it('should not render a subNav or its button', () => {
    mockProps = {
      links: links2,
      'aria-label': 'Side navigation',
    };
    const wrapper = mount(<SideNav {...mockProps} />);
    expect(
      render(
        wrapper
          .find('ul')
          .first()
          .childAt(2)
      )
        .children()
        .first()[0].name
    ).not.toEqual('button');
  });

  it('disabled item', () => {
    mockProps = {
      links: linksDisabled,
    };
    const wrapper = mount(<SideNav {...mockProps} />);
    expect(wrapper.find('SideNavLink')).toHaveLength(2);
  });
});
