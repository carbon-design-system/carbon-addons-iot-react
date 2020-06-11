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
  label: [process.env.TRAVIS_BRANCH],
  outputFolder: 'results',
};
