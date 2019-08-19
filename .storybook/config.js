import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { initializeRTL } from 'storybook-addon-rtl';
import theme from './theme';

initializeRTL();

import Container from './Container';

addParameters({
  options: {
    theme: theme,
  },
});

addDecorator(
  withInfo({
    inline: false, // Global configuration for the info addon across all of your stories.
  })
);
addDecorator(story => <Container story={story} />);
addDecorator(withA11y);
addDecorator(withKnobs);

function loadStories() {
  require('./Welcome.story.jsx'); // Welcome story should always be the first in the side nav heirarchy

  const req = require.context('../src/components', true, /\.story\.jsx$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
