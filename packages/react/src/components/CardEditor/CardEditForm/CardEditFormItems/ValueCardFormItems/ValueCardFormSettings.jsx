import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../../../../constants/Settings';
import { NumberInput, ToggleSmall, Tooltip } from '../../../../../index';
import { DEFAULT_FONT_SIZE } from '../../../../ValueCard/valueCardUtils';

const { iotPrefix } = settings;

const propTypes = {
  /** card data value */
  cardConfig: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.shape({
      series: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          dataSourceId: PropTypes.string,
          color: PropTypes.string,
        })
      ),
      unit: PropTypes.string,
    }),
    interval: PropTypes.string,
    fontSize: PropTypes.number,
    isNumberValueCompact: PropTypes.bool,
  }),
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    fontSize: PropTypes.string,
    abbreviateNumbers: PropTypes.string,
    abbreviateNumbersTooltip: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    fontSize: 'Font size',
    abbreviateNumbers: 'Abbreviate numbers',
    abbreviateNumbersTooltip:
      'Shorten numbers by using K, M, B. For example, shows "1.2K" instead of "1,200"',
  },
};

const ValueCardFormSettings = ({ cardConfig, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { id, fontSize, isNumberValueCompact } = cardConfig;

  const baseClassName = `${iotPrefix}--card-edit-form`;

  return (
    <>
      <div className={`${baseClassName}--input`}>
        <NumberInput
          id={`${id}_value-card-font-size`}
          step={1}
          min={16}
          max={54}
          light
          label={mergedI18n.fontSize}
          value={fontSize || DEFAULT_FONT_SIZE}
          onChange={({ imaginaryTarget }) =>
            onChange({
              ...cardConfig,
              fontSize: Number(imaginaryTarget.value) || imaginaryTarget.value,
            })
          }
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <div className={`${baseClassName}--input--toggle-field`}>
          <span>{mergedI18n.abbreviateNumbers}</span>
          <Tooltip
            direction="bottom"
            triggerText={null}
            triggerId={`${id}-abbreviate-numbers-tooltip`}
          >
            <p>{mergedI18n.abbreviateNumbersTooltip}</p>
          </Tooltip>
          <ToggleSmall
            id={`${id}_value-card-number-compact`}
            labelA=""
            labelB=""
            toggled={isNumberValueCompact || false}
            onToggle={(toggled) =>
              onChange({
                ...cardConfig,
                isNumberValueCompact: toggled,
              })
            }
            aria-label="Abbreviate number"
          />
        </div>
      </div>
    </>
  );
};

ValueCardFormSettings.propTypes = propTypes;
ValueCardFormSettings.defaultProps = defaultProps;

export default ValueCardFormSettings;
