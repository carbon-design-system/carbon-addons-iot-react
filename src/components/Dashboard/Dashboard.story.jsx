import React, { useState } from 'react';
import uuidv1 from 'uuid/v1';
import { text, boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Button } from 'carbon-components-react';

import {
  DASHBOARD_BREAKPOINTS,
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
    type: CARD_TYPES.VALUE,
    content: [
      { title: 'Comfort Level', value: 89, unit: '%' },
      { title: 'Utilization', value: 76, unit: '%' },
      { title: 'Number of Alerts', value: 17 },
    ],
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

storiesOf('Dashboard (Experimental)', module).add('basic', () => {
  return (
    <StatefulDashboard
      title={text('title', 'Munich Building')}
      isEditable={boolean('isEditable', true)}
      dashboardBreakpoints={object('breakpoints', DASHBOARD_BREAKPOINTS)}
      cardDimensions={object('card dimensions', CARD_DIMENSIONS)}
      rowHeight={object('row height', ROW_HEIGHT)}
    />
  );
});
