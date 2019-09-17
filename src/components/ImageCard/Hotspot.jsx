import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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

const StyledHotspot = styled(({ className, children }) => (
  <div className={className}>{children}</div>
))`
  position: absolute;
  ${props => `
    top: calc(${props.y}% - ${props.height / 2}px);
    left: calc(${props.x}% - ${props.width / 2}px);
  `}
  font-family: Sans-Serif;
  pointer-events: auto;

  .bx--tooltip__label {
    ${props =>
      props.icon
        ? `
      border: solid 1px #aaa;
      cursor: pointer;
      padding: 4px;
      background: white;
      opacity: 0.9;
      border-radius: 4px;
      box-shadow: 0 0 8px #777;
    `
        : `
      cursor: pointer;
      box-shadow: 0 0 4px #999;
      border-radius: 13px;
      background: none;
        `}
  }
`;

/**
 * This component renders a hotspot with content over an image
 */
const Hotspot = ({ x, y, content, icon, color, width, height, ...others }) => {
  const defaultIcon = (
    <svg width={width} height={height}>
      <circle
        cx={width / 2}
        cy={height / 2}
        r={width / 2 - 1}
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="1"
      />
      <circle
        cx={width / 2}
        cy={height / 2}
        r={width / 2 - 1}
        stroke="none"
        fill={color}
        opacity="0.7"
      />
    </svg>
  );

  return (
    <StyledHotspot x={x} y={y} width={width} height={height} icon={icon}>
      <Tooltip
        {...others}
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
    </StyledHotspot>
  );
};

Hotspot.propTypes = propTypes;
Hotspot.defaultProps = defaultProps;

export default Hotspot;
