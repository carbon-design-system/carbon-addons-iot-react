import PropTypes from 'prop-types';

import deprecate from '../internal/deprecate';
import { bundledIconNames } from '../utils/bundledIcons';

import {
  CARD_LAYOUTS,
  DASHBOARD_SIZES,
  TIME_SERIES_TYPES,
  CARD_SIZES,
  LEGACY_CARD_SIZES,
  CARD_DATA_STATE,
  BAR_CHART_TYPES,
  BAR_CHART_LAYOUTS,
} from './LayoutConstants';

export const AttributePropTypes = PropTypes.shape({
  label: PropTypes.string, // optional for little cards
  /** the key to load the value from the values object */
  dataSourceId: PropTypes.string.isRequired,
  /** optional data filter to apply to each attribute */
  dataFilter: PropTypes.objectOf(PropTypes.any),
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
  /** DataState will override the cards default empty state and error string */
  dataState: PropTypes.shape({
    type: PropTypes.oneOf([CARD_DATA_STATE.NO_DATA, CARD_DATA_STATE.ERROR]).isRequired,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    extraTooltipText: PropTypes.string,
    learnMoreElement: PropTypes.element,
  }),
  cardVariables: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.number, PropTypes.bool])
  ),
};

export const TimeSeriesDatasetPropTypes = PropTypes.shape({
  label: PropTypes.string.isRequired,
  /** the attribute in values to map to */
  dataSourceId: PropTypes.string.isRequired,
  /** optional filter to apply to this particular line */
  dataFilter: PropTypes.objectOf(PropTypes.any),
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
    /** Custom X-axis label */
    xLabel: PropTypes.string,
    /** Custom Y-axis label */
    yLabel: PropTypes.string,
    /** Optionally hide zero. Useful when chart values are not close to zero, giving a better view of the meaningful data */
    includeZeroOnXaxis: PropTypes.bool,
    /** Optionally hide zero. Useful when chart values are not close to zero, giving a better view of the meaningful data */
    includeZeroOnYaxis: PropTypes.bool,
    /** Which attribute is the time attribute */
    timeDataSourceId: PropTypes.string,
    /** should it be a line chart or bar chart, default is line chart */
    chartType: PropTypes.oneOf(Object.values(TIME_SERIES_TYPES)),
  }).isRequired,
  i18n: PropTypes.shape({
    alertDetected: PropTypes.string,
  }),
  /** array of data from the backend for instance [{timestamp: 134234234234, temperature: 35, humidity: 10}, ...] */
  values: PropTypes.arrayOf(PropTypes.object),
  cardVariables: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.number, PropTypes.bool])
  ),
};

export const TableCardPropTypes = {
  tooltip: PropTypes.node,
  title: PropTypes.string,
  size: PropTypes.oneOf([CARD_SIZES.LARGE, CARD_SIZES.LARGEWIDE]),
  content: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        dataSourceId: PropTypes.string.isRequired,
        /** optional width in pixels, default is no enforced max width */
        width: PropTypes.number,
        label: PropTypes.string,
        priority: PropTypes.number,
        /** See the renderDataFunction for TablePropTypes */
        renderDataFunction: PropTypes.func,
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
        /** optional overrides for color and icon */
        color: PropTypes.string,
        /** Custom threshold icon name */
        icon: PropTypes.string,
        /** Custom threshold label text */
        label: PropTypes.string,
        /** Optionally shows threshold severity label text. Shows by default */
        showSeverityLabel: PropTypes.bool,
        /** Optionally changes threshold severity label text */
        severityLabel: PropTypes.string,
        /** Shows column when there is no data */
        showOnContent: PropTypes.bool,
      })
    ),
    sort: PropTypes.oneOf(['ASC', 'DESC']),
    emptyMessage: PropTypes.node,
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
  cardVariables: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.number, PropTypes.bool])
  ),
};

export const BarChartCardPropTypes = {
  size: PropTypes.oneOf(Object.values(CARD_SIZES)),
  content: PropTypes.shape({
    /** the layout of the bar chart (horizontal, vertical) */
    layout: PropTypes.oneOf(Object.values(BAR_CHART_LAYOUTS)),
    /** the type of bar chart (simple, grouped, stacked) */
    type: PropTypes.oneOf(Object.values(BAR_CHART_TYPES)),
    xLabel: PropTypes.string,
    yLabel: PropTypes.string,
    series: PropTypes.shape({
      /** the attribute in values to map to */
      dataSourceId: PropTypes.string,
      /** the attribute in values to group by */
      groupDataSourceId: PropTypes.string,
      /** the attribute in values to display the bars for */
      labelDataSourceId: PropTypes.string,
      /** the attribute that is the time attribute */
      timeDataSourceId: PropTypes.string,
      /** an array of HEX colors for the chart */
      colors: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  /** array of data from the backend for instance [{quarter: '2020-Q1', city: 'Amsterdam', particles: 44700}, ...] */
  values: PropTypes.arrayOf(PropTypes.object),
  i18n: PropTypes.shape({
    alertDetected: PropTypes.string,
  }),
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
export const GaugeCardPropTypes = {
  tooltip: PropTypes.element,
  content: PropTypes.shape({
    gauges: PropTypes.arrayOf(
      PropTypes.shape({
        dataSourceId: PropTypes.string,
        units: PropTypes.string,
        minimumValue: PropTypes.number,
        maximumValue: PropTypes.number,
        renderValueFunction: PropTypes.func,
        color: PropTypes.string,
        backgroundColor: PropTypes.string,
        shape: PropTypes.oneOf(['half-circle', 'line', 'circle']),
        trend: PropTypes.shape({
          /** the key to load the trend value from the values object. */
          dataSourceId: PropTypes.string,
          color: PropTypes.string,
          trend: PropTypes.oneOf(['up', 'down']),
        }),
        thresholds: PropTypes.arrayOf(
          PropTypes.shape({
            comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']),
            value: PropTypes.number,
            color: PropTypes.string,
            label: PropTypes.string,
          })
        ),
      })
    ),
  }),
  values: PropTypes.shape({
    temperature: PropTypes.number,
    temperatureTrend: PropTypes.number,
  }),
};

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
  /** goes full screen if expanded */
  isExpanded: PropTypes.bool,
  /** should hide the header */
  hideHeader: PropTypes.bool,
  /** sets the CardWrapper CSS overflow to visible */
  showOverflow: deprecate(
    PropTypes.bool,
    '\nThe prop `showOverflow` for Card has been deprecated. It was previously needed for a custom positioned tooltip in the ValueCard, but the ValueCard now uses the default positioning of the tooltip. The `iot--card--wrapper--overflowing` class has been removed. For automated testing, you can target `data-testid="Card"` instead.'
  ),
  size: PropTypes.oneOf(Object.values(LEGACY_CARD_SIZES)),
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
  interval: PropTypes.oneOf(['minute', 'hour', 'day', 'week', 'quarter', 'month', 'year']),
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
  /** optional function that should return an icon react element based on a icon name, it is called back with the icon name and then an object containing additional icon properties to add to the rendered icon */
  renderIconByName: PropTypes.func,
  /** Event handlers needed for Dashboard Grid - isEditable */
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  onScroll: PropTypes.func,
  /** For testing */
  testID: PropTypes.string,
  /** the locale of the card, needed for number and date formatting */
  locale: PropTypes.string,
};
