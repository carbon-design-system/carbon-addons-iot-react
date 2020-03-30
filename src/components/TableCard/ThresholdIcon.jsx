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
        <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
          <g id="Artboard-Copy-2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Group">
              <path
                d="M15.483595,4.16821623 L11.828224,0.514898318 C11.4996389,0.186340499 11.0498759,0 10.5847164,0 L5.4141139,0 C4.94895439,0 4.49919139,0.186340499 4.17043702,0.51506755 L0.515728028,4.16947288 C0.186857661,4.49695966 1.58095759e-13,4.94738907 1.58095759e-13,5.41374714 L1.58095759e-13,10.5845032 C1.58095759e-13,11.0496811 0.18637442,11.4994512 0.515144768,11.8281943 L4.17032421,15.4842364 C4.50074437,15.813273 4.94971353,16 5.4141139,16 L10.5841331,16 C11.0519715,16 11.4969656,15.8151662 11.82781,15.4843492 L15.4864327,11.8277802 C15.8179763,11.4922167 16,11.0496451 16,10.5845032 L16,5.41374714 C16.00134,4.94645588 15.816286,4.49993244 15.483595,4.16821623 Z"
                id="outline-color"
                fill="#FFFFFF"
              />
              <path
                d="M14.7771914,4.87602583 L11.1213159,1.22220371 C10.9801669,1.08106644 10.7847747,1 10.5847164,1 L5.4141139,1 C5.21405561,1 5.01866342,1.08106644 4.87751443,1.22220371 L1.22280543,4.87660904 C1.08107318,5.0177463 1,5.21312227 1,5.41374714 L1,10.5845032 C1,10.7845449 1.08107318,10.9799208 1.22222217,11.1210581 L4.87751443,14.7772131 C5.01924668,14.9183503 5.21463888,15 5.4141139,15 L10.5841331,15 C10.7865245,15 10.9772506,14.9206832 11.1207326,14.7772131 L14.7795244,11.1204749 C14.9218399,10.9764216 15,10.7862945 15,10.5845032 L15,5.41374714 C15.0005801,5.21020621 14.9212567,5.01949594 14.7771914,4.87602583 Z"
                id="background-color"
                fill={color || '#DA1E28'}
              />
              <polygon
                id="icon-color"
                fill="#FFFFFF"
                points="10.3185714 11.001753 8 8.68318155 5.68142857 11.001753 5 10.3203244 7.31857143 8.00175297 5 5.68318155 5.68142857 5.00175297 8 7.3203244 10.3185714 5.00175297 11 5.68318155 8.68142857 8.00175297 11 10.3203244"
              />
            </g>
          </g>
        </svg>
      );
      stringToRender = strings.criticalLabel;
      break;
    case 2:
      iconToRender = customIcon || (
        <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
          <g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Group">
              <path
                d="M15.7894601,14.2675131 C15.5195241,14.7230623 15.029513,15.0024208 14.5000526,15.0025132 L1.53339891,15.0021846 C0.996512233,15.0159597 0.493279942,14.7413061 0.202531324,14.2625132 C-0.0652585874,13.7984115 -0.0652585874,13.2266148 0.189272648,12.78623 L6.68470115,0.787539475 C6.94639352,0.302404679 7.45295465,2.66453526e-15 8.00391648,2.66453526e-15 C8.55487831,2.66453526e-15 9.06143944,0.302404679 9.3224242,0.78623001 L15.8183281,12.7858011 C16.0707419,13.2512161 16.0592142,13.8153414 15.7894601,14.2675131 Z"
                id="outline-color"
                fill="#FFFFFF"
              />
              <path
                d="M14.941052,13.2599875 L8.44460575,1.26245909 C8.35737079,1.1007808 8.18850902,1 8.00484631,1 C7.82118359,1 7.65232182,1.1007808 7.56508686,1.26245909 L1.06864057,13.2599875 C0.979373004,13.4146562 0.979373004,13.6052158 1.06864057,13.7598845 C1.16167713,13.9128935 1.32942924,14.0044259 1.50840001,13.9998351 L14.5012926,13.9998351 C14.6777297,13.9998043 14.8410746,13.906704 14.9310575,13.7548855 C15.0215326,13.6032635 15.0253318,13.4151411 14.941052,13.2599875 Z"
                id="background-color"
                fill={color || '#FC7B1E'}
              />
              <path
                d="M7.50084897,5.75 L8.50084897,5.75 L8.50084897,9.75 L7.50084897,9.75 L7.50084897,5.75 Z M8.00084897,12.5 C7.58663541,12.5 7.25084897,12.1642136 7.25084897,11.75 C7.25084897,11.3357864 7.58663541,11 8.00084897,11 C8.41506253,11 8.75084897,11.3357864 8.75084897,11.75 C8.75084897,12.1642136 8.41506253,12.5 8.00084897,12.5 Z"
                id="symbol-color"
                fill="#FFFFFF"
              />
            </g>
          </g>
        </svg>
      );
      stringToRender = strings.moderateLabel;
      break;
    case 3:
      iconToRender = customIcon || (
        <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
          <g id="Artboard-Copy" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Group">
              <path
                d="M8,16 C3.581722,16 0,12.418278 0,8 C0,3.581722 3.581722,0 8,0 C12.418278,0 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 Z"
                id="outline-color"
                fill="#FFFFFF"
              />
              <circle id="background-color" fill={color || '#FDD13A'} cx="8" cy="8" r="7" />
              <path
                d="M7.22,4 L8.47,4 L8.47,8 L7.22,8 L7.22,4 Z M7.875,11.9 C7.39175084,11.9 7,11.5082492 7,11.025 C7,10.5417508 7.39175084,10.15 7.875,10.15 C8.35824916,10.15 8.75,10.5417508 8.75,11.025 C8.75,11.5082492 8.35824916,11.9 7.875,11.9 Z"
                id="symbol-color"
                fill="#FFFFFF"
              />
            </g>
          </g>
        </svg>
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
