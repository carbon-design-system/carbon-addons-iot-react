import React from 'react';
import { storiesOf } from '@storybook/react';

import FileDrop from './FileDrop';

const FileDropProps = {
  title: 'Upload Files',
  description: 'Any file can be uploaded.  Feel free to upload more than one!',
  buttonLabel: 'Try it out!',
  kind: 'browse',
  onData: data => console.log('FileDrop.onData', data),
  onError: err => console.log('FileDrop.onError', err),
};

storiesOf('FileDrop', module)
  .add('Browse', () => <FileDrop {...FileDropProps} />)
  .add('Drag and drop', () => <FileDrop {...FileDropProps} kind="drag-and-drop" />);
