export const shouldOpenInNewWindow = (e) =>
  navigator.userAgent.indexOf('Mac') !== -1 ? e.metaKey : e.ctrlKey;
