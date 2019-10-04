import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import Card from './Card';

storiesOf('Watson IoT|Card', module)
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
          onCardAction={action('onCardAction')}
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
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  })
  .add('with range selector', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
          availableActions={{
            range: true,
          }}
        />
      </div>
    );
  })
  .add('is editable', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', true)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
          availableActions={{
            edit: true,
            clone: true,
            delete: true,
          }}
        />
      </div>
    );
  })
  .add('is expandable', () => {
    const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
    return (
      <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
        <Card
          title={text('title', 'Card Title')}
          id="facilitycard-with-loading"
          size={size}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', true)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
          availableActions={{
            expand: true,
          }}
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
          onCardAction={action('onCardAction')}
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
            onCardAction={action('onCardAction')}
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
          isLoading={boolean('isLoading', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
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
          isLoading={boolean('isLoading', false)}
          breakpoint="lg"
          onCardAction={action('onCardAction')}
        />
      </div>
    );
  });
