import React, { useState } from 'react';
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
import ValueCard from '../ValueCard/ValueCard';
import DonutCard from '../DonutCard/DonutCard';
import TableCard from '../TableCard/TableCard';
import BarChartCard from '../BarChartCard/BarChartCard';
import PieCard from '../PieCard/PieCard';
import TimeSeriesCard from '../TimeSeriesCard/TimeSeriesCard';
import {
  DASHBOARD_COLUMNS,
  DASHBOARD_BREAKPOINTS,
  CARD_DIMENSIONS,
  CARD_SIZES,
  ROW_HEIGHT,
  GUTTER,
  CARD_TYPES,
} from '../../constants/LayoutConstants';

import DashboardHeader from './DashboardHeader';

const propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  lastUpdated: PropTypes.string,
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
  /** Row height in pixels for each layout */
  rowHeight: RowHeightPropTypes,
  /** media query pixel measurement that determines which particular dashboard layout should be used */
  dashboardBreakpoints: DashboardBreakpointsPropTypes,
  /** map of number of columns to a given dashboard layout */
  dashboardColumns: DashboardColumnsPropTypes,
  /** Add function callback if the layout is changed by dragging */
  onLayoutChange: PropTypes.func,
  /** Add function callback if the breakpoint has changed by dragging */
  onBreakpointChange: PropTypes.func,
  onCardAction: PropTypes.func,
  /** Is the dashboard in edit mode? */
  isEditable: PropTypes.bool,
  /** Is the dashboard loading data */
  isLoading: PropTypes.bool,
  /** array of configurable sizes to dimensions */
  cardDimensions: CardSizesToDimensionsPropTypes,
  /** Optional filter that should be rendered top right */
  filter: PropTypes.node,
  /** All the labels that need translation */
  i18n: PropTypes.shape({
    lastUpdatedLabel: PropTypes.string,
    noDataLabel: PropTypes.string,
    noDataShortLabel: PropTypes.string,
    errorLoadingDataLabel: PropTypes.string,
    errorLoadingDataShortLabel: PropTypes.string,
    dayByHourLabel: PropTypes.string,
    weekByDayLabel: PropTypes.string,
    monthByDayLabel: PropTypes.string,
    monthByWeekLabel: PropTypes.string,
    yearByMonthLabel: PropTypes.string,
    editCardLabel: PropTypes.string,
    cloneCardLabel: PropTypes.string,
    deleteCardLabel: PropTypes.string,
  }),
};

const defaultProps = {
  isEditable: false,
  isLoading: false,
  description: null,
  lastUpdated: null,
  onLayoutChange: null,
  onBreakpointChange: null,
  i18n: {
    lastUpdatedLabel: 'Last updated: ',
    noDataLabel: 'No data is available for this time range.',
    noDataShortLabel: 'No data',
    errorLoadingDataLabel: 'Error loading data for this card: ',
    errorLoadingDataShortLabel: 'Data error.',
    dayByHourLabel: 'Last 24 hours',
    weekByDayLabel: 'Last week - Daily',
    monthByDayLabel: 'Last month - Daily',
    monthByWeekLabel: 'Last month - Weekly',
    yearByMonthLabel: 'Last year - Monthly',
    editCardLabel: 'Edit card',
    cloneCardLabel: 'Clone card',
    deleteCardLabel: 'Delete card',
  },
  layouts: {},
  rowHeight: ROW_HEIGHT,
  onCardAction: null,
  cardDimensions: CARD_DIMENSIONS,
  dashboardBreakpoints: DASHBOARD_BREAKPOINTS,
  dashboardColumns: DASHBOARD_COLUMNS,
  filter: null,
};

const GridLayout = WidthProvider(Responsive);

const StyledGridLayout = styled(GridLayout)`
  &&& {
    .react-grid-item.cssTransforms {
      transition-property: ${props => (props.shouldAnimate ? 'transform' : 'none')};
    }
  }
`;

/** This component is a dumb component and only knows how to render itself */
const Dashboard = ({
  cards,
  onCardAction,
  title,
  description,
  lastUpdated,
  i18n: { lastUpdatedLabel },
  i18n,
  dashboardBreakpoints,
  cardDimensions,
  dashboardColumns,
  filter,
  rowHeight,
  layouts,
  isEditable,
  isLoading,
  onLayoutChange,
  onBreakpointChange,
  className,
}) => {
  const [breakpoint, setBreakpoint] = useState('lg');

  const renderCard = card => (
    <div key={card.id}>
      {card.type === CARD_TYPES.VALUE ? (
        <ValueCard
          {...card}
          i18n={i18n}
          isLoading={card.isLoading || isLoading}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.TIMESERIES ? (
        <TimeSeriesCard
          {...card}
          i18n={i18n}
          isLoading={card.isLoading || isLoading}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.TABLE ? (
        <TableCard
          {...card}
          i18n={i18n}
          isLoading={card.isLoading || isLoading}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.DONUT ? (
        <DonutCard
          {...card}
          i18n={i18n}
          isLoading={card.isLoading || isLoading}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.PIE ? (
        <PieCard
          {...card}
          i18n={i18n}
          isLoading={card.isLoading || isLoading}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
      {card.type === CARD_TYPES.BAR ? (
        <BarChartCard
          {...card}
          i18n={i18n}
          isLoading={card.isLoading || isLoading}
          isEditable={isEditable}
          onCardAction={onCardAction}
          key={card.id}
          breakpoint={breakpoint}
          dashboardBreakpoints={dashboardBreakpoints}
          dashboardColumns={dashboardColumns}
          cardDimensions={cardDimensions}
          rowHeight={rowHeight}
        />
      ) : null}
    </div>
  );

  const generatedLayouts = Object.keys(dashboardBreakpoints).reduce((acc, layoutName) => {
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
  }, {});

  // TODO: Can we pickup the GUTTER size and PADDING from the carbon grid styles? or css variables?
  // console.log(generatedLayouts);

  const gridContents = cards.map(card => renderCard(card));
  const expandedCard = cards.find(i => i.isExpanded) || null;

  return (
    <div className={className}>
      {expandedCard && (
        <div className="bx--modal is-visible">
          {renderCard({ ...expandedCard, size: CARD_SIZES.XLARGE })}
        </div>
      )}
      <DashboardHeader
        title={title}
        description={description}
        lastUpdated={!isEditable ? lastUpdated : null}
        lastUpdatedLabel={!isEditable ? lastUpdatedLabel : null}
        filter={filter}
      />
      <StyledGridLayout
        layouts={generatedLayouts}
        compactType="vertical"
        cols={dashboardColumns}
        breakpoints={dashboardBreakpoints}
        margin={[GUTTER, GUTTER]}
        rowHeight={rowHeight[breakpoint]}
        preventCollision={false}
        // Stop the initial animation
        shouldAnimate={isEditable}
        onLayoutChange={layout => onLayoutChange && onLayoutChange(layout)}
        onBreakpointChange={newBreakpoint => {
          setBreakpoint(newBreakpoint);
          if (onBreakpointChange) {
            onBreakpointChange(newBreakpoint);
          }
        }}
        isResizable={false}
        isDraggable={isEditable}
      >
        {gridContents}
      </StyledGridLayout>
    </div>
  );
};

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

export default Dashboard;
