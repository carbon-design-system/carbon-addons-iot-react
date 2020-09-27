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
  ImageCard,
  TableCard,
  CardEditor,
  Breadcrumb,
  BreadcrumbItem,
} from '../../index';

import sampleImage from './landscape.jpg';

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

const DashboardEditor = ({
  initialValue,
  renderHeader,
  renderCardPreview,
  headerBreadcrumbs,
  onAddImage,
  onSubmit,
}) => {
  const baseClassName = `${iotPrefix}--dashboard-editor`;

  // show the gallery if no card is being edited
  const [dashboardData, setDashboardData] = useState(initialValue);
  const [selectedCardId, setSelectedCardId] = useState();

  const addCard = type => {
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
      isEditable
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

  const renderImageCard = (cardJson, commonProps) => (
    <ImageCard
      id={cardJson.id}
      title={cardJson.title}
      tooltip={cardJson.description}
      size={cardJson.size}
      content={cardJson?.content}
      values={cardJson?.values}
      isEditable={cardJson?.content?.src === undefined}
      // TODO: fix inability to pass className to BarChartCard
      {...commonProps}
    />
  );

  const renderTableCard = (cardJson, commonProps) => (
    <TableCard
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
  {
    title: 'Floor Map',
    id: 'floor map picture',
    size: CARD_SIZES.MEDIUM,
    type: CARD_TYPES.IMAGE,
    onSetupCard() {
      return { ...cardValues[3] };
    },
    availableActions: {
      range: true,
    },
    content: {
      alt: 'Floor Map',
      image: 'firstfloor',
      src: imageFile,
    },
    values: {
      hotspots: [
        {
          x: 35,
          y: 65,
          icon: 'arrowDown',
          content: <span style={{ padding: '10px' }}>Elevators</span>,
        },
        {
          x: 45,
          y: 25,
          color: '#0f0',
          content: <span style={{ padding: '10px' }}>Stairs</span>,
        },
        {
          x: 45,
          y: 50,
          color: '#00f',
          content: <span style={{ padding: '10px' }}>Vent Fan</span>,
        },
        {
          x: 45,
          y: 75,
          icon: 'arrowUp',
          content: <span style={{ padding: '10px' }}>Humidity Sensor</span>,
        },
      ],
    },
  },
  */

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
                    <Button size="small" onClick={() => onSubmit(dashboardData)}>
                      Save and close
                    </Button>
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
                : i.type === CARD_TYPES.IMAGE
                ? renderImageCard(i, commonProps)
                : i.type === CARD_TYPES.TABLE
                ? renderTableCard(i, commonProps)
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
          onAddImage={onAddImage}
        />
      </div>
    </div>
  );
};

DashboardEditor.propTypes = propTypes;
DashboardEditor.defaultProps = defaultProps;

export default DashboardEditor;
