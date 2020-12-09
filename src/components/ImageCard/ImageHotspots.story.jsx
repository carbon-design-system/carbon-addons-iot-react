import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text, object, boolean } from '@storybook/addon-knobs';
import { spacing03 } from '@carbon/layout';

import ImageHotspots from './ImageHotspots';
import landscape from './landscape.jpg';
import portrait from './portrait.jpg';
import smallerImage from './MunichBuilding.png';

const hotspots = [
  {
    x: 10,
    y: 20,
    content: <span style={{ padding: spacing03 }}>Hotspot1</span>,
    icon: 'warning',
    color: 'white',
    width: 20,
    height: 20,
  },
  {
    x: 50,
    y: 10,
    content: <span style={{ padding: spacing03 }}>Hotspot2</span>,
    icon: 'warning',
  },
  {
    x: 30,
    y: 40,
    content: <span style={{ padding: spacing03 }}>Hotspot3</span>,
  },
  {
    x: 50,
    y: 60,
    content: {
      title: 'Hotspot3',
      values: {
        temperature: 35.35,
        humidity: 99,
      },
      attributes: [
        { dataSourceId: 'temperature', label: 'Temperature' },
        { dataSourceId: 'humidity', label: 'Humidity' },
      ],
      locale: 'en',
    },
    color: 'green',
  },
];

const componentDescription =
  'Displays an image, with optional hotspots, zoom controls, and minimap. ' +
  'When the minimap is enabled, it will only appear when the image is being dragged ' +
  '/ panned, in which it will follow the overlaying panned position.';

export default {
  title: 'Watson IoT/ImageHotspots',

  parameters: {
    component: ImageHotspots,
    info: componentDescription,
  },
};

export const LandscapeImageLandscapeContainer = () => {
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
};

LandscapeImageLandscapeContainer.story = {
  name: 'landscape image & landscape container',
};

export const LandscapeImagePortraitContainer = () => {
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
};

LandscapeImagePortraitContainer.story = {
  name: 'landscape image & portrait container',
};

export const PortraitImageLandscapeContainer = () => {
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
};

PortraitImageLandscapeContainer.story = {
  name: 'portrait image & landscape container',
};

export const PortraitImagePortraitContainer = () => {
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
};

PortraitImagePortraitContainer.story = {
  name: 'portrait image & portrait container',
};

export const ImageSmallerThanCardMinimapAndZoomcontrolsShouldBeHidden = () => {
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
};

ImageSmallerThanCardMinimapAndZoomcontrolsShouldBeHidden.story = {
  name: 'image smaller than card, minimap and zoomcontrols should be hidden',
};

export const EditableWithTextHotspot = () => {
  const WithState = () => {
    const [myHotspots, setMyHotspots] = useState([
      ...hotspots,
      {
        x: 26,
        y: 68,
        type: 'text',
        content: {
          title: 'Facility rooms',
          values: {
            temperature: 35.35,
            humidity: 99,
          },
          attributes: [
            { dataSourceId: 'temperature', label: 'Temperature' },
            { dataSourceId: 'humidity', label: 'Humidity' },
          ],
          locale: 'en',
        },
        bold: true,
        italic: false,
        underline: false,
        fontColor: '#006666',
        fontSize: 16,
        backgroundColor: '#00FF00',
        backgroundOpacity: 50,
        borderColor: '#006666',
        // borderWidth: 1,
        height: 100,
        // width: 200,
      },
      {
        x: 75,
        y: 10,
        type: 'text',
        content: { title: '' },
        // height: 36,
        // width: 100,
        backgroundColor: '#999999',
        backgroundOpacity: 50,
      },
    ]);
    const [selectedHotspotPositions, setSelectedHotspotPositions] = useState([
      { x: 75, y: 10 },
    ]);

    const onAddHotspotPosition = (position) => {
      const newHotspot = {
        ...position,
        content: (
          <span
            style={{
              padding: spacing03,
            }}>{`Hotspot ${position.x} - ${position.y}`}</span>
        ),
      };
      setMyHotspots([...myHotspots, newHotspot]);
      action('onAddHotspotPosition')(position);
    };

    const onSelectHotspot = (position) => {
      // This example use single select, but we can allow multiple selected hotspots
      // by modifying how onSelectHotspot alters the selectedHotspotPositions state.
      setSelectedHotspotPositions([position]);
      action('onSelectHotspot')(position);
    };

    const onHotspotContentChanged = (position, change) => {
      const modifiedHotspots = myHotspots.map((hotspot) =>
        hotspot.x === position.x && hotspot.y === position.y
          ? { ...hotspot, content: { ...hotspot.content, ...change } }
          : hotspot
      );
      setMyHotspots(modifiedHotspots);
      action('onHotspotContentChanged')(position, change);
    };

    return (
      <div style={{ width: '450px', height: '300px' }}>
        <ImageHotspots
          isEditable
          onAddHotspotPosition={onAddHotspotPosition}
          onSelectHotspot={onSelectHotspot}
          onHotspotContentChanged={onHotspotContentChanged}
          src={text('Image', landscape)}
          alt={text('Alternate text', 'Sample image')}
          height={300}
          width={450}
          hideZoomControls={boolean('Hide zoom controls', false)}
          hotspots={myHotspots}
          hideHotspots={boolean('Hide hotspots', false)}
          hideMinimap={boolean('Hide Minimap', false)}
          selectedHotspots={selectedHotspotPositions}
        />
      </div>
    );
  };

  return <WithState />;
};

EditableWithTextHotspot.story = {
  name: 'Editable with text hotspot',
};
