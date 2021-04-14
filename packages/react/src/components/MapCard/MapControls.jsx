import React from 'react';
import { settings } from '../../constants/Settings';
import { Button } from '../../index';

const { iotPrefix } = settings;
const BASE_CLASS_NAME = `${iotPrefix}--map-controls`;

const renderControl = (control) => {
  let controls;
  if (control.group) {
    return (
      <div className={`${BASE_CLASS_NAME}-btn-group`}>
        {control.group.map(control => {
          return (
            <Button
              className={`${BASE_CLASS_NAME}-btn`}
              kind="ghost"
              size="field"
              hasIconOnly
              tooltipPosition="left"
              renderIcon={control.icon}
              iconDescription={control.iconDescription}
              onClick={control.onClick}
            />
          )
        })}
      </div>
    )

  }
  return (
    <Button
      className={`${BASE_CLASS_NAME}-btn`}
      kind="ghost"
      size="field"
      hasIconOnly
      renderIcon={control.icon}
      tooltipPosition="left"
      iconDescription={control.iconDescription}
      onClick={control.onClick}
    />
  );
};
const MapControls = ({layer, controls}) => {
  const layerControl = layer
    ? <Button
        className={`${BASE_CLASS_NAME}-btn`}
        kind="ghost"
        size="field"
        hasIconOnly
        renderIcon={control.icon}
        iconDescription={control.iconDescription}
        onClick={control.onClick}
      />
    : null;
  return (
    <div className={`${BASE_CLASS_NAME}-container`}>
      {layerControl}
      {controls.map(renderControl)}
    </div>
  );
};

export default MapControls;