import React, { useState } from 'react';
import uuidv1 from 'uuid/v1';
import { text, boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Button } from 'carbon-components-react';
import moment from 'moment';

import {
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLUMNS,
  CARD_DIMENSIONS,
  ROW_HEIGHT,
  CARD_SIZES,
  CARD_TYPES,
} from '../../constants/LayoutConstants';

import Dashboard from './Dashboard';

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
    content: [{ title: 'Comfort Level', value: 89, unit: '%' }],
  },
  {
    title: 'XSMALL',
    id: 'facilitycard-xs3',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    content: [{ title: 'Comfort Level', value: 89, unit: '%' }],
  },
  {
    title: 'TALL',
    id: 'facilitycard2',
    size: CARD_SIZES.TALL,
    type: CARD_TYPES.VALUE,
    content: [
      { title: 'Comfort Level', value: 89, unit: '%' },
      { title: 'Utilization', value: 76, unit: '%' },
      { title: 'Number of Alerts', value: 17 },
    ],
  },
  {
    title: 'MEDIUM',
    id: 'facilitycard3',
    size: CARD_SIZES.MEDIUM,
    type: CARD_TYPES.TIMESERIES,
    content: {
      data: {
        label: 'Recent Temperature',
        values: [
          {
            t: moment()
              .subtract(5, 'hour')
              .toISOString(),
            v: 73.4,
          },
          {
            t: moment()
              .subtract(4, 'hour')
              .toISOString(),
            v: 78.3,
          },
          {
            t: moment()
              .subtract(3, 'hour')
              .toISOString(),
            v: 71.2,
          },
          {
            t: moment()
              .subtract(1, 'hour')
              .toISOString(),
            v: 70.9,
          },
          { t: moment().toISOString(), v: 72.4 },
        ],
      },
    },
  },
  {
    title: 'MEDIUM',
    id: 'facilitycard4',
    size: CARD_SIZES.MEDIUM,
    type: CARD_TYPES.VALUE,
    content: [
      { title: 'Comfort Level', value: 89, unit: '%' },
      { title: 'Utilization', value: 76, unit: '%' },
      { title: 'Number of Alerts', value: 17 },
    ],
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
    title: 'XLARGE',
    id: 'xlarge-timeseries-pressure',
    size: CARD_SIZES.XLARGE,
    type: CARD_TYPES.TIMESERIES,
    content: {
      data: {
        label: 'Recent Pressure',
        values: [
          {
            t: moment()
              .subtract(8, 'hour')
              .toISOString(),
            v: 53.4,
          },
          {
            t: moment()
              .subtract(7, 'hour')
              .toISOString(),
            v: 57.3,
          },
          {
            t: moment()
              .subtract(6, 'hour')
              .toISOString(),
            v: 49.2,
          },
          {
            t: moment()
              .subtract(5, 'hour')
              .toISOString(),
            v: 49.3,
          },
          {
            t: moment()
              .subtract(4, 'hour')
              .toISOString(),
            v: 48.3,
          },
          {
            t: moment()
              .subtract(3, 'hour')
              .toISOString(),
            v: 48.4,
          },
          {
            t: moment()
              .subtract(2, 'hour')
              .toISOString(),
            v: 62.3,
          },
          {
            t: moment()
              .subtract(1, 'hour')
              .toISOString(),
            v: 62.5,
          },
          { t: moment().toISOString(), v: 63.1 },
        ],
      },
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

  const handleCardAction = (id, type, payload) => {
    if (type === 'CARD_SIZE_CHANGED') {
      const cardIndex = cards.findIndex(card => card.id === id);
      const updatedCards = [...cards];
      updatedCards.splice(cardIndex, 1, {
        ...updatedCards[cardIndex],
        title: payload.size,
        size: payload.size,
      });
      setCards(updatedCards);
    }
  };

  return (
    <div>
      <Button style={{ margin: '20px 0 0 20px' }} onClick={handleAdd}>
        Add card
      </Button>
      <Dashboard cards={cards} onCardAction={handleCardAction} {...props} />
    </div>
  );
};

storiesOf('Dashboard (Experimental)', module)
  .add('basic - 12 col', () => {
    return (
      <StatefulDashboard
        title={text('title', 'Munich Building')}
        isEditable={boolean('isEditable', true)}
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
        isEditable={boolean('isEditable', true)}
        dashboardBreakpoints={object('breakpoints', DASHBOARD_BREAKPOINTS_16_COL)}
        dashboardColumns={object('columns', DASHBOARD_COLUMNS_16_COL)}
        cardDimensions={object('card dimensions', CARD_DIMENSIONS_16_COL)}
        rowHeight={object('row height', ROW_HEIGHT)}
      />
    );
  });
