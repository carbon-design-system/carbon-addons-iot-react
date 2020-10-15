import React from 'react';
import uuid from 'uuid';
import isNil from 'lodash/isNil';
import classNames from 'classnames';

import {
  CARD_SIZES,
  CARD_ACTIONS,
  CARD_TYPES,
  BAR_CHART_TYPES,
  BAR_CHART_LAYOUTS,
  DASHBOARD_EDITOR_CARD_TYPES,
} from '../../constants/LayoutConstants';
import {
  Card,
  ValueCard,
  TimeSeriesCard,
  BarChartCard,
  ImageCard,
  TableCard,
  ListCard,
} from '../../index';

import { baseClassName } from './DashboardEditor';
import sampleImage from './landscape.jpg';

/**
 * Returns a duplicate card configuration
 * @param {Object} cardData, card JSON configuration
 * @returns {Object} duplicated card JSON
 */
export const getDuplicateCard = (cardData) => ({
  ...cardData,
  id: uuid.v4(),
});

/**
 * Returns a default card configuration
 * @param {string} type, card type
 * @returns {Object} default card JSON
 */
export const getDefaultCard = (type, i18n) => {
  const defaultSizeForType = {
    [DASHBOARD_EDITOR_CARD_TYPES.VALUE]: CARD_SIZES.SMALLWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.SIMPLE_BAR]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.GROUPED_BAR]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.STACKED_BAR]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.TIMESERIES]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.IMAGE]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.TABLE]: CARD_SIZES.LARGE,
  };

  const baseCardProps = {
    id: uuid.v4(),
    title: i18n.defaultCardTitle,
    size: defaultSizeForType[type] ?? CARD_SIZES.MEDIUM,
    ...(type.includes(CARD_TYPES.BAR) ? { type: CARD_TYPES.BAR } : { type }),
  };

  switch (type) {
    case DASHBOARD_EDITOR_CARD_TYPES.VALUE:
      return {
        ...baseCardProps,
        content: {
          attributes: [],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.TIMESERIES:
      return {
        ...baseCardProps,
        content: {
          series: [],
          timeDataSourceId: 'timestamp',
        },
        interval: 'day',
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.SIMPLE_BAR:
      return {
        ...baseCardProps,
        content: {
          type: BAR_CHART_TYPES.SIMPLE,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          series: [],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.GROUPED_BAR:
      return {
        ...baseCardProps,
        content: {
          type: BAR_CHART_TYPES.GROUPED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          series: [],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.STACKED_BAR:
      return {
        ...baseCardProps,
        content: {
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          series: [],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.TABLE:
      return {
        ...baseCardProps,
        content: {
          columns: [
            {
              dataSourceId: 'undefined',
              label: '--',
            },
            {
              dataSourceId: 'undefined2',
              label: '--',
            },
          ],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.IMAGE:
      return {
        ...baseCardProps,
        content: {
          alt: 'Sample image',
          src: sampleImage,
          hideMinimap: true,
          hideHotspots: false,
          hideZoomControls: false,
        },
        i18n,
      };

    default:
      return { ...baseCardProps, i18n };
  }
};

/**
 * determines if a card JSON is valid depending on its card type
 * @param {Object} cardJson
 * @returns {Boolean}
 */
export const isCardJsonValid = (cardJson) => {
  switch (cardJson.type) {
    case CARD_TYPES.VALUE:
      return !isNil(cardJson?.content?.attributes);
    case CARD_TYPES.TIMESERIES:
      return !isNil(cardJson?.content);
    case CARD_TYPES.BAR:
      return !isNil(cardJson?.content);
    case CARD_TYPES.TABLE:
      return !isNil(cardJson?.content);
    default:
      return true;
  }
};

/**
 * Renders a card and lists the JSON within
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderDefaultCard = (cardJson, commonProps) => (
  <Card isEditable {...cardJson} {...commonProps}>
    <div style={{ padding: '1rem' }}>{JSON.stringify(cardJson, null, 4)}</div>
  </Card>
);

/**
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderValueCard = (cardJson, commonProps) => (
  <ValueCard isEditable {...cardJson} {...commonProps} />
);

/**
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderTimeSeriesCard = (cardJson, commonProps) => (
  <TimeSeriesCard isEditable {...cardJson} {...commonProps} />
);

/**
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderBarChartCard = (cardJson, commonProps) => (
  <BarChartCard isEditable {...cardJson} {...commonProps} />
);

/**
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderTableCard = (cardJson, commonProps) => (
  <TableCard isEditable {...cardJson} {...commonProps} />
);

const renderImageCard = (cardJson, commonProps) => (
  <ImageCard
    isEditable={cardJson?.content?.src === undefined}
    {...cardJson}
    {...commonProps}
  />
);

/**
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderListCard = (cardJson, commonProps) => (
  <ListCard isEditable {...cardJson} {...commonProps} />
);

/**
 * Returns a Card component for preview in the dashboard
 * @param {Object} cardData, the JSON configuration of the card
 * @param {Boolean} isSelected, is the card in a selected state
 * @param {Function} onSelectCard, callback when card is selected for editing
 * @param {Function} onDuplicateCard, callback when card clone button is clicked
 * @param {Function} onRemoveCard, callback when card delete button is clicked
 * @returns {Node}
 */
export const getCardPreview = (
  cardData,
  isSelected,
  onSelectCard,
  onDuplicateCard,
  onRemoveCard
) => {
  const commonProps = {
    key: cardData.id,
    tooltip: cardData.description,
    ...(isSelected
      ? {
          className: classNames({
            [`${baseClassName}--preview__selected-card`]: isSelected,
          }),
        }
      : {}),
    availableActions: { clone: true, delete: true },
    onCardAction: (id, actionId) => {
      if (actionId === CARD_ACTIONS.CLONE_CARD) {
        onDuplicateCard(id);
      }
      if (actionId === CARD_ACTIONS.DELETE_CARD) {
        onRemoveCard(id);
      }
    },
    tabIndex: 0,
    onClick: () => onSelectCard(),
  };

  if (!isCardJsonValid(cardData)) {
    return renderDefaultCard(cardData, commonProps);
  }

  switch (cardData.type) {
    case CARD_TYPES.VALUE:
      return renderValueCard(cardData, commonProps);
    case CARD_TYPES.TIMESERIES:
      return renderTimeSeriesCard(cardData, commonProps);
    case CARD_TYPES.BAR:
      return renderBarChartCard(cardData, commonProps);
    case CARD_TYPES.TABLE:
      return renderTableCard(cardData, commonProps);
    case CARD_TYPES.IMAGE:
      return renderImageCard(cardData, commonProps);
    case CARD_TYPES.LIST:
      return renderListCard(cardData, commonProps);
    default:
      return renderDefaultCard(cardData, commonProps);
  }
};
