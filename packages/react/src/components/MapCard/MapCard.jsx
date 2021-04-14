import React, { useMemo, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import { Maximize16, Close16 } from '@carbon/icons-react';

import { Button } from '../../index';
import Legend from './Legend';
import ZoomControl from './ZoomControl';
import MapControls from './MapControls';
import data from './data.json';
import Card from '../Card/Card';
import {
  getResizeHandles,
  getUpdatedCardSize,
  handleCardVariables,
} from '../../utils/cardUtilityFunctions';
import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import { determineLayout } from '../ValueCard/valueCardUtils';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGF2aWRpY3VzIiwiYSI6ImNrbTN4OWpsZTBjYm0ybnBsaWZkemV6MmgifQ.jpqC4rJzYG6CY3IXc9NLuw';

const defaultStrings = {
  cardTitle: 'Card Title',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom out',
  configurationTitle: 'Map configuration',
  closeSideBarIconText: 'Close'
};

const MapBoxCard = ({
  mapContainerRef,
  availableActions,
  size = CARD_SIZES.LARGEWIDE,
  mapControls,
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
  sideBarContent: SideBarContent,
  ...others
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [action, setAction] = useState(null);
  const mergedI18n = useMemo(() => ({ ...defaultStrings, ...i18n }), [i18n]);
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);
  const layout = determineLayout(newSize);
  const BASE_CLASS_NAME = `${iotPrefix}--map`;

  useEffect(
    () => {
      console.log('Settings have changed, ', settingsOpen, action)
      onCardAction(action?.id, action?.action);
    }, [settingsOpen]
  );

  const handleOnCardAction = (id, action) => {
    if (action === 'ON_SETTINGS_CLICK') {
      setSettingsOpen((oldSettingsOpen) => !oldSettingsOpen);
      setAction({id,action});
    }
  };
  const controls = mapControls ? <MapControls controls={mapControls} /> : null;
  return (
    <Card
      title={mergedI18n.cardTitle}
      size={newSize}
      availableActions={{ expand: true, settings: true }}
      isResizable={isResizable}
      resizeHandles={resizeHandles}
      i18n={mergedI18n}
      id={id}
      onCardAction={handleOnCardAction}
      renderExpandIcon={Maximize16}
      className={classnames(`${BASE_CLASS_NAME}`, {
        // allows attribute overflow scrolling
        [`${BASE_CLASS_NAME}__settings-open`]: settingsOpen,
        [`${BASE_CLASS_NAME}__has-fullwidth-legend`]: isLegendFullWidth,
        [`${BASE_CLASS_NAME}__vertical`]: layout === CARD_LAYOUTS.VERTICAL,
      })}
      {...others}
    >
      <div ref={mapContainerRef} className={`${BASE_CLASS_NAME}-container`}>
        <ZoomControl
          i18n={{ zoomIn: mergedI18n.zoomIn, zoomOut: mergedI18n.zoomOut }}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
        />
        <Legend title={mergedI18n.legendTitle} stops={stops} isFullWidth={isLegendFullWidth} />
        { controls }
      </div>
      <div className={`${BASE_CLASS_NAME}-settings`}>
        <div className={`${BASE_CLASS_NAME}-settings-header`}>
          <h3 className={`${BASE_CLASS_NAME}-settings-header-title`}>{mergedI18n.configurationTitle}</h3>
          <Button
            className={`${BASE_CLASS_NAME}-settings-close-btn`}
            kind="ghost"
            size="small"
            hasIconOnly
            renderIcon={Close16}
            iconDescription={mergedI18n.closeSideBarIconText}
            onClick={() => setSettingsOpen((oldSettingsOpen) => !oldSettingsOpen)}
          />
        </div>
        <SideBarContent/>
      </div>
    </Card>
  );
};

export default MapBoxCard;
