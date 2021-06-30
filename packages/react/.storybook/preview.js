import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { configureActions } from '@storybook/addon-actions';
import { initializeRTL } from 'storybook-addon-rtl';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

initializeRTL();

import Container from './Container';

configureActions({
  depth: 3,
});

export const parameters = {
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  options: {
    storySort: (a, b) =>
      a[1].kind.replace(/☢️-|🚫-|⚠️-/i, '') === b[1].kind.replace(/☢️-|🚫-|⚠️-/i, '')
        ? 0
        : a[1].id
            .replace(/☢️-|🚫-|⚠️-/i, '')
            .localeCompare(b[1].id.replace(/☢️-|🚫-|⚠️-/i, ''), undefined, { numeric: true }),
  },
  a11y: {
    element: '#root',
    config: {},
    options: {},
    manual: true,
  },
};

export const decorators = [
  withInfo({
    inline: false, // Global configuration for the info addon across all of your stories.
  }),
  (story) => <Container story={story} />,
  withKnobs,
];
