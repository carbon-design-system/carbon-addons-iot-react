import React, { useRef, useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { Events32, SkillLevelAdvanced32 }  from '@carbon/icons-react';


import mapboxgl from 'mapbox-gl';

import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';
import data from './data.json';

import MapBoxCard from './MapCard';
import OpenLayerMapCard from './OLMapCard';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGF2aWRpY3VzIiwiYSI6ImNrbTN4OWpsZTBjYm0ybnBsaWZkemV6MmgifQ.jpqC4rJzYG6CY3IXc9NLuw';
const options = [
  {
    name: 'Population',
    description: 'Estimated total population',
    property: 'pop_est',
    stops: [
      [0, '#f8d5cc'],
      [1000000, '#f4bfb6'],
      [5000000, '#f1a8a5'],
      [10000000, '#ee8f9a'],
      [50000000, '#ec739b'],
      [100000000, '#dd5ca8'],
      [250000000, '#c44cc0'],
      [500000000, '#9f43d7'],
      [1000000000, '#6e40e6']
    ]
  },
  {
    name: 'GDP',
    description: 'Estimate total GDP in millions of dollars',
    property: 'gdp_md_est',
    stops: [
      [0, '#f8d5cc'],
      [1000, '#f4bfb6'],
      [5000, '#f1a8a5'],
      [10000, '#ee8f9a'],
      [50000, '#ec739b'],
      [100000, '#dd5ca8'],
      [250000, '#c44cc0'],
      [5000000, '#9f43d7'],
      [10000000, '#6e40e6']
    ]
  }
];

export const Experimental = () => <StoryNotice componentName="MapCard" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

export default {
  title: 'Watson IoT Experimental/☢️ MapCard',
  parameters: {
    component: MapCard,
  },
};

export const MapCard = () => {


  const mapContainerRef = useRef(null);
  const [active, setActive] = useState(options[0]);
  const [map, setMap] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/carbondesignsystem/ck7c8ce1y05h61ipb2fixfe76',
      center: [5, 34],
      zoom: 1.5
    });

    map.on('load', () => {
      map.addSource('countries', {
        type: 'geojson',
        data
      });

      map.setLayoutProperty('country-label', 'text-field', [
        'format',
        ['get', 'name_en'],
        { 'font-scale': 1.2 },
        '\n',
        {},
        // ['get', 'name'],
        // {
        //   'font-scale': 0.8,
        //   'text-font': [
        //     'literal',
        //     ['DIN Offc Pro Italic', 'Arial Unicode MS Regular']
        //   ]
        // }
      ]);

      map.addLayer(
        {
          id: 'countries',
          type: 'fill',
          source: 'countries'
        },
        'country-label'
      );

      map.setPaintProperty('countries', 'fill-color', {
        property: active.property,
        stops: active.stops
      });

      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    paint();
  }, [active]);

  const paint = () => {
    if (map) {
      map.setPaintProperty('countries', 'fill-color', {
        property: active.property,
        stops: active.stops
      });
    }
  };

  const onZoomIn = () => {
    map.zoomIn({duration: 250});
  }

  const onZoomOut = () => {
    map.zoomOut({duration: 250});
  }

  const changeState = i => {
    setActive(options[i]);
  };

  const cardActions = [
    {
      icon: SkillLevelAdvanced32,

    }
  ]

  const onCardAction = (id, actionType) => {
    if (actionType === 'ON_SETTINGS_CLICK') {
      map.resize();
      console.log("yeeap")
    }
    action('card action clickety clacked',id,actionType)
  }

  return (
    <MapBoxCard
      id="map-card"
      mapContainerRef={mapContainerRef}
      isLegendFullWidth={boolean('isFullWidth', false)}
      options={options}
      layers={active.property}
      stops={active.stops}
      onZoomIn={onZoomIn}
      onZoomOut={onZoomOut}
      changeState={changeState}
      onCardAction={onCardAction}
      i18n={{cardTitle: active.name}}
    />
  )
};

MapCard.story = {
  name: 'MapBox example',
  decorators: [React.createElement]
};

export const OpenLayerExample = () => (
  <OpenLayerMapCard features={data} isFullWidth={boolean('isFullWidth', false)}/>
);


