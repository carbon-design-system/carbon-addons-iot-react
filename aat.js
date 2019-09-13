module.exports = {
  authToken: '4f4c627e-2af6-49da-a391-18a0f3559b0d/9486d83f-0927-4801-9ec8-1e7e3adaa73d',
  ruleArchive: 'latest',
  policies: ['IBM_Accessibility', 'IBM_Accessibility_WCAG21'],
  failLevels: ['violation'],
  reportLevels: [
    'violation',
    'potentialviolation',
    'recommendation',
    'potentialrecommendation',
    'manual',
  ],
  captureScreenshots: true,
  outputFormat: ['json'],
  label: ['master'],
  outputFolder: 'results',
  checkHiddenContent: false,
  baseA11yServerURL: 'https://able.ibm.com/tools',
};
