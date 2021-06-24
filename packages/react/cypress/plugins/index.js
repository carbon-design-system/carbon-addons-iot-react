const path = require('path');

/* eslint-disable-next-line import/no-extraneous-dependencies */
const { startDevServer } = require('@cypress/webpack-dev-server');
/* eslint-disable-next-line import/no-extraneous-dependencies */
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/dist/plugin');

const { BABEL_ENV } = process.env;

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          path.resolve(__dirname, '../../node_modules'),
          path.resolve(__dirname, '../../coverage'),
          path.resolve(__dirname, '../../lib'),
          path.resolve(__dirname, '../../css'),
          path.resolve(__dirname, '../../es'),
          path.resolve(__dirname, '../../scss'),
          path.resolve(__dirname, '../../umd'),
          path.resolve(__dirname, '../../results'),
        ],
        include: [path.resolve(__dirname, '../../src')],
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: ['last 2 version', 'ie >= 11'],
                },
                useBuiltIns: 'usage',
                modules: BABEL_ENV === 'production' ? false : 'auto',
                corejs: 3,
                loose: false,
              },
            ],
            '@babel/preset-flow',
            '@babel/preset-react',
          ],
        },
      },
      {
        test: /\.s?css$/i,
        exclude: [/coverage/],
        sideEffects: true,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { importLoaders: 2 },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                /* eslint-disable-next-line import/no-extraneous-dependencies, global-require */
                require('autoprefixer')({
                  browsers: ['last 1 version', 'ie >= 11'],
                }),
              ],
            },
          },
          {
            loader: 'fast-sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'node_modules')],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

const width = 1670;
const height = 900;

module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    /* eslint-disable dot-notation, no-param-reassign */
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push(`--window-size=${width},${height}`);
      // force screen to be non-retina and just use our given resolution
      launchOptions.args.push('--force-device-scale-factor=1');
    }
    if (browser.name === 'electron' && browser.isHeadless) {
      // might not work on CI for some reason
      launchOptions.preferences.width = width;
      launchOptions.preferences.height = height;
    }
    if (browser.name === 'firefox' && browser.isHeadless) {
      launchOptions.args.push(`--width=${width}`);
      launchOptions.args.push(`--height=${height}`);
    }
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      launchOptions.args.push('--start-fullscreen');
    }

    if (browser.name === 'electron') {
      launchOptions.preferences.fullscreen = true;
    }

    return launchOptions;
  });

  getCompareSnapshotsPlugin(on, webpackConfig);
  if (config.testingType === 'component') {
    on('dev-server:start', (options) => startDevServer({ options, webpackConfig }));
  }

  return config;
};
