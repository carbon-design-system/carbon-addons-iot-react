import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash-es';
import classnames from 'classnames';
import { blue60 } from '@carbon/colors';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';
import { formatNumberWithPrecision } from '../../utils/cardUtilityFunctions';
import Button from '../Button';

import { BASE_CLASS_NAME, PREVIEW_DATA } from './valueCardUtils';

const propTypes = {
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types, react/require-default-props
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  precision: PropTypes.number,
  color: PropTypes.string,
  locale: PropTypes.string,
  customFormatter: PropTypes.func,
  formatter: PropTypes.func,
  fontSize: PropTypes.number.isRequired,
  /** optional option to determine whether the number should be abbreviated (i.e. 10,000 = 10K) */
  isNumberValueCompact: PropTypes.bool.isRequired,
  testId: PropTypes.string,
  /** callback to trigger further action when clicking the value */
  onClick: PropTypes.func,
  dataSourceId: PropTypes.string.isRequired,
  measurementUnitLabel: PropTypes.string,
};

const defaultProps = {
  layout: CARD_LAYOUTS.HORIZONTAL,
  precision: 0,
  color: null,
  locale: 'en',
  customFormatter: null,
  formatter: null,
  testId: 'value',
  onClick: null,
  measurementUnitLabel: null,
};

/**
 * This components job is determining how to render different kinds of card values.
 * It handles precision, font size, styling in a consistent way for card values.
 *
 */
const ValueRenderer = ({
  value,
  layout,
  precision,
  color,
  locale,
  customFormatter,
  formatter,
  fontSize,
  isNumberValueCompact,
  testId,
  onClick,
  dataSourceId,
  measurementUnitLabel,
}) => {
  const ctx = {
    locale,
    precision,
    unit: measurementUnitLabel,
    isNumberValueCompact,
    layout,
    dataSourceId,
  };
  let renderValue;
  let formatterNullish = false;
  let formatterError = false;
  // Feed the value and context into the formatter function, if it exists.
  if (typeof formatter === 'function') {
    try {
      const out = formatter(value, ctx);
      // Catches null and undefined values from formatter, but allows (0, '', false)
      if (out !== null && out !== undefined) {
        renderValue = out;
      } else {
        formatterNullish = true;
      }
    } catch (e) {
      // Turns on the flag, to keep a global reference of the error occuring.
      formatterError = true;
    }
  }
  if (renderValue === undefined) {
    renderValue = value;
    if (typeof value === 'boolean') {
      renderValue = (
        <span
          data-testid={`${testId}-boolean`}
          className={`${BASE_CLASS_NAME}__value-renderer--boolean`}
        >
          {value.toString()}
        </span>
      );
    } else if (typeof value === 'number') {
      renderValue = formatNumberWithPrecision(value, precision, locale, isNumberValueCompact);
    } else if (isNil(value)) {
      renderValue = PREVIEW_DATA;
    }
  }

  // If customFormatter was defined and either... formatter was not passed or there was an error with the formatter function, fall back to customFormatter logic.
  if (typeof customFormatter === 'function' && (!formatter || formatterError || formatterNullish)) {
    renderValue = customFormatter(renderValue, value);
  }

  const commonProps = {
    'data-testid': testId,
    className: classnames(`${BASE_CLASS_NAME}__value-renderer--value`, {
      [`${BASE_CLASS_NAME}__value-renderer--value--vertical`]: layout === CARD_LAYOUTS.VERTICAL,
    }),
    style: {
      '--value-renderer-font-size': `${fontSize}px`,
      '--value-renderer-color': color || (onClick && blue60),
      // if the font size is small enough to fit in the boundary box, wrap to 2 lines
      // otherwise, trucate the first line
      '--value-renderer-max-lines': fontSize < 20 ? 2 : 1,
    },
    title: measurementUnitLabel ? (
      <div>
        {renderValue} {measurementUnitLabel}
      </div>
    ) : (
      renderValue
    ),
  };

  return (
    <div className={`${BASE_CLASS_NAME}__value-renderer--wrapper`}>
      {onClick ? (
        <Button {...commonProps} onClick={() => onClick({ dataSourceId, value })} kind="ghost">
          {measurementUnitLabel ? (
            <>
              {renderValue}
              <span className={`${BASE_CLASS_NAME}__value-renderer--value--measurement-unit`}>
                {measurementUnitLabel}
              </span>
            </>
          ) : (
            renderValue
          )}
        </Button>
      ) : (
        <span {...commonProps}>
          {measurementUnitLabel ? (
            <>
              {renderValue}
              <span className={`${BASE_CLASS_NAME}__value-renderer--value--measurement-unit`}>
                {measurementUnitLabel}
              </span>
            </>
          ) : (
            renderValue
          )}
        </span>
      )}
    </div>
  );
};

ValueRenderer.propTypes = propTypes;
ValueRenderer.defaultProps = defaultProps;

export default ValueRenderer;
