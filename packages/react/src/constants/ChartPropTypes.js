import PropTypes from 'prop-types';

export const ChartColorPropType = {
  color: PropTypes.shape({
    gradient: PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.string),
      enabled: PropTypes.boolean,
    }),
    pairing: PropTypes.shape({ numberOfVariants: PropTypes.number, option: PropTypes.number }),
    scale: PropTypes.shape(PropTypes.any),
  }),
};

export const MeterChartPropTypes = {
  content: PropTypes.shape({
    peak: PropTypes.number,
    meterTotal: PropTypes.number,
    meterUnit: PropTypes.string,
    legendPosition: PropTypes.string,
    ...ChartColorPropType,
  }),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string,
      value: PropTypes.number,
    })
  ),
};

export const SparklineChartPropTypes = {
  content: PropTypes.shape({
    xLabel: PropTypes.string,
    yLabel: PropTypes.string,
    xProperty: PropTypes.string.isRequired,
    yProperty: PropTypes.string.isRequired,
    listContent: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ),
    ...ChartColorPropType,
  }),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string.isRequired,
    })
  ),
};

export const StackedAreaChartPropTypes = {
  content: PropTypes.shape({
    xLabel: PropTypes.string,
    yLabel: PropTypes.string,
    xProperty: PropTypes.string.isRequired,
    xThresholds: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        valueFormatter: PropTypes.func,
        label: PropTypes.string,
        fillColor: PropTypes.string,
      })
    ),
    yProperty: PropTypes.string.isRequired,
    yThresholds: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        valueFormatter: PropTypes.func,
        label: PropTypes.string,
        fillColor: PropTypes.string,
      })
    ),
    curve: PropTypes.string,
    legendPosition: PropTypes.oneOf(['bottom', 'left', 'right', 'top']),
    ...ChartColorPropType,
  }),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      group: PropTypes.string.isRequired,
    })
  ),
};
