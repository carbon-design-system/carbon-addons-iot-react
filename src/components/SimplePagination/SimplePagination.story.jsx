import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs';

import SimplePagination from './SimplePagination';

storiesOf('SimplePagination', module).add('default', () => (
  <SimplePagination
    page={number('page', 1)}
    maxPage={number('maxPage', 4)}
    onPage={action('onPage')}
  />
));
