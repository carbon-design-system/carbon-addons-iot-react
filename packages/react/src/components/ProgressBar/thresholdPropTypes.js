import PropTypes from 'prop-types';

import { SvgPropType } from '../../constants/SharedPropTypes';

export const ThresholdColorPropType = PropTypes.oneOfType([
  PropTypes.shape({
    fill: PropTypes.string,
    stroke: PropTypes.string,
  }),
  PropTypes.string,
]);

export const ThresholdIconPropType = PropTypes.oneOfType([
  PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string,
    viewBox: PropTypes.string.isRequired,
    svgData: SvgPropType.isRequired,
  }),
  PropTypes.string,
  PropTypes.object,
  PropTypes.func,
]);

export const ThresholdComparisonPropType = PropTypes.shape({
  comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: ThresholdColorPropType,
  icon: ThresholdIconPropType,
});

export const ThresholdComparisonFunctionPropType = PropTypes.shape({
  comparison: PropTypes.func.isRequired,
  color: ThresholdColorPropType,
  icon: ThresholdIconPropType,
});
