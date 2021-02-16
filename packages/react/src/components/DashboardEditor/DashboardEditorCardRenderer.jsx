/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import omit from 'lodash/omit';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import { Warning24 } from '@carbon/icons-react';
import update from 'immutability-helper';

import { CARD_TYPES, CARD_ACTIONS } from '../../constants/LayoutConstants';
import {
  Card,
  ValueCard,
  TimeSeriesCard,
  BarChartCard,
  ImageCard,
  TableCard,
  ListCard,
} from '../../index';

import {
  validThresholdIcons,
  validHotspotIcons,
  timeRangeToJSON,
  isCardJsonValid,
  handleKeyDown,
  handleOnClick,
} from './editorUtils';

/**
 * Renders a card and lists the JSON within
 * @param {Object} props
 * @returns {Node}
 */
const renderDefaultCard = (props) => (
  <Card isEditable {...props}>
    <div style={{ padding: '1rem' }}>{JSON.stringify(props.id, null, 4)}</div>
  </Card>
);

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderValueCard = (props) => (
  <ValueCard
    // render the icon in the right color in the card preview
    renderIconByName={(iconName, iconProps) => {
      const iconToRender = validThresholdIcons.find((icon) => icon.name === iconName)
        ?.carbonIcon || <Warning24 />;
      // eslint-disable-next-line react/prop-types
      return (
        <div style={{ color: iconProps.fill }}>{React.cloneElement(iconToRender, iconProps)}</div>
      );
    }}
    isEditable
    {...props}
  />
);
/**
 * @param {Object} props
 * @returns {Node}
 */
const renderTimeSeriesCard = (props) => {
  // apply the timeRange for the card preview
  const timeRangeJSON = find(timeRangeToJSON, ({ range }) =>
    isEqual(range, props?.dataSource?.range)
  );
  return (
    <TimeSeriesCard isEditable values={[]} interval={timeRangeJSON?.interval || 'day'} {...props} />
  );
};

/**
 * @param {Object} props
 * @returns {Node}
 */
const EditorBarChartCard = ({ dataItems, availableDimensions, ...props }) => {
  // apply the timeRange for the card preview
  const timeRangeJSON = find(timeRangeToJSON, ({ range }) =>
    isEqual(range, props?.dataSource?.range)
  );

  return (
    <BarChartCard
      isEditable
      isDashboardPreview
      availableDimensions={availableDimensions}
      interval={timeRangeJSON?.interval || 'day'}
      {...props}
    />
  );
};

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderTableCard = (props) => (
  <TableCard
    // TODO: workaround need to regen TableCard if columns change
    key={JSON.stringify(props?.content?.columns)}
    isEditable
    {...props}
  />
);

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderImageCard = (props) => (
  <ImageCard
    renderIconByName={(iconName, iconProps) => {
      // first search the validHotspot Icons
      const matchingHotspotIcon = validHotspotIcons.find((icon) => icon.id === iconName);

      // then search the validThresholdIcons
      const matchingThresholdIcon = validThresholdIcons.find((icon) => icon.name === iconName);
      const iconToRender = matchingHotspotIcon ? (
        React.createElement(matchingHotspotIcon.icon, {
          ...iconProps,
          title: matchingHotspotIcon.text,
        })
      ) : matchingThresholdIcon ? (
        React.cloneElement(matchingThresholdIcon.carbonIcon, {
          ...iconProps,
          title: matchingThresholdIcon.name,
        })
      ) : (
        <Warning24 {...iconProps} />
      );

      // otherwise default to Warning24
      // eslint-disable-next-line react/prop-types
      return <div style={{ color: iconProps.fill }}>{iconToRender}</div>;
    }}
    {...props}
    isEditable // render the icon in the right color in the card preview
    values={{
      ...props.values,
      hotspots: props.values?.hotspots?.filter((hotspot) => hotspot.type !== 'dynamic') || [],
    }}
  />
);

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderListCard = (props) => <ListCard isEditable {...props} />;

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderCustomCard = (props) => {
  return (
    <Card
      isEditable
      // need to omit the content because its getting passed content to be rendered, which should not
      // get attached to the card wrapper
      {...omit(props, 'content')}
    >
      {props.content}
    </Card>
  );
};

