import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Tooltip, SkeletonText } from 'carbon-components-react';
import SizeMe from 'react-sizeme';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import warning from 'warning';

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
import { CardPropTypes } from '../../constants/CardPropTypes';
import { getCardMinSize, filterValidAttributes } from '../../utils/componentUtilityFunctions';
import { getUpdatedCardSize, useCardResizing } from '../../utils/cardUtilityFunctions';
import useHasTextOverflow from '../../hooks/useHasTextOverflow';

import CardToolbar from './CardToolbar';

const { prefix, iotPrefix } = settings;

const OptimizedSkeletonText = React.memo(SkeletonText);

/** Full card */
const CardWrapper = ({
  isSelected,
  children,
  dimensions,
  id,
  style,
  className,
  onScroll,
  // The event handlers are needed for when the card appears as grid items
  // in the Dashboard Grid - isEditable
  onMouseDown,
  onMouseUp,
  onTouchEnd,
  onTouchStart,
  onFocus,
  onBlur,
  tabIndex,
  // TODO: remove deprecated testID prop in v3
  // eslint-disable-next-line react/prop-types
  testID,
  testId,
  ...others
}) => {
  const validOthers = filterValidAttributes(others);

  return (
    <div
      role="presentation"
      data-testid={testID || testId}
      id={id}
      style={{ ...style, '--card-default-height': `${dimensions.y}px` }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      onScroll={onScroll}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={tabIndex}
      className={classnames(className, `${iotPrefix}--card--wrapper`, {
        [`${iotPrefix}--card--wrapper__selected`]: isSelected,
      })}
      {...validOthers}
    >
      {children}
    </div>
  );
};

/** Header components */
export const CardHeader = (
  { children, testId } // eslint-disable-line react/prop-types
) => (
  <div data-testid={testId} className={`${iotPrefix}--card--header`}>
    {children}
  </div>
);

export const CardTitle = (
  { children, title, testId } // eslint-disable-line react/prop-types
) => (
  <span data-testid={testId} className={`${iotPrefix}--card--title`} title={title}>
    {children}
  </span>
);

const CardContent = (props) => {
  const { children, dimensions, isExpanded, className, testId } = props;
  const height = `${dimensions.y - CARD_TITLE_HEIGHT}px`;
  return (
    <div
      data-testid={testId}
      style={{ [`--card-content-height`]: height }}
      className={classnames(className, `${iotPrefix}--card--content`, {
        [`${iotPrefix}--card--content--expanded`]: isExpanded,
      })}
    >
      {children}
    </div>
  );
};

const EmptyMessageWrapper = (props) => {
  const { children } = props;
  return (
    <div
      style={{ '--card-content-padding': `${CARD_CONTENT_PADDING}px` }}
      className={`${iotPrefix}--card--empty-message-wrapper`}
    >
      {children}
    </div>
  );
};

CardWrapper.propTypes = {
  /**
   * Is given the event as argument. Should return true or false if event should trigger selection
   */
  isSelected: PropTypes.bool,
  children: PropTypes.node.isRequired,
  dimensions: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }).isRequired,
  id: CardPropTypes.id,
  style: PropTypes.objectOf(PropTypes.string),
  testId: CardPropTypes.testId,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  onScroll: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  /** Optionally sets a keyboard tab index for the container */
  tabIndex: PropTypes.number,
};
CardWrapper.defaultProps = {
  isSelected: false,
  id: undefined,
  style: undefined,
  testId: 'Card',
  onMouseDown: undefined,
  onMouseUp: undefined,
  onTouchEnd: undefined,
  onTouchStart: undefined,
  onScroll: undefined,
  onFocus: undefined,
  onBlur: undefined,
  tabIndex: undefined,
};
CardContent.propTypes = {
  testId: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  dimensions: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }).isRequired,
  isExpanded: CardPropTypes.isExpanded.isRequired,
};
CardContent.defaultProps = { children: undefined, className: '', testId: 'card-content' };
EmptyMessageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export const defaultProps = {
  size: CARD_SIZES.MEDIUM,
  layout: CARD_LAYOUTS.HORIZONTAL,
  title: undefined,
  subtitle: undefined,
  hasTitleWrap: false,
  toolbar: undefined,
  hideHeader: false,
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
    settings: false,
  },
  renderExpandIcon: undefined,
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
    selectTimeRangeLabel: 'Select time range',
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
  onMouseDown: undefined,
  onMouseUp: undefined,
  onTouchEnd: undefined,
  onTouchStart: undefined,
  onScroll: undefined,
  onFocus: undefined,
  onBlur: undefined,
  tabIndex: undefined,
  testId: CardWrapper.defaultProps.testId,
  footerContent: undefined,
  dateTimeMask: 'MM/DD/YYYY HH:mm',
};

