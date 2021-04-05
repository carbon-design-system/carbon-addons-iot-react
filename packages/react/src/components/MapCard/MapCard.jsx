import React, { useMemo, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import { Maximize16 } from '@carbon/icons-react';

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



const defaultStrings = {
  cardTitle: 'Card Title',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom out',
}

const MapBoxCard = ({
  mapContainerRef,
  availableActions,
  size = CARD_SIZES.LARGEWIDE,
  isResizable,
  resizeHandles,
  i18n,
  id,
  isLegendFullWidth,
  changeState,
  onZoomIn,
  onZoomOut,
  stops,
  options,
  layers,
  onCardAction,
  ...others
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const mergedI18n = useMemo(() => ({...defaultStrings, ...i18n}), [i18n])
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);
  const layout = determineLayout(newSize);
  const BASE_CLASS_NAME = `${iotPrefix}--map`;

  const handleOnCardAction = (id, action) => {
    if (action === 'ON_SETTINGS_CLICK') {
      setSettingsOpen((oldSettingsOpen) => !oldSettingsOpen)
    }
    onCardAction(id, action);
  }
  return (
    <Card
      title={mergedI18n.cardTitle}
      size={newSize}
      availableActions={{expand: true, settings: true}}
      isResizable={isResizable}
      resizeHandles={resizeHandles}
      i18n={mergedI18n}
      id={id}
      onCardAction={handleOnCardAction}
      renderExpandIcon={Maximize16}
      className={classnames(`${BASE_CLASS_NAME}`,{
        // allows attribute overflow scrolling
        [`${BASE_CLASS_NAME}__settings-open`]: settingsOpen,
        [`${BASE_CLASS_NAME}__has-fullwidth-legend`]: isLegendFullWidth,
        [`${BASE_CLASS_NAME}__vertical`]: layout === CARD_LAYOUTS.VERTICAL,
      })}
      {...others}
    >
      <div ref={mapContainerRef} className={`${BASE_CLASS_NAME}-container`} >
        <ZoomControl i18n={{zoomIn: mergedI18n.zoomIn, zoomOut: mergedI18n.zoomOut}} onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
        <Legend title={mergedI18n.legendTitle} stops={stops} isFullWidth={isLegendFullWidth}  />
        <Optionsfield
          options={options}
          property={layers}
          changeState={changeState}
        />
      </div>
      <div className={`${BASE_CLASS_NAME}-settings-side-bar`}>
        <p>Sidebar</p>
      </div>
    </Card>
  );
};

export default MapBoxCard;