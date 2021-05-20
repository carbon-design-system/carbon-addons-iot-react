import React, { useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { ChevronLeft32, ChevronRight32 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';
import Button from '../Button/Button';

const { iotPrefix } = settings;

const propTypes = {
  /** True if the legend should be full bleed  and occupy the full width of the map  */
  isFullWidth: PropTypes.bool.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  titleText: PropTypes.string,
  hideLegendText: PropTypes.string,
  showLegendText: PropTypes.string,
  onCollapsToggle: PropTypes.func,
};

const defaultProps = {
  titleText: 'Legend',
  hideLegendText: 'Hide legend',
  showLegendText: 'Show legend',
};

const Legend = ({
  isFullWidth,
  stops,
  titleText,
  hideLegendText,
  showLegendText,
  isCollapsed,
  onCollapsToggle,
}) => {
  const renderLegendKeys = (stop, i) => {
    return (
      <div key={i} className={`${iotPrefix}--map-legend-keys`}>
        <span
          className={`${iotPrefix}--map-legend-keys-color`}
          style={{ backgroundColor: stop[1] }}
        />
        <span
          className={`${iotPrefix}--map-legend-keys-value`}
        >{`${stop[0].toLocaleString()}`}</span>
      </div>
    );
  };

  return isFullWidth ? (
    <div
      className={classnames(`${iotPrefix}--map-legend`, `${iotPrefix}--map-legend__fullwidth`, {
        [`${iotPrefix}--map-legend__fullwidth--collapsed`]: isCollapsed,
      })}
    >
      <Button
        className={`${iotPrefix}--map-legend__collapse-btn`}
        kind="ghost"
        size="small"
        renderIcon={isCollapsed ? ChevronRight32 : ChevronLeft32}
        hasIconOnly
        iconDescription={isCollapsed ? showLegendText : hideLegendText}
        tooltipPosition={document.dir === 'rtl' ? 'left' : 'right'}
        onClick={onCollapsToggle}
      />

      <div className={`${iotPrefix}--map-legend-content`}>
        <div title={titleText} className={`${iotPrefix}--map-legend__label`}>
          {titleText}
        </div>
        <div className={`${iotPrefix}--map-legend-keys-container`}>
          {stops.map(renderLegendKeys)}
        </div>
      </div>
    </div>
  ) : (
    <div className={`${iotPrefix}--map-legend`}>{stops.map(renderLegendKeys)}</div>
  );
};

Legend.defaultProps = defaultProps;
Legend.propTypes = propTypes;
export default Legend;
