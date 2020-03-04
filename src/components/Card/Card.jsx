import React, { useCallback, useMemo, useEffect, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { SkeletonText } from 'carbon-components-react';
import styled from 'styled-components';
import SizeMe from 'react-sizeme';

import { settings } from '../../constants/Settings';
import {
  CARD_TITLE_HEIGHT,
  CARD_CONTENT_PADDING,
  CARD_SIZES,
  CARD_LAYOUTS,
  ROW_HEIGHT,
  CARD_DIMENSIONS,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLUMNS,
  DASHBOARD_SIZES,
} from '../../constants/LayoutConstants';
import { CardPropTypes } from '../../constants/PropTypes';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { getUpdatedCardSize } from '../../utils/cardUtilityFunctions';

import CardToolbar from './CardToolbar';
import Tooltip from '../Tooltip/Tooltip';

const { prefix } = settings;

const OptimizedSkeletonText = React.memo(SkeletonText);

/** Full card */
const CardWrapper = styled.div`
  background: white;
  height: ${props => props.dimensions.y}px;
  ${props => (props.isExpanded ? 'height: 100%; width: 100%;' : '')}
  display: flex;
  flex-direction: column;
  span#timeRange {
    display: ${props => (props.cardWidthSize < 230 ? `none` : `flex`)};
  }
  overflow: ${props => (props.showOverflow ? `visible` : `hidden`)};
`;

/** Header components */
export const CardHeader = (
  { children } //eslint-disable-line
) => <div className="card--header">{children}</div>;

export const CardTitle = (
  { children, title } //eslint-disable-line
) => (
  <span className="card--title" title={title}>
    {children}
  </span>
);

export const CardContent = styled.div`
  flex: 1;
  position: relative;
  height: ${props => props.dimensions.y - CARD_TITLE_HEIGHT}px;
  overflow-x: visible;
  overflow-y: ${props => (!props.isExpanded ? 'visible' : 'auto')};
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

export const defaultProps = {
  size: CARD_SIZES.MEDIUM,
  layout: CARD_LAYOUTS.HORIZONTAL,
  title: undefined,
  toolbar: undefined,
  hideHeader: false,
  showOverflow: true,
  timeRange: undefined,
  isLoading: false,
  isEmpty: false,
  /** In editable mode we'll show preview data */
  isEditable: false,
  isExpanded: false,
  /** performance option: only render the content of the card to the ReactDOM if the card is visible on screen */
  isLazyLoading: false,
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
const Card = props => {
  const {
    size,
    children,
    title,
    layout,
    isLoading,
    isEmpty,
    isEditable,
    isExpanded,
    isLazyLoading,
    error,
    hideHeader,
    id,
    tooltip,
    timeRange,
    onCardAction,
    availableActions,
    breakpoint,
    i18n,
    style,
    className,
    values,
    ...others
  } = props;
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const isSM = newSize === CARD_SIZES.SMALL;

  const dimensions = getCardMinSize(
    breakpoint,
    newSize,
    others.dashboardBreakpoints,
    others.cardDimensions,
    others.rowHeight,
    others.dashboardColumns
  );

  // Need to cache the default available actions so it doesn't rerender
  const mergedAvailableActions = useMemo(
    () => ({
      ...defaultProps.availableActions,
      ...availableActions,
    }),
    [availableActions]
  );

  const strings = {
    ...defaultProps.i18n,
    ...i18n,
  };

  /** adds the id to the card action */
  const cachedOnCardAction = useCallback((...args) => onCardAction(id, ...args), [
    onCardAction,
    id,
  ]);

  const getChildSize = (cardSize, cardTitle) => {
    const childSize = {
      ...cardSize,
      height:
        cardTitle === null || cardTitle === undefined
          ? cardSize.height
          : cardSize.height - CARD_TITLE_HEIGHT,
    };
    return childSize;
  };

  // Ensure the title text has a tooltip only if the title text is truncated
  const titleRef = React.createRef();
  const [hasTitleTooltip, setHasTitleTooltip] = useState(false);
  useEffect(() => {
    if (titleRef.current && titleRef.current.clientWidth < titleRef.current.scrollWidth) {
      setHasTitleTooltip(true);
    } else {
      setHasTitleTooltip(false);
    }
  });

  const card = (
    <VisibilitySensor partialVisibility offset={{ top: 10 }}>
      {({ isVisible }) => (
        <SizeMe.SizeMe monitorHeight>
          {({ size: cardSize }) => {
            // support passing the card toolbar through to the custom card
            const cardToolbar = (
              <CardToolbar
                width={cardSize.width}
                availableActions={mergedAvailableActions}
                i18n={strings}
                isEditable={isEditable}
                isExpanded={isExpanded}
                timeRange={timeRange}
                onCardAction={cachedOnCardAction}
              />
            );

            return (
              <CardWrapper
                {...others} // you need all of these to support dynamic positioning during edit
                id={id}
                dimensions={dimensions}
                isExpanded={isExpanded}
                cardWidthSize={cardSize.width}
                style={
                  !isExpanded ? style : { height: 'calc(100% - 50px)', width: 'calc(100% - 50px)' }
                }
                className={className}
              >
                {!hideHeader && (
                  <CardHeader>
                    <CardTitle title={title}>
                      {hasTitleTooltip && isVisible ? (
                        <Tooltip
                          scrollWithTriggerElement={true}
                          ref={titleRef}
                          showIcon={false}
                          triggerClassName="title--text"
                          triggerText={title}
                          direction="left"
                        >
                          {title}
                        </Tooltip>
                      ) : (
                        <div ref={titleRef} className="title--text">
                          {title}
                        </div>
                      )}
                      {tooltip && isVisible && (
                        <Tooltip
                          scrollWithTriggerElement={true}
                          triggerId={`card-tooltip-trigger-${id}`}
                          tooltipId={`card-tooltip-${id}`}
                          triggerText=""
                          direction="left"
                        >
                          {tooltip}
                        </Tooltip>
                      )}
                    </CardTitle>
                    {cardToolbar}
                  </CardHeader>
                )}
                <CardContent dimensions={dimensions} isExpanded={isExpanded}>
                  {!isVisible && isLazyLoading ? ( // if not visible don't show anything
                    ''
                  ) : isLoading ? (
                    <SkeletonWrapper>
                      <OptimizedSkeletonText
                        paragraph
                        lineCount={
                          newSize === CARD_SIZES.SMALL || newSize === CARD_SIZES.SMALLWIDE ? 2 : 3
                        }
                        width="100%"
                      />
                    </SkeletonWrapper>
                  ) : error ? (
                    <EmptyMessageWrapper>
                      {newSize === CARD_SIZES.SMALL || newSize === CARD_SIZES.SMALLWIDE
                        ? strings.errorLoadingDataShortLabel
                        : `${strings.errorLoadingDataLabel} ${error}`}
                    </EmptyMessageWrapper>
                  ) : isEmpty && !isEditable ? (
                    <EmptyMessageWrapper>
                      {isSM ? strings.noDataShortLabel : strings.noDataLabel}
                    </EmptyMessageWrapper>
                  ) : typeof children === 'function' ? ( // pass the measured size down to the children if it's an render function
                    children(getChildSize(cardSize, title), { cardToolbar, ...props })
                  ) : (
                    children
                  )}
                </CardContent>
              </CardWrapper>
            );
          }}
        </SizeMe.SizeMe>
      )}
    </VisibilitySensor>
  );

  return isExpanded ? <div className={`${prefix}--modal is-visible`}>{card}</div> : card;
};

Card.propTypes = CardPropTypes;
Card.defaultProps = defaultProps;

export default Card;
