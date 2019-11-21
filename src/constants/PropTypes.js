import PropTypes from 'prop-types';

import { bundledIconNames } from '../utils/bundledIcons';

import { CARD_SIZES, CARD_LAYOUTS, DASHBOARD_SIZES } from './LayoutConstants';

export const AttributePropTypes = PropTypes.shape({
  label: PropTypes.string, // optional for little cards
  /** the key to load the value from the values object */
  dataSourceId: PropTypes.string.isRequired,
  secondaryValue: PropTypes.shape({
    /** the key to load the value from the values object */
    dataSourceId: PropTypes.string.isRequired,
    color: PropTypes.string,
    trend: PropTypes.oneOf(['up', 'down']),
  }),
  thresholds: PropTypes.arrayOf(
    PropTypes.shape({
      comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      color: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
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
  content: PropTypes.shape({ attributes: PropTypes.arrayOf(AttributePropTypes).isRequired }),
  /** Value card expects its values passed as an object with key value pairs */
  values: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};

export const TimeSeriesDatasetPropTypes = PropTypes.shape({
  label: PropTypes.string.isRequired,
  /** the attribute in values to map to */
  dataSourceId: PropTypes.string.isRequired,
  /** optional units to put in the legend */
  unit: PropTypes.string,
  /** optional param to set the colors */
  color: PropTypes.string,
});

export const TimeSeriesCardPropTypes = {
  content: PropTypes.shape({
    series: PropTypes.oneOfType([
      TimeSeriesDatasetPropTypes,
      PropTypes.arrayOf(TimeSeriesDatasetPropTypes),
    ]).isRequired,
    xLabel: PropTypes.string,
    yLabel: PropTypes.string,
    /** Which attribute is the time attribute */
    timeDataSourceId: PropTypes.string,
  }).isRequired,
  i18n: PropTypes.shape({
    alertDetected: PropTypes.string,
  }),
  /** array of data from the backend for instance [{timestamp: 134234234234, temperature: 35, humidity: 10}, ...] */
  values: PropTypes.arrayOf(PropTypes.object),
};

export const TableCardPropTypes = {
  content: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
        /** optional width in pixels, default is no enforced max width */
        width: PropTypes.number,
        label: PropTypes.string.isRequired,
        priority: PropTypes.number,
        renderer: PropTypes.func,
        type: PropTypes.string,
      })
    ).isRequired,
    showHeader: PropTypes.bool,
    expandedRows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
      })
    ),
    thresholds: PropTypes.arrayOf(
      PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
        comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']).isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        severity: PropTypes.oneOf([1, 2, 3]),
        label: PropTypes.string,
        showOnContent: PropTypes.bool,
      })
    ),
    sort: PropTypes.oneOf(['ASC', 'DESC']),
    emptyMessage: PropTypes.string,
  }).isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      values: PropTypes.object.isRequired,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string,
          icon: PropTypes.oneOfType([
            PropTypes.oneOf(bundledIconNames),
            PropTypes.shape({
              width: PropTypes.string,
              height: PropTypes.string,
              viewBox: PropTypes.string.isRequired,
              svgData: PropTypes.object.isRequired,
            }),
          ]),
        })
      ),
    })
  ),
  i18n: PropTypes.shape({
    criticalLabel: PropTypes.string,
    moderateLabel: PropTypes.string,
    lowLabel: PropTypes.string,
    selectSeverityPlaceholder: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    filterButtonAria: PropTypes.string,
    defaultFilterStringPlaceholdText: PropTypes.string,
    downloadIconDescription: PropTypes.string,
  }),
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

export const ImageCardPropTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.object,
  }).isRequired,
  values: PropTypes.shape({
    hotspots: PropTypes.array,
  }),
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
  title: PropTypes.string,
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  isEmpty: PropTypes.bool,
  isEditable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  size: PropTypes.oneOf(Object.values(CARD_SIZES)),
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  breakpoint: PropTypes.oneOf(Object.values(DASHBOARD_SIZES)),
  /** Optional range to pass at the card level */
  timeRange: PropTypes.oneOf([
    'last24Hours',
    'last7Days',
    'lastMonth',
    'lastQuarter',
    'lastYear',
    'thisWeek',
    'thisMonth',
    'thisQuarter',
    'thisYear',
    '',
  ]),
  /** Interval for time series configuration */
  interval: PropTypes.oneOf(['hour', 'day', 'week', 'month', 'year']),
  availableActions: PropTypes.shape({
    edit: PropTypes.bool,
    clone: PropTypes.bool,
    delete: PropTypes.bool,
    expand: PropTypes.bool,
    range: PropTypes.bool,
  }),
  /** All the labels that need translation */
  i18n: PropTypes.shape({
    noDataLabel: PropTypes.string,
    noDataShortLabel: PropTypes.string,
    errorLoadingDataLabel: PropTypes.string,
    errorLoadingDataShortLabel: PropTypes.string,
    // card labels
    rollingPeriodLabel: PropTypes.string,
    last24HoursLabel: PropTypes.string,
    last7DaysLabel: PropTypes.string,
    lastMonthLabel: PropTypes.string,
    lastQuarterLabel: PropTypes.string,
    lastYearLabel: PropTypes.string,
    periodToDateLabel: PropTypes.string,
    thisWeekLabel: PropTypes.string,
    thisMonthLabel: PropTypes.string,
    thisQuarterLabel: PropTypes.string,
    thisYearLabel: PropTypes.string,
    hourlyLabel: PropTypes.string,
    dailyLabel: PropTypes.string,
    weeklyLabel: PropTypes.string,
    monthlyLabel: PropTypes.string,
    // card actions
    editCardLabel: PropTypes.string,
    cloneCardLabel: PropTypes.string,
    deleteCardLabel: PropTypes.string,
    expandLabel: PropTypes.string,
    closeLabel: PropTypes.string,
    loadingDataLabel: PropTypes.string,
    overflowMenuDescription: PropTypes.string,
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
