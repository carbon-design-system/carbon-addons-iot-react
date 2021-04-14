import React, { useRef, useEffect, useState } from 'react';

import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import View from 'ol/View';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import Snap from 'ol/interaction/Snap';
import MapboxVector from 'ol/layer/MapboxVector';
import VectorImage from 'ol/layer/VectorImage';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import { defaults } from 'ol/control';

import classnames from 'classnames';

import Card from '../Card/Card';
import Optionsfield from './Optionsfield';
import ZoomControl from './ZoomControl';

import { getUpdatedCardSize } from '../../utils/cardUtilityFunctions';
import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';

import { determineLayout } from '../ValueCard/valueCardUtils';

import Legend from './Legend';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const view = new View({
  center: fromLonLat([5, 35]),
  zoom: '2.5',
});

const staticFeature = new Feature({
  geometry: new Point([0, 0]),
});
const staticSource = new VectorSource({
  features: [staticFeature],
});
const staticLayer = new VectorLayer({
  source: staticSource,
});
const pointerMoveSnap = new Snap({
  source: staticSource,
  pixelTolerance: 200,
});

const getColor = (feature, featureName = 'population') => {
  const gdp = feature.get('gdp_md_est');
  const pop = feature.get('pop_est');
  [0, '#f8d5cc'],
    [1000000, '#f4bfb6'],
    [5000000, '#f1a8a5'],
    [10000000, '#ee8f9a'],
    [50000000, '#ec739b'],
    [100000000, '#dd5ca8'],
    [250000000, '#c44cc0'],
    [500000000, '#9f43d7'],
    [1000000000, '#6e40e6'];
  if (featureName === 'population') {
    switch (true) {
      case pop > 1000000 && pop < 5000000:
        return '#f4bfb6';
      case pop > 5000000 && pop < 10000000:
        return '#f1a8a5';
      case pop > 10000000 && pop < 50000000:
        return '#ee8f9a';
      case pop > 50000000 && pop < 100000000:
        return '#ec739b';
      case pop > 100000000 && pop < 250000000:
        return '#dd5ca8';
      case pop > 250000000 && pop < 500000000:
        return '#c44cc0';
      case pop > 500000000 && pop < 1000000000:
        return '#9f43d7';
      case pop > 1000000000:
        return '#6e40e6';
      default:
        return '#f8d5cc';
    }
  } else {
    switch (true) {
      case gdp > 5000 && gdp < 10000:
        return '#f4bfb6';
      case gdp > 10000 && gdp < 50000:
        return '#ee8f9a';
      case gdp > 50000 && gdp < 100000:
        return '#ec739b';
      case gdp > 100000 && gdp < 250000:
        return '#dd5ca8';
      case gdp > 250000 && gdp < 5000000:
        return '#c44cc0';
      case gdp > 5000000 && gdp < 10000000:
        return '#9f43d7';
      case gdp > 10000000:
        return '#6e40e6';
      default:
        return '#f8d5cc';
    }
  }
};

const gdp = new VectorImage({
  source: new VectorSource({
    url:
      'https://raw.githubusercontent.com/mapbox/mapbox-react-examples/master/data-overlay/src/data.json',
    format: new GeoJSON(),
  }),
  visible: true,
  title: 'GDP',
  style: (feature) => {
    return new Style({
      fill: new Fill({
        color: getColor(feature, 'GDP'),
      }),
    });
  },
});

const population = new VectorImage({
  source: new VectorSource({
    url:
      'https://raw.githubusercontent.com/mapbox/mapbox-react-examples/master/data-overlay/src/data.json',
    format: new GeoJSON(),
  }),
  visible: false,
  title: 'Population',
  style: (feature) => {
    return new Style({
      fill: new Fill({
        color: getColor(feature),
      }),
    });
  },
});

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
      [1000000000, '#6e40e6'],
    ],
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
      [10000000, '#6e40e6'],
    ],
  },
];

const OLMapCard = ({
  availableActions,
  size = 'LARGEWIDE',
  isResizable,
  resizeHandles,
  i18n = {
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom out',
  },
  id,
  isFullWidth,
  ...others
}) => {
  const mapRef = useRef();
  const [active, setActive] = useState(options[0]);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const mapObject = new Map({
      layers: [
        new MapboxVector({
          styleUrl: 'mapbox://styles/carbondesignsystem/ck7c8ce1y05h61ipb2fixfe76',
          accessToken:
            'pk.eyJ1IjoiZGF2aWRpY3VzIiwiYSI6ImNrbTN4OWpsZTBjYm0ybnBsaWZkemV6MmgifQ.jpqC4rJzYG6CY3IXc9NLuw',
        }),
      ],
      title: 'Main',
      controls: defaults({
        rotate: false,
        zoom: false,
      }),
      view: view,
      loadTilesWhileAnimating: true,
    });
    mapObject.setTarget(mapRef.current);
    mapObject.addLayer(gdp);
    mapObject.addLayer(population);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, []);

  const newSize = getUpdatedCardSize(size);
  const layout = determineLayout(newSize);
  const BASE_CLASS_NAME = `${iotPrefix}--map`;

  const changeState = (i) => {
    setActive(options[i]);
    map.getLayers().forEach(function (lyr) {
      if (lyr.get('title')) {
        lyr.setVisible(!lyr.get('visible'));
      }
    });
    console.log(map.getView().getZoom());
  };

  const defaultOnZoomIn = () => {
    map.getView().animate({
      zoom: map.getView().getZoom() + 1,
      duration: 250,
    });
  };

  const defaultOnZoomOut = () => {
    map.getView().animate({
      zoom: map.getView().getZoom() - 1,
      duration: 250,
    });
  };

  return (
    <Card
      title={active.name}
      size={newSize}
      availableActions={{ expand: true }}
      isResizable={isResizable}
      resizeHandles={resizeHandles}
      i18n={i18n}
      id={id}
      className={classnames(`${BASE_CLASS_NAME}`, {
        // allows attribute overflow scrolling
        [`${BASE_CLASS_NAME}__has-fullwidth-legend`]: isFullWidth,
        [`${BASE_CLASS_NAME}__vertical`]: layout === CARD_LAYOUTS.VERTICAL,
      })}
      {...others}
    >
      <div id="map" ref={mapRef}>
        <Optionsfield options={options} property={active.property} changeState={changeState} />
        <ZoomControl
          i18n={{ zoomIn: i18n.zoomIn, zoomOut: i18n.zoomOut }}
          onZoomIn={defaultOnZoomIn}
          onZoomOut={defaultOnZoomOut}
        />
        <Legend active={active} stops={active.stops} isFullWidth={isFullWidth} />
      </div>
    </Card>
  );
};

export default OLMapCard;

// map.addInteraction(pointerMoveSnap);

// map.on("pointermove", e => {
//   console.log(e.coordinate);
// });
