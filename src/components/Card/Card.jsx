import React from 'react';
import {
  Toolbar,
  ToolbarItem,
  Tooltip,
  OverflowMenu,
  OverflowMenuItem,
  Button,
  Select,
  SelectItem,
  SkeletonText,
} from 'carbon-components-react';
import Close16 from '@carbon/icons-react/lib/close/16';
import Popup20 from '@carbon/icons-react/lib/popup/20';
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
  padding: 0 ${CARD_CONTENT_PADDING / 2}px 0 ${CARD_CONTENT_PADDING}px;
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

const CardTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 20px;
`;

const StyledToolbar = styled(Toolbar)`
  &.bx--toolbar {
    margin-top: 0;
    margin-bottom: 0;
  }
  div.bx--overflow-menu {
    height: 30px;
  }
`;

const SkeletonWrapper = styled.div`
  padding: ${CARD_CONTENT_PADDING}px;
  width: 80%;
`;

const EmptyMessageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${CARD_CONTENT_PADDING}px ${CARD_CONTENT_PADDING}px;
  text-align: center;
  line-height: 1.3;
`;

const TinyButton = styled(Button)`
  &.bx--btn > svg {
    margin: 0;
  }
`;

const defaultProps = {
  size: CARD_SIZES.SMALL,
  layout: CARD_SIZES.HORIZONTAL,
  toolbar: undefined,
  isLoading: false,
  isEmpty: false,
  isEditable: false,
  isExpanded: false,
  availableActions: {
    edit: false,
    clone: false,
    delete: false,
    expand: false,
  },
  rowHeight: ROW_HEIGHT,
  breakpoint: DASHBOARD_SIZES.LARGE,
  cardDimensions: CARD_DIMENSIONS,
  dashboardBreakpoints: DASHBOARD_BREAKPOINTS,
  dashboardColumns: DASHBOARD_COLUMNS,
  i18n: {
    noDataLabel: 'No data is available for this time range.',
    noDataShortLabel: 'No data',
  },
};

const Card = ({
  size,
  children,
  title,
  layout,
  isLoading,
  isEmpty,
  isEditable,
  isExpanded,
  id,
  tooltip,
  onCardAction,
  availableActions,
  breakpoint,
  i18n: { noDataLabel, noDataShortLabel },
  ...others
}) => {
  const isXS = size === CARD_SIZES.XSMALL;
  const dimensions = getCardMinSize(
    breakpoint,
    size,
    others.dashboardBreakpoints,
    others.cardDimensions,
    others.rowHeight,
    others.dashboardColumns
  );

  const mergedAvailableActions = {
    ...defaultProps.availableActions,
    ...availableActions,
  };

  const timeBoxSelection = (
    <ToolbarItem>
      <Select
        inline
        hideLabel
        onChange={evt => console.log('new view: ', evt)} // eslint-disable-line
        defaultValue="weekly"
      >
        <SelectItem value="hourly" text="Hourly" />
        <SelectItem value="weekly" text="Weekly" />
        <SelectItem value="monthly" text="Monthly" />
      </Select>
    </ToolbarItem>
  );

  const toolbar = isEditable ? (
    <StyledToolbar>
      {(mergedAvailableActions.edit ||
        mergedAvailableActions.clone ||
        mergedAvailableActions.delete) && (
        <ToolbarItem>
          <OverflowMenu floatingMenu>
            {mergedAvailableActions.edit && (
              <OverflowMenuItem
                onClick={() => onCardAction(id, 'EDIT_CARD')}
                itemText="Edit card"
              />
            )}
            {mergedAvailableActions.clone && (
              <OverflowMenuItem
                onClick={() => onCardAction(id, 'CLONE_CARD')}
                itemText="Clone card"
              />
            )}
            {mergedAvailableActions.delete && (
              <OverflowMenuItem
                isDelete
                onClick={() => onCardAction(id, 'DELETE_CARD')}
                itemText="Delete card"
              />
            )}
          </OverflowMenu>
        </ToolbarItem>
      )}
    </StyledToolbar>
  ) : (
    <StyledToolbar>
      {// TODO: if we keep this, expose capability under prop
      false && timeBoxSelection}
      {mergedAvailableActions.expand && (
        <ToolbarItem>
          {isExpanded ? (
            <TinyButton
              kind="ghost"
              small
              renderIcon={Close16}
              onClick={() => onCardAction(id, 'CLOSE_EXPANDED_CARD')}
            />
          ) : (
            <TinyButton
              kind="ghost"
              small
              renderIcon={Popup20}
              onClick={() => onCardAction(id, 'OPEN_EXPANDED_CARD')}
            />
          )}
        </ToolbarItem>
      )}
    </StyledToolbar>
  );

  return (
    <CardWrapper id={id} dimensions={dimensions} {...others}>
      <CardHeader>
        <CardTitle title={title}>
          {title}&nbsp;
          {tooltip && <Tooltip triggerText="">{tooltip}</Tooltip>}
        </CardTitle>
        {toolbar}
      </CardHeader>
      <CardContent layout={layout} height={dimensions.y}>
        {isLoading ? (
          <SkeletonWrapper>
            <SkeletonText paragraph lineCount={size === CARD_SIZES.XSMALL ? 2 : 3} width="100%" />
          </SkeletonWrapper>
        ) : isEmpty ? (
          <EmptyMessageWrapper>{isXS ? noDataShortLabel : noDataLabel}</EmptyMessageWrapper>
        ) : (
          children
        )}
      </CardContent>
    </CardWrapper>
  );
};

Card.propTypes = CardPropTypes;
Card.defaultProps = defaultProps;

export default Card;
