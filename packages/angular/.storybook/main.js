const { createConfigItem } = require('@babel/core');
const path = require('path');

module.exports = {
  stories: ['../src/index.stories.ts', '../src/**/*.stories.ts'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false
      }
    },
    {
      name: '@storybook/addon-storysource',
      options: {
        rule: {
          test: [/\.stories\.tsx?$/, /index\.ts$/],
          include: [path.resolve(__dirname, '../src')]
        },
        loaderOptions: {
          injectStoryParameters: false,
          prettierConfig: { printWidth: 80, singleQuote: false }
        }
      }
    }
  ],
  framework: '@storybook/angular',
	core: {
		builder: 'webpack5'
	},
  webpackFinal: async config => {
    // config.entry.push(path.resolve(__dirname, 'preview.scss'));

    // remove all styling rules
    config.module.rules = config.module.rules.filter((rule) => !isStylingRule(rule));

    // push custom styling rule
    config.module.rules.push({
			test: /\.scss$/,
			sideEffects: true,
			use: [
				"style-loader",
				"css-loader",
				"postcss-loader",
				{
					loader: "sass-loader",
					options: {
						implementation: require("sass")
					}
				}
			]
		});

    // add the package local node_modules as the first place to look when resolving modules
    // more info here: https://webpack.js.org/configuration/resolve/#resolvemodules

    config.resolve.modules = [path.resolve(__dirname, '../node_modules'), 'node_modules'];
    config.mode = 'development';
    config.devtool = 'source-map';
    return config;
  }
};

function isStylingRule(rule) {
  const { test } = rule;
  if (!test) {
      return false;
  }
  if (!(test instanceof RegExp)) {
      return false;
  }
  return test.test('.css') || test.test('.scss') || test.test('.sass');
}