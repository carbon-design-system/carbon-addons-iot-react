import React, { useMemo, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import classnames from 'classnames';
import { Maximize16, Close16 } from '@carbon/icons-react';
import { useLangDirection } from 'use-lang-direction';

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
  closeSideBarIconText: 'Close',
  expandLabel: 'Expand',
  layerTriggerIconDescription: 'Layered controls'
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
  layeredControls,
  onCardAction,
  sideBarContent: SideBarContent,
  ...others
}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [action, setAction] = useState(null);
  const mergedI18n = useMemo(() => ({ ...defaultStrings, ...i18n }), [i18n]);
  const langDir = useLangDirection();
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);
  const layout = determineLayout(newSize);
  const BASE_CLASS_NAME = `${iotPrefix}--map`;

  useEffect(
    () => {
      console.log('Settings have changed, ', settingsOpen, action)
      onCardAction(action?.id, action?.action);
    }, [action]
  );

  const handleOnCardAction = (id, action) => {
    setAction({id,action});
    if (action === 'ON_SETTINGS_CLICK') {
      setSettingsOpen((oldSettingsOpen) => !oldSettingsOpen);
    }
  };

  const tooltipPosition = React.useMemo(() => {
    if (langDir === 'ltr') {
      return 'left';
    } else {
      return 'right';
    }
  },[langDir])
  const controls = mapControls || layeredControls ? <MapControls controls={mapControls} layeredControls={layeredControls} tooltipPosition={tooltipPosition} layerTriggerIconDescription={mergedI18n.layerTriggerIconDescription} /> : null;
  return (
    <Card
      title={mergedI18n.cardTitle}
      size={newSize}
      availableActions={availableActions}
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
        <div className={`${BASE_CLASS_NAME}-controls`}>
          { controls }
          <ZoomControl
            i18n={{ zoomIn: mergedI18n.zoomIn, zoomOut: mergedI18n.zoomOut }}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            tooltipPosition={tooltipPosition}
          />
        </div>
        <Legend title={mergedI18n.legendTitle} stops={stops} isFullWidth={isLegendFullWidth} />
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
