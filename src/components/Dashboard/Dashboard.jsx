import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import find from 'lodash/find';

import { getLayout } from '../../utils/componentUtilityFunctions';
import {
  ValueCardPropTypes,
  CardSizesToDimensionsPropTypes,
  RowHeightPropTypes,
  DashboardBreakpointsPropTypes,
  DashboardColumnsPropTypes,
} from '../../constants/PropTypes';
import ValueCard from '../ValueCard/ValueCard';
import DonutCard from '../DonutCard/DonutCard';
import BarChartCard from '../BarChartCard/BarChartCard';
import PieCard from '../PieCard/PieCard';
import TimeSeriesCard from '../TimeSeriesCard/TimeSeriesCard';
import {
  DASHBOARD_COLUMNS,
  DASHBOARD_BREAKPOINTS,
  CARD_DIMENSIONS,
  ROW_HEIGHT,
  GUTTER,
  CARD_TYPES,
} from '../../constants/LayoutConstants';

import DashboardHeader from './DashboardHeader';

const propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  lastUpdated: PropTypes.string,
  lastUpdatedLabel: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.shape(ValueCardPropTypes)).isRequired,
  layouts: PropTypes.shape({
    max: PropTypes.array,
    xl: PropTypes.array,
    lg: PropTypes.array,
    md: PropTypes.array,
    sm: PropTypes.array,
    xs: PropTypes.array,
  }),
  /** Row height in pixels for each layout */
  rowHeight: RowHeightPropTypes,
  /** media query pixel measurement that determines which particular dashboard layout should be used */
  dashboardBreakpoints: DashboardBreakpointsPropTypes,
  /** map of number of columns to a given dashboard layout */
  dashboardColumns: DashboardColumnsPropTypes,
  onCardAction: PropTypes.func,
  /** Is the dashboard in edit mode? */
  isEditable: PropTypes.bool,
  /** array of configurable sizes to dimensions */
  cardDimensions: CardSizesToDimensionsPropTypes,
};

const defaultProps = {
  isEditable: false,
  description: null,
  lastUpdated: null,
  lastUpdatedLabel: 'Last updated: ',
  layouts: {},
  rowHeight: ROW_HEIGHT,
  onCardAction: null,
  cardDimensions: CARD_DIMENSIONS,
  dashboardBreakpoints: DASHBOARD_BREAKPOINTS,
  dashboardColumns: DASHBOARD_COLUMNS,
};

const GridLayout = WidthProvider(Responsive);

/** This component is a dumb component and only knows how to render itself */
const Dashboard = ({
  cards,
  onCardAction,
  title,
  description,
  lastUpdated,
  lastUpdatedLabel,
  dashboardBreakpoints,
  cardDimensions,
  dashboardColumns,
  rowHeight,
  layouts,
  isEditable,
}) => {
  const [breakpoint, setBreakpoint] = useState('lg');
  // console.log(breakpoint);
  // console.log(dashboardBreakpoints, cardDimensions, rowHeight);

  const generatedLayouts = Object.keys(dashboardBreakpoints).reduce((acc, layoutName) => {
    return {
      ...acc, // only generate the layout if we're not passed from the parent
      [layoutName]:
        layouts && layouts[layoutName]
          ? layouts[layoutName].map(layout => {
              const matchingCard = find(cards, { id: layout.i });
              return { ...layout, ...cardDimensions[matchingCard.size][layoutName] };
            })
          : getLayout(layoutName, cards, dashboardColumns, cardDimensions),
    };
  }, {});

  // TODO: Can we pickup the GUTTER size and PADDING from the carbon grid styles? or css variables?
  // console.log(generatedLayouts);
  return (
    <div>
      <DashboardHeader
        title={title}
        description={description}
        lastUpdated={lastUpdated}
        lastUpdatedLabel={lastUpdatedLabel}
      />
      <GridLayout
        layouts={generatedLayouts}
        compactType="vertical"
        cols={dashboardColumns}
        breakpoints={dashboardBreakpoints}
        margin={[GUTTER, GUTTER]}
        rowHeight={rowHeight[breakpoint]}
        preventCollision={false}
        // TODO: need to consider preserving their loose packing decisions on layout change
        // TODO: also, should we reorder our cards based on the layout change, and regenerate all
        //       other layouts?  for example, moving card 5 to before card 2 in lg should mean
        //       that the order changes for xl, md, sm, xs, etc. layouts
        /* onLayoutChange={
         layout =>  console.log('new layout, time to regenerate', JSON.stringify(layout)
        } */
        onBreakpointChange={newBreakpoint => setBreakpoint(newBreakpoint)}
        isResizable={false}
        isDraggable={isEditable}>
        {cards.map(card => (
          <div key={card.id}>
            {card.type === CARD_TYPES.VALUE ? (
              <ValueCard
                {...card}
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
        ))}
      </GridLayout>
    </div>
  );
};

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

export default Dashboard;
