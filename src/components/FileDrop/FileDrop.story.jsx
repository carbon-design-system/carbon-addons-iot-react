import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import FileDrop from './FileDrop';

const FileDropProps = {
  title: 'Upload Files',
  description: 'Any file can be uploaded.  Feel free to upload more than one!',
  buttonLabel: 'Try it out!',
  kind: 'browse',
  onData: action('onData'),
  onError: action('onError'),
};

storiesOf('Watson IoT|FileDrop', module)
  .add('Browse', () => (
    <FileDrop
      {...FileDropProps}
      title={text('title', 'Upload Files')}
      description={text(
        'description',
        'Any file can be uploaded.  Feel free to upload more than one!'
      )}
    />
  ))
  .add('Browse only one', () => (
    <FileDrop {...FileDropProps} description="Only one file can be uploaded" multiple={false} />
  ))
  .add('Drag and drop', () => <FileDrop {...FileDropProps} kind="drag-and-drop" />)
  .add('Drag only one file', () => (
    <FileDrop
      {...FileDropProps}
      description="Only one file can be uploaded"
      multiple={false}
      kind="drag-and-drop"
    />
  ))
  .add('Show files false', () => (
    <FileDrop
      {...FileDropProps}
      description="Only one file can be uploaded"
      showFiles={false}
      multiple={false}
      kind="drag-and-drop"
    />
  ))
  .add('Accept JSON', () => (
    <FileDrop
      {...FileDropProps}
      description="Only JSON can be uploaded"
      accept={['json']}
      kind="drag-and-drop"
    />
  ));
