const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const nodeEnvironmentCheck = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
});
module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? '#cheap-module-eval-source-map' : 'source-map',
  plugins: [nodeEnvironmentCheck],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /coverage/],
        use: 'babel-loader',
      },
      {
        test: /\.s?css$/,
        exclude: [/node_modules/, /coverage/],
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
                require('autoprefixer')({
                  browsers: ['last 1 version', 'ie >= 11'],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, '..', 'node_modules')],
            },
          },
        ],
      },
    ],
  },
};
