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
