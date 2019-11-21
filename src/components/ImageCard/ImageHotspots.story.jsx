import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, object, boolean } from '@storybook/addon-knobs';

import ImageHotspots from './ImageHotspots';
import landscape from './landscape.jpg';
import portrait from './portrait.jpg';
import smallerImage from './MunichBuilding.png';

const stories = storiesOf('Watson IoT|ImageHotspots', module);

const hotspots = [
  {
    x: 10,
    y: 20,
    content: <span style={{ padding: '10px' }}>Hotspot1</span>,
    icon: 'warning',
    color: 'white',
    width: 20,
    height: 20,
  },
  {
    x: 50,
    y: 10,
    content: <span style={{ padding: '10px' }}>Hotspot2</span>,
    icon: 'warning',
  },
  { x: 30, y: 40, content: <span style={{ padding: '10px' }}>Hotspot3</span> },
  { x: 50, y: 60, content: <span style={{ padding: '10px' }}>Hotspot4</span>, color: 'green' },
];
stories.add('landscape image & landscape container', () => {
  return (
    <div style={{ width: '450px', height: '300px' }}>
      <ImageHotspots
        src={text('Image', landscape)}
        alt={text('Alternate text', 'Sample image')}
        height={300}
        width={450}
        hideZoomControls={boolean('Hide zoom controls', false)}
        hotspots={object('Hotspots', hotspots)}
        hideHotspots={boolean('Hide hotspots', false)}
        hideMinimap={boolean('Hide Minimap', false)}
      />
    </div>
  );
});

stories.add('landscape image & portrait container', () => {
  return (
    <div style={{ width: '250px', height: '300px' }}>
      <ImageHotspots
        src={text('Image', landscape)}
        alt={text('Alternate text', 'Sample image')}
        height={250}
        width={300}
        hideZoomControls={boolean('Hide zoom controls', false)}
        hotspots={object('Hotspots', hotspots)}
        hideHotspots={boolean('Hide hotspots', false)}
        hideMinimap={boolean('Hide Minimap', false)}
      />
    </div>
  );
});

stories.add('portrait image & landscape container', () => {
  return (
    <div style={{ width: '450px', height: '300px' }}>
      <ImageHotspots
        src={text('Image', portrait)}
        height={300}
        width={450}
        alt={text('Alternate text', 'Sample image')}
        hideZoomControls={boolean('Hide zoom controls', false)}
        hotspots={object('Hotspots', hotspots)}
        hideHotspots={boolean('Hide hotspots', false)}
        hideMinimap={boolean('Hide Minimap', false)}
      />
    </div>
  );
});

stories.add('portrait image & portrait container', () => {
  return (
    <div style={{ width: '225px', height: '300px' }}>
      <ImageHotspots
        src={text('Image', portrait)}
        height={300}
        width={225}
        alt={text('Alternate text', 'Sample image')}
        hideZoomControls={boolean('Hide zoom controls', false)}
        hotspots={object('Hotspots', hotspots)}
        hideHotspots={boolean('Hide hotspots', false)}
        hideMinimap={boolean('Hide Minimap', false)}
      />
    </div>
  );
});
stories.add('image smaller than card, minimap and zoomcontrols should be hidden', () => {
  return (
    <div style={{ width: '560px', height: '560px' }}>
      <ImageHotspots
        src={text('Image', smallerImage)}
        height={560}
        width={560}
        alt={text('Alternate text', 'Sample image')}
        hideZoomControls={boolean('Hide zoom controls', false)}
        hotspots={object('Hotspots', hotspots)}
        hideHotspots={boolean('Hide hotspots', false)}
        hideMinimap={boolean('Hide Minimap', false)}
      />
    </div>
  );
});
