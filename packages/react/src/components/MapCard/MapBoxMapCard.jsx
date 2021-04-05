import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import Legend from './Legend';
import Optionsfield from './Optionsfield';
import ZoomControl from './ZoomControl';
import data from './data.json';
import Card from '../Card/Card';
import {
  getResizeHandles,
  getUpdatedCardSize,
  handleCardVariables,
} from '../../utils/cardUtilityFunctions';
import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import {
  determineLayout
} from '../ValueCard/valueCardUtils';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

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

const MapBoxCard = ({
  availableActions,
  size = CARD_SIZES.LARGEWIDE,
  isResizable,
  resizeHandles,
  i18n = {
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom out'
  },
  id,
  isFullWidth,
  ...others
}) => {
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
        ['get', 'name'],
        {
          'font-scale': 0.8,
          'text-font': [
            'literal',
            ['DIN Offc Pro Italic', 'Arial Unicode MS Regular']
          ]
        }
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

  const defaultOnZoomIn = () => {
    map.zoomIn({duration: 250});
  }

  const defaultOnZoomOut = () => {
    map.zoomOut({duration: 250});
  }

  const changeState = i => {
    setActive(options[i]);
    map.setPaintProperty('countries', 'fill-color', {
      property: active.property,
      stops: active.stops
    });
  };

  const i18n = {
    cardTitle: 'GDP vs. Population',
    legendTitle: active.title,
  }

  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);
  const layout = determineLayout(newSize);
  const BASE_CLASS_NAME = `${iotPrefix}--map`
  return (
    <Card
      title={active.name}
      size={newSize}
      availableActions={availableActions}
      isResizable={isResizable}
      resizeHandles={resizeHandles}
      i18n={i18n}
      id={id}
      className={classnames(`${BASE_CLASS_NAME}`,{
        // allows attribute overflow scrolling
        [`${BASE_CLASS_NAME}__has-fullwidth-legend`]: isFullWidth,
        [`${BASE_CLASS_NAME}__vertical`]: layout === CARD_LAYOUTS.VERTICAL,
      })}
      {...others}
    >
    <div ref={mapContainerRef} className={`${BASE_CLASS_NAME}-container`} >
      {/* <div className="map-header">
        <h2 className="map-header-title">{active.name}</h2>
        <p className="map-header-description">{active.description}</p>
      </div> */}
      <ZoomControl i18n={{zoomIn: i18n.zoomIn, zoomOut: i18n.zoomOut}} onZoomIn={defaultOnZoomIn} onZoomOut={defaultOnZoomOut} />
      <Legend active={active} stops={active.stops} isFullWidth={isFullWidth}  />
      <Optionsfield
        options={options}
        property={active.property}
        changeState={changeState}
      />
    </div>
    </Card>
  );
};

export default MapBoxCard;