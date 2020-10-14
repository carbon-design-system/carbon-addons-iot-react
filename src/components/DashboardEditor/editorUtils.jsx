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
} from '../../constants/LayoutConstants';
import {
  Card,
  ValueCard,
  TimeSeriesCard,
  BarChartCard,
  // ImageCard,
  TableCard,
} from '../../index';

import { baseClassName } from './DashboardEditor';

// import sampleImage from './landscape.jpg';

/**
 * Returns a duplicate card configuration
 * @param {Object} cardData, card JSON configuration
 * @returns {Object} duplicated card JSON
 */
export const getDuplicateCard = cardData => ({
  ...cardData,
  id: uuid.v4(),
});

/**
 * Returns a default card configuration
 * @param {string} type, card type
 * @returns {Object} default card JSON
 */
export const getDefaultCard = type => {
  const defaultSizeForType = {
    [CARD_TYPES.VALUE]: CARD_SIZES.SMALLWIDE,
    [CARD_TYPES.BAR]: CARD_SIZES.MEDIUMWIDE,
    [CARD_TYPES.TIMESERIES]: CARD_SIZES.MEDIUMWIDE,
    [CARD_TYPES.IMAGE]: CARD_SIZES.MEDIUMWIDE,
    [CARD_TYPES.TABLE]: CARD_SIZES.MEDIUMWIDE,
  };
  const baseCardProps = {
    id: uuid.v4(),
    title: 'Untitled',
    size: defaultSizeForType[type] ?? CARD_SIZES.MEDIUM,
    type,
  };

  switch (type) {
    case CARD_TYPES.VALUE:
      return {
        ...baseCardProps,
        content: {
          attributes: [
            {
              dataSourceId: 'key1',
              unit: '%',
              label: 'Key 1',
            },
            {
              dataSourceId: 'key2',
              unit: 'lb',
              label: 'Key 2',
            },
          ],
        },
      };
    case CARD_TYPES.TIMESERIES:
      return {
        ...baseCardProps,
        content: {
          series: [
            {
              label: 'Temperature',
              dataSourceId: 'temperature',
            },
            {
              label: 'Pressure',
              dataSourceId: 'pressure',
            },
          ],
          xLabel: 'Time',
          yLabel: 'Temperature (˚F)',
          includeZeroOnXaxis: true,
          includeZeroOnYaxis: true,
          timeDataSourceId: 'timestamp',
          addSpaceOnEdges: 1,
        },
        interval: 'day',
      };
    case CARD_TYPES.BAR:
      return {
        ...baseCardProps,
        content: {
          type: BAR_CHART_TYPES.SIMPLE,
          xLabel: 'Cities',
          yLabel: 'Total',
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
            },
            {
              dataSourceId: 'temperature',
              label: 'Temperature',
            },
            {
              dataSourceId: 'emissions',
              label: 'Emissions',
            },
          ],
          categoryDataSourceId: 'city',
        },
      };
    case CARD_TYPES.TABLE:
      return {
        ...baseCardProps,
        content: {
          columns: [
            {
              dataSourceId: 'alert',
              label: 'Alert',
              priority: 1,
            },
            {
              dataSourceId: 'count',
              label: 'Count',
              priority: 3,
            },
            {
              dataSourceId: 'hour',
              label: 'Hour',
              priority: 2,
              type: 'TIMESTAMP',
            },
            {
              dataSourceId: 'pressure',
              label: 'Pressure',
              priority: 2,
            },
          ],
          threshold: [
            {
              dataSourceId: 'pressure',
              comparison: '>=',
              value: 1,
              severity: 1,
              label: 'Pressure',
              showSeverityLabel: true,
              severityLabel: 'Critical',
            },
          ],
        },
      };
    /*
    case CARD_TYPES.IMAGE:
      return {
          ...baseCardProps,
          content: {
            alt: 'landscape.jpg',
            src: sampleImage,
            hideMinimap: true,
            hideHotspots: false,
            hideZoomControls: false,
          },
      }
    */
    default:
      return baseCardProps;
  }
};

/**
 * determines if a card JSON is valid depending on its card type
 * @param {Object} cardJson
 * @returns {Boolean}
 */
export const isCardJsonValid = cardJson => {
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
  <Card
    key={cardJson.id}
    id={cardJson.id}
    size={cardJson.size}
    title={cardJson.title}
    tooltip={cardJson.description}
    isEditable
    {...commonProps}
  >
    <div style={{ padding: '1rem' }}>{JSON.stringify(cardJson, null, 4)}</div>
  </Card>
);

/**
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderValueCard = (cardJson, commonProps) => (
  <ValueCard
    key={cardJson.id}
    id={cardJson.id}
    title={cardJson.title}
    tooltip={cardJson.description}
    size={cardJson.size}
    content={cardJson?.content}
    isEditable
    {...commonProps}
  />
);

/**
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderTimeSeriesCard = (cardJson, commonProps) => (
  <TimeSeriesCard
    key={cardJson.id}
    id={cardJson.id}
    title={cardJson.title}
    tooltip={cardJson.description}
    size={cardJson.size}
    content={cardJson?.content}
    isEditable
    {...commonProps}
  />
);

/**
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderBarChartCard = (cardJson, commonProps) => (
  <BarChartCard
    key={cardJson.id}
    id={cardJson.id}
    title={cardJson.title}
    tooltip={cardJson.description}
    size={cardJson.size}
    content={cardJson?.content}
    isEditable
    {...commonProps}
  />
);

/**
 * @param {Object} cardJson
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderTableCard = (cardJson, commonProps) => (
  <TableCard
    key={cardJson.id}
    id={cardJson.id}
    title={cardJson.title}
    tooltip={cardJson.description}
    size={cardJson.size}
    content={cardJson?.content}
    isEditable
    {...commonProps}
  />
);

/*
const renderImageCard = (cardJson, commonProps) => (
  <ImageCard
    id={cardJson.id}
    title={cardJson.title}
    tooltip={cardJson.description}
    size={cardJson.size}
    content={cardJson?.content}
    isEditable={cardJson?.content?.src === undefined}
    {...commonProps}
  />
);
*/

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
    default:
      return renderDefaultCard(cardData, commonProps);
  }
};
