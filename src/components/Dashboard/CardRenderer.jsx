import React, { useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import omit from 'lodash/omit';
import useDeepCompareEffect from 'use-deep-compare-effect';

import ValueCard from '../ValueCard/ValueCard';
import ImageCard from '../ImageCard/ImageCard';
import TableCard from '../TableCard/TableCard';
import TimeSeriesCard from '../TimeSeriesCard/TimeSeriesCard';
import ListCard from '../ListCard/ListCard';
import GaugeCard from '../GaugeCard/GaugeCard';
import Card from '../Card/Card';
import { CARD_TYPES, CARD_ACTIONS } from '../../constants/LayoutConstants';
import { determineCardRange, compareGrains } from '../../utils/cardUtilityFunctions';

/**
 *
 * This component is needed to cache the style object for performance reasons because unfortunately, the style object changes with every render from React Grid Layout
 */
const CachedCardRenderer = ({
  style, //eslint-disable-line
  ...others
}) => {
  const [cachedStyle, setCachedStyle] = useState(style);

  useDeepCompareEffect(
    () => {
      setCachedStyle(style);
    },
    [style] // need to do a deep compare on style
  );
  return <CardRenderer {...others} style={cachedStyle} />;
};

/** Asynchronous reusable function to load Card Data */
export const loadCardData = async (card, setCard, onFetchData, timeGrain) => {
  // Only set the card to loading if it has a datasource to support simple cards
  if (card.dataSource) {
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
  }
};

/**
 * This component decides which card component to render when passed a certain card type.
 * It keeps the local state of the card (which determines which range selection is being shown, etc)
 * It also caches some properties between renders to speed performance
 *
 * It watches the isLoading bit to see if the card needs to trigger a data reload.  If the isLoading bit changes to true
 * it will trigger the dashboard's onSetupCard function and then it's onFetchData function to retrieve the updated card properties
 * for each card.
 */
const CardRenderer = React.memo(
  ({
    onCardAction, // eslint-disable-line
    i18n, // eslint-disable-line
    isLoading, // eslint-disable-line
    isEditable, // eslint-disable-line
    breakpoint, // eslint-disable-line
    onFetchData, // eslint-disable-line
    onSetupCard, // eslint-disable-line
    renderIconByName, // eslint-disable-line
    timeGrain, // eslint-disable-line
    ...cardProp // pass through the card props
  }) => {
    const { dataSource, availableActions, type } = cardProp;
    /**
     * Local state for the card, keeps track of whether it is loading or not, and the current state of the Range Selector
     * And which data range is being requested.
     */
    const [card, setCard] = useState(cardProp);
    // Keep track of the original datasource setting
    const [originalDataSource] = useState(dataSource);
    // keep track of the expanded card id
    const [isExpanded, setIsExpanded] = useState();

    // If the dashboard has triggered a bulk load, refetch the data
    useEffect(
      () => {
        const setupAndLoadCard = async () => {
          let updatedCard = card;
          // Image cards require extra setup before loading data
          if (onSetupCard && card.type === CARD_TYPES.IMAGE && !card.content.src) {
            updatedCard = await onSetupCard(card);
            setCard(updatedCard);
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
            type === CARD_TYPES.TABLE ||
            availableActions?.expand, // image and line chart cards should have expand
        }),
      [availableActions, dataSource, type]
    );

    /**
     * Listen to the card's range action to decide whether to trigger a data refetch
     */
    const cachedOnCardAction = useCallback(
      async (id, actionType, payload) => {
        // callback time grain change from parent
        if (actionType === CARD_ACTIONS.CHANGE_TIME_RANGE) {
          // First update the range
          const range =
            payload && payload.range !== 'default'
              ? determineCardRange(payload.range)
              : originalDataSource.range; // If default, then reset the card range
          const cardWithUpdatedRange = {
            ...card, // expand the current card state
            isLoading: true, // set loading
            dataSource: {
              ...cardProp.dataSource,
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
        } else if (actionType === CARD_ACTIONS.OPEN_EXPANDED_CARD) {
          setIsExpanded(true);
        } else if (actionType === CARD_ACTIONS.UPDATE_DATA) {
          // New action type where we pass the updated values data
          setCard(currentCardState => ({
            ...currentCardState,
            values: payload?.values,
          }));
        }

        // close expanded card
        if (actionType === CARD_ACTIONS.CLOSE_EXPANDED_CARD) {
          setIsExpanded(false);
        }
      },
      [card, onFetchData, originalDataSource && originalDataSource.range, timeGrain] // eslint-disable-line
    );

    console.log(card);

    const commonCardProps = {
      ...card, // pass all the card props, including the card data to the card
      style: cardProp.style, // these come from grid layout and not state
      className: cardProp.className, // these come from grid layout and not state
      key: cardProp.id,
      availableActions: cachedActions,
      isExpanded,
      i18n,
      isEditable,
      onCardAction: cachedOnCardAction,
      renderIconByName,
      breakpoint,
    };

    return type === CARD_TYPES.VALUE ? (
      <ValueCard {...commonCardProps} />
    ) : type === CARD_TYPES.IMAGE ? (
      <ImageCard {...commonCardProps} error={card.setupError || card.error} />
    ) : type === CARD_TYPES.TIMESERIES ? (
      <TimeSeriesCard {...commonCardProps} />
    ) : type === CARD_TYPES.TABLE ? (
      <TableCard {...commonCardProps} />
    ) : type === CARD_TYPES.LIST ? (
      <ListCard {...commonCardProps} data={card.content.data} loadData={card.content.loadData} />
    ) : type === CARD_TYPES.GAUGE ? (
      <GaugeCard {...commonCardProps} />
    ) : type === CARD_TYPES.CUSTOM ? (
      <Card hideHeader={isNil(card.title)} {...omit(commonCardProps, 'content')}>
        {card.content}
      </Card>
    ) : null;
  }
);

CachedCardRenderer.propTypes = {
  style: PropTypes.objectOf(PropTypes.string),
};
CachedCardRenderer.defaultProps = {
  style: {},
};
export default CachedCardRenderer;
