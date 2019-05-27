import PropTypes from 'prop-types';

import { CARD_SIZES, CARD_LAYOUTS, DASHBOARD_SIZES } from './LayoutConstants';

export const AttributePropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  value: PropTypes.any,
  unit: PropTypes.string,
});

export const RowHeightPropTypes = PropTypes.shape({
  lg: PropTypes.number,
  md: PropTypes.number,
  sm: PropTypes.number,
  xs: PropTypes.number,
});

export const DashboardBreakpointsPropTypes = PropTypes.shape({
  lg: PropTypes.number,
  md: PropTypes.number,
  sm: PropTypes.number,
  xs: PropTypes.number,
});

export const DashboardColumnsPropTypes = PropTypes.shape({
  lg: PropTypes.number,
  md: PropTypes.number,
  sm: PropTypes.number,
  xs: PropTypes.number,
});

export const ValueCardPropTypes = {
  content: PropTypes.arrayOf(AttributePropTypes).isRequired,
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

export const CardPropTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string,
  size: PropTypes.oneOf(Object.values(CARD_SIZES)),
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  breakpoint: PropTypes.oneOf(Object.values(DASHBOARD_SIZES)),
  toolbar: PropTypes.element,
  /** Row height in pixels for each layout */
  rowHeight: RowHeightPropTypes,
  /** media query pixel measurement that determines which particular dashboard layout should be used */
  dashboardBreakpoints: DashboardBreakpointsPropTypes,
  /** map of number of columns to a given dashboard layout */
  dashboardColumns: DashboardColumnsPropTypes,
  /** array of configurable sizes to dimensions */
  cardDimensions: CardSizesToDimensionsPropTypes,
};
