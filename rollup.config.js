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

const packageJson = require('./package.json');

const env = process.env.NODE_ENV || 'development';
const prodSettings = env === 'development' ? [] : [uglify(), filesize()];

const extensions = ['.mjs', '.js', '.jsx', '.json'];
const globals = {
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
  'react-sizeme': 'ReactSizeme',
  'element-resize-detector': 'ElementResizeDetector',
  lodash: 'lodash',
};

const external = id => {
  return (
    Object.keys(packageJson.peerDependencies).some(element => id === element) ||
    Object.keys(packageJson.dependencies).some(element => id === element) ||
    id.includes('lodash/') ||
    id.includes('core-js/') ||
    id.includes('moment/')
  );
};
const plugins = [
  resolve({ mainFields: ['module', 'main'], extensions }),

  commonjs({
    namedExports: {
      'react/index.js': [
        'Children',
        'Component',
        'PureComponent',
        'Fragment',
        'PropTypes',
        'createElement',
      ],
      'react-dom/index.js': ['render'],
      'react-is/index.js': ['isForwardRef'],
      'core-js': 'CoreJs',
    },

    include: '/node_modules/',
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
];

export default [
  // CommonJS & ESM
  {
    input: 'src/index.js',
    preserveModules: true,
    output: [
      {
        dir: 'lib',
        name: 'CarbonAddonsIoTReact',
        format: 'cjs',
      },
      {
        dir: 'es',
        format: 'esm',
      },
    ],
    external,
    plugins: [...plugins, ...prodSettings],
  },
  // Compile styles
  {
    input: 'src/styles.scss',
    output: [
      {
        dir: 'tmp',
        format: 'esm',
      },
    ],
    plugins: [
      postcss({
        extract: 'lib/css/carbon-addons-iot-react.css',
        sourceMap: true,
        use: ['sass'],
        plugins: [autoprefixer],
      }),
    ],
  },
  // UMD
  {
    input: 'src/index.js',
    output: [
      {
        // output to tmp folder until umd build can be fixed.
        file: 'tmp/carbon-addons-iot-react.js',
        name: 'CarbonAddonsIoTReact',
        format: 'umd',
        globals: {
          ...globals,
        },
      },
    ],
    external,
    plugins: [
      copy({
        flatten: false,
        targets: [
          // Sass entrypoint
          { src: 'src/styles.scss', dest: ['lib/scss', 'scss'] },

          // Sass globals
          {
            src: 'src/globals',
            dest: ['lib/scss', 'scss'],
          },

          // Sass components
          {
            src: ['src/components/**/*.scss', '!src/components/**/*.story.scss'],
            dest: ['lib/scss', 'scss'],
          },
          // react-resizable
          {
            src: [
              'node_modules/react-resizable/css/**/*.css',
              'node_modules/react-grid-layout/css/**/*.css',
            ],
            dest: ['es/node_modules', 'lib/node_modules'],
          },
          // Copy CSS
          {
            src: ['lib/css/'],
            dest: ['./'],
          },
        ],
        verbose: env !== 'development', // logs the file copy list on production builds for easier debugging
      }),
      ...plugins,
      ...prodSettings,
    ],
  },
];
