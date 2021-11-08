import { act, render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import Chip from '@carbon/icons-react/es/chip/24';

import { settings } from '../../constants/Settings';

import SuiteHeader from './SuiteHeader';
import SuiteHeaderI18N from './i18n';

const { prefix } = settings;

const commonProps = {
  suiteName: 'Application Suite',
  appName: 'Application Name',
  userDisplayName: 'Admin User',
  username: 'adminuser',
  isAdminView: true,
  onRouteChange: async () => true,
  routes: {
    profile: 'https://www.ibm.com/profile',
    navigator: 'https://www.ibm.com/navigator',
    admin: 'https://www.ibm.com/admin',
    logout: 'https://www.ibm.com/logout',
    logoutInactivity: 'https://www.ibm.com/inactivity',
    whatsNew: 'https://www.ibm.com/whatsnew',
    gettingStarted: 'https://www.ibm.com/gettingstarted',
    documentation: 'https://www.ibm.com/documentation',
    requestEnhancement: 'https://www.ibm.com/request',
    support: 'https://www.ibm.com/support',
    about: 'https://www.ibm.com/about',
  },
  applications: [
    {
      id: 'monitor',
      name: 'Monitor',
      href: 'https://www.ibm.com/monitor',
    },
    {
      id: 'health',
      name: 'Health',
      href: 'https://www.ibm.com/health',
      isExternal: true,
    },
  ],
};

const idleTimeoutDataProp = {
  countdown: 10,
  timeout: 10,
  cookieName: '_user_inactivity_timeout',
};

describe('SuiteHeader', () => {
  let originalWindowLocation;
  let originalWindowDocumentCookie;
  beforeEach(() => {
    jest.useFakeTimers();
    originalWindowLocation = { ...window.location };
    originalWindowDocumentCookie = window.document.cookie;
    delete window.location;
    window.location = { href: '' };
    window.open = jest.fn();
  });

  afterEach(() => {
    window.location = { ...originalWindowLocation };
    window.document.cookie = originalWindowDocumentCookie;
    jest.useRealTimers();
  });

  it('should be selectable with testId', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <SuiteHeader
        {...commonProps}
        sideNavProps={{
          links: [
            {
              isEnabled: true,
              icon: Chip,
              metaData: {
                label: 'Devices',
                href: 'https://google.com',
                element: 'a',
                target: '_blank',
              },
              linkContent: 'Devices',
            },
          ],
        }}
        testId="suite_header"
      />
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: A future version of React will block javascript: URLs as a security precaution.'
      ),
      `"javascript:void(0)"`,
      expect.stringContaining('SuiteHeader')
    );
    console.error.mockReset();
    expect(screen.getByTestId('suite_header')).toBeDefined();
    expect(screen.getByTestId('suite_header-name')).toBeDefined();
    expect(screen.getByTestId('suite_header-menu-button')).toBeDefined();
    expect(screen.getByTestId('suite_header-action-group')).toBeDefined();
    expect(screen.getByTestId('suite_header-app-switcher')).toBeDefined();
    expect(screen.getByTestId('suite_header-logout-modal')).toBeDefined();
    expect(screen.getByTestId('suite_header-profile')).toBeDefined();
  });
  it('renders with sidenav', () => {
    render(
      <SuiteHeader
        {...commonProps}
        sideNavProps={{
          links: [
            {
              isEnabled: true,
              icon: Chip,
              metaData: {
                label: 'Devices',
                href: 'https://google.com',
                element: 'a',
                target: '_blank',
              },
              linkContent: 'Devices',
            },
          ],
        }}
      />
    );
    expect(screen.getByRole('banner', { name: 'main header' })).toBeInTheDocument();
  });
  it('renders with left sidenav toggle button (custom side nav support)', () => {
    const mockOnSideNavToggled = jest.fn();
    render(<SuiteHeader {...commonProps} hasSideNav onSideNavToggled={mockOnSideNavToggled} />);
    expect(screen.getByTitle('Open menu')).toBeInTheDocument();
    userEvent.click(screen.getByTitle('Open menu'));
    expect(mockOnSideNavToggled).toHaveBeenCalled();
  });
  it('opens and closes logout modal', () => {
    render(<SuiteHeader {...commonProps} />);
    expect(screen.getByRole('banner', { name: 'main header' })).toBeInTheDocument();
    userEvent.click(screen.getByTestId('suite-header-profile--logout'));
    expect(screen.getByRole('presentation')).toHaveClass('is-visible');
    userEvent.click(screen.getByLabelText(/close/));
    expect(screen.getByRole('presentation')).not.toHaveClass('is-visible');
  });
  it('clicks logout link', async () => {
    render(<SuiteHeader {...commonProps} />);
    await userEvent.click(screen.getAllByRole('button', { name: 'Log out' })[0]);
    expect(window.location.href).toBe(commonProps.routes.logout);
  });
  it('clicks logout link (but no redirect)', async () => {
    render(<SuiteHeader {...commonProps} onRouteChange={async () => false} />);
    await userEvent.click(screen.getAllByRole('button', { name: 'Log out' })[0]);
    expect(window.location.href).not.toBe(commonProps.routes.logout);
  });
  it('admin link from admin view takes you to navigator route', async () => {
    render(<SuiteHeader {...commonProps} isAdminView />);
    await userEvent.click(screen.getByTestId('admin-icon'));
    expect(window.location.href).toBe(commonProps.routes.navigator);
  });
  it('admin link from admin view takes you to navigator route (but no redirect)', async () => {
    render(<SuiteHeader {...commonProps} onRouteChange={async () => false} isAdminView />);
    await userEvent.click(screen.getByTestId('admin-icon'));
    expect(window.location.href).not.toBe(commonProps.routes.navigator);
  });
  it('admin link from non-admin view takes you to admin route', async () => {
    render(<SuiteHeader {...commonProps} isAdminView={false} />);
    await userEvent.click(screen.getByTestId('admin-icon'));
    expect(window.location.href).toBe(commonProps.routes.admin);
  });
  it('admin link from non-admin view takes you to admin route (but no redirect)', async () => {
    render(<SuiteHeader {...commonProps} onRouteChange={async () => false} isAdminView={false} />);
    await userEvent.click(screen.getByTestId('admin-icon'));
    expect(window.location.href).not.toBe(commonProps.routes.admin);
  });
  it('clicks a documentation link', async () => {
    render(<SuiteHeader {...commonProps} />);
    await userEvent.click(screen.getByTestId('suite-header-help--whatsNew'));
    expect(window.open).toHaveBeenCalledWith(
      commonProps.routes.whatsNew,
      '_blank',
      'noopener noreferrer'
    );
  });
  it('clicks a documentation link (but no redirect)', async () => {
    render(<SuiteHeader {...commonProps} onRouteChange={async () => false} />);
    await userEvent.click(screen.getByTestId('suite-header-help--whatsNew'));
    expect(window.open).not.toHaveBeenCalled();
  });
  it('clicks about link', async () => {
    render(<SuiteHeader {...commonProps} />);
    await userEvent.click(screen.getByTestId('suite-header-help--about'));
    expect(window.location.href).toBe(commonProps.routes.about);
  });
  it('clicks about link (but no redirect)', async () => {
    render(<SuiteHeader {...commonProps} onRouteChange={async () => false} />);
    await userEvent.click(screen.getByTestId('suite-header-help--about'));
    expect(window.open).not.toHaveBeenCalled();
  });
  it('renders all i18n', () => {
    Object.keys(SuiteHeaderI18N).forEach((language) => {
      render(<SuiteHeader {...commonProps} i18n={SuiteHeaderI18N[language]} isAdminView />);
      expect(screen.getByRole('banner', { name: 'main header' })).toBeInTheDocument();
    });
  });
  it('renders all i18n, including props that were functions (backwards compatibility)', () => {
    Object.keys(SuiteHeaderI18N).forEach((language) => {
      render(
        <SuiteHeader
          {...commonProps}
          i18n={{
            ...SuiteHeaderI18N[language],
            surveyTitle: (solutionName) =>
              SuiteHeaderI18N[language].surveyTitle.replace('{solutionName}', solutionName),
            profileLogoutModalBody: (solutionName, userName) =>
              SuiteHeaderI18N[language].profileLogoutModalBody
                .replace('{solutionName}', solutionName)
                .replace('{userName}', userName),
          }}
          isAdminView
        />
      );
      expect(screen.getByRole('banner', { name: 'main header' })).toBeInTheDocument();
    });
  });
  it('user clicks survey link', async () => {
    const surveyLink = 'https://www.ibm.com/';
    const privacyLink = 'https://google.com';
    const surveyData = { surveyLink, privacyLink };
    render(<SuiteHeader {...commonProps} appName={undefined} surveyData={surveyData} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(screen.getByText(SuiteHeader.defaultProps.i18n.surveyText));
    expect(window.open).toHaveBeenCalledWith(surveyLink, '_blank', 'noopener noreferrer');
  });
  it('user clicks survey link (but no redirect)', async () => {
    const surveyLink = 'https://www.ibm.com/';
    const privacyLink = 'https://google.com';
    const surveyData = { surveyLink, privacyLink };
    render(
      <SuiteHeader
        {...commonProps}
        appName={undefined}
        surveyData={surveyData}
        onRouteChange={async () => false}
      />
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(screen.getByText(SuiteHeader.defaultProps.i18n.surveyText));
    expect(window.open).not.toHaveBeenCalled();
  });
  it('user clicks privacy policy link', async () => {
    const surveyLink = 'https://www.ibm.com/';
    const privacyLink = 'https://google.com';
    const surveyData = { surveyLink, privacyLink };
    render(<SuiteHeader {...commonProps} appName={undefined} surveyData={surveyData} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(screen.getByText(SuiteHeader.defaultProps.i18n.surveyPrivacyPolicy));
    expect(window.open).toHaveBeenCalledWith(privacyLink, '_blank', 'noopener noreferrer');
  });
  it('user clicks privacy policy link (but no redirect)', async () => {
    const surveyLink = 'https://www.ibm.com/';
    const privacyLink = 'https://google.com';
    const surveyData = { surveyLink, privacyLink };
    render(
      <SuiteHeader
        {...commonProps}
        appName={undefined}
        surveyData={surveyData}
        onRouteChange={async () => false}
      />
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(screen.getByText(SuiteHeader.defaultProps.i18n.surveyPrivacyPolicy));
    expect(window.open).not.toHaveBeenCalled();
  });
  it('user closes survey notification', () => {
    render(
      <SuiteHeader
        {...commonProps}
        surveyData={{
          surveyLink: 'https://www.ibm.com/',
          privacyLink: 'https://www.ibm.com/',
        }}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'closes notification' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });
  it('active user does not see idle logout confirmation dialog', () => {
    render(<SuiteHeader {...commonProps} idleTimeoutData={idleTimeoutDataProp} />);
    // Simulate a timestamp cookie that is in the future
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${idleTimeoutDataProp.cookieName}=${Date.now() + 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByTestId('idle-logout-confirmation')).not.toHaveClass('is-visible');
  });
  it('inactive user sees idle logout confirmation dialog', () => {
    render(<SuiteHeader {...commonProps} idleTimeoutData={idleTimeoutDataProp} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${idleTimeoutDataProp.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByTestId('idle-logout-confirmation')).toHaveClass('is-visible');
  });
  it('inactive user does not see idle logout confirmation dialog if timeout is set to 0', () => {
    render(
      <SuiteHeader
        {...commonProps}
        idleTimeoutData={{ ...commonProps.idleTimeoutData, timeout: 0 }}
      />
    );
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${idleTimeoutDataProp.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByTestId('idle-logout-confirmation')).not.toHaveClass('is-visible');
  });
  it('clicking Stay Logged In on the idle logout confirmation dialog triggers onStayLoggedIn callback', () => {
    const mockOnStayLoggedIn = jest.fn();
    render(
      <SuiteHeader
        {...commonProps}
        idleTimeoutData={idleTimeoutDataProp}
        onStayLoggedIn={mockOnStayLoggedIn}
      />
    );
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${idleTimeoutDataProp.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    const modalStayLoggedInButton = screen.getByText(
      SuiteHeaderI18N.en.sessionTimeoutModalStayLoggedInButton
    );
    userEvent.click(modalStayLoggedInButton);
    expect(mockOnStayLoggedIn).toHaveBeenCalled();
  });
  it('user clicks Log Out on the idle logout confirmation dialog', async () => {
    render(<SuiteHeader {...commonProps} idleTimeoutData={idleTimeoutDataProp} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${idleTimeoutDataProp.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    const modalLogoutButton = within(screen.getByTestId('idle-logout-confirmation')).getByText(
      SuiteHeaderI18N.en.sessionTimeoutModalLogoutButton
    );
    await userEvent.click(modalLogoutButton);
    expect(window.location.href).toBe(commonProps.routes.logout);
  });
  it('user clicks Log Out on the idle logout confirmation dialog (but no redirect)', async () => {
    render(
      <SuiteHeader
        {...commonProps}
        onRouteChange={async () => false}
        idleTimeoutData={idleTimeoutDataProp}
      />
    );
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${idleTimeoutDataProp.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    const modalLogoutButton = within(screen.getByTestId('idle-logout-confirmation')).getByText(
      SuiteHeaderI18N.en.sessionTimeoutModalLogoutButton
    );
    await userEvent.click(modalLogoutButton);
    expect(window.location.href).not.toBe(commonProps.routes.logout);
  });
  it('idle user waits for the logout confirmation dialog countdown to finish', async () => {
    render(<SuiteHeader {...commonProps} idleTimeoutData={idleTimeoutDataProp} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${idleTimeoutDataProp.cookieName}=${Date.now() - 1000}`,
    });
    await act(async () => {
      await jest.advanceTimersByTime((idleTimeoutDataProp.countdown + 1) * 1000);
    });
    expect(window.location.href).toBe(commonProps.routes.logoutInactivity);
  });
  it('idle user waits for the logout confirmation dialog countdown to finish (but no redirect)', async () => {
    render(
      <SuiteHeader
        {...commonProps}
        onRouteChange={async () => false}
        idleTimeoutData={idleTimeoutDataProp}
      />
    );
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${idleTimeoutDataProp.cookieName}=${Date.now() - 1000}`,
    });
    await act(async () => {
      await jest.advanceTimersByTime((idleTimeoutDataProp.countdown + 1) * 1000);
    });
    expect(window.location.href).not.toBe(commonProps.routes.logoutInactivity);
  });
  it('renders Walkme', async () => {
    render(<SuiteHeader {...commonProps} walkmePath="/some/test/path" walkmeLang="en" />);
    // Make sure the scripts in Walkme component were executed
    await waitFor(() => expect(window._walkmeConfig).toEqual({ smartLoad: true }));
  });

  it('default prop test', async () => {
    jest.spyOn(SuiteHeader.defaultProps, 'onRouteChange');
    jest.spyOn(SuiteHeader.defaultProps, 'onSideNavToggled');
    jest.spyOn(SuiteHeader.defaultProps, 'onStayLoggedIn');
    render(
      <SuiteHeader
        {...commonProps}
        sideNavProps={{
          links: [
            {
              isEnabled: true,
              icon: Chip,
              metaData: {
                label: 'Devices',
                href: 'https://google.com',
                element: 'a',
                target: '_blank',
              },
              linkContent: 'Devices',
            },
          ],
        }}
        idleTimeoutData={idleTimeoutDataProp}
        onRouteChange={undefined}
        onSideNavToggled={undefined}
        onStayLoggedIn={undefined}
      />
    );

    await userEvent.click(screen.getByTitle(`What's new`));
    expect(SuiteHeader.defaultProps.onRouteChange).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(SuiteHeader.defaultProps.onSideNavToggled).toHaveBeenCalled();

    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${idleTimeoutDataProp.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    const modalStayLoggedInButton = screen.getByText(
      SuiteHeaderI18N.en.sessionTimeoutModalStayLoggedInButton
    );
    userEvent.click(modalStayLoggedInButton);
    expect(SuiteHeader.defaultProps.onStayLoggedIn).toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it('function i18n props should fallback to suiteName if appName is not given', async () => {
    const surveyTitle = jest.fn();
    const profileLogoutModalBody = jest.fn();
    render(
      <SuiteHeader
        {...commonProps}
        appName={undefined}
        suiteName="PAL"
        surveyData={{
          surveyLink: 'https://www.ibm.com',
          privacyLink: 'https://www.ibm.com',
        }}
        i18n={{
          surveyTitle,
          profileLogoutModalBody,
        }}
      />
    );
    expect(surveyTitle).toHaveBeenCalledWith('PAL');
    userEvent.click(screen.getByTitle('Logout'));
    expect(profileLogoutModalBody).toHaveBeenCalledWith('PAL', 'Admin User');
  });

  it('clicking manage profile should call onRouteChange', async () => {
    const originalHref = window.location.href;
    const onRouteChange = jest.fn().mockImplementation(() => false);
    render(<SuiteHeader {...commonProps} onRouteChange={onRouteChange} />);
    userEvent.click(screen.getByRole('menuitem', { name: 'user' }));
    await userEvent.click(screen.getByRole('button', { name: 'Manage profile' }));
    expect(onRouteChange).toHaveBeenCalledWith('PROFILE', commonProps.routes.profile);
    expect(window.location.href).toEqual(originalHref);

    onRouteChange.mockImplementation(() => true);
    userEvent.click(screen.getByRole('menuitem', { name: 'user' }));
    await userEvent.click(screen.getByRole('button', { name: 'Manage profile' }));
    expect(onRouteChange).toHaveBeenCalledWith('PROFILE', commonProps.routes.profile);
    expect(window.location.href).toBe(commonProps.routes.profile);
  });

  it('should handle keyboard navigation for actionItems and panel links', async () => {
    const onRouteChange = jest.fn().mockImplementation(() => true);
    render(
      <SuiteHeader
        {...commonProps}
        onRouteChange={onRouteChange}
        customActionItems={[
          {
            label: 'chip',
            hasHeaderPanel: true,
            btnContent: (
              <span id="chip-icon">
                <Chip
                  fill="white"
                  description="chip-icon"
                  className={`${prefix}--header__menu-item ${prefix}--header__menu-title`}
                />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is a title',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'a',
                },
                content: <span id="a-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByTitle('chip'), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLAnchorElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is a title'), { key: 'Enter' });
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1);
    expect(onRouteChange).not.toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it('should handle keyboard navigation for actionItems and panel button with onClick', async () => {
    const onRouteChange = jest.fn().mockImplementation(() => true);
    const onClick = jest.fn();
    render(
      <SuiteHeader
        {...commonProps}
        onRouteChange={onRouteChange}
        customActionItems={[
          {
            label: 'chip',
            hasHeaderPanel: true,
            btnContent: (
              <span id="chip-icon">
                <Chip
                  fill="white"
                  description="chip-icon"
                  className={`${prefix}--header__menu-item ${prefix}--header__menu-title`}
                />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is a title',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'button',
                  onClick,
                },
                content: <span id="a-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByTitle('chip'), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLButtonElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is a title'), { key: 'Enter' });
    expect(HTMLButtonElement.prototype.click).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onRouteChange).not.toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it('should handle keyboard navigation for actionItems and panel button without onClick', async () => {
    const onRouteChange = jest.fn().mockImplementation(() => true);
    render(
      <SuiteHeader
        {...commonProps}
        onRouteChange={onRouteChange}
        customActionItems={[
          {
            label: 'chip',
            hasHeaderPanel: true,
            btnContent: (
              <span id="chip-icon">
                <Chip
                  fill="white"
                  description="chip-icon"
                  className={`${prefix}--header__menu-item ${prefix}--header__menu-title`}
                />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is a title',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'button',
                },
                content: <span id="a-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByTitle('chip'), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLButtonElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is a title'), { key: 'Enter' });
    expect(HTMLButtonElement.prototype.click).not.toHaveBeenCalled();
    expect(onRouteChange).not.toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it('should handle keyboard navigation for actionItems and panel links with onClick', async () => {
    const onRouteChange = jest.fn().mockImplementation(() => true);
    const onClick = jest.fn();
    render(
      <SuiteHeader
        {...commonProps}
        onRouteChange={onRouteChange}
        customActionItems={[
          {
            label: 'chip',
            hasHeaderPanel: true,
            btnContent: (
              <span id="chip-icon">
                <Chip
                  fill="white"
                  description="chip-icon"
                  className={`${prefix}--header__menu-item ${prefix}--header__menu-title`}
                />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is a title',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'a',
                  onClick,
                },
                content: <span id="a-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByTitle('chip'), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLAnchorElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is a title'), { key: 'Enter' });
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onRouteChange).not.toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it('should handle keyboard navigation for actionItems and menu links', async () => {
    render(
      <SuiteHeader
        {...commonProps}
        customActionItems={[
          {
            label: 'chip',
            btnContent: (
              <span id="chip-icon">
                <Chip fill="white" description="chip-icon" />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is my message to you',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'a',
                },
                content: <span id="another-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByRole('menuitem', { name: 'chip' }), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLAnchorElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is my message to you'), { key: 'Enter' });
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledTimes(1);
    jest.resetAllMocks();
  });

  it('should handle keyboard navigation for actionItems and menu buttons', async () => {
    const onClick = jest.fn();
    render(
      <SuiteHeader
        {...commonProps}
        customActionItems={[
          {
            label: 'chip',
            btnContent: (
              <span id="chip-icon">
                <Chip fill="white" description="chip-icon" />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is my message to you',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'button',
                  onClick,
                },
                content: <span id="another-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByRole('menuitem', { name: 'chip' }), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLButtonElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is my message to you'), { key: 'Enter' });
    expect(HTMLButtonElement.prototype.click).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
    jest.resetAllMocks();
  });

  it('should handle keyboard navigation for actionItems and menu buttons without an onClick', async () => {
    render(
      <SuiteHeader
        {...commonProps}
        customActionItems={[
          {
            label: 'chip',
            btnContent: (
              <span id="chip-icon">
                <Chip fill="white" description="chip-icon" />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is my message to you',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'button',
                },
                content: <span id="another-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByRole('menuitem', { name: 'chip' }), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLButtonElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is my message to you'), { key: 'Enter' });
    expect(HTMLButtonElement.prototype.click).not.toHaveBeenCalled();
    jest.resetAllMocks();
  });

  it('should handle keyboard navigation for actionItems and menu links with onClick', async () => {
    const onClick = jest.fn();
    render(
      <SuiteHeader
        {...commonProps}
        customActionItems={[
          {
            label: 'chip',
            btnContent: (
              <span id="chip-icon">
                <Chip fill="white" description="chip-icon" />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is my message to you',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'a',
                  onClick,
                },
                content: <span id="another-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByRole('menuitem', { name: 'chip' }), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLAnchorElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is my message to you'), { key: 'Enter' });
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
    jest.resetAllMocks();
  });

  it('should handle keyboard navigation for actionItems and menu links with onClick and onKeyDown', async () => {
    const onClick = jest.fn();
    const onKeyDown = jest.fn();
    render(
      <SuiteHeader
        {...commonProps}
        customActionItems={[
          {
            label: 'chip',
            btnContent: (
              <span id="chip-icon">
                <Chip fill="white" description="chip-icon" />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is my message to you',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'a',
                  onClick,
                  onKeyDown,
                },
                content: <span id="another-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByRole('menuitem', { name: 'chip' }), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLAnchorElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is my message to you'), { key: 'Enter' });
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    jest.resetAllMocks();
  });

  it('should handle keyboard navigation for actionItems and panel links with onClick and onKeyDown', async () => {
    const onRouteChange = jest.fn().mockImplementation(() => true);
    const onClick = jest.fn();
    const onKeyDown = jest.fn();
    render(
      <SuiteHeader
        {...commonProps}
        onRouteChange={onRouteChange}
        customActionItems={[
          {
            label: 'chip',
            hasHeaderPanel: true,
            btnContent: (
              <span id="chip-icon">
                <Chip
                  fill="white"
                  description="chip-icon"
                  className={`${prefix}--header__menu-item ${prefix}--header__menu-title`}
                />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  href: 'https://www.ibm.com',
                  title: 'this is a title',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  element: 'a',
                  onClick,
                  onKeyDown,
                },
                content: <span id="a-message">this is my message to you</span>,
              },
            ],
          },
        ]}
      />
    );

    userEvent.type(screen.getByTitle('chip'), '{enter}', { skipClick: true });
    expect(screen.getByText('this is my message to you')).toBeVisible();
    jest.spyOn(HTMLAnchorElement.prototype, 'click');
    fireEvent.keyDown(screen.getByTitle('this is a title'), { key: 'Enter' });
    expect(HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onRouteChange).not.toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalled();
    jest.resetAllMocks();
  });

  describe('opening in new window', () => {
    let fakeUserAgent = '';
    beforeAll(() => {
      const { userAgent } = global.navigator;
      Object.defineProperty(global.navigator, 'userAgent', {
        get() {
          return fakeUserAgent === '' ? userAgent : fakeUserAgent;
        },
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      fakeUserAgent = '';
    });

    it('should open built-in routes in new window when holding cmd', async () => {
      const onRouteChange = jest.fn().mockImplementation(() => true);
      fakeUserAgent = 'Mac';
      render(<SuiteHeader {...commonProps} onRouteChange={onRouteChange} />);
      await userEvent.click(screen.getByLabelText('Administration'), { metaKey: true });
      expect(onRouteChange).toHaveBeenCalledWith('NAVIGATOR', commonProps.routes.navigator);
      expect(window.open).toHaveBeenCalledWith(
        commonProps.routes.navigator,
        '_blank',
        'noopener noreferrer'
      );
    });

    it('should open built-in routes in new window when holding ctrl', async () => {
      const onRouteChange = jest.fn().mockImplementation(() => true);
      fakeUserAgent = 'Win';
      render(<SuiteHeader {...commonProps} onRouteChange={onRouteChange} />);
      await userEvent.click(screen.getByLabelText('Administration'), { ctrlKey: true });
      expect(onRouteChange).toHaveBeenCalledWith('NAVIGATOR', commonProps.routes.navigator);
      expect(window.open).toHaveBeenLastCalledWith(
        commonProps.routes.navigator,
        '_blank',
        'noopener noreferrer'
      );
      expect(window.open).toHaveBeenCalledTimes(1);
      userEvent.click(screen.getByRole('menuitem', { name: 'user' }));
      await userEvent.click(screen.getByRole('button', { name: 'Manage profile' }), {
        ctrlKey: true,
      });
      expect(window.open).toHaveBeenLastCalledWith(
        commonProps.routes.profile,
        '_blank',
        'noopener noreferrer'
      );
      expect(window.open).toHaveBeenCalledTimes(2);

      userEvent.click(screen.getByRole('menuitem', { name: 'Help' }));
      await userEvent.click(screen.getByTitle('About'), { ctrlKey: true });
      expect(window.open).toHaveBeenLastCalledWith(
        commonProps.routes.about,
        '_blank',
        'noopener noreferrer'
      );
      expect(window.open).toHaveBeenCalledTimes(3);

      userEvent.click(screen.getByRole('button', { name: 'AppSwitcher' }));
      await userEvent.click(screen.getByText('All applications'), { ctrlKey: true });
      expect(window.open).toHaveBeenLastCalledWith(
        commonProps.routes.navigator,
        '_blank',
        'noopener noreferrer'
      );
      expect(window.open).toHaveBeenCalledTimes(4);

      userEvent.click(screen.getByRole('button', { name: 'AppSwitcher' }));
      await userEvent.click(screen.getByText('Monitor'), { ctrlKey: true });
      expect(window.open).toHaveBeenLastCalledWith(
        commonProps.applications[0].href,
        '_blank',
        'noopener noreferrer'
      );
      expect(window.open).toHaveBeenCalledTimes(5);

      userEvent.click(screen.getByRole('button', { name: 'AppSwitcher' }));
      await userEvent.click(screen.getByText('Health'), { ctrlKey: true });
      expect(window.open).toHaveBeenLastCalledWith(
        commonProps.applications[1].href,
        '_blank',
        'noopener noreferrer'
      );
      expect(window.open).toHaveBeenCalledTimes(6);
    });
  });
});
