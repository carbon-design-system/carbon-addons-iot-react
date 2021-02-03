const path = require('path');
const webpack = require('webpack');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

module.exports = {
  stories: ['./Welcome.story.jsx', '../**/*.story.jsx', '../**/*.story.mdx'],
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    'storybook-addon-rtl',
    'storybook-readme',
    '@storybook/addon-docs/register',
  ],
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

    config.module.rules.push({
      test: /\.mdx$/,
      use: [
        {
          loader: 'babel-loader',
          // // may or may not need this line depending on your app's setup
          // options: {
          //   plugins: ['@babel/plugin-transform-react-jsx'],
          // },
        },
        {
          loader: '@mdx-js/loader',
          options: {
            compilers: [createCompiler({})],
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.story\.jsx?$/,
      loader: require.resolve('@storybook/source-loader'),
      exclude: [/node_modules/],
      enforce: 'pre',
    });

    // Return the altered config
    return config;
  },
};
