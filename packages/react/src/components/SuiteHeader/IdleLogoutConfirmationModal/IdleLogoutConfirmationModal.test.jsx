import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import SuiteHeaderI18N from '../i18n';

import IdleLogoutConfirmationModal from './IdleLogoutConfirmationModal';

const commonProps = {
  routes: {
    logout: 'https://www.ibm.com',
    logoutInactivity: 'https://www.ibm.com',
    domain: '',
  },
  idleTimeoutData: { countdown: 10, timeout: 10, cookieName: '_user_inactivity_timeout' },
};

describe('IdleLogoutConfirmationModal', () => {
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

  it('active user does not see idle logout confirmation dialog', () => {
    render(<IdleLogoutConfirmationModal {...commonProps} />);

    // Simulate a timestamp cookie that is in the future
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() + 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByTestId('idle-logout-confirmation')).not.toHaveClass('is-visible');
  });
  it('inactive user sees idle logout confirmation dialog', () => {
    render(<IdleLogoutConfirmationModal {...commonProps} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByTestId('idle-logout-confirmation')).toHaveClass('is-visible');
  });
  it('inactive user does not see idle logout confirmation dialog if timeout is set to 0', () => {
    render(
      <IdleLogoutConfirmationModal
        {...commonProps}
        idleTimeoutData={{ ...commonProps.idleTimeoutData, timeout: 0 }}
      />
    );
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByTestId('idle-logout-confirmation')).not.toHaveClass('is-visible');
  });
  it('idle logout confirmation dialog works with default i18n', () => {
    render(<IdleLogoutConfirmationModal {...commonProps} i18n={undefined} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByTestId('idle-logout-confirmation')).toHaveClass('is-visible');
  });
  it('clicking Stay Logged In on the idle logout confirmation dialog triggers onStayLoggedIn callback', () => {
    const mockOnStayLoggedIn = jest.fn();
    render(<IdleLogoutConfirmationModal {...commonProps} onStayLoggedIn={mockOnStayLoggedIn} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
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
    render(<IdleLogoutConfirmationModal {...commonProps} onRouteChange={async () => true} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
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
    render(<IdleLogoutConfirmationModal {...commonProps} onRouteChange={async () => false} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
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
    render(<IdleLogoutConfirmationModal {...commonProps} onRouteChange={async () => true} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
    });
    await act(async () => {
      await jest.advanceTimersByTime((commonProps.idleTimeoutData.countdown + 1) * 1000);
    });
    expect(window.location.href).toBe(commonProps.routes.logoutInactivity);
  });
  it('idle user waits for the logout confirmation dialog countdown to finish (but no redirect)', async () => {
    render(<IdleLogoutConfirmationModal {...commonProps} onRouteChange={async () => false} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
    });
    await act(async () => {
      await jest.advanceTimersByTime((commonProps.idleTimeoutData.countdown + 1) * 1000);
    });
    expect(window.location.href).not.toBe(commonProps.routes.logoutInactivity);
  });

  it("user clicks 'Stay logged in' on the idle logout confirmation dialog", async () => {
    jest.spyOn(IdleLogoutConfirmationModal.defaultProps, 'onStayLoggedIn');
    render(<IdleLogoutConfirmationModal {...commonProps} onRouteChange={async () => false} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    const modalStayLoggedInButton = within(
      screen.getByTestId('idle-logout-confirmation')
    ).getByText(SuiteHeaderI18N.en.sessionTimeoutModalStayLoggedInButton);
    await userEvent.click(modalStayLoggedInButton);
    expect(IdleLogoutConfirmationModal.defaultProps.onStayLoggedIn).toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  it('should restart the timer when cookie changes', async () => {
    jest.spyOn(IdleLogoutConfirmationModal.defaultProps, 'onStayLoggedIn');
    render(<IdleLogoutConfirmationModal {...commonProps} onRouteChange={async () => false} />);
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() - 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(IdleLogoutConfirmationModal.defaultProps.onStayLoggedIn).not.toHaveBeenCalled();

    // Simulate a timestamp cookie that is in the future (another tab could have updated it)
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${commonProps.idleTimeoutData.cookieName}=${Date.now() + 1000}`,
    });
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(IdleLogoutConfirmationModal.defaultProps.onStayLoggedIn).toHaveBeenCalled();
    jest.restoreAllMocks();
  });
});
