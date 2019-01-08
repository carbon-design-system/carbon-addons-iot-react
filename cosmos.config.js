module.exports = {
  globalImports: ['babel-polyfill', '.storybook/_container.scss'],
  webpackConfigPath: '.storybook/webpack.config.js',
  fileMatch: ['/**/*fixture.js'],
  fileMatchIgnore: ['**/node_modules/**', '**/lib/**'],
};
