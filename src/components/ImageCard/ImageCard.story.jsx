import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, object, boolean } from '@storybook/addon-knobs';
import omit from 'lodash/omit';
import { Bee16, Checkmark16 } from '@carbon/icons-react';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ImageCard from './ImageCard';
import imageFile from './landscape.jpg';

const content = {
  src: imageFile,
  alt: 'Sample image',
  zoomMax: 10,
};

const values = {
  hotspots: [
    {
      x: 35,
      y: 65,
      icon: 'arrowDown',
      color: 'purple',
      content: <span style={{ padding: '10px' }}>Elevators</span>,
    },
    {
      x: 45,
      y: 25,
      color: '#0f0',
      content: <span style={{ padding: '10px' }}>Stairs</span>,
    },
    {
      x: 45,
      y: 50,
      color: '#00f',
      content: <span style={{ padding: '10px' }}>Vent Fan</span>,
    },
    {
      x: 45,
      y: 75,
      icon: 'arrowUp',
      content: <span style={{ padding: '10px' }}>Humidity Sensor</span>,
    },
  ],
};

storiesOf('Watson IoT|ImageCard', module)
  .add('basic', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XLARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <ImageCard
          title={text('title', 'Image')}
          id="image-hotspots"
          content={object('content', content)}
          values={object('values', values)}
          breakpoint="lg"
          size={size}
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('custom renderIconByName', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XLARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
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
  })
  .add('isEditable', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XLARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
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
  })
  .add('hotspots are loading', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XLARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
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
  })
  .add('error', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XLARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
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
  })
  .add('error loading image', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XLARGE);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
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
  });
