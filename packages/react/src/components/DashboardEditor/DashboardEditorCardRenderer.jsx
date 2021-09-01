/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import update from 'immutability-helper';

import { usePrevious } from '../../hooks/usePrevious';
import { CARD_TYPES, CARD_ACTIONS } from '../../constants/LayoutConstants';

import { handleKeyDown, handleOnClick } from './editorUtils';
import DashboardEditorDefaultCardRenderer from './DashboardEditorDefaultCardRenderer';

/**
 *
 * This component is needed to cache the style object for performance reasons because unfortunately, the style object changes with every render from React Grid Layout
 */
const CachedEditorCardRenderer = ({ style, children, ...others }) => {
  const [cachedStyle, setCachedStyle] = useState(style);
  const [cachedChildren, setCachedChildren] = useState(children);
  const previousStyle = usePrevious(style);

  // Unfortunately the react-grid-layout creates a new style object every render
  useEffect(() => {
    if (!isEqual(style, previousStyle)) {
      setCachedStyle(style);
    }
  }, [previousStyle, style]);

  // Unfortunately the react-grid keeps putting a new child object every render, only need to refresh if it's resizable
  useEffect(
    () => {
      setCachedChildren(children);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [others.isResizable]
  );

  return (
    <DashboardEditorCardRenderer {...others} style={cachedStyle}>
      {
        cachedChildren // this is a performance enhancement because the children were always being recreated
      }
    </DashboardEditorCardRenderer>
  );
};

CachedEditorCardRenderer.defaultProps = {
  style: {},
};

const shouldComponentSkipUpdate = (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
};

const availableActions = { clone: true, delete: true };
/**
 * Returns a Card component for preview in the dashboard.  Decides whether to call the renderCardPreview function or use our default renderer.
 * Also handles converting the low level card callback events into the higher level ones
 * @param {Object} availableDimensions collection of dimensions where the key is the
 * dimension and the value is a list of values for that dimension
 * @returns {Node}
 */
const DashboardEditorCardRenderer = React.memo(
  ({
    isSelected,
    availableDimensions,
    i18n,
    onRemove,
    onDuplicate,
    onCardChange,
    setSelectedCardId,
    renderIconByName,
    onShowImageGallery,
    onValidateUploadedImage,
    baseClassName,
    renderCardPreview,
    style,
    ...cardConfig
  }) => {
    // We have to keep track of our dynamic hotspots here
    const [dynamicHotspots, setDynamicHotspots] = useState([]);

    const handleOnCardAction = useCallback(
      (id, actionId, payload) => {
        if (actionId === CARD_ACTIONS.CLONE_CARD) {
          onDuplicate(id);
        } else if (actionId === CARD_ACTIONS.DELETE_CARD) {
          onRemove(id);
        } else if (actionId === CARD_ACTIONS.ON_CARD_CHANGE) {
          onCardChange(update(cardConfig, payload));
        }
      },
      [cardConfig, onCardChange, onDuplicate, onRemove]
    );

    const handleOnCardKeyDown = useCallback(
      (e) => {
        handleKeyDown(e, setSelectedCardId, cardConfig.id);
      },
      [cardConfig.id, setSelectedCardId]
    );

    const handleOnCardMouseDown = useCallback(
      (e) => {
        handleOnClick(setSelectedCardId, cardConfig.id);
        cardConfig.onMouseDown(e);
      },
      // Need to disable the eslint role because I don't want to regen if any other part of cardConfig changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [cardConfig.id, cardConfig.onMouseDown, setSelectedCardId]
    );
    // Need to memoize these card props at this level to improve performance
    const cardProps = useMemo(
      () => ({
        ...cardConfig,
        style,
        key: cardConfig.id,
        tooltip: cardConfig.description,
        i18n,
        availableActions,
        onCardAction: handleOnCardAction,
        renderIconByName,
        tabIndex: 0,
        onKeyDown: handleOnCardKeyDown,
        onMouseDown: handleOnCardMouseDown,
        className: `${baseClassName}--preview__card`,
        isSelected,
        // Add the show gallery to image card
        onBrowseClick:
          cardConfig.type === CARD_TYPES.IMAGE && isNil(cardConfig.content?.src)
            ? onShowImageGallery
            : undefined,
        validateUploadedImage:
          cardConfig.type === CARD_TYPES.IMAGE ? onValidateUploadedImage : undefined,
      }),
      [
        baseClassName,
        cardConfig,
        handleOnCardAction,
        handleOnCardKeyDown,
        handleOnCardMouseDown,
        i18n,
        isSelected,
        onShowImageGallery,
        onValidateUploadedImage,
        renderIconByName,
        style,
      ]
    );

    useEffect(() => {
      const originalDynamicHotspot = cardProps.values?.hotspots?.find(
        (hotspot) => hotspot.type === 'dynamic'
      );
      // if we have dynamic hotspots and a way to fetch them, fetch them
      if (originalDynamicHotspot && cardProps.onFetchDynamicDemoHotspots) {
        cardProps.onFetchDynamicDemoHotspots().then((hotspots) =>
          setDynamicHotspots(
            hotspots.map((hotspot) => ({
              ...hotspot,
              ...omit(originalDynamicHotspot, 'type', 'x', 'y'),
            }))
          )
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardProps.values?.hotspots?.length, cardProps.onFetchDynamicDemoHotspots]);

    // If the renderCardPreview function returns a valid value for the card, use it,
    if (
      typeof renderCardPreview === 'function' &&
      renderCardPreview(
        cardConfig,
        cardProps,
        setSelectedCardId,
        onDuplicate,
        onRemove,
        isSelected,
        onShowImageGallery,
        availableDimensions
      )
    ) {
      return renderCardPreview(
        cardConfig,
        cardProps,
        setSelectedCardId,
        onDuplicate,
        onRemove,
        isSelected,
        onShowImageGallery,
        availableDimensions
      );
    }

    // otherwise use our default renderers
    // If it's an image card we need to update its dynamic hotspots
    const card = useMemo(
      () =>
        cardProps.type !== CARD_TYPES.IMAGE
          ? cardProps
          : {
              ...cardProps,
              values: {
                ...cardProps.values,
                hotspots: cardProps.values?.hotspots?.concat(dynamicHotspots),
              },
            },
      [cardProps, dynamicHotspots]
    );

    return (
      <DashboardEditorDefaultCardRenderer card={card} availableDimensions={availableDimensions} />
    );
  },
  shouldComponentSkipUpdate
);

export default CachedEditorCardRenderer;
