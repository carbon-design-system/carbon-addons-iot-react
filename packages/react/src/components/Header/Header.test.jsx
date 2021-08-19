import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { User20, Help20, Checkbox16 } from '@carbon/icons-react';
import userEvent from '@testing-library/user-event';

import { keyCodes } from '../../constants/KeyCodeConstants';

import Header, { APP_SWITCHER } from './Header';

React.Fragment = ({ children }) => children;

describe('Header', () => {
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
          <Help20
            fill="white"
            description="Icon"
            className="bx--header__menu-item bx--header__menu-title"
          />
        ),
        childContent: [
          {
            onClick: jest.fn(),
            content: <p>This is a link</p>,
          },
          {
            onClick: jest.fn(),
            content: (
              <React.Fragment>
                <span>
                  JohnDoe@ibm.com
                  <User20 fill="white" description="Icon" />
                </span>
              </React.Fragment>
            ),
          },
        ],
      },
      {
        label: 'user',
        btnContent: <User20 fill="white" description="Icon" />,
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
                <User20 fill="white" description="Icon" />
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
        onClick: undefined,
        btnContent: <User20 fill="white" description="Icon" />,
      },
    ],
  };

  it('should be selectable by testId', () => {
    render(<Header {...HeaderProps} hasSideNav testId="__header__" />);
    expect(screen.getByTestId('__header__')).toBeDefined();
    expect(screen.getByTestId('__header__-menu-button')).toBeDefined();
    expect(screen.getByTestId('__header__-name')).toBeDefined();
    expect(screen.getByTestId('__header__-action-group')).toBeDefined();
  });

  it('should render', () => {
    const { container } = render(<Header {...HeaderProps} />);
    expect(container).toMatchSnapshot();
  });

  it('sidepanel should not render', () => {
    render(<Header {...HeaderProps} />);
    expect(screen.queryByLabelText(APP_SWITCHER)).toBeFalsy();
  });

  it('sidepanel should render', () => {
    const headerPanel = {
      className: 'header-panel',

      content: React.forwardRef((props, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <button ref={ref} type="button" {...props}>
          Header panel content
        </button>
      )),
    };
    render(<Header {...HeaderProps} headerPanel={headerPanel} />);
    expect(screen.queryAllByLabelText(APP_SWITCHER).length).toBeGreaterThan(0);
  });

  it('children should render inside UL', () => {
    render(<Header {...HeaderProps} />);
    expect(screen.getByText('This is a link').parentElement.parentElement.nodeName).toBe('LI');
    expect(screen.getByText('This is a link').parentElement.parentElement.className).toEqual(
      'action-btn__headerpanel-li'
    );
    expect(
      screen.getByText('This is a link').parentElement.parentElement.parentNode.childElementCount
    ).toEqual(2);
  });

  it('clicking trigger button should expand the header panel', () => {
    render(<Header {...HeaderProps} />);
    fireEvent.click(screen.getByTitle('help'));
    expect(screen.getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded action-btn__headerpanel'
    );
    fireEvent.click(screen.getByTitle('help'));
    expect(screen.getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('closes when focus leaves panel', () => {
    render(<Header {...HeaderProps} />);
    fireEvent.click(screen.getByTitle('help'));
    fireEvent.focus(screen.getByText('This is a link'));
    fireEvent.blur(screen.getByText('This is a link'));
    expect(screen.getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('closes when focus leaves trigger', () => {
    render(<Header {...HeaderProps} />);
    fireEvent.click(screen.getByTitle('help'));
    expect(screen.getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded action-btn__headerpanel'
    );
    fireEvent.blur(screen.getByTitle('help'));
    expect(screen.getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('closes when focus leaves the current action', () => {
    render(<Header {...HeaderProps} />);

    fireEvent.click(screen.getByTitle('help'));
    expect(screen.getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded action-btn__headerpanel'
    );
    // focus leaves the first button
    fireEvent.blur(screen.getByTitle('help'));
    expect(screen.getByTitle('help').parentNode.lastChild.className).toContain(
      'bx--header-panel action-btn__headerpanel action-btn__headerpanel--closed'
    );
  });

  it('App switcher opens', () => {
    const headerPanel = {
      className: 'header-panel',
      // eslint-disable-next-line react/no-multi-comp
      content: React.forwardRef((props, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <button ref={ref} type="button" {...props}>
          Header panel content
        </button>
      )),
    };
    render(<Header {...HeaderProps} headerPanel={headerPanel} />);

    fireEvent.click(screen.getByTitle(APP_SWITCHER));
    expect(screen.getByTitle(APP_SWITCHER).parentNode.lastChild.className).toContain(
      'bx--header-panel bx--header-panel--expanded bx--app-switcher'
    );

    fireEvent.click(screen.getByTitle(APP_SWITCHER));
    expect(screen.getByTitle(APP_SWITCHER).parentNode.lastChild.className).toContain(
      'bx--header-panel bx--app-switcher'
    );
  });

  it('onClick expands', () => {
    const headerPanel = {
      className: 'header-panel',
      // eslint-disable-next-line react/no-multi-comp
      content: React.forwardRef((props, ref) => (
        <button type="button" ref={ref} {...props}>
          Header panel content
        </button>
      )),
    };
    render(<Header {...HeaderProps} headerPanel={headerPanel} />);

    const menuItem = screen.getByTestId('menuitem');
    fireEvent.click(menuItem);
    expect(menuItem.getAttribute('aria-expanded')).toBeTruthy();
  });

  it('onKeyDown expands with enter', () => {
    const headerPanel = {
      className: 'header-panel',
      // eslint-disable-next-line react/no-multi-comp
      content: React.forwardRef((props, ref) => (
        <button type="button" ref={ref} {...props}>
          Header panel content
        </button>
      )),
    };
    render(<Header {...HeaderProps} headerPanel={headerPanel} />);
    const menuTrigger = screen.getByTestId('menuitem');
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
        <button type="button" ref={ref} {...props}>
          Header panel content
        </button>
      )),
    };
    render(<Header {...HeaderProps} headerPanel={headerPanel} />);
    const menuTrigger = screen.getByTitle('help');
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
        <button type="button" ref={ref} {...props}>
          Header panel content
        </button>
      )),
    };
    render(<Header {...HeaderProps} headerPanel={headerPanel} />);
    const menuParent = screen.getByRole('menu');
    const menuTrigger = screen.getByTestId('menuitem');
    fireEvent.keyDown(menuTrigger, { keyCode: keyCodes.ENTER });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(menuParent, { keyCode: keyCodes.ESCAPE });
    expect(menuTrigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('onClick event on empty onClick prop', () => {
    render(<Header {...HeaderPropsWithoutOnClick} />);
    const menuItem = screen.getByLabelText('user');
    fireEvent.click(menuItem);
    expect(screen.getByLabelText('user')).toBeTruthy();
  });

  it('should move icons into overflow menu when area too small', () => {
    jest.useFakeTimers();
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    const originalBounding = Element.prototype.getBoundingClientRect;
    // first we make sure right is higher than window width on the prototype
    // this ensure the checks in the header trigger the overflow menu to be present.
    Element.prototype.getBoundingClientRect = () => {
      return {
        right: 400,
        left: 390,
      };
    };
    render(
      <Header
        {...HeaderProps}
        actionItems={[
          {
            label: 'Announcements',
            onClick: jest.fn(),
            btnContent: <Checkbox16 fill="white" description="Announcements" />,
          },
          {
            label: 'Custom icon 1',
            onClick: jest.fn(),
            btnContent: <Checkbox16 fill="white" description="icon" />,
          },
          {
            label: 'Custom icon 2',
            onClick: jest.fn(),
            btnContent: <Checkbox16 fill="white" description="icon" />,
          },
          {
            label: 'Custom icon 3',
            onClick: jest.fn(),
            btnContent: <Checkbox16 fill="white" description="icon" />,
          },
          ...HeaderProps.actionItems,
        ]}
        shortAppName="Watson"
        subtitle="Manage"
      />
    );
    const overflowMenuButton = screen.getByLabelText('open and close list of options');
    expect(overflowMenuButton).toBeVisible();
    // Then update the prototype again to return the dimensions of the overflow button
    // and the menu when it's open
    Element.prototype.getBoundingClientRect = () => {
      return {
        bottom: 328,
        height: 280,
        left: 215,
        right: 375,
        top: 48,
        width: 160,
        x: 215,
        y: 48,
      };
    };
    overflowMenuButton.getBoundingClientRect = () => {
      return {
        bottom: 48,
        height: 48,
        left: 327,
        right: 375,
        top: 0,
        width: 48,
        x: 327,
        y: 0,
      };
    };
    overflowMenuButton.closest('[data-floating-menu-container]').getBoundingClientRect = () => {
      return {
        bottom: 48,
        height: 48,
        left: 327,
        right: 375,
        top: 0,
        width: 48,
        x: 327,
        y: 0,
      };
    };
    act(() => {
      userEvent.click(overflowMenuButton);
      jest.runAllTimers();
    });
    expect(screen.getByText('Watson')).toBeVisible();
    expect(screen.getByText('Custom icon 1')).toBeVisible();
    userEvent.click(screen.getByRole('menuitem', { name: 'help' }));
    expect(screen.getByText('This is a link')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'help' }));
    expect(screen.queryByText('Custom icon 1')).toBeNull();
    userEvent.click(screen.getByLabelText('open and close list of options'));
    expect(screen.getByText('Custom icon 1')).toBeVisible();
    userEvent.click(screen.getAllByLabelText('open and close list of options')[0]);
    expect(screen.queryByText('Custom icon 1')).toBeNull();
    act(() => {
      userEvent.click(screen.getByLabelText('Open menu', { selector: 'svg' }));
      jest.runAllTimers();
    });
    expect(screen.getByText('Watson')).toBeVisible();
    expect(screen.getByText('Custom icon 1')).toBeVisible();
    HTMLElement.prototype.getBoundingClientRect = originalBounding;
    window.innerWidth = originalWidth;
    jest.useRealTimers();
  });
});
