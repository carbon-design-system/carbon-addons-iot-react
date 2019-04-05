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
  /* eslint-enable */
  let mockProps;

  beforeEach(() => {
    mockProps = {
      links,
      'aria-label': 'Side navigation',
    };
  });

  it('should render an a tag', () => {
    const wrapper = mount(<SideNav {...mockProps} />);
    expect(wrapper).toMatchSnapshot();
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

  it('should render an button tag', () => {
    const wrapper = mount(<SideNav {...mockProps} />);
    expect(wrapper).toMatchSnapshot();
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

  it('should be collapsed by default', () => {
    const wrapper = mount(<CarbonSideNav {...mockProps} />);
    expect(wrapper.state('isExpanded')).toBe(false);
  });

  it('should be expanded by default', () => {
    const wrapper = mount(<CarbonSideNav {...mockProps} defaultExpanded />);
    expect(wrapper.state('isExpanded')).toBe(true);
  });
});
