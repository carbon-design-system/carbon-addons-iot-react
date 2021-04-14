import React from 'react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
const { iotPrefix } = settings;

const Legend = (props) => {
  const renderLegendKeys = (stop, i) => {
    return (
      <div key={i} className={`${iotPrefix}--map-legend-keys`}>
        <span
          className={`${iotPrefix}--map-legend-keys-color`}
          style={{ backgroundColor: stop[1] }}
        />
        <span>{`${stop[0].toLocaleString()}`}</span>
      </div>
    );
  };

  return (
    <>
      <div
        className={classnames(`${iotPrefix}--map-legend`, {
          [`${iotPrefix}--map-legend__fullwidth`]: props.isFullWidth,
        })}
      >
        {props.stops.map(renderLegendKeys)}
      </div>
    </>
  );
};

export default Legend;
