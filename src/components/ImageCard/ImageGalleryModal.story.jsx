import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';

import ImageGalleryModal from './ImageGalleryModal';

export default {
  title: 'Watson IoT/ImageCard/ImageGalleryModal',
  parameters: {
    component: ImageGalleryModal,
  },
};

export const Basic = () => {
  return (
    <ImageGalleryModal
      actions={{
        onSave: action('onSave'),
        onClose: action('onClose'),
      }}
      sendingData={boolean('sendingData', false)}
      error={select('error', [undefined, 'My error msg'], undefined)}
      open={boolean('open', true)}
      titleInputInvalid={boolean('titleInputInvalid', false)}
      titleInputInvalidText={text('titleInputInvalidText', undefined)}
    />
  );
};

Basic.story = {
  name: 'Basic',

  parameters: {
    info: {
      text: `
        This ImageGalleryModal story demonstrates the most common usage, including actions
        and validation via the knobs.`,
      propTables: [ImageGalleryModal],
    },
  },
};
