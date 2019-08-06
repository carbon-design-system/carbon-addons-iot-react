import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Icon } from 'carbon-components-react';

export const propTypes = {
  /** percentage from the left of the image to show this hotspot */
  x: PropTypes.number.isRequired,
  /** percentage from the top of the image to show this hotspot */
  y: PropTypes.number.isRequired,
  /** the content of the hotspot */
  content: PropTypes.element.isRequired,
  /** points to the name of a carbon icon that will trigger the hotspot (see https://v9.carbondesignsystem.com/guidelines/iconography/library) */
  icon: PropTypes.string,
  /** color of the hotspot */
  color: PropTypes.string,
  /** width of the hotspot */
  width: PropTypes.number,
  /** height of the hotspot */
  height: PropTypes.number,
};

const defaultProps = {
  icon: null,
  color: 'blue',
  width: 25,
  height: 25,
};

/**
 * This component renders a hotspot with content over an image
 */
const Hotspot = ({ x, y, content, icon, color, width, height }) => {
  const hotspotStyle = {
    position: 'absolute',
    top: `${y}%`,
    left: `${x}%`,
    fontFamily: 'Sans-Serif',
  };

  const defaultIcon = (
    <svg width={width} height={height}>
      <circle
        cx={width / 2}
        cy={height / 2}
        r={width / 2}
        stroke="black"
        strokeWidth="1"
        fill={color}
        opacity="0.5"
      />
    </svg>
  );

  return (
    <div style={hotspotStyle}>
      <Tooltip
        triggerText={
          icon ? (
            <Icon fill={color} name={icon} width={`${width}px`} height={`${height}px`} />
          ) : (
            defaultIcon
          )
        }
        showIcon={false}
        clickToOpen
        triggerId={`hotspot-${x}-${y}`}
        tooltipId={`hotspot-${x}-${y}`}
      >
        {content}
      </Tooltip>
    </div>
  );
};

Hotspot.propTypes = propTypes;
Hotspot.defaultProps = defaultProps;

export default Hotspot;
