import { create } from '@storybook/theming';
import { g10 } from '@carbon/themes';
import { name, homepage } from '../package.json';

const { field01, interactive01, text01, text04, ui01, ui03, ui04, uiBackground } = g10;

export default create({
  base: 'light',

  colorPrimary: interactive01,
  colorSecondary: ui04,

  // UI
  appBg: ui01,
  appContentBg: uiBackground,
  appBorderColor: ui04,
  appBorderRadius: 0,

  // Typography
  fontBase: '"IBM Plex Sans", sans-serif',
  fontCode: '"IBM Plex Mono", monospace',

  // Text colors
  textColor: text01,
  textInverseColor: text04,

  // Toolbar default and active colors
  barTextColor: text01,
  barSelectedColor: interactive01,
  barBg: uiBackground,

  // Form colors
  inputBg: field01,
  inputBorder: ui03,
  inputTextColor: text01,
  inputBorderRadius: 0,

  brandTitle: name,
  brandUrl: homepage,
  //   brandImage:
  //     'https://user-images.githubusercontent.com/3360588/59875762-3add3180-9367-11e9-8a65-a6cf7efa5061.png',
});
