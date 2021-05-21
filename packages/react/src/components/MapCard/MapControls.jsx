import React from 'react';
import { settings } from '../../constants/Settings';
import { Button } from '../../index';
import { Layers16 } from '@carbon/icons-react';
import classnames from 'classnames';
const { iotPrefix } = settings;
const BASE_CLASS_NAME = `${iotPrefix}--map-controls`;

const MapControls = ({
  layeredControls,
  controls,
  tooltipPosition,
  layerTriggerIconDescription,
  isExpandedMode,
}) => {
  const [layersOpen, setLayersOpen] = React.useState(false);
  const handleLayerClick = () => {
    setLayersOpen((openState) => !openState);
  };

  const buttonSize = isExpandedMode ? 'field' : 'small';

  const renderControl = (control, index) => {
    if (control.group) {
      return (
        <div
          key={`${control.iconDescription}-container-${index}`}
          className={`${BASE_CLASS_NAME}-btn-group`}
        >
          {control.group.map((control, i) => {
            return (
              <Button
                key={`${control.iconDescription}-${i}`}
                className={`${BASE_CLASS_NAME}-btn`}
                kind="ghost"
                size={buttonSize}
                hasIconOnly
                tooltipPosition={tooltipPosition}
                renderIcon={control.icon}
                iconDescription={control.iconDescription}
                onClick={control.onClick}
              />
            );
          })}
        </div>
      );
    }
    return (
      <Button
        key={`${control.iconDescription}-${index}`}
        className={`${BASE_CLASS_NAME}-btn`}
        kind="ghost"
        size={buttonSize}
        hasIconOnly
        renderIcon={control.icon}
        tooltipPosition={tooltipPosition}
        iconDescription={control.iconDescription}
        onClick={control.onClick}
      />
    );
  };

  const renderLayers = (layer, i) => (
    <Button
      key={`${layer.iconDescription}-${i}`}
      className={`${BASE_CLASS_NAME}-layers-btn`}
      kind="ghost"
      size={buttonSize}
      hasIconOnly
      tabIndex={layersOpen ? 0 : -1}
      tooltipPosition={tooltipPosition}
      renderIcon={layer.icon}
      iconDescription={layer.iconDescription}
      onClick={layer.onClick}
    />
  );

  return (
    <div
      className={classnames(`${BASE_CLASS_NAME}-container`, {
        [`${BASE_CLASS_NAME}-container__has-layers`]: layeredControls,
      })}
    >
      {layeredControls && (
        <div
          className={classnames(`${BASE_CLASS_NAME}-layers`, {
            [`${BASE_CLASS_NAME}-layers__open`]: layersOpen,
          })}
        >
          <Button
            className={`${BASE_CLASS_NAME}-layers-trigger`}
            kind="ghost"
            size={buttonSize}
            hasIconOnly
            tooltipPosition={tooltipPosition}
            renderIcon={Layers16}
            iconDescription={layerTriggerIconDescription}
            onClick={handleLayerClick}
          />
          <div className={`${BASE_CLASS_NAME}-layers-wrapper`}>
            {layeredControls.map(renderLayers)}
          </div>
        </div>
      )}
      {controls.map(renderControl)}
    </div>
  );
};

export default MapControls;
