import React from 'react';
import { ZoomIn32, ZoomOut32 } from '@carbon/icons-react';

import Button from '../Button';
import { settings } from '../../constants/Settings';
const { iotPrefix } = settings;

const Zoom = ({
  onZoomIn,
  onZoomOut,
  i18n = {
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom out',
  },
  testId,
  tooltipPosition,
}) => {

  return (
    <div className={`${iotPrefix}--map-zoom`} data-testid={testId}>
      <Button
        renderIcon={ZoomIn32}
        hasIconOnly
        kind="ghost"
        size="field"
        onClick={onZoomIn}
        tooltipPosition={tooltipPosition}
        iconDescription={i18n.zoomIn}
        data-testid={`${testId}-zoom-in`}
      />
      <Button
        renderIcon={ZoomOut32}
        hasIconOnly
        kind="ghost"
        size="field"
        onClick={onZoomOut}
        tooltipPosition={tooltipPosition}
        iconDescription={i18n.zoomOut}
        data-testid={`${testId}-zoom-out`}
      />
    </div>
  );
};

export default Zoom;
