import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select } from '@storybook/addon-knobs';

import { CARD_SIZES, getCardMinSize } from '../../constants/LayoutConstants';

import Card from './Card';

storiesOf('Card (Experimental)', module).add('card props', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.SMALL);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <Card
        title={text('title', 'Card Title')}
        id="facilitycard"
        size={select('size', Object.values(CARD_SIZES), CARD_SIZES.MEDIUM)}
        breakpoint="lg"
        onCardAction={(id, type, payload) => console.log('onCardAction', id, type, payload)}
      />
    </div>
  );
});
