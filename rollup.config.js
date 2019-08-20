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
        { src: 'styles.scss', dest: 'lib/scss/globals/scss' },
        {
          src: [
            // ---------------
            // Carbon Globals
            // ---------------
            // These are listed individually so that we can easily override
            // these with our own versions of these files.
            '!node_modules/carbon-components/scss/globals/scss/styles.scss', // don't include Carbon's master sass file, we export our own
            'node_modules/carbon-components/scss/globals/scss/_feature-flags.scss',
            'node_modules/carbon-components/scss/globals/scss/_vars.scss',
            'node_modules/carbon-components/scss/globals/scss/_colors.scss',
            'node_modules/carbon-components/scss/globals/scss/_theme.scss',
            'node_modules/carbon-components/scss/globals/scss/_mixins.scss',
            'node_modules/carbon-components/scss/globals/scss/_layout.scss',
            'node_modules/carbon-components/scss/globals/scss/_layer.scss',
            'node_modules/carbon-components/scss/globals/scss/_spacing.scss',
            'node_modules/carbon-components/scss/globals/scss/_typography.scss',
            'node_modules/carbon-components/scss/globals/scss/vendor',
            'node_modules/carbon-components/scss/globals/scss/_css--reset.scss',
            'node_modules/carbon-components/scss/globals/scss/_css--font-face.scss',
            'node_modules/carbon-components/scss/globals/scss/_css--helpers.scss',
            'node_modules/carbon-components/scss/globals/scss/_css--body.scss',
            'node_modules/carbon-components/scss/globals/grid',
          ],
          dest: 'lib/scss/globals/scss',
        },
        {
          src: [
            // ------------------------------
            // Carbon Components Proxy Styles
            // ------------------------------
            // These are listed individually so that we can easily override
            // these with our own versions of these files.
            'node_modules/carbon-components/scss/components/button',
            'node_modules/carbon-components/scss/components/copy-button',
            'node_modules/carbon-components/scss/components/file-uploader',
            'node_modules/carbon-components/scss/components/checkbox',
            'node_modules/carbon-components/scss/components/combo-box',
            'node_modules/carbon-components/scss/components/radio-button',
            'node_modules/carbon-components/scss/components/toggle',
            'node_modules/carbon-components/scss/components/search',
            'node_modules/carbon-components/scss/components/select',
            'node_modules/carbon-components/scss/components/text-input',
            'node_modules/carbon-components/scss/components/text-area',
            'node_modules/carbon-components/scss/components/number-input',
            'node_modules/carbon-components/scss/components/form',
            'node_modules/carbon-components/scss/components/link',
            'node_modules/carbon-components/scss/components/list-box',
            'node_modules/carbon-components/scss/components/list',
            'node_modules/carbon-components/scss/components/data-table',
            'node_modules/carbon-components/scss/components/structured-list',
            'node_modules/carbon-components/scss/components/code-snippet',
            'node_modules/carbon-components/scss/components/overflow-menu',
            'node_modules/carbon-components/scss/components/content-switcher',
            'node_modules/carbon-components/scss/components/date-picker',
            'node_modules/carbon-components/scss/components/dropdown',
            'node_modules/carbon-components/scss/components/loading',
            'node_modules/carbon-components/scss/components/modal',
            'node_modules/carbon-components/scss/components/multi-select',
            'node_modules/carbon-components/scss/components/notification',
            'node_modules/carbon-components/scss/components/notification',
            'node_modules/carbon-components/scss/components/tooltip',
            'node_modules/carbon-components/scss/components/tabs',
            'node_modules/carbon-components/scss/components/tag',
            'node_modules/carbon-components/scss/components/pagination',
            'node_modules/carbon-components/scss/components/accordion',
            'node_modules/carbon-components/scss/components/progress-indicator',
            'node_modules/carbon-components/scss/components/breadcrumb',
            'node_modules/carbon-components/scss/components/toolbar',
            'node_modules/carbon-components/scss/components/time-picker',
            'node_modules/carbon-components/scss/components/slider',
            'node_modules/carbon-components/scss/components/tile',
            'node_modules/carbon-components/scss/components/skeleton',
            'node_modules/carbon-components/scss/components/inline-loading',
            'node_modules/carbon-components/scss/components/pagination-nav',
            'node_modules/carbon-components/scss/components/ui-shell',
          ],
          dest: 'lib/scss/components',
        },
        { src: ['src/components/AddCard/_add-card.scss'], dest: 'lib/scss/components/AddCard' },
        {
          src: ['src/components/ProgressIndicator/_progress-indicator.scss'],
          dest: 'lib/scss/components/ProgressIndicator',
        },
        { src: ['src/components/SideNav/_side-nav.scss'], dest: 'lib/scss/components/SideNav' },
      ],
      verbose: env !== 'development', // output file copy list on production builds for easier debugging
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
