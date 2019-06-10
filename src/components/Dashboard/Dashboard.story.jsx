import React, { useState } from 'react';
/*
import uuidv1 from 'uuid/v1';
*/
import { text, boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
/*
import { Button } from 'carbon-components-react';
import moment from 'moment';
*/

import { chartData, tableColumns, tableData } from '../../utils/sample';
import {
  COLORS,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLUMNS,
  CARD_DIMENSIONS,
  ROW_HEIGHT,
  CARD_SIZES,
  CARD_TYPES,
} from '../../constants/LayoutConstants';

import Dashboard from './Dashboard';

const timeOffset = new Date().getTime() - chartData.dataItemToMostRecentTimestamp.temperature;

const originalCards = [
  {
    title: 'SMALL',
    id: 'facilitycard',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      { title: 'Comfort Level', value: 89, unit: '%' },
      { title: 'Utilization', value: 76, unit: '%' },
      { title: 'Pressure', value: 21.4, unit: 'mb' },
    ],
  },
  {
    title: 'Humidity',
    id: 'facilitycard-xs',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        value: 62.1,
        unit: '%',
        thresholds: [
          { comparison: '<', value: '40', color: 'red' },
          { comparison: '<', value: '70', color: 'green' },
          { comparison: '>=', value: '70', color: 'red' },
        ],
      },
    ],
  },
  {
    title: 'Utilization',
    id: 'facilitycard-xs2',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [{ value: 76, title: 'Average', unit: '%' }],
  },
  {
    title: 'Alert Count',
    id: 'facilitycard-xs3',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        title: 'weekly',
        value: 35,
        secondaryValue: { value: 13, trend: 'up', color: 'green' },
      },
    ],
  },
  {
    title: 'Comfort Level',
    id: 'facilitycard-comfort-level',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        value: 'Bad',
        thresholds: [
          { comparison: '=', value: 'Good', icon: 'icon--checkmark--solid', color: 'green' },
          { comparison: '=', value: 'Bad', icon: 'icon--close--solid', color: 'red' },
        ],
      },
    ],
  },
  {
    title: 'Alerts (Section 2)',
    tooltip: 'This view showcases the variety of alert severities present in your context.',
    id: 'facilitycard-pie',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.PIE,
    availableActions: {
      delete: true,
    },
    content: {
      title: 'Alerts',
      data: [
        { label: 'Sev 3', value: 2, color: COLORS.RED },
        { label: 'Sev 2', value: 7, color: COLORS.YELLOW },
        { label: 'Sev 1', value: 32, color: COLORS.BLUE },
      ],
    },
  },
  {
    title: 'Foot Traffic',
    id: 'facilitycard-xs4',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        title: 'weekly',
        value: 13572,
        secondaryValue: { value: '22%', trend: 'down', color: 'red' },
      },
    ],
  },
  {
    title: 'Health',
    id: 'facilitycard-health',
    size: CARD_SIZES.XSMALL_WIDE,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        value: 'Healthy',
        thresholds: [
          { comparison: '=', value: 'Healthy', icon: 'icon--checkmark--solid', color: 'green' },
          { comparison: '=', value: 'Unhealthy', icon: 'icon--close--solid', color: 'red' },
        ],
      },
    ],
  },
  {
    title: 'Alerts',
    id: 'alert-table1',
    size: CARD_SIZES.LARGE,
    type: CARD_TYPES.TABLE,
    availableActions: {
      expand: true,
    },
    content: {
      data: tableData,
      columns: tableColumns,
    },
  },
  {
    title: 'Atmospheric Conditions (Section 2)',
    id: 'facilitycard3',
    size: CARD_SIZES.MEDIUM,
    type: CARD_TYPES.TIMESERIES,
    availableActions: {
      delete: true,
      expand: true,
    },
    content: {
      data: [
        {
          label: 'Temperature',
          values: chartData.events
            .filter((i, idx) => idx < 15)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.temperature,
            })),
          color: COLORS.RED,
        },
        {
          label: 'Pressure',
          values: chartData.events
            .filter((i, idx) => idx < 10)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.pressure,
            })),
          color: COLORS.BLUE,
        },
      ],
    },
  },
  {
    title: 'Alerts (Weekly)',
    id: 'xlarge-bar-alerts',
    size: CARD_SIZES.LARGE,
    type: CARD_TYPES.BAR,
    availableActions: {
      delete: true,
      expand: true,
    },
    content: {
      data: [
        {
          label: 'Sev 1',
          values: chartData.events
            .filter((i, idx) => idx < 7)
            .map(i => ({
              x: new Date(i.timestamp + timeOffset).toISOString(),
              y: Math.ceil(i.pressure / 10),
            })),
          color: COLORS.BLUE,
        },
        {
          label: 'Sev 2',
          values: chartData.events
            .filter((i, idx) => idx < 7)
            .map(i => ({
              x: new Date(i.timestamp + timeOffset).toISOString(),
              y: Math.ceil(i.humidity / 10),
            })),
          color: COLORS.YELLOW,
        },
        {
          label: 'Sev 3',
          values: chartData.events
            .filter((i, idx) => idx < 7)
            .map(i => ({
              x: new Date(i.timestamp + timeOffset).toISOString(),
              y: Math.ceil(i.temperature / 10),
            })),
          color: COLORS.RED,
        },
      ],
    },
  },
  {
    title: 'Alerts (Section 1)',
    id: 'facilitycard-donut',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.DONUT,
    availableActions: {
      delete: true,
    },
    content: {
      title: 'Alerts',
      data: [
        { label: 'Sev 3', value: 6, color: COLORS.RED },
        { label: 'Sev 2', value: 9, color: COLORS.YELLOW },
        { label: 'Sev 1', value: 18, color: COLORS.BLUE },
      ],
    },
  },
  {
    title: 'Atmospheric Conditions (Section 1)',
    id: 'xlarge-timeseries-pressure',
    size: CARD_SIZES.XLARGE,
    type: CARD_TYPES.TIMESERIES,
    availableActions: {
      delete: true,
      expand: true,
    },
    content: {
      data: [
        {
          label: 'Temperature',
          values: chartData.events
            .filter((i, idx) => idx < 15)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.temperature,
            })),
          color: COLORS.RED,
        },
        {
          label: 'Pressure',
          values: chartData.events
            .filter((i, idx) => idx < 10)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.pressure,
            })),
          color: COLORS.BLUE,
        },
        {
          label: 'Humidity',
          values: chartData.events
            .filter((i, idx) => idx < 13)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.humidity,
            })),
          color: COLORS.YELLOW,
        },
      ],
    },
  },
];