/**
 *
 * This component is needed to cache the style object for performance reasons because unfortunately, the style object changes with every render from React Grid Layout
 */
const CachedEditorCardRenderer = ({ style, children, getValidDataItems, dataItems, ...others }) => {
  const [cachedStyle, setCachedStyle] = useState(style);
  const [cachedChildren, setCachedChildren] = useState(children);
  const dataItemsForCard = useMemo(
    () => (getValidDataItems ? getValidDataItems(others) : dataItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataItems]
  );

  useEffect(
    () => {
      setCachedStyle(style);
    },
    [style] // need to do a deep compare on style
  );

  useEffect(
    () => {
      setCachedChildren(children);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [others.isResizable] // Unfortunately the react-grid keeps putting a new child object every render, only need to refresh if it's resizable
  );

  return (
    <DashboardEditorCardRenderer {...others} dataItems={dataItemsForCard} style={cachedStyle}>
      {
        cachedChildren // this is a performance enhancement because the children were always being recreated
      }
    </DashboardEditorCardRenderer>
  );
};

const shouldComponentSkipUpdate = (prevProps, nextProps) => {
  return isEqual(prevProps, nextProps);
};
/**
 * Returns a Card component for preview in the dashboard
 * @param {Array} dataItems list of dataItems available to the card
 * @param {Object} availableDimensions collection of dimensions where the key is the
 * dimension and the value is a list of values for that dimension
 * @returns {Node}
 */
const DashboardEditorCardRenderer = React.memo(
  ({
    isSelected,
    dataItems,
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

    // Need to memoize these card props at this level to improve performance
    const cardProps = useMemo(
      () => ({
        ...cardConfig,
        style,
        key: cardConfig.id,
        tooltip: cardConfig.description,
        i18n,
        availableActions: { clone: true, delete: true },
        onCardAction: handleOnCardAction,
        renderIconByName,
        tabIndex: 0,
        onKeyDown: (e) => {
          handleKeyDown(e, setSelectedCardId, cardConfig.id);
        },
        onMouseDown: (e) => {
          handleOnClick(setSelectedCardId, cardConfig.id);
          cardConfig.onMouseDown(e);
        },
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
        i18n,
        isSelected,
        onShowImageGallery,
        onValidateUploadedImage,
        renderIconByName,
        setSelectedCardId,
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

    if (!isCardJsonValid(cardProps)) {
      return renderDefaultCard(cardProps);
    }
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
        onShowImageGallery
      )
    ) {
      return renderCardPreview(
        cardConfig,
        cardProps,
        setSelectedCardId,
        onDuplicate,
        onRemove,
        isSelected,
        onShowImageGallery
      );
    }

    // otherwise use our default renderers
    switch (cardProps.type) {
      case CARD_TYPES.VALUE:
        return renderValueCard(cardProps);
      case CARD_TYPES.TIMESERIES:
        return renderTimeSeriesCard(cardProps);
      case CARD_TYPES.BAR:
        return (
          <EditorBarChartCard
            {...cardProps}
            dataItems={dataItems}
            availableDimensions={availableDimensions}
          />
        );
      case CARD_TYPES.TABLE:
        return renderTableCard(cardProps);
      case CARD_TYPES.IMAGE:
        return renderImageCard({
          ...cardProps,
          values: {
            ...cardProps.values,
            hotspots: cardProps.values?.hotspots?.concat(dynamicHotspots),
          },
        });
      case CARD_TYPES.LIST:
        return renderListCard(cardProps);
      case CARD_TYPES.CUSTOM:
        return renderCustomCard(cardProps);
      default:
        return renderDefaultCard(cardProps);
    }
  },
  shouldComponentSkipUpdate
);

export default CachedEditorCardRenderer;
