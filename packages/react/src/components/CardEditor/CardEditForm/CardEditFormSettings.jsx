import React from 'react';
import PropTypes from 'prop-types';

import { CARD_TYPES } from '../../../constants/LayoutConstants';

import DataSeriesFormSettings from './CardEditFormItems/DataSeriesFormItems/DataSeriesFormSettings';
import ImageCardFormSettings from './CardEditFormItems/ImageCardFormItems/ImageCardFormSettings';

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
  i18n: PropTypes.shape({}),
};

const defaultProps = {
  cardConfig: {},
  i18n: {},
};

const CardEditFormSettings = ({ cardConfig, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { type } = cardConfig;

  return (
    <div>
      {type === CARD_TYPES.TIMESERIES && (
        <DataSeriesFormSettings cardConfig={cardConfig} i18n={mergedI18n} onChange={onChange} />
      )}
      {type === CARD_TYPES.IMAGE && (
        <ImageCardFormSettings cardConfig={cardConfig} i18n={mergedI18n} onChange={onChange} />
      )}

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
    </div>
  );
};

CardEditFormSettings.propTypes = propTypes;
CardEditFormSettings.defaultProps = defaultProps;

export default CardEditFormSettings;
