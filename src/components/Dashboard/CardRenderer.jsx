import React, { useMemo, useState, useCallback, useEffect } from 'react';
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
  ...others
}) => {
  const [cachedStyle, setCachedStyle] = useState(style);

  useDeepCompareEffect(
    () => {
      setCachedStyle(style);
    },
    [style] // need to do a deep compare on style
  );
  const cachedOnCardAction = useCallback(onCardAction, []);
  return <CardRenderer {...others} onCardAction={cachedOnCardAction} style={cachedStyle} />;
};

/** Asynchronous reusable function to load Card Data */
const loadCardData = async (card, setCard, onFetchData, timeGrain) => {
  // Set state to loading
  setCard({ ...card, isLoading: true });
  const cardWithData = await onFetchData(
    card,
    card.type !== CARD_TYPES.IMAGE && card.type !== CARD_TYPES.VALUE
  );
  setCard({
    ...cardWithData,
    timeGrain: compareGrains(timeGrain, card.timeGrain) < 1 ? card.timeGrain : timeGrain,
    isLoading: false,
  });
};

/**
 * This component decides which card component to render when passed a certain card type.
 * It keeps the local state of the card (which determines which range selection is being shown, etc)
 * It also caches some properties between renders to speed performance
 */
const CardRenderer = React.memo(
  ({
    style, // eslint-disable-line
    card: cardProp, // eslint-disable-line
    card: { availableActions, type, dataSource }, // eslint-disable-line
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
    onSetupCard, // eslint-disable-line
    timeGrain, // eslint-disable-line
    ...gridProps
  }) => {
    /**
     * Local state for the card
     */
    const [card, setCard] = useState(cardProp);

    // If the dashboard has triggered a bulk load, refetch the data
    useEffect(
      () => {
        const setupAndLoadCard = async () => {
          let updatedCard = card;
          // Image cards require extra setup before loading data
          if (card.type === CARD_TYPES.IMAGE && !card.content.src) {
            updatedCard = await onSetupCard(card);
          }
          loadCardData(updatedCard, setCard, onFetchData, timeGrain);
        };
        if (isLoading) {
          setupAndLoadCard();
        }
      },
      [isLoading, card.content.src] // eslint-disable-line
    );

    // Speed up performance by caching the available actions
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
      [card && card.isExpanded, style] // eslint-disable-line
    );

    /**
     * Listen to the card's range action to decide whether to trigger a data refetch
     */
    const cachedOnCardAction = useCallback(
      async (id, actionType, payload) => {
        // callback time grain change from parent
        if (actionType === 'CHANGE_TIME_RANGE') {
          // First update the range
          const range = determineCardRange(payload.range);
          const cardWithUpdatedRange = {
            ...card,
            isLoading: true, // set loading
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
          // Then trigger a load of the card data
          loadCardData(cardWithUpdatedRange, setCard, onFetchData, timeGrain);
        }
        onCardAction(id, actionType, payload);
      },
      [card, onCardAction, onFetchData, timeGrain]
    );

    return (
      <div key={card.id} {...gridProps} style={cachedExpandedStyle}>
        {type === CARD_TYPES.VALUE ? (
          <ValueCard
            {...card}
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
            {...card}
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
            {...card}
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
            {...card}
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
            {...card}
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
            {...card}
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
            {...card}
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
