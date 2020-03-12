import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'carbon-components-react';
import warning from 'warning';

import icons from '../../utils/bundledIcons';

const propTypes = {
  /** the name of the icon to render */
  icon: PropTypes.string,
  /** callback function that returns an react node based on the name of the icon */
  renderIconByName: PropTypes.func,
  title: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

/** This component calls out to our renderIconByName callback function with the icon name OR fails over to our legacy card icons from our legacy icon bundle */
const CardIcon = ({ icon, renderIconByName, title, color, width, height, className }) => {
  if (__DEV__ && !renderIconByName && !icons[icon]) {
    warning(
      false,
      `You have not passed a renderIconByName function, and your icon name '${icon}' is not in our legacy icon bundle: ${JSON.stringify(
        Object.keys(icons)
      )} so we will default to our 'help' icon.`
    );
  }
  return icon ? (
    renderIconByName ? (
      renderIconByName(icon, {
        title,
        className,
        fill: color,
        width,
        height,
        tabIndex: '0',
      })
    ) : (
      <Icon
        icon={icons[icon] || icons.help}
        className={className}
        fill={color}
        width={width?.toString()}
        height={height?.toString()}
        title={title}
        description={title}
      />
    )
  ) : null;
};

CardIcon.propTypes = propTypes;
export default CardIcon;
