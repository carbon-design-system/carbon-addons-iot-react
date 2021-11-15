import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import warning from 'warning';

import { SvgPropType } from '../../constants/SharedPropTypes';

import DashboardHeader from './DashboardHeader';
import DashboardGrid, { DashboardGridPropTypes } from './DashboardGrid';
import CardRenderer from './CardRenderer';

const propTypes = {
  title: PropTypes.string,
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
          svgData: SvgPropType.isRequired,
        }),
        PropTypes.string,
        PropTypes.node,
      ]),
      labelText: PropTypes.string,
    })
  ),
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
      values: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      /** is the card actively loading, it will override the dashboard loading state if true */
      isLoading: PropTypes.bool,
      /** was there an error loading */
      error: PropTypes.node,
    })
  ).isRequired,

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
  /** Callback called when an action is clicked.  The id of the action is passed to the callback */
  onDashboardAction: PropTypes.func,
  /** Callback called when a card determines what icon render based on a named string in card config
   *    example usage: renderIconByName(name = 'my--checkmark--icon', props = { title: 'A checkmark', etc. })
   */
  renderIconByName: PropTypes.func,

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
    defaultLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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
    alertDetected: PropTypes.string,

    // card actions
    editCardLabel: PropTypes.string,
    cloneCardLabel: PropTypes.string,
    deleteCardLabel: PropTypes.string,
    selectTimeRangeLabel: PropTypes.string,

    // image card labels:
    zoomIn: PropTypes.string,
    zoomOut: PropTypes.string,
    zoomToFit: PropTypes.string,

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
  ...omit(DashboardGridPropTypes, ['children', 'breakpoint']),
  testId: PropTypes.string,
};

const defaultProps = {
  title: null,
  description: null,
  onDashboardAction: null,
  i18n: {
    lastUpdatedLabel: 'Last updated: ',
    noDataLabel: 'No data is available for this time range.',
    noDataShortLabel: 'No data',
    errorLoadingDataLabel: 'Error loading data for this card: ',
    errorLoadingDataShortLabel: 'Data error.',
    alertDetected: 'Alert detected: ',
    // card labels
    rollingPeriodLabel: 'Rolling period',
    defaultLabel: 'Default',
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
    overflowMenuDescription: 'Open and close list of options',

    // card actions
    editCardLabel: 'Edit card',
    cloneCardLabel: 'Clone card',
    deleteCardLabel: 'Delete card',
    selectTimeRangeLabel: 'Select time range',
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
    currentPage: (page) => `__page ${page}__`,
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

  filter: null,
  sidebar: null,
  actions: [],
  hasLastUpdated: true,
  onSetupCard: null,
  onFetchData: null,
  renderIconByName: null,
  timeGrain: null,
  isLoading: false,
  setIsLoading: null,
  testId: 'dashboard',
};

/**
 * This component renders one individual dashboard from an array of properties.
 * The passed cards are set into a grid layout based on the individual card sizes and layouts.
 * It keeps track of the current breakpoint and passes it down to the rendered cards.
 * This dashboard only supports a fixed set of card types and uses the CardRenderer to make those determinations
 * If you want to render a custom card type you should compose your own dashboard component with the DashboardHeader,
 * DashboardGrid, and Card components.
 *
 * Data Loading:
 * It keeps track of whether any cards are actively loading data and shows a loading spinner at the top.
 * It listens to all the cards data fetching, and updates it's overall refresh date once all cards have finished fetching data.
 * To enable your cards to fetch data, you must implement the onFetchData callback. The callback is called with the full
 * card prop object, and then a boolean that describes whether to return timeseries data or not.  You should asynchronously
 * return an array of values from your callback to populate your cards with data.
 */
const Dashboard = ({
  cards,
  title,
  description,
  hasLastUpdated,
  i18n,
  i18n: { lastUpdatedLabel },
  filter,
  sidebar,
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
  onSetRefresh,
  onSetupCard,
  // TODO: fix the rendering of the lastUpdated bit, to migrate in the style from our ibm repo
  lastUpdated,
  renderIconByName,
  onFetchData,
  timeGrain,
  testId,
}) => {
  if (__DEV__) {
    warning(
      false,
      'Dashboard component has been deprecated and will be removed in the next release of `carbon-addons-iot-react`.'
    );
  }

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
    [isLoading] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Listen to the card fetches to determine whether all cards have finished loading
  const handleOnFetchData = useCallback(
    (card, ...args) => {
      return onFetchData(card, ...args).finally(() => {
        if (cardsLoadingRef.current && !cardsLoadingRef.current.includes(card.id)) {
          cardsLoadingRef.current.push(card.id);
          // If the card array count matches the card count, we call setIsLoading to false, and clear the array
          if (
            cardsLoadingRef.current.length ===
            cards.filter((cardsToLoad) => cardsToLoad.dataSource).length
          ) {
            setIsLoading(false);
            onSetRefresh(Date.now());
          }
        }
      });
    },
    [onFetchData, cards.length] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const cachedOnBreakpointChange = useCallback(
    (newBreakpoint) => {
      setBreakpoint(newBreakpoint);
      if (onBreakpointChange) {
        onBreakpointChange(newBreakpoint);
      }
    },
    [onBreakpointChange]
  );

  const cachedRenderIconByName = useCallback(
    renderIconByName,
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const cachedOnSetupCard = useCallback(
    onSetupCard,
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Uses our shared renderer for each card that knows how to render a fixed set of card types
  const gridContents = useMemo(
    () =>
      cards.map((card) => (
        <CardRenderer
          {...card}
          key={`renderer-${card.id}`}
          i18n={{ ...i18n, ...card.i18n }} // let the card level i18n override the dashboard i18n
          isLoading={isLoading}
          isEditable={isEditable}
          breakpoint={breakpoint}
          onSetupCard={cachedOnSetupCard}
          onFetchData={handleOnFetchData}
          renderIconByName={cachedRenderIconByName}
          timeGrain={timeGrain}
        />
      )), // eslint-disable-next-line react-hooks/exhaustive-deps
    [breakpoint, i18n, cards, isEditable, isLoading, handleOnFetchData, timeGrain]
  );

  return (
    <div data-testid={testId} className={className}>
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
        testId={`${testId}-header`}
      />
      <div style={{ display: 'flex' }}>
        {sidebar && (
          <div data-testid={`${testId}-sidebar`} style={{ flex: 0 }}>
            {sidebar}
          </div>
        )}
        <DashboardGrid
          layouts={layouts}
          onLayoutChange={onLayoutChange}
          isEditable={isEditable}
          breakpoint={breakpoint}
          onBreakpointChange={cachedOnBreakpointChange}
          testId={`${testId}-grid`}
        >
          {gridContents}
        </DashboardGrid>
      </div>
    </div>
  );
};

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

export default Dashboard;
