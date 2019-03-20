import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';

import Container from './Container';

addDecorator(
  withInfo({
    inline: true, // Global configuration for the info addon across all of your stories.
  })
);
addDecorator(checkA11y);
addDecorator(withKnobs);
addDecorator(story => <Container story={story} />);

function loadStories() {
  const req = require.context('../src/components', true, /\.story\.jsx$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
