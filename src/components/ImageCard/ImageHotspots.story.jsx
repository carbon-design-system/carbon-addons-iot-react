import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, object, boolean } from '@storybook/addon-knobs';
import Warning from '@carbon/icons-react/lib/warning--alt--filled/20';

import ImageHotspots from './ImageHotspots';
import landscape from './landscape.jpg';
import portrait from './portrait.jpg';

const stories = storiesOf('Watson IoT|ImagesHotspots', module);

const hotspots = [
  {
    x: 10,
    y: 20,
    content: <span style={{ padding: '10px' }}>Hotspot1</span>,
    icon: Warning,
    color: 'white',
    width: 20,
    height: 20,
  },
  {
    x: 50,
    y: 10,
    content: <span style={{ padding: '10px' }}>Hotspot2</span>,
    icon: Warning,
  },
  { x: 30, y: 40, content: <span style={{ padding: '10px' }}>Hotspot3</span> },
  { x: 50, y: 60, content: <span style={{ padding: '10px' }}>Hotspot4</span>, color: 'green' },
];

stories.add('default', () => {
  return (
    <div style={{ width: '100%', height: '90vh' }}>
      <ImageHotspots
        src={text('Image', landscape)}
        alt={text('Alternate text', 'Sample image')}
        hideZoomControls={boolean('Hide zoom controls', false)}
        hotspots={object('Hotspots', hotspots)}
        hideHotspots={boolean('Hide hotspots', false)}
        hideMinimap={boolean('Hide Minimap', false)}
      />
    </div>
  );
});

stories.add('landscape image & landscape container', () => {
  return (
    <div style={{ width: '450px', height: '300px' }}>
      <ImageHotspots
        src={text('Image', landscape)}
        alt={text('Alternate text', 'Sample image')}
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
        alt={text('Alternate text', 'Sample image')}
        hideZoomControls={boolean('Hide zoom controls', false)}
        hotspots={object('Hotspots', hotspots)}
        hideHotspots={boolean('Hide hotspots', false)}
        hideMinimap={boolean('Hide Minimap', false)}
      />
    </div>
  );
});
