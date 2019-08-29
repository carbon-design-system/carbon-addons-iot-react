module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/components/**/*.js?(x)', '!src/**/*.story.js?(x)'],
  coveragePathIgnorePatterns: ['/node_modules/', '/lib/', '/coverage/'],
  coverageReporters: ['html', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 65,
      functions: 65,
      lines: 75,
    },
  },
  setupFiles: ['<rootDir>/config/jest/setup.js'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.js?(x)',
    '<rootDir>/**/?(*.)(spec|test).js?(x)',
    '<rootDir>/**/?(*.)test.a11y.js?(x)',
  ],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.s?css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  testPathIgnorePatterns: ['/config/', '/lib/'],
  transformIgnorePatterns: ['node_modules/(?!(@carbon/charts)).+(.jsx?)'],

  moduleFileExtensions: ['js', 'json', 'jsx'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
