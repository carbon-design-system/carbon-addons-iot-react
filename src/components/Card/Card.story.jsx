import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, boolean } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import Card from './Card';

storiesOf('Card (Experimental)', module).add('card props', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <Card
        title={text('title', 'Card Title')}
        id="facilitycard"
        size={size}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpanded', false)}
        breakpoint="lg"
        onCardAction={(id, type, payload) => console.log('onCardAction', id, type, payload)}
      />
    </div>
  );
});
