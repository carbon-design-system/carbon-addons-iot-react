import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../../../../constants/Settings';
import { RadioButtonGroup } from '../../../../RadioButtonGroup';
import { RadioButton } from '../../../../RadioButton';
import { FormGroup } from '../../../../FormGroup';
import { TextInput } from '../../../../TextInput';
import { NumberInput } from '../../../../NumberInput';

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
      layout: PropTypes.string,
      decimalPrecision: PropTypes.number,
      xLabel: PropTypes.string,
      yLabel: PropTypes.string,
      unit: PropTypes.string,
      includeZeroOnXaxis: PropTypes.bool,
      includeZeroOnYaxis: PropTypes.bool,
      timeDataSourceId: PropTypes.string,
      showLegend: PropTypes.bool,
      maximumDataPoints: PropTypes.number,
    }),
    interval: PropTypes.string,
  }),
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    xAxisLabel: PropTypes.string,
    yAxisLabel: PropTypes.string,
    unitLabel: PropTypes.string,
    decimalPrecisionLabel: PropTypes.string,
    showLegendLabel: PropTypes.string,
    fontSize: PropTypes.string,
    precisionLabel: PropTypes.string,
    layoutLabel: PropTypes.string,
    autoLabel: PropTypes.string,
    horizontal: PropTypes.string,
    vertical: PropTypes.string,
    maximumDataPoints: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    xAxisLabel: 'X-axis label',
    yAxisLabel: 'Y-axis label',
    unitLabel: 'Unit',
    decimalPlacesLabel: 'Decimal places',
    showLegendLabel: 'Show legend',
    fontSize: 'Font size',
    decimalPrecisionLabel: 'Decimal precision',
    layoutLabel: 'Layout',
    autoLabel: 'Auto',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
    maximumDataPoints: 'Maximum data points',
  },
};

const BarChartCardFormSettings = ({ cardConfig, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { content, id } = cardConfig;

  const baseClassName = `${iotPrefix}--card-edit-form`;

  return (
    <>
      <div className={`${baseClassName}--input`}>
        <FormGroup legendText={mergedI18n.layoutLabel}>
          <RadioButtonGroup
            name={`${baseClassName}--layout-radios`}
            onChange={(layout) => {
              onChange({
                ...cardConfig,
                content: {
                  ...cardConfig.content,
                  layout,
                },
              });
            }}
            orientation="vertical"
            legend={mergedI18n.layoutLabel}
            valueSelected={cardConfig.content?.layout}
          >
            <RadioButton
              data-testid={`${baseClassName}--layout-radio1`}
              value="HORIZONTAL"
              id={`${baseClassName}--layout-radio-1`}
              labelText={mergedI18n.horizontal}
            />
            <RadioButton
              data-testid={`${baseClassName}--layout-radio2`}
              value="VERTICAL"
              id={`${baseClassName}--layout-radio-2`}
              labelText={mergedI18n.vertical}
            />
          </RadioButtonGroup>
        </FormGroup>
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
          id={`${id}_x-axis-label`}
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
        <NumberInput
          id={`${id}_decimal-precision`}
          label={mergedI18n.decimalPrecisionLabel}
          min={0}
          light
          placeholder={mergedI18n.autoLabel}
          onChange={(evt) => {
            const decimalPrecision = Number.parseInt(
              evt.imaginaryTarget.value ?? evt.target.value,
              10
            );
            onChange({
              ...cardConfig,
              content: { ...cardConfig.content, decimalPrecision },
            });
          }}
          value={content?.decimalPrecision}
        />
      </div>
      <div className={`${baseClassName}--input`}>
        <NumberInput
          id={`${id}_maximum_data_points`}
          label={mergedI18n.maximumDataPoints}
          step={10}
          min={0}
          light
          onChange={(evt) => {
            const maximumDataPoints = Number.parseInt(
              evt.imaginaryTarget.value ?? evt.target.value,
              10
            );
            onChange({
              ...cardConfig,
              content: { ...cardConfig.content, maximumDataPoints },
            });
          }}
          value={content?.maximumDataPoints}
        />
      </div>
    </>
  );
};

BarChartCardFormSettings.propTypes = propTypes;
BarChartCardFormSettings.defaultProps = defaultProps;

export default BarChartCardFormSettings;
