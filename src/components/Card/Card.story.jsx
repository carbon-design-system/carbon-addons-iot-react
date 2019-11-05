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
          availableActions={{ range: true, expand: true }}
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
  })
  .add(
    'implementing a custom card',
    () => {
      const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.XSMALL);
      const SampleCustomCard = ({ values, isEditable, ...others }) => (
        <Card {...others}>{!isEditable ? JSON.stringify(values) : 'Fake Sample Data'}</Card>
      );

      return (
        <SampleCustomCard
          title={text('title', 'Card Title')}
          id={text('title', 'Card Title')}
          size={size}
          isEditable={boolean('isEditable', false)}
          values={[{ timestamp: 12341231231, value1: 'my value' }]}
        />
      );
    },
    {
      inline: true,
      source: true,
      info: {
        text: `
      To develop a custom card component.
       - Create a new card component that uses the base Card component
       - See the simple SampleCustomCard in the source code of this story for an example
       - (Optionally, if you want to use the card in a Dashboard) Extend the Card Renderer so the Dashboard knows how to render your card type
       - (Optionally, if you want to use the card in a Dashboard) Create a validator for this card type within "utils/schemas/validators" and add it to the validateDashboardJSON function used to validate dashboards on import.
       
       ## Data flow for a card in the dashboard
       All data loading for a card goes through the dashboard's onFetchData function.  There are two ways to trigger a refetch of data for a card.  The first is to directly interact
       with the Card's range controls.  The second is for the Dashboard to trigger that all of the cards need a reload by updating it's isLoading bit.  The CardRenderer component will call the onSetupCard function of the dashboard first
       for each card (if it exists), then will call the onFetchData function for the dashboard.  
       `,
      },
    }
  );
