import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import find from 'lodash/find';

import { getLayout } from '../../utils/componentUtilityFunctions';
import {
  CardSizesToDimensionsPropTypes,
  RowHeightPropTypes,
  DashboardBreakpointsPropTypes,
  DashboardColumnsPropTypes,
  DashboardLayoutPropTypes,
} from '../../constants/PropTypes';
import {
  DASHBOARD_COLUMNS,
  DASHBOARD_BREAKPOINTS,
  CARD_DIMENSIONS,
  CARD_SIZES,
  ROW_HEIGHT,
  GUTTER,
} from '../../constants/LayoutConstants';

import DashboardHeader from './DashboardHeader';
import CardRenderer from './CardRenderer';

const propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  /** optional actions that will be rendered in the Dashboard header and used in onDashboardAction */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      /** Unique id of the action */
      id: PropTypes.string.isRequired,
      /** icon ultimately gets passed through all the way to <Button>, which has this same copied proptype definition for icon */
      icon: PropTypes.oneOfType([
        PropTypes.shape({
          width: PropTypes.string,
          height: PropTypes.string,
          viewBox: PropTypes.string.isRequired,
          svgData: PropTypes.object.isRequired,
        }),
        PropTypes.string,
        PropTypes.node,
      ]),
      labelText: PropTypes.string,
    })
  ),
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.object,
      values: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      /** is the card actively loading, it will override the dashboard loading state if true */
      isLoading: PropTypes.bool,
      /** was there an error loading */
      error: PropTypes.node,
    })
  ).isRequired,
  layouts: PropTypes.shape({
    max: PropTypes.arrayOf(DashboardLayoutPropTypes),
    xl: PropTypes.arrayOf(DashboardLayoutPropTypes),
    lg: PropTypes.arrayOf(DashboardLayoutPropTypes),
    md: PropTypes.arrayOf(DashboardLayoutPropTypes),
    sm: PropTypes.arrayOf(DashboardLayoutPropTypes),
    xs: PropTypes.arrayOf(DashboardLayoutPropTypes),
  }),

  /** Is the dashboard in edit mode? */
  isEditable: PropTypes.bool,
  /** Optional filter that should be rendered top right */
  filter: PropTypes.node,
  /** Optional sidebar content that should be rendered left of the dashboard cards */
  sidebar: PropTypes.node,
  /** If the header should render the last updated section */
  hasLastUpdated: PropTypes.bool,

  // Callback functions
  /** Callback called when a card should fetch its data, called with the card props and a boolean that determines whether a card supports timeseries data or not.  Return a promise that returns the updated card object with values.  It will be passed downstream to your card as props to update. */
  onFetchData: PropTypes.func,
  /** Optional Function that is called back if the card has a setup phase before data fetching */
  onSetupCard: PropTypes.func,
  /** Optionally listen to layout changes to update a dashboard template
   * Calls back with (currentLayout: Layout, allLayouts: {[key: $Keys<breakpoints>]: Layout}) => void,
   */
  onLayoutChange: PropTypes.func,
  /** Optionally listen to window resize events to update a dashboard template */
  onBreakpointChange: PropTypes.func,
  /** Callback called when an action is clicked.  The id of the action is passed to the callback */
  onDashboardAction: PropTypes.func,

  // Data related properties
  /** If the overall dashboard should be using a timeGrain, we pass it here */
  timeGrain: PropTypes.string,
  /** Property that will trigger all cards to load again */
  isLoading: PropTypes.bool,
  /** once all the cards have finished loading this will be called */
  setIsLoading: PropTypes.func,

  /** All the labels that need translation */
  i18n: PropTypes.shape({
    lastUpdatedLabel: PropTypes.string,
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
    expandLabel: PropTypes.string,
    overflowMenuDescription: PropTypes.string,

    // card actions
    editCardLabel: PropTypes.string,
    cloneCardLabel: PropTypes.string,
    deleteCardLabel: PropTypes.string,
    // labels for table card
    criticalLabel: PropTypes.string,
    moderateLabel: PropTypes.string,
    lowLabel: PropTypes.string,
    selectSeverityPlaceholder: PropTypes.string,
    severityLabel: PropTypes.string,
    defaultFilterStringPlaceholdText: PropTypes.string,
    downloadIconDescription: PropTypes.string,

    // table labels
    pageBackwardAria: PropTypes.string,
    pageForwardAria: PropTypes.string,
    pageNumberAria: PropTypes.string,
    itemsPerPage: PropTypes.string,
    currentPage: PropTypes.func,
    itemsRangeWithTotal: PropTypes.func,
    pageRange: PropTypes.func,
    /** table body */
    overflowMenuAria: PropTypes.string,
    clickToExpandAria: PropTypes.string,
    clickToCollapseAria: PropTypes.string,
    selectAllAria: PropTypes.string,
    selectRowAria: PropTypes.string,
    /** toolbar */
    clearAllFilters: PropTypes.string,
    columnSelectionButtonAria: PropTypes.string,
    clearFilterAria: PropTypes.string,
    filterAria: PropTypes.string,
    openMenuAria: PropTypes.string,
    closeMenuAria: PropTypes.string,
    clearSelectionAria: PropTypes.string,
    /** empty state */
    emptyMessage: PropTypes.string,
    emptyMessageWithFilters: PropTypes.string,
    emptyButtonLabelWithFilters: PropTypes.string,
    inProgressText: PropTypes.string,
    actionFailedText: PropTypes.string,
    learnMoreText: PropTypes.string,
    dismissText: PropTypes.string,
  }),

  /** (Optional) Row height in pixels for each layout */
  rowHeight: RowHeightPropTypes,
  /** (Optional) media query pixel measurement that determines which particular dashboard layout should be used */
  dashboardBreakpoints: DashboardBreakpointsPropTypes,
  /** (Optional) map of number of columns to a given dashboard layout */
  dashboardColumns: DashboardColumnsPropTypes,
  /** (Optional) array of configurable sizes to dimensions */
  cardDimensions: CardSizesToDimensionsPropTypes,
};

