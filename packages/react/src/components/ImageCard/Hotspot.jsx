import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from 'carbon-components-react';

import { settings } from '../../constants/Settings';

import { HotspotContentPropTypes } from './HotspotContent';
import CardIcon from './CardIcon';

const { iotPrefix } = settings;

export const propTypes = {
  /** percentage from the left of the image to show this hotspot */
  x: PropTypes.number.isRequired,
  /** percentage from the top of the image to show this hotspot */
  y: PropTypes.number.isRequired,
  /** the content of the hotspot, either a react element or an object to use the default hotspot */
  content: PropTypes.oneOfType([PropTypes.element, PropTypes.shape(HotspotContentPropTypes)])
    .isRequired,
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
  /**
   * onClick callback for when the hotspot is clicked. Returns the event and an
   * object width the x and y coordinates */
  onClick: PropTypes.func,
  /** shows a border with padding when set to true */
  isSelected: PropTypes.bool,
};

const defaultProps = {
  icon: null,
  iconDescription: '',
  color: 'blue',
  width: 25,
  height: 25,
  renderIconByName: null,
  onClick: null,
  isSelected: false,
};

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
  onClick,
  isSelected,
  className,
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
    <CardIcon
      icon={icon}
      title={iconDescription}
      color={color}
      width={width}
      height={height}
      renderIconByName={renderIconByName}
    />
  ) : (
    defaultIcon
  );

  const id = `hotspot-${x}-${y}`;

  return (
    <div
      data-testid={id}
      className={classNames(`${iotPrefix}--hotspot-container`, {
        [`${iotPrefix}--hotspot-container--selected`]: isSelected,
        [`${iotPrefix}--hotspot-container--has-icon`]: icon,
      })}
      style={{
        '--x-pos': x,
        '--y-pos': y,
        '--width': width,
        '--height': height,
      }}
      icon={icon}
    >
      <Tooltip
        {...others}
        triggerText={iconToRender}
        showIcon={false}
        triggerId={id}
        tooltipId={id}
        onChange={(evt) => {
          if (evt.type === 'click' && onClick) {
            onClick(evt, { x, y });
          }
        }}
      >
        {content}
      </Tooltip>
    </div>
  );
};

Hotspot.propTypes = propTypes;
Hotspot.defaultProps = defaultProps;

export default Hotspot;
