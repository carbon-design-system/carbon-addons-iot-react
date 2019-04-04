import React from 'react';
import { mount } from 'enzyme';
import { HeaderMenuItem } from 'carbon-components-react/lib/components/UIShell';

import HeaderMenu from './HeaderMenu';

React.Fragment = ({ children }) => children;

describe('HeaderMenu testcases', () => {
  // it.skip('skip this', () => {});
  let mountNode;
  let mockProps;

  beforeEach(() => {
    mountNode = document.createElement('div');
    mockProps = {
      'aria-label': 'Accessibility label',
      className: 'custom-class',
      // We use `ref` instead of `focusRef` becase `HeaderMenu` forwards the ref
      // to the underlying menu button
      ref: jest.fn(),
      tabIndex: -1,
    };

    document.body.appendChild(mountNode);
  });

  afterEach(() => {
    mountNode.parentNode.removeChild(mountNode);
  });

  it('should render', () => {
    const headerMenu = mount(
      <HeaderMenu {...mockProps}>
        <HeaderMenuItem href="/a">A</HeaderMenuItem>
        <HeaderMenuItem href="/b">B</HeaderMenuItem>
        <HeaderMenuItem href="/c">C</HeaderMenuItem>
      </HeaderMenu>,
      {
        attachTo: mountNode,
      }
    );
    expect(headerMenu).toMatchSnapshot();
  });

  it('should render aria-label', () => {
    const wrapper = mount(
      <HeaderMenu {...mockProps}>
        <HeaderMenuItem href="/a">A</HeaderMenuItem>
        <HeaderMenuItem href="/b">B</HeaderMenuItem>
        <HeaderMenuItem href="/c">C</HeaderMenuItem>
      </HeaderMenu>,
      {
        attachTo: mountNode,
      }
    );

    const headerMenu = wrapper.childAt(0);
    const headerMenuText = headerMenu.find('.bx--header__menu-title').text();

    expect(headerMenuText).toMatch('Accessibility label');
  });

  it('should render content prop', () => {
    const wrapper = mount(
      <HeaderMenu content={<p>Some other text</p>} {...mockProps}>
        <HeaderMenuItem href="/a">A</HeaderMenuItem>
        <HeaderMenuItem href="/b">B</HeaderMenuItem>
        <HeaderMenuItem href="/c">C</HeaderMenuItem>
      </HeaderMenu>,
      {
        attachTo: mountNode,
      }
    );

    const headerMenu = wrapper.childAt(0);
    const headerMenuAnchorChildText = headerMenu
      .find('.bx--header__menu-title')
      .childAt(0)
      .text();
    const headerMenuText = headerMenu.find('.bx--header__menu-title').text();

    expect(headerMenuText).not.toMatch('Accessibility label');
    expect(headerMenuAnchorChildText).toMatch('Some other text');
  });

  test('item click and keyboard interactions', () => {
    const wrapper = mount(
      <HeaderMenu {...mockProps}>
        <HeaderMenuItem href="/a">A</HeaderMenuItem>
        <HeaderMenuItem href="/b">B</HeaderMenuItem>
        <HeaderMenuItem href="/c">C</HeaderMenuItem>
      </HeaderMenu>,
      {
        attachTo: mountNode,
      }
    );
    const headerMenu = wrapper.childAt(0);

    const headerInstance = headerMenu.instance();

    // console.log(`hey I'm the menu link: ${headerMenu.find('.bx--header__menu-title').text()}`);

    // Should start closed
    expect(headerInstance.state.expanded).toEqual(false);

    // Click should open
    headerMenu.simulate('click');
    expect(headerInstance.state.expanded).toEqual(true);

    // blur should close
    headerMenu.simulate('blur');
    expect(headerInstance.state.expanded).toEqual(false);

    // Get first link in the menu
    const menuLink = headerMenu.find('a').first();
    // console.log(`hey I'm the menu link: ${menuLink.debug()}`);

    // After enter should open
    menuLink.simulate('keydown', { key: 'Enter', keyCode: 13, which: 13 });
    expect(headerInstance.state.expanded).toEqual(true);

    // After space should close
    menuLink.simulate('keydown', { key: 'Space', keyCode: 32, which: 32 });
    expect(headerInstance.state.expanded).toEqual(false);

    // After esc should close
    headerMenu.simulate('click');
    menuLink.simulate('keydown', { key: 'Escape', keyCode: 27, which: 27 });
    expect(headerInstance.state.expanded).toEqual(false);
  });
});
