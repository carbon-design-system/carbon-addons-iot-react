import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';
import omit from 'lodash/omit';
import { Bee16, Checkmark16 } from '@carbon/icons-react';
import { spacing03, spacing06 } from '@carbon/layout';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ImageCard from './ImageCard';
import imageFile from './landscape.jpg';

const content = {
  src: imageFile,
  alt: 'Sample image',
  zoomMax: 10,
  hasInsertFromUrl: true,
};

const values = {
  hotspots: [
    {
      x: 35,
      y: 65,
      icon: 'arrowDown',
      color: 'purple',
      content: <span style={{ padding: spacing03 }}>Elevators</span>,
    },
    {
      x: 45,
      y: 25,
      color: '#0f0',
      content: <span style={{ padding: spacing03 }}>Stairs</span>,
    },
    {
      x: 45,
      y: 50,
      color: '#00f',
      content: <span style={{ padding: spacing03 }}>Vent Fan</span>,
    },
    {
      x: 45,
      y: 75,
      icon: 'arrowUp',
      content: <span style={{ padding: spacing03 }}>Humidity Sensor</span>,
    },
  ],
};

export default {
  title: __DEV__ ? 'Watson IoT/ImageCard ⚠️' : 'Watson IoT/ImageCard',

  parameters: {
    component: ImageCard,
  },
};

export const Basic = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGEWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}
    >
      <ImageCard
        title={text('title', 'Image')}
        id="image-hotspots"
        content={object('content', content)}
        values={{
          hotspots: [
            {
              x: 35,
              y: 65,
              icon: 'User',
              color: 'purple',
              content: {
                title: 'My Device',
                description: 'Description',
                values: { deviceid: '73000', temperature: 35.05 },
                attributes: [
                  {
                    dataSourceId: 'temperature',
                    label: 'Temp',
                    precision: 2,
                  },
                ],
              },
            },
            {
              x: 45,
              y: 75,
              icon: 'Location',
              color: 'purple',
              content: {
                title: 'My Device',
                description: 'Description',
                values: { deviceid: '73000', temperature: 35.05 },
                attributes: [
                  {
                    dataSourceId: 'temperature',
                    label: 'Temp',
                    precision: 2,
                    thresholds: [
                      {
                        comparison: '>',
                        value: 0,
                        icon: 'Warning alt',
                        color: 'red',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        }}
        breakpoint="lg"
        size={size}
        onCardAction={action('onCardAction')}
      />
    </div>
  );
};

Basic.story = {
  name: 'basic',
};

export const CustomRenderIconByName = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGEWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}
    >
      <ImageCard
        title={text('title', 'Image')}
        id="image-hotspots"
        content={object('content', content)}
        values={object('values', values)}
        breakpoint="lg"
        size={size}
        renderIconByName={(name, props = {}) =>
          name === 'arrowDown' ? (
            <Bee16 {...props}>
              <title>{props.title}</title>
            </Bee16>
          ) : name === 'arrowUp' ? (
            <Checkmark16 {...props}>
              <title>{props.title}</title>
            </Checkmark16>
          ) : (
            <span>Unknown</span>
          )
        }
        onCardAction={action('onCardAction')}
      />
    </div>
  );
};

CustomRenderIconByName.story = {
  name: 'custom renderIconByName',
};

export const IsEditable = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGEWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}
    >
      <ImageCard
        title={text('title', 'Image')}
        isEditable
        id="image-hotspots"
        content={object('content', omit(content, ['src']))}
        values={object('values', values)}
        breakpoint="lg"
        size={size}
        onCardAction={action('onCardAction')}
      />
    </div>
  );
};

IsEditable.story = {
  name: 'isEditable (experimental)',
};

export const HotspotsAreLoading = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGEWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}
    >
      <ImageCard
        title={text('title', 'Image')}
        isLoading={boolean('isLoading', true)}
        id="image-hotspots"
        content={object('content', content)}
        values={object('values', values)}
        breakpoint="lg"
        size={size}
        onCardAction={action('onCardAction')}
      />
    </div>
  );
};

HotspotsAreLoading.story = {
  name: 'hotspots are loading',
};

export const Error = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGEWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}
    >
      <ImageCard
        title={text('title', 'Image')}
        isLoading={boolean('isLoading', true)}
        id="image-hotspots"
        content={object('content', content)}
        values={object('values', values)}
        breakpoint="lg"
        size={size}
        onCardAction={action('onCardAction')}
        error={text('error', 'API threw Nullpointer')}
      />
    </div>
  );
};

Error.story = {
  name: 'error',
};

export const ErrorLoadingImage = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGEWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}
    >
      <ImageCard
        title={text('title', 'Image')}
        isLoading={boolean('isLoading', true)}
        id="image-hotspots"
        content={object('content', omit(content, ['src']))}
        values={object('values', values)}
        breakpoint="lg"
        size={size}
        onCardAction={action('onCardAction')}
        error={text('error', `Error no image found called ImageID`)}
      />
    </div>
  );
};

ErrorLoadingImage.story = {
  name: 'error loading image',
};

export const ValidationError = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGEWIDE);
  return (
    <div
      style={{
        width: `${getCardMinSize('lg', size).x}px`,
        margin: spacing06,
      }}
    >
      <ImageCard
        title={text('title', 'Image')}
        isEditable
        id="image-hotspots"
        content={object('content', omit(content, ['src']))}
        values={object('values', values)}
        breakpoint="lg"
        size={size}
        onCardAction={action('onCardAction')}
        validateUploadedImage={(image) => `This file is invalid: ${image?.name}`}
      />
    </div>
  );
};

ValidationError.story = {
  name: 'image upload error',
};
