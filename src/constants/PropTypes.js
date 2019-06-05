import PropTypes from 'prop-types';

import { CARD_SIZES, CARD_LAYOUTS, DASHBOARD_SIZES } from './LayoutConstants';

export const AttributePropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  value: PropTypes.any,
  secondaryValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.string,
      color: PropTypes.string,
      trend: PropTypes.oneOf(['up', 'down']),
    }),
  ]),
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

export const TimeSeriesDatasetPropTypes = PropTypes.shape({
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      t: PropTypes.number.isRequired,
      v: PropTypes.number.isRequired,
    })
  ),
  color: PropTypes.string,
});

export const TimeSeriesCardPropTypes = {
  content: PropTypes.shape({
    range: PropTypes.oneOfType([
      PropTypes.oneOf(['day', 'week', 'month']),
      PropTypes.shape({
        start: PropTypes.instanceOf(Date),
        end: PropTypes.instanceOf(Date),
      }),
    ]),
    data: PropTypes.oneOfType([
      TimeSeriesDatasetPropTypes,
      PropTypes.arrayOf(TimeSeriesDatasetPropTypes),
    ]).isRequired,
  }).isRequired,
};

export const TableCardPropTypes = {
  content: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        priority: PropTypes.number,
        renderer: PropTypes.func,
      })
    ).isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        values: PropTypes.object.isRequired,
        actions: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string,
            icon: PropTypes.string,
          })
        ),
      })
    ).isRequired,
  }).isRequired,
};

export const BarChartDatasetPropTypes = PropTypes.shape({
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ),
  color: PropTypes.string,
});

export const BarChartCardPropTypes = {
  content: PropTypes.shape({
    data: PropTypes.arrayOf(BarChartDatasetPropTypes),
  }).isRequired,
};

export const DonutCardPropTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        color: PropTypes.string,
      })
    ),
  }).isRequired,
};

export const PieCardPropTypes = DonutCardPropTypes;

export const DashboardLayoutPropTypes = PropTypes.shape({
  i: PropTypes.any,
  x: PropTypes.number,
  y: PropTypes.number,
  w: PropTypes.number,
  h: PropTypes.number,
});

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
  isLoading: PropTypes.bool,
  isEmpty: PropTypes.bool,
  isEditable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  size: PropTypes.oneOf(Object.values(CARD_SIZES)),
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  breakpoint: PropTypes.oneOf(Object.values(DASHBOARD_SIZES)),
  availableActions: PropTypes.shape({
    edit: PropTypes.bool,
    clone: PropTypes.bool,
    delete: PropTypes.bool,
    expand: PropTypes.bool,
  }),
  tooltip: PropTypes.element,
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
