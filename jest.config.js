module.exports = {
  collectCoverage: true,
  verbose: true,
  collectCoverageFrom: ['src/components/**/*.js?(x)', '!src/**/*-story.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/lib/', '/coverage/'],
  coverageReporters: ['html', 'text-summary'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  setupFiles: ['<rootDir>/config/jest/setup.js'],
  testMatch: ['<rootDir>/**/__tests__/**/*.js?(x)', '<rootDir>/**/?(*-)(spec|test).js?(x)'],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.s?css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  testPathIgnorePatterns: ['/config/', '/lib/'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['js', 'json'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
