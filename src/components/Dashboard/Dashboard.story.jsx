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

import { chartData } from '../../utils/sample';
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
    content: [
      { title: 'Comfort Level', value: 89, unit: '%' },
      { title: 'Utilization', value: 76, unit: '%' },
      { title: 'Number of Alerts', value: 17 },
    ],
  },
  {
    title: 'XSMALL',
    id: 'facilitycard-xs',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    content: [{ title: 'Comfort Level', value: 89, unit: '%' }],
  },
  {
    title: 'XSMALL',
    id: 'facilitycard-xs2',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    content: [{ title: 'Utilization', value: 76, unit: '%' }],
  },
  {
    title: 'XSMALL',
    id: 'facilitycard-xs3',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    content: [{ title: 'Alert Count', value: 17 }],
  },
  {
    title: 'Alerts (Section 2)',
    id: 'facilitycard-pie',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.PIE,
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
    title: 'TALL',
    id: 'facilitycard2',
    size: CARD_SIZES.TALL,
    type: CARD_TYPES.VALUE,
    content: [
      { title: 'Comfort Level', value: 89, unit: '%' },
      { title: 'Utilization', value: 76, unit: '%' },
      { title: 'Humidity', value: 46, unit: '%' },
      { title: 'Pressure', value: 21.4, unit: 'mb' },
      { title: 'Number of Alerts', value: 17 },
    ],
  },
  {
    title: 'Atmospheric Conditions (Section 2)',
    id: 'facilitycard3',
    size: CARD_SIZES.MEDIUM,
    type: CARD_TYPES.TIMESERIES,
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
    title: 'WIDE',
    id: 'facilitycard5',
    size: CARD_SIZES.WIDE,
    type: CARD_TYPES.VALUE,
    content: [
      { title: 'Comfort Level', value: 89, unit: '%' },
      { title: 'Utilization', value: 76, unit: '%' },
      { title: 'Heat', value: 1976, unit: 'K' },
      { title: 'Number of Alerts', value: 17 },
    ],
  },
  {
    title: 'Atmospheric Conditions (Section 1)',
    id: 'xlarge-timeseries-pressure',
    size: CARD_SIZES.XLARGE,
    type: CARD_TYPES.TIMESERIES,
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
  {
    title: 'LARGE',
    id: 'facilitycard6',
    size: CARD_SIZES.LARGE,
    type: CARD_TYPES.VALUE,
    content: [
      { title: 'Comfort Level', value: 89, unit: '%' },
      { title: 'Utilization', value: 76, unit: '%' },
      { title: 'Number of Alerts', value: 17 },
    ],
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
    lg: { w: 4, h: 1 },
    md: { w: 2, h: 1 },
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

  const handleCardAction = (id, type /* payload */) => {
    if (type === 'DELETE_CARD') {
      setCards(cards.filter(i => i.id !== id));
    }
    if (type === 'OPEN_EXPANDED_CARD') {
      const cardIndex = cards.findIndex(card => card.id === id);
      const updatedCards = [...cards];
      updatedCards.splice(cardIndex, 1, {
        ...updatedCards[cardIndex],
        isExpanded: true,
      });
      setCards(updatedCards);
    }
    if (type === 'CLOSE_EXPANDED_CARD') {
      const cardIndex = cards.findIndex(card => card.id === id);
      const updatedCards = [...cards];
      updatedCards.splice(cardIndex, 1, {
        ...updatedCards[cardIndex],
        isExpanded: false,
      });
      setCards(updatedCards);
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
        dashboardBreakpoints={object('breakpoints', DASHBOARD_BREAKPOINTS_16_COL)}
        dashboardColumns={object('columns', DASHBOARD_COLUMNS_16_COL)}
        cardDimensions={object('card dimensions', CARD_DIMENSIONS_16_COL)}
        rowHeight={object('row height', ROW_HEIGHT)}
      />
    );
  });
