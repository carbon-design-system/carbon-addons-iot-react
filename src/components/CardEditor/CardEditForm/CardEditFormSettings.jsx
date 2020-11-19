import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import { settings } from '../../../constants/Settings';
import { TextInput, NumberInput, Dropdown } from '../../../index';
import { CARD_TYPES } from '../../../constants/LayoutConstants';

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
      xLabel: PropTypes.string,
      yLabel: PropTypes.string,
      unit: PropTypes.string,
      includeZeroOnXaxis: PropTypes.bool,
      includeZeroOnYaxis: PropTypes.bool,
      timeDataSourceId: PropTypes.string,
    }),
    interval: PropTypes.string,
    showLegend: PropTypes.bool,
  }),
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    xAxisLabel: PropTypes.string,
    yAxisLabel: PropTypes.string,
    unitLabel: PropTypes.string,
    decimalPrecisionLabel: PropTypes.string,
    precisionLabel: PropTypes.string,
    showLegendLabel: PropTypes.string,
    fontSize: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    xAxisLabel: 'X-axis label',
    yAxisLabel: 'Y-axis label',
    unitLabel: 'Unit',
    decimalPrecisionLabel: 'Decimal precision',
    precisionLabel: 'Precision',
    showLegendLabel: 'Show legend',
    fontSize: 'Font size',
  },
};

const CardEditFormSettings = ({ cardConfig, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { content, id, type } = cardConfig;

  const baseClassName = `${iotPrefix}--card-edit-form`;

  const TimeSeriesSettings = (
    <>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id={`${id}_title`}
          labelText={mergedI18n.xAxisLabel}
          light
          onChange={(evt) =>
            onChange({
              ...cardConfig,
              content: { ...cardConfig.content, xLabel: evt.target.value },
            })
          }
          value={content?.xLabel}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id={`${id}_y-axis-label`}
          labelText={mergedI18n.yAxisLabel}
          light
          onChange={(evt) =>
            onChange({
              ...cardConfig,
              content: { ...cardConfig.content, yLabel: evt.target.value },
            })
          }
          value={content?.yLabel}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id={`${id}_unit-selection`}
          labelText={mergedI18n.unitLabel}
          light
          onChange={(evt) =>
            onChange({
              ...cardConfig,
              content: { ...cardConfig.content, unit: evt.target.value },
            })
          }
          value={content?.unit}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <TextInput
          id={`${id}_decimal-precision`}
          labelText={mergedI18n.decimalPrecisionLabel}
          light
          onChange={(evt) =>
            onChange({
              ...cardConfig,
              content: {
                ...cardConfig.content,
                decimalPrecision: evt.target.value,
              },
            })
          }
          value={content?.decimalPrecision}
        />
      </div>
      {/* 
      TODO: support and legend toggling in future iteration
      <div className={`${baseClassName}--input`}>
        <div className={`${baseClassName}--input--toggle-field`}>
          <span>{mergedI18n.showLegend}</span>
          <ToggleSmall
            id="show-legend-toggle"
            aria-label="show-legend"
            defaultToggled
            labelA=""
            labelB=""
            // This is not supported by Carbon yet. Issue open here: https://github.com/carbon-design-system/carbon-charts/issues/846
            onToggle={showLegend => onChange({ ...cardConfig, showLegend })}
          />
        </div>
      </div> */}
    </>
  );

  const ValueCardSettings = (
    <>
      <div className={`${baseClassName}--input`}>
        <NumberInput
          id={`${id}_value-card-font-size`}
          step={1}
          min={0}
          light
          label={mergedI18n.fontSize}
          value={content?.fontSize?.toString() || 16}
          onChange={({ imaginaryTarget }) =>
            onChange({
              ...cardConfig,
              content: {
                ...content,
                fontSize:
                  Number(imaginaryTarget.value) || imaginaryTarget.value,
              },
            })
          }
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <Dropdown
          id={`${id}_value-card-decimal-place`}
          titleText={mergedI18n.precisionLabel}
          direction="bottom"
          label=""
          items={['Not set', '0', '1', '2', '3', '4']}
          light
          selectedItem={content?.precision?.toString() || 'Not set'}
          onChange={({ selectedItem }) => {
            const isSet = selectedItem !== 'Not set';
            if (isSet) {
              onChange({
                ...cardConfig,
                content: {
                  ...content,
                  precision: Number(selectedItem),
                },
              });
            } else {
              onChange({
                ...cardConfig,
                content: {
                  ...omit(content, 'precision'),
                },
              });
            }
          }}
        />
      </div>
    </>
  );

  switch (type) {
    case CARD_TYPES.TIMESERIES:
      return TimeSeriesSettings;
    case CARD_TYPES.VALUE:
      return ValueCardSettings;
    default:
      return null;
  }
};

CardEditFormSettings.propTypes = propTypes;
CardEditFormSettings.defaultProps = defaultProps;

export default CardEditFormSettings;
