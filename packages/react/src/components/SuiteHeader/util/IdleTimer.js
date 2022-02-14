class IdleTimer {
  constructor({
    timeout = 1800, // 30 minutes
    countdown = 30, // 30 seconds
    cookieName = '_user_inactivity_timeout',
    cookieDomain = '',
    onIdleTimeoutWarning = () => {},
    onIdleTimeout = () => {},
    onRestart = () => {},
    onCookieCleared = () => {},
  }) {
    // Initialize constants
    this.COOKIE_CHECK_INTERVAL = 1000; // 1 second
    this.ACTIVITY_DEBOUNCE = 500; // 500 milliseconds
    this.COUNTDOWN_START = countdown;
    this.COOKIE_NAME = cookieName;
    this.COOKIE_DOMAIN = cookieDomain;
    this.TIMEOUT = timeout;

    // Set callbacks
    this.onIdleTimeoutWarning = onIdleTimeoutWarning;
    this.onIdleTimeout = onIdleTimeout;
    this.onRestart = onRestart;
    this.onCookieCleared = onCookieCleared;

    // Bind the user activity event handler to IdleTimer's object (this)
    this.eventHandler = this.debouncedUpdateExpiredTime.bind(this);

    // Start idle user detection
    this.start();
  }

  startIdleUserDetectionInterval() {
    // Push the cookie forward by this.TIMEOUT
    this.updateUserInactivityTimeoutCookie();
    // Reset the countdown
    this.countdown = this.COUNTDOWN_START;
    // Make sure we don't stack up setInterval threads
    if (this.intervalHandler) {
      clearInterval(this.intervalHandler);
    }
    // Initialize the setInterval thread
    this.intervalHandler = setInterval(() => {
      // Check if userInactivityTimeout is not a number, which indicates that a the cookie might have been deleted in another tab
      const userInactivityTimeoutValue = this.getUserInactivityTimeoutCookie();
      const cookieClearedInDifferentTab = Number.isNaN(userInactivityTimeoutValue);
      if (cookieClearedInDifferentTab) {
        this.onCookieCleared();
        this.cleanUp();
      }
      // Check if user is idle by comparing the inactivity timeout cookie timestamp with the current time
      if (userInactivityTimeoutValue < Date.now()) {
        // Fire onIdleTimeoutWarning during the countdown, and when countdown reaches zero, fire onIdleTimeout.
        if (this.countdown === 0) {
          this.onIdleTimeout();
          // End the execution of IdleTimer
          this.cleanUp();
        } else {
          this.onIdleTimeoutWarning(this.countdown);
          // Decrease coountdown each time onIdleTimeoutWarning is fired
          this.countdown = this.countdown === 0 ? this.countdown : this.countdown - 1;
        }
      } else if (this.countdown < this.COUNTDOWN_START) {
        // This means that the cookie has been updated by a restart of IdleTimer running in some other tab during the countdown (when onIdleTimeoutWarning was being fired)
        this.onRestart();
        this.countdown = this.COUNTDOWN_START;
      }
    }, this.COOKIE_CHECK_INTERVAL);
  }

  getUserInactivityTimeoutCookie() {
    const cookie = document.cookie
      .split('; ')
      .find((currentCookie) => currentCookie.split('=')[0] === this.COOKIE_NAME);
    const cookieValue = cookie?.split('=')[1];
    return parseInt(decodeURIComponent(cookieValue), 10);
  }

  setUserInactivityTimeoutCookie(timestamp, expires) {
    // Write the inactivity timeout cookie
    document.cookie = `${this.COOKIE_NAME}=${encodeURIComponent(
      timestamp
    )};expires=${expires};path=/;domain=${this.COOKIE_DOMAIN};`;
  }

  deleteUserInactivityTimeout() {
    document.cookie = `${this.COOKIE_NAME}=;Max-Age=0;path=/;domain=${this.COOKIE_DOMAIN};`;
  }

  updateUserInactivityTimeoutCookie() {
    // Cookie will expire in 7 days (this doesn't matter as the cookie is always recreated on user activity and when IdleTimer is restarted)
    const expires = new Date(Date.now() + 6048e5).toUTCString();
    const timestamp = Date.now() + this.TIMEOUT * 1000;
    this.setUserInactivityTimeoutCookie(timestamp, expires);
  }

  debouncedUpdateExpiredTime() {
    // Expired time is only updated if inactivity timeout has not been reached
    // Otherwise, the only way to resume inactivity timeout cookie updates is by calling restart()
    const userInactivityTimeoutValue = this.getUserInactivityTimeoutCookie();
    const cookieStillExists = !Number.isNaN(userInactivityTimeoutValue);
    const userIsActive = Date.now() < userInactivityTimeoutValue;
    if (cookieStillExists && userIsActive) {
      if (this.debounceTimeoutHandler) {
        clearTimeout(this.debounceTimeoutHandler);
      }
      this.debounceTimeoutHandler = setTimeout(() => {
        this.updateUserInactivityTimeoutCookie();
      }, this.ACTIVITY_DEBOUNCE);
    }
  }

  createUserActivityListeners() {
    // Make sure we don't stack up event listeners
    this.cleanUpUserActivityListeners();
    // Listen for mouse and keuboard events
    window.addEventListener('mousemove', this.eventHandler);
    window.addEventListener('mousedown', this.eventHandler);
    window.addEventListener('scroll', this.eventHandler);
    window.addEventListener('keydown', this.eventHandler);
    window.addEventListener('clientTimerEvent', this.eventHandler, true);
    // Listen for mobile (touch) events
    window.addEventListener('touchstart', this.eventHandler);
    window.addEventListener('touchend', this.eventHandler);
    window.addEventListener('touchmove', this.eventHandler);
    window.addEventListener('touchcancel', this.eventHandler);
  }

  cleanUpUserActivityListeners() {
    // Cleanup all listeners
    window.removeEventListener('mousemove', this.eventHandler);
    window.removeEventListener('mousedown', this.eventHandler);
    window.removeEventListener('scroll', this.eventHandler);
    window.removeEventListener('keydown', this.eventHandler);
    window.removeEventListener('clientTimerEvent', this.eventHandler);
    window.removeEventListener('touchstart', this.eventHandler);
    window.removeEventListener('touchend', this.eventHandler);
    window.removeEventListener('touchmove', this.eventHandler);
    window.removeEventListener('touchcancel', this.eventHandler);
  }

  start() {
    // Create the event listeners and start the setInterval that keeps checking for inactivity
    this.createUserActivityListeners();
    this.startIdleUserDetectionInterval();
  }

  restart() {
    this.start();
  }

  cleanUp() {
    clearInterval(this.intervalHandler);
    this.cleanUpUserActivityListeners();
    this.onIdleTimeoutWarning = () => {};
    this.deleteUserInactivityTimeout();
  }
}

export default IdleTimer;
