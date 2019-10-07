import React, { useMemo, useState, useCallback } from 'react';
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import useDeepCompareEffect from 'use-deep-compare-effect';

import ValueCard from '../ValueCard/ValueCard';
import ImageCard from '../ImageCard/ImageCard';
import DonutCard from '../DonutCard/DonutCard';
import TableCard from '../TableCard/TableCard';
import BarChartCard from '../BarChartCard/BarChartCard';
import PieCard from '../PieCard/PieCard';
import TimeSeriesCard from '../TimeSeriesCard/TimeSeriesCard';
import { CARD_TYPES } from '../../constants/LayoutConstants';
import { determineCardRange, compareGrains } from '../../utils/cardUtilityFunctions';

const CachedCardRenderer = ({
  style, //eslint-disable-line
  onCardAction, //eslint-disable-line
  isLoading, // eslint-disable-line
  ...others
}) => {
  const [cachedStyle, setCachedStyle] = useState(style);

  useDeepCompareEffect(
    () => {
      setCachedStyle(style);
    },
    [style] // need to do a deep compare on style
  );
  // Have to reset the card action callback once the whole dashboard has finished loading to get the latest dashboard
  const cachedOnCardAction = useCallback(onCardAction, [isLoading]);
  return (
    <CardRenderer
      {...others}
      isLoading={isLoading}
      onCardAction={cachedOnCardAction}
      style={cachedStyle}
    />
  );
};

/**
 * This component decides which card component to render when passed a certain card type
 * It also caches some properties between renders to speed performance
 */
const CardRenderer = React.memo(
  ({
    style, // eslint-disable-line
    card, // eslint-disable-line
    card: { availableActions, type, dataSource, ...others }, // eslint-disable-line
    onCardAction, // eslint-disable-line
    i18n, // eslint-disable-line
    dashboardBreakpoints, // eslint-disable-line
    cardDimensions, // eslint-disable-line
    dashboardColumns, // eslint-disable-line
    rowHeight, // eslint-disable-line
    isLoading, // eslint-disable-line
    isEditable, // eslint-disable-line
    breakpoint, // eslint-disable-line
    onFetchData, // eslint-disable-line
    timeGrain, // eslint-disable-line
    ...gridProps
  }) => {
    // Speed up performance by caching
    const cachedActions = useMemo(
      () =>
        merge(availableActions, {
          range: !isEmpty(dataSource), // all cards should have the range picker
          expand:
            type === CARD_TYPES.IMAGE ||
            type === CARD_TYPES.TIMESERIES ||
            type === CARD_TYPES.TABLE, // image and line chart cards should have expand
        }),
      [availableActions, dataSource, type]
    );

    const cachedExpandedStyle = useMemo(
      () =>
        card.isExpanded ? merge({ height: '100%', width: '100%', padding: '50px' }, style) : style,
      [card.isExpanded, style]
    );

    const cachedOnCardAction = useCallback(
      (id, actionType, payload) => {
        // callback time grain change from parent
        if (actionType === 'CHANGE_TIME_RANGE') {
          const range = determineCardRange(payload.range);
          const updatedCard = {
            ...card,
            dataSource: {
              ...card.dataSource,
              range: {
                ...range,
                ...omit(range, 'timeGrain'),
              },
              // Use the maximum selected grain betweeen the dashboard and the current range
              timeGrain:
                compareGrains(timeGrain, range.timeGrain) < 1 ? range.timeGrain : timeGrain,
            },
          };

          onFetchData(updatedCard);
        }
        onCardAction(id, actionType, payload);
      },
      [card, onCardAction, onFetchData, timeGrain]
    );

    return (
      <div key={card.id} {...gridProps} style={cachedExpandedStyle}>
        {type === CARD_TYPES.VALUE ? (
          <ValueCard
            {...others}
            key={card.id}
            availableActions={cachedActions}
            dataSource={dataSource}
            type={type}
            i18n={i18n}
            isEditable={isEditable}
            onCardAction={cachedOnCardAction}
            breakpoint={breakpoint}
            dashboardBreakpoints={dashboardBreakpoints}
            dashboardColumns={dashboardColumns}
            cardDimensions={cardDimensions}
            rowHeight={rowHeight}
          />
        ) : type === CARD_TYPES.IMAGE ? (
          <ImageCard
            {...others}
            key={card.id}
            availableActions={cachedActions}
            dataSource={dataSource}
            type={type}
            i18n={i18n}
            isEditable={isEditable}
            onCardAction={cachedOnCardAction}
            breakpoint={breakpoint}
            dashboardBreakpoints={dashboardBreakpoints}
            dashboardColumns={dashboardColumns}
            cardDimensions={cardDimensions}
            rowHeight={rowHeight}
          />
        ) : type === CARD_TYPES.TIMESERIES ? (
          <TimeSeriesCard
            {...others}
            key={card.id}
            availableActions={cachedActions}
            dataSource={dataSource}
            type={type}
            i18n={i18n}
            isEditable={isEditable}
            onCardAction={cachedOnCardAction}
            breakpoint={breakpoint}
            dashboardBreakpoints={dashboardBreakpoints}
            dashboardColumns={dashboardColumns}
            cardDimensions={cardDimensions}
            rowHeight={rowHeight}
          />
        ) : type === CARD_TYPES.TABLE ? (
          <TableCard
            {...others}
            key={card.id}
            availableActions={cachedActions}
            dataSource={dataSource}
            type={type}
            i18n={i18n}
            isEditable={isEditable}
            onCardAction={cachedOnCardAction}
            breakpoint={breakpoint}
            dashboardBreakpoints={dashboardBreakpoints}
            dashboardColumns={dashboardColumns}
            cardDimensions={cardDimensions}
            rowHeight={rowHeight}
          />
        ) : type === CARD_TYPES.DONUT ? (
          <DonutCard
            {...others}
            key={card.id}
            availableActions={cachedActions}
            dataSource={dataSource}
            type={type}
            i18n={i18n}
            isEditable={isEditable}
            onCardAction={cachedOnCardAction}
            breakpoint={breakpoint}
            dashboardBreakpoints={dashboardBreakpoints}
            dashboardColumns={dashboardColumns}
            cardDimensions={cardDimensions}
            rowHeight={rowHeight}
          />
        ) : type === CARD_TYPES.PIE ? (
          <PieCard
            {...others}
            key={card.id}
            availableActions={cachedActions}
            dataSource={dataSource}
            type={type}
            i18n={i18n}
            isEditable={isEditable}
            onCardAction={cachedOnCardAction}
            breakpoint={breakpoint}
            dashboardBreakpoints={dashboardBreakpoints}
            dashboardColumns={dashboardColumns}
            cardDimensions={cardDimensions}
            rowHeight={rowHeight}
          />
        ) : type === CARD_TYPES.BAR ? (
          <BarChartCard
            {...others}
            key={card.id}
            availableActions={cachedActions}
            dataSource={dataSource}
            type={type}
            i18n={i18n}
            isEditable={isEditable}
            onCardAction={cachedOnCardAction}
            breakpoint={breakpoint}
            dashboardBreakpoints={dashboardBreakpoints}
            dashboardColumns={dashboardColumns}
            cardDimensions={cardDimensions}
            rowHeight={rowHeight}
          />
        ) : null}
      </div>
    );
  }
);
CachedCardRenderer.defaultProps = {
  style: {},
};
export default CachedCardRenderer;
