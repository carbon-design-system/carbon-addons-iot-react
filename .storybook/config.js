import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { checkA11y } from '@storybook/addon-a11y';
// import { withKnobs } from '@storybook/addon-knobs';

import Container from './Container';

// addDecorator(withKnobs);
addDecorator(withInfo);
addDecorator(checkA11y);
addDecorator(story => <Container story={story} />);

function loadStories() {
  const req = require.context('../src/components', true, /\-story\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
