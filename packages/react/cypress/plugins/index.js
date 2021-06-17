const path = require('path');

const { startDevServer } = require('@cypress/webpack-dev-server');

const { BABEL_ENV } = process.env;
const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules|coverage|lib|css|es|scss|umd|results/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-flow',
            '@babel/preset-react',
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
          ],
        },
      },
      {
        test: /\.s?css$/i,
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
      },
    ],
  },
};

module.exports = (on, config) => {
  if (config.testingType === 'component') {
    on('dev-server:start', (options) => startDevServer({ options, webpackConfig }));
  }

  return config;
};
