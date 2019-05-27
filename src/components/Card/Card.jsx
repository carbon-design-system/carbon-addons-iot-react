import React from 'react';
import {
  Toolbar,
  ToolbarItem,
  ToolbarOption,
  OverflowMenu,
  RadioButton,
} from 'carbon-components-react';
import styled from 'styled-components';

import {
  CARD_LAYOUTS,
  CARD_TITLE_HEIGHT,
  CARD_CONTENT_PADDING,
  CARD_SIZES,
  ROW_HEIGHT,
  CARD_DIMENSIONS,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLUMNS,
  DASHBOARD_SIZES,
} from '../../constants/LayoutConstants';
import { CardPropTypes } from '../../constants/PropTypes';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

/** Full card */
const CardWrapper = styled.div`
  border: solid 1px #ddd;
  background: white;
  height: ${props => props.dimensions.y}px;
  min-width: ${props => props.dimensions.x}px;
  display: flex;
  flex-direction: column;
`;

/** Header */
export const CardHeader = styled.div`
  padding: 0 ${CARD_CONTENT_PADDING}px;
  flex: 0 1 ${CARD_TITLE_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
`;

export const CardContent = styled.div`
  flex: 1;
  display: flex;
  ${props =>
    props.layout === CARD_LAYOUTS.HORIZONTAL &&
    `
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  `}
  ${props =>
    props.layout === CARD_LAYOUTS.VERTICAL &&
    `
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  `}
`;

const StyledToolbar = styled(Toolbar)`
  &.bx--toolbar {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

// TODO: i can't figure out why the overflow menu renders behind
//       other cards, regardless of what z-index i set
const StyledOverflowMenu = styled(OverflowMenu)`
  ul.bx--overflow-menu-options--open {
    z-index: 100000;
  }
`;

const Card = ({ size, children, title, layout, id, onCardAction, breakpoint, ...others }) => {
  const dimensions = getCardMinSize(
    breakpoint,
    size,
    others.dashboardBreakpoints,
    others.cardDimensions,
    others.rowHeight,
    others.dashboardColumns
  );

  const toolbar = (
    <StyledToolbar>
      <ToolbarItem>
        <StyledOverflowMenu floatingMenu>
          {Object.values(CARD_SIZES).map(i => (
            <ToolbarOption key={i}>
              <RadioButton
                value={i}
                id={i}
                name="card-size"
                labelText={i}
                onChange={val => onCardAction(id, 'CARD_SIZE_CHANGED', { size: val })}
              />
            </ToolbarOption>
          ))}
        </StyledOverflowMenu>
      </ToolbarItem>
    </StyledToolbar>
  );

  return (
    <CardWrapper id={id} dimensions={dimensions} {...others}>
      {size !== CARD_SIZES.XSMALL ? (
        <CardHeader>
          <div>{title}</div>
          {toolbar}
        </CardHeader>
      ) : (
        <div style={{ position: 'absolute', top: 5, right: 10 }}>{toolbar}</div>
      )}
      <CardContent layout={layout} height={dimensions.y}>
        {children}
      </CardContent>
    </CardWrapper>
  );
};

Card.propTypes = CardPropTypes;
Card.defaultProps = {
  size: CARD_SIZES.SMALL,
  layout: CARD_SIZES.HORIZONTAL,
  toolbar: undefined,
  rowHeight: ROW_HEIGHT,
  breakpoint: DASHBOARD_SIZES.LARGE,
  cardDimensions: CARD_DIMENSIONS,
  dashboardBreakpoints: DASHBOARD_BREAKPOINTS,
  dashboardColumns: DASHBOARD_COLUMNS,
};

export default Card;
