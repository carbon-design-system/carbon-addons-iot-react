import React from 'react';
import { mount } from 'enzyme';
import { HeaderMenuItem } from 'carbon-components-react/lib/components/UIShell';
import { render, fireEvent } from '@testing-library/react';

import HeaderMenu, { matches, keys } from './HeaderMenu';

const event = {
  which: 13,
};

describe('HeaderMenu', () => {
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
  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
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
    const menuContent = () => <p>Some other text</p>;
    const wrapper = mount(
      <HeaderMenu renderMenuContent={menuContent} {...mockProps}>
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

  it('should match', () => {
    expect(matches(event, [keys.ENTER, keys.SPACE])).toEqual(true);
  });

  test('renders in action bar', () => {
    const menuContent = () => <p>Some other text</p>;
    const { getByText } = render(
      <HeaderMenu renderMenuContent={menuContent} isMenu={false} {...mockProps}>
        <HeaderMenuItem href="/a">A</HeaderMenuItem>
        <HeaderMenuItem href="/b">B</HeaderMenuItem>
        <HeaderMenuItem href="/c">C</HeaderMenuItem>
      </HeaderMenu>
    );
    expect(getByText('Some other text')).toBeDefined();
  });

  test('onClick expands', () => {
    const menuContent = () => <p>Some other text</p>;
    const { getAllByRole } = render(
      <HeaderMenu renderMenuContent={menuContent} {...mockProps}>
        <HeaderMenuItem href="/a">A</HeaderMenuItem>
        <HeaderMenuItem href="/b">B</HeaderMenuItem>
        <HeaderMenuItem href="/c">C</HeaderMenuItem>
      </HeaderMenu>
    );
    const menuTrigger = getAllByRole('menuitem')[0];
    fireEvent.click(menuTrigger);
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('true');
  });

  test('onKeyDown expands with enter or space', () => {
    const menuContent = () => <p>Some other text</p>;
    const { getAllByRole } = render(
      <HeaderMenu renderMenuContent={menuContent} {...mockProps}>
        <HeaderMenuItem href="/a">A</HeaderMenuItem>
        <HeaderMenuItem href="/b">B</HeaderMenuItem>
        <HeaderMenuItem href="/c">C</HeaderMenuItem>
      </HeaderMenu>
    );
    const menuTrigger = getAllByRole('menuitem')[0];
    fireEvent.keyDown(menuTrigger, { keyCode: keys.ENTER });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(menuTrigger, { keyCode: keys.SPACE });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('false');
  });

  test('onKeyDown esc on parent closes an open menu', () => {
    const menuContent = () => <p>Some other text</p>;
    const { getByRole, getAllByRole } = render(
      <HeaderMenu renderMenuContent={menuContent} {...mockProps}>
        <HeaderMenuItem href="/a">A</HeaderMenuItem>
        <HeaderMenuItem href="/b">B</HeaderMenuItem>
        <HeaderMenuItem href="/c">C</HeaderMenuItem>
      </HeaderMenu>
    );
    const menuParent = getByRole('listitem');
    const menuTrigger = getAllByRole('menuitem')[0];
    fireEvent.keyDown(menuTrigger, { keyCode: keys.ENTER });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(menuParent, { keyCode: keys.ESC });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('false');
  });
});
