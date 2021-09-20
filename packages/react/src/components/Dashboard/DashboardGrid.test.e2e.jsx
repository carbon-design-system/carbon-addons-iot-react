import React, { Fragment, useState } from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import { chartData, tableColumns, tableData } from '../../utils/sample';
import PieChartCard from '../PieChartCard/PieChartCard';
import ValueCard from '../ValueCard/ValueCard';
import BarChartCard from '../BarChartCard/BarChartCard';
import TableCard from '../TableCard/TableCard';
import ImageCard from '../ImageCard/ImageCard';
import TimeSeriesCard from '../TimeSeriesCard/TimeSeriesCard';
import GaugeCard from '../GaugeCard/GaugeCard';
import ListCard from '../ListCard/ListCard';
import { CARD_ACTIONS, CARD_SIZES } from '../..';
import Card from '../Card/Card';
import MapboxCard from '../MapCard/storyFiles/MapboxExample';
import data from '../MapCard/storyFiles/data.json';
import options from '../MapCard/storyFiles/mapOptions';
import FullWidthWrapper from '../../internal/FullWidthWrapper';
import { CARD_DIMENSIONS } from '../../constants/LayoutConstants';

import DashboardGrid from './DashboardGrid';

const commonGridProps = {
  onBreakpointChange: () => {},
  onLayoutChange: () => {},
};

const MapboxExample = ({ ...props }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOnCardAction = (id, actionType) => {
    if (actionType === CARD_ACTIONS.CLOSE_EXPANDED_CARD) {
      setIsExpanded(false);
    } else if (actionType === CARD_ACTIONS.OPEN_EXPANDED_CARD) {
      setIsExpanded(true);
    } else if (actionType === CARD_ACTIONS.ON_SETTINGS_CLICK) {
      setSettingsOpen((oldSettingsState) => !oldSettingsState);
    }
  };
  return (
    <MapboxCard
      data={data}
      options={options}
      isLegendFullWidth={false}
      onCardAction={handleOnCardAction}
      availableActions={{ expand: true, settings: true }}
      isSettingPanelOpen={settingsOpen}
      isExpanded={isExpanded}
      {...props}
    />
  );
};

