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
              includePaths: ['node_modules'],
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

module.exports = (on, config) => {
  console.log('wanker');
  if (config.testingType === 'component') {
    console.log('wanker inside!', JSON.stringify(webpackConfig));
    on('dev-server:start', (options) => startDevServer({ options, webpackConfig }));
  }

  return config;
};
