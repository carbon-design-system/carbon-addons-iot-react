const path = require('path');
const webpack = require('webpack');

module.exports = {
  stories: ['./Welcome.story.jsx', '../src/**/*.story.jsx'],
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    'storybook-addon-rtl',
    '@storybook/addon-docs',
    'storybook-addon-turbo-build',
  ],
  babel: async (options) => {
    // ensure all plugins are using loose: false (the default)
    // this avoids an error where plugins from different locations have
    // different loose modes
    options.plugins.forEach((plugin) => {
      if (Array.isArray(plugin) && plugin[1].loose) {
        plugin[1].loose = false;
      }
    });
    return options;
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // High quality 'original source' sourcemaps are slow to generate on initial builds and rebuilds.
    // Using cheap-module-eval-source-map speeds up builds and rebuilds in development while not sacrificing too much source map quality.
    config.devtool = configType === 'DEVELOPMENT' ? 'cheap-module-eval-source-map' : 'source-map';

    // Moment.js is quite large, the locales that they bundle in the core as of v2.18 are ignored to keep our bundle size down.
    // https://webpack.js.org/plugins/ignore-plugin/#example-of-ignoring-moment-locales
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment\/min$/));

    config.module.rules.push({
      test: /\.(js|jsx)$/,
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'coverage'),
        path.resolve(__dirname, 'lib'),
        path.resolve(__dirname, 'css'),
        path.resolve(__dirname, 'es'),
        path.resolve(__dirname, 'scss'),
        path.resolve(__dirname, 'umd'),
        path.resolve(__dirname, 'results'),
      ],
      include: [path.resolve(__dirname, 'src')],
      use: 'babel-loader',
    });
    config.optimization = {
      splitChunks: {
        chunks: 'all',
      },
    };

    // Remove the existing css rule
    // https://github.com/storybookjs/storybook/issues/6319#issuecomment-477852640
    config.module.rules = config.module.rules.filter((f) => f.test.toString() !== '/\\.css$/');

    // Define our desired scss/css rule
    config.module.rules.push({
      test: /\.s?css$/,
      exclude: [/coverage/],
      sideEffects: true,
      use: [
        // Creates `style` nodes from JS strings
        { loader: 'style-loader' },
        // Translates CSS into CommonJS
        {
          loader: 'css-loader',
          options: { importLoaders: 2 },
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [
              require('autoprefixer')({
                browsers: ['last 1 version', 'ie >= 11'],
              }),
            ],
          },
        },
        // Compiles Sass to CSS
        {
          loader: 'fast-sass-loader',
          options: {
            includePaths: [path.resolve(__dirname, '..', 'node_modules')],
          },
        },
      ],
    });

    // add the package local node_modules as the first place to look when resolving modules
    // more info here: https://webpack.js.org/configuration/resolve/#resolvemodules
    config.resolve.modules = [path.resolve(__dirname, '../node_modules'), 'node_modules'];

    // Return the altered config
    return config;
  },
};