const defaultProps = {
  isEditable: false,
  description: null,
  onLayoutChange: null,
  onDashboardAction: null,
  onBreakpointChange: null,
  i18n: {
    lastUpdatedLabel: 'Last updated: ',
    noDataLabel: 'No data is available for this time range.',
    noDataShortLabel: 'No data',
    errorLoadingDataLabel: 'Error loading data for this card: ',
    errorLoadingDataShortLabel: 'Data error.',
    // card labels
    rollingPeriodLabel: 'Rolling period',
    last24HoursLabel: 'Last 24 hrs',
    last7DaysLabel: 'Last 7 days',
    lastMonthLabel: 'Last month',
    lastQuarterLabel: 'Last quarter',
    lastYearLabel: 'Last year',
    periodToDateLabel: 'Period to date',
    thisWeekLabel: 'This week',
    thisMonthLabel: 'This month',
    thisQuarterLabel: 'This quarter',
    thisYearLabel: 'This year',
    hourlyLabel: 'Hourly',
    dailyLabel: 'Daily',
    weeklyLabel: 'Weekly',
    monthlyLabel: 'Monthly',
    expandLabel: 'Expand to fullscreen',
    overflowMenuDescription: 'open and close list of options',

    // card actions
    editCardLabel: 'Edit card',
    cloneCardLabel: 'Clone card',
    deleteCardLabel: 'Delete card',
    // table card labels
    criticalLabel: 'Critical',
    moderateLabel: 'Moderate',
    lowLabel: 'Low',
    selectSeverityPlaceholder: 'Select a severity',
    severityLabel: 'Severity',
    searchPlaceholder: 'Search',
    filterButtonAria: 'Filters',
    defaultFilterStringPlaceholdText: 'Type and hit enter to apply',
    pageBackwardAria: 'Previous page',
    pageForwardAria: 'Next page',
    pageNumberAria: 'Page Number',
    itemsPerPage: 'Items per page:',
    currentPage: page => `__page ${page}__`,
    itemsRangeWithTotal: (min, max, total) => `__${min}–${max} of ${total} items__`,
    pageRange: (current, total) => `__${current} of ${total} pages__`,
    /** table body */
    overflowMenuAria: 'More actions',
    clickToExpandAria: 'Click to expand content',
    clickToCollapseAria: 'Click to collapse content',
    selectAllAria: 'Select all items',
    selectRowAria: 'Select row',
    /** toolbar */
    clearAllFilters: 'Clear all filters',
    columnSelectionButtonAria: 'Column Selection',
    clearFilterAria: 'Clear filter',
    filterAria: 'Filter',
    openMenuAria: 'Open menu',
    closeMenuAria: 'Close menu',
    clearSelectionAria: 'Clear selection',
    /** empty state */
    emptyMessage: 'There are no alerts in this range.',
    emptyMessageWithFilters: 'No results match the current filters',
    emptyButtonLabel: 'Create some data',
    emptyButtonLabelWithFilters: 'Clear all filters',
    inProgressText: 'In Progress',
    actionFailedText: 'Action Failed',
    learnMoreText: 'Learn More',
    dismissText: 'Dismiss',
    downloadIconDescription: 'Download table content',
  },

  layouts: {},
  rowHeight: ROW_HEIGHT,
  cardDimensions: CARD_DIMENSIONS,
  dashboardBreakpoints: DASHBOARD_BREAKPOINTS,
  dashboardColumns: DASHBOARD_COLUMNS,
  filter: null,
  sidebar: null,
  actions: [],
  hasLastUpdated: true,
  onSetupCard: null,
  onFetchData: null,
  timeGrain: null,
  isLoading: false,
  setIsLoading: null,
};

