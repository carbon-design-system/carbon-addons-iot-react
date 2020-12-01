import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import { settings } from '../../../../../constants/Settings';
import { NumberInput, Dropdown } from '../../../../../index';

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
      showLegend: PropTypes.bool,
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
    showLegendLable: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    xAxisLabel: 'X-axis label',
    yAxisLabel: 'Y-axis label',
    unitLabel: 'Unit',
    decimalPrecisionLabel: 'Decimal precision',
    showLegendLable: 'Show legend',
    fontSize: 'Font size',
    precisionLabel: 'Precision',
  },
};

const ValueCardFormSettings = ({ cardConfig, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { content, id } = cardConfig;

  const baseClassName = `${iotPrefix}--card-edit-form`;

  return (
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
};

ValueCardFormSettings.propTypes = propTypes;
ValueCardFormSettings.defaultProps = defaultProps;

export default ValueCardFormSettings;
