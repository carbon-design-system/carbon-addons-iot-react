import React, { useState } from 'react';
import uuidv1 from 'uuid/v1';
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
import Close16 from '@carbon/icons-react/lib/close/16';
// import ChevronDown from '@carbon/icons-react/lib/chevron--down/20';
import EventSchedule from '@carbon/icons-react/lib/event--schedule/20';
import Popup20 from '@carbon/icons-react/lib/popup/20';
import styled from 'styled-components';
import SizeMe from 'react-sizeme';

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

const OptimizedSkeletonText = React.memo(SkeletonText);

/** Full card */
const CardWrapper = styled.div`
  background: white;
  height: ${props => props.dimensions.y}px;
  ${props => (props.isExpanded ? 'height: 100%; width: 100%;' : '')};
  display: flex;
  flex-direction: column;
  span#timeRange {
    display: ${props => (props.cardWidthSize < 230 ? `none` : `flex`)};
  }
`;

/** Header */

export const CardContent = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  height: ${props => props.dimensions.y - CARD_TITLE_HEIGHT}px;
`;

export const SkeletonWrapper = styled.div`
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

const TimeRangeLabel = styled.span`
  font-size: 0.875rem;
  font-weight: normal;
`;

const defaultProps = {
  size: CARD_SIZES.SMALL,
  layout: CARD_SIZES.HORIZONTAL,
  title: undefined,
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
    editCardLabel: 'Edit card',
    cloneCardLabel: 'Clone card',
    deleteCardLabel: 'Delete card',
    closeLabel: 'Close',
    expandLabel: 'Expand to fullscreen',
    overflowMenuDescription: 'Open and close list of options',
  },
};

/** Dumb component that renders the card basics */
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

  const timeBoxSelection = sizeWidth => (
    <ToolbarItem>
      <TimeRangeLabel className="card--toolbar-timerange-lable" id="timeRange">
        {timeBoxLabels[timeRange]}
      </TimeRangeLabel>
      <OverflowMenu
        className="card--toolbar-action"
        flipped
        title={strings.overflowMenuDescription}
        menuOptionsClass="card--overflow"
        renderIcon={EventSchedule}
        iconDescription={
          sizeWidth < 230 ? timeBoxLabels[timeRange] : strings.overflowMenuDescription
        }
      >
        <ToolbarTitle title={strings.timeRangeLabel} />
        <ToolbarOption>
          <Select
            className="time-select"
            hideLabel
            id={`timeselect-${id}`}
            onChange={evt => {
              setTooltipId(uuidv1());
              onCardAction(id, 'CHANGE_TIME_RANGE', { range: evt.target.value });
              setTimeRange(evt.target.value);
            }}
            value={timeRange || ''}
          >
            <SelectItem value="default" text={strings.defaultLabel} />
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
        </ToolbarOption>
      </OverflowMenu>
    </ToolbarItem>
  );

  const toolbar = sizeWidth =>
    isEditable ? (
      <Toolbar className="card--toolbar" key={tooltipId}>
        {(mergedAvailableActions.edit ||
          mergedAvailableActions.clone ||
          mergedAvailableActions.delete) && (
          <ToolbarItem>
            <OverflowMenu flipped title={strings.overflowMenuDescription}>
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
      </Toolbar>
    ) : (
      <Toolbar className="card--toolbar" key={tooltipId}>
        {mergedAvailableActions.range && timeBoxSelection(sizeWidth)}
        {mergedAvailableActions.expand && (
          <ToolbarItem>
            {isExpanded ? (
              <TinyButton
                className="card--toolbar-action"
                kind="ghost"
                size="small"
                renderIcon={Close16}
                iconDescription={strings.closeLabel}
                title={strings.closeLabel}
                onClick={() => onCardAction(id, 'CLOSE_EXPANDED_CARD')}
              />
            ) : (
              <TinyButton
                className="card--toolbar-action"
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
      </Toolbar>
    );

  return (
    <SizeMe.SizeMe monitorHeight>
      {({ size: sizeWidth }) => (
        <CardWrapper
          id={id}
          dimensions={dimensions}
          isExpanded={isExpanded}
          cardWidthSize={sizeWidth.width}
          {...others}
        >
          {title !== undefined && (
            <div className="card--header">
              <span className="card--title" title={title}>
                {title}&nbsp;
                {tooltip && (
                  <Tooltip
                    triggerId={`card-tooltip-trigger-${id}`}
                    tooltipId={`card-tooltip-${id}`}
                    triggerText=""
                  >
                    {tooltip}
                  </Tooltip>
                )}
              </span>
              {toolbar(sizeWidth.width)}
            </div>
          )}

          <CardContent dimensions={dimensions}>
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
            ) : typeof children === 'function' ? ( // pass the measured size down to the children if it's an render function
              children(sizeWidth)
            ) : (
              children
            )}
          </CardContent>
        </CardWrapper>
      )}
    </SizeMe.SizeMe>
  );
};

Card.propTypes = CardPropTypes;
Card.defaultProps = defaultProps;

export default Card;
