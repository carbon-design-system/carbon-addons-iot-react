import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import MessageBox from './MessageBox';

storiesOf('MessageBox', module)
  .add('warning', () => (
    <MessageBox
      type="warning"
      data={{
        message: 'Warning Message',
        details: 'Details of message',
      }}
      onClose={action('close')}
    />
  ))
  .add('error', () => (
    <MessageBox
      data={{
        message: 'Error Message',
        details: 'Details of message',
      }}
      onClose={action('close')}
    />
  ));
