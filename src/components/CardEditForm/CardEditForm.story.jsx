import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import CardEditForm from './CardEditForm';

const commonProps = {
  onChange: action('onChange'),
};

storiesOf('Watson IoT/CardEditForm', module).add('default', () => (
  <div style={{ position: 'absolute', right: 0, height: 'calc(100vh - 6rem)' }}>
    <CardEditForm {...commonProps} />
  </div>
));
