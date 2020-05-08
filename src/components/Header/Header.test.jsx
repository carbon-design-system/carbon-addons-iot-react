import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Avatar from '@carbon/icons-react/lib/user--avatar/20';
import HeaderHelp from '@carbon/icons-react/lib/help/20';
import '@testing-library/jest-dom/extend-expect';

import { keyCodes } from '../../constants/KeyCodeConstants';

import Header, { APP_SWITCHER } from './Header';

React.Fragment = ({ children }) => children;

describe('Header testcases', () => {
  const onClick = jest.fn();
  const HeaderProps = {
    user: 'JohnDoe@ibm.com',
    tenant: 'TenantId: Acme',
    url: 'http://localhost:8989',
    className: 'custom-class-name',
    appName: 'Watson IoT Platform ',
    skipto: 'skip',
    actionItems: [
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
            onCLick: () => console.log('hi'),
            content: <p>This is a link</p>,
          },
          {
            onCLick: () => console.log('hi'),
            content: (
              <React.Fragment>
                <span>
                  JohnDoe@ibm.com
                  <Avatar fill="white" description="Icon" />
                </span>
              </React.Fragment>
            ),
          },
        ],
      },
      {
        label: 'user',
        btnContent: <Avatar fill="white" description="Icon" />,
        menuLinkName: 'a menu link name',
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
              onClick,
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

  const HeaderPropsWithoutOnClick = {
    user: 'JohnDoe@ibm.com',
    tenant: 'TenantId: Acme',
    url: 'http://localhost:8989',
    className: 'custom-class-name',
    appName: 'Watson IoT Platform ',
    skipto: 'skip',
    actionItems: [
      {
        label: 'user',
        onCLick: undefined,
        btnContent: <Avatar fill="white" description="Icon" />,
      },
    ],
  };

  it('should render', () => {
    const { container } = render(<Header {...HeaderProps} />);
    expect(container).toMatchSnapshot();
  });

  it('sidepanel should not render', () => {
    const { queryByLabelText } = render(<Header {...HeaderProps} />);
    expect(queryByLabelText(APP_SWITCHER)).toBeFalsy();
  });

  it('sidepanel should render', () => {
    const headerPanel = {
      className: 'header-panel',

      content: React.forwardRef((props, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" ref={ref} {...props}>
          Header panel content
        </a>
      )),
    };
    const { queryAllByLabelText } = render(<Header {...HeaderProps} headerPanel={headerPanel} />);
    expect(queryAllByLabelText(APP_SWITCHER).length).toBeGreaterThan(0);
  });

  it('children should render inside UL', () => {
    const { getByText } = render(<Header {...HeaderProps} />);
    expect(getByText('This is a link').parentElement.parentElement.nodeName).toBe('LI');
    expect(getByText('This is a link').parentElement.parentElement.className).toEqual(
      'action-btn__headerpanel-li'
    );
    expect(
      getByText('This is a link').parentElement.parentElement.parentNode.childElementCount
    ).toEqual(2);
  });

  it('clicking trigger button should expand the header panel', () => {
    const { getByTitle } = render(<Header {...HeaderProps} />);
    fireEvent.click(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded action-btn__headerpanel'
    );
    fireEvent.click(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('closes when focus leaves panel', () => {
    const { getByTitle, getByText } = render(<Header {...HeaderProps} />);
    fireEvent.click(getByTitle('help'));
    fireEvent.focus(getByText('This is a link'));
    fireEvent.blur(getByText('This is a link'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('closes when focus leaves trigger', () => {
    const { getByTitle } = render(<Header {...HeaderProps} />);
    fireEvent.click(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded action-btn__headerpanel'
    );
    fireEvent.blur(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('closes when focus leaves the current action', () => {
    const { getByTitle } = render(<Header {...HeaderProps} />);

    fireEvent.click(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded action-btn__headerpanel'
    );
    // focus leaves the first button
    fireEvent.blur(getByTitle('help'));
    expect(getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('App switcher opens', () => {
    const headerPanel = {
      className: 'header-panel',
      // eslint-disable-next-line react/no-multi-comp
      content: React.forwardRef((props, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" ref={ref} {...props}>
          Header panel content
        </a>
      )),
    };
    const { getByTitle } = render(<Header {...HeaderProps} headerPanel={headerPanel} />);

    fireEvent.click(getByTitle(APP_SWITCHER));
    expect(getByTitle(APP_SWITCHER).parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded bx--app-switcher'
    );

    fireEvent.click(getByTitle(APP_SWITCHER));
    expect(getByTitle(APP_SWITCHER).parentNode.lastChild.className).toContain(
      'bx--header-panel bx--app-switcher'
    );
  });

  it('onClick expands', () => {
    const headerPanel = {
      className: 'header-panel',
      // eslint-disable-next-line react/no-multi-comp
      content: React.forwardRef((props, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" ref={ref} {...props}>
          Header panel content
        </a>
      )),
    };
    const { getByTestId } = render(<Header {...HeaderProps} headerPanel={headerPanel} />);

    const menuItem = getByTestId('menuitem');
    fireEvent.click(menuItem);
    expect(menuItem.getAttribute('aria-expanded')).toBeTruthy();
  });

  it('onKeyDown expands with enter', () => {
    const headerPanel = {
      className: 'header-panel',
      // eslint-disable-next-line react/no-multi-comp
      content: React.forwardRef((props, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" ref={ref} {...props}>
          Header panel content
        </a>
      )),
    };
    const { getByTestId } = render(<Header {...HeaderProps} headerPanel={headerPanel} />);
    const menuTrigger = getByTestId('menuitem');
    fireEvent.keyDown(menuTrigger, { keyCode: keyCodes.ENTER });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(menuTrigger, { keyCode: keyCodes.SPACE });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('onKeyDown expands with space', () => {
    const headerPanel = {
      className: 'header-panel',
      // eslint-disable-next-line react/no-multi-comp
      content: React.forwardRef((props, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" ref={ref} {...props}>
          Header panel content
        </a>
      )),
    };
    const { getByTitle } = render(<Header {...HeaderProps} headerPanel={headerPanel} />);
    const menuTrigger = getByTitle('help');
    fireEvent.keyDown(menuTrigger, { keyCode: keyCodes.SPACE });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(menuTrigger, { keyCode: keyCodes.SPACE });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('onKeyDown esc on parent closes an open menu', () => {
    const headerPanel = {
      className: 'header-panel',
      // eslint-disable-next-line react/no-multi-comp
      content: React.forwardRef((props, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href="#" ref={ref} {...props}>
          Header panel content
        </a>
      )),
    };
    const { getByTestId, getByRole } = render(
      <Header {...HeaderProps} headerPanel={headerPanel} />
    );
    const menuParent = getByRole('menu');
    const menuTrigger = getByTestId('menuitem');
    fireEvent.keyDown(menuTrigger, { keyCode: keyCodes.ENTER });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(menuParent, { keyCode: keyCodes.ESCAPE });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('onClick event on empty onClick prop', () => {
    const { getByLabelText } = render(<Header {...HeaderPropsWithoutOnClick} />);
    const menuItem = getByLabelText('user');
    fireEvent.click(menuItem);
    expect(getByLabelText('user')).toBeTruthy();
  });
});
