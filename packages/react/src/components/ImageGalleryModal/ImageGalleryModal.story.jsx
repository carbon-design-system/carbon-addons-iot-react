import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, select, object } from '@storybook/addon-knobs';

import ImageGalleryModal from './ImageGalleryModal';
import assemblyline from './images/assemblyline.jpg';
import floow_plan from './images/floow_plan.png'; // eslint-disable-line camelcase
import manufacturing_plant from './images/Manufacturing_plant.png'; // eslint-disable-line camelcase
import extra_wide_image from './images/extra-wide-image.png'; // eslint-disable-line camelcase
import robot_arm from './images/robot_arm.png'; // eslint-disable-line camelcase
import tankmodal from './images/tankmodal.png';
import turbines from './images/turbines.png';
import large from './images/large.png';
import large_portrait from './images/large_portrait.png'; // eslint-disable-line camelcase

const content = [
  {
    id: 'assemblyline',
    src: assemblyline,
    alt: 'assemblyline',
    title: `custom title assemblyline that is very long a and must be managed.
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
      ad minim veniam.`,
  },
  { id: 'floow_plan', src: floow_plan, alt: 'floow plan' },
  {
    id: 'manufacturing_plant',
    src: manufacturing_plant,
    alt: 'manufacturing plant',
  },
  { id: 'robot_arm', src: robot_arm, alt: 'robot arm' },
  { id: 'tankmodal', src: tankmodal, alt: 'tankmodal' },
  { id: 'turbines', src: turbines, alt: 'turbines' },
  { id: 'extra-wide-image', src: extra_wide_image, alt: 'extra wide image' },
  { id: 'large', src: large, alt: 'large image' },
  { id: 'large_portrait', src: large_portrait, alt: 'large image portrait' },
];

export default {
  title: '1 - Watson IoT/ImageGalleryModal',

  parameters: {
    component: ImageGalleryModal,
    docs: {
      inlineStories: false,
    },
  },
};

export const Basic = () => {
  const defaultView = select('defaultView', ['list', 'grid'], 'grid');
  const editableContent = object('content', content);
  const regenerationKey = `${defaultView}${JSON.stringify(editableContent)}`;

  return (
    <div>
      <ImageGalleryModal
        key={regenerationKey} // Only used for story knob demo purpose
        onSubmit={action('onSubmit')}
        onClose={action('onClose')}
        onDelete={action('onDelete')}
        content={editableContent}
        searchProperty={select('searchProperty', ['id', 'src', 'alt', 'title'], 'src')}
        defaultView={defaultView}
      />
    </div>
  );
};

Basic.storyName = 'basic';

export const WithI18n = () => {
  return (
    <div>
      <ImageGalleryModal
        onSubmit={action('onSubmit')}
        onClose={action('onClose')}
        content={content}
        i18n={{
          gridButtonText: text('i18n.gridButtonText', 'Grid'),
          instructionText: text(
            'i18n.instructionText',
            'Select the image that you want to display on this card.'
          ),
          listButtonText: text('i18n.listButtonText', 'List'),
          modalLabelText: text('i18n.modalLabelText', 'New image card'),
          modalTitleText: text('i18n.modalTitleText', 'Image gallery'),
          modalPrimaryButtonLabelText: text('i18n.modalPrimaryButtonLabelText', 'Select'),
          modalSecondaryButtonLabelText: text('i18n.modalSecondaryButtonLabelText', 'Cancel'),
          modalCloseIconDescriptionText: text('i18n.modalCloseIconDescriptionText', 'Close'),
          searchPlaceHolderText: text('i18n.searchPlaceHolderText', 'Search image by file name'),
        }}
      />
    </div>
  );
};

WithI18n.storyName = 'With i18n';
