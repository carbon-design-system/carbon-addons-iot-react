import React from 'react';
import { initializeRTL } from 'storybook-addon-rtl';

initializeRTL();

import Container from './Container';

export const parameters = {
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
};

export const decorators = [story => <Container story={story} />];
