import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import Chip from '@carbon/icons-react/lib/chip/24';

import SuiteHeader from './SuiteHeader';
import SuiteHeaderI18N from './i18n';

const commonProps = {
  suiteName: 'Application Suite',
  appName: 'Application Name',
  userDisplayName: 'Admin User',
  username: 'adminuser',
  isAdminView: true,
  onRouteChange: async () => true,
  routes: {
    profile: 'https://www.ibm.com',
    navigator: 'https://www.ibm.com',
    admin: 'https://www.ibm.com',
    logout: 'https://www.ibm.com',
    whatsNew: 'https://www.ibm.com',
    gettingStarted: 'https://www.ibm.com',
    documentation: 'https://www.ibm.com',
    requestEnhancement: 'https://www.ibm.com',
    support: 'https://www.ibm.com',
    about: 'https://www.ibm.com',
  },
  applications: [
    {
      id: 'monitor',
      name: 'Monitor',
      href: 'https://www.ibm.com',
    },
    {
      id: 'health',
      name: 'Health',
      href: 'https://www.ibm.com',
      isExternal: true,
    },
  ],
};

describe('SuiteHeader', () => {
  let originalWindowLocation;
  beforeEach(() => {
    originalWindowLocation = { ...window.location };
  });

  afterEach(() => {
    window.location = { ...originalWindowLocation };
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
    expect(
      screen.getByRole('banner', { name: 'main header' })
    ).toBeInTheDocument();
  });
  it('opens and closes logout modal', () => {
    render(<SuiteHeader {...commonProps} />);
    expect(
      screen.getByRole('banner', { name: 'main header' })
    ).toBeInTheDocument();
    userEvent.click(screen.getByTestId('suite-header-profile--logout'));
    expect(screen.getByRole('presentation')).toHaveClass('is-visible');
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('presentation')).not.toHaveClass('is-visible');
  });
  it('clicks logout link', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeader {...commonProps} />);
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Log out' })[0]
    );
    expect(window.location.href).toBe(commonProps.routes.logout);
  });
  it('clicks logout link (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeader {...commonProps} onRouteChange={async () => false} />);
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Log out' })[0]
    );
    expect(window.location.href).not.toBe(commonProps.routes.logout);
  });
  it('admin link from admin view takes you to navigator route', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeader {...commonProps} isAdminView />);
    await userEvent.click(screen.getByTestId('admin-icon'));
    expect(window.location.href).toBe(commonProps.routes.navigator);
  });
  it('admin link from admin view takes you to navigator route (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    render(
      <SuiteHeader
        {...commonProps}
        onRouteChange={async () => false}
        isAdminView
      />
    );
    await userEvent.click(screen.getByTestId('admin-icon'));
    expect(window.location.href).not.toBe(commonProps.routes.navigator);
  });
  it('admin link from non-admin view takes you to admin route', async () => {
    delete window.location;
    window.location = { href: '' };
    render(<SuiteHeader {...commonProps} isAdminView={false} />);
    await userEvent.click(screen.getByTestId('admin-icon'));
    expect(window.location.href).toBe(commonProps.routes.admin);
  });
  it('admin link from non-admin view takes you to admin route (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    render(
      <SuiteHeader
        {...commonProps}
        onRouteChange={async () => false}
        isAdminView={false}
      />
    );
    await userEvent.click(screen.getByTestId('admin-icon'));
    expect(window.location.href).not.toBe(commonProps.routes.admin);
  });
  it('clicks a documentation link', async () => {
    delete window.location;
    window.location = { href: '' };
    window.open = jest.fn();
    render(<SuiteHeader {...commonProps} />);
    await userEvent.click(screen.getByTestId('suite-header-help--whatsNew'));
    expect(window.open).toHaveBeenCalledWith(
      commonProps.routes.whatsNew,
      'blank'
    );
  });
  it('clicks a documentation link (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    window.open = jest.fn();
    render(<SuiteHeader {...commonProps} onRouteChange={async () => false} />);
    await userEvent.click(screen.getByTestId('suite-header-help--whatsNew'));
    expect(window.open).not.toHaveBeenCalled();
  });
  it('clicks about link', async () => {
    delete window.location;
    window.location = { href: '' };
    window.open = jest.fn();
    render(<SuiteHeader {...commonProps} />);
    await userEvent.click(screen.getByTestId('suite-header-help--about'));
    expect(window.location.href).toBe(commonProps.routes.about);
  });
  it('clicks about link (but no redirect)', async () => {
    delete window.location;
    window.location = { href: '' };
    window.open = jest.fn();
    render(<SuiteHeader {...commonProps} onRouteChange={async () => false} />);
    await userEvent.click(screen.getByTestId('suite-header-help--about'));
    expect(window.open).not.toHaveBeenCalled();
  });
  it('renders all i18n', () => {
    Object.keys(SuiteHeaderI18N).forEach((language) => {
      render(
        <SuiteHeader
          {...commonProps}
          i18n={SuiteHeaderI18N[language]}
          isAdminView
        />
      );
      expect(
        screen.getByRole('banner', { name: 'main header' })
      ).toBeInTheDocument();
    });
  });
  it('user clicks survey link', () => {
    const surveyLink = 'https://www.ibm.com/';
    const surveyData = { surveyLink, privacyLink: surveyLink };
    render(
      <SuiteHeader
        {...commonProps}
        appName={undefined}
        surveyData={surveyData}
      />
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    userEvent.click(screen.getByText(SuiteHeader.defaultProps.i18n.surveyText));
    expect(
      screen.getByText(SuiteHeader.defaultProps.i18n.surveyText).href
    ).toBe(surveyLink);
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
    userEvent.click(
      screen.getByRole('button', { name: 'closes notification' })
    );
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
