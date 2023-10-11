export const shouldOpenInNewWindow = (e) =>
  navigator.userAgent.indexOf('Mac') !== -1 ? e.metaKey : e.ctrlKey;

export const isSafari = () => {
  // Check for SSR
  /* istanbul ignore else */
  if (typeof window !== 'undefined') {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  /* istanbul ignore next */
  return false;
};
