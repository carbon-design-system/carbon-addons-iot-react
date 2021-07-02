import IdleTimer from './IdleTimer';

let timer;

describe('IdleTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    timer = new IdleTimer({});
    timer.onIdleTimeoutWarning = jest.fn();
    timer.onIdleTimeout = jest.fn();
    timer.onRestart = jest.fn();
  });
  afterEach(() => {
    timer.cleanUp();
    jest.useRealTimers();
  });
  it('starts the timer', () => {
    // Make sure that there are default values for all IdleTimer variables
    expect(timer.COOKIE_CHECK_INTERVAL).not.toBeUndefined();
    expect(timer.ACTIVITY_DEBOUNCE).not.toBeUndefined();
    expect(timer.COUNTDOWN_START).not.toBeUndefined();
    expect(timer.COOKIE_NAME).not.toBeUndefined();
    expect(timer.COOKIE_DOMAIN).not.toBeUndefined();
    expect(timer.TIMEOUT).not.toBeUndefined();
    expect(timer.onIdleTimeoutWarning).not.toBeUndefined();
    expect(timer.onIdleTimeout).not.toBeUndefined();
    expect(timer.onRestart).not.toBeUndefined();
    expect(timer.eventHandler).not.toBeUndefined();
    expect(timer.countdown).not.toBeUndefined();
    expect(clearInterval).not.toHaveBeenCalled();
    expect(setInterval).toHaveBeenCalledTimes(1);
  });
  it('does nothing on an interval cycle if timeout has not been reached yet', () => {
    // Simulate a timestamp cookie that is slightly in the future
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${timer.COOKIE_NAME}=${Date.now() + 1000}`,
    });
    // Make sure one cycle of the setInterval runs
    jest.runOnlyPendingTimers();
    expect(timer.onIdleTimeoutWarning).not.toHaveBeenCalled();
    expect(timer.onIdleTimeout).not.toHaveBeenCalled();
    expect(timer.onRestart).not.toHaveBeenCalled();
  });
  it('fires onIdleTimeoutWarning on an interval cycle if timeout has been reached', () => {
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${timer.COOKIE_NAME}=${Date.now() - 1000}`,
    });
    // Make sure one cycle of the setInterval runs
    jest.runOnlyPendingTimers();
    // only onIdleTimeoutWarning should have been fired, and countdown should have decreased
    expect(timer.onIdleTimeoutWarning).toHaveBeenCalledWith(timer.COUNTDOWN_START);
    expect(timer.countdown).toEqual(timer.COUNTDOWN_START - 1);
    expect(timer.onIdleTimeout).not.toHaveBeenCalled();
    expect(timer.onRestart).not.toHaveBeenCalled();
  });
  it('fires onIdleTimeoutWarning N times and then onIdleTimeout when countdown reaches zero', () => {
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${timer.COOKIE_NAME}=${Date.now() - 1000}`,
    });
    // Make sure COUNTDOWN_START cycles of the setInterval run
    jest.advanceTimersByTime(timer.COUNTDOWN_START * 1000);
    // only onIdleTimeoutWarning callbacks should have been fired
    expect(timer.onIdleTimeoutWarning).toHaveBeenCalledTimes(timer.COUNTDOWN_START);
    expect(timer.onIdleTimeout).not.toHaveBeenCalled();
    // Run just one more setInterval cycle
    jest.runOnlyPendingTimers();
    // now onIdleTimeout should have been fired
    expect(timer.onIdleTimeout).toHaveBeenCalled();
    // onRestart should never have been fired
    expect(timer.onRestart).not.toHaveBeenCalled();
  });
  it('fires onRestart when cookie value is pushed forward during the timeout warning countdown', () => {
    // Simulate a timestamp cookie that is in the past
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${timer.COOKIE_NAME}=${Date.now() - 1000}`,
    });
    // Run just one setInterval cycle
    jest.runOnlyPendingTimers();
    // only onIdleTimeoutWarning should have been fired
    expect(timer.onIdleTimeoutWarning).toHaveBeenCalledWith(timer.COUNTDOWN_START);
    // Simulate a timestamp cookie that is now in the future (some other tab might have pushed it)
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${timer.COOKIE_NAME}=${Date.now() + 1000}`,
    });
    // Run just one setInterval cycle
    jest.runOnlyPendingTimers();
    expect(timer.onIdleTimeout).not.toHaveBeenCalled();
    // onRestart should have been fired
    expect(timer.onRestart).toHaveBeenCalled();
  });
  it('acts on user events pushing the cookie value forward if timeout has no been reached yet', () => {
    // Simulate a timestamp cookie that is in the future
    timer.updateUserInactivityTimeout = jest.fn();
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${timer.COOKIE_NAME}=${Date.now() + 1000}`,
    });
    window.dispatchEvent(new Event('mousemove'));
    window.dispatchEvent(new Event('mousedown'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('keydown'));
    expect(setTimeout).toHaveBeenCalledTimes(4);
    jest.runOnlyPendingTimers();
    // Debouncing logic should make sure that updateUserInactivityTimeout is executed only once
    expect(timer.updateUserInactivityTimeout).toHaveBeenCalledTimes(1);
  });
  it('does not act on user events if timeout has already been reached', () => {
    // Simulate a timestamp cookie that is in the past
    timer.updateUserInactivityTimeout = jest.fn();
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: `${timer.COOKIE_NAME}=${Date.now() - 1000}`,
    });
    window.dispatchEvent(new Event('mousemove'));
    window.dispatchEvent(new Event('mousedown'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('keydown'));
    expect(setTimeout).not.toHaveBeenCalled();
    jest.runOnlyPendingTimers();
    expect(timer.updateUserInactivityTimeout).not.toHaveBeenCalled();
  });
  it('restarts the timer', () => {
    timer.createUserActivityListeners = jest.fn();
    timer.startIdleUserDetectionInterval = jest.fn();
    timer.restart();
    expect(timer.createUserActivityListeners).toHaveBeenCalled();
    expect(timer.startIdleUserDetectionInterval).toHaveBeenCalled();
  });
  it('cleans up the timer', () => {
    timer.cleanUpUserActivityListeners = jest.fn();
    timer.cleanUp();
    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(timer.cleanUpUserActivityListeners).toHaveBeenCalled();
  });
});