const DashboardAllCardsAsResizable = () => {
  const barChartCardValues = [
    {
      city: 'A',
      particles: 447,
    },
    {
      city: 'B',
      particles: 528,
    },
    {
      city: 'C',
      particles: 435,
    },
    {
      city: 'D',
      particles: 388,
    },
  ];

  const pieChartCardValues = [
    {
      category: 'A',
      group: '2V2N 9KYPM',
      value: 1,
    },
    {
      category: 'B',
      group: 'L22I P66EP L22I P66EP',
      value: 10,
    },
    {
      category: 'C',
      group: 'JQAI 2M4L1',
      value: 20,
    },
  ];

  const timeSeriesCardContent = {
    includeZeroOnXaxis: true,
    includeZeroOnYaxis: true,
    series: [
      {
        dataSourceId: 'temperature',
        label: 'Temperature',
      },
    ],
    timeDataSourceId: 'timestamp',
    xLabel: 'Time',
    yLabel: 'Temperature (˚F)',
  };

  const imageCardValues = {
    hotspots: [
      {
        color: 'purple',
        content: {
          attributes: [
            {
              dataSourceId: 'temperature',
              label: 'Temp',
              precision: 2,
            },
          ],
          description: 'Description',
          title: 'My Device',
          values: {
            deviceid: '73000',
            temperature: 35.05,
          },
        },
        icon: 'arrowDown',
        x: 35,
        y: 65,
      },
    ],
  };

  const gaugeCardContent = {
    gauges: [
      {
        backgroundColor: '#e0e0e0',
        color: 'orange',
        dataSourceId: 'usage',
        maximumValue: 100,
        minimumValue: 0,
        shape: 'circle',
        thresholds: [
          {
            color: 'red',
            comparison: '>',
            label: 'Poor',
            value: 0,
          },
          {
            color: '#f1c21b',
            comparison: '>',
            label: 'Fair',
            value: 60,
          },
          {
            color: 'green',
            comparison: '>',
            label: 'Good',
            value: 80,
          },
        ],
        trend: {
          color: '',
          dataSourceId: 'usageTrend',
          trend: 'up',
        },
        units: '%',
      },
    ],
  };

  const listCardData = [
    {
      id: 'row-1',
      value: 'Row content 1',
      link: 'https://internetofthings.ibmcloud.com/',
    },
    {
      id: 'row-2',
      value: 'Row content 2',
      link: 'https://internetofthings.ibmcloud.com/',
    },
    { id: 'row-3', value: 'Row content 3' },
    {
      id: 'row-4',
      value: 'Row content 4',
      link: 'https://internetofthings.ibmcloud.com/',
      extraContent: (
        <svg height="10" width="30">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="red" />
        </svg>
      ),
    },
    { id: 'row-5', value: 'Row content 5' },
    { id: 'row-6', value: 'Row content 6' },
    { id: 'row-7', value: 'Row content 7' },
    { id: 'row-8', value: 'Row content 8' },
  ];

  const [currentSizes, setCurrentSizes] = useState({
    card: CARD_SIZES.SMALL,
    valueCard: CARD_SIZES.SMALLWIDE,
    gaugeCard: CARD_SIZES.MEDIUMTHIN,
    pieChartCard: CARD_SIZES.MEDIUM,
    mapCard: CARD_SIZES.LARGEWIDE,
    tableCard: CARD_SIZES.LARGE,
    imageCard: CARD_SIZES.LARGE,
    timeSeriesCard: CARD_SIZES.LARGETHIN,
    listCard: CARD_SIZES.LARGETHIN,
    barChartCard: CARD_SIZES.LARGEWIDE,
  });
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const isResizable = true;

  const CARDS_ALL_SIZES = [
    <Card
      title={`Card - ${currentSizes.card}`}
      id="card"
      isResizable={isResizable}
      key="card"
      size={currentSizes.card}
      availableActions={{
        delete: true,
      }}
    >
      <p>This is a basic card</p>
    </Card>,
    <ValueCard
      title={`ValueCard - ${currentSizes.valueCard}`}
      id="valueCard"
      key="valueCard"
      size={currentSizes.valueCard}
      isResizable={isResizable}
      content={{
        attributes: [
          {
            dataSourceId: 'occupancy',
            unit: '%',
            secondaryValue: {
              dataSourceId: 'trend',
              trend: 'down',
              color: 'red',
            },
          },
        ],
      }}
      values={{ occupancy: 88 }}
    />,
    <GaugeCard
      id="gaugeCard"
      key="gaugeCard"
      isResizable={isResizable}
      size={currentSizes.gaugeCard}
      title={`GaugeCard - ${currentSizes.gaugeCard}`}
      content={gaugeCardContent}
      tooltip={<p>Health - of floor 8</p>}
      values={{
        usage: 81,
        usageTrend: '12%',
      }}
    />,
    <PieChartCard
      content={{
        groupDataSourceId: 'category',
        legendPosition: 'bottom',
      }}
      title={`PieChartCard - ${currentSizes.pieChartCard}`}
      key="pieChartCard"
      id="pieChartCard"
      size={currentSizes.pieChartCard}
      isResizable={isResizable}
      values={pieChartCardValues}
    />,
    <MapboxExample
      isResizable={isResizable}
      id="mapCard"
      key="mapCard"
      title={`MapCard - ${currentSizes.mapCard}`}
      size={currentSizes.mapCard}
    />,
    <TableCard
      title={`TableCard - ${currentSizes.tableCard}`}
      id="tableCard"
      key="tableCard"
      content={{
        columns: tableColumns,
      }}
      values={tableData}
      onCardAction={() => {}}
      size={currentSizes.tableCard}
      isResizable={isResizable}
    />,
    <ImageCard
      title={`ImageCard - ${currentSizes.imageCard}`}
      id="imageCard"
      isResizable={isResizable}
      key="imageCard"
      size={currentSizes.imageCard}
      content={{
        alt: 'Sample image',
        src: 'static/media/landscape.013ce39d.jpg',
        zoomMax: 10,
      }}
      values={imageCardValues}
    />,
    <TimeSeriesCard
      id="timeSeriesCard"
      isResizable={isResizable}
      size={currentSizes.timeSeriesCard}
      title={`TimeSeriesCard - ${currentSizes.timeSeriesCard}`}
      chartType="LINE"
      content={timeSeriesCardContent}
      key="timeSeriesCard"
      interval="hour"
      values={chartData.events.slice(0, 5)}
    />,
    <ListCard
      id="listCard"
      isResizable={isResizable}
      key="listCard"
      title={`ListCard - ${currentSizes.listCard}`}
      size={currentSizes.listCard}
      data={listCardData}
      hasMoreData={false}
      loadData={() => {}}
    />,
    <BarChartCard
      id="barChartCard"
      key="barChartCard"
      size={currentSizes.barChartCard}
      isResizable={isResizable}
      title={`BarChartCard - ${currentSizes.barChartCard}`}
      content={{
        categoryDataSourceId: 'city',
        layout: 'VERTICAL',
        series: [
          {
            dataSourceId: 'particles',
          },
        ],
        type: 'SIMPLE',
        unit: 'P',
        xLabel: 'Cities',
        yLabel: 'Particles',
      }}
      values={barChartCardValues}
    />,
  ];

  const layouts = {
    max: [
      { i: 'card', x: 0, y: 0, w: 2, h: 1 },
      { i: 'valueCard', x: 2, y: 0, w: 4, h: 1 },
      { i: 'gaugeCard', x: 0, y: 2, w: 2, h: 2 },
      { i: 'pieChartCard', x: 2, y: 0, w: 4, h: 2 },
      { i: 'imageCard', x: 6, y: 2, w: 8, h: 2 },
      { i: 'timeSeriesCard', x: 0, y: 4, w: 4, h: 4 },
      { i: 'listCard', x: 4, y: 4, w: 4, h: 4 },
      { i: 'tableCard', x: 4, y: 4, w: 8, h: 4 },
      { i: 'mapCard', x: 4, y: 4, w: 8, h: 4 },
      { i: 'barChartCard', x: 8, y: 8, w: 16, h: 4 },
    ],
    xl: [
      { i: 'card', x: 0, y: 0, w: 2, h: 1 },
      { i: 'valueCard', x: 4, y: 0, w: 4, h: 1 },
      { i: 'gaugeCard', x: 0, y: 2, w: 4, h: 2 },
      { i: 'pieChartCard', x: 4, y: 0, w: 4, h: 2 },
      { i: 'imageCard', x: 8, y: 2, w: 8, h: 2 },
      { i: 'timeSeriesCard', x: 0, y: 4, w: 4, h: 4 },
      { i: 'listCard', x: 4, y: 4, w: 4, h: 4 },
      { i: 'tableCard', x: 4, y: 4, w: 8, h: 4 },
      { i: 'mapCard', x: 4, y: 4, w: 8, h: 4 },
      { i: 'barChartCard', x: 8, y: 8, w: 16, h: 4 },
    ],
    lg: [
      { i: 'card', x: 0, y: 0, w: 4, h: 1 },
      { i: 'valueCard', x: 4, y: 0, w: 4, h: 1 },
      { i: 'gaugeCard', x: 0, y: 2, w: 4, h: 2 },
      { i: 'pieChartCard', x: 4, y: 0, w: 4, h: 2 },
      { i: 'imageCard', x: 8, y: 2, w: 8, h: 2 },
      { i: 'timeSeriesCard', x: 0, y: 4, w: 4, h: 4 },
      { i: 'listCard', x: 4, y: 4, w: 4, h: 4 },
      { i: 'tableCard', x: 4, y: 4, w: 8, h: 4 },
      { i: 'mapCard', x: 4, y: 4, w: 8, h: 4 },
      { i: 'barChartCard', x: 8, y: 8, w: 16, h: 4 },
    ],
    md: [
      { i: 'card', x: 0, y: 0, w: 4, h: 1 },
      { i: 'valueCard', x: 4, y: 0, w: 4, h: 1 },
      { i: 'gaugeCard', x: 0, y: 2, w: 2, h: 2 },
      { i: 'pieChartCard', x: 2, y: 0, w: 4, h: 2 },
      { i: 'imageCard', x: 8, y: 2, w: 8, h: 2 },
      { i: 'timeSeriesCard', x: 0, y: 4, w: 4, h: 4 },
      { i: 'listCard', x: 4, y: 4, w: 4, h: 4 },
      { i: 'tableCard', x: 4, y: 4, w: 8, h: 4 },
      { i: 'mapCard', x: 4, y: 4, w: 8, h: 4 },
      { i: 'barChartCard', x: 8, y: 8, w: 8, h: 4 },
    ],
    sm: [
      { i: 'card', x: 0, y: 0, w: 2, h: 1 },
      { i: 'valueCard', x: 4, y: 0, w: 4, h: 2 },
      { i: 'gaugeCard', x: 0, y: 0, w: 2, h: 2 },
      { i: 'pieChartCard', x: 2, y: 0, w: 4, h: 2 },
      { i: 'imageCard', x: 8, y: 0, w: 4, h: 2 },
      { i: 'timeSeriesCard', x: 0, y: 0, w: 4, h: 4 },
      { i: 'listCard', x: 0, y: 0, w: 4, h: 4 },
      { i: 'tableCard', x: 4, y: 0, w: 4, h: 4 },
      { i: 'mapCard', x: 4, y: 0, w: 4, h: 4 },
      { i: 'barChartCard', x: 8, y: 0, w: 4, h: 4 },
    ],
    xs: [
      { i: 'card', x: 0, y: 0, w: 4, h: 1 },
      { i: 'valueCard', x: 4, y: 0, w: 4, h: 1 },
      { i: 'gaugeCard', x: 0, y: 0, w: 4, h: 2 },
      { i: 'pieChartCard', x: 2, y: 0, w: 4, h: 2 },
      { i: 'imageCard', x: 8, y: 0, w: 4, h: 2 },
      { i: 'timeSeriesCard', x: 0, y: 0, w: 4, h: 4 },
      { i: 'listCard', x: 0, y: 0, w: 4, h: 4 },
      { i: 'tableCard', x: 4, y: 0, w: 4, h: 4 },
      { i: 'mapCard', x: 4, y: 0, w: 4, h: 4 },
      { i: 'barChartCard', x: 8, y: 0, w: 4, h: 4 },
    ],
  };

  // Set minimum sizes for the cards that requires it
  const minWidthLayouts = {};
  Object.entries(layouts).forEach(([breakpoint, breakpointLayout]) => {
    minWidthLayouts[breakpoint] = breakpointLayout.map((cardLayout) => {
      const cardLayoutCopy = { ...cardLayout };
      switch (cardLayoutCopy.i) {
        case 'pieChartCard':
          cardLayoutCopy.minW = CARD_DIMENSIONS.MEDIUMTHIN.max.w;
          cardLayoutCopy.minH = CARD_DIMENSIONS.MEDIUMTHIN.max.h;
          break;
        case 'barChartCard':
          cardLayoutCopy.minW = CARD_DIMENSIONS.MEDIUMTHIN.max.w;
          cardLayoutCopy.minH = CARD_DIMENSIONS.MEDIUMTHIN.max.h;
          break;
        case 'tableCard':
          cardLayoutCopy.minW = CARD_DIMENSIONS.LARGE.max.w;
          cardLayoutCopy.minH = CARD_DIMENSIONS.LARGE.max.h;
          break;
        case 'mapCard':
          cardLayoutCopy.minW = CARD_DIMENSIONS.MEDIUM.max.w;
          cardLayoutCopy.minH = CARD_DIMENSIONS.MEDIUM.max.h;
          break;
        case 'imageCard':
          cardLayoutCopy.minW = CARD_DIMENSIONS.MEDIUMTHIN.max.w;
          cardLayoutCopy.minH = CARD_DIMENSIONS.MEDIUMTHIN.max.h;
          break;
        default:
          break;
      }
      return cardLayoutCopy;
    });
  });

  return (
    <Fragment>
      <p>
        All cards are resizable by dragging and the card size prop is automatically updated to match
        the new size during the drag process. Some cards have a minimal size defined.
      </p>
      <FullWidthWrapper>
        <DashboardGrid
          {...commonGridProps}
          layouts={minWidthLayouts}
          breakpoint={currentBreakpoint}
          onBreakpointChange={(newBreakpoint) => {
            setCurrentBreakpoint(newBreakpoint);
          }}
          onCardSizeChange={(...[{ id, size }]) => {
            setCurrentSizes((old) => ({ ...old, [id]: size }));
          }}
          onResizeStop={() => {}}
        >
          {CARDS_ALL_SIZES}
        </DashboardGrid>
      </FullWidthWrapper>
    </Fragment>
  );
};
describe('DashboardGrid', () => {
  it('matches image snapshot', () => {
    cy.viewport(1680, 900);
    mount(
      <div data-testid="visual-regression-test" style={{ padding: '3rem' }}>
        <DashboardAllCardsAsResizable />
      </div>
    );

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.findByTestId('visual-regression-test').should('be.visible');
    onlyOn('headless', () => {
      cy.findByTestId('visual-regression-test').compareSnapshot('DashboardGrid');
    });
  });
});
