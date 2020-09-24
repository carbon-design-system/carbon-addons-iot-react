import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { settings } from '../../constants/Settings';
import {
  CARD_SIZES,
  CARD_ACTIONS,
  CARD_TYPES,
  TIME_SERIES_TYPES,
  BAR_CHART_TYPES,
  BAR_CHART_LAYOUTS,
} from '../../constants/LayoutConstants';
import {
  DashboardGrid,
  Button,
  Card,
  ValueCard,
  TimeSeriesCard,
  BarChartCard,
  CardEditor,
  Breadcrumb,
  BreadcrumbItem,
} from '../../index';

const { iotPrefix, prefix } = settings;

const defaultProps = {
  initialValue: {
    cards: [],
    layouts: {},
  },
  renderHeader: null,
  renderCardPreview: null,
  headerBreadcrumbs: null,
};

const propTypes = {
  /** initial dashboard data to edit */
  initialValue: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  /** if provided, renders header content above preview */
  renderHeader: PropTypes.func,
  /** if provided, is used to render cards in dashboard */
  renderCardPreview: PropTypes.func,
  /** if provided, renders array elements inside of BreadcrumbItem in header */
  headerBreadcrumbs: PropTypes.arrayOf(PropTypes.element),
};

const DashboardEditor = ({ initialValue, renderHeader, renderCardPreview, headerBreadcrumbs }) => {
  const baseClassName = `${iotPrefix}--dashboard-editor`;

  // show the gallery if no card is being edited
  const [dashboardData, setDashboardData] = useState(initialValue);
  const [selectedCardId, setSelectedCardId] = useState();

  const addCard = type => {
    const defaultSizeForType = {
      [CARD_TYPES.VALUE]: CARD_SIZES.SMALLWIDE,
      [CARD_TYPES.BAR]: CARD_SIZES.MEDIUMWIDE,
      [CARD_TYPES.TIMESERIES]: CARD_SIZES.MEDIUMWIDE,
    };
    const baseCardProps = {
      id: uuid.v4(),
      title: `New ${type} card`,
      description: `Information about the ${type} card`,
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
            values: {
              key1: '94.2',
              key2: 'a lot',
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
    <Card
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
      id={cardJson.id}
      title={cardJson.title}
      tooltip={cardJson.description}
      size={cardJson.size}
      content={cardJson?.content}
      values={cardJson?.values}
      isEditable={cardJson.values === undefined}
      {...commonProps}
    />
  );

  const renderTimeSeriesCard = (cardJson, commonProps) => (
    <TimeSeriesCard
      id={cardJson.id}
      title={cardJson.title}
      tooltip={cardJson.description}
      size={cardJson.size}
      content={cardJson?.content}
      values={cardJson?.values}
      interval={cardJson?.interval}
      isEditable={cardJson.values === undefined}
      {...commonProps}
    />
  );

  const renderBarChartCard = (cardJson, commonProps) => (
    <BarChartCard
      id={cardJson.id}
      title={cardJson.title}
      tooltip={cardJson.description}
      size={cardJson.size}
      content={cardJson?.content}
      values={cardJson?.values}
      isEditable={cardJson.values === undefined}
      // TODO: fix inability to pass className to BarChartCard
      {...(commonProps.className ? {} : commonProps)}
    />
  );

  return (
    <div className={baseClassName}>
      <div className={`${baseClassName}--content`}>
        {renderHeader ? (
          renderHeader()
        ) : (
          <div className={`${baseClassName}--header`}>
            <div className={`${prefix}--grid`}>
              <div className={`${prefix}--row`}>
                <div className={`${prefix}--col header-left`}>
                  <div className="header-top">
                    {headerBreadcrumbs ? (
                      <Breadcrumb>
                        {headerBreadcrumbs.map((crumb, index) => (
                          <BreadcrumbItem key={`breadcrumb-${index}`}>{crumb}</BreadcrumbItem>
                        ))}
                      </Breadcrumb>
                    ) : null}
                  </div>
                  <div className="header-bottom">
                    <h4>Dashboard title</h4>
                  </div>
                </div>
                <div className={`${prefix}--col header-right`}>
                  <div className="header-top">
                    {/* <span className="last-updated">Last updated: XYZ</span> */}
                  </div>
                  <div className="header-bottom">
                    <Button style={{ marginRight: '1rem' }} kind="tertiary" size="small">
                      Cancel
                    </Button>
                    <Button size="small">Save and close</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
      <div className={`${baseClassName}--sidebar`}>
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
    </div>
  );
};

DashboardEditor.propTypes = propTypes;
DashboardEditor.defaultProps = defaultProps;

export default DashboardEditor;