/** Dumb component that renders the card basics */
const Card = (props) => {
  const {
    size,
    children,
    title,
    subtitle,
    hasTitleWrap,
    layout,
    isLoading,
    isEmpty,
    isEditable,
    isExpanded,
    isLazyLoading,
    isResizable,
    resizeHandles: wrappingCardResizeHandles,
    error,
    hideHeader,
    id,
    tooltip,
    timeRange,
    timeRangeOptions,
    onCardAction,
    availableActions,
    renderExpandIcon,
    breakpoint,
    i18n,
    style,
    className,
    values,
    // TODO: remove deprecated testID prop in v3
    testID,
    testId,
    contentClassName,
    footerContent: CardFooter,
    dateTimeMask,
    ...others
  } = props;

  // TODO: remove once final version of range prop is supported
  useEffect(() => {
    if (__DEV__ && typeof availableActions?.range === 'string') {
      warning(
        false,
        'The Card components availableActions.range is an experimental property and may be subject to change.'
      );
    }
  }, [availableActions]);
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

  const hasToolbarActions = Boolean(
    Object.values(mergedAvailableActions).find((action) => action !== false)
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

  // Ensure the title and subtitle have a tooltip only if their text is truncated
  const titleRef = useRef();
  const subTitleRef = useRef();
  const hasTitleTooltip = useHasTextOverflow(titleRef);
  const hasSubTitleTooltip = useHasTextOverflow(subTitleRef);

  const { resizeHandles, isResizing } = useCardResizing(
    wrappingCardResizeHandles,
    children,
    isResizable
  );

  const card = (
    <VisibilitySensor partialVisibility offset={{ top: 10 }}>
      {({ isVisible }) => (
        <SizeMe.SizeMe monitorHeight>
          {({ size: cardSize }) => {
            // support passing the card toolbar through to the custom card
            const cardToolbar = hasToolbarActions ? (
              <CardToolbar
                width={cardSize.width}
                availableActions={mergedAvailableActions}
                renderExpandIcon={renderExpandIcon}
                i18n={strings}
                isEditable={isEditable}
                isExpanded={isExpanded}
                timeRange={timeRange}
                locale={others.locale}
                timeRangeOptions={timeRangeOptions}
                onCardAction={cachedOnCardAction}
                // TODO: remove deprecated testID prop in v3
                testId={`${testID || testId}-toolbar`}
                dateTimeMask={dateTimeMask}
              />
            ) : null;

            return (
              <CardWrapper
                {...others} // you need all of these to support dynamic positioning during edit
                // TODO: remove deprecated testID prop in v3
                testId={testID || testId}
                id={id}
                dimensions={dimensions}
                isExpanded={isExpanded}
                style={
                  !isExpanded
                    ? style
                    : {
                        height: 'calc(100% - 50px)',
                        width: 'calc(100% - 50px)',
                      }
                }
                className={classnames(`${iotPrefix}--card`, className, {
                  [`${iotPrefix}--card--resizing`]: isResizing,
                })}
              >
                {!hideHeader && (
                  <CardHeader
                    // TODO: remove deprecated testID prop in v3
                    testId={`${testID || testId}-header`}
                  >
                    <CardTitle
                      title={title}
                      // TODO: remove deprecated testID prop in v3
                      testId={`${testID || testId}-title`}
                    >
                      {hasTitleTooltip ? (
                        <Tooltip
                          data-testid={`${testID || testId}-title-tooltip`}
                          ref={titleRef}
                          showIcon={false}
                          triggerClassName={classnames(
                            `${iotPrefix}--card--title--text__overflow`,
                            `${iotPrefix}--card--title--text`,
                            {
                              [`${iotPrefix}--card--title--text--wrapped`]:
                                hasTitleWrap && !subtitle,
                            }
                          )}
                          triggerText={title}
                        >
                          {title}
                        </Tooltip>
                      ) : (
                        <div
                          ref={titleRef}
                          className={classnames(`${iotPrefix}--card--title--text`, {
                            [`${iotPrefix}--card--title--text--wrapped`]: hasTitleWrap && !subtitle,
                          })}
                        >
                          {title}
                        </div>
                      )}
                      {tooltip && (
                        <Tooltip
                          data-testid={`${testID || testId}-tooltip`}
                          triggerId={`card-tooltip-trigger-${id}`}
                          tooltipId={`card-tooltip-${id}`}
                          triggerClassName={`${iotPrefix}--card--header--tooltip`}
                          id={`card-tooltip-${id}`} // https://github.com/carbon-design-system/carbon/pull/6744
                          triggerText=""
                        >
                          {tooltip}
                        </Tooltip>
                      )}
                      {!subtitle ? null : hasSubTitleTooltip ? (
                        <Tooltip
                          data-testid={`${testID || testId}-subtitle`}
                          ref={subTitleRef}
                          showIcon={false}
                          triggerClassName={classnames(`${iotPrefix}--card--subtitle--text`, {
                            [`${iotPrefix}--card--subtitle--text--padded`]: tooltip,
                          })}
                          triggerText={subtitle}
                        >
                          {subtitle}
                        </Tooltip>
                      ) : (
                        <div
                          ref={subTitleRef}
                          data-testid={`${testID || testId}-subtitle`}
                          className={classnames(`${iotPrefix}--card--subtitle--text`, {
                            [`${iotPrefix}--card--subtitle--text--padded`]: tooltip,
                          })}
                        >
                          {subtitle}
                        </div>
                      )}
                    </CardTitle>
                    {cardToolbar}
                  </CardHeader>
                )}
                <CardContent
                  // TODO: remove deprecated testID prop in v3
                  testId={`${testID || testId}-content`}
                  dimensions={dimensions}
                  isExpanded={isExpanded}
                  className={contentClassName}
                >
                  {!isVisible && isLazyLoading ? ( // if not visible don't show anything
                    ''
                  ) : isLoading ? (
                    <div
                      style={{
                        '--card-content-padding': `${CARD_CONTENT_PADDING}px`,
                      }}
                      className={`${iotPrefix}--card--skeleton-wrapper`}
                    >
                      <OptimizedSkeletonText
                        paragraph
                        lineCount={
                          newSize === CARD_SIZES.SMALL || newSize === CARD_SIZES.SMALLWIDE ? 2 : 3
                        }
                        width="100%"
                      />
                    </div>
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
                  ) : Array.isArray(children) && typeof children?.[0] === 'function' ? ( // pass the measured size down to the children if it's an render function
                    [
                      // first option is a function
                      children?.[0](getChildSize(cardSize, title), {
                        cardToolbar,
                        ...props,
                      }), // second and third options are the resizable handles
                      children?.slice(1),
                    ]
                  ) : typeof children === 'function' ? (
                    children?.(getChildSize(cardSize, title), {
                      cardToolbar,
                      ...props,
                    })
                  ) : (
                    children
                  )}
                </CardContent>
                {CardFooter ? (
                  <div
                    className={`${iotPrefix}--card--footer--wrapper`}
                    data-testid={`${testID || testId}-footer`}
                  >
                    <CardFooter />
                  </div>
                ) : null}
                {resizeHandles}
              </CardWrapper>
            );
          }}
        </SizeMe.SizeMe>
      )}
    </VisibilitySensor>
  );

  return isExpanded ? (
    <div
      data-floating-menu-container // needed to place overflow floating menus within the modal so we can control them through css
      className={`${prefix}--modal is-visible`}
    >
      {card}
    </div>
  ) : (
    card
  );
};

Card.propTypes = CardPropTypes;
Card.defaultProps = defaultProps;

export default Card;
