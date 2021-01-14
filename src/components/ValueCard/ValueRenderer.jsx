import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import classnames from 'classnames';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';
import {
  formatNumberWithPrecision,
  determinePrecision,
} from '../../utils/cardUtilityFunctions';

import { BASE_CLASS_NAME, PREVIEW_DATA } from './valueCardUtils';

const propTypes = {
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types, react/require-default-props
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  precision: PropTypes.number,
  /** the card size */
  size: PropTypes.string.isRequired,
  color: PropTypes.string,
  /** Makes the value and the unit smaller */
  locale: PropTypes.string,
  customFormatter: PropTypes.func,
  fontSize: PropTypes.number.isRequired,
};

const defaultProps = {
  layout: CARD_LAYOUTS.HORIZONTAL,
  precision: 1,
  color: null,
  locale: 'en',
  customFormatter: null,
};

/**
 * This components job is determining how to render different kinds of card values.
 * It handles precision, font size, styling in a consistent way for card values.
 *
 */
const ValueRenderer = ({
  value,
  size,
  layout,
  precision: precisionProp,
  color,
  locale,
  customFormatter,
  fontSize,
}) => {
  const precision = determinePrecision(size, value, precisionProp);

  let renderValue = value;
  if (typeof value === 'boolean') {
    renderValue = (
      <span className={`${BASE_CLASS_NAME}__value-renderer--boolean`}>
        {value.toString()}
      </span>
    );
  } else if (typeof value === 'number') {
    renderValue = formatNumberWithPrecision(value, precision, locale);
  } else if (isNil(value)) {
    renderValue = PREVIEW_DATA;
  }

  renderValue = isNil(customFormatter)
    ? renderValue
    : customFormatter(renderValue, value);

  return (
    <div
      className={`${BASE_CLASS_NAME}__value-renderer--wrapper`}
      style={{ '--value-renderer-color': color }}>
      <span
        className={classnames(`${BASE_CLASS_NAME}__value-renderer--value`, {
          [`${BASE_CLASS_NAME}__value-renderer--value--vertical`]:
            layout === CARD_LAYOUTS.VERTICAL,
        })}
        style={{ '--value-renderer-font-size': `${fontSize}px` }}>
        {renderValue}
      </span>
    </div>
  );
};

ValueRenderer.propTypes = propTypes;
ValueRenderer.defaultProps = defaultProps;

export default ValueRenderer;
