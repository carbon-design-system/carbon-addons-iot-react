import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import classnames from 'classnames';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';
import {
  getUpdatedCardSize,
  formatNumberWithPrecision,
  determinePrecision,
} from '../../utils/cardUtilityFunctions';

import { baseClassName } from './valueCardUtils';

const propTypes = {
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types, react/require-default-props
  unit: PropTypes.any, // eslint-disable-line react/forbid-prop-types, react/require-default-props
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  precision: PropTypes.number,
  /** the card size */
  size: PropTypes.string.isRequired,
  color: PropTypes.string,
  /** Allows the unit and threshold icons to wrap into a new line */
  allowedToWrap: PropTypes.bool.isRequired,
  /** Makes the value and the unit smaller */
  wrapCompact: PropTypes.bool,
  locale: PropTypes.string,
  customFormatter: PropTypes.func,
};

const defaultProps = {
  layout: CARD_LAYOUTS.HORIZONTAL,
  precision: 1,
  color: null,
  wrapCompact: false,
  locale: 'en',
  customFormatter: null,
};

const Attribute = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  ${(props) => props.color && `color: ${props.color}`};
  display: flex;
`;

/**
 * This components job is determining how to render different kinds of card values.
 * It handles precision, font size, styling in a consistent way for card values.
 *
 */
const ValueRenderer = ({
  value,
  size,
  unit,
  layout,
  precision: precisionProp,
  color,
  allowedToWrap,
  wrapCompact,
  locale,
  customFormatter,
}) => {
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const precision = determinePrecision(newSize, value, precisionProp);

  let renderValue = value;
  if (typeof value === 'boolean') {
    renderValue = (
      <span className={`${baseClassName}__value-renderer--boolean`}>
        {value.toString()}
      </span>
    );
  } else if (typeof value === 'number') {
    renderValue = formatNumberWithPrecision(value, precision, locale);
  } else if (isNil(value)) {
    renderValue = '--';
  }

  renderValue = isNil(customFormatter)
    ? renderValue
    : customFormatter(renderValue, value);

  const hasWords =
    typeof renderValue === 'string'
      ? renderValue.trim().indexOf(' ') >= 0
      : false;

  return (
    <Attribute
      unit={unit}
      color={color}
      allowedToWrap={allowedToWrap}
      className={classnames({
        [`${baseClassName}__value-renderer--wrappable`]: allowedToWrap,
        [`${baseClassName}__value-renderer--wrappable-compact`]: wrapCompact,
      })}>
      <span
        className={classnames(`${baseClassName}__value-renderer--value`, {
          [`${baseClassName}__value-renderer--value--vertical`]:
            layout === CARD_LAYOUTS.VERTICAL,
          [`${baseClassName}__value-renderer--value--wrappable`]: allowedToWrap,
          [`${baseClassName}__value-renderer--value--has-words`]: hasWords,
        })}>
        {renderValue}
      </span>
    </Attribute>
  );
};

ValueRenderer.propTypes = propTypes;
ValueRenderer.defaultProps = defaultProps;

export default ValueRenderer;
