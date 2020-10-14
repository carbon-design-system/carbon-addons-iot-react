import React from 'react';
import { initializeRTL } from 'storybook-addon-rtl';

initializeRTL();

import Container from './Container';

export const parameters = {
  options: {
    storySort: (storyId, storeItem, kindParameters, globalParameters) =>
      storyId[1].kind === storeItem[1].kind
        ? 0
        : storyId[1].id.localeCompare(storeItem[1].id, undefined, {
            numeric: true,
          }),
  },
};

export const decorators = [(story) => <Container story={story} />];
