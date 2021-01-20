import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../../../../constants/Settings';
import { NumberInput } from '../../../../../index';

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
  }),
  /** Callback function when form data changes */
  onChange: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    fontSize: PropTypes.string,
    precisionLabel: PropTypes.string,
    notSet: PropTypes.string,
  }),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    fontSize: 'Font size',
    precisionLabel: 'Precision',
    notSet: 'Not set',
  },
};

const ValueCardFormSettings = ({ cardConfig, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { id, fontSize } = cardConfig;

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
          value={fontSize?.toString() || 16}
          onChange={({ imaginaryTarget }) =>
            onChange({
              ...cardConfig,
              fontSize: Number(imaginaryTarget.value) || imaginaryTarget.value,
            })
          }
        />
      </div>
    </>
  );
};

ValueCardFormSettings.propTypes = propTypes;
ValueCardFormSettings.defaultProps = defaultProps;

export default ValueCardFormSettings;
