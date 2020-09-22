import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { settings } from '../../constants/Settings';
import {
  CARD_SIZES,
  CARD_ACTIONS,
  CARD_TYPES,
  BAR_CHART_TYPES,
} from '../../constants/LayoutConstants';
import {
  DashboardGrid,
  Card,
  ValueCard,
  TimeSeriesCard,
  BarChartCard,
  CardEditor,
} from '../../index';

const { iotPrefix } = settings;

const defaultProps = {
  initialValue: {
    cards: [],
    layouts: {},
  },
  renderHeader: null,
  renderCardPreview: null,
};

const propTypes = {
  /** initial dashboard data to edit */
  initialValue: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  /** if provided, renders header content above preview */
  renderHeader: PropTypes.func,
  /** if provided, is used to render cards in dashboard */
  renderCardPreview: PropTypes.func,
};

const DashboardEditor = ({ initialValue, renderHeader, renderCardPreview }) => {
  const baseClassName = `${iotPrefix}--dashboard-editor`;

  // show the gallery if no card is being edited
  const [dashboardData, setDashboardData] = useState(initialValue);
  const [selectedCardId, setSelectedCardId] = useState();

  const addCard = type => {
    const defaultSizeForType = {
      [CARD_TYPES.VALUE]: CARD_SIZES.SMALLWIDE,
      [CARD_TYPES.BAR]: CARD_SIZES.MEDIUM,
      [CARD_TYPES.TIMESERIES]: CARD_SIZES.MEDIUMWIDE,
    };
    const baseCardProps = {
      id: uuid.v4(),
      title: `New ${type} card`,
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
              series: [
                {
                  label: 'Temperature',
                  dataSourceId: 'temperature',
                },
                {
                  label: 'Humidity',
                  dataSourceId: 'humidity',
                },
              ],
              xLabel: 'Time',
              yLabel: 'Temperature (˚F)',
              includeZeroOnXaxis: true,
              includeZeroOnYaxis: true,
              timeDataSourceId: 'timestamp',
              addSpaceOnEdges: 1,
            },
          }
        : type === CARD_TYPES.TIMESERIES
        ? {
            ...baseCardProps,
            content: {
              series: [
                {
                  label: 'Temperature',
                  dataSourceId: 'temperature',
                },
                {
                  label: 'Humidity',
                  dataSourceId: 'humidity',
                },
              ],
              xLabel: 'Time',
              yLabel: 'Temperature (˚F)',
              includeZeroOnXaxis: true,
              includeZeroOnYaxis: true,
              timeDataSourceId: 'timestamp',
              addSpaceOnEdges: 1,
            },
          }
        : type === CARD_TYPES.BAR
        ? {
            ...baseCardProps,
            content: {
              type: BAR_CHART_TYPES.GROUPED,
              xLabel: 'Cities',
              yLabel: 'Total',
              series: [
                {
                  dataSourceId: 'particles',
                  label: 'Particles',
                  color: 'blue',
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
        : baseCardProps;
    setDashboardData({
      ...dashboardData,
      cards: [...dashboardData.cards, cardData],
    });
    setSelectedCardId(cardData.id);
  };
  const removeCard = id =>
    setDashboardData({
      ...dashboardData,
      cards: dashboardData.cards.filter(i => i.id !== id),
    });

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
    return true;
  };

  const renderDefaultCard = (cardJson, commonProps) => (
    <Card id={cardJson.id} size={cardJson.size} title={cardJson.title} isEditable {...commonProps}>
      <div style={{ padding: '1rem' }}>{JSON.stringify(cardJson, null, 4)}</div>
    </Card>
  );

  const renderValueCard = (cardJson, commonProps) => (
    <ValueCard
      id={cardJson.id}
      title={cardJson.title}
      size={cardJson.size}
      content={cardJson?.content}
      isEditable
      {...commonProps}
    />
  );

  const renderTimeSeriesCard = (cardJson, commonProps) => (
    <TimeSeriesCard
      id={cardJson.id}
      title={cardJson.title}
      size={cardJson.size}
      content={cardJson?.content}
      isEditable
      {...commonProps}
    />
  );

  const renderBarChartCard = (cardJson, commonProps) => (
    <BarChartCard
      id={cardJson.id}
      title={cardJson.title}
      size={cardJson.size}
      content={cardJson?.content}
      isEditable
      // TODO: fix inability to pass className to BarChartCard
      {...(commonProps.className ? {} : commonProps)}
    />
  );

  return (
    <div className={baseClassName}>
      <div className={`${baseClassName}--content`}>
        {renderHeader && renderHeader()}
        <div className={`${baseClassName}--preview`}>
          <DashboardGrid
            isEditable
            onBreakpointChange={newBreakpoint => console.log('onBreakpointChange', newBreakpoint)}
            onLayoutChange={(newLayout, newLayouts) =>
              setDashboardData({
                ...dashboardData,
                layouts: newLayouts,
              })
            }
          >
            {dashboardData.cards.map(i => {
              const isSelected = selectedCardId === i.id;
              const commonProps = isSelected
                ? { className: 'selected-card' }
                : {
                    availableActions: { edit: true, delete: true },
                    onCardAction: (id, actionId) => {
                      if (actionId === CARD_ACTIONS.EDIT_CARD) {
                        setSelectedCardId(id);
                      }
                      if (actionId === CARD_ACTIONS.DELETE_CARD) {
                        removeCard(id);
                      }
                    },
                  };
              return renderCardPreview
                ? renderCardPreview(i, setSelectedCardId, removeCard)
                : !isCardJsonValid(i)
                ? renderDefaultCard(i, commonProps)
                : i.type === CARD_TYPES.VALUE
                ? renderValueCard(i, commonProps)
                : i.type === CARD_TYPES.TIMESERIES
                ? renderTimeSeriesCard(i, commonProps)
                : i.type === CARD_TYPES.BAR
                ? renderBarChartCard(i, commonProps)
                : renderDefaultCard(i, commonProps);
            })}
          </DashboardGrid>
          <pre style={{ paddingTop: '4rem' }}>{JSON.stringify(dashboardData, null, 4)}</pre>
        </div>
      </div>
      <CardEditor
        value={dashboardData.cards.find(i => i.id === selectedCardId)}
        onShowGallery={() => setSelectedCardId(null)}
        // NOTE: won't support changes to card ID
        onChange={cardData =>
          setDashboardData({
            ...dashboardData,
            cards: dashboardData.cards.map(i => (i.id === cardData.id ? cardData : i)),
          })
        }
        onAddCard={addCard}
      />
    </div>
  );
};

DashboardEditor.propTypes = propTypes;
DashboardEditor.defaultProps = defaultProps;

export default DashboardEditor;
