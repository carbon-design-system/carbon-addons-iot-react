const path = require('path');

module.exports = {
  stories: ['../src/index.stories.ts', '../src/**/*.stories.ts'],
  addons: ['@storybook/addon-knobs'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: [/\.stories\.tsx?$/, /index\.ts$/],
      loaders: [
        {
          loader: require.resolve('@storybook/source-loader'),
          options: {
            parser: 'typescript',
          },
        },
      ],
      include: [path.resolve(__dirname, '../src')],
      enforce: 'pre',
    });

    // add the package local node_modules as the first place to look when resolving modules
    // more info here: https://webpack.js.org/configuration/resolve/#resolvemodules
    config.resolve.modules = [path.resolve(__dirname, '../node_modules'), 'node_modules'];

    config.mode = 'development';
    config.devtool = 'source-map';
    return config;
  },
};
