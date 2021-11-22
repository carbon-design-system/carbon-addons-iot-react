import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { CARD_TYPES } from '../../../constants/LayoutConstants';

import DataSeriesFormSettings from './CardEditFormItems/DataSeriesFormItems/DataSeriesFormSettings';
import ValueCardFormSettings from './CardEditFormItems/ValueCardFormItems/ValueCardFormSettings';
import ImageCardFormSettings from './CardEditFormItems/ImageCardFormItems/ImageCardFormSettings';
import BarChartCardFormSettings from './CardEditFormItems/BarChartCardFormItems/BarChartCardFormSettings';
import TableCardFormSettings from './CardEditFormItems/TableCardFormItems/TableCardFormSettings';

const propTypes = {
  /** an object where the keys are available dimensions and the values are the values available for those dimensions
   *  ex: { manufacturer: ['Rentech', 'GHI Industries'], deviceid: ['73000', '73001', '73002'] }
   */
  availableDimensions: PropTypes.shape({}),
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
    renderEditSettings: PropTypes.func,
    interval: PropTypes.string,
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
  availableDimensions: {},
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

const CardEditFormSettings = ({ cardConfig, onChange, i18n, availableDimensions }) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const { type, renderEditSettings } = cardConfig;
  const handleTranslation = useCallback(
    (idToTranslate) => {
      const { openMenuText, closeMenuText } = mergedI18n;
      switch (idToTranslate) {
        default:
          return '';
        case 'open.menu':
          return openMenuText || 'Open menu';
        case 'close.menu':
          return closeMenuText || 'Close menu';
      }
    },
    [mergedI18n]
  );

  switch (type) {
    case CARD_TYPES.VALUE:
      return (
        <ValueCardFormSettings
          cardConfig={cardConfig}
          i18n={mergedI18n}
          onChange={onChange}
          translateWithId={handleTranslation}
        />
      );
    case CARD_TYPES.TIMESERIES:
      return (
        <DataSeriesFormSettings cardConfig={cardConfig} i18n={mergedI18n} onChange={onChange} />
      );
    case CARD_TYPES.BAR:
      return (
        <BarChartCardFormSettings cardConfig={cardConfig} i18n={mergedI18n} onChange={onChange} />
      );
    case CARD_TYPES.IMAGE:
      return (
        <ImageCardFormSettings
          cardConfig={cardConfig}
          i18n={mergedI18n}
          onChange={onChange}
          translateWithId={handleTranslation}
        />
      );
    case CARD_TYPES.TABLE:
      return (
        <TableCardFormSettings
          availableDimensions={availableDimensions}
          cardConfig={cardConfig}
          i18n={mergedI18n}
          onChange={onChange}
          translateWithId={handleTranslation}
        />
      );
    default:
      return renderEditSettings ? renderEditSettings(onChange, cardConfig) : null;
  }
};

CardEditFormSettings.propTypes = propTypes;
CardEditFormSettings.defaultProps = defaultProps;

export default CardEditFormSettings;
