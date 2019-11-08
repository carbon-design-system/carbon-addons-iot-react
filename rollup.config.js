import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import autoprefixer from 'autoprefixer';
import json from 'rollup-plugin-json';

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
    'react-dom',
    'styled-components',
    'prop-types',
    'carbon-components-react',
    'carbon-icons',
    '@carbon/icons',
    '@carbon/icons-react',
    'carbon-components',
    'd3',
  ],
  plugins: [
    resolve({
      browser: true,
      extensions: ['.mjs', '.js', '.jsx', '.json'],
    }),
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
          src: ['src/components/**/*.scss', '!src/components/Notification/*.scss'],
          dest: 'lib/scss/components',
          rename: (name, extension) => sanitizeAndCamelCase(name, extension),
        },

        // Sass components with non-standard folder structure, or multiple files per folder
        {
          src: 'src/components/Notification/*.scss',
          dest: 'lib/scss/components/Notification',
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
    json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      exclude: ['node_modules'],

      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false

      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: '  ',

      // ignores indent and generates the smallest code
      compact: true, // Default: false

      // generate a named export for every property of the JSON object
      namedExports: true, // Default: true
    }),
    ...prodSettings,
  ],
};
