import React from 'react';
import { ZoomIn32, ZoomOut32 } from '@carbon/icons-react';
import PropTypes from 'prop-types';

import Button from '../Button';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  i18n: PropTypes.shape({
    zoomIn: PropTypes.string,
    zoomOut: PropTypes.string,
  }),
  /** callback to handle zoom in */
  onZoomIn: PropTypes.func.isRequired,
  /** callback to handle zoom out */
  onZoomOut: PropTypes.func.isRequired,
  /** set true to use button size 'small' instead of size 'field' */
  smallButtons: PropTypes.bool,
  testID: PropTypes.string,
  /** position of the control buttons tooltip */
  tooltipPosition: PropTypes.oneOf(['left', 'top', 'bottom', 'right']).isRequired,
};

const defaultProps = {
  i18n: {
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom out',
  },
  smallButtons: false,
  testID: 'map-zoom-control',
};

const Zoom = ({ onZoomIn, onZoomOut, i18n, testID, tooltipPosition, smallButtons }) => {
  const buttonSize = smallButtons ? 'small' : 'field';
  return (
    <div className={`${iotPrefix}--map-zoom`} data-testid={testID}>
      <Button
        renderIcon={ZoomIn32}
        hasIconOnly
        kind="ghost"
        size={buttonSize}
        onClick={onZoomIn}
        tooltipPosition={tooltipPosition}
        iconDescription={i18n.zoomIn}
        testId={`${testID}-zoom-in`}
      />
      <Button
        renderIcon={ZoomOut32}
        hasIconOnly
        kind="ghost"
        size={buttonSize}
        onClick={onZoomOut}
        tooltipPosition={tooltipPosition}
        iconDescription={i18n.zoomOut}
        testId={`${testID}-zoom-out`}
      />
    </div>
  );
};

Zoom.defaultProps = defaultProps;
Zoom.propTypes = propTypes;
export default Zoom;
