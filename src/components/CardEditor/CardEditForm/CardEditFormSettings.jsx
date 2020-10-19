import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';
import { TextInput } from '../../../index';

const { iotPrefix } = settings;

const propTypes = {
  /** card data value */
  cardJson: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** card data errors */
  // errors: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    xAxisLabel: PropTypes.string,
    yAxisLabel: PropTypes.string,
    unitLabel: PropTypes.string,
    decimalPrecisionLabel: PropTypes.string,
    showLegendLable: PropTypes.string,
  }),
};

const defaultProps = {
  cardJson: {},
  i18n: {
    xAxisLabel: 'X-axis label',
    yAxisLabel: 'Y-axis label',
    unitLabel: 'Unit',
    decimalPrecisionLabel: 'Decimal precision',
    showLegendLable: 'Show legend',
  },
};

const CardEditFormSettings = ({ cardJson, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { content } = cardJson;

  const baseClassName = `${iotPrefix}--card-edit-form`;

  return (
    <>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id="x-axis-label"
          labelText={mergedI18n.xAxisLabel}
          light
          onChange={evt =>
            onChange({ ...cardJson, content: { ...cardJson.content, xLabel: evt.target.value } })
          }
          value={content?.xLabel}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id="y-axis-label"
          labelText={mergedI18n.yAxisLabel}
          light
          onChange={evt =>
            onChange({ ...cardJson, content: { ...cardJson.content, yLabel: evt.target.value } })
          }
          value={content?.yLabel}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id="unit-selection"
          labelText={mergedI18n.unitLabel}
          light
          onChange={evt =>
            onChange({ ...cardJson, content: { ...cardJson.content, unit: evt.target.value } })
          }
          value={content?.unit}
        />
      </div>
      {/* 

      TODO: support "decimal precision" and legend toggling in future iteration

      <div className={`${baseClassName}--input`}>
        <TextInput
          id="decimal-precision"
          labelText={mergedI18n.decimalPrecisionLabel}
          light
          onChange={evt => onChange({ ...cardJson, description: evt.target.value })}
          value={description}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <div className={`${baseClassName}--input--toggle-field`}>
          <span>{mergedI18n.showLegend}</span>
          <ToggleSmall
            id="show-legend-toggle"
            aria-label="show-legend"
            defaultToggled
            labelA=""
            labelB=""
            onToggle={showLegend => onChange({ ...cardJson, showLegend })}
          />
        </div>
      </div> */}
    </>
  );
};

CardEditFormSettings.propTypes = propTypes;
CardEditFormSettings.defaultProps = defaultProps;

export default CardEditFormSettings;
