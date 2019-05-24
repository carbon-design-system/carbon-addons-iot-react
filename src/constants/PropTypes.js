import PropTypes from 'prop-types';

import { CARD_SIZES, CARD_LAYOUTS } from './LayoutConstants';

export const AttributePropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  unit: PropTypes.string,
});

export const CardPropTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  size: PropTypes.oneOf(Object.values(CARD_SIZES)),
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  toolbar: PropTypes.element,
};

export const ValueCardPropTypes = {
  content: PropTypes.array.isRequired,
};

export const CardDimensionPropTypes = PropTypes.shape({
  w: PropTypes.number,
  h: PropTypes.number,
});

export const CardDimensionsPropTypes = PropTypes.shape({
  lg: CardDimensionPropTypes,
  md: CardDimensionPropTypes,
  sm: CardDimensionPropTypes,
  xs: CardDimensionPropTypes,
});

export const CardSizesToDimensionsPropTypes = PropTypes.shape({
  XSMALL: CardDimensionsPropTypes,
  SMALL: CardDimensionsPropTypes,
  TALL: CardDimensionsPropTypes,
  MEDIUM: CardDimensionsPropTypes,
  WIDE: CardDimensionsPropTypes,
  LARGE: CardDimensionsPropTypes,
  XLARGE: CardDimensionsPropTypes,
});
