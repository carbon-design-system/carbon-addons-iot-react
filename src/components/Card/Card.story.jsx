import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, boolean } from '@storybook/addon-knobs';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import Card from './Card';

storiesOf('Card', module)
  .add('basic', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-basic"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          availableActions={{ range: true }}
          onCardAction={(id, type, payload) => console.log('onCardAction', id, type, payload)}
        />
      </div>
    );
  })
  .add('with loading', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', true)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          onCardAction={(id, type, payload) => console.log('onCardAction', id, type, payload)}
        />
      </div>
    );
  })
  .add('with empty state', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-empty"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', true)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          availableActions={{ range: true }}
          onCardAction={(id, type, payload) => console.log('onCardAction', id, type, payload)}
        />
      </div>
    );
  })
  .add('size gallery', () => {
    return Object.keys(CARD_SIZES).map(i => (
      <React.Fragment key={`card-${i}`}>
        <h3>{i}</h3>
        <div style={{ width: `${getCardMinSize('lg', CARD_SIZES[i]).x}px`, margin: 20 }}>
          <Card
            title={text('title', 'Card Title')}
            id={`facilitycard-size-gallery-${i}`}
            size={CARD_SIZES[i]}
            isLoading={boolean('isLoading', false)}
            isEmpty={boolean('isEmpty', true)}
            isEditable={boolean('isEditable', false)}
            isExpanded={boolean('isExpanded', false)}
            breakpoint="lg"
            availableActions={{ range: i !== CARD_SIZES.XSMALL }}
            onCardAction={(id, type, payload) => console.log('onCardAction', id, type, payload)}
          />
        </div>
      </React.Fragment>
    ));
  })
  .add('error', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-error"
          size={size}
          error={text('error', 'API threw Nullpointer')}
          breakpoint="lg"
          onCardAction={(id, type, payload) => console.log('onCardAction', id, type, payload)}
        />
      </div>
    );
  })
  .add('error/small', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-error-small"
          size={size}
          error={text('error', 'API threw Nullpointer')}
          breakpoint="lg"
          onCardAction={(id, type, payload) => console.log('onCardAction', id, type, payload)}
        />
      </div>
    );
  });
