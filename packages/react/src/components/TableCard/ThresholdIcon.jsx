import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';
import CardIcon from '../ImageCard/CardIcon';

const { iotPrefix } = settings;

const propTypes = {
  /** severities will determine which default icon to use if another icon name isn't provided */
  severity: PropTypes.oneOf([1, 2, 3]),
  /** the title to show when hovering over the icon */
  title: PropTypes.string,
  /** the name of the icon to load or a react element to render */
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** the css color to set the icon */
  color: PropTypes.string,
  /** set of internationalized strings */
  strings: PropTypes.shape({
    criticalLabel: PropTypes.string,
    moderateLabel: PropTypes.string,
    lowLabel: PropTypes.string,
  }).isRequired,
  /** Optionally shows threshold severity label text. Shows by default */
  showSeverityLabel: PropTypes.bool,
  /** Optionally changes threshold severity label text */
  severityLabel: PropTypes.string,
  /** optional function that returns an icon node for an icon name */
  renderIconByName: PropTypes.func,
};

const defaultProps = {
  severity: null,
  title: null,
  icon: null,
  color: null,
  showSeverityLabel: true,
  severityLabel: null,
  renderIconByName: null,
};

const ThresholdIcon = ({
  severity,
  strings,
  title,
  icon,
  color,
  showSeverityLabel,
  severityLabel,
  renderIconByName,
}) => {
  let iconToRender;
  let stringToRender = '';

  const customIcon = icon ? (
    <CardIcon
      icon={icon}
      title={title}
      color={color || '#DA1E28'}
      renderIconByName={renderIconByName}
      width={16}
      height={16}
    />
  ) : null;

  switch (severity) {
    case 1:
      iconToRender = customIcon || (
        <CardIcon
          icon="Misuse"
          title={title}
          color={color || '#DA1E28'}
          renderIconByName={renderIconByName}
          width={16}
          height={16}
        />
      );
      stringToRender = strings.criticalLabel;
      break;
    case 2:
      iconToRender = customIcon || (
        <CardIcon
          icon="Warning alt filled"
          title={title}
          color={color || '#FC7B1E'}
          renderIconByName={renderIconByName}
          width={16}
          height={16}
        />
      );
      stringToRender = strings.moderateLabel;
      break;
    case 3:
      iconToRender = customIcon || (
        <CardIcon
          icon="Information filled"
          title={title}
          color={color || '#FDD13A'}
          renderIconByName={renderIconByName}
          width={16}
          height={16}
        />
      );
      stringToRender = strings.lowLabel;
      break;
    default:
  }
  return (
    <div className={`${iotPrefix}--threshold-icon--wrapper`} title={title}>
      {iconToRender}
      {showSeverityLabel ? (
        <span className={`${iotPrefix}--threshold-icon--text`}>
          {severityLabel || stringToRender}
        </span>
      ) : null}
    </div>
  );
};

ThresholdIcon.propTypes = propTypes;
ThresholdIcon.defaultProps = defaultProps;
export default ThresholdIcon;
