import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tooltip } from 'carbon-components-react';
import { g10 } from '@carbon/themes';
import { withSize } from 'react-sizeme';

import { settings } from '../../constants/Settings';
import { hexToRgb } from '../../utils/componentUtilityFunctions';

import { HotspotContentPropTypes } from './HotspotContent';
import CardIcon from './CardIcon';

const { iotPrefix } = settings;
const { ui01, text01, ui03 } = g10;

export const propTypes = {
  /** percentage from the left of the image to show this hotspot */
  x: PropTypes.number.isRequired,
  /** percentage from the top of the image to show this hotspot */
  y: PropTypes.number.isRequired,
  /** the content of the hotspot, either a react element or an object to use the default hotspot */
  content: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.shape(HotspotContentPropTypes),
  ]).isRequired,
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
  /** determines the type of hotspot to render. Defaults to 'fixed'. */
  type: PropTypes.oneOf(['fixed', 'variable', 'text']),
  /** For text hotspots, true if title should be bold */
  bold: PropTypes.bool,
  /** For text hotspots, true if title should be italic */
  italic: PropTypes.bool,
  /** For text hotspots, true if title should be underline */
  underline: PropTypes.bool,
  /** For text hotspots, the hexdec color of the title font, e.g. #ff0000  */
  fontColor: PropTypes.string,
  /** For text hotspots, the size in px of the font, e.g. 12  */
  fontSize: PropTypes.number,
  /** For text hotspots, the hexdec color of the background, e.g. #ff0000  */
  backgroundColor: PropTypes.string,
  /** For text hotspots, the opactity of the background in percentage, e.g. 100 */
  backgroundOpacity: PropTypes.number,
  /** For text hotspots, the hexdec color of the border, e.g. #ff0000  */
  borderColor: PropTypes.string,
  /** For text hotspots, the border width in px, e.g. 12  */
  borderWidth: PropTypes.number,
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
  type: 'fixed',
  bold: false,
  italic: false,
  underline: false,
  fontColor: text01,
  fontSize: 14,
  backgroundColor: ui01,
  backgroundOpacity: 100,
  borderColor: ui03,
  borderWidth: 0,
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
  type,
  bold,
  italic,
  underline,
  fontColor,
  fontSize,
  backgroundColor,
  backgroundOpacity,
  borderColor,
  borderWidth,
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
  const { r, g, b } = hexToRgb(backgroundColor);
  const opacity = backgroundOpacity / 100;
  const isTextType = type === 'text';

  return (
    <withSize.SizeMe monitorHeight={isTextType}>
      {({ size: measuredSize }) => {
        const containerWidth = isTextType ? measuredSize.width : width;
        const containerHeight = isTextType ? measuredSize.height : height;
        return (
          <div
            data-testid={id}
            style={{
              '--x-pos': x,
              '--y-pos': y,
              '--width': containerWidth,
              '--height': containerHeight,
            }}
            className={classnames(`${iotPrefix}--hotspot-container`, {
              [`${iotPrefix}--hotspot-container--selected`]: isSelected,
              [`${iotPrefix}--hotspot-container--has-icon`]: icon,
              [`${iotPrefix}--hotspot-container--is-text`]: isTextType,
              [`${iotPrefix}--hotspot-container--is-fixed`]: type === 'fixed',
            })}
            icon={icon}>
            {type === 'fixed' ? (
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
                }}>
                {content}
              </Tooltip>
            ) : isTextType ? (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <div
                role="complementary"
                style={{
                  '--background-color': `rgba( ${r}, ${g}, ${b}, ${opacity})`,
                  '--border-color': borderColor,
                  '--border-width': borderWidth,
                  '--title-font-weight': bold ? 'bold' : 'normal',
                  '--title-font-style': italic ? 'italic' : 'normal',
                  '--title-text-decoration-line': underline
                    ? 'underline'
                    : 'none',
                  '--title-font-color': fontColor,
                  '--title-font-size': fontSize,
                }}
                className={`${iotPrefix}--text-hotspot`}
                onClick={(evt) => onClick(evt, { x, y })}>
                {content}
              </div>
            ) : null}
          </div>
        );
      }}
    </withSize.SizeMe>
  );
};

Hotspot.propTypes = propTypes;
Hotspot.defaultProps = defaultProps;

export default Hotspot;
