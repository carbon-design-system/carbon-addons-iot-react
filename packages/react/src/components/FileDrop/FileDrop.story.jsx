import React from 'react';
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

export default {
  title: '1 - Watson IoT/FileDrop',

  parameters: {
    component: FileDrop,
  },
};

export const Browse = () => (
  <FileDrop
    {...FileDropProps}
    title={text('title', 'Upload Files')}
    description={text(
      'description',
      'Any file can be uploaded.  Feel free to upload more than one!'
    )}
  />
);

export const BrowseOnlyOne = () => (
  <FileDrop {...FileDropProps} description="Only one file can be uploaded" multiple={false} />
);

BrowseOnlyOne.story = {
  name: 'Browse only one',
};

export const DragAndDrop = () => <FileDrop {...FileDropProps} kind="drag-and-drop" />;

DragAndDrop.story = {
  name: 'Drag and drop',
};

export const DragOnlyOneFile = () => (
  <FileDrop
    {...FileDropProps}
    description="Only one file can be uploaded"
    multiple={false}
    kind="drag-and-drop"
  />
);

DragOnlyOneFile.story = {
  name: 'Drag only one file',
};

export const ShowFilesFalse = () => (
  <FileDrop
    {...FileDropProps}
    description="Only one file can be uploaded"
    showFiles={false}
    multiple={false}
    kind="drag-and-drop"
  />
);

ShowFilesFalse.story = {
  name: 'Show files false',
};

export const AcceptJson = () => (
  <FileDrop
    {...FileDropProps}
    description="Only JSON can be uploaded"
    accept={['json']}
    fileType="TEXT"
    kind="drag-and-drop"
  />
);

AcceptJson.story = {
  name: 'Accept JSON',
};
