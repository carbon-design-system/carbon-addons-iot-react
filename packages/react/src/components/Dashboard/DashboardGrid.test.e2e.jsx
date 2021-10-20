import React, { Fragment, useState } from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';
import omit from 'lodash/omit';
import { Bee16, Close16 } from '@carbon/icons-react';
import PropTypes from 'prop-types';

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
import landscape from '../ImageCard/landscape.jpg';

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

const DashboardAllCardsAsResizable = ({ breakpoint }) => {
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

  const isResizable = true;
  const CARDS_ALL_SIZES = [
    ...Object.values(CARD_SIZES).map((size) => (
      <Card
        title={`Card - ${size}`}
        id={`card-${size}`}
        isResizable={isResizable}
        key={`card-${size}`}
        size={size}
        availableActions={{
          delete: true,
        }}
        breakpoint={breakpoint}
      >
        <p>This is a basic card</p>
      </Card>
    )),
    ...Object.values(CARD_SIZES).map((size) => (
      <ValueCard
        title={`ValueCard - ${size}`}
        id={`valueCard-${size}`}
        key={`valueCard-${size}`}
        size={size}
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
        breakpoint={breakpoint}
      />
    )),
    <ValueCard
      title="ValueCard - Truncation"
      id="valueCard-truncation"
      key="valueCard-truncation"
      size={CARD_SIZES.SMALL}
      isResizable={isResizable}
      content={{
        attributes: [
          {
            label: 'Tagpath',
            dataSourceId: 'footTraffic',
          },
        ],
      }}
      values={{
        footTraffic:
          'rutherford/rooms/northadd/ah2/ft_supflow/eurutherford/rooms/northadd/ah2/ft_supflow/eu',
      }}
      breakpoint={breakpoint}
    />,
    <ValueCard
      title={`ValueCard - Trends and {a-variable}`}
      id="valueCard-Trends-and-Variables"
      key="valueCard-Trends-and-Variables"
      cardVariables={{ 'a-variable': 'working' }}
      size={CARD_SIZES.SMALL}
      isResizable={isResizable}
      breakpoint={breakpoint}
      content={{
        attributes: [
          {
            dataSourceId: 'footTraffic',
            label: 'Walkers',
            secondaryValue: {
              dataSourceId: 'trend',
              trend: 'down',
              color: 'red',
            },
          },
        ],
      }}
      values={{
        footTraffic: 13572,
        trend: '22%',
      }}
    />,
    <ValueCard
      title="ValueCard - Thresholds"
      id="valueCard-Thresholds"
      key="valueCard-Thresholds"
      size={CARD_SIZES.SMALL}
      isResizable={isResizable}
      breakpoint={breakpoint}
      renderIconByName={(name, theProps = {}) =>
        name === 'bee' ? (
          <Bee16 {...theProps}>
            <title>{theProps.title}</title>
          </Bee16>
        ) : (
          <span>Unknown</span>
        )
      }
      content={{
        attributes: [
          {
            dataSourceId: 'alertCount',
            thresholds: [
              {
                comparison: '>',
                value: 5,
                icon: 'bee',
                color: 'green',
              },
            ],
          },
        ],
      }}
      values={{ alertCount: 70 }}
    />,
    <ValueCard
      title="ValueCard - String Thresholds"
      id="valueCard-String Thresholds"
      key="valueCard-String Thresholds"
      size={CARD_SIZES.SMALL}
      isResizable={isResizable}
      breakpoint={breakpoint}
      renderIconByName={(name, theProps = {}) =>
        name === 'close' ? (
          <Close16 {...theProps}>
            <title>{theProps.title}</title>
          </Close16>
        ) : (
          <span>Unknown</span>
        )
      }
      content={{
        attributes: [
          {
            dataSourceId: 'status',
            thresholds: [
              {
                comparison: '=',
                value: 'Healthy',
                icon: 'checkmark',
                color: 'green',
              },
              {
                comparison: '=',
                value: 'Unhealthy',
                icon: 'close',
                color: 'red',
              },
            ],
          },
        ],
      }}
      values={{ status: 'Unhealthy' }}
    />,
    <ValueCard
      title="ValueCard - Multiple Data Points and Thresholds"
      key="ValueCard - Multiple Data Points and Thresholds"
      id="ValueCard - Multiple Data Points and Thresholds"
      breakpoint={breakpoint}
      content={{
        attributes: [
          {
            label: 'Comfort Level',
            dataSourceId: 'comfortLevel',
            unit: '%',
            thresholds: [
              {
                comparison: '>',
                value: 80,
                color: '#F00',
                icon: 'warning',
              },
              {
                comparison: '<',
                value: 80,
                color: '#5aa700',
                icon: 'checkmark',
              },
            ],
          },
          {
            label: 'Average Temperature',
            dataSourceId: 'averageTemp',
            unit: '˚F',
            precision: 1,
            thresholds: [
              {
                comparison: '>',
                value: 80,
                color: '#F00',
                icon: 'warning',
              },
              {
                comparison: '<',
                value: 80,
                color: '#5aa700',
                icon: 'checkmark',
              },
            ],
          },
          {
            label: 'Air Flow',
            dataSourceId: 'airflow',
            precision: 4,
            thresholds: [
              {
                comparison: '>',
                value: 80,
                color: '#F00',
                icon: 'warning',
              },
              {
                comparison: '<',
                value: 80,
                color: '#5aa700',
                icon: 'checkmark',
              },
            ],
          },
          {
            label: 'Humidity',
            dataSourceId: 'humidity',
            unit: '˚F',
            precision: 0,
            thresholds: [
              {
                comparison: '>',
                value: 80,
                color: '#F00',
                icon: 'warning',
              },
              {
                comparison: '<',
                value: 80,
                color: '#5aa700',
                icon: 'checkmark',
              },
            ],
          },
        ],
      }}
      size={CARD_SIZES.LARGETHIN}
      values={{
        comfortLevel: 345678234234234234,
        averageTemp: 456778234234234234,
        humidity: 50,
        airflow: 10000.4569,
      }}
      isNumberValueCompact={false}
      locale="fr"
      fontSize={42}
      onAttributeClick={() => {}}
    />,
    <ValueCard
      title="ValueCard - Horizontal Card with onAttributeClick and Two"
      key="ValueCard - Horizontal Card with onAttributeClick and Two"
      id="ValueCard - Horizontal Card with onAttributeClick and Two"
      content={{
        attributes: [
          {
            label: 'Device 1 Comfort',
            dataSourceId: 'comfortLevel',
            unit: '%',
            dataFilter: { deviceid: '73000' },
          },
          {
            label: 'Device 2 Comfort',
            dataSourceId: 'comfortLevel',
            unit: '%',
            dataFilter: { deviceid: '73001' },
          },
        ],
      }}
      breakpoint={breakpoint}
      size={CARD_SIZES.MEDIUMWIDE}
      values={[
        { deviceid: '73000', comfortLevel: '100', unit: '%' },
        { deviceid: '73001', comfortLevel: '50', unit: '%' },
      ]}
      fontSize={42}
      onAttributeClick={() => {}}
    />,
    ...Object.values(CARD_SIZES).map((size) => (
      <GaugeCard
        id={`gaugeCard-${size}`}
        key={`gaugeCard-${size}`}
        isResizable={isResizable}
        size={size}
        title={`GaugeCard - ${size}`}
        content={gaugeCardContent}
        tooltip={<p>Health - of floor 8</p>}
        breakpoint={breakpoint}
        values={{
          usage: 81,
          usageTrend: '12%',
        }}
      />
    )),
    ...Object.values(omit(CARD_SIZES, 'SMALL', 'SMALLWIDE', 'SMALLFULL')).map((size) => (
      <PieChartCard
        content={{
          groupDataSourceId: 'category',
          legendPosition: 'bottom',
        }}
        title={`PieChartCard - ${size}`}
        key={`pieChartCard-${size}`}
        id={`pieChartCard-${size}`}
        size={size}
        isResizable={isResizable}
        values={pieChartCardValues}
        breakpoint={breakpoint}
      />
    )),
    ...Object.values(omit(CARD_SIZES, 'SMALL', 'SMALLWIDE', 'SMALLFULL')).map((size) => (
      <MapboxExample
        isResizable={isResizable}
        id={`mapCard-${size}`}
        key={`mapCard-${size}`}
        title={`MapCard - ${size}`}
        size={size}
      />
    )),
    ...Object.values(omit(CARD_SIZES, 'SMALL', 'SMALLWIDE', 'SMALLFULL')).map((size) => (
      <TableCard
        title={`TableCard - ${size}`}
        id={`tableCard-${size}`}
        key={`tableCard-${size}`}
        content={{
          columns: tableColumns,
        }}
        values={tableData}
        onCardAction={() => {}}
        size={size}
        isResizable={isResizable}
        breakpoint={breakpoint}
      />
    )),
    ...Object.values(omit(CARD_SIZES, 'SMALL', 'SMALLWIDE', 'SMALLFULL', 'LARGETHIN')).map(
      (size) => (
        <ImageCard
          title={`ImageCard - ${size}`}
          id={`imageCard-${size}`}
          isResizable={isResizable}
          key={`imageCard-${size}`}
          size={size}
          content={{
            alt: 'Sample image',
            src: landscape,
            zoomMax: 10,
          }}
          values={imageCardValues}
          breakpoint={breakpoint}
        />
      )
    ),
    ...Object.values(omit(CARD_SIZES, 'SMALL', 'SMALLWIDE', 'SMALLFULL')).map((size) => (
      <TimeSeriesCard
        id={`timeSeriesCard-${size}`}
        isResizable={isResizable}
        size={size}
        title={`TimeSeriesCard - ${size}`}
        chartType="LINE"
        content={timeSeriesCardContent}
        key={`timeSeriesCard-${size}`}
        interval="hour"
        values={chartData.events.slice(0, 5)}
        breakpoint={breakpoint}
      />
    )),
    ...Object.values(omit(CARD_SIZES, 'SMALL', 'SMALLWIDE', 'SMALLFULL')).map((size) => (
      <ListCard
        id={`listCard-${size}`}
        isResizable={isResizable}
        key={`listCard-${size}`}
        title={`ListCard - ${size}`}
        size={size}
        data={listCardData}
        hasMoreData={false}
        loadData={() => {}}
        breakpoint={breakpoint}
      />
    )),
    ...Object.values(omit(CARD_SIZES, 'SMALL', 'SMALLWIDE', 'SMALLFULL')).map((size) => (
      <BarChartCard
        id={`barChartCard-${size}`}
        key={`barChartCard-${size}`}
        size={size}
        isResizable={isResizable}
        title={`BarChartCard - ${size}`}
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
        breakpoint={breakpoint}
      />
    )),
  ];

  return (
    <Fragment>
      <p>
        All cards are resizable by dragging and the card size prop is automatically updated to match
        the new size during the drag process. Some cards have a minimal size defined.
      </p>
      <FullWidthWrapper>
        <DashboardGrid {...commonGridProps} breakpoint="lg">
          {CARDS_ALL_SIZES}
        </DashboardGrid>
      </FullWidthWrapper>
    </Fragment>
  );
};

