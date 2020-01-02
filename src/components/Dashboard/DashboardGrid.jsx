import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import styled from 'styled-components';
import find from 'lodash/find';

import { getLayout } from '../../utils/componentUtilityFunctions';
import {
  CARD_SIZES,
  GUTTER,
  ROW_HEIGHT,
  CARD_DIMENSIONS,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLUMNS,
} from '../../constants/LayoutConstants';
import { DashboardLayoutPropTypes } from '../../constants/PropTypes';

const GridLayout = WidthProvider(Responsive);

const StyledGridLayout = styled(GridLayout)`
  &&& {
    position: relative;
    .react-grid-item.cssTransforms {
      transition-property: ${props => (props.shouldAnimate ? 'transform' : 'none')};
    }
  }
`;

export const DashboardGridPropTypes = {
  /** Array of elements to render in the grid (recommended that you use our Card component) */
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  /** current screen breakpoint which determine which dashboard layout to use */
  breakpoint: PropTypes.oneOf(['max', 'xl', 'lg', 'md', 'sm', 'xs']),
  /** Is the dashboard currently in the editable state */
  isEditable: PropTypes.bool,
  /** current set of react-grid-layout rules for laying the cards out
   * Layout is an array of objects with the format:
   * {x: number, y: number, w: number, h: number}
   * The index into the layout must match the key used on each item component.
   * If you choose to use custom keys, you can specify that key in the layout
   * array objects like so:
   * {i: string, x: number, y: number, w: number, h: number}
   */
  layouts: PropTypes.shape({
    max: PropTypes.arrayOf(DashboardLayoutPropTypes),
    xl: PropTypes.arrayOf(DashboardLayoutPropTypes),
    lg: PropTypes.arrayOf(DashboardLayoutPropTypes),
    md: PropTypes.arrayOf(DashboardLayoutPropTypes),
    sm: PropTypes.arrayOf(DashboardLayoutPropTypes),
    xs: PropTypes.arrayOf(DashboardLayoutPropTypes),
  }),
  /**
   * Optionally listen to layout changes to update a dashboard template
   * Calls back with (currentLayout: Layout, allLayouts: {[key: $Keys<breakpoints>]: Layout}) => void,
   */
  onLayoutChange: PropTypes.func,
  /** Optionally listen to window resize events to update a dashboard template */
  onBreakpointChange: PropTypes.func,
};

const defaultProps = {
  breakpoint: 'lg',
  isEditable: false,
  layouts: {},
  onLayoutChange: null,
  onBreakpointChange: null,
};

/**
 * Renders the grid of cards according to the standardized PAL patterns for IoT.
 *
 * This is a stateless component but it does have some caching to help optimize performance.
 *
 * Gutter size and card dimensions, row heights, dashboard breakpoints, and column grids are standardized across IoT,
 * it passes this information down to each cards as it renders them.
 *
 * If the dashboardgrid is set to editable mode, it supports dragging and dropping the cards around.
 * On each change to card position, the onLayoutChange callback will be triggered.
 *
 * If the window is resized, the onBreakpointChange event will be fired.
 *
 * You can also pass any of the additional properties documented here:
 * https://github.com/STRML/react-grid-layout#grid-layout-props
 *
 *
 */
const DashboardGrid = ({
  children,
  breakpoint,
  isEditable,
  layouts,
  onLayoutChange,
  onBreakpointChange,
  ...others
}) => {
  // Unfortunately can't use React.Children.map because it breaks the original key which breaks react-grid-layout
  const childrenArray = useMemo(() => (Array.isArray(children) ? children : [children]), [
    children,
  ]);
  const generatedLayouts = useMemo(
    () =>
      // iterate through each breakpoint
      Object.keys(DASHBOARD_BREAKPOINTS).reduce((acc, layoutName) => {
        return {
          ...acc, // only generate the layout if we're not passed from the parent
          [layoutName]:
            layouts && layouts[layoutName]
              ? layouts[layoutName].map(layout => {
                  // iterate through all the cards of the laout
                  // if we can't find the card from the layout, assume small
                  let matchingCard = find(childrenArray, { props: { id: layout.i } });
                  if (!matchingCard) {
                    console.warn(`Error with your layout. Card with id: ${layout.i} not found`); //eslint-disable-line
                    matchingCard = { props: { size: CARD_SIZES.SMALL } };
                  }
                  return { ...layout, ...CARD_DIMENSIONS[matchingCard.props.size][layoutName] };
                })
              : getLayout(
                  layoutName,
                  childrenArray.map(card => card.props),
                  DASHBOARD_COLUMNS,
                  CARD_DIMENSIONS
                ),
        };
      }, {}),
    [childrenArray, layouts]
  );
  const cachedMargin = useMemo(() => [GUTTER, GUTTER], []);

  const handleLayoutChange = useCallback(
    (layout, allLayouts) => onLayoutChange && onLayoutChange(layout, allLayouts),
    [onLayoutChange]
  );

  // add the common measurements and key to the card so that the grid layout can find it
  const cards = useMemo(
    () => {
      return childrenArray.map(card =>
        React.cloneElement(card, {
          key: card.props.id,
          dashboardBreakpoints: DASHBOARD_BREAKPOINTS,
          cardDimensions: CARD_DIMENSIONS,
          dashboardColumns: DASHBOARD_COLUMNS,
          rowHeight: ROW_HEIGHT,
        })
      );
    },
    [childrenArray]
  );

  return (
    <div style={{ flex: 1 }}>
      <StyledGridLayout
        layouts={generatedLayouts}
        compactType="vertical"
        cols={DASHBOARD_COLUMNS}
        breakpoints={DASHBOARD_BREAKPOINTS}
        margin={cachedMargin}
        rowHeight={ROW_HEIGHT[breakpoint]}
        preventCollision={false}
        // Stop the initial animation unless we need to support editing drag-and-drop
        shouldAnimate={false}
        onLayoutChange={handleLayoutChange}
        onBreakpointChange={onBreakpointChange}
        isResizable={false}
        isDraggable={isEditable}
        {...others}
      >
        {cards}
      </StyledGridLayout>
    </div>
  );
};

DashboardGrid.propTypes = DashboardGridPropTypes;
DashboardGrid.defaultProps = defaultProps;
export default DashboardGrid;
