import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import ImageCard from './ImageCard';
import imageFile from './landscape.jpg';

const content = {
  src: imageFile,
  alt: 'Sample image',
  hotspots: [
    { x: 35, y: 65, content: <span style={{ padding: '10px' }}>Elevators</span> },
    { x: 45, y: 25, content: <span style={{ padding: '10px' }}>Stairs</span> },
    { x: 45, y: 50, content: <span style={{ padding: '10px' }}>Stairs</span> },
    { x: 45, y: 75, content: <span style={{ padding: '10px' }}>Stairs</span> },
  ],
};

storiesOf('ImageCard (Experimental)', module).add('basic', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XLARGE);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <ImageCard
        title={text('title', 'Image')}
        id="image-hotspots"
        content={object('content', content)}
        breakpoint="lg"
        size={size}
      />
    </div>
  );
});
