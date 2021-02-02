module.exports = {
  ruleArchive: 'latest',
  policies: ['IBM_Accessibility'],
  failLevels: ['violation'],
  reportLevels: [
    'violation',
    'potentialviolation',
    'recommendation',
    'potentialrecommendation',
    'manual',
  ],
  outputFormat: ['json'],
  label: 'master',
  outputFolder: 'results',
};
