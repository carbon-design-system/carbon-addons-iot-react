import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ImageCard from './ImageCard';
import imageFile from './landscape.jpg';

const image = { src: imageFile, alt: 'Sample image' };

storiesOf('ImageCard (Experimental)', module).add('basic', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XLARGE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <ImageCard
        title={text('title', 'Image')}
        id="image-hotspots"
        content={object('content', {
          data: image,
        })}
        breakpoint="lg"
        size={size}
      />
    </div>
  );
});
