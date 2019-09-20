import React, { useState } from 'react';
import uuidv1 from 'uuid/v1';
import toClass from 'recompose/toClass';
import {
  Toolbar,
  ToolbarItem,
  ToolbarTitle,
  ToolbarOption,
  Tooltip,
  OverflowMenu,
  OverflowMenuItem,
  Button,
  Select,
  SelectItem,
  SelectItemGroup,
  SkeletonText,
} from 'carbon-components-react';
import { pure } from 'recompose';
import Close16 from '@carbon/icons-react/lib/close/16';
import ChevronDown16 from '@carbon/icons-react/lib/chevron--down/16';
import Popup20 from '@carbon/icons-react/lib/popup/20';
import styled from 'styled-components';

import {
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

const OptimizedSkeletonText = pure(SkeletonText);

/** Full card */
const CardWrapper = styled.div`
  background: white;
  min-height: ${props => props.dimensions.y}px;
  min-width: ${props => props.dimensions.x}px;
  ${props => (props.isExpanded ? 'height: 100%; width: 100%;' : '')};
  display: flex;
  flex-direction: column;
`;

/** Header */
export const CardHeader = styled.div`
  padding: 0 ${CARD_CONTENT_PADDING / 2}px 0 ${CARD_CONTENT_PADDING}px;
  flex: 0 0 ${CARD_TITLE_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
`;

export const CardContent = styled.div`
  flex: 1;
  position: relative;
  height: ${props => props.dimensions.y - CARD_TITLE_HEIGHT}px;
`;

const CardTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 20px;
  font-size: 14px;
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
  height: 100%;
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

const StyledOverflowMenu = styled(OverflowMenu)`
  & svg.bx--overflow-menu__icon {
    padding: 0;
  }
`;

const TimeRangeLabel = styled.span`
  font-size: 0.875rem;
  font-weight: normal;
`;

const defaultProps = {
  size: CARD_SIZES.SMALL,
  layout: CARD_SIZES.HORIZONTAL,
  toolbar: undefined,
  timeRange: undefined,
  isLoading: false,
  isEmpty: false,
  /** In editable mode we'll show preview data */
  isEditable: false,
  isExpanded: false,
  /** For now we will hide the per card actions when we're editing */
  availableActions: {
    edit: false,
    clone: false,
    delete: false,
    range: false,
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
    errorLoadingDataLabel: 'Error loading data for this card: ',
    errorLoadingDataShortLabel: 'Data error.',
    timeRangeLabel: 'Time range',
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
    editCardLabel: 'Edit card',
    cloneCardLabel: 'Clone card',
    deleteCardLabel: 'Delete card',
    closeLabel: 'Close',
    expandLabel: 'Expand to fullscreen',
    overflowMenuDescription: 'open and close list of options',
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
  error,
  id,
  tooltip,
  timeRange: timeRangeProp,
  onCardAction,
  availableActions,
  breakpoint,
  i18n,
  i18n: { closeLabel },
  ...others
}) => {
  const [tooltipId, setTooltipId] = useState(uuidv1());
  const [timeRange, setTimeRange] = useState(timeRangeProp);
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

  const strings = {
    ...defaultProps.i18n,
    ...i18n,
  };

  const timeBoxLabels = {
    last24Hours: strings.last24HoursLabel,
    last7Days: strings.last7DaysLabel,
    lastMonth: strings.lastMonthLabel,
    lastQuarter: strings.lastQuarterLabel,
    lastYear: strings.lastYearLabel,
    thisWeek: strings.thisWeekLabel,
    thisMonth: strings.thisMonthLabel,
    thisQuarter: strings.thisQuarterLabel,
    thisYear: strings.thisYearLabel,
  };

  // Need to convert to class components to give OverflowMenu somewhere to pass the ref
  const ToolbarTitleClass = toClass(ToolbarTitle);
  const ToolbarOptionClass = toClass(ToolbarOption);
  const timeBoxSelection = (
    <ToolbarItem>
      <TimeRangeLabel>{timeBoxLabels[timeRange]}</TimeRangeLabel>
      <StyledOverflowMenu
        menuOptionsClass="card-overflow"
        flipped
        renderIcon={ChevronDown16}
        iconDescription={strings.overflowMenuDescription}
      >
        <ToolbarTitleClass title={strings.timeRangeLabel} />
        <ToolbarOptionClass>
          <Select
            hideLabel
            id={`timeselect-${id}`}
            onChange={evt => {
              setTooltipId(uuidv1());
              onCardAction(id, 'CHANGE_TIME_RANGE', { range: evt.target.value });
              setTimeRange(evt.target.value);
            }}
            value={timeRange || ''}
          >
            <SelectItemGroup label={strings.rollingPeriodLabel}>
              {Object.keys(timeBoxLabels)
                .filter(i => i.includes('last'))
                .map(i => (
                  <SelectItem key={i} value={i} text={timeBoxLabels[i]} />
                ))}
            </SelectItemGroup>
            <SelectItemGroup label={strings.periodToDateLabel}>
              {Object.keys(timeBoxLabels)
                .filter(i => i.includes('this'))
                .map(i => (
                  <SelectItem key={i} value={i} text={timeBoxLabels[i]} />
                ))}
            </SelectItemGroup>
          </Select>
        </ToolbarOptionClass>
      </StyledOverflowMenu>
    </ToolbarItem>
  );

  const toolbar = isEditable ? (
    <StyledToolbar key={tooltipId}>
      {(mergedAvailableActions.edit ||
        mergedAvailableActions.clone ||
        mergedAvailableActions.delete) && (
        <ToolbarItem>
          <OverflowMenu menuOptionsClass="card-overflow" flipped>
            {mergedAvailableActions.edit && (
              <OverflowMenuItem
                onClick={() => {
                  setTooltipId(uuidv1());
                  onCardAction(id, 'EDIT_CARD');
                }}
                itemText={strings.editCardLabel}
              />
            )}
            {mergedAvailableActions.clone && (
              <OverflowMenuItem
                onClick={() => {
                  setTooltipId(uuidv1());
                  onCardAction(id, 'CLONE_CARD');
                }}
                itemText={strings.cloneCardLabel}
              />
            )}
            {mergedAvailableActions.delete && (
              <OverflowMenuItem
                isDelete
                onClick={() => {
                  setTooltipId(uuidv1());
                  onCardAction(id, 'DELETE_CARD');
                }}
                itemText={strings.deleteCardLabel}
              />
            )}
          </OverflowMenu>
        </ToolbarItem>
      )}
    </StyledToolbar>
  ) : (
    <StyledToolbar key={tooltipId}>
      {mergedAvailableActions.range && timeBoxSelection}
      {mergedAvailableActions.expand && (
        <ToolbarItem>
          {isExpanded ? (
            <TinyButton
              kind="ghost"
              size="small"
              renderIcon={Close16}
              iconDescription={closeLabel}
              onClick={() => onCardAction(id, 'CLOSE_EXPANDED_CARD')}
            />
          ) : (
            <TinyButton
              kind="ghost"
              size="small"
              renderIcon={Popup20}
              iconDescription={strings.expandLabel}
              title={strings.expandLabel}
              onClick={() => {
                onCardAction(id, 'OPEN_EXPANDED_CARD');
              }}
            />
          )}
        </ToolbarItem>
      )}
    </StyledToolbar>
  );

  return (
    <CardWrapper id={id} dimensions={dimensions} isExpanded={isExpanded} {...others}>
      <CardHeader>
        <CardTitle title={title}>
          {title}&nbsp;
          {tooltip && <Tooltip triggerText="">{tooltip}</Tooltip>}
        </CardTitle>
        {toolbar}
      </CardHeader>
      <CardContent className="card-content" dimensions={dimensions}>
        {isLoading ? (
          <SkeletonWrapper>
            <OptimizedSkeletonText
              paragraph
              lineCount={size === CARD_SIZES.XSMALL || size === CARD_SIZES.XSMALLWIDE ? 2 : 3}
              width="100%"
            />
          </SkeletonWrapper>
        ) : error ? (
          <EmptyMessageWrapper>
            {size === CARD_SIZES.XSMALL || size === CARD_SIZES.XSMALLWIDE
              ? strings.errorLoadingDataShortLabel
              : `${strings.errorLoadingDataLabel} ${error}`}
          </EmptyMessageWrapper>
        ) : isEmpty && !isEditable ? (
          <EmptyMessageWrapper>
            {isXS ? strings.noDataShortLabel : strings.noDataLabel}
          </EmptyMessageWrapper>
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
