import React, { useRef, useEffect, useState } from 'react';
import { Events32, SkillLevelAdvanced32 } from '@carbon/icons-react';
import { Accordion, AccordionItem } from 'carbon-components-react';
import mapboxgl from 'mapbox-gl';

import MapCard from './MapCard';
import Optionsfield from './Optionsfield';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGF2aWRpY3VzIiwiYSI6ImNrbTN4OWpsZTBjYm0ybnBsaWZkemV6MmgifQ.jpqC4rJzYG6CY3IXc9NLuw';

const MapBoxStory = ({data, options, isLegendFullWidth, onCardAction, availableActions, isSettingPanelOpen, ...other}) => {
  const mapContainerRef = useRef(null);
  const [active, setActive] = useState(options[0]);
  const [map, setMap] = useState(null);
  const [activeSideBar, setActiveSideBar] = useState(1);
  const mapControls = [
    {
      group: [
        {
          icon: Events32,
          iconDescription: 'GDP',
          onClick: () => changeState(1)
        },
        {
          icon: Events32,
          iconDescription: 'Population',
          onClick: () => changeState(0)
        },
        {
          icon: Events32,
          iconDescription: 'Map control 3A',
          onClick: () => changeState(1)
        }
      ]
    },
    {
      icon: Events32,
      iconDescription: 'Map control 1',
      onClick: () => changeState(0)
    },
    {
      icon: Events32,
      iconDescription: 'Map control 2',
      onClick: () => changeState(1)
    },
    {
      icon: Events32,
      iconDescription: 'Map control 3',
      onClick: () => changeState(0)
    }
  ]

  const layeredControls = [
    {
      icon: Events32,
      iconDescription: 'Map control 1',
      onClick: () => changeState(0)
    },
    {
      icon: Events32,
      iconDescription: 'Map control 2',
      onClick: () => changeState(1)
    },
    {
      icon: Events32,
      iconDescription: 'Map control 3',
      onClick: () => changeState(0)
    }
  ]
  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/carbondesignsystem/ck7c8ce1y05h61ipb2fixfe76',
      center: [5, 34],
      zoom: 1.5,
    });

    map.on('load', () => {
      map.addSource('countries', {
        type: 'geojson',
        data,
      });

      map.setLayoutProperty('country-label', 'text-field', [
        'format',
        ['get', 'name_en'],
        { 'font-scale': 1.2 },
        '\n',
        {},
      ]);

      map.addLayer(
        {
          id: 'countries',
          type: 'fill',
          source: 'countries',
        },
        'country-label'
      );

      map.setPaintProperty('countries', 'fill-color', {
        property: active.property,
        stops: active.stops,
      });

      map.resize();

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
        stops: active.stops,
      });
    }
  };

  const onZoomIn = () => {
    map.zoomIn({ duration: 250 });
  };

  const onZoomOut = () => {
    map.zoomOut({ duration: 250 });
  };

  const changeState = (i) => {
    setActive(options[i]);
  };


  const sideBarContent = () => (
    <Accordion className="settings-accordion" style={{paddingTop: 0}}>
      <AccordionItem title="GDP vs Population" onClick={() => setActiveSideBar(1)} open={activeSideBar === 1}>
        <Optionsfield options={options} property={active.property} changeState={changeState} />
      </AccordionItem>
      <AccordionItem title="Panel B" onClick={() => setActiveSideBar(2)} open={activeSideBar === 2}>
        More Map settings
      </AccordionItem>
      <AccordionItem title="Panel C" onClick={() => setActiveSideBar(3)} open={activeSideBar === 3}>
        Even more settings
      </AccordionItem>
    </Accordion>
);

  return (
    <MapCard
      id="map-card"
      availableActions={availableActions}
      mapControls={mapControls}
      mapContainerRef={mapContainerRef}
      isLegendFullWidth={isLegendFullWidth}
      options={options}
      layeredControls={layeredControls}
      stops={active.stops}
      onZoomIn={onZoomIn}
      onZoomOut={onZoomOut}
      changeState={changeState}
      onCardAction={onCardAction}
      i18n={{ cardTitle: active.name }}
      sideBarContent={sideBarContent}
      isSettingPanelOpen={isSettingPanelOpen}
      {...other}
    />
  );
};

export default MapBoxStory;