import React from 'react';
import uuid from 'uuid';

import {
  CARD_SIZES,
  CARD_ACTIONS,
  CARD_TYPES,
  TIME_SERIES_TYPES,
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

import sampleImage from './landscape.jpg';

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
  const cardData =
    type === CARD_TYPES.VALUE
      ? {
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
        }
      : type === CARD_TYPES.TIMESERIES
      ? {
          ...baseCardProps,
          content: {
            series: [],
            xLabel: 'Time',
            yLabel: 'Temperature (˚F)',
            chartType: TIME_SERIES_TYPES.LINE,
            includeZeroOnXaxis: true,
            includeZeroOnYaxis: true,
            timeDataSourceId: 'timestamp',
            addSpaceOnEdges: 1,
          },
          interval: 'day',
        }
      : type === CARD_TYPES.BAR
      ? {
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
        }
      : type === CARD_TYPES.IMAGE
      ? {
          ...baseCardProps,
          content: {
            alt: 'landscape.jpg',
            src: sampleImage,
            hideMinimap: true,
            hideHotspots: false,
            hideZoomControls: false,
          },
        }
      : type === CARD_TYPES.TABLE
      ? {
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
        }
      : baseCardProps;
  return cardData;
};

export const getCardPreview = (cardData, isSelected, onSelectCard, onRemoveCard) => {
  const isCardJsonValid = cardJson => {
    if (cardJson.type === CARD_TYPES.VALUE) {
      return cardJson?.content?.attributes !== undefined;
    }
    if (cardJson.type === CARD_TYPES.TIMESERIES) {
      return cardJson?.content !== undefined;
    }
    if (cardJson.type === CARD_TYPES.BAR) {
      return cardJson?.content !== undefined;
    }
    if (cardJson.type === CARD_TYPES.TABLE) {
      return cardJson?.content !== undefined;
    }
    return true;
  };

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

  const renderBarChartCard = (cardJson, commonProps) => (
    <BarChartCard
      key={cardJson.id}
      id={cardJson.id}
      title={cardJson.title}
      tooltip={cardJson.description}
      size={cardJson.size}
      content={cardJson?.content}
      isEditable
      // TODO: fix inability to pass className to BarChartCard
      {...(commonProps.className ? {} : commonProps)}
    />
  );

  const renderTableCard = (cardJson, commonProps) => (
    <TableCard
      key={cardJson.id}
      id={cardJson.id}
      title={cardJson.title}
      tooltip={cardJson.description}
      size={cardJson.size}
      content={cardJson?.content}
      isEditable
      // TODO: fix inability to pass className to BarChartCard
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
      // TODO: fix inability to pass className to BarChartCard
      {...commonProps}
    />
  );
  */

  const commonProps = isSelected
    ? { className: 'selected-card' }
    : {
        availableActions: { edit: true, delete: true },
        onCardAction: (id, actionId) => {
          if (actionId === CARD_ACTIONS.EDIT_CARD) {
            onSelectCard(id);
          }
          if (actionId === CARD_ACTIONS.DELETE_CARD) {
            onRemoveCard(id);
          }
        },
      };

  return isCardJsonValid(cardData)
    ? cardData.type === CARD_TYPES.VALUE
      ? renderValueCard(cardData, commonProps)
      : cardData.type === CARD_TYPES.TIMESERIES
      ? renderTimeSeriesCard(cardData, commonProps)
      : cardData.type === CARD_TYPES.BAR
      ? renderBarChartCard(cardData, commonProps)
      : cardData.type === CARD_TYPES.TABLE
      ? renderTableCard(cardData, commonProps)
      : // : cardData.type === CARD_TYPES.IMAGE
        // ? renderImageCard(cardData, commonProps)
        renderDefaultCard(cardData, commonProps)
    : renderDefaultCard(cardData, commonProps);
};
