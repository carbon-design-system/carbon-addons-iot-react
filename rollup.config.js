import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import autoprefixer from 'autoprefixer';

const env = process.env.NODE_ENV || 'development';
const prodSettings = env === 'development' ? [] : [uglify(), filesize()];

// Converts `_component-name.scss` to `ComponentName/_component-name.scss`
// and handles the word `ui` to be uppercase `UI`
const sanitizeAndCamelCase = (fileName, extension) => {
  return `${fileName
    .replace('_', '')
    .split('-')
    .map(word =>
      word === 'ui' ? `${word.toUpperCase()}` : `${word[0].toUpperCase() + word.substring(1)}`
    )
    .join('')}/${fileName}.${extension}`;
};

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    name: 'CarbonAddonsIoTReact',
    format: 'umd',
    globals: {
      classnames: 'classNames',
      'prop-types': 'PropTypes',
      react: 'React',
      'react-dom': 'ReactDOM',
      '@carbon/charts': 'CarbonCharts',
      '@carbon/charts-react': 'CarbonChartsReact',
      'carbon-icons': 'CarbonIcons',
      '@carbon/icons-react': 'CarbonIconsReact',
      'carbon-components': 'CarbonComponents',
      'carbon-components-react': 'CarbonComponentsReact',
      'styled-components': 'styled',
      d3: 'd3',
    },
  },
  external: [
    'react',
    'styled-components',
    'prop-types',
    'carbon-components-react',
    'carbon-icons',
    '@carbon/charts',
    '@carbon/charts-react',
    '@carbon/icons',
    '@carbon/icons-react',
    'carbon-components',
    'd3',
  ],
  plugins: [
    resolve({ browser: true, extensions: ['.mjs', '.js', '.jsx', '.json'] }),
    postcss({
      extract: 'lib/css/carbon-addons-iot-react.css',
      sourceMap: true,
      use: ['sass'],
      plugins: [autoprefixer],
    }),
    copy({
      targets: [
        // Sass entrypoint
        { src: 'src/styles.scss', dest: 'lib/scss' },

        // Sass globals
        {
          src: 'src/globals',
          dest: 'lib/scss',
        },

        // Sass components
        {
          src: 'src/components/**/*.scss',
          dest: 'lib/scss/components',
          rename: (name, extension) => sanitizeAndCamelCase(name, extension),
        },
      ],
      verbose: env !== 'development', // logs the file copy list on production builds for easier debugging
    }),
    commonjs({
      namedExports: {
        'react-js': ['isValidElementType'],
        'node_modules/carbon-components-react/lib/components/UIShell/index.js': [
          'Header',
          'HeaderName',
          'HeaderMenu',
          'HeaderMenuButton',
          'HeaderGlobalBar',
          'HeaderGlobalAction',
          'SkipToContent',
          'HeaderMenuItem',
          'HeaderNavigation',
          'HeaderPanel',
          'SideNav',
          'SideNavItems',
          'SideNavLink',
          'SideNavMenu',
          'SideNavMenuItem',
          'SideNavFooter',
        ],
      },

      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    ...prodSettings,
  ],
};