const GridLayout = WidthProvider(Responsive);

const StyledGridLayout = styled(GridLayout)`
  &&& {
    .react-grid-item.cssTransforms {
      transition-property: ${props => (props.shouldAnimate ? 'transform' : 'none')};
    }
  }
`;

/** This component renders one individual dashboard. The passed cards are set into a grid layout based on the individual card sizes and layouts.
 * It keeps track of whether any cards are actively loading data and shows a loading spinner at the top.
 * It listens to all the cards data fetching, and updates it's overall refresh date once all cards have finished fetching data.
 *
 * To enable your cards to fetch data, you must implement the onFetchData callback.  The callback is called with the full card prop object,
 * and then a boolean that describes whether to return timeseries data or not.  You should asynchronously return an array of values from your callback to populate your
 * cards with data.
 */
const Dashboard = ({
  cards,
  title,
  description,
  hasLastUpdated,
  i18n,
  i18n: { lastUpdatedLabel },
  dashboardBreakpoints,
  cardDimensions,
  dashboardColumns,
  filter,
  sidebar,
  rowHeight,
  layouts,
  isEditable,
  onLayoutChange,
  onBreakpointChange,
  className,
  actions,
  onDashboardAction,
  isLoading,
  setIsLoading,
  // TODO: remove onSetRefresh and instead listen to setIsLoading
  onSetRefresh, // eslint-disable-line
  onSetupCard,
  // TODO: fix the rendering of the lastUpdated bit, to migrate in the style from our ibm repo
  lastUpdated, // eslint-disable-line
  onFetchData,
  timeGrain,
}) => {
  const [breakpoint, setBreakpoint] = useState('lg');

  // Keep track of whether any cards are loading or not, (doesn't need to be in state)
  const cardsLoadingRef = useRef();

  // Setup the loading tracker for the cards if the dashboard decides to load
  useEffect(
    () => {
      if (isLoading) {
        cardsLoadingRef.current = [];
        onSetRefresh(null);
      } else {
        cardsLoadingRef.current = undefined;
      }
    },
    [isLoading] // eslint-disable-line
  );

  // Listen to the card fetches to determine whether all cards have finished loading
  const handleOnFetchData = useCallback(
    (card, ...args) => {
      return onFetchData(card, ...args).finally(() => {
        if (cardsLoadingRef.current && !cardsLoadingRef.current.includes(card.id)) {
          cardsLoadingRef.current.push(card.id);
          // If the card array count matches the card count, we call setIsLoading to false, and clear the array
          if (cardsLoadingRef.current.length === cards.length) {
            setIsLoading(false);
            onSetRefresh(Date.now());
          }
        }
      });
    },
    [onFetchData, cards.length] // eslint-disable-line
  );

  const generatedLayouts = useMemo(
    () =>
      Object.keys(dashboardBreakpoints).reduce((acc, layoutName) => {
        return {
          ...acc, // only generate the layout if we're not passed from the parent
          [layoutName]:
            layouts && layouts[layoutName]
              ? layouts[layoutName].map(layout => {
                  // if we can't find the card from the layout, assume small
                  let matchingCard = find(cards, { id: layout.i });
                  if (!matchingCard) {
                    console.error(`Error with your layout. Card with id: ${layout.i} not found`); //eslint-disable-line
                    matchingCard = { size: CARD_SIZES.SMALL };
                  }
                  return { ...layout, ...cardDimensions[matchingCard.size][layoutName] };
                })
              : getLayout(layoutName, cards, dashboardColumns, cardDimensions),
        };
      }, {}),
    [cardDimensions, dashboardBreakpoints, dashboardColumns, layouts] // eslint-disable-line
  );

  // Caching for performance
  const cachedI18N = useMemo(() => i18n, []); // eslint-disable-line
  const cachedMargin = useMemo(() => [GUTTER, GUTTER], []);

  const handleLayoutChange = (layout, allLayouts) =>
    onLayoutChange && onLayoutChange(layout, allLayouts);

  const handleBreakpointChange = newBreakpoint => {
    setBreakpoint(newBreakpoint);
    if (onBreakpointChange) {
      onBreakpointChange(newBreakpoint);
    }
  };

  const cachedOnLayoutChange = useCallback(handleLayoutChange, [onLayoutChange]);
  const cachedOnBreakpointChange = useCallback(handleBreakpointChange, [onBreakpointChange]);

  const gridContents = useMemo(
    () =>
      cards.map(card =>
        card ? (
          <CardRenderer
            card={card}
            key={card.id}
            i18n={cachedI18N}
            dashboardBreakpoints={dashboardBreakpoints}
            cardDimensions={cardDimensions}
            dashboardColumns={dashboardColumns}
            rowHeight={rowHeight}
            isLoading={isLoading}
            isEditable={isEditable}
            breakpoint={breakpoint}
            onSetupCard={onSetupCard}
            onFetchData={handleOnFetchData}
            timeGrain={timeGrain}
          />
        ) : null
      ), // eslint-disable-next-line
    [
      breakpoint,
      cachedI18N,
      cardDimensions,
      cards,
      dashboardBreakpoints,
      dashboardColumns,
      isEditable,
      isLoading,
      rowHeight,
      handleOnFetchData,
      timeGrain,
    ]
  );

  return (
    <div className={className}>
      <DashboardHeader
        title={title}
        description={description}
        lastUpdatedLabel={!isEditable ? lastUpdatedLabel : null}
        isLoading={isLoading}
        filter={filter}
        hasLastUpdated={hasLastUpdated}
        lastUpdated={lastUpdated}
        actions={actions}
        onDashboardAction={onDashboardAction}
      />
      <div style={{ display: 'flex' }}>
        {sidebar && <div style={{ flex: 0 }}>{sidebar}</div>}
        <div style={{ flex: 1 }}>
          <StyledGridLayout
            layouts={generatedLayouts}
            compactType="vertical"
            cols={dashboardColumns}
            breakpoints={dashboardBreakpoints}
            margin={cachedMargin}
            rowHeight={rowHeight[breakpoint]}
            preventCollision={false}
            // Stop the initial animation
            shouldAnimate={isEditable}
            onLayoutChange={cachedOnLayoutChange}
            onBreakpointChange={cachedOnBreakpointChange}
            isResizable={false}
            isDraggable={isEditable}
          >
            {gridContents}
          </StyledGridLayout>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

export default Dashboard;
