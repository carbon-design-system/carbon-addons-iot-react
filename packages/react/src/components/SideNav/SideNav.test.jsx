import React from 'react';
import { Switcher24, Chip24, Group24, ParentChild24 } from '@carbon/icons-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import SideNav from './SideNav';

const { prefix, iotPrefix } = settings;

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

  it('should render nested levels of children', () => {
    const onClick = jest.fn();
    render(
      <SideNav
        {...mockProps}
        links={[
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
                          onClick,
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
                      onClick,
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
                  onClick,
                },
                content: 'Co-Parent Button',
              },
            ],
          },
        ]}
      />
    );

    const expectToBeVisible = (text) => {
      expect(screen.getByText(text)).toBeVisible();
    };

    const clickText = (text) => {
      userEvent.click(screen.getByText(text));
    };

    const expectToBeActive = (text) => {
      expect(screen.getByText(text).closest(`.${prefix}--side-nav__item`)).toHaveClass(
        `${prefix}--side-nav__item--active`
      );
    };

    const expectToHaveDepth = (text, depth) => {
      expect(screen.getByText(text).closest(`.${prefix}--side-nav__item`)).toHaveClass(
        `${iotPrefix}--side-nav__item--depth-${depth}`
      );
    };

    expectToBeVisible('Nested Levels');
    expectToBeActive('Nested Levels');
    expectToHaveDepth('Nested Levels', 0);

    clickText('Nested Levels');
    expectToBeVisible('Co-Parent Link');
    expectToBeVisible('Parent');
    expectToBeVisible('Co-Parent Button');
    clickText('Co-Parent Button');
    expect(onClick).toHaveBeenCalledTimes(1);
    expectToBeActive('Parent');
    expectToHaveDepth('Parent', 1);

    clickText('Parent');
    expectToBeVisible('Sibling 1 Link');
    expectToBeVisible('Child');
    expectToBeVisible('Sibling 2 Button');
    clickText('Sibling 2 Button');
    expect(onClick).toHaveBeenCalledTimes(2);
    expectToBeActive('Child');
    expectToHaveDepth('Child', 2);

    clickText('Child');
    expectToBeVisible('Grandchild Button');
    expectToBeVisible('Grandchild Link');
    clickText('Grandchild Button');
    expect(onClick).toHaveBeenCalledTimes(3);
  });
});
