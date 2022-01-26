import React from 'react';
import { unstable_ProgressBar as CarbonProgressBar } from 'carbon-components-react';
import PropTypes from 'prop-types';
import { blue60 } from '@carbon/colors';
import classnames from 'classnames';

import useMerged from '../../hooks/useMerged';
import { settings } from '../../constants/Settings';
import useMatchingThreshold from '../../hooks/useMatchingThreshold';

import {
  ThresholdComparisonPropType,
  ThresholdComparisonFunctionPropType,
} from './thresholdPropTypes';

const { iotPrefix } = settings;

const propTypes = {
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  hideLabel: PropTypes.bool,
  value: PropTypes.number.isRequired,
  valueUnit: PropTypes.string,
  max: PropTypes.number,
  thresholds: PropTypes.arrayOf(
    PropTypes.oneOfType([ThresholdComparisonPropType, ThresholdComparisonFunctionPropType])
  ),
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]),
  /**
   * Callback called when a threshold determines what icon to render based on a string for the icon
   *    example usage: renderIconByName(name = 'my--checkmark--icon', props = { title: 'A checkmark', etc. })
   */
  renderIconByName: PropTypes.func,

  i18n: PropTypes.shape({
    iconLabel: PropTypes.string,
  }),
};

const defaultProps = {
  helperText: '',
  hideLabel: false,
  thresholds: [],
  max: 100,
  valueUnit: '%',
  renderIcon: undefined,
  renderIconByName: undefined,
  i18n: {
    iconLabel: 'progress bar icon',
  },
};

const DEFAULT_PROGRESS_BAR_COLOR = blue60;

const ProgressBar = ({
  label,
  helperText,
  hideLabel,
  value,
  valueUnit,
  max,
  renderIcon,
  renderIconByName,
  thresholds,
  i18n,
}) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
  const matchingThreshold = useMatchingThreshold({ thresholds, value });
  const Icon = matchingThreshold?.icon ?? renderIcon;
  const hasColorObject = typeof matchingThreshold?.color?.fill === 'string';
  const matchingFillColor = matchingThreshold?.color ?? DEFAULT_PROGRESS_BAR_COLOR;
  const fillColor = hasColorObject ? matchingThreshold.color.fill : matchingFillColor;
  const strokeColor = hasColorObject ? matchingThreshold.color.stroke : undefined;

  return (
    <div
      className={`${iotPrefix}--progress-bar-container`}
      data-testid="progress-bar-container"
      style={{
        '--progress-bar-fill-color': fillColor,
        '--progress-bar-stroke-color': strokeColor,
      }}
    >
      <div className={`${iotPrefix}--progress-bar__label--right`}>
        {Icon ? (
          <span className={`${iotPrefix}--progress-bar__icon`} data-testid="progress-bar-icon">
            {renderIconByName && typeof Icon === 'string' ? (
              renderIconByName(Icon, {
                fill: fillColor,
                stroke: strokeColor,
                'aria-label': mergedI18n.iconLabel,
              })
            ) : (
              <Icon fill={fillColor} stroke={strokeColor} aria-label={mergedI18n.iconLabel} />
            )}
          </span>
        ) : null}
        <span
          className={classnames(`${iotPrefix}--progress-bar__value-label`, {
            [`${iotPrefix}--progress-bar__value-label--over`]: value > max,
          })}
        >{`${value}${valueUnit}`}</span>
      </div>
      <CarbonProgressBar
        label={label}
        helperText={helperText}
        hideLabel={hideLabel}
        value={value}
        max={max}
      />
    </div>
  );
};

ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;

export default ProgressBar;
