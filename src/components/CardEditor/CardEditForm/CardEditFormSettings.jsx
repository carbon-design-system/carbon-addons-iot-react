import React from 'react';
import PropTypes from 'prop-types';

import { CARD_TYPES } from '../../../constants/LayoutConstants';

import DataSeriesFormSettings from './CardEditFormItems/DataSeriesFormItems/DataSeriesFormSettings';
import ValueCardFormSettings from './CardEditFormItems/ValueCardFormItems/ValueCardFormSettings';
import ImageCardFormSettings from './CardEditFormItems/ImageCardFormItems/ImageCardFormSettings';
import BarChartCardFormSettings from './CardEditFormItems/BarChartCardFormItems/BarChartCardFormSettings';

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
  i18n: PropTypes.shape({}),
};

const defaultProps = {
  cardConfig: {},
  i18n: {
    xAxisLabel: 'X-axis label',
    yAxisLabel: 'Y-axis label',
    unitLabel: 'Unit',
    decimalPrecisionLabel: 'Decimal precision',
    showLegendLable: 'Show legend',
    precisionLabel: 'Precision',
    showLegendLabel: 'Show legend',
    fontSize: 'Font size',
  },
};

const CardEditFormSettings = ({ cardConfig, onChange, i18n }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { type } = cardConfig;

  switch (type) {
    case CARD_TYPES.VALUE:
      return (
        <ValueCardFormSettings
          cardConfig={cardConfig}
          i18n={mergedI18n}
          onChange={onChange}
        />
      );
    case CARD_TYPES.TIMESERIES:
      return (
        <DataSeriesFormSettings
          cardConfig={cardConfig}
          i18n={mergedI18n}
          onChange={onChange}
        />
      );
    case CARD_TYPES.BAR:
      return (
        <BarChartCardFormSettings
          cardConfig={cardConfig}
          i18n={mergedI18n}
          onChange={onChange}
        />
      );
    case CARD_TYPES.IMAGE:
      return (
        <ImageCardFormSettings
          cardConfig={cardConfig}
          i18n={mergedI18n}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

CardEditFormSettings.propTypes = propTypes;
CardEditFormSettings.defaultProps = defaultProps;

export default CardEditFormSettings;