DashboardAllCardsAsResizable.propTypes = {
  breakpoint: PropTypes.oneOf(['max', 'xl', 'lg', 'md', 'sm', 'xs']).isRequired,
};

describe('DashboardGrid', () => {
  it('matches image snapshot - max', () => {
    cy.viewport(1680, 900);
    mount(
      <div data-testid="visual-regression-test" style={{ padding: '3rem' }}>
        <DashboardAllCardsAsResizable breakpoint="max" />
      </div>
    );

    cy.findByTestId('visual-regression-test').should('be.visible');
    onlyOn('headless', () => {
      cy.findByTestId('visual-regression-test').compareSnapshot('DashboardGrid');
    });
  });

  it('matches image snapshot - xl', () => {
    cy.viewport(1300, 900);
    mount(
      <div data-testid="visual-regression-test" style={{ padding: '3rem' }}>
        <DashboardAllCardsAsResizable breakpoint="xl" />
      </div>
    );

    cy.findByTestId('visual-regression-test').should('be.visible');
    onlyOn('headless', () => {
      cy.findByTestId('visual-regression-test').compareSnapshot('DashboardGrid');
    });
  });

  it('matches image snapshot - lg', () => {
    cy.viewport(1024, 900);
    mount(
      <div data-testid="visual-regression-test" style={{ padding: '3rem' }}>
        <DashboardAllCardsAsResizable breakpoint="lg" />
      </div>
    );

    cy.findByTestId('visual-regression-test').should('be.visible');
    onlyOn('headless', () => {
      cy.findByTestId('visual-regression-test').compareSnapshot('DashboardGrid');
    });
  });

  it('matches image snapshot - md', () => {
    cy.viewport(658, 900);
    mount(
      <div data-testid="visual-regression-test" style={{ padding: '3rem' }}>
        <DashboardAllCardsAsResizable breakpoint="md" />
      </div>
    );

    cy.findByTestId('visual-regression-test').should('be.visible');
    onlyOn('headless', () => {
      cy.findByTestId('visual-regression-test').compareSnapshot('DashboardGrid');
    });
  });

  it('matches image snapshot - sm', () => {
    cy.viewport(470, 900);
    mount(
      <div data-testid="visual-regression-test" style={{ padding: '3rem' }}>
        <DashboardAllCardsAsResizable breakpoint="sm" />
      </div>
    );

    cy.findByTestId('visual-regression-test').should('be.visible');
    onlyOn('headless', () => {
      cy.findByTestId('visual-regression-test').compareSnapshot('DashboardGrid');
    });
  });

  it('matches image snapshot - xs', () => {
    cy.viewport(300, 900);
    mount(
      <div data-testid="visual-regression-test" style={{ padding: '3rem' }}>
        <DashboardAllCardsAsResizable breakpoint="xs" />
      </div>
    );

    cy.findByTestId('visual-regression-test').should('be.visible');
    onlyOn('headless', () => {
      cy.findByTestId('visual-regression-test').compareSnapshot('DashboardGrid');
    });
  });
});
