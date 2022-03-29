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
  title: '1 - Watson IoT/File uploader',

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

BrowseOnlyOne.storyName = 'Browse only one';

export const DragAndDrop = () => <FileDrop {...FileDropProps} kind="drag-and-drop" />;

DragAndDrop.storyName = 'Drag and drop';

export const DragOnlyOneFile = () => (
  <FileDrop
    {...FileDropProps}
    description="Only one file can be uploaded"
    multiple={false}
    kind="drag-and-drop"
  />
);

DragOnlyOneFile.storyName = 'Drag only one file';

export const ShowFilesFalse = () => (
  <FileDrop
    {...FileDropProps}
    description="Only one file can be uploaded"
    showFiles={false}
    multiple={false}
    kind="drag-and-drop"
  />
);

ShowFilesFalse.storyName = 'Show files false';

export const AcceptJson = () => (
  <FileDrop
    {...FileDropProps}
    description="Only JSON can be uploaded"
    accept={['json']}
    fileType="TEXT"
    kind="drag-and-drop"
  />
);

AcceptJson.storyName = 'Accept JSON';
