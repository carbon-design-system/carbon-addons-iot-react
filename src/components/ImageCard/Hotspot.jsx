import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Tooltip } from 'carbon-components-react';

import icons from '../../utils/bundledIcons';

export const propTypes = {
  /** percentage from the left of the image to show this hotspot */
  x: PropTypes.number.isRequired,
  /** percentage from the top of the image to show this hotspot */
  y: PropTypes.number.isRequired,
  /** the content of the hotspot */
  content: PropTypes.element.isRequired,
  /** points to one of our enumerated icon names (ex. caretUp, edit, close)
   * TODO: add support for the carbon icon object (svgData, viewBox, width, height)
   */
  icon: PropTypes.string,
  iconDescription: PropTypes.string,
  /** color of the hotspot */
  color: PropTypes.string,
  /** width of the hotspot */
  width: PropTypes.number,
  /** height of the hotspot */
  height: PropTypes.number,
  /** optional function to provide icon based on name */
  renderIconByName: PropTypes.func,
};

const defaultProps = {
  icon: null,
  iconDescription: '',
  color: 'blue',
  width: 25,
  height: 25,
  renderIconByName: null,
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
const Hotspot = ({
  x,
  y,
  content,
  icon,
  iconDescription,
  color,
  width,
  height,
  renderIconByName,
  ...others
}) => {
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

  const iconToRender = icon ? (
    renderIconByName ? (
      renderIconByName(icon, {
        title: iconDescription,
        fill: color,
        width,
        height,
      })
    ) : (
      <Icon
        icon={icons[icon] || icons.help}
        fill={color}
        width={parseInt(width, 10).toString()}
        height={parseInt(height, 10).toString()}
        description={iconDescription}
      />
    )
  ) : (
    defaultIcon
  );

  return (
    <StyledHotspot x={x} y={y} width={width} height={height} icon={icon}>
      <Tooltip
        {...others}
        triggerText={iconToRender}
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
