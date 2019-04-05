import React from 'react';
import { mount, render } from 'enzyme';
import AppSwitcher from '@carbon/icons-react/lib/app-switcher/24';
import Chip from '@carbon/icons-react/lib/chip/24';
import Group from '@carbon/icons-react/lib/group/24';

import SideNav from './SideNav';
import CarbonSideNav from './CarbonSideNav';

React.Fragment = ({ children }) => children;

describe('SideNav testcases', () => {
  // it.skip('skip this suite', () => {});
  /* eslint-disable */
  const links = [
    {
      label: 'Boards',
      icon: (
        <AppSwitcher
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      onClick: jest.fn(),
      href: 'javascript:void(0)',
      linkContent: 'Boards',
    },
    {
      current: true,
      label: 'Devices',
      icon: (
        <Chip
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      onClick: null,
      href: 'javascript:void(0)',
      linkContent: 'Devices',
    },
    {
      label: 'Members',
      icon: (
        <Group
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      onClick: null,
      href: 'javascript:void(0)',
      linkContent: 'Members',
      childContent: [
        {
          onClick: jest.fn(),
          href: 'javascript:void(0)',
          content: 'Yet another link',
        },
      ],
    },
  ];

  const links2 = [
    {
      label: 'Boards',
      icon: (
        <AppSwitcher
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      onClick: jest.fn(),
      href: 'javascript:void(0)',
      linkContent: 'Boards',
    },
  ];
  /* eslint-enable */
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
    expect(wrapper).toMatchSnapshot();
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
    expect(wrapper).toMatchSnapshot();
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

  // @TODO: Soon to be carbon Test- can remove when Carbon supports these features

  it('should be collapsed by default', () => {
    const wrapper = mount(<CarbonSideNav {...mockProps} />);
    expect(wrapper.state('isExpanded')).toBe(false);
  });

  it('should be expanded by default', () => {
    const wrapper = mount(<CarbonSideNav {...mockProps} defaultExpanded />);
    expect(wrapper.state('isExpanded')).toBe(true);
  });

  it('Blur event should trigger a state update of isFocused', () => {
    const wrapper = mount(<CarbonSideNav {...mockProps} />);
    wrapper.simulate('focus');
    expect(wrapper.state('isFocused')).toBe(true);
    wrapper.simulate('blur');
    expect(wrapper.state('isFocused')).toBe(false);
  });

  it('Focus event should trigger a state update of isFocused', () => {
    const wrapper = mount(<CarbonSideNav {...mockProps} />);
    expect(wrapper.state('isFocused')).toBe(false);
    wrapper.simulate('focus');
    expect(wrapper.state('isFocused')).toBe(true);
  });

  it('clicking on footer causes a change in state for isExpanded', () => {
    const wrapper = mount(<CarbonSideNav {...mockProps} defaultExpanded />);
    wrapper.find('footer button').simulate('click');
    expect(wrapper.state('isExpanded')).toBe(false);
  });
});
