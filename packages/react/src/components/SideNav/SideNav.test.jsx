import React from 'react';
import { Switcher24, Chip24, Group24 } from '@carbon/icons-react';
import { render, screen } from '@testing-library/react';

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
            label: 'Members sub menu',
            onClick: jest.fn(),
            element: 'button',
          },
          content: 'Members sub menu',
          isActive: true,
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

  it('should be selectable by testId', () => {
    render(<SideNav {...mockProps} testId="side_nav" />);
    expect(screen.getByTestId('side_nav')).toBeDefined();
    expect(screen.getByTestId('side_nav-link-0')).toBeDefined();
    expect(screen.getByTestId('side_nav-menu-item-2')).toBeDefined();
  });

  it('should render two levels of navigation links', () => {
    const { container } = render(<SideNav {...mockProps} />);
    expect(container.querySelectorAll('ul')).toHaveLength(2);
  });

  it('should render an button tag for a subNav', () => {
    render(<SideNav {...mockProps} />);
    expect(screen.getByTestId('side-nav-menu-item-2').nodeName).toEqual('BUTTON');
  });

  it('should render one level of navigation links', () => {
    mockProps = {
      links: links2,
      'aria-label': 'Side navigation',
    };
    const { container } = render(<SideNav {...mockProps} />);
    expect(container.querySelectorAll('ul')).toHaveLength(1);
  });

  it('should still render an a tag', () => {
    mockProps = {
      links: links2,
      'aria-label': 'Side navigation',
    };
    render(<SideNav {...mockProps} />);
    expect(screen.getByLabelText('Boards').nodeName).toEqual('A');
  });

  it('should not render a subNav or its button', () => {
    mockProps = {
      links: links2,
      'aria-label': 'Side navigation',
    };
    render(<SideNav {...mockProps} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('disabled item should not render', () => {
    mockProps = {
      links: linksDisabled,
    };
    render(<SideNav {...mockProps} />);
    expect(screen.queryByText('Boards')).toBeNull();
    expect(screen.queryByText('Devices')).toBeDefined();
    expect(screen.queryByText('Members')).toBeDefined();
  });

  it('parent item with active child should be active', () => {
    render(<SideNav {...mockProps} />);
    expect(screen.getByText('Members').closest('li')).toHaveClass('bx--side-nav__item--active');
  });
});