export const DASHBOARD_SIZES_16_COL = {
  MAX: 'max',
  XLARGE: 'xl',
  LARGE: 'lg',
  MEDIUM: 'md',
  SMALL: 'sm',
  XSMALL: 'xs',
};

export const DASHBOARD_COLUMNS_16_COL = {
  max: 16,
  xl: 16,
  lg: 16,
  md: 8,
  sm: 4,
  xs: 4,
};

export const DASHBOARD_BREAKPOINTS_16_COL = {
  max: 1800,
  xl: 1312,
  lg: 1056,
  md: 672,
  sm: 480,
  xs: 320,
};

const CARD_DIMENSIONS_16_COL = {
  XSMALL: {
    max: { w: 2, h: 1 },
    xl: { w: 2, h: 1 },
    lg: { w: 2, h: 1 },
    md: { w: 2, h: 1 },
    sm: { w: 2, h: 1 },
    xs: { w: 2, h: 1 },
  },
  XSMALL_WIDE: {
    max: { w: 3, h: 1 },
    xl: { w: 4, h: 1 },
    lg: { w: 4, h: 1 },
    md: { w: 4, h: 1 },
    sm: { w: 2, h: 1 },
    xs: { w: 4, h: 1 },
  },
  SMALL: {
    max: { w: 2, h: 2 },
    xl: { w: 4, h: 2 },
    lg: { w: 4, h: 2 },
    md: { w: 4, h: 2 },
    sm: { w: 2, h: 2 },
    xs: { w: 4, h: 2 },
  },
  TALL: {
    max: { w: 2, h: 4 },
    xl: { w: 4, h: 4 },
    lg: { w: 4, h: 4 },
    md: { w: 4, h: 4 },
    sm: { w: 2, h: 4 },
    xs: { w: 4, h: 4 },
  },
  MEDIUM: {
    max: { w: 6, h: 2 },
    xl: { w: 8, h: 2 },
    lg: { w: 8, h: 2 },
    md: { w: 8, h: 2 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 2 },
  },
  WIDE: {
    max: { w: 8, h: 2 },
    xl: { w: 8, h: 2 },
    lg: { w: 12, h: 2 },
    md: { w: 8, h: 2 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 2 },
  },
  LARGE: {
    max: { w: 6, h: 4 },
    xl: { w: 8, h: 4 },
    lg: { w: 8, h: 4 },
    md: { w: 8, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
  XLARGE: {
    max: { w: 8, h: 4 },
    xl: { w: 12, h: 4 },
    lg: { w: 16, h: 4 },
    md: { w: 8, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
};

const StatefulDashboard = ({ ...props }) => {
  const [cards, setCards] = useState(originalCards);

  /*
  const handleAdd = () => {
    setCards([
      ...cards,
      {
        title: 'SMALL', // faker.company.companyName(),
        id: uuidv1(),
        size: CARD_SIZES.SMALL,
        type: CARD_TYPES.VALUE,
        content: [
          { title: 'Comfort Level', value: 89, unit: '%' },
          { title: 'Utilization', value: 76, unit: '%' },
          { title: 'Number of Alerts', value: 17 },
        ],
      },
    ]);
  };
  */

  const handleCardAction = (id, type, payload) => {
    console.log(id, type, payload);
    if (type === 'DELETE_CARD') {
      setCards(cards.filter(i => i.id !== id));
    }
    if (type === 'OPEN_EXPANDED_CARD') {
      setCards(cards.map(i => (i.id === id ? { ...i, isExpanded: true } : i)));
    }
    if (type === 'CLOSE_EXPANDED_CARD') {
      setCards(cards.map(i => (i.id === id ? { ...i, isExpanded: false } : i)));
    }
    if (type === 'TABLE_CARD_ROW_ACTION') {
      console.log(id, type, payload);
    }
  };

  /*
  return (
    <div>
      <Button style={{ margin: '20px 0 0 20px' }} onClick={handleAdd}>
        Add card
      </Button>
      <Dashboard cards={cards} onCardAction={handleCardAction} {...props} />
    </div>
  );
  */
  return <Dashboard cards={cards} onCardAction={handleCardAction} {...props} />;
};

storiesOf('Dashboard (Experimental)', module)
  .add('basic - 12 col', () => {
    return (
      <StatefulDashboard
        title={text('title', 'Munich Building')}
        isEditable={boolean('isEditable', false)}
        isLoading={boolean('isLoading', false)}
        dashboardBreakpoints={object('breakpoints', DASHBOARD_BREAKPOINTS)}
        dashboardColumns={object('columns', DASHBOARD_COLUMNS)}
        cardDimensions={object('card dimensions', CARD_DIMENSIONS)}
        rowHeight={object('row height', ROW_HEIGHT)}
      />
    );
  })
  .add('basic - 16 col', () => {
    return (
      <StatefulDashboard
        title={text('title', 'Munich Building')}
        isEditable={boolean('isEditable', false)}
        isLoading={boolean('isLoading', false)}
        dashboardBreakpoints={object('breakpoints', DASHBOARD_BREAKPOINTS_16_COL)}
        dashboardColumns={object('columns', DASHBOARD_COLUMNS_16_COL)}
        cardDimensions={object('card dimensions', CARD_DIMENSIONS_16_COL)}
        rowHeight={object('row height', ROW_HEIGHT)}
      />
    );
  })
  .add('loading', () => {
    return (
      <StatefulDashboard
        title={text('title', 'Munich Building')}
        isEditable={boolean('isEditable', false)}
        isLoading={boolean('isLoading', true)}
        dashboardBreakpoints={object('breakpoints', DASHBOARD_BREAKPOINTS)}
        dashboardColumns={object('columns', DASHBOARD_COLUMNS)}
        cardDimensions={object('card dimensions', CARD_DIMENSIONS)}
        rowHeight={object('row height', ROW_HEIGHT)}
      />
    );
  });
