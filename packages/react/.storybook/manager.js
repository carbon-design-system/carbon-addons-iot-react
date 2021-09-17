import theme from './theme';
import { addons } from '@storybook/addons';

addons.setConfig({
  theme: theme,
  sidebar: {
    showRoots: true,
  },
});
